import { ref, watch } from 'vue'
import { server } from '../proto/server.js'
import { nanoid } from 'nanoid'
import { Base64 } from 'js-base64'

import hal from './halogger'

import { useMainStore } from '../stores/mainStore'

export function network() {

    const mainStore = useMainStore()

    const sendPing = (websocket: any) => {
        let id = nanoid()
    
        let iq = server.Iq.create({
            id: id,
            type: server.Iq.Type.GET, // type does not matter for ping
            ping: server.Ping.create()
        })

        const packet = server.Packet.create({ iq: iq })
        const packetProto = server.Packet.encode(packet).finish()
        const buf = packetProto.buffer.slice(packetProto.byteOffset, packetProto.byteLength + packetProto.byteOffset)
        
        hal.log('network/sendPing: ' + JSON.stringify(packet) + '\n\n')

        websocket.send(buf)
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

    function sendDemoWebStanza(websocket: any) {
        let id = nanoid()
        let publicKey = Base64.toUint8Array(mainStore.publicKeyBase64)
    
        let webStanza = server.WebStanza.create({
            staticKey: publicKey,
            content: publicKey
        })
    
        // what about: toUid, fromUid, retryCount, rerequestCount
        let msg = server.Msg.create({
            id: id,
            type: server.Msg.Type.NORMAL,
            webStanza: webStanza
        })
    
        // packet -> msg -> webStanza
        let packet = server.Packet.create({ msg: msg })
        let buffer = server.Packet.encode(packet).finish()
    
        websocket.send(buffer.buffer)
        hal.log('network/sendDemoWebStanza ' + id)
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

    return { sendPing, addKey, removeKey, sendDemoWebStanza, check, uploadMedia }
}
