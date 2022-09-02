<script setup lang="ts">
import { ref } from "vue"

import hal from "../../common/halogger"
import { clients } from "../../proto/clients.js"

import { Base64 } from "js-base64"
import hkdf from "js-crypto-hkdf"

import { useI18n } from 'vue-i18n'

import MediaCarousel from '../media/MediaCarousel.vue'
import Avatar from '../media/Avatar.vue'

import MP4Box from 'mp4box'

import { useMainStore } from '../../stores/mainStore'
import { useHAText } from '../../composables/haText'
import { useTimeformatter } from '../../composables/timeformatter'

import { liveQuery } from "dexie"
import { db, Feed, PostMedia, PostMediaType, Mention } from '../../db'

import { useHAFeed } from '../../composables/haFeed'
import { track } from "@vue/reactivity"

const mainStore = useMainStore()
const { processText } = useHAText()
const { formatTime, formatTimer } = useTimeformatter()

const { getPostMedia, modifyPost, setPostMediaIsCodecH265 } = useHAFeed()

interface Props {
    post: Feed,
    postID: string
}
const props = defineProps<Props>()

const feedObservable = liveQuery (() => db.postMedia.where('postID').equals(props.postID).toArray())

const subscription = feedObservable.subscribe({
    next: result => { 
        /* improve: might be too heavy, maybe just reprocess the media */
        processPost(props.post)
    },
    error: error => console.error(error)
})


// const props = defineProps({
//     post: {
//         type: Object,
//         required: true
//     },
//     postID: {
//         type: String,
//         required: true
//     }
// })

let avatar = (window as any).haa

let isAvailable = ref(true)

const { t, locale } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const primaryBlue = ref("#007AFF")
const primaryBlueDark = ref("rgb(10, 132, 255, 1)")
const primaryBg = ref("rgb(243, 243, 240)")
const primaryBgDark = ref("rgb(17, 17, 17, 1)")

const headerWidth = ref(450)
const postWidth = ref(430)

const externalShareInfo = Base64.fromBase64("SGFsbG9BcHAgU2hhcmUgUG9zdA==")
const imageInfo         = Base64.fromBase64("SGFsbG9BcHAgaW1hZ2U=")
const videoInfo         = Base64.fromBase64("SGFsbG9BcHAgdmlkZW8=") 
const voiceNoteInfo     = Base64.fromBase64("SGFsbG9BcHAgYXVkaW8=") 

const avatarImageUrlPrefix = ref(mainStore.devCORSWorkaroundUrlPrefix + "https://avatar-cdn.halloapp.net/")
const avatarImageUrl = ref(mainStore.devCORSWorkaroundUrlPrefix + "https://web.halloapp.com/assets/avatar.svg")

const postTimestamp = ref("")
let postText: string | undefined
let postMentions: any

const isTextPost = ref(false)
const isTextPostTextOnly = ref(false)

const isTruncatedText = ref(false)

const mediaBoxWidth = ref(300)
const mediaBoxHeight = ref(400)

const showPreviewImage = ref(false)
const previewImageSrc = ref("")

const bodyContent = ref("")

enum MediaType {
    Image,
    Video
}
interface Media {
    type?: PostMediaType;
    mediaBlob?: any;
    width: number;
    height: number;
    margin: number;
    lengthMins?: String;
    lengthSeconds?: String;
    isReady: boolean;
    errorMsg?: String;
}
const album = ref({media: [] as Media[]})

const isAlbum = ref(false)

const $postVoiceNote = ref(null)
const showVoiceNote = ref(false)
const postVoiceNoteSrc = ref("")

setPostSize()
init()

async function init() {  
    processPost(props.post)
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

    if (!decryptedCiphertext) return undefined
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
    let tryPostContainer = false
    try {
        const postContainerBlob = clients.PostContainerBlob.decode(binArray)

        if (postContainerBlob && postContainerBlob.hasOwnProperty("postContainer")) {
            const containerTimestamp = postContainerBlob.timestamp as number
            if (containerTimestamp) {
                postTimestamp.value = formatTime(containerTimestamp, locale.value as string)
            }
            return postContainerBlob.postContainer
        } else {
            tryPostContainer = true
        }
    } catch (e) {
        hal.log("decodeProtobufToPostContainer/error " + e)
        tryPostContainer = true
    }

    if (tryPostContainer) {
        hal.log("decodeProtobufToPostContainer/try fallback to PostContainer")
        const err = clients.PostContainer.verify(binArray)
        if (err) {
            throw err
        }
        const message = clients.PostContainer.decode(binArray)
        return message
    }
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

function combineBinaryArrays(arrays: any) {
    let totalLength = arrays.reduce((a: any, b: any) => a + b.byteLength, 0)
    let result = new Uint8Array(totalLength)
    let offset = 0
    for (let arr of arrays) {
        result.set(arr, offset)
        offset += arr.byteLength
    }
    return result
}

async function getChunkedMediaBlob(media: any, info: string, chunkSize: number) {
    const ciphertextHash = media.hash
    const encryptionKey = media.key
    const downloadUrl = media.downloadURL

    /* download blob */
    const response = await fetch(mainStore.devCORSWorkaroundUrlPrefix + downloadUrl)
    const encryptedBuffer = await response.arrayBuffer()
    const encryptedArray = new Uint8Array(encryptedBuffer)

    /* check hash */
    const hash = await crypto.subtle.digest("SHA-256", encryptedArray)
    const isCorrectHash = isUint8ArrayEqual(new Uint8Array(hash), ciphertextHash)
    if (!isCorrectHash) {
        hal.log('getChunkedMediaBlob/hash does not match')
    }

    const chunksArr = []
    let chunkCounter = 0
    for (let i = 0; i < encryptedArray.length; i += chunkSize) {
        const chunkWithMAC = encryptedArray.slice(i, i + chunkSize)
        const chunkInfo = info + ' ' + chunkCounter
        const decryptedBinArr = await decryptChunk(chunkWithMAC, encryptionKey, chunkInfo)
        chunksArr.push(decryptedBinArr)
        chunkCounter++
    }

    const combinedBinArr = combineBinaryArrays(chunksArr)
    return new Blob([combinedBinArr])
}

async function getMediaBlob(info: any, media: any) {
    const ciphertextHash = media.hash
    const encryptionKey = media.key
    const downloadUrl = media.downloadURL

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
        hal.log("fetchAndDecrypt/hash does not match: " + ciphertextHash)
        hal.log("fetchAndDecrypt/hash does not match 2: " + new Uint8Array(hash))
    }

    const attachedMAC = encryptedArrayWithMAC.slice(-32)
    const encryptedBinaryArray = encryptedArrayWithMAC.slice(0, -32)

    const isHMACMatch = await verifyHMAC(SHA256Key, encryptedBinaryArray, attachedMAC)
    if (!isHMACMatch) {
        hal.log("fetchAndDecrypt/mismatch HMAC")
    }

    const decryptedBinaryArray = await decryptBlob(AESKey, IV, encryptedBinaryArray)
    if (!decryptedBinaryArray) return undefined
    /* use blob instead of base64 string as converting to base64 is slow */
    return new Blob([decryptedBinaryArray])
}

function processPostText(text: string, mentions: any, truncateText: boolean = true, isTextPostTextOnly: boolean) {

    // rough estimate of 330 chars for 12 lines and 110 for 3 lines
    const maxCharsWhenTruncatedForTextOnlyPost: number = 330
    let maxCharsWhenTruncated: number = 110
    
    if (isTextPostTextOnly) {
        maxCharsWhenTruncated = maxCharsWhenTruncatedForTextOnlyPost
    }

    const processedText = processText(text, mentions, truncateText, maxCharsWhenTruncated)
    isTruncatedText.value = processedText.isTruncated
    return processedText.html
}

async function decryptChunk(chunkWithMAC: any, encryptionKey: any, chunkInfo: any) {
    const derivedKeyObj = await getDerivedKey(encryptionKey, chunkInfo)
    const derivedKey = derivedKeyObj.key

    const IV = derivedKey.slice(0, 16)
    const AESKey = derivedKey.slice(16, 48)
    const SHA256Key = derivedKey.slice(48, 80)

    const MAC = chunkWithMAC.slice(-32)
    const chunk = chunkWithMAC.slice(0, -32)

    const isHMACMatch = await verifyHMAC(SHA256Key, chunk, MAC)
    if (!isHMACMatch) {
        hal.log('decryptChunk/' + chunkInfo + '/mismatch HMAC')
    }

    const decryptedBinArr = await decryptBlob(AESKey, IV, chunk)
    return decryptedBinArr
}

async function fetchAndDecryptStream(media: any, videoInfo: string, blobSize: any, chunkSize: number, mp4box: any) {
    const ciphertextHash = media.hash
    const encryptionKey = media.key
    const downloadUrl = media.downloadURL

    const response: any = await fetch(mainStore.devCORSWorkaroundUrlPrefix + downloadUrl)
    const reader = response.body.getReader()

    const fullBinArr = new Uint8Array(blobSize)
    let fullBinArrOffset = 0
    let chunkCounter = 0

    let videoInfoCount  = 0 // info for decryption, starts at 0
    let fileStartOffset = 0 // mp4box file offset, starts at 0

    let saveToDB = []

    while (true) {
        const { value, done } = await reader.read()
        if (done) {
            hal.log('fetchAndDecryptStream/finish fetching')

            // check hash of full binary array
            const hash = await crypto.subtle.digest("SHA-256", fullBinArr)
            const isCorrectHash = isUint8ArrayEqual(new Uint8Array(hash), ciphertextHash)
            if (!isCorrectHash) {
                hal.log('fetchAndDecryptStream/hash does not match')
            }
    
            let start = chunkCounter*chunkSize
            let end = (chunkCounter + 1)*chunkSize
            const chunkWithMAC = fullBinArr.slice(start, end)
            const chunkInfo = videoInfo + ' ' + videoInfoCount
            const decryptedBinArr = await decryptChunk(chunkWithMAC, encryptionKey, chunkInfo)
            if (decryptedBinArr) {

                let buf: any = decryptedBinArr.buffer.slice(decryptedBinArr.byteOffset, decryptedBinArr.byteLength + decryptedBinArr.byteOffset)

                let buf2: any = decryptedBinArr.buffer.slice(decryptedBinArr.byteOffset, decryptedBinArr.byteLength + decryptedBinArr.byteOffset)
                saveToDB.push(decryptedBinArr)

                // let buf: any = decryptedBinArr.buffer

                buf.fileStart = fileStartOffset
                mp4box.appendBuffer(buf)

                const combine = combineBinaryArrays(saveToDB)
                const bb = new Blob([combine], {type: "video/mp4"})
                modifyPost(media.postID, media.order, bb)

                console.log("---> saving")


            } else {
                hal.log('fetchAndDecryptStream/done/error')
            }

            break
        }

        // copies received data to full binary array
        fullBinArr.set(value, fullBinArrOffset)

        const presetChunkedOffset = chunkCounter*chunkSize
        const diffOffset = fullBinArrOffset - presetChunkedOffset

        fullBinArrOffset += value.length

        let chunksToProcess = Math.floor((diffOffset + value.length)/chunkSize)
   
        for(let i = 0; i < chunksToProcess; i++) {
            // hal.log("fetchAndDecryptStream/chunk " + chunkCounter)
         
            let start = chunkCounter*chunkSize
            let end = (chunkCounter + 1)*chunkSize
            const chunkWithMAC = fullBinArr.slice(start, end)
            const chunkInfo = videoInfo + ' ' + videoInfoCount
            const decryptedBinArr = await decryptChunk(chunkWithMAC, encryptionKey, chunkInfo)

            if (decryptedBinArr) {

                let buf: any = decryptedBinArr.buffer.slice(decryptedBinArr.byteOffset, decryptedBinArr.byteLength + decryptedBinArr.byteOffset)
                let buf2: any = decryptedBinArr.buffer.slice(decryptedBinArr.byteOffset, decryptedBinArr.byteLength + decryptedBinArr.byteOffset)

                saveToDB.push(decryptedBinArr)

                // let buf: any = decryptedBinArr.buffer

                buf.fileStart = fileStartOffset
                mp4box.appendBuffer(buf)
                
                chunkCounter++
                videoInfoCount++
                fileStartOffset += decryptedBinArr.length
            } else {
                hal.log("fetchAndDecryptStream/chunk/" + chunkCounter + "/error")
                break
            }
        }
    }
}

function setupStreamingMediaSource(mediaSource: any, media: any, videoInfo: any, blobSize: any, chunkSize: number) {
    let tracks: any = {}
    let mp4box = MP4Box.createFile()
	
    // wait for mediaSource to be ready
	mediaSource.addEventListener('sourceopen', function () {
		fetchAndDecryptStream(media, videoInfo, blobSize, chunkSize, mp4box)
	})

	mp4box.onError = function(error: any) {
		console.error('setupStreamingMediaSource/mp4box/error: ', error)
		mediaSource.endOfStream('decode')
	}

	mp4box.onReady = function(info: any) {
		hal.log('setupStreamingMediaSource/mp4box/ready')
        // console.dir(info)

		info.tracks.forEach(function(track: any) {
			const mime = 'video/mp4; codecs="' + track.codec + '"'

            if (!mainStore.isMobile && !mainStore.isSafari) {
                const codecType = track.codec
                if (codecType.substring(0, 4) == 'hvc1') {
                    hal.prod('setupStreamingMediaSource/video/streaming/can not play h265 video: ' + track.codec)
                    setPostMediaIsCodecH265(media.postID, media.order, true)
                }
            }

			if (MediaSource.isTypeSupported(mime)) {
				let mediaSourceBuffer = mediaSource.addSourceBuffer(mime)
				let trackEntry = {
					mediaSourceBuffer: mediaSourceBuffer,
					segBuffers: [],
					meta: track,
					ended: false
				}
				mediaSourceBuffer.addEventListener('updateend', popBuffer.bind(null, trackEntry))
				mp4box.setSegmentOptions(track.id, null, {
					nbSamples: 1000
				})
				tracks[track.id] = trackEntry
			}
		})

		let initSegs = mp4box.initializeSegmentation()
		initSegs.forEach(function(initSegment: any) {
			appendBuffer(tracks[initSegment.id], initSegment.buffer, false)
		})

        mp4box.start()
	}

	mp4box.onSegment = async function (id: any, user: any, buffer: any, nextSample: any) {
        hal.log("mp4box/onSegment/track " + id + "/buffer length: " + buffer.byteLength)
		let track = tracks[id]
		appendBuffer(track, buffer, nextSample === track.meta.nb_samples)
	}

	function appendBuffer(track: any, buffer: any, ended: any) {
		track.segBuffers.push({
			buffer: buffer,
			ended: ended || false
		})
		popBuffer(track)
	}

	function popBuffer(track: any) {
		endMediaSourceIfNeeded()
		if (track.mediaSourceBuffer.updating || track.segBuffers.length === 0) { return }
		let segBuffer = track.segBuffers.shift()
		try {
			track.mediaSourceBuffer.appendBuffer(segBuffer.buffer)
			track.ended = segBuffer.ended
		} catch (e) {
			console.error('mp4box/popBuffers/error: ', e)
		}
		endMediaSourceIfNeeded()
	}

	function endMediaSourceIfNeeded() {
		if (mediaSource.readyState !== 'open') { return }

		let ended = Object.keys(tracks).every(function(id) {
			let track = tracks[id]
			return track.ended && !track.mediaSourceBuffer.updating
		})

		if (ended) {
            mediaSource.endOfStream() 
        }
	}
}

async function processPost(post: Feed) {

    let isVoiceNote = false
    let voiceNoteMedia: any

    const postMedia = await getPostMedia(post.postID)

    if (postMedia) {
        isAlbum.value = true
        setMediaSizes(postMedia)
    }

    if (post.text) {
        isTextPost.value = true
        postText = post.text
        postMentions = post.mentions
        if (postText) {
            bodyContent.value = processPostText(postText, postMentions, true, false)
        }
    }

    // if (postContainer.voiceNote) {
    //     isVoiceNote = true
    //     voiceNoteMedia = postContainer.voiceNote.audio
    // }

    if (isAlbum.value) {
   
        /* media */
        if (postMedia) {

            for (const [index, mediaInfo] of postMedia.entries()) {
                
                if (mediaInfo.isCodecH265) {
                    album.value.media[index].errorMsg = t('post.noH265VideoSupportText')
                }

                if (mediaInfo.type == PostMediaType.Image) {

                    let mediaBlob: Blob | undefined

                    if (mediaInfo.blob) {
                        
                        mediaBlob = mediaInfo.blob
                    } else {
                        
                        mediaBlob = await getMediaBlob(imageInfo, mediaInfo)
                        if (mediaBlob) {
                            modifyPost(props.post.postID, index, mediaBlob)
                        }

                    }

                    if (mediaBlob) {
                        const object = URL.createObjectURL(mediaBlob)
                        album.value.media[index].mediaBlob = object
                        album.value.media[index].isReady = true
                    }
                }

                if (mediaInfo.type == PostMediaType.Video) {

                    let mediaBlob: Blob | undefined

                     if (mediaInfo.blob) {
                        mediaBlob = mediaInfo.blob

                        const object = URL.createObjectURL(mediaBlob)
                        album.value.media[index].mediaBlob = object
                        album.value.media[index].isReady = true

                    } else {
                        const chunkSize = mediaInfo.chunkSize
                        if (chunkSize) {
                            
                            // MediaSource is not supported on iOS yet
                            if ('MediaSource' in window) {
                                hal.log('processPostContainer/video/stream/stream via mediaSource')
                                const mediaSource = new MediaSource()
                                const mediaSourceUrl = URL.createObjectURL(mediaSource)
                                const blobSize = mediaInfo.blobSize
                                setupStreamingMediaSource(mediaSource, mediaInfo, videoInfo, blobSize, chunkSize)

                                album.value.media[index].mediaBlob = mediaSourceUrl

                                
                            } else {
                                
                                mediaBlob = await getChunkedMediaBlob(mediaInfo, videoInfo, chunkSize)
                                const mediaBlobUrl = URL.createObjectURL(mediaBlob)
                                album.value.media[index].mediaBlob = mediaBlobUrl

                                modifyPost(props.post.postID, index, mediaBlob)

                            }

                            album.value.media[index].isReady = true                                               
                        } else {
                            mediaBlob = await getMediaBlob(videoInfo, mediaInfo)
                            if (mediaBlob) {
                                const mediaBlobUrl = URL.createObjectURL(mediaBlob)
                                album.value.media[index].mediaBlob = mediaBlobUrl
                                album.value.media[index].isReady = true    
                                
                                modifyPost(props.post.postID, index, mediaBlob)
                            }

                        }

                    }




                }                
            }
        }

        /* voiceNote inside album */
        // if (postContainer.album.voiceNote) {
        //     isVoiceNote = true
        //     voiceNoteMedia = postContainer.album.voiceNote.audio
        // }     
    }

    /* voiceNote */
    if (isVoiceNote) {
        const mediaBlob = await getMediaBlob(voiceNoteInfo, voiceNoteMedia)
        if (mediaBlob) {
            postVoiceNoteSrc.value = URL.createObjectURL(mediaBlob)
            showVoiceNote.value = true

            if (!isAlbum.value) {
                mediaBoxHeight.value = 0
            }
        }
    }

    if (isTextPost.value) {
        /* link preview */
        // if (post.text.link &&
        //     post.text.link.preview &&
        //     postContainer.text.link.preview[0] &&
        //     postContainer.text.link.preview[0].img
        //     ) {
        //         const previewImage = postContainer.text.link.preview[0]
        //         const media = previewImage.img
        //         const mediaBlob = await getMediaBlob(imageInfo, media)
        //         previewImageSrc.value = URL.createObjectURL(mediaBlob)
        //         showPreviewImage.value = true

        //         mediaBoxWidth.value = postWidth.value - 30
        //         mediaBoxHeight.value = 250
        // } else {
        //     isTextPostTextOnly.value = true
        //     mediaBoxWidth.value = postWidth.value - 30
        //     mediaBoxHeight.value = 0
        // }

        /* process text after checking if it's text only */
        // if (postContainer.text.text) {
        //     postText = props.post.text
        //     postMentions = postContainer.text.mentions            
        //     bodyContent.value = processPostText(postText, postMentions, true, isTextPostTextOnly.value)
        // }        
    }

}

function setPostSize() {
    const maxPostWidth = 400    // max width of entire card allowed
    const minPostWidth = 200    // min width of card

    const sideGutters = 60

    // limit post to maxPostWidth if window is large
    if (window.innerWidth >= maxPostWidth) {
        headerWidth.value = maxPostWidth - 10
        postWidth.value = maxPostWidth - sideGutters

    // size post to window's size
    } else if (window.innerWidth < maxPostWidth && window.innerWidth >= minPostWidth) {
        headerWidth.value = window.innerWidth - 30
        postWidth.value = window.innerWidth - 80

    // if window is too small, keep post to minPostWidth
    } else if (window.innerWidth < minPostWidth) {
        headerWidth.value = minPostWidth
        postWidth.value = minPostWidth
    }
}

function setMediaSizes(mediaList: any) {
    if (!mediaList) { return }

    const defaultRatio = 0.75 // 3/4 width/height portrait ratio

    mediaBoxWidth.value = postWidth.value // media carousel single slide width
    mediaBoxHeight.value = mediaBoxWidth.value/defaultRatio

    const maxBoxWidth = mediaBoxWidth.value - 50 // width of media inside album
    const maxBoxHeight = maxBoxWidth/defaultRatio 

    let tallestMediaItemHeight = 0

    for (const [idx, media] of mediaList.entries()) {
    // for (const media of mediaList) {
        // const type = media.type ? PostMediaType.Image : PostMediaType.Video
        let mediaItem = media
        // if (type == PostMediaType.Image) {
        //     mediaItem = media
        // } else if (type == PostMediaType.Video) {
        //     mediaItem = media
        // }

        let mediaItemWidth = media.width
        let mediaItemHeight = media.height

        if (mediaItemHeight > maxBoxHeight) {
            const mediaItemRatio = mediaItem.width/mediaItem.height
            if (mediaItemRatio > defaultRatio) {
                mediaItemWidth = maxBoxWidth
                mediaItemHeight = mediaItemWidth/mediaItemRatio
            } else {
                mediaItemHeight = maxBoxHeight
                mediaItemWidth = mediaItemHeight*mediaItemRatio
            }
        }

        /* add margins so carousel have some spacing between slides */
        let mediaItemMargin = postWidth.value - mediaItemWidth

        const obj: Media = { type: media.type, width: mediaItemWidth, height: mediaItemHeight, margin: mediaItemMargin, isReady: false }
        // album.value.media.push(obj)
        album.value.media[idx] = obj

        if (mediaItemHeight > tallestMediaItemHeight) {
            tallestMediaItemHeight = mediaItemHeight
        }
    }

    /* set carousel slide height shorter if the tallest media is shorter than the default */
    if (tallestMediaItemHeight < mediaBoxHeight.value) {
        mediaBoxHeight.value = tallestMediaItemHeight
    }
}

function expandText() {
    if (postText) {
        bodyContent.value = processPostText(postText, postMentions, false, isTextPostTextOnly.value)
    } 
}

</script>

<template>

    <!-- post row -->
    <div v-if="isAvailable" id="postRow">
        <div :class="['post']">

            <!-- postHeader row -->
            <div id="postHeader">
                <Avatar :userID="props.post.userID" :width="45"></Avatar>
                <div id="nameBox">
                    <div id="name">
                        {{ mainStore.pushnames[props.post.userID] }}
                    </div>
                    <div id="time">
                        {{ postTimestamp }}
                    </div>
                </div>
            </div>

            <MediaCarousel  
                :isMobile="mainStore.isMobile"
                :isSafari="mainStore.isSafari"
                :postID="post.postID"
                :isAlbum="isAlbum"
                :album="album.media"
                :showPreviewImage="showPreviewImage"
                :previewImageSrc="previewImageSrc"
                :mediaBoxWidth="mediaBoxWidth"
                :mediaBoxHeight="mediaBoxHeight">
            </MediaCarousel>

            <div id="postBody">
                <div :class="['postBodyContent', {textOnlySize: isTextPostTextOnly }]">
                   
                    <audio v-if="showVoiceNote" autobuffer="autobuffer" ref="$postVoiceNote" id="postVoiceNote" preload="metadata" controls controlsList="nodownload">
                        <source :src="postVoiceNoteSrc" type="audio/mpeg">
                        <p>{{ t('post.noAudioSupportText') }}</p>
                    </audio>   

                    <span v-else v-html="bodyContent">
                    </span>
                    <span v-if="isTruncatedText" id="readMore" @click="expandText">
                        {{ t('post.more') }}
                    </span>

                </div>
            </div>

            <!-- postFooter row -->
            <div id="postFooter">
                <div class="commentButton" @click="$emit('commentsClick')">
                    <img class="commentIcon" src="https://d1efjkqerxchlh.cloudfront.net/es/assets/Comment.png" alt="Comment Icon">
                    <div>
                        {{ t('post.comment') }}
                    </div>
                    <div id="newCommentIndicator">
                    </div>
                </div>
                <!-- <div id="replyButton" @click="">
                    <img id="replyIcon" src="https://d1efjkqerxchlh.cloudfront.net/es/assets/Reply.png" alt="Reply Icon">
                    <div>
                        {{ t('post.replyPrivately') }}
                    </div>
                </div> -->
            </div>

        </div>
    </div>

</template>

<style scoped>

#headerRow {
    position: sticky;
    z-index: 2;
    top: 0px;

    width: 100%;
    flex: 0 0 60px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5px 5px;    

    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px); /* mobile Safari */
}

/* post row */
#postRow {
    position: relative;
    z-index: 1;

    width: 100%;
    padding-bottom: 25px;
    
    background-color: rgb(243, 243, 240);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
@media (prefers-color-scheme: dark) {
    #postRow {
        background-color: rgb(17, 17, 17, 1);
    }
}

.post {
    position: relative;
    width: v-bind(postWidth + 'px');

    margin: 20px 0px 20px 0px;
    padding: 10px 10px 15px 10px;
 
    border-radius: 15px;
    background-color: white;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;
    
    display: flex;
    flex-direction: column;
}

.morePostMargin {
    margin: 70px 0px 100px 0px;
}
@media (prefers-color-scheme: dark) {
    .post {
        background-color: rgba(47, 46, 42, 1);
    }
}

/* postHeader row */
.post #postHeader {
    margin-top: auto;
    margin-bottom: 7px;
    max-width: 340px;

    display: flex;
    flex-direction: horizontal;
    align-items: center;
    gap: 0px 8px;

    font-size: 16px;
    text-align: center;
}
.post #avatarImage {
    height: 45px; 
    width: 45px; 
    object-fit: contain; 
    border-radius: 50%; 
    background-color: gray;
} 
.post #nameBox {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 3px 0px;
}
.post #nameBox #name {
    font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
    font-size: 18px;
    font-weight: 400;
    color: rgb(0, 0, 0)
}
@media (prefers-color-scheme: dark) {
    .post #nameBox #name {
        color: rgba(255, 255, 255, 1);
    }
}

.post #nameBox #time {
    font-size: 15px;
    font-weight: 500;
    color: rgb(0, 0 , 0, 0.4)
}
@media (prefers-color-scheme: dark) {
    .post #nameBox #time {
        color: rgba(255, 255, 255, 0.4);
    }
}

.post #postMediaContainer {
    position: relative;
    
    border-radius: 15px;
    overflow: hidden;

    flex: 0 0 v-bind(mediaBoxHeight + 'px');
    width: v-bind(mediaBoxWidth + 'px');
    align-self: center;

    display: flex;
    align-items: center;
    justify-content: center;
}

#postVoiceNote {
    width: 100%;
    object-fit: contain;
}

#previewImage {
    object-fit: contain;
}

#postBody {
    padding: 0px 0px 15px 0px;

    overflow: hidden;
}
.postBodyContent {
    margin: 5px 0px 0px 0px;

    font-size: 17px;
    line-height: 20px;
    font-weight: 400;

    /* text is manually truncated already so line-clamp serves
     * as a max number of lines we want to show for some edge cases
     * (ie. lots of newlines between words) */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important;
    -webkit-line-clamp: 500;
    -webkit-box-orient: vertical;
    white-space: normal; 

    overflow-wrap: break-word;
    user-select: text;
}
@media (prefers-color-scheme: dark) {
    .postBodyContent {
        color: rgba(255, 255, 255, 0.90)
    }
}
.postBodyContent #readMore {
    color: v-bind(primaryBlue);
    cursor: pointer;
}
@media (prefers-color-scheme: dark) {
    .postBodyContent #readMore {
        color: v-bind(primaryBlueDark);
    }
}
@media (pointer: fine) {
    .postBodyContent #readMore:hover {
        color: black;
    }
}

/* different than figma spec, changed font to 21 instead of 24 */
.textOnlySize {
    font-size: 21px;
    line-height: 31px;
    font-weight: 400;
}

/* postFooter row */
#postFooter {
    padding: 0px 10px 0px 10px;

    display: flex;
    justify-content: space-between;

    font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
    font-size: 13px;
    font-weight: 400;
}
@media (prefers-color-scheme: dark) {
    #postFooter {
        color: rgba(255, 255, 255, 0.75)
    }
}
.commentButton {
    display: flex;
    flex-direction: horizontal;
    align-items: center;

    user-select: none;
    cursor: pointer;
}
@media (pointer: fine) {
    .commentButton:hover {
        filter: invert(50%) sepia(68%) saturate(7495%) hue-rotate(201deg) brightness(104%) contrast(104%);
    }
}

.commentIcon {
    width: 14px;
    height: 14px;
    margin-right: 5px;
}
@media (prefers-color-scheme: dark) {
    .commentIcon {
        filter: invert(100%);
    }
}

#newCommentIndicator {
    margin-left: 4px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: rgba(0, 122, 255, 0.7);
    display: none;
}
@media (prefers-color-scheme: dark) {
    #newCommentIndicator {
        background-color: v-bind(primaryBlueDark);
    }
}

#replyButton {
    display: flex;
    flex-direction: horizontal;
    align-items: center;

    user-select: none;
    /* cursor: pointer; */
    color: gray;
    filter: invert(40%);
}
@media (pointer: fine) {
    /* #replyButton:hover {
        color: v-bind(primaryBlue);
    } */
}
#replyIcon {
    width: 16px;
    height: 12px;
    margin-right: 5px;
}
@media (prefers-color-scheme: dark) {
    #replyIcon {
        filter: invert(100%);
    }
}

</style>
