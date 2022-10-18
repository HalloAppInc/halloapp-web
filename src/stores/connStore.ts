import { Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import createNoise from 'noise-c.wasm'
import { Base64 } from 'js-base64'

import { useMainStore } from '@/stores/mainStore'

import { server } from '@/proto/server.js'
import { web } from '@/proto/web.js'

import { network } from '@/common/network'
import hacrypto from '@/common/hacrypto'
import hal from '@/common/halogger'

import { useHAUtils } from '@/composables/haUtils'
import { useHAFeed } from '@/composables/haFeed'
import { db } from '@/db'

export const useConnStore = defineStore('conn', () => {

    const mainStore = useMainStore()
    let { 
        createPingPacket, addKey, removeKey, check, createNoiseMessage, createWebStanzaPacket, 
        encodeFeedRequestWebContainer, encodeGroupFeedRequestWebContainer, encodeCommentsRequestWebContainer,
        uploadMedia 
    } = network()

    const { debounce } = useHAUtils()
    const { processWebContainer } = useHAFeed()

    const isConnectedToServer = ref(false)
    const isConnectedToMobile = ref(false)

    const nextTimeToConnectToMobile: Ref<number> = ref(0)

    const isNoiseReHandshakeCompleted = ref(false)
    const noiseReconnectHandshakeRetries: Ref<number> = ref(0)
    const fetchAbortController = ref(new AbortController())
 
     // audio is not allowed to be played (browsers AutoPlay policy) until the user have clicked on something per refresh,
     // so we keep track of the user's first click
    const isUserFirstClickCompleted = ref(false)

    const version = '35'
    const devMode = false
    const isDebug = false

    let connectionTimeoutID: any // used for debouncing multiple calls to connect
    let isLoggingOut: boolean = false

    // todo: should switch automatically to prod/test servers
    let webSocketServer = 'wss://ws-test.halloapp.net/ws'
    let webSocket: WebSocket
    let webSocketConnectRetries: number = 0
    let webSocketCloseTimeoutID: any // close socket if there are no activities/pings/etc.

    let noise: any
    let handshakeState: any
    let cipherStateSend: any
    let cipherStateReceive: any
    let mobileConnectionTimeoutID: any // retries mobile connection if there are no responses

    let sendMessagesTimeoutID: any // used for debouncing multiple calls to send messages
    let isSendingMessages: boolean = false
    let sendMessagesRetryNum: number = 0

    logoutIfOld()

    async function logoutIfOld() {
        const oldItems = await db.feed.count()
        if (oldItems && oldItems > 0) {
            logout()
        }
    }
    
    // closes websocket if there are no activity (msg, pings, etc.) for 60 seconds,
    // as web browser does not know if connection is lost or not
    function debounceWebSocketClose() {
        clearTimeout(webSocketCloseTimeoutID)
        webSocketCloseTimeoutID = setTimeout(function() {
            hal.log('connStore/debounceWebSocketClose/closing webSocket')
            webSocket.close()
        }, 60000)
    }

    // retry mobile connection if there are no responses for 60 seconds
    function debounceMobileConnectionRetry() {
        clearTimeout(mobileConnectionTimeoutID)
        mobileConnectionTimeoutID = setTimeout(function() {
            hal.log('connStore/debounceMobileConnectionRetry/no responses for 60 seconds')
            isConnectedToMobile.value = false
            connectToMobile()
        }, 30000)
    }

    async function connectToServerIfNeeded() {
        // hal.log('connStore/connectToServerIfNeeded')

        if (isConnectedToServer.value) {
            hal.log('connStore/connectToServerIfNeeded/already connected: ' + isConnectedToServer.value)
            return
        }

        clearTimeout(connectionTimeoutID)
        connectionTimeoutID = setTimeout(() => {
            connectToServer()
        }, 100)
    }


    async function wsOpen(event: any) {
        hal.log('connStore/wsOpen')
    
        webSocketConnectRetries = 0

        isConnectedToServer.value = true

        webSocket.removeEventListener('message', handleInbound)
        webSocket.addEventListener('message', handleInbound)

        addKeyToServer(function() {
            hal.log('connStore/wsOpen/addKeyToServer/added public key successfully')
            mainStore.haveAddedPublicKeyToServer = true

            connectToMobile()
        })
        
        sendReadyMessagesInQueue()
    }

    async function wsCloseWillReconnect(event: any) {
        hal.log('connStore/wsOncloseWillReconnect ' + event)
        isConnectedToServer.value = false

        /* try to reconnect */
        setTimeout(connectToServerIfNeeded, webSocketConnectRetries*3000)

        if (webSocketConnectRetries < 20) {
            webSocketConnectRetries++
        }
    }

    async function wsClose(event: any) {
        hal.log('connStore/wsOnclose ' + event)
        fetchAbortController.value.abort()
        fetchAbortController.value = new AbortController() // once aborted, controller is consumed, need to refresh

        isConnectedToServer.value = false

        if (isLoggingOut) {
            isLoggingOut = false
            mainStore.logoutMain()
        }
    }    

    async function connectToServer() {
        hal.log('connStore/connectToServer: ' + webSocketServer)

        const newWebSocket = new WebSocket(webSocketServer)
        newWebSocket.binaryType = 'arraybuffer'
    
        newWebSocket.removeEventListener('open', wsOpen)
        newWebSocket.addEventListener('open', wsOpen)

        newWebSocket.removeEventListener('close', wsCloseWillReconnect)
        newWebSocket.addEventListener('close', wsCloseWillReconnect)
    
        webSocket = newWebSocket
    }

    function disconnectFromServer() {
        hal.log('connStore/disconnectFromServer')
    
        /* remove reconnecting onclose handler */
        webSocket.removeEventListener('close', wsCloseWillReconnect)
    
        /* add onclose handler just to track closing of socket */
        webSocket.removeEventListener('close', wsClose)
        webSocket.addEventListener('close', wsClose)

        webSocket.close()
    }

    function generatePublicKeyIfNeeded() {
        if (!mainStore.privateKeyBase64) {
            hal.log('connStore/generatePublicKeyIfNeeded/keypair not found, generate keypair')
            const keypair = hacrypto.keygen()
            mainStore.privateKeyBase64 = Base64.fromUint8Array(keypair.secretKey)
            mainStore.publicKeyBase64 = Base64.fromUint8Array(keypair.publicKey)
        }
        hal.prod("connStore/generatePublicKeyIfNeeded/publicKey: " + mainStore.publicKeyBase64)
    }

    function clearPublicKey() {
        mainStore.privateKeyBase64 = ''
        mainStore.publicKeyBase64 = ''
    }

    function waitForUserToRegenKey() {
        clearPublicKey()
        disconnectFromServer()
    }

    // reconnect handshake only when the initial handshake have been completed before
    async function connectToMobile() {
        if (!isConnectedToServer.value) { return }
        if (!mainStore.haveInitialHandshakeCompleted) { return }

        if (noise == undefined) {
            noise = await initNoise()
        }

        hal.log('connStore/connectToMobile')

        resetHandshake()
        initHandshake(noise, 'KK', noise.constants.NOISE_ROLE_INITIATOR)
        handleNoiseHandshakeMsg('KK', noise.constants.NOISE_ROLE_INITIATOR)

        // stop trying after 20 attempts
        if (noiseReconnectHandshakeRetries.value > 20) { return  }

        // set a timeout to retry in case web client can't connect to mobile

        noiseReconnectHandshakeRetries.value++
        const wait = noiseReconnectHandshakeRetries.value*5000
        let currentDate = new Date()
        nextTimeToConnectToMobile.value = currentDate.getTime() + wait
        
        setTimeout(function() {
            if (isConnectedToMobile.value) { return }
            connectToMobile()
        }, wait)
    }

    async function initNoise() {
        return new Promise(resolve => {
            createNoise(function (createdNoise: any) { 
                resolve(createdNoise)
            })
        })
    }

    async function handleInbound(event: any) {
        debounceWebSocketClose()

        const eventDataBinArr = new Uint8Array(event.data)
        const packet = await decodePacket(eventDataBinArr)

        const ack = packet?.ack

        const iq = packet.iq
        const ping = iq?.ping
    
        const msg = packet?.msg
        const webStanza = msg?.webStanza

        const errorStanza = msg?.errorStanza

        if (ping) {
            const packet = createPingPacket()
            const packetProto = server.Packet.encode(packet).finish()
            const buf = packetProto.buffer.slice(packetProto.byteOffset, packetProto.byteLength + packetProto.byteOffset)
            hal.log('connStore/handleInbound/ping/respond with: ' + JSON.stringify(packet))
            webSocket.send(buf)
        } 
        
        else if (ack || iq) {
            // hal.log('connStore/handleInbound/ack')
            const callback = findPacketInSendQueue(packet)
            if (callback) { 
                callback(packet) 
            }            
        } 

        else if (iq) {
            hal.log('connStore/handleInbound/iq')
            const callback = findPacketInSendQueue(packet)
            if (callback) { 
                callback(packet) 
            }
        }

        else if (webStanza) {
            hal.log('connStore/handleInbound/webStanza')

            clearTimeout(mobileConnectionTimeoutID)

            const noiseMessage = webStanza?.noiseMessage

            if (noiseMessage) {

                if (!mainStore.haveInitialHandshakeCompleted) {

                    if (!handshakeState) {
                        initHandshake(noise, 'IK', noise.constants.NOISE_ROLE_RESPONDER)
                    }

                    if (noiseMessage.messageType == server.NoiseMessage.MessageType.IK_A) {
                        hal.log('connStore/handleInbound/webStanza/noiseMessage/IK_A')
                        handleNoiseHandshakeMsg('IK', noise.constants.NOISE_ROLE_RESPONDER, noiseMessage.content)
                    } 
                    else {
                        hal.log('connStore/handleInbound/webStanza/noiseMessage/not IK_A: ' + noiseMessage.messageType)
                    }
                }
                else {
                    
                    /* web requested to redo handshake */
                    if (noiseMessage.messageType == server.NoiseMessage.MessageType.KK_B) {
                        hal.log('connStore/handleInbound/webStanza/noiseMessage/KK_B')

                        if (!handshakeState) {
                            /* there should be an instance already, if not, this will initiate a new re-handshake */
                            initHandshake(noise, 'KK', noise.constants.NOISE_ROLE_INITIATOR)
                            handleNoiseHandshakeMsg('KK', noise.constants.NOISE_ROLE_INITIATOR)
                            return
                        }

                        handleNoiseHandshakeMsg('KK', noise.constants.NOISE_ROLE_INITIATOR, noiseMessage.content)
                    }

                    /* mobile is requesting to redo handshake */
                    else if (noiseMessage.messageType == server.NoiseMessage.MessageType.KK_A) {
                        hal.log('connStore/handleInbound/webStanza/noiseMessage/KK_A')

                        /* reset handshakestate (does not matter what state it is in) and re-handshake */
                        resetHandshake()
                        initHandshake(noise, 'KK', noise.constants.NOISE_ROLE_RESPONDER)
                        handleNoiseHandshakeMsg('KK', noise.constants.NOISE_ROLE_RESPONDER, noiseMessage.content)

                    } else {
                        hal.log('connStore/handleInbound/webStanza/noiseMessage/unknown')
                    }
                  
                }
            } 
            
            else {
                if (mainStore.isPublicKeyAuthenticated && mainStore.haveInitialHandshakeCompleted) {
                    
                    // temporary to get user's own userID
                    if (msg) {
                        if (mainStore.userID == 0) {
                            mainStore.userID = msg.toUid
                        }
                    }

                    if (webStanza.content) {

                        const webStanzaContentsBinArr = new Uint8Array(webStanza.content)
                        const decrypted = cipherStateReceive.DecryptWithAd([], webStanzaContentsBinArr)
                        const webContainer = await decodeWebContainer(decrypted)

                        // hal.log('connStore/handleInbound/webStanza/decoded/webContainer:')
                        // console.dir(webContainer)
                        processWebContainer(webContainer)
                    }

                }
            }
        } 

        else if (errorStanza) {
            hal.log('connStore/handleInbound/errorStanza: ' + errorStanza.reason)
            if (errorStanza.reason == 'not_authenticated') {
                hal.log('(mobile client was disconnected?  Disconnected showing on Manage Web Client page?)')
                logout()
            }
        }
        
    }

    function resetHandshake() {
        for (let prop in handshakeState) {
            delete handshakeState[prop]
        }
        handshakeState = undefined        
    }

    function findPacketInSendQueue(packet: any) {
        // hal.log('connStore/findPacketInSendQueue')

        let cb = undefined

        const ack = packet.ack
        const ackID = ack?.id
        const iq = packet.iq
        const iqID = iq?.id
        const msg = packet.msg
        const webStanza = msg?.webStanza
        const noiseMessage = webStanza?.noiseMessage

        let isFound = false

        for (let i = 0; i < mainStore.messageQueue.length; i++) {

            /* only outbound messages get ack'ed, not iq */
            if (ack && mainStore.messageQueue[i].msgID == ackID) {
                hal.log('connStore/findPacketInSendQueue/found, removing msg in queue: ' + ackID)
                isFound = true              
            }      
            else if (iq && mainStore.messageQueue[i].iqID == iqID) {
                hal.log('connStore/findPacketInSendQueue/found, removing iq in queue: ' + iqID)
                isFound = true
            }
            // else if (msgID && mainStore.messageQueue[i].msgID == msgID) {
            //     hal.log('connStore/findPacketInSendQueue/found, removing msg in queue:\n' + JSON.stringify(packet.msg) + '\n\n')
            //     isFound = true              
            // }
      
            if (isFound) {
                const callback = mainStore.messageQueue[i].callback
                if (callback) {
                    cb = callback
                }
                mainStore.messageQueue.splice(i, 1) // remove message
                break                       
            }
        }

        /* don't log msg as there's no way to correlate mobile msg responses with web msg requests */
        if (iq && !isFound) {
            hal.log('connStore/findPacketInSendQueue/can\'t find iq:\n' + JSON.stringify(packet) + '\n\n')
        }

        return cb
    }

    /* tested only for IK and KK handshakes */
    function handleNoiseHandshakeMsg(noisePattern: any, role?: any, contentBinArr?: Uint8Array) {
        if (!handshakeState) { return }

        let action = handshakeState.GetAction()
    
        if (action == noise.constants.NOISE_ACTION_FAILED) { // 16643
            hal.prod('handleNoiseHandshakeMsg/action/failed')
            return
        }

        else if (action == noise.constants.NOISE_ACTION_READ_MESSAGE) { // 16642
            if (!contentBinArr) { return }

            // hal.prod('handleNoiseHandshakeMsg/action/read')

            const fallbackSupported = false
            try {
                handshakeState.ReadMessage(contentBinArr, fallbackSupported)
            } catch (error) {
                hal.prod('handleNoiseHandshakeMsg/action/read ' + error)
                if (error == 'Error: NOISE_ERROR_MAC_FAILURE') {
                    hal.prod('handleNoiseHandshakeMsg/action/read/error/mobile might be using a different web key\n\n')
                }
                return
            }
        }

        else if (action == noise.constants.NOISE_ACTION_WRITE_MESSAGE) { // 16641
            // hal.prod('handleNoiseHandshakeMsg/action/write')

            const writeMessageBuf = handshakeState.WriteMessage()

            let noiseMessageBuf: any

            if (noisePattern == 'IK') {
                noiseMessageBuf = createNoiseMessage(writeMessageBuf, server.NoiseMessage.MessageType.IK_B)
                
            } else if (noisePattern == 'KK') {
                if (role == noise.constants.NOISE_ROLE_INITIATOR) {
                    noiseMessageBuf = createNoiseMessage(writeMessageBuf, server.NoiseMessage.MessageType.KK_A)
                } else if (role == noise.constants.NOISE_ROLE_RESPONDER) {
                    noiseMessageBuf = createNoiseMessage(writeMessageBuf, server.NoiseMessage.MessageType.KK_B)
                }
            }

            if (noiseMessageBuf) {
                webSocket.send(noiseMessageBuf)
            }
        }

        else if (action == noise.constants.NOISE_ACTION_SPLIT) { // 16644
            // hal.prod('handleNoiseHandshakeMsg/action/split')
    
            const remotePublicKey = handshakeState.GetRemotePublicKey()
            mainStore.mobilePublicKeyBase64 = Base64.fromUint8Array(remotePublicKey)
            // hal.prod('handleNoiseHandshakeMsg/action/split/mobilePublicKeyBase64: ' + mainStore.mobilePublicKeyBase64)
    
            const split = handshakeState.Split()
            cipherStateSend = split[0]
            cipherStateReceive = split[1]
    
            /* should try to permanently delete */
            /* handshakeState.free() is in the noiseprotocol spec but was not done in the wasm implementation */
            for (let prop in handshakeState) {
                delete handshakeState[prop]
            }
            handshakeState = undefined
    
            if (noisePattern == 'IK') {
                hal.prod('handleNoiseHandshakeMsg/action/split/noise handshake successful, logging in')
                mainStore.isPublicKeyAuthenticated = true
                mainStore.haveInitialHandshakeCompleted = true
                requestFeedItems('', 5, function() {})             
                login()
            } else if (noisePattern = 'KK') {
                hal.prod('handleNoiseHandshakeMsg/action/split/noise rehandshake successful')
                isNoiseReHandshakeCompleted.value = true
                requestFeedItems('', 5, function() {})
            }

            isConnectedToMobile.value = true
            nextTimeToConnectToMobile.value = 0
            noiseReconnectHandshakeRetries.value = 0
            sendReadyMessagesInQueue()

        }

        else {
            console.log("handleNoiseHandshakeMsg/action/can't find action")
            return
        }

        handleNoiseHandshakeMsg(noisePattern, role)
    }
    
    function initHandshake(noise: any, noisePattern: string, role: any) {
    
        /* create public key */
        // let [first, second] = noise.CreateKeyPair(noise.constants.NOISE_DH_CURVE25519)
        // const newPrivateKey = new Uint8Array(first)
        // const newPublicKey = new Uint8Array(second)
        // const newBase64PrivateKey = Base64.fromUint8Array(newPrivateKey)
        // const newBase64PublicKey = Base64.fromUint8Array(newPublicKey)
        // console.log("1: " + newBase64PrivateKey)
        // console.log("2: " + newBase64PublicKey)
    
        const pattern       = noisePattern
        const curve         = '25519'
        const cipher        = 'AESGCM'
        const hash          = 'SHA256'
        const protocolName  = `Noise_${pattern}_${curve}_${cipher}_${hash}`
        handshakeState = noise.HandshakeState(protocolName, role)
    
        let prologue
        let psk
        let remotePublicKey
        const privateKey = Base64.toUint8Array(mainStore.privateKeyBase64)

        if (noisePattern == 'KK') {
            if (mainStore.mobilePublicKeyBase64) {
                remotePublicKey = Base64.toUint8Array(mainStore.mobilePublicKeyBase64)
            } else {
                handshakeState = undefined
                hal.log('connStore/initHandshake/KK/no mobile key')
                return
            }
        }
    
        handshakeState.Initialize(
            prologue,
            privateKey,
            remotePublicKey,
            psk
        )
    }

    async function decodeProtobufToPacket(binArray: Uint8Array) {
        const err = server.Packet.verify(binArray)
        if (err) {
            console.log('decodeProtobufToPacket/verify/error ' + err)
            throw err
        }

        let message: any
        try {
            message = server.Packet.decode(binArray)
        } catch(error) {
            console.log('decodeProtobufToPacket/decode/error ' + error)
        }
        return message
    }

    async function decodeProtobufToWebContainer(binArray: Uint8Array) {
        const err = web.WebContainer.verify(binArray)
        if (err) {
            console.log('decodeProtobufToWebContainer/verify/error ' + err)
            throw err
        }

        let message: any
        try {
            message = web.WebContainer.decode(binArray)
        } catch(error) {
            console.log('decodeProtobufToWebContainer/decode/error ' + error)
        }
        return message
    }

    async function decodePacket(binArray: Uint8Array) {
        const packet = await decodeProtobufToPacket(binArray)
        return packet
    }

    async function decodeWebContainer(binArray: Uint8Array) {
        const webContainer = await decodeProtobufToWebContainer(binArray)
        return webContainer
    }    

    async function enqueue(packet: any, needAuth?: boolean, callback?: any) {
        mainStore.messageQueue.push({ 
            iqID: packet.iq?.id, 
            msgID: packet.msg?.id,
            packet: packet,
            needAuth: needAuth,
            callback: callback        
        })
        sendReadyMessagesInQueue()
        if (needAuth) {
            debounceMobileConnectionRetry()
        }
    }

    async function sendReadyMessagesInQueue() {
        clearTimeout(sendMessagesTimeoutID)
        sendMessagesTimeoutID = setTimeout(() => {
            sendMessagesInQueue()
        }, 100)
    }

    async function sendMessagesInQueue() {
        if (!isConnectedToServer.value) { return }

        if (isSendingMessages) {
            hal.log('connStore/sendMessagesInQueue/still sending messages, skip run')
            return
        }

        isSendingMessages = true

        hal.log('connStore/sendMessagesInQueue/num messages: ' + mainStore.messageQueue.length)
        for (let i = 0; i < mainStore.messageQueue.length; i++) {
            const message = mainStore.messageQueue[i]
            const packet = message.packet

            // certain packets like addKey do not need authentication
            if (!isConnectedToMobile.value && !mainStore.isPublicKeyAuthenticated && message.needAuth) {
                hal.log('connStore/sendMessagesInQueue/' + i.toString() + '/not authenticated, skip: ' + packet.iq?.id)
                continue
            }

            if (packet.iq) {
                hal.log('connStore/sendMessagesInQueue/' + i.toString() + '/send: ' + JSON.stringify(packet))
            }

            const encodedPacketBuf = server.Packet.encode(packet).finish()
            const buf = encodedPacketBuf.buffer.slice(encodedPacketBuf.byteOffset, encodedPacketBuf.byteLength + encodedPacketBuf.byteOffset)
            
            if (isConnectedToServer.value) {
                webSocket.send(buf)
            }
        }

        isSendingMessages = false

        /* waits 1 second before checking if the message queue is empty or not, if not, retry sending messages */
        setTimeout(() => {
            if (mainStore.messageQueue.length > 0) { 
                hal.log('connStore/sendMessagesInQueue/still have messages in queue, retry num: ' + sendMessagesRetryNum)

                if (sendMessagesRetryNum < 10) {
                    sendMessagesRetryNum++
                }
                setTimeout(() => {
                    sendMessagesInQueue()
                }, sendMessagesRetryNum * 3000)
            } else {
                sendMessagesRetryNum = 0
            }
        }, 1000)
    }

    async function clearMessagesInQueue() {
        // hal.log('connStore/clearMessagesInQueue')
        mainStore.messageQueue.splice(0, mainStore.messageQueue.length)
    }    

    async function addKeyToServer(callback?: Function) {
        hal.log('connStore/addKeyToServer')
        const packet = addKey()
        enqueue(packet, false, callback)
    }

    async function getMediaUrl(size: number, isResumable: boolean, callback?: Function) {
        hal.log('connStore/getMediaUrl')
        const packet = uploadMedia(size, isResumable)
        enqueue(packet, true, callback)
    }

    async function requestFeedItems(cursor: string, limit: number, callback?: Function) {
        console.log('connStore/requestFeedItems/cursor: ' + cursor)
        
        if (!cipherStateSend) {
            hal.log('homeMain/requestFeedItems/exit/undefined cipherStateSend')
            return
        }

        const webContainerBinArr = encodeFeedRequestWebContainer(cursor, limit)        
        const encryptedWebContainer = cipherStateSend.EncryptWithAd([], webContainerBinArr)

        const packet = createWebStanzaPacket(encryptedWebContainer)
        
        enqueue(packet, true, callback)            
    }

    async function requestGroupFeedItems(groupID: string, cursor: string, limit: number, callback?: Function) {
        if (!isConnectedToMobile.value) { return }
        console.log('connStore/requestGroupFeedItems/group: ' + groupID + ', cursor: ' + cursor)
        
        if (!cipherStateSend) {
            hal.log('connStore/requestGroupFeedItems/exit/undefined cipherStateSend')
            return
        }

        const webContainerBinArr = encodeGroupFeedRequestWebContainer(groupID, cursor, limit)        
        const encryptedWebContainer = cipherStateSend.EncryptWithAd([], webContainerBinArr)

        const packet = createWebStanzaPacket(encryptedWebContainer)
        
        enqueue(packet, true, callback)            
    }

    async function requestComments(postID: string, cursor: string, limit: number, callback?: Function) {
        if (!isConnectedToMobile.value) { return }
        console.log('connStore/requestComments/post: ' + postID + ', cursor: ' + cursor)
        
        if (!cipherStateSend) {
            hal.log('connStore/requestComments/exit/undefined cipherStateSend')
            return
        }

        const webContainerBinArr = encodeCommentsRequestWebContainer(postID, cursor, limit)        
        const encryptedWebContainer = cipherStateSend.EncryptWithAd([], webContainerBinArr)

        const packet = createWebStanzaPacket(encryptedWebContainer)
        
        enqueue(packet, true, callback)            
    }

    function login() {
        mainStore.loginMain()
    }

    function logout() {
        hal.log('connStore/logout/logging out...')

        nextTimeToConnectToMobile.value = 0
        noiseReconnectHandshakeRetries.value = 0
        
        webSocketConnectRetries = 0

        sendMessagesRetryNum = 0
    
        handshakeState = undefined
        cipherStateSend = undefined
        cipherStateReceive = undefined
        isNoiseReHandshakeCompleted.value = false

        clearTimeout(webSocketCloseTimeoutID)

        /* wait to disconnect fully first as the login screen will connect right away */
        if (isConnectedToServer.value) {
            isLoggingOut = true
            disconnectFromServer()
            return
        } else {
            /* user can log out even if not connected to server in offline mode */
            mainStore.logoutMain()
        }
    }

    return {
        isConnectedToServer,
        isConnectedToMobile,

        connectToMobile,
        nextTimeToConnectToMobile,

        isNoiseReHandshakeCompleted,
        noiseReconnectHandshakeRetries,
        fetchAbortController,

        isUserFirstClickCompleted,

        devMode,
        version,
        isDebug,

        connectToServerIfNeeded, 
        disconnectFromServer, 
        generatePublicKeyIfNeeded,
        clearPublicKey, 
        waitForUserToRegenKey,

        addKeyToServer,

        clearMessagesInQueue,

        requestFeedItems,
        requestGroupFeedItems,
        requestComments,

        getMediaUrl,

        login,
        logout
    }
})
