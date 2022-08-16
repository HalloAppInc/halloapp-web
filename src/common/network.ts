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
        const id = nanoid()
    
        const publicKey = Base64.toUint8Array(mainStore.publicKeyBase64)
        const webClientInfo = server.WebClientInfo.create({
            action: server.WebClientInfo.Action.ADD_KEY,
            staticKey: publicKey
        })
        const iq = server.Iq.create({
            id: id,
            type: server.Iq.Type.SET,
            webClientInfo: webClientInfo
        })

        const packet = server.Packet.create({ iq: iq })
        return packet
    }

    function createWebStanzaPacket(content: Uint8Array) {
        const id = nanoid()
        const publicKey = Base64.toUint8Array(mainStore.publicKeyBase64)

        const webStanza = server.WebStanza.create({
            staticKey: publicKey, // web public key
            content: content
        })

        const msg = server.Msg.create({
            id: id,
            type: server.Msg.Type.NORMAL,
            webStanza: webStanza
        })
    
        const packet = server.Packet.create({ msg: msg })
        hal.log('network/createWebStanzaPacket/packet:\n' + JSON.stringify(packet) + '\n\n')

        return packet       
    }

    const createNoiseMessageIKB = (contentBuf: any) => {
        const contentBinArr = new Uint8Array(contentBuf)

        const id = nanoid()
        const publicKey = Base64.toUint8Array(mainStore.publicKeyBase64)        

        const noiseMessage = server.NoiseMessage.create({
            messageType: server.NoiseMessage.MessageType.IK_B,
            content: contentBinArr
        })

        const webStanza = server.WebStanza.create({
            staticKey: publicKey,
            noiseMessage: noiseMessage
        })

        const msg = server.Msg.create({
            id: id,
            type: server.Msg.Type.NORMAL,
            webStanza: webStanza
        })        

        hal.log('network/createNoiseMessageIKB/webStanza:\n' + JSON.stringify(webStanza) + '\n\n')

        const packet = server.Packet.create({ msg: msg })
        const packetProto = server.Packet.encode(packet).finish()
        const packetBuf = packetProto.buffer.slice(packetProto.byteOffset, packetProto.byteLength + packetProto.byteOffset)

        return packetBuf
    }

    // const createNoiseMessageIKB = (contentBuf: any) => {
    //     const contentBinArr = new Uint8Array(contentBuf)

    //     const noiseMessage = web.NoiseMessage.create({
    //         messageType: web.NoiseMessage.MessageType.IK_B,
    //         content: contentBinArr
    //     })

    //     const webContainer = web.WebContainer.create({
    //         noiseMessage: noiseMessage
    //     })

    //     hal.log('network/createNoiseMessageIKB/webContainer:\n' + JSON.stringify(webContainer) + '\n\n')

    //     const webContainerProto = web.WebContainer.encode(webContainer).finish()
    //     const webContainerBuf = webContainerProto.buffer.slice(webContainerProto.byteOffset, webContainerProto.byteLength + webContainerProto.byteOffset)
    //     const webContainerBinArr = new Uint8Array(webContainerBuf)

    //     const packetBuf = createWebStanza(webContainerBinArr)

    //     return packetBuf
    // }
    
    const encodeFeedRequestWebContainer = (cursor: string) => {
        const id = nanoid()

        const feedRequest = web.FeedRequest.create({
            id: id,
            type: web.FeedType.HOME,
            cursor: cursor,
            limit: 10
        })

        const webContainer = web.WebContainer.create({
            feedRequest: feedRequest
        })

        hal.log('network/encodeFeedRequestWebContainer:\n' + JSON.stringify(webContainer) + '\n\n')

        const webContainerProto = web.WebContainer.encode(webContainer).finish()
        const webContainerBuf = webContainerProto.buffer.slice(webContainerProto.byteOffset, webContainerProto.byteLength + webContainerProto.byteOffset)
        const webContainerBinArr = new Uint8Array(webContainerBuf)

        return webContainerBinArr
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

        let message = server.Packet.create({ iq: iq })
        let buffer = server.Packet.encode(message).finish()
    
        websocket.send(buffer.buffer)
        hal.log('network/check ' + id)
    }

    const uploadMedia = (size: number, isResumable: boolean) => {
        let id = nanoid()

        const type = isResumable ? server.UploadMedia.Type.RESUMABLE : server.UploadMedia.Type.DIRECT

        let uploadMedia = server.UploadMedia.create({
            type: type,
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

    return { 
        addKey, removeKey, createPing,
        check,
        createNoiseMessageIKB, 
        createWebStanzaPacket, 
        encodeFeedRequestWebContainer,
        uploadMedia 
    }
}
