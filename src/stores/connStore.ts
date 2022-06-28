import { defineStore } from 'pinia'
import { ref, watch } from 'Vue'
import hal from '../common/halogger'
import hacrypto from '../common/hacrypto'

import { Base64 } from 'js-base64'

import { network } from '../common/network'

import { useMainStore } from './mainStore'

import { server } from '../proto/server.js'

import createNoise from "noise-c.wasm"
import { EventEmitterListener } from 'protobufjs'

export const useConnStore = defineStore('conn', () => {

    const mainStore = useMainStore()
    let { sendPing, addKey, removeKey, check, sendDemoWebStanza, uploadMedia } = network()

    let connectionTimer: any    // timer used for debouncing
    let sendMessagesTimer: any  // timer used for debouncing
    let isSendingMessages: boolean = false
    let sendMessagesRetryNum: number = 0

    let isLoggingOut: boolean = false

    let webSocket: WebSocket
    let noise: any
    let handshakeState: any
    let cipherStateSend: { EncryptWithAd: (arg0: never[], arg1: string) => any }
    let cipherStateReceive: { DecryptWithAd: (arg0: never[], arg1: any) => any }

    async function connectToServerIfNeeded() {
        hal.log('connStore/connectToServerIfNeeded')

        if (mainStore.isConnectedToServer) {
            hal.log('connStore/connectToServerIfNeeded/already connected: ' + mainStore.isConnectedToServer)
            return
        }

        clearTimeout(connectionTimer)
        connectionTimer = setTimeout(() => {
            connectToServer()
        }, 100)
    }


    async function websocketOnopen(event: any) {
        hal.log('connStore/websocketOnopen/webSocket/onopen ')
    
        mainStore.isConnectedToServer = true

        webSocket.removeEventListener('message', handleInboundMsg)
        webSocket.addEventListener('message', handleInboundMsg)

        addKeyToServer(function() {
            hal.log('connStore/connectToServer/added public key successfully')
            mainStore.haveAddedPublicKeyToServer = true
        })

        sendReadyMessagesInQueue()
    }

    async function wsOncloseWillReconnect(event: any) {
        hal.log('connStore/wsOncloseWillReconnect')
        mainStore.isConnectedToServer = false

        /* try to reconnect */
        // connectToServerIfNeeded()
    }

    async function wsOnclose(event: any) {
        hal.log('connStore/wsOnclose ')
        mainStore.isConnectedToServer = false

        if (isLoggingOut) {
            isLoggingOut = false
            mainStore.logoutMain()
        }
    }    

    async function connectToServer() {
        hal.log('connStore/connectToServer')

        // const server = "wss://localhost:7071"
        const server = 'wss://ws-test.halloapp.net/ws'
        const newWebSocket = new WebSocket(server)
        newWebSocket.binaryType = 'arraybuffer'
    
        newWebSocket.removeEventListener('open', websocketOnopen)
        newWebSocket.addEventListener('open', websocketOnopen)

        newWebSocket.removeEventListener('close', wsOncloseWillReconnect)
        newWebSocket.addEventListener('close', wsOncloseWillReconnect)
    
        webSocket = newWebSocket
    }

    function disconnectFromServer() {
        hal.log('connStore/disconnectFromServer')
    
        /* remove reconnecting onclose handler */
        webSocket.removeEventListener('close', wsOncloseWillReconnect)
    
        /* add onclose handler just to track closing of socket */
        webSocket.removeEventListener('close', wsOnclose)
        webSocket.addEventListener('close', wsOnclose)

        webSocket.close()
    }

    function generatePublicKeyIfNeeded() {
        if (!mainStore.privateKeyBase64) {
            hal.log('connStore/generatePublicKeyIfNeeded/keypair not found, generate keypair')
            const keypair = hacrypto.keygen()
            mainStore.privateKeyBase64 = Base64.fromUint8Array(keypair.secretKey)
            mainStore.publicKeyBase64 = Base64.fromUint8Array(keypair.publicKey)
        }
        // hal.log("generatePublicKeyIfNeeded/privateKey: " + mainStore.privateKeyBase64)
        hal.prod("generatePublicKeyIfNeeded/publicKey: " + mainStore.publicKeyBase64)
    }

    function clearPublicKey() {
        mainStore.privateKeyBase64 = ''
        mainStore.publicKeyBase64 = ''
    }

    function waitForUserToRegenKey() {
        clearPublicKey()
        disconnectFromServer()
    }

    async function handleInboundMsg(event: any) {
        hal.log('connStore/handleInboundMsg')
        const eventDataBinArr = new Uint8Array(event.data)
        const packet = await decodePacket(eventDataBinArr)
        
        const iq = packet.iq
        const id = iq?.id

        const ping = iq?.ping
    
        const msg = packet?.msg
        const webStanza = msg?.webStanza

        if (ping) {

            sendPing(webSocket)

        } else if (webStanza) {
    
            if (!noise) {
                createNoise(function (noise: any) { noise = noise })
            }
    
            if (mainStore.isPublicKeyAuthenticated && mainStore.haveInitialHandshakeCompleted) {
                const decrypted = cipherStateReceive.DecryptWithAd([], eventDataBinArr)
                const decoded = new TextDecoder().decode(decrypted)
                hal.log('connStore/handleInboundMsg/webStanza/decrypted: ' + decoded)
            } else if (!mainStore.haveInitialHandshakeCompleted) {
                if (!handshakeState) {
                    initHandshake(noise)
                }
                handleNoiseHandshakeMsg(webStanza.content)
            }
    
        } else {
    
            let isFound = false

            for (let i = 0; i < mainStore.messageQueue.length; i++) {
                if (mainStore.messageQueue[i].id == id) {
                    hal.log('connStore/handleInboundMsg/found msg in queue:\n' + JSON.stringify(packet) + '\n\n')
                    isFound = true
                    const callback = mainStore.messageQueue[i].callback
                    if (callback) {
                        callback()
                    }
                    // remove message
                    mainStore.messageQueue.splice(i, 1)
                    
                    break
                }
            }

            if (!isFound) {
                hal.log('connStore/handleInboundMsg/unknown:\n    ' + JSON.stringify(packet))
            }
    
        }
    }


    function handleNoiseHandshakeMsg(contentBinArr: any) {
        let action = handshakeState.GetAction()
    
        if (action == noise.constants.NOISE_ACTION_FAILED) { // 16643
            hal.prod('handleNoiseHandshakeMsg/action/failed')
    
        } else if (action == noise.constants.NOISE_ACTION_READ_MESSAGE) { // 16642
            hal.prod('handleNoiseHandshakeMsg/action/read')
            const fallbackSupported = false      
            handshakeState.ReadMessage(contentBinArr, fallbackSupported)
    
        } else if (action == noise.constants.NOISE_ACTION_WRITE_MESSAGE) {
            hal.prod('handleNoiseHandshakeMsg/action/write')
            const writeMessage = handshakeState.WriteMessage()
            // todo: need to send writeMessage as proto webstanza
            // webSocket.send(writeMessage)
        }
    
        action = handshakeState.GetAction()
    
        if (action == noise.constants.NOISE_ACTION_SPLIT) { // 16644
            hal.prod('handleNoiseHandshakeMsg/action/split')
    
            const remotePublicKey = handshakeState.GetRemotePublicKey()
            const mobilePublicKeyBase64 = Base64.fromUint8Array(remotePublicKey)
            hal.prod('handleNoiseHandshakeMsg/mobilePublicKeyBase64: ' + mobilePublicKeyBase64)
        
            const split = handshakeState.Split()
            cipherStateSend = split[0]
            cipherStateReceive = split[1]
    
            mainStore.isPublicKeyAuthenticated = true
            mainStore.haveInitialHandshakeCompleted = true
    
            alert('Noise handshake successful, logging in')
            login()
        }
    }
    
    async function initHandshake(noise: any) {
    
        /* create public key */
        // let [first, second] = noise.CreateKeyPair(noise.constants.NOISE_DH_CURVE25519)
        // const newPrivateKey = new Uint8Array(first)
        // const newPublicKey = new Uint8Array(second)
        // const newBase64PrivateKey = Base64.fromUint8Array(newPrivateKey)
        // const newBase64PublicKey = Base64.fromUint8Array(newPublicKey)
        // console.log("1: " + newBase64PrivateKey)
        // console.log("2: " + newBase64PublicKey)
    
        const pattern   = 'IK'
        const curve     = '25519'
        const cipher    = 'ChaChaPoly'
        const hash      = 'BLAKE2b'
        const protocolName = `Noise_${pattern}_${curve}_${cipher}_${hash}`
        handshakeState = noise.HandshakeState(protocolName, noise.constants.NOISE_ROLE_RESPONDER)
        hal.log("initHandshake: ")
        hal.dir(handshakeState)
    
        // let cipherStateSend: { EncryptWithAd: (arg0: never[], arg1: string) => any }
        // let cipherStateReceive: { DecryptWithAd: (arg0: never[], arg1: any) => any }
    
        let prologue
        let psk
        let remotePublicKey
        const privateKey = Base64.toUint8Array(mainStore.privateKeyBase64)
    
        handshakeState.Initialize(
            prologue,
            privateKey,
            remotePublicKey,
            psk
        )
    
        // webSocket.removeEventListener('message', handleHandshakeMessage)
        // webSocket.addEventListener('message', handleHandshakeMessage)
    
        /* send message */
        // let counter = 0
        // setInterval(function () {
        //     console.log('handleHandshakeMessage/action/split/sent...')
        //     const encrypted = cipherStateSend.EncryptWithAd([], 'Tony is here ' + counter)
        //     webSocket.send(encrypted)
        //     counter++
        // }, 3000)
    }

    async function decodeProtobufToPacket(binArray: Uint8Array) {
        const err = server.Packet.verify(binArray)
        if (err) {
            throw err
        }
        const message = server.Packet.decode(binArray)
        return message
    }

    async function decodePacket(binArray: Uint8Array) {
        const packet = await decodeProtobufToPacket(binArray)
        const iq = packet.iq
        return packet
    }

    async function enqueue(packet: any, needAuth?: boolean, callback?: any) {
        mainStore.messageQueue.push({ 
            id: packet.iq?.id, 
            packet: packet,
            needAuth: needAuth,
            callback: callback,            
        })
        sendReadyMessagesInQueue()
    }

    async function sendReadyMessagesInQueue() {
        clearTimeout(sendMessagesTimer)
        sendMessagesTimer = setTimeout(() => {
            sendMessagesInQueue()
        }, 100)
    }

    async function sendMessagesInQueue() {
        if (!mainStore.isConnectedToServer) { return }

        if (isSendingMessages) {
            hal.log('connStore/sendMessagesInQueue/still sending messages, skip run')
            return
        }

        isSendingMessages = true

        hal.log('connStore/sendMessagesInQueue/num messages: ' + mainStore.messageQueue.length)
        for (let i = 0; i < mainStore.messageQueue.length; i++) {
            const message = mainStore.messageQueue[i]
            const packet = message.packet

            // temporary: send all messages for now regardless if it needs auth or not
            // certain packets like addKey do not need authentication
            // if (!mainStore.isPublicKeyAuthenticated && message.needAuth) {
            //     hal.log('connStore/sendMessagesInQueue/' + i.toString() + '/not authenticated, skip: ' + packet.iq?.id)
            //     continue
            // }

            hal.log('connStore/sendMessagesInQueue/' + i.toString() + '/send:\n' + JSON.stringify(packet) + '\n\n')
 
            const packetProto = server.Packet.encode(packet).finish()
            const buf = packetProto.buffer.slice(packetProto.byteOffset, packetProto.byteLength + packetProto.byteOffset)
       
            webSocket.send(buf)
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
        hal.log('connStore/clearMessagesInQueue')
        mainStore.messageQueue.splice(0, mainStore.messageQueue.length)
    }    

    async function addKeyToServer(callback?: Function) {
        hal.log('connStore/addKey')
        const packet = addKey()
        enqueue(packet, false, callback)
    }

    async function getMediaUrl(size: number, callback?: Function) {
        hal.log('connStore/getMediaUrl')
        const packet = uploadMedia(size)
        enqueue(packet, true, callback)
    }

    function login() {
        mainStore.loginMain()
    }

    function logout() {
        hal.log('connStore/logout/logging out...')

        /* wait to disconnect fully first as the login screen will connect right away */
        if (mainStore.isConnectedToServer) {
            isLoggingOut = true
            disconnectFromServer()
            return
        } 

        /* user can log out even if not connected to server in offline mode */
        mainStore.logoutMain()
    }

    return {
        connectToServerIfNeeded, 
        disconnectFromServer, 
        generatePublicKeyIfNeeded,
        clearPublicKey, 
        waitForUserToRegenKey,

        addKeyToServer,

        clearMessagesInQueue,
        getMediaUrl,

        login,
        logout        
    }
})
