import { db } from '../db'

import { nanoid } from 'nanoid'

import hal from '../common/halogger'

import { useHAProtobuf } from './haProtobuf'

export function useHADatabase() {

    const { createMedia, createChatContainer, decodeChatContainer, decodeMedia } = useHAProtobuf()

    const UserAId = 'X9l9StZ_IjuqFqGvBqa27' 
    const UserBId = 'j_1H1YKQy74sDoCylPCEA'

    const messageList = [
        {
            fromUserId: UserAId,
            toUserId: UserBId,
            text: "Short text testing:<br> ~123~ <s>123</s>,_123_<i>123</i>,*123*<b>123</b>",
            timestamp: "1649204213",
        },
        {
            fromUserId: UserBId,
            toUserId: UserAId,
            text: "Long text testing: The item is sized according to its width and height properties, The item is sized according to its width and height properties, The item is sized according to its width and height properties",
            timestamp: "1649204213",
        },
        {
            fromUserId: UserAId,
            toUserId: UserBId,
            quoteId: 1,
            text: "Long text testing: The item is sized according to its width and height properties, The item is sized according to its width and height properties, The item is sized according to its width and height properties",
            timestamp: "1656853200",
        },
        {
            fromUserId: UserAId,
            toUserId: UserBId,
            text: "asdfasdfsadfasdflsadkfl;sdakf;lasdkf;asdkf;lasdkf;lsadkf;lsadkf;sadkf;lasdfksd;lfksd;lfdsf",
            timestamp: "1657026000",
        },
        {
            fromUserId: UserAId,
            toUserId: UserBId,
            quoteId: 3,
            text: "😍😍😍😍",
            timestamp: "1657026000",
        },
        {
            fromUserId: UserAId,
            toUserId: UserBId,
            text: "😍!",
            timestamp: "1657026000",
        },
        {
            fromUserId: UserAId,
            toUserId: UserBId,
            text: "😍☺️❤️",
            timestamp: "1657026000",
        },
    ]

    async function loadMessageList(userId: string) {
        const messageArray = await db.messageList.where('fromUserId').equals(userId).or('toUserId').equals(userId).toArray()
        hal.log('haDb/getMessageList/query result ', messageArray)

        return messageArray
    }

    async function putMessage(message: any) {
        const id = await db.messageList.put(message)
        return id
    }

    async function initMessageList() {
        const all = await db.messageList.toArray()
        if (all.length != 0) {
            await db.messageList.clear()
        }

        for(const message of messageList) {
            const id = await db.messageList.put(message)
            const record = await db.messageList.where('id').equals(id).toArray()
            // hal.log(record)
        }
    }

    async function getMedia(id: number) {
        const mediaArray = await db.media.where('id').equals(id).toArray()
        hal.log('haDb/getMessageList/query result ', mediaArray)

        return mediaArray
    }

    async function putMedia(proto: ArrayBuffer) {
        const id = await db.media.put({
            proto: proto
        })
        return id
    }

    return { loadMessageList, initMessageList }
}