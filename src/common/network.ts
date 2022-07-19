import { ref, watch } from 'vue'
import { server } from '../proto/server.js'
import { web } from '../proto/web.js'
import { nanoid } from 'nanoid'
import { Base64 } from 'js-base64'

import hal from './halogger'

import { useMainStore } from '../stores/mainStore'

export function network() {

    const mainStore = useMainStore()

    const createPing = () => {
        let id = nanoid()
    
        let iq = server.Iq.create({
            id: id,
            type: server.Iq.Type.GET, // type does not matter for ping
            ping: server.Ping.create()
        })

        const packet = server.Packet.create({ iq: iq })
        const packetProto = server.Packet.encode(packet).finish()
        const buf = packetProto.buffer.slice(packetProto.byteOffset, packetProto.byteLength + packetProto.byteOffset)
        
        hal.log('network/createPing: ' + JSON.stringify(packet) + '\n\n')

        return buf
    }

    const addKey = () => {
        let id = nanoid()
    
        let publicKey = Base64.toUint8Array(mainStore.publicKeyBase64)
        let webClientInfo = server.WebClientInfo.create({
            action: server.WebClientInfo.Action.ADD_KEY,
            staticKey: publicKey
        })
        let iq = server.Iq.create({
            id: id,
            type: server.Iq.Type.SET,
            webClientInfo: webClientInfo
        })

        const packet = server.Packet.create({ iq: iq })
        return packet
    }

    function createWebStanza(content: Uint8Array) {
        const id = nanoid()
        const publicKey = Base64.toUint8Array(mainStore.publicKeyBase64)

        // todo: clarify if the staticKey is web or mobile
        const webStanza = server.WebStanza.create({
            staticKey: publicKey,
            content: content
        })

        // what about: toUid, fromUid, retryCount, rerequestCount
        const msg = server.Msg.create({
            id: id,
            type: server.Msg.Type.NORMAL,
            webStanza: webStanza
        })
    
        const packet = server.Packet.create({ msg: msg })
        const packetProto = server.Packet.encode(packet).finish()
        const packetBuf = packetProto.buffer.slice(packetProto.byteOffset, packetProto.byteLength + packetProto.byteOffset)

        hal.log('network/createWebStanza/packet:\n' + JSON.stringify(packet) + '\n\n')

        return packetBuf       
    }

    const createNoiseMessageIKB = (contentBuf: any) => {
        const contentBinArr = new Uint8Array(contentBuf)

        const noiseMessage = web.NoiseMessage.create({
            messageType: web.NoiseMessage.MessageType.IK_B,
            content: contentBinArr
        })

        const webContainer = web.WebContainer.create({
            noiseMessage: noiseMessage
        })

        hal.log('network/createNoiseMessageIKB/webContainer:\n' + JSON.stringify(webContainer) + '\n\n')

        const webContainerProto = web.WebContainer.encode(webContainer).finish()
        const webContainerBuf = webContainerProto.buffer.slice(webContainerProto.byteOffset, webContainerProto.byteLength + webContainerProto.byteOffset)
        const webContainerBinArr = new Uint8Array(webContainerBuf)

        const packetBuf = createWebStanza(webContainerBinArr)

        return packetBuf
    }
    
    function removeKey(websocket: any) {
        let id = nanoid()
    
        let publicKey = Base64.toUint8Array(mainStore.publicKeyBase64)
        let webClientInfo = server.WebClientInfo.create({
            action: server.WebClientInfo.Action.REMOVE_KEY,
            staticKey: publicKey
        })
        let iq = server.Iq.create({
            id: id,
            type: server.Iq.Type.SET,
            webClientInfo: webClientInfo
        })

        // packet -> iq -> webClientInfo
        let message = server.Packet.create({ iq: iq })
        let buffer = server.Packet.encode(message).finish()
    
        websocket.send(buffer.buffer)
        hal.log('network/removeKey ' + id)
    }
    
    function check(websocket: any) {
        let id = nanoid()
    
        let publicKey = Base64.toUint8Array(mainStore.publicKeyBase64)
        let webClientInfo = server.WebClientInfo.create({
            action: server.WebClientInfo.Action.IS_KEY_AUTHENTICATED,
            staticKey: publicKey
        })
        let iq = server.Iq.create({
            id: id,
            type: server.Iq.Type.GET,
            webClientInfo: webClientInfo
        })

        // packet -> iq -> webClientInfo
        let message = server.Packet.create({ iq: iq })
        let buffer = server.Packet.encode(message).finish()
    
        websocket.send(buffer.buffer)
        hal.log('network/check ' + id)
    }

    const uploadMedia = (size: number) => {
        let id = nanoid()

        let uploadMedia = server.UploadMedia.create({
            type: server.UploadMedia.Type.DIRECT,
            size: size,
        })
        let iq = server.Iq.create({
            id: id,
            type: server.Iq.Type.GET,
            uploadMedia: uploadMedia
        })

        const packet = server.Packet.create({ iq: iq })

        return packet

        // const packetProto = server.Packet.encode(packet).finish()
        // mainStore.messageQueue.push({ id: id, packet: packet, callback: callback })
        // websocket.send(packetProto.buffer)
    }

    return { createPing, addKey, removeKey, createNoiseMessageIKB, check, uploadMedia }
}
