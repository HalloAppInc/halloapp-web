import Dexie, { Table } from 'dexie'

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
    proto: ArrayBuffer
}

export interface Avatar {
    id?: number
    userID: string
    image: ArrayBuffer
}

export class HADexie extends Dexie {

    feed!: Table<Feed>
    chat!: Table<Chat>
    contact!: Table<Contact>
    avatar!: Table<Avatar>
    
    constructor() {
        super('myDatabase')
        this.version(1).stores({
            feed: '++id, proto',
            chat: '++id, proto',
            contact: '++id, proto',
            avatar: '++id, userID, image'
        })
    }
}

export const db = new HADexie()