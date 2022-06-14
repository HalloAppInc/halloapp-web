import { defineStore } from 'pinia'
import { ref, watch } from 'Vue'
import hal from '../common/halogger'
import hacrypto from '../common/hacrypto'

import { Base64 } from 'js-base64'

import { network } from '../common/network'

import { useMainStore } from './mainStore'

import { server } from '../proto/server.js'

import createNoise from "noise-c.wasm"

export const useConnStore = defineStore('conn', () => {

    const mainStore = useMainStore()
    let { addKey, removeKey, check, sendDemoWebStanza } = network()

    let connectionTimer: any
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

    async function connectToServer() {
        hal.log('connStore/connectToServer')

        // const server = "wss://localhost:7071"
        const server = 'wss://ws-test.halloapp.net/ws'
        const newWebSocket = new WebSocket(server)
        newWebSocket.binaryType = 'arraybuffer'
    
        newWebSocket.onopen = function(event) {
            hal.log("connectToServer/webSocket/onopen: " + event)
    
            mainStore.isConnectedToServer = true
    
            newWebSocket.removeEventListener('message', handleMsg)
            newWebSocket.addEventListener('message', handleMsg)
    
            if (!mainStore.haveAddedPublicKeyToServer) {
                addKey(newWebSocket, function() {
                    hal.log('connectToServer/added public key successfully')
                    mainStore.haveAddedPublicKeyToServer = true
                })
            }
        }
    
        newWebSocket.onclose = function(event) {
            hal.log("connectToServer/webSocket/onclose: " + event)
            mainStore.isConnectedToServer = false
            if (!mainStore.isWaitingForUserToRegenKey) {
                // connectToServerIfNeeded()
            }
        }
    
        webSocket = newWebSocket
    }

    function disconnectFromServer() {
        hal.log('connStore/disconnectFromServer')
        webSocket.close()
    }

    function generatePublicKeyIfNeeded() {
        if (!mainStore.privateKeyBase64) {
            hal.log("generatePublicKeyIfNeeded/keypair not found, generate keypair")
            const keypair = hacrypto.keygen()
            mainStore.privateKeyBase64 = Base64.fromUint8Array(keypair.secretKey)
            mainStore.publicKeyBase64 = Base64.fromUint8Array(keypair.publicKey)
        }
        hal.log("generatePublicKeyIfNeeded/privateKey: " + mainStore.privateKeyBase64)
        hal.prod("generatePublicKeyIfNeeded/publicKey: " + mainStore.publicKeyBase64)
    }

    function clearPublicKey() {
        mainStore.privateKeyBase64 = ''
        mainStore.publicKeyBase64 = ''
    }

    function setWaitForUserToRegenKey(wait: boolean) {
        mainStore.isWaitingForUserToRegenKey = wait
    }

    function waitForUserToRegenKey() {
        setWaitForUserToRegenKey(true)
        clearPublicKey()
        disconnectFromServer()
    }

    async function handleMsg(event: any) {
        const eventDataBinArr = new Uint8Array(event.data)
        const packet = await decodePacket(eventDataBinArr)
        const iq = packet.iq
        const id = iq?.id
    
        const msg = packet?.msg
        const webStanza = msg?.webStanza
    
        if (webStanza) {
    
            if (!noise) {
                createNoise(function (noise: any) { noise = noise })
            }
    
            if (mainStore.isPublicKeyAuthenticated && mainStore.haveInitialHandshakeCompleted) {
                const decrypted = cipherStateReceive.DecryptWithAd([], eventDataBinArr)
                const decoded = new TextDecoder().decode(decrypted)
                hal.log('handleMsg/webStanza/decrypted: ' + decoded)
            } else if (!mainStore.haveInitialHandshakeCompleted) {
                if (!handshakeState) {
                    initHandshake(noise)
                }
                handleNoiseHandshakeMsg(webStanza.content)
            }
    
        } else {
    
            for (let i = 0; i < mainStore.messageQueue.length; i++) {
                if (mainStore.messageQueue[i].id == id) {
                    const callback = mainStore.messageQueue[i].callback
                    if (callback) {
                        callback()
                    }
                    // remove message
                    mainStore.messageQueue.splice(i, 1)
                    break
                }
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
            mainStore.login()
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
        hal.log("decodePacket/packet: ", packet)
    
        const iq = packet.iq
        console.log('decodePacket/packet/iq ' + iq)
        return packet
    }

    return { 
        connectToServerIfNeeded, 
        disconnectFromServer, 
        generatePublicKeyIfNeeded,
        clearPublicKey, 
        setWaitForUserToRegenKey, 
        waitForUserToRegenKey }    
})