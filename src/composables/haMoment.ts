import { Dexie, liveQuery } from 'dexie'

import { useMainStore } from '@/stores/mainStore.js'
import { useConnStore } from '@/stores/connStore.js'

import {    db, 
            Post, Comment, Group, Mention, CommonMediaLinkPreview,
            CommonMedia, SubjectType, MediaType } from '@/db'

import { clients } from '@/proto/clients.js'
import { web } from '@/proto/web.js'

import { network } from '@/common/network'

import { useHAAvatar } from '@/composables/haAvatar'
import { useHALog } from '@/composables/haLog'

export function useHAMoment() {

    const mainStore = useMainStore()
    const connStore = useConnStore()
    
    let { 
        createWebStanzaPacket, 
        createGroupFeedRequestWebContainer,
        createGroupRequestWebContainer,
    } = network()    

    const { insertOrModifyGroupAvatar } = useHAAvatar()
    const { hal } = useHALog()

    async function requestMoments(groupID: string, cursor: string, limit: number, callback?: Function) {
        if (!connStore.isConnectedToMobile) { return }
        console.log('connStore/requestGroupFeedItems/group: ' + groupID + ', cursor: ' + cursor)
        
        const createdWebContainer = createGroupFeedRequestWebContainer(groupID, cursor, limit)        
        const encryptedWebContainer = connStore.encryptWebContainer(createdWebContainer.webContainerBinArr)

        const packet = createWebStanzaPacket(encryptedWebContainer)
        
        connStore.enqueueMessage(packet, createdWebContainer.webContainer, true, callback)            
    }

    async function insertMoment(group: any) {

        return new Promise(async function (resolve, reject) {
            try {
                const id = await db.group.add(group)
                return resolve(id)
            } catch (error) {
                hal('haFeed/insertGroup/add/error ' + error)()
                return reject(error)
            }
        })
    }

    async function modifyGroupHaveRequestedPosts(groupID: string) {
        if (!mainStore.allowDbTransactions) { return }
    
        db.group.where('groupID').equals(groupID).modify(function(grp: any) {
            grp.haveRequestedPosts = true                   
        })
    }    

    async function modifyGroupNumUnseen(groupID: string, numUnseen: number) {
        if (!mainStore.allowDbTransactions) { return }
    
        db.group.where('groupID').equals(groupID).modify(function(grp: any) {
            if (grp.numUnseen != numUnseen) {
                grp.numUnseen = numUnseen
            }                      
        })
    }    


    return { 

    }
}