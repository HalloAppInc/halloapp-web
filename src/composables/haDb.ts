import { db } from '../db'

import { nanoid } from 'nanoid'

import hal from '../common/halogger'

import { useHAProtobuf } from './haProtobuf'

export function useHADatabase() {

    const { createMedia, createChatContainer, decodeChatContainer, decodeMedia } = useHAProtobuf()

    const UserAID = 'X9l9StZ_IjuqFqGvBqa27' 
    const UserBID = 'j_1H1YKQy74sDoCylPCEA' // me

    const messageList = [
        {
            fromUserID: UserAID,
            toUserID: UserBID,
            text: "Short text testing:<br> ~123~ <s>123</s>,_123_<i>123</i>,*123*<b>123</b>",
            timestamp: "1649204213",
        },
        {
            fromUserID: UserBID,
            toUserID: UserAID,
            text: "Long text testing: The item is sized according to its width and height properties, The item is sized according to its width and height properties, The item is sized according to its width and height properties",
            timestamp: "1649204213",
        },
        {
            fromUserID: UserAID,
            toUserID: UserBID,
            text: "Long text testing: The item is sized according to its width and height properties, The item is sized according to its width and height properties, The item is sized according to its width and height properties",
            timestamp: "1656853200",
        },
        {
            fromUserID: UserAID,
            toUserID: UserBID,
            text: "asdfasdfsadfasdflsadkfl;sdakf;lasdkf;asdkf;lasdkf;lsadkf;lsadkf;sadkf;lasdfksd;lfksd;lfdsf",
            timestamp: "1657026000",
        },
        {
            fromUserID: UserAID,
            toUserID: UserBID,
            text: "😍😍😍😍",
            timestamp: "1657026000",
        },
        {
            fromUserID: UserBID,
            toUserID: UserAID,
            text: "😍!",
            timestamp: "1657026000",
        },
        {
            fromUserID: UserAID,
            toUserID: UserBID,
            text: "😍☺️❤️",
            timestamp: "1657026000",
        },
    ]

    async function loadMessageList(userID: string) {
        const messageArray = await db.messageList.where('fromUserID').equals(userID)
            .or('toUserID').equals(userID).sortBy('timestamp')
        //hal.log('haDb/loadMessageList/query result ', messageArray)

        return messageArray
    }

    async function getMessageByID(id: number) {
        const message = await db.messageList.where('id').equals(id).toArray()
        //hal.log('haDb/getMessage/query result ', message[0])

        return message[0]
    }

    async function deleteMessageByID(id: number) {
        await db.messageList.where('id').equals(id).delete()
        // hal.log('haDb/deleteMessage/delete message id = ', id)
    }

    async function cleanMessageContentByID(id: number) {
        await db.messageList.update(id, {'text': undefined, 'quoteId': undefined, 'mediaID': undefined})
        // hal.log('haDb/cleanMessageContentByID/message id = ', id)
    }

    async function clearAllMessages(userId: string) {
        await db.messageList.where('fromUserID').equals(userId)
            .or('toUserID').equals(userId)
            .delete()
        // hal.log('haDb/clearAllMessages/clear all messages')
    }

    async function putMessage(message: any) {
        const id = await db.messageList.put(message) as number
        // hal.log('haDb/putMessage/messages ', message)

        return id
    }

    async function initMessageListAndMediaList() {
        const all = await db.messageList.toArray()
        if (all.length != 0) {
            await db.messageList.clear()
        }

        const allMedia = await db.media.toArray()
        if (allMedia.length != 0) {
            await db.media.clear()
        }

        for(const message of messageList) {
            const id = await db.messageList.put(message)
            const record = await db.messageList.where('id').equals(id).toArray()
            // hal.log('haDb/initMessageListAndMediaList/finished')
        }
    }

    function notifyWhenChanged(listener: any) {
        db.messageList.hook('updating', function() {
            this.onsuccess = function() {
                listener('update')
            }
        })
        db.messageList.hook('creating', function() {
            this.onsuccess = function() {
                listener('create')
            }
        })
        db.messageList.hook('deleting', function() {
            this.onsuccess = function() {
                listener('delete')
            }
        })
    }

    async function getMedia(idList: number[]) {
        console.log('add:', await db.media.toArray())
        const mediaArray = await db.media.where('id').anyOf(idList).toArray()
        hal.log('haDb/getMedia/query result ', mediaArray)

        return mediaArray
    }

    async function putMedia(media: any) {
        const id = await db.media.put(media) as number
        hal.log('haDb/putMedia/media ', media) 
        /* console.log('add:', await db.media.toArray()) */
        return id
    }

    return {
        getMessageByID, deleteMessageByID, cleanMessageContentByID, 
        clearAllMessages, loadMessageList, initMessageListAndMediaList, 
        notifyWhenChanged, putMessage, getMedia, 
        putMedia }
}