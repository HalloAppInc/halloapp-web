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
import { useHAText } from '@/composables/haText'
import { useHACommonMedia } from '@/composables/haCommonMedia'
import { useHALog } from '@/composables/haLog'

export function useHAGroup() {

    const mainStore = useMainStore()
    const connStore = useConnStore()
    
    let { 
        createPingPacket, addKey, removeKey, check, createNoiseMessage, createWebStanzaPacket, 
        encodeFeedRequestWebContainer, encodeGroupFeedRequestWebContainer, encodeCommentsRequestWebContainer,
        encodeGroupRequestWebContainer,
        uploadMedia 
    } = network()    

    const { insertOrModifyGroupAvatar } = useHAAvatar()
    const { processText } = useHAText()
    const { insertCommonMedia } = useHACommonMedia()
    const { hal } = useHALog()

    async function requestGroupFeedItems(groupID: string, cursor: string, limit: number, callback?: Function) {
        if (!connStore.isConnectedToMobile) { return }
        console.log('connStore/requestGroupFeedItems/group: ' + groupID + ', cursor: ' + cursor)
        
        const webContainerBinArr = encodeGroupFeedRequestWebContainer(groupID, cursor, limit)        
        const encryptedWebContainer = connStore.encryptWebContainer(webContainerBinArr)

        const packet = createWebStanzaPacket(encryptedWebContainer)
        
        connStore.enqueueMessage(packet, true, callback)            
    }

    async function requestGroupsList(callback?: Function) {
        if (!connStore.isConnectedToMobile) { return }
        hal.log('connStore/requestGroupsList')
        
        const webContainerBinArr = encodeGroupRequestWebContainer()        
        const encryptedWebContainer = connStore.encryptWebContainer(webContainerBinArr)

        const packet = createWebStanzaPacket(encryptedWebContainer)
        
        connStore.enqueueMessage(packet, true, callback)            
    }
    
    async function processGroupResponse(response: any) {
        const groupInfoList = response.groups
        for (let j = 0; j < groupInfoList.length; j++) {
            const info = groupInfoList[j]
            if (!info) { continue }
            await processGroupDisplayInfo(info)
        }
        hal.log('haGroup/groups list complete')
        mainStore.isGroupsListCompleted = true
    }

    async function processGroupDisplayInfoList(groupInfoList: any) {
        for (let j = 0; j < groupInfoList.length; j++) {
            const info = groupInfoList[j]
            if (!info) { continue }

            // try not awaiting to see if it's more performant as nothing need to wait on the process
            processGroupDisplayInfo(info)
        }
    }

    async function processGroupDisplayInfo(info: any) {
        if (!mainStore.allowDbTransactions) { return }
        const groupID = info.id
        const name = info.name

        const dbGroupsList = await db.post.where('groupID').equals(groupID).toArray()
        
        if (dbGroupsList.length == 0) {
            
            let group: Group = { 
                groupID: info.id,
                name: info.name,
                description: info.description,
                background: info.background,
                lastChangeTimestamp: 0
            }            
            await insertGroup(group)
        } else {
            const dbGroup = dbGroupsList[0]
            // todo: modify appropriate based on changes
        }   

        if (!mainStore.groupnames[groupID] || mainStore.groupnames[groupID] != name) {
            mainStore.groupnames[groupID] = name
        }
        if (info.avatarId) {
            await insertOrModifyGroupAvatar(groupID, info.avatarId)
        }
    }        
    
    async function insertGroup(group: any) {

        return new Promise(async function (resolve, reject) {
            try {
                const id = await db.group.put(group)
                return resolve(id)
            } catch (error) {
                hal.log('haFeed/insertGroup/put/error ' + error)
                return reject(error)
            }
        })
    }

    return { 
        requestGroupFeedItems,
        requestGroupsList,
        processGroupResponse,
        processGroupDisplayInfoList
    }
}