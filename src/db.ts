import Dexie, { Table } from 'dexie'

export interface MessageList {
    id?: number
    fromUserID?: string
    toUserID?: string
    quoteId?: number
    mediaID?: number[]
    timestamp?: string
    text?: string
}

export interface Media {
    id?: number
    type: string,
    file: ArrayBuffer,
    preview?: ArrayBuffer,
    width: number,
    height: number
}

export interface Feed {
    id?: number
    proto: ArrayBuffer
}

export interface Chat {
    id?: number
    proto: ArrayBuffer
}

export interface Contact {
    id?: number
    userName: string,
    userID: string,
}

export interface Avatar {
    id?: number
    userID: string
    avatarID?: string
    image?: ArrayBuffer
}

export class HADexie extends Dexie {

    messageList!: Table<MessageList>
    media!: Table<Media>
    feed!: Table<Feed>
    chat!: Table<Chat>
    contact!: Table<Contact>
    avatar!: Table<Avatar>
    
    constructor() {
        super('myDatabase')
        this.version(2).stores({
            messageList: '++id, fromUserID, toUserID',
            media: '++id',
            feed: '++id, proto',
            chat: '++id, proto',
            contact: '++id, userName, userID',
            avatar: '++id, userID, image'
        })
    }
    
}

export const db = new HADexie()