import { Dexie, liveQuery } from 'dexie'

import { useMainStore } from '@/stores/mainStore.js'
import { useConnStore } from '@/stores/connStore.js'

import {    db, 
            Post, Comment, Group, Mention, CommonMediaLinkPreview,
            CommonMedia, SubjectType, MediaType } from '@/db'

import { clients } from '@/proto/clients.js'
import { web } from '@/proto/web.js'

import { network } from '@/common/network'

import { useHAAvatar } from '@/composables/haAvatar'
import { useHAText } from '@/composables/haText'
import { useHACommonMedia } from '@/composables/haCommonMedia'
import { useHALog } from '@/composables/haLog'

export function useHAComment() {

    const mainStore = useMainStore()
    const connStore = useConnStore()
    
    let { 
        createWebStanzaPacket, 
        createCommentsRequestWebContainer
    } = network()    

    const { hal } = useHALog()

    async function requestCommentsIfNeeded(postID: string, limit: number, callback?: Function) {

        let cursor = ''
        const savedCursor = mainStore.commentCursors[postID]
        
        if (savedCursor) {

            if (savedCursor.isAllItemsComplete) {
                return
            }

            if (savedCursor.cursor) {
                cursor = savedCursor.cursor
            }
        }

        requestComments(postID, cursor, limit, callback)
    }

    async function requestAllComments(postID: string, limit: number, callback?: Function) {

        let cursor = ''
        const savedCursor = mainStore.commentCursors[postID]
        
        if (savedCursor) {
            savedCursor.isRequestingAllItems = true
        }

        requestComments(postID, cursor, limit, callback)
    }

    async function requestComments(postID: string, cursor: string, limit: number, callback?: Function) {
        if (!connStore.isConnectedToMobile) { return }

        console.log('connStore/requestComments/post: ' + postID + ', cursor: ' + cursor)

        const createdWebContainer = createCommentsRequestWebContainer(postID, cursor, limit)        
        const encryptedWebContainer = connStore.encryptWebContainer(createdWebContainer.webContainerBinArr)

        const packet = createWebStanzaPacket(encryptedWebContainer)
        
        const needAuth = true
        const webContainer = createdWebContainer.webContainer
        connStore.enqueueMessage(packet, webContainer, needAuth, callback)            
    }

    async function getComment(postID: string, commentID: string) {
        const commentArr = await db.comment.where('commentID').equals(commentID).and((item) => {
            return item.postID == postID
        }).toArray()
        if (!commentArr || commentArr.length == 0) {
            return undefined
        }
        return commentArr[0]
    }    

    return { 
        requestCommentsIfNeeded,
        requestAllComments,
        requestComments,
        getComment, 
    }
}