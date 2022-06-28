<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

import hal from '../../common/halogger'

import hacrypto from '../../common/hacrypto'
import { Base64 } from 'js-base64'

import { useMainStore } from '../../stores/mainStore'
import { useConnStore } from '../../stores/connStore'
import commonColors from "../../common/colors"

import { useI18n } from 'vue-i18n'

import qrCodeStyling from 'qr-code-styling'

const mainStore = useMainStore()
const connStore = useConnStore()

const primaryBlue = commonColors.primaryBlue

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const showQRCode = ref(true)

let qrCodeTimer: any
let countdownInterval: any

const $qrCode = ref(null)

let qrCodeStylingWithOptions: any

let countdown = ref('')

onMounted(() => {
    generateQRCodeAndConnect()
})

onBeforeUnmount(() => {
    // timers/intervals should not fire after unmount but clearing anyways
    clearTimeout(qrCodeTimer)
})

function setCountdown(distance: any) {
    let secondsFromNow = distance + 2 // add 1 sec so component will change before it reaches 0
    let countDownDate: any = new Date(new Date().getTime() + secondsFromNow)

    countdownInterval = setInterval(function() {
        let now = new Date().getTime()
        let distance = countDownDate - now
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        let seconds = Math.floor((distance % (1000 * 60)) / 1000)
        let displaySeconds = seconds.toString()
        if (seconds < 10) {
            displaySeconds = '0' + displaySeconds
        }
        countdown.value = minutes + ":" + displaySeconds


    }, 1000)
}

function generateQRCodeAndConnect() {
    
    connStore.generatePublicKeyIfNeeded()
    showQRCode.value = true

    clearTimeout(qrCodeTimer)
    const secondsToWait = 3*60000
    qrCodeTimer = setTimeout(deleteQRCodeAndWait, secondsToWait)
    setCountdown(secondsToWait)

    let qrCodeArr = []

    let version = 1
    let versionBinArr = new Uint8Array(1)
    versionBinArr[0] = version

    qrCodeArr.push(versionBinArr)
    qrCodeArr.push(Base64.toUint8Array(mainStore.publicKeyBase64))
    
    const qrCodeBinArr = hacrypto.combineBinaryArrays(qrCodeArr)
    const qrCodeBase64 = Base64.fromUint8Array(qrCodeBinArr)

    const options: any = {
        width: 250,
        height: 250,
        type: 'svg',
        data: qrCodeBase64,
        image: mainStore.devCORSWorkaroundUrlPrefix + 'https://web.halloapp.com/assets/images/favicon.ico',
        dotsOptions: {
            color: '#4267b2',
            type: 'rounded'
        },
        backgroundOptions: {
            color: '#e9ebee',
        },
        imageOptions: {
            crossOrigin: 'anonymous',
            margin: 15
        }
    }

    if (!qrCodeStylingWithOptions) {
        qrCodeStylingWithOptions = new qrCodeStyling(options)
        if ($qrCode.value) {
            const el = $qrCode.value as HTMLElement
            qrCodeStylingWithOptions.append(el)
        }
    } else {
        qrCodeStylingWithOptions.update(options)
    }

    connStore.connectToServerIfNeeded()
}

function fakeAuth() {
    connStore.login()
}

function getNewQRCode() {
    connStore.setWaitForUserToRegenKey(false)
    generateQRCodeAndConnect()
}

function deleteQRCodeAndWait() {
    hal.log('com/QRCode/deleteQRCodeAndWait')
    connStore.waitForUserToRegenKey()
    showQRCode.value = false
}

</script>

<template>

<div class="qrCodeColumn">
    <div v-show='showQRCode' id="qrCodeBox" ref="$qrCode">
    </div>

    <div v-if='showQRCode'>
        <div class="fakeAuthButton" @click="fakeAuth">
            Fake Phone Auth
        </div>
        <div class="countdown">
            {{ countdown }}
        </div>
    </div>
    <div v-else id="getQRCodeButton" @click="getNewQRCode">
        {{ t('login.getQRCode') }}
    </div>    
</div>

</template>

<style scoped>

.qrCodeColumn {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}
#qrCodeBox {
    width: 250px;
    height: 250px;
}
.fakeAuthButton {
    margin-top: 40px;
    background-color: red;
    border-radius: 30px;
    padding: 10px 30px 10px 30px;
    color: white;
    font-weight: bold;
}
.fakeAuthButton:hover {
    background-color: gray;
    cursor: pointer;
}
.countdown {
    margin-top: 10px;
    text-align: center;
    color: gray;
}
#getQRCodeButton {
    margin-top: 40px;
    background-color: v-bind(primaryBlue);
    border-radius: 30px;
    padding: 10px 30px 10px 30px;
    color: white;
    font-weight: bold;
}
#getQRCodeButton:hover {
    background-color: gray;
    cursor: pointer;
}


</style>
