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

export interface Mention {
    id?: number
    index: number
    userID: string
    name: string
}

export interface LinkPreview {
    id?: number
    title: string
    url: string
}

enum PostMediaType {
    Unknown = 0,
    Image = 1,
    Video = 2
}

export interface PostMedia {
    id?: number
    order: number
    blob: Blob
    blobSize: number
    chunkSize: number
    type: PostMediaType
    width: number
    height: number
    key: string
    sha256: string
    putURL?: string
    getURL?: string
}

export interface Feed {
    id?: number
    userID?: string
    groupID?: string
    text?: string
    mentions?: [Mention]
    linkPreview?: LinkPreview
    media?: [PostMedia]
    timestamp: number
    proto?: ArrayBuffer
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
        this.version(3).stores({
            messageList: '++id, fromUserID, toUserID',
            media: '++id',
            feed: '++id, userID, groupID, text, mentions, linkPreview, media, timestamp, proto',
            chat: '++id, proto',
            contact: '++id, userName, userID',
            avatar: '++id, userID, image'
        })
    }
    
}

export const db = new HADexie()