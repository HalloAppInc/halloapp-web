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

export function useHAPrivacyList() {

    const mainStore = useMainStore()
    const connStore = useConnStore()
    
    let { 
        createWebStanzaPacket, 
        createPrivacyListRequestWebContainer,
    } = network()    

    const { hal } = useHALog()

    async function requestPrivacyList(callback?: Function) {
        if (!connStore.isConnectedToMobile) { return }
        hal.log('connStore/requestPrivacyList')
        
        const createdWebContainer = createPrivacyListRequestWebContainer()        
        const encryptedWebContainer = connStore.encryptWebContainer(createdWebContainer.webContainerBinArr)

        const packet = createWebStanzaPacket(encryptedWebContainer)
        
        connStore.enqueueMessage(packet, createdWebContainer.webContainer, true, callback)            
    }
    
    async function processPrivacyListResponse(response: any) {
        const privacyLists = response.privacyLists

        console.log('privacyLists')
        console.dir(privacyLists)

        // mainStore.isPrivacyListCompleted = true
    }

    return { 
        requestPrivacyList,
        processPrivacyListResponse
    }
}