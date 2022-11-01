import { ref } from 'vue'

import { useMainStore } from '@/stores/mainStore'
import { useConnStore } from '@/stores/connStore'
import { db } from '@/db'
import hal from '@/common/halogger'

export function useHAAvatar() {

    const mainStore = useMainStore()
    const connStore = useConnStore()
    const avatarImageUrlPrefix = mainStore.devCORSWorkaroundUrlPrefix + 'https://avatar-cdn.halloapp.net/'

    async function getAvatar(userID: number) {
        return await db.avatar.where('userID').equals(userID).first()
    }

    async function insertOrModifyAvatar(userID: number, avatarID: string) {
        if (!mainStore.allowDbTransactions) { 
            hal.log('haAvatar/insertOrModifyAvatar/' + userID + '/db access not allowed')
            return 
        }
        const dbAvatar = await getAvatar(userID)

        /* new avatar, just add, leave the fetching to the component when it needs to be displayed */
        if (!dbAvatar) {
            try {
                const id = await db.avatar.add({
                    userID: userID,
                    avatarID: avatarID
                })
                hal.log('haAvatar/insertOrModifyAvatar/' + userID + '/add sucess')
            } catch (error) {
                hal.log('haAvatar/insertOrModifyAvatar/' + userID + '/add/error ' + error)
            }
            return
        }

        /* avatar changed, need to fetch and modify */
        else if (dbAvatar.avatarID != avatarID) {
            hal.log('haAvatar/insertOrModifyAvatar/' + userID + '/modify')

            await fetchAndModifyAvatar(dbAvatar.userID, avatarID)

            return
        }
    }


    async function fetchAndModifyAvatar(userID: number, avatarID: string) {
        if (!mainStore.allowDbTransactions) { return }

        const avatarImageUrl = avatarImageUrlPrefix + avatarID

        const request = new Request(avatarImageUrl)
        const response = await fetch(request)
        let avatarArrBuf = await response.arrayBuffer()

        if (avatarArrBuf.byteLength < 1) {
            hal.log('haAvatar/fetchAndModifyAvatar/' + userID + '/exit/arrbuf empty')
            return undefined
        }

        await db.avatar.where('userID').equals(userID).modify(function(avatar: any) {
            avatar.avatarID = avatarID
            avatar.arrBuf = avatarArrBuf
        })
    }    

    async function getGroupAvatar(groupID: string) {
        return await db.groupAvatar.where('groupID').equals(groupID).first()
    }

    async function insertOrModifyGroupAvatar(groupID: string, avatarID: string) {
        if (!mainStore.allowDbTransactions) { return }
        const dbAvatar = await getGroupAvatar(groupID)

        /* new avatar, just add, leave the fetching to the component when it needs to be displayed */
        if (!dbAvatar) {
            try {
                const id = await db.groupAvatar.add({
                    groupID: groupID,
                    avatarID: avatarID
                })
            } catch (error) {
                hal.log('haAvatar/insertGroupAvatar/' + groupID + '/add/error ' + error)
            }
            return
        }

        /* avatar changed, need to fetch and modify */
        else if (dbAvatar.avatarID != avatarID) {

            await fetchAndModifyGroupAvatar(dbAvatar.groupID, avatarID)

            return
        }
    }

    async function fetchAndModifyGroupAvatar(groupID: string, avatarID: string) {
        if (!mainStore.allowDbTransactions) { return }

        const avatarImageUrl = avatarImageUrlPrefix + avatarID

        const request = new Request(avatarImageUrl)
        const response = await fetch(request)
        let avatarArrBuf = await response.arrayBuffer()

        if (avatarArrBuf.byteLength < 1) {
            hal.log('haAvatarfetchGroupAvatar/' + groupID + '/exit/arrbuf empty')
            return undefined
        }

        await db.groupAvatar.where('groupID').equals(groupID).modify(function(avatar: any) {
            avatar.avatarID = avatarID
            avatar.arrBuf = avatarArrBuf
        })
    }    
    
    return {
        insertOrModifyAvatar, fetchAndModifyAvatar,
        insertOrModifyGroupAvatar, fetchAndModifyGroupAvatar }
}
