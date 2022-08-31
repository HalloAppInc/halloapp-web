import hal from '../common/halogger'
import { ref } from 'vue'
import { db } from '../db'

import { useMainStore } from '../stores/mainStore'

export function useHAAvatar() {

    const mainStore = useMainStore()
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

        try {
            const id = await db.avatar.put({
                userID: userID,
                avatarID: avatarID,
                image: avatarImgBlob,
            })
        } catch (error) {
            hal.log('insertOrUpdateAvatar/db/put/error ' + error)
        }
        
        return avatarImgBlob
    }
    
    return { getAvatar }
}
