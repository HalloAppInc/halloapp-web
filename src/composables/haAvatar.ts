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
        try {
            return await db.avatar.where('userID').equals(userID).first()
        } catch (error) {
            hal.log('haAvatar/insertOrModifyAvatar/' + userID + '/add/error ' + error)
            return undefined
        }
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

        // const avatarImageUrl = avatarImageUrlPrefix + avatarID

        // const request = new Request(avatarImageUrl)
        // const response = await fetch(request)

        const urlPath = avatarID
        const response = await haFetch(urlPath)

        if (!response) { return undefined }

        let avatarArrBuf = await response.arrayBuffer()

        /* rough check to see if response is an actual image or an error message from server (which is around 243 bytes) */
        if (avatarArrBuf.byteLength < 500) {
            hal.log('haAvatar/fetchAndModifyAvatar/' + userID + '/exit/invalid image')
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

        // const avatarImageUrl = avatarImageUrlPrefix + avatarID
        // const request = new Request(avatarImageUrl)
        // const response = await fetch(request)

        const urlPath = avatarID
        const response = await haFetch(urlPath)

        if (!response) { return undefined }

        let avatarArrBuf = await response.arrayBuffer()

        /* rough check to see if response is an actual image or an error message from server (which is around 243 bytes) */
        if (avatarArrBuf.byteLength < 500) {
            hal.log('haAvatarfetchGroupAvatar/' + groupID + '/exit/arrbuf empty')
            return undefined
        }

        await db.groupAvatar.where('groupID').equals(groupID).modify(function(avatar: any) {
            avatar.avatarID = avatarID
            avatar.arrBuf = avatarArrBuf
        })
    }    
    
    async function haFetch(urlPath: any) {
        const avatarImageUrlPrefix = mainStore.devCORSWorkaroundUrlPrefix + 'https://avatar-cdn.halloapp.net/'
        const url = avatarImageUrlPrefix + urlPath
        const request = new Request(url, { signal: connStore.fetchAbortController.signal })
        try {
            const response = await fetch(request)
            return response
        } catch (err) {
            console.log('haFetch/err: ' + err)
            return undefined
        }
    }

    return {
        insertOrModifyAvatar, fetchAndModifyAvatar,
        insertOrModifyGroupAvatar, fetchAndModifyGroupAvatar }
}
