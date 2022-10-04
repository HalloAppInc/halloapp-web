import Dexie, { Table } from 'dexie'
import { server, web } from '@/proto/web.js'

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

export interface CommonMediaLinkPreview {
    id?: number
    title: string
    url: string
    description: string
    preview?: CommonMedia
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

export enum SubjectType {
    FeedPost = 0,
    Comment = 1,
    Chat = 2
}

export enum MediaType {
    Unknown = 0,
    Image = 1,
    Video = 2,
    Audio = 3
}

export interface CommonMedia {
    id?: number
    type: SubjectType       // Feed, Comment, Chat
    subjectID: string       // '', GroupID, PostID, ChatID
    contentID: string       // PostID, CommentID, MessageID
    mediaType: MediaType    // Image, Video, VoiceNote
    
    order: number
    width: number
    height: number

    key: Uint8Array
    hash: Uint8Array
    downloadURL: string
    uploadURL?: string

    blobVersion?: number
    blobSize?: number | Long
    chunkSize?: number
    blob?: Blob

    isCodecH265?: boolean // pertains to video only
    previewImage?: Blob
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

    seenState?: web.PostDisplayInfo.SeenState
    retractState?: web.PostDisplayInfo.RetractState
    unreadComments?: number
    userReceipts?: web.ReceiptInfo[]

    haveComments?: boolean
}

export interface Comment {
    id?: number
    postID: string
    type: server.Comment.CommentType
    commentID: string
    userID: number
    parentCommentID?: string
    timestamp: number

    text?: string
    mentions?: Mention[]
    voiceNote?: CommonMedia

    linkPreview?: CommonMediaLinkPreview
}

export interface Group {
    groupID: string,
    name?: string,  // will need this for search, maybe
    description?: string
    background?: string
    lastContent?: string
    lastContentMediaType?: PostMediaType
    lastChangeTimestamp: number
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

export interface GroupAvatar {
    groupID: string
    avatarID?: string
    image?: Blob
}

export class HADexie extends Dexie {

    messageList!: Table<MessageList>
    media!: Table<Media>
    feed!: Table<Feed>
    comment!: Table<Comment>
    group!: Table<Group>
    chat!: Table<Chat>
    postMedia!: Table<PostMedia>
    commonMedia!: Table<CommonMedia>
    contact!: Table<Contact>
    avatar!: Table<Avatar>
    groupAvatar!: Table<GroupAvatar>
    
    constructor() {
        super('myDatabase')
        this.version(10).stores({
            messageList: '++id, fromUserID, toUserID',
            media: '++id',
            feed: '++id, postID, userID, groupID, seenState, text, timestamp',
            comment: '++id, postID, commentID, timestamp',
            group: 'groupID, name',
            chat: '++id, proto',
            postMedia: '++id, postID, order',
            commonMedia: '++id, contentID, subjectID, type',
            contact: '++id, userName, userID',
            avatar: 'userID',
            groupAvatar: 'groupID'
        })
    }
    
}

export const db = new HADexie()