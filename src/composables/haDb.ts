import { db } from '../db'

import { nanoid } from 'nanoid'

import hal from '../common/halogger'

import { useHAProtobuf } from './haProtobuf'

import { useMainStore } from '../stores/mainStore'

export function useHADatabase() {

    const mainStore = useMainStore()

    const contactList = [
        {
            userName: 'UserA', // me
            userID: 'j_1H1YKQy74sDoCylPCEA',
        },
        {
            userName: 'UserB',
            userID: 'X9l9StZ_IjuqFqGvBqa27',
        },
        {
            userName: 'abcd123',
            userID: 'i7tenqOTRKxvqknYdrihB',
        },
        {
            userName: '?@#$%^&',
            userID: 'BoXcNaWI5BAAuiPaPE9Of',
        },
        {
            userName: '123_A',
            userID: 'Zgd_82oo6kNmsIdLyqbB6',
        }
    ]

    const messageList = [
        {
            fromUserID: contactList[1].userID,
            toUserID: contactList[0].userID,
            text: "Short text testing:<br> ~123~ <s>123</s>,_123_<i>123</i>,*123*<b>123</b>",
            timestamp: "1649204213",
        },
        {
            fromUserID: contactList[0].userID,
            toUserID: contactList[1].userID,
            text: "Long text testing: The item is sized according to its width and height properties, The item is sized according to its width and height properties, The item is sized according to its width and height properties",
            timestamp: "1649204213",
        },
        {
            fromUserID: contactList[1].userID,
            toUserID: contactList[0].userID,
            text: "Long text testing: The item is sized according to its width and height properties, The item is sized according to its width and height properties, The item is sized according to its width and height properties",
            timestamp: "1656853200",
        },
        {
            fromUserID: contactList[1].userID,
            toUserID: contactList[0].userID,
            text: "asdfasdfsadfasdflsadkfl;sdakf;lasdkf;asdkf;lasdkf;lsadkf;lsadkf;sadkf;lasdfksd;lfksd;lfdsf",
            timestamp: "1657026000",
        },
        {
            fromUserID: contactList[1].userID,
            toUserID: contactList[0].userID,
            text: "😍😍😍😍",
            timestamp: "1657026000",
        },
        {
            fromUserID: contactList[0].userID,
            toUserID: contactList[1].userID,
            text: "😍!",
            timestamp: "1657026000",
        },
        {
            fromUserID: contactList[1].userID,
            toUserID: contactList[0].userID,
            text: "😍☺️❤️",
            timestamp: "1657026000",
        },
        {
            fromUserID: contactList[2].userID,
            toUserID: contactList[0].userID,
            text: "?",
            timestamp: "1657026000",
        },
        {
            fromUserID: contactList[0].userID,
            toUserID: contactList[2].userID,
            text: "...Hi~",
            timestamp: "1657026000",
        },
        {
            fromUserID: contactList[3].userID,
            toUserID: contactList[0].userID,
            text: "How are you?",
            timestamp: "1657026000",
        },
        {
            fromUserID: contactList[0].userID,
            toUserID: contactList[3].userID,
            text: "yes",
            timestamp: "1657026000",
        },
        {
            fromUserID: contactList[4].userID,
            toUserID: contactList[0].userID,
            text: "This is a link",
            timestamp: "1657026000",
        },
        {
            fromUserID: contactList[0].userID,
            toUserID: contactList[4].userID,
            text: "This is a link",
            timestamp: "1657026000",
        }
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
        if (false) {
            // if no contact add contact
            const allContact = await db.contact.toArray()
            if (allContact.length == 0) {
                for (const contact of contactList) {
                    const id = await db.contact.put(contact)
                }
            }

            // if have old messages, delete all
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
        const mediaArray = await db.media.where('id').anyOf(idList).toArray()
        // hal.log('haDb/getMedia/query result ', mediaArray)

        return mediaArray
    }

    async function putMedia(media: any) {
        const id = await db.media.put(media) as number
        // hal.log('haDb/putMedia/media ', media) 
        
        return id
    }

    async function getContactByID(idList: number[]) {
        const contactArray = await db.contact.where('id').anyOf(idList).toArray()
        // hal.log('haDb/getContact/query result ', contactArray)

        return contactArray
    }

    async function putContact(contact: any) {
        const id = await db.contact.put(contact)
        // hal.log('haDb/putContact/contact ', contact)

        return id
    }

    async function getAllChat() {
        const chatArray = await db.transaction('r', db.messageList, db.contact, () => {
            return db.messageList.where('fromUserID')
            .notEqual(mainStore.loginUserID)
            .uniqueKeys()
            .then(IDArray => {
                const chatArray: any = []
                for (const ID of IDArray) {
                    // find latest message
                    db.messageList.where('fromUserID').equals(ID)
                    .or('toUserID').equals(ID)
                    .sortBy('timestamp')
                    .then(messageArray => {
                        const lastEle = messageArray[messageArray.length - 1]
                        const text = lastEle.text
                        const userID: string = lastEle.fromUserID != mainStore.loginUserID ? 
                        lastEle.fromUserID as string : lastEle.toUserID as string
                        db.contact.where('userID')
                        .equals(userID)
                        .toArray()
                        .then(res => {
                            const chat = {
                                'title': res[0].userName,
                                'subtitle': text,
                                'timestamp': lastEle.timestamp,
                                'userID': userID
                            }
                            chatArray.push(chat)
                        })
                    })
                }
                return chatArray
            })
        })

        // sort according to array
        chatArray.sort(function compareFn(a: any, b: any) {
            return b.timestamp - a.timestamp
        })

        hal.log('haDb/getAllChat/chat', chatArray)

        return chatArray
    }

    return {
        getMessageByID, deleteMessageByID, cleanMessageContentByID, 
        clearAllMessages, loadMessageList, initMessageListAndMediaList, 
        notifyWhenChanged, putMessage, getMedia, 
        putMedia, getContactByID, getAllChat }
}