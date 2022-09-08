import Dexie, { Table } from 'dexie'

export interface MessageList {
    id?: number
    fromUserID?: string
    toUserID?: string
    quoteId?: number
    mediaID?: number[]
    timestamp?: string
    text?: string,
    toOrFromAWS: boolean
}

export interface Media {
    id?: number
    type: string,
    file: ArrayBuffer,
    preview?: ArrayBuffer,
    width: number,
    height: number,
    toOrFromAWS: boolean
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
    description: string
    preview?: PostMedia
}

export enum PostMediaType {
    Unknown = 0,
    Image = 1,
    Video = 2,
    Audio = 3
}

export interface PostMedia {
    id?: number
    postID?: string
    type: PostMediaType
    order: number
    width: number
    height: number

    key: Uint8Array
    hash: Uint8Array
    downloadURL: string
    uploadURL?: string

    blobVersion?: number
    blob?: Blob
    blobSize?: number | Long
    chunkSize?: number

    isCodecH265?: boolean // pertains to video only
}

export interface Feed {
    id?: number
    postID: string
    userID: number
    groupID?: string
    voiceNote?: PostMedia
    text?: string
    mentions?: Mention[]
    linkPreview?: LinkPreview
    timestamp: number
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
    userID: number
    avatarID?: string
    image?: Blob
}

export class HADexie extends Dexie {

    messageList!: Table<MessageList>
    media!: Table<Media>
    feed!: Table<Feed>
    chat!: Table<Chat>
    postMedia!: Table<PostMedia>
    contact!: Table<Contact>
    avatar!: Table<Avatar>
    
    constructor() {
        super('myDatabase')
        this.version(5).stores({
            messageList: '++id, fromUserID, toUserID',
            media: '++id',
            feed: '++id, postID, userID, groupID, text, timestamp',
            chat: '++id, proto',
            postMedia: '++id, postID, order',
            contact: '++id, userName, userID',
            avatar: 'userID'
        })
    }
    
}

export const db = new HADexie()