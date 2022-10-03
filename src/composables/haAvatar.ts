import { ref } from 'vue'

import { useMainStore } from '@/stores/mainStore'
import { useConnStore } from '@/stores/connStore'
import { db } from '@/db'
import hal from '@/common/halogger'

export function useHAAvatar() {

    const mainStore = useMainStore()
    const connStore = useConnStore()
    const avatarImageUrlPrefix = mainStore.devCORSWorkaroundUrlPrefix + 'https://avatar-cdn.halloapp.net/'

    async function getAvatar(userID: number, avatarID?: string) {
        const avatarArr = await db.avatar.where('userID').equals(userID).toArray()
        const dbAvatar = avatarArr[0]
    
        let avatarImgBlob: Blob

        if (avatarArr.length > 0 && dbAvatar.avatarID == avatarID && dbAvatar.image) {
            // return avatarImgBlob = new Blob( [ dbAvatar.image ], { type: 'image/jpeg' } )
            return dbAvatar.image
        }

        const avatarImageUrl = ref('')

        if (avatarID) {
            avatarImageUrl.value = avatarImageUrlPrefix + avatarID
        } else if (dbAvatar && dbAvatar.avatarID) {
            avatarImageUrl.value = avatarImageUrlPrefix + dbAvatar.avatarID
        }

        if (avatarImageUrl.value == '') {
            return undefined
        }
    
        const request = new Request(avatarImageUrl.value)
        const response = await fetch(request)
        avatarImgBlob = await response.blob()

        // todo: need to check if response and/or blob is valid or not before storing it
        try {
            const id = await db.avatar.put({
                userID: userID,
                avatarID: avatarID,
                image: avatarImgBlob,
            })
        } catch (error) {
            hal.log('haAvatar/fetchAvatar/db/put/error ' + error)
        }
        
        return avatarImgBlob
    }

    async function fetchGroupAvatar(groupID: string, avatarID?: string) {
        const avatarArr = await db.groupAvatar.where('groupID').equals(groupID).toArray()
        const dbAvatar = avatarArr[0]
    
        let avatarImgBlob: Blob

        if (avatarArr.length > 0 && dbAvatar.avatarID == avatarID && dbAvatar.image) {
            // return avatarImgBlob = new Blob( [ dbAvatar.image ], { type: 'image/jpeg' } )
            return dbAvatar.image
        }

        const avatarImageUrl = ref('')

        if (avatarID) {
            avatarImageUrl.value = avatarImageUrlPrefix + avatarID
        } else if (dbAvatar && dbAvatar.avatarID) {
            avatarImageUrl.value = avatarImageUrlPrefix + dbAvatar.avatarID
        }

        if (avatarImageUrl.value == '') {
            return undefined
        }
    
        const request = new Request(avatarImageUrl.value)
        const response = await fetch(request)
        avatarImgBlob = await response.blob()

        // todo: need to check if response and/or blob is valid or not before storing it
        try {
            const id = await db.groupAvatar.put({
                groupID: groupID,
                avatarID: avatarID,
                image: avatarImgBlob,
            })
        } catch (error) {
            hal.log('haAvatar/fetchGroupAvatar/db/put/error ' + error)
        }
        
        return avatarImgBlob
    }    
    
    return { getAvatar, fetchGroupAvatar }
}
