<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from 'vue'
    import { storeToRefs } from 'pinia'
    import { Base64 } from 'js-base64'
    import { useI18n } from 'vue-i18n'
    import qrCodeStyling from 'qr-code-styling'

    import { useMainStore } from '@/stores/mainStore'
    import { useConnStore } from '@/stores/connStore'
    import { useColorStore } from '@/stores/colorStore'

    import { useTimeformatter } from '@/composables/timeformatter'

    import hal from '@/common/halogger'
    import hacrypto from '@/common/hacrypto'

    const mainStore = useMainStore()
    const connStore = useConnStore()
    const colorStore = useColorStore()
    const { formatTimer } = useTimeformatter()

    const { t } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const { 
        background: backgroundColor,
        primaryBlue: primaryBlueColor,
        text: textColor,
    } = storeToRefs(colorStore)  

    const $qrCode = ref(null)
    const showQRCode = ref(true)
    const showCountdown = ref(false)
    let qrCodeTimer: any
    let countdownInterval: any
    let countdown = ref('')

    let qrCodeStylingWithOptions: any

    onMounted(() => {
        generateQRCodeAndConnect()
    })

    onBeforeUnmount(() => {
        // timers/intervals should not fire after unmount but clearing anyways
        clearTimeout(qrCodeTimer)
        clearInterval(countdownInterval)
    })

    function setCountdown(countdownTimeMs: any) {
        const countDownDate: any = new Date(new Date().getTime() + countdownTimeMs)

        countdown.value = formatTimer(countDownDate).display // run once first so re-runs won't show 00:00

        countdownInterval = setInterval(function() {
            const formattedTimer = formatTimer(countDownDate)
            if (formattedTimer.timeDiffMs <= 1000) {
                clearInterval(countdownInterval)
                showCountdown.value = false
            } else {
                countdown.value = formattedTimer.display

                // show countdown after two minutes, to not introduce anxiety for users
                if (formattedTimer.timeDiffMs <= (2*60000)) {
                    showCountdown.value = true
                }
            }
        }, 750)
    }

    function generateQRCodeAndConnect() {
        
        connStore.generatePublicKeyIfNeeded()
        showQRCode.value = true

        const countdownTimeMs = 3*60000
        clearTimeout(qrCodeTimer)
        clearInterval(countdownInterval)
        qrCodeTimer = setTimeout(deleteQRCodeAndWait, countdownTimeMs)
        setCountdown(countdownTimeMs)

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
            <div v-if="showCountdown" class="countdown">
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
        background-color: v-bind(primaryBlueColor);
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
