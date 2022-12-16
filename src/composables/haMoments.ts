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

import { useTimeformatter } from '@/composables/timeformatter'

export function useHAMoments() {

    const mainStore = useMainStore()
    const connStore = useConnStore()

    const { diffInSeconds } = useTimeformatter()
    
    let { 
        createWebStanzaPacket, 
        createMomentsRequestWebContainer
    } = network()    

    const { hal } = useHALog()

    async function requestMoments(cursor: string, limit: number, callback?: Function) {
        if (!connStore.isConnectedToMobile) { return }
        console.log('connStore/requestMoments/cursor: ' + cursor)
        
        const createdWebContainer = createMomentsRequestWebContainer(cursor, limit)        
        const encryptedWebContainer = connStore.encryptWebContainer(createdWebContainer.webContainerBinArr)

        const packet = createWebStanzaPacket(encryptedWebContainer)
        
        connStore.enqueueMessage(packet, createdWebContainer.webContainer, true, callback)            
    }

    async function processMomentStatus(momentStatus: any) {

        if (!momentStatus) { return }

        if (momentStatus.isLocked) {
            mainStore.isMomentsLocked = true
        } else {
            mainStore.isMomentsLocked = false
        }

        console.log('haMoments/processMomentStatus/moments lock status: ' + mainStore.isMomentsLocked)
        
        if (!mainStore.isMomentsLocked) {
            const expiryTimestamp = momentStatus.expiryTimestamp
            const timeDiff = diffInSeconds(expiryTimestamp)
            console.log('haMoments/processMomentStatus/moments will lock in: ' + Math.round(timeDiff/3600) + ' hour(s)')
            
            clearTimeout(connStore.momentsLockTimer)
            connStore.momentsLockTimer = setTimeout(function() {
                mainStore.isMomentsLocked = true
            }, timeDiff*1000)
        }
    }

    return { 
        requestMoments,
        processMomentStatus
    }
}