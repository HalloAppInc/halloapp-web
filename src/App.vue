<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue'

import Sidebar from './components/Sidebar.vue'
import Sidestrip from './components/Sidestrip.vue'
import MainPanel from './components/MainPanel.vue'
import Popup from "./components/Popup.vue"

import hal from './common/halogger'
import qrCodeStyling from 'qr-code-styling'

import { useMainStore } from './stores/mainStore'

import hacrypto from './common/hacrypto'
import { Base64 } from "js-base64"

import createNoise from "noise-c.wasm"

import { server } from "./proto/server.js"
import { nanoid } from 'nanoid'

const mainStore = useMainStore()
const chooseColorScheme = ref(true) // for color scheme

if (!mainStore.privateKeyBase64) {
    hal.log("App/keypair not found, generate keypair")
    const keypair = hacrypto.keygen()
    mainStore.privateKeyBase64 = Base64.fromUint8Array(keypair.secretKey)
    mainStore.publicKeyBase64 = Base64.fromUint8Array(keypair.publicKey)
}

console.log("App/privateKey: " + mainStore.privateKeyBase64)
console.log("App/publicKey: " + mainStore.publicKeyBase64)

let isDebug = false

const gothamFontUrl = ref("https://halloapp.com/fonts/gotham/woff2/Gotham-Book_Web.woff2")
const gothamMediumFontUrl = ref("https://halloapp.com/fonts/gotham/woff2/Gotham-Medium_Web.woff2")


const $qrCode = ref(null)


let devCORSWorkaroundUrlPrefix = ""
if (process.env.NODE_ENV?.toString() == "development") {
    isDebug = true 
    devCORSWorkaroundUrlPrefix = "https://cors-anywhere.herokuapp.com/"
}


applyPlatformSpecifics()
loadFonts()
// init() // probably same as connect

// connect()

async function connectToServer() {
    const server = "wss://ws-test.halloapp.net/ws"
    const webSocket = new WebSocket(server)
    webSocket.binaryType = "arraybuffer"

    webSocket.onopen = function(event) {
        hal.log("conn/opened: " + event)
        return webSocket
    }
}

async function init() {

    let webSocket

    hal.log('init/logged into app')
    if (!mainStore.isConnectedToServer) {
        hal.log('init/not connected to server')
        // connect
        webSocket = await connectToServer()
    }
    
    if (!mainStore.isHandshakeCompleted) {

        if(mainStore.haveMobilePublicKey) {
            // start handshake as initiator
        } else {
            // start handshake as responder
        }

        // complete handshake
        // log into app

    }
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

    let packet = server.Packet.create({ msg: msg })
    let buffer = server.Packet.encode(packet).finish()

    websocket.send(buffer.buffer)
    console.log("--> sendDemoWebStanza ")
}

function addKey(websocket: any) {
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
    let message = server.Packet.create({ iq: iq })
    let buffer = server.Packet.encode(message).finish()

    websocket.send(buffer.buffer)
    console.log("--> add key " + id)
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
    let message = server.Packet.create({ iq: iq })
    let buffer = server.Packet.encode(message).finish()

    websocket.send(buffer.buffer)
    console.log("--> remove key " + id)
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

    // console.log("message:")
    // console.dir(message)

    websocket.send(buffer.buffer)
    console.log("--> check " + id)
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
    
}

function connect() {

    /* 
     * 
     * startHandshake
     * isAuthenticated
     */
    let state = ''

    // const server = "wss://localhost:7071"
    const server = "wss://ws-test.halloapp.net/ws"
    // const server = "wss://demo.piesocket.com/v3/channel_1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self"
    const webSocket = new WebSocket(server)
    webSocket.binaryType = "arraybuffer"

    webSocket.onmessage = function(event) {
        console.log("got message")
        if (state != 'startHandshake') {
            hal.log("conn/inbound: " + event.data)
            console.dir(event)

            const array = new Uint8Array(event.data)
            decodePacket(array)
        }
    }

    webSocket.onopen = function(event) {
        hal.log("conn/opened: " + event)
        // console.dir(event)

        if (mainStore.connectionState == 'isAuthenticated') {
            // check(webSocket)
        }
        // sendDemoWebStanza(webSocket)
        // addKey(webSocket)
        // removeKey(webSocket)
        // check(webSocket)
        
    }


    function create() {
        createNoise(function (noise: any) {

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
            let handshakeState = noise.HandshakeState(protocolName, noise.constants.NOISE_ROLE_RESPONDER)
            console.log("handshakeState: ")
            console.dir(handshakeState)


            let cipherStateSend: { EncryptWithAd: (arg0: never[], arg1: string) => any }
            let cipherStateReceive: { DecryptWithAd: (arg0: never[], arg1: any) => any }


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

            // state = 'startHandshake'

            function handleHandshakeMessage(event: any) {

                if (state == 'isAuthenticated') {
                    const gotten = new Uint8Array(event.data)
                    console.log('gotten: ' + gotten)
                    const decrypted = cipherStateReceive.DecryptWithAd([], gotten)
                    

                    const decoded = new TextDecoder().decode(decrypted)

                    console.log('decrypted: ' + decoded)

                    return
                }


                const action = handshakeState.GetAction()
                if (action == noise.constants.NOISE_ACTION_FAILED) { // 16643
                    console.log('handleHandshakeMessage/action/failed')
                } else if (action == noise.constants.NOISE_ACTION_READ_MESSAGE) { // 16642
                    console.log('handleHandshakeMessage/action/read')
                
                    const fallbackSupported = false
                    const array = new Uint8Array(event.data)

                    handshakeState.ReadMessage(array, fallbackSupported)

                    handleHandshakeMessage(event)
                } else if (action == noise.constants.NOISE_ACTION_WRITE_MESSAGE) {
                    console.log('handleHandshakeMessage/action/write')
                    const writeResponse = handshakeState.WriteMessage()
                    webSocket.send(writeResponse)

                    handleHandshakeMessage(event)
                } else if (action == noise.constants.NOISE_ACTION_SPLIT) { // 16644
                    console.log('handleHandshakeMessage/action/split')

                    const remotePublicKey = handshakeState.GetRemotePublicKey()
                    console.log('remotePublicKey: ' + Base64.fromUint8Array(remotePublicKey))
                

                    const split = handshakeState.Split()
                    cipherStateSend = split[0]
                    cipherStateReceive = split[1]

                    let counter = 0
                    setInterval(function () {
                        console.log('handleHandshakeMessage/action/split/sent...')
                        const encrypted = cipherStateSend.EncryptWithAd([], 'Tony is here ' + counter)
                        webSocket.send(encrypted)
                        counter++
                    }, 3000)

                    state = 'isAuthenticated'

                }
            }

            webSocket.addEventListener('message', handleHandshakeMessage)
        })
    }

}

function fakeAuth() {
    mainStore.login()
}

function applyPlatformSpecifics() {
    const userAgent = navigator.userAgent || navigator.vendor || (<any>window).opera

    if ('ontouchstart' in document.documentElement && userAgent.match(/Mobi/)) {
        mainStore.isMobile = true
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !(<any>window).MSStream) {
        mainStore.isIOS = true
    }
    if (/android/i.test(userAgent)) {
        mainStore.isAndroid = true
    }

    if (userAgent.indexOf('Safari') != -1 && userAgent.indexOf('Chrome') == -1) {
        mainStore.isSafari = true
    }
}

/* 
    Fonts are loaded dynamically to make development on localhost easier 
        1. Assets on AWS are cors enabled and thus a proxy server is needed on localhost
        2. There's no way to use variables in @font-face src's url in css
*/
function loadFonts() {

    let normalFont = gothamFontUrl.value
    let mediumFont = gothamMediumFontUrl.value

    // non-Safari browsers require a proxy server for font fetches
    if (!mainStore.isSafari) {
        normalFont = devCORSWorkaroundUrlPrefix + normalFont
        mediumFont = devCORSWorkaroundUrlPrefix + mediumFont
    }

    let style = document.createElement('style')

    style.appendChild(document.createTextNode("\
    @font-face {\
        font-family: 'Gotham';\
        src: url('" + normalFont + "') format('woff2');\
        font-weight: 300;\
        font-style: normal;\
    }\
    @font-face {\
        font-family: 'Gotham';\
        src: url('" + mediumFont + "') format('woff2');\
        font-weight: 500;\
        font-style: normal;\
    }\
    "))
    document.head.appendChild(style)
}

onMounted(() => {
    generateQRCode()
})
onUpdated(() => {
    generateQRCode()
})

function generateQRCode() {
    const qrCode = new qrCodeStyling({
        width: 250,
        height: 250,
        type: "svg",
        data: mainStore.publicKeyBase64,
        image: devCORSWorkaroundUrlPrefix + "https://halloapp.com/images/favicon.ico",
        dotsOptions: {
            color: "#4267b2",
            type: "rounded"
        },
        backgroundOptions: {
            color: "#e9ebee",
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 15
        }
    })

    if ($qrCode.value) {
        const el = $qrCode.value as HTMLElement
        qrCode.append(el)
        hal.log("append QR code")




    } else {
        hal.log("skip append QR code")
    }
}


</script>

<template>

    <div v-if="!mainStore.isLoggedIntoApp" id='signInWrapper'>

        <div id="signInWrapperHeader">
            <div id="logoBox">
                <svg width="31" height="31">
                    <use xlink:href="#icon"/>
                </svg>
                <div id="logoText">
                    HALLOAPP WEB
                </div>
            </div>
        </div>

        <div id='qrCodeBanner'>
            <div id="howTo">
                <div class="howToTitle">
                    To use HalloApp on your computer:
                </div>
                <div class="howToBullet">
                    1. Open HalloApp on your phone
                </div>
                <div class="howToBullet">
                    2. Tap <b>Settings</b> and select <b>Linked Device</b>
                </div>
                <div class="howToBullet">
                    3. Point your phone to this screen and scan the QR code
                </div>
            </div>
            <div id="qrCodeColumn">
                <div id="qrCode" ref="$qrCode">
                </div>
                <div id="fakeAuthButton" @click="fakeAuth">
                    Fake Phone Auth
                </div>
            </div>
        </div>

    </div>

    <div v-else id="MainWrapper">

        <div id="Sidestrip">
            <Sidestrip/>
        </div>

        <div id="Sidebar">
            <Sidebar/>
        </div>

        <div id="MainPanel">
            <MainPanel/>
        </div>

    </div>

    <div v-if="chooseColorScheme&&mainStore.isLoggedIntoApp" id="ChooseColorSchemePopup">
        <Popup/>
    </div>


    <svg style="height: 0px;" xmlns="https://www.w3.org/2000/svg">
        <defs>
            <symbol id="icon" viewBox="0 0 34 33">
                <svg width="34" height="33" viewBox="0 0 34 33" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <rect id="app_icon 2" width="33.2488" height="33" rx="10" transform="matrix(1 0 0 -1 0.25 33)" fill="url(#pattern0)"/>
                    <defs>
                        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                            <use xlink:href="#image0_14888_19199" transform="translate(0 -0.00377019) scale(0.00555556)"/>
                        </pattern>
                        <image id="image0_14888_19199" data-name="app_icon.png" width="180" height="180" xlink:href="data:image/png;base64,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"/>
                    </defs>
                </svg>
            </symbol>
 
        </defs>
    </svg>

</template>

<style>

* {
    box-sizing: border-box;
}
html, body {
    height: 100%;
    width: 100%;
}

body {
    background: #F2F2F6;
    font-family: Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;    
    font-size: 16px;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

a {
    color: rgba(0,0,0,.6);
    text-decoration: underline;
    font-weight: bold;
    transition: all 0.6s ease;
}

a:hover {
    text-decoration: underline;
    font-weight: bold;
    color: rgba(0,0,0,1);
    transition: all 0.15s ease;
}

h1, h2, h3, h4, h5, h6 {
    font-family: Nunito, Aria, "Helvetica Neue", Helvetica, sans-serif;
    font-weight: 400;
}

#app {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

#signInWrapper {
    width: 100%;
    height: 100%;
    
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;  
}

#signInWrapperHeader {
    margin-top: 20px;
    width: 80%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 5px 5px;    

}
#signInWrapperHeader #logoBox {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0px 8px;
}
#signInWrapperHeader #logoBox img {
    margin-top: 4px;
}
#signInWrapperHeader #logoText {
    font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: rgb(0, 0 , 0, 0.8);
}


#qrCodeBanner {
    margin-top: 50px;
    margin-bottom: 100px;
    width: 100%;
    
    max-width: 800px;
    padding: 50px 30px 100px 30px;
    background-color: white;

    border-radius: 10px;
    box-shadow:
        0 1px 1px hsl(0deg 0% 0% / 0.075),
        0 2px 2px hsl(0deg 0% 0% / 0.075),
        0 4px 4px hsl(0deg 0% 0% / 0.075),
        0 8px 8px hsl(0deg 0% 0% / 0.075),
        0 16px 16px hsl(0deg 0% 0% / 0.075);


    overflow: hidden;  



    display: flex;
    flex-direction: horizontal;
    justify-content: center;
    align-items: flex-start;
    gap: 30px 30px;
}
#howTo .howToTitle {
    font-size: 24px;
    margin-bottom: 50px;
    color: rgb(0, 0, 0, 0.80);
}

#howTo .howToBullet {
    margin-bottom: 30px;
    font-size: 18px;
    color: rgb(0, 0, 0, 0.80);
}

#qrCodeColumn {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}
#qrCode {
    width: 250px;
    height: 250px;
}
#fakeAuthButton {
    
    margin-top: 40px;
    background-color: orange;
    border-radius: 30px;
    padding: 10px 30px 10px 30px;
    color: white;
    font-weight: bold;

}
#fakeAuthButton:hover {
    background-color: gray;
    cursor: pointer;
}



#MainWrapper {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: horizonal;
    overflow: hidden;
}

#Sidestrip {
    background-color: black;
    flex: 0 0 50px;
    overflow: hidden;
}

#Sidebar {
    background-color: white;
    flex: 0 0 30%;
    overflow: hidden;
}

#MainPanel {
    flex: 0 0 70%;
    overflow: hidden;
}

</style>
