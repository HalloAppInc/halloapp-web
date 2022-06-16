import Dexie, { Table } from 'dexie'

export interface Avatar {
  id?: number
  userID: string
  image: ArrayBuffer
}

export class HADexie extends Dexie {

    avatar!: Table<Avatar>

    constructor() {
        super('myDatabase')
        this.version(1).stores({
            avatar: '++id, userID, image'
        })
    }
}

export const db = new HADexie()