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
            await processGroupDisplayInfo(info) // awaiting seems faster than not to, though nothing needs to wait on it
        }
        hal.log('haGroup/groups list complete')
        mainStore.isGroupsListCompleted = true
    }

    async function processGroupDisplayInfoList(groupInfoList: any) {
        for (let j = 0; j < groupInfoList.length; j++) {
            const info = groupInfoList[j]
            if (!info) { continue }

            await processGroupDisplayInfo(info)
        }
    }

    async function processGroupDisplayInfo(groupInfo: any) {
        if (!mainStore.allowDbTransactions) { return }
        const groupID = groupInfo.id
        const name = groupInfo.name

        const dbGroup = await db.group.where('groupID').equals(groupID).first()
        
        if (!dbGroup) {
            
            let group: Group = { 
                groupID: groupInfo.id,
                name: groupInfo.name,
                description: groupInfo.description,
                background: groupInfo.background,
                lastChangeTimestamp: 0
            }            
            const insertion = await insertGroup(group)
        } else {
            
            db.group.where('groupID').equals(groupID).modify(function(grp: any) {
                if (grp.name != groupInfo.name) {
                    grp.name = groupInfo.name
                }
                if (grp.description != groupInfo.description) {
                    grp.description = groupInfo.description
                }     
                if (grp.background != groupInfo.background) {
                    grp.background = groupInfo.background
                }                             
            })

            
        }   

        if (!mainStore.groupnames[groupID] || mainStore.groupnames[groupID] != name) {
            mainStore.groupnames[groupID] = name
        }
        if (groupInfo.avatarId) {
            await insertOrModifyGroupAvatar(groupID, groupInfo.avatarId)
        }
    }        
    
    async function insertGroup(group: any) {

        return new Promise(async function (resolve, reject) {
            try {
                const id = await db.group.add(group)
                return resolve(id)
            } catch (error) {
                hal.log('haFeed/insertGroup/add/error ' + error)
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