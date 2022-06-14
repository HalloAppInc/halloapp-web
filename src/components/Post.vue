<script setup lang="ts">
import { ref } from "vue"

import hkdf from "js-crypto-hkdf"
import { Base64 } from "js-base64"
import { clients } from "../proto/clients.js"
import hal from "../common/halogger"

import { useMainStore } from '../stores/mainStore'

const mainStore = useMainStore()

let pushname = (<any>window).han
let avatar = (<any>window).haa

let isSafari = ref(false)

const externalShareInfo = Base64.fromBase64("SGFsbG9BcHAgU2hhcmUgUG9zdA==")
const imageInfo = Base64.fromBase64("SGFsbG9BcHAgaW1hZ2U=")
const videoInfo = Base64.fromBase64("SGFsbG9BcHAgdmlkZW8=") 
const voiceNoteInfo = Base64.fromBase64("SGFsbG9BcHAgYXVkaW8=") 

const bodyContent = ref("")

const isTextLinkOnly = ref(false)
const previewUrl = ref("")
const previewTitle = ref("")

const showPreviewImage = ref(false)
const previewImageSrc = ref("")

const showAvatar = ref(false)
const avatarImageUrlPrefix = "https://avatar-cdn.halloapp.net/"
const avatarImageUrl = ref("")

const showPostImage = ref(false)
const postImageSrc = ref("")

const $postVideo = ref(null)
const showVideo = ref(false)
const postVideoSrc = ref("")

const $postVoiceNote = ref(null)
const showVoiceNote = ref(false)
const postVoiceNoteSrc = ref("")

const mediaLengthMinutes = ref("00")
const mediaLengthSeconds = ref("00")

const showGooglePlay = ref(true)
const showAppleStore = ref(true)

init()

async function init() {  
    const urlHashComponent = location.hash
    let base64Key = urlHashComponent.slice(2) // strip out "#" and "k"
    let base64Blob = (<any>window).hab    

    if (mainStore.isDebug) {
        /* test hardcoded text and avatar */
        // base64Key = "06kaXk7TsDYQz0cYgIvO"
        // base64Blob = "uIGPNSl9ynuliYIqq8yRzsBygO6RDrdC6952_KusY9brjOod4uNcBOU5tyOSqM7FAiQonU7nAtDH0F_yjklQfTtUwMfAhGHER5BHepuzwWDxyNSGVMlcKvFFmI7wQGit"
        // pushname = "Temp Name"
        // avatar = "Hvhqsmhx-uKSX2oAEYpKe5xK"

        /* test hardcoded image */
        // base64Key = "7WGwE5iFqjRYAep2P10u"
        // base64Blob = "hjDjkN5BNW85YDG0h4K1jG3gNXdAeBXdSCz9FP4NB31OnQ7RSB9xJ_DHyVYXpFPigFN2VwZzcXcKQ3tZa0xKVi0yOJoM8wNoflgB8wwzftY0oy-HYRZ5jtZYkrFsRFdCXpWiCWe7Jurqq3qOX9MR3iEox4NzzKlfFexpLNv5P5IvdAmuPP7wTRm9JSXyBdqxk1D63PKjWQ7V-ytJmbZpIwtuPVp6kbVXHXw8ZJ0ZTuA1HAftRP9RhMa2k0aTm9enjTfRYWiZ3rqfgVj_KNbbH3n87IvhKScKdKwJie98Hx5IDZxEFacrMdSog1nZMRecA9a9YMenl8XP4e273Z1nGvH6oEfU2LU6qwaWJWl6dyK5hAfsM9eHOxGOTdgihxUH"

        /* test hardcoded video */
        base64Key = "O-aWqrkm7a4-6jVQyrTb"
        base64Blob = "pL6bvxLi5BsxKyNjfOJMPe4aH6GmYhYAISWOW7jcLGdFjiJg6yYBsaO7taz67bgiLgMwhN306XNX1nOX82_PrnKKcbsSpyF0SK5BaAeQ1rhkA8Uk1l5DIXaYB1wfrRy5JCNxiKiZRSbNgz263Y1ujxkjlgbvmqZDtGBW9Oi9uDBTvREMaieCkjcVgy9FGgTAFgDGC87nO51JD5x49KdnbXprFmXu37SLTab86DXJseBs50jmus6XHc3J5VwFHb9I0IJsYuDFzC6BQDOVD45OdB2AFY8bFvrKSt-j75_o7Ye1ytlvyWDSoW6kfZpgSINm"

        /* test hardcoded voicenote */
        // base64Key = "Epk6C8x3Lnd2I2ai_Ag0"
        // base64Blob = "AQOrEK5VazQ8KQYvNr6G4T0rZbJpregNSHJ7etoKrpQVwrWQ7NiTGJMvYt1v7I2CsduY3cf0RYQ3aDQGV7KGxzS3dFtkcVYnh0HnetWemmkC-r6pEGIW7bpuIkqIT-oSaFbXYc3vdN98Zj-oXgPmGdEcBJppGOYqQkHuxan2y25ayOmGK8zACeAj_TBbVuBnB4IWF7WpMenNNgNqYhTeQQ"
    }

    if (!base64Key || !base64Blob) {
        return
    }

    const key = Base64.toUint8Array(base64Key)
    const blobArrayWithMAC = Base64.toUint8Array(base64Blob)

    const derivedKeyObj = await getDerivedKey(key, externalShareInfo)
    const derivedKey = derivedKeyObj.key

    const IV = derivedKey.slice(0, 16)
    const AESKey = derivedKey.slice(16, 48)
    const SHA256Key = derivedKey.slice(48, 80)

    const attachedMAC = blobArrayWithMAC.slice(-32)
    const blobArray = blobArrayWithMAC.slice(0, -32)

    const isHMACMatch = await verifyHMAC(SHA256Key, blobArray, attachedMAC)
    if (!isHMACMatch) {
        hal.log("init/mismatch HMAC")
    }

    const decryptedCiphertextArray = await decryptBlob(AESKey, IV, blobArray)
    decodeAndProcessPostContainer(decryptedCiphertextArray)
}

async function getDerivedKey(secret: any, info: any) {
    const derivedKeyObj = await hkdf.compute(secret, 'SHA-256', 80, info, new Uint8Array())
    return derivedKeyObj
}

async function decryptBlob(rawKey: any, IV: any, ciphertext: any) {
    const baseKey = await window.crypto.subtle.importKey(           
        "raw",
        rawKey,                                                 
        "AES-CBC",
        true,
        ["decrypt"]
    )
    .catch( (error) => { hal.log("decryptBlob/importKey error: " + error) })
    
    const decryptedCiphertext = await window.crypto.subtle.decrypt(
        { name: "AES-CBC", iv: IV },
        baseKey as CryptoKey,
        ciphertext
    )
    .catch( (error) => { hal.log("decryptBlob/decrypt error: " + error) })

    let decryptedCiphertextArray = new Uint8Array(decryptedCiphertext)
    return decryptedCiphertextArray
}

async function verifyHMAC(rawKey: any, ciphertext: any, signature: any) {
    const algorithm =  { name: "HMAC", hash: "SHA-256" }
    const baseKey = await window.crypto.subtle.importKey(           
        "raw",
        rawKey,                                                 
        algorithm,
        false,
        ["sign", "verify"]
    )
    .catch( (error) => { hal.log("verifyHMAC/importKey error: " + error) })
    
    const isValid = await window.crypto.subtle.verify(
        algorithm,
        baseKey as CryptoKey,
        signature,
        ciphertext
    )
    .catch( (error) => { hal.log("verifyHMAC/verify error: " + error) })

    return isValid
}

async function decodeProtobufToPostContainer(binArray: Uint8Array) {
    const err = clients.PostContainer.verify(binArray)
    if (err) {
        throw err
    }
    const message = clients.PostContainer.decode(binArray)
    return message
}

async function decodeAndProcessPostContainer(binArray: Uint8Array) {
    const postContainer = await decodeProtobufToPostContainer(binArray)
    hal.log("decodeAndProcessPostContainer/decoded: ", postContainer)
    processPostContainer(postContainer)
}

function isUint8ArrayEqual(arr1: Uint8Array, arr2: Uint8Array) {
    if (arr1.length != arr2.length) {
        return false
    }
    for (let i = 0; i <= arr1.length; i++) {
        if (arr1[i] != arr2[i]) {
            return false
        }
    }
    return true
}

async function getMediaBlob(info: any, media: any) {
    const ciphertextHash = media.ciphertextHash
    const encryptionKey = media.encryptionKey
    const downloadUrl = media.downloadUrl

    const derivedKeyObj = await getDerivedKey(encryptionKey, info)
    const derivedKey = derivedKeyObj.key

    const mediaBlob = await fetchAndDecrypt(derivedKey, downloadUrl, ciphertextHash)
    return mediaBlob
}

async function fetchAndDecrypt(derivedKey: Uint8Array, url: any, ciphertextHash: any) {
    const IV = derivedKey.slice(0, 16)
    const AESKey = derivedKey.slice(16, 48)
    const SHA256Key = derivedKey.slice(48, 80)

    const response = await fetch(mainStore.devCORSWorkaroundUrlPrefix + url)
    const encryptedBuffer = await response.arrayBuffer()
    const encryptedArrayWithMAC = new Uint8Array(encryptedBuffer)

    const hash = await crypto.subtle.digest("SHA-256", encryptedArrayWithMAC)

    const isCorrectHash = isUint8ArrayEqual(new Uint8Array(hash), ciphertextHash)
    if (!isCorrectHash) {
        hal.log("fetchAndDecrypt hash does not match")
    }

    const attachedMAC = encryptedArrayWithMAC.slice(-32)
    const encryptedBinaryArray = encryptedArrayWithMAC.slice(0, -32)

    const isHMACMatch = await verifyHMAC(SHA256Key, encryptedBinaryArray, attachedMAC)
    if (!isHMACMatch) {
        hal.log("fetchAndDecrypt/mismatch HMAC")
    }

    const decryptedBinaryArray = await decryptBlob(AESKey, IV, encryptedBinaryArray)

    /* use blob instead of base64 string as converting to base64 is slow */
    // return new Blob([decryptedBinaryArray], {type: 'video/mp4'})
    return new Blob([decryptedBinaryArray])
}

function populateTextWithMentions(text: any, mentions: any) {
    let result = ""
    const textArray = text.split("")

    if (mentions) {
        const textArray = [...text];
        let mentionsStartingIndex = 0

        textArray.forEach( (char, idx) => {
            if (char == "@") {
                let isMention = false
                let pushname = ""
                for (let i = mentionsStartingIndex; i < mentions.length; i++) {
                    if (mentions[i].index == idx) {
                        isMention = true
                        pushname = mentions[i].name
                        mentionsStartingIndex++
                        break
                    }
                }

                if (isMention) {
                    result += "[[strong]]" + "@" + pushname + "[[/strong]]"
                } else {
                    result += char
                }
            } else {
                result += char
            }
        })
    } else {
        result = text
    }
    return result
}

function sanitizeHTML(text: any) {
    var element = document.createElement('div')
    element.innerText = text
    return element.innerHTML
}

function populateTextWithMarkdown(text: any) {
    var result = text
        .replace(/((?:^|[^\\])(?:\\.)*)\_(?=[^\s])((\\.|[^_])*)\_/g, '$1[[i]]$2[[/i]]')
        .replace(/((?:^|[^\\])(?:\\.)*)\~(?=[^\s])((\\.|[^~])*)\~/g, '$1[[s]]$2[[/s]]')
        .replace(/((?:^|[^\\])(?:\\.)*)\*(?=[^\s])((\\.|[^*])*)\*/g, '$1[[b]]$2[[/b]]')
    return result
}

function populateTextWithHTML(text: string) {
    var result = text
       .replaceAll('[[i]]', '<i>')
       .replaceAll('[[/i]]', '</i>')
       .replaceAll('[[s]]', '<s>')
       .replaceAll('[[/s]]', '</s>')    
       .replaceAll('[[b]]', '<b>')
       .replaceAll('[[/b]]', '</b>')                  
       .replaceAll('[[strong]]', '<strong>')
       .replaceAll('[[/strong]]', '</strong>')
    return result
}

function populateTextIfNeeded(text: any, mentions: any) {
    const populatedTextWithMentions = populateTextWithMentions(text, mentions)
    const populatedTextWithMarkdown = populateTextWithMarkdown(populatedTextWithMentions)
    const santizedHTML = sanitizeHTML(populatedTextWithMarkdown)
    const html = populateTextWithHTML(santizedHTML)
    return html
}

async function processPostContainer(postContainer: any) {
    let isTextPost = false
    let isAlbumPost = false
    let isVoiceNote = false

    if (postContainer.text) {
        isTextPost = true
    }

    if (postContainer.album) {
        isAlbumPost = true
    }

    if (postContainer.voiceNote) {
        isVoiceNote = true
    }

    if (isTextPost) {
        /* text */
        if (postContainer.text.text) {
            const text = postContainer.text.text
            const mentions = postContainer.text.mentions
            bodyContent.value = populateTextIfNeeded(text, mentions)
        }

        if (postContainer.text.link) {
            if (postContainer.text.link.url == postContainer.text.text) {
                isTextLinkOnly.value = true
                previewTitle.value = postContainer.text.link.title
                previewUrl.value = postContainer.text.link.url
            } 
        }

        /* image */
        if (postContainer.text.link) {
            if (postContainer.text.link.preview) {
                const previewImage = postContainer.text.link.preview[0]
                const media = previewImage.img
                const mediaBlob = await getMediaBlob(imageInfo, media)
                previewImageSrc.value = URL.createObjectURL(mediaBlob)
                showPreviewImage.value = true
            }
        } else {
            avatarImageUrl.value = avatarImageUrlPrefix + avatar
            showAvatar.value = true
        }
    }

    if (isAlbumPost) {
        /* text */
        if (postContainer.album.text) {
            const text = postContainer.album.text.text
            const mentions = postContainer.album.text.mentions
            bodyContent.value = populateTextIfNeeded(text, mentions)
        }

        /* media */
        if (postContainer.album.media) {
            const mediaInfo = postContainer.album.media[0]

            if (mediaInfo.image) {
                const media = mediaInfo.image.img
                const mediaBlob = await getMediaBlob(imageInfo, media)
                postImageSrc.value = URL.createObjectURL(mediaBlob)
                showPostImage.value = true
            }

            if (mediaInfo.video) {
                const media = mediaInfo.video.video
                const mediaBlob = await getMediaBlob(videoInfo, media)
                postVideoSrc.value = URL.createObjectURL(mediaBlob)
                showVideo.value = true
            }
        }
    }

    if (isVoiceNote) {
        /* text */
        bodyContent.value = "Voice Note"

        /* media */
        if (postContainer.voiceNote.audio) {
            const media = postContainer.voiceNote.audio
            const mediaBlob = await getMediaBlob(voiceNoteInfo, media)
            postVoiceNoteSrc.value = URL.createObjectURL(mediaBlob)
            showVoiceNote.value = true
        }
    }
}

function videoLoaded() {
    hal.log("videoLoaded")
    if (!$postVideo.value) { return }
    const vid = ($postVideo.value as HTMLVideoElement)

    const duration = vid.duration
    setMediaLengthDisplay(duration)

    // seek to the time here for a preview image because mobile safari will not show preview image when
    // the video source is created with createObjectURL and time fragments
    vid.currentTime += 0.001
}

function voiceNoteLoaded() {
    hal.log("voiceNoteLoaded")
    if (!$postVoiceNote.value) { return }
    const duration = ($postVoiceNote.value as HTMLAudioElement).duration
    setMediaLengthDisplay(duration)
}

function setMediaLengthDisplay(duration: number) {
    const minutes = Math.floor(duration / 60)
    const seconds = Math.ceil(duration % 60)
    mediaLengthMinutes.value = minutes.toString().padStart(2, '0')
    mediaLengthSeconds.value = seconds.toString().padStart(2, '0')
}

</script>

<template>

    <!-- head row -->
    <div id="head">
        <div class="haRow">
            <svg width="34" height="33">
                <use xlink:href="#icon"/>
            </svg>
            <img src="https://halloapp.com/images/logo-primary.svg" alt="HalloApp" width="100" height="20">
        </div>
    </div>

    <!-- postHeader row -->
    <div id="postHeader">
        {{ pushname }} is sharing their private post with you on HalloApp.
    </div>

    <!-- post row -->
    <div id="post">
        <div id="postMediaContainer">

            <img v-if="showPostImage" id="postImage" :src="postImageSrc" alt="Post Image">
            <img v-else-if="showPreviewImage" id="previewImage" :src="previewImageSrc" alt="Link Preview">
            <img v-else-if="showAvatar" id="avatarImage" :src="avatarImageUrl" alt="Avatar">

            <video v-if="showVideo" ref="$postVideo" id="postVideo" preload="metadata" @loadedmetadata="videoLoaded" playsinline controlsList="nodownload" style="pointer-events: none;">
                <source :src="postVideoSrc" type="video/mp4">
                <p>Your browser cannot play the provided video file.</p>
            </video>

            <audio v-if="showVoiceNote" :class="{ safariAudio: isSafari }" autobuffer="autobuffer" ref="$postVoiceNote" id="postVoiceNote" preload="metadata" @loadedmetadata="voiceNoteLoaded" controls controlsList="nodownload">
                <source :src="postVoiceNoteSrc" type="audio/mpeg">
                <p>Your browser does not support the audio tag.</p>
            </audio>    

            <div v-if="showVideo || showVoiceNote" id="mediaLength">
                {{ mediaLengthMinutes }}:{{ mediaLengthSeconds }}
            </div>

        </div>
        <div id="postBody">
            <div id="postBodyTitle">
                {{ pushname }}'s Post
            </div>
            <div id="postBodyContent">

                <a v-if="isTextLinkOnly" :href="previewUrl" :title="previewTitle" target="_blank">{{ bodyContent }}</a>
                <div v-else-if="showVoiceNote" v-html="bodyContent"></div>
                <div v-else v-html="bodyContent">
                </div>                

            </div>
        </div>
    </div>

    <!-- postFooter row -->
    <div id="postFooter" class="column">
        <div>
            Download to view & comment
        </div>
        <div id="postFooterIcons">
            <a v-if="showAppleStore" id="appStoreButton" href="https://apps.apple.com/us/app/halloapp/id1501583052" target="_blank">
                <img src="https://halloapp.com/images/appstore.svg" alt="App Store" style="display: block;">
            </a>
            <a v-if="showGooglePlay" id="googlePlayButton" href="https://play.google.com/store/apps/details?id=com.halloapp" target="_blank">
                <img src="https://halloapp.com/images/google-play-badge.svg" alt="Google Play">
            </a>
        </div>
    </div>

    <!-- footer row -->
    <div id="footer">
        HalloApp is a simple, safe, and private place to connect and share what matters in your life, with the people who matter to you.
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

<style scoped>

:root {
    --max-small-screen-height: 350px;
    --max-small-screen-landscape-height: 325px; /* 325 to target small screens (ie. mobile safari iphone se landscape mode) */
}

.haRow {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px 5px;
}

.column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px 10px;
}

/* head row */
#head {
    margin: 30px 0px 25px 0px;
    height: 20px;
}
@media screen and (max-height: var(--max-small-screen-height)), (orientation: landscape) {
    #head {
        margin: 10px 0px 25px 0px;
    }
}

/* postHeader row */
#postHeader {
    margin-top: auto;
    max-width: 340px;

    display: flex;
    font-size: 16px;
    text-align: center;
}

/* post row */
#post {
    margin: 25px 0px 25px 0px;
    flex: 0 0 130px;

    display: flex;

    border-radius: 15px;
    border: 0.3px solid rgb(0, 0, 0, 0.25);
    background: white;
    width: 350px;
    max-height: 130px;
}
@media screen and (max-height: var(--max-small-screen-height)) {
    #post {
        margin: 15px 0px 10px 0px;
    }
}
#postMediaContainer {
    border-radius: 15px 0px 0px 15px;
    background: #ECECE7;
    overflow: hidden;
    transform: translate(Z);
    -webkit-transform: translateZ(0); /* mobile safari video: rounded corners */

    flex: 0 0 130px;

    display: flex;
    align-items: center;
    justify-content: center;
}
#postImage {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
#postVideo {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
#postVoiceNote {
    width: 90%;
    object-fit: contain;
}
.safariAudio {
    margin-left: 45px;
}
#mediaLength {
  position: absolute;
    right: 5px;
    bottom: 5px;
    color: white;
}
#previewImage {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
#avatarImage {
    height: 70%; 
    width: 70%; 
    object-fit: contain; 
    border-radius: 50%; 
    border: 0.3px solid rgb(0, 0, 0, 0.25);
}  
#postBody {
    padding: 15px;

    overflow: hidden;
}
#postBodyTitle {
    font-size: 16px;
    font-weight: 500;

    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal; 
}
#postBodyContent {
    margin: 5px 0px 0px 0px;
    opacity: 50%;
    font-size: 14px;
    font-weight: 400;

    line-height: 18px;

    overflow: hidden;
    text-overflow: ellipsis;

    display: -webkit-box !important;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    white-space: normal; 
}

/* postFooter row */
#postFooter {
    margin: 0px 0px 25px 0px;

    font-size: 16px;
    font-weight: 500;
    line-height: 22px
}
@media screen and (max-height: var(--max-small-screen-landscape-height)) {
    #postFooter {
        margin: 0px 0px 5px 0px;
    }
} 
#postFooterIcons {
    display: flex;
    flex-direction: row;
    gap: 0px 20px;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
}

/* footer row */
#footer {
    margin: auto 15px 10px 15px;

    max-width: 350px;
    text-align: center;
    line-height: 17px;
    font-size: 14px;
    font-weight: 400;
    opacity: 0.40;
}
</style>
