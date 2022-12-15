import Dexie, { Table } from 'dexie'
import { server, web } from '@/proto/web.js'

export interface Moment {
    image: CommonMedia
    selfieImage?: CommonMedia
    selfieLeading?: boolean
    location?: string

    blurredImage?: CommonMedia
    blurredSelfieImage?: CommonMedia

    isOpened?: boolean
}

export interface Post {
    postID: string
    userID: number
    groupID?: string

    voiceNote?: CommonMedia
    text?: string
    mentions?: Mention[]
    linkPreview?: CommonMediaLinkPreview
    timestamp: number,
    expiryTimestamp?: number,

    moment?: Moment,

    seenState?: web.PostDisplayInfo.SeenState
    transferState?: web.PostDisplayInfo.TransferState
    retractState?: web.PostDisplayInfo.RetractState

    unreadComments?: number
    userReceipts?: web.ReceiptInfo[]

    haveComments?: boolean
}

export interface Comment {
    commentID: string
    postID: string
    type: server.Comment.CommentType
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
    membershipStatus?: web.GroupDisplayInfo.MembershipStatus
    expiryInfo?: server.ExpiryInfo

    lastContent?: string
    lastContentMediaType?: MediaType
    lastChangeTimestamp: number,
    numUnseen?: number,

    haveRequestedPosts?: boolean
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

/*              
                    subjectID   contentID
    Moments:        ''          postID
    Main Feed:      ''          postID
    Group Feed:     groupID     postID
    Comments:       postID      commentID
    Chat:           chatID      messageID
 */
export interface CommonMedia {
    id?: number
    type: SubjectType       // Moment, Feed, Comment, Chat
    subjectID: string       // '', GroupID, PostID, ChatID
    contentID: string       // PostID, CommentID, MessageID
    order: number

    mediaType: MediaType    // Image, Video, Audio
    width: number
    height: number

    key: Uint8Array
    hash: Uint8Array
    downloadURL: string
    uploadURL?: string

    blobVersion?: number
    blobSize?: number | Long
    chunkSize?: number
    blob?: Blob // deprecated, can remove after some builds from 40
    arrBuf?: ArrayBuffer // Use ArrayBuffer instead of Blob as Safari does not handle blobs in indexeddb well

    previewImage?: Blob // deprecated, can remove after some builds from 40
    previewImageArrBuf?: ArrayBuffer

    isCodecH265?: boolean // pertains to video only
}

export enum SubjectType {
    FeedPost = 0,
    Comment = 1,
    Chat = 2,
    Moment = 3
}

export enum MediaType {
    Unknown = 0,
    Image = 1,
    Video = 2,
    Audio = 3
}

export interface CommonMediaLinkPreview {
    id?: number
    title: string
    url: string
    description: string
    preview?: CommonMedia
}

export interface Mention {
    id?: number
    index: number
    userID: string
    name: string
}

export interface Avatar {
    userID: number
    avatarID?: string
    image?: Blob
    arrBuf?: ArrayBuffer
}

export interface GroupAvatar {
    groupID: string
    avatarID?: string
    image?: Blob
    arrBuf?: ArrayBuffer
}

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

export class HADexie extends Dexie {
    post!: Table<Post>
    comment!: Table<Comment>
    group!: Table<Group>
    chat!: Table<Chat>
    contact!: Table<Contact>
    
    commonMedia!: Table<CommonMedia>
    
    avatar!: Table<Avatar>
    groupAvatar!: Table<GroupAvatar>

    messageList!: Table<MessageList>
    media!: Table<Media>
    
    constructor() {
        super('myDatabase')
        this.version(20).stores({
            post: 'postID, userID, groupID, seenState, text, timestamp, expiryTimestamp',
            comment: 'commentID, postID, timestamp',
            group: 'groupID, name, numUnseen, lastChangeTimestamp',

            commonMedia: '++id, &[subjectID+contentID+order], contentID, subjectID',
            
            avatar: 'userID',
            groupAvatar: 'groupID',

            messageList: '++id, fromUserID, toUserID',
            media: '++id',
            contact: '++id, userName, userID',
            chat: '++id, proto',
        })
    }
    
}

export const db = new HADexie()