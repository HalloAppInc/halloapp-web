import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Base64 } from 'js-base64'
import MP4Box from 'mp4box'

import { useMainStore } from '@/stores/mainStore'
import { useConnStore } from '@/stores/connStore'
import { db, SubjectType, MediaType } from '@/db'
import hal from '@/common/halogger'

import { useHACrypto } from '@/composables/haCrypto'

export function useHACommonMedia() {

    const { t, locale } = useI18n({ inheritLocale: true, useScope: 'global' })

    const imageInfo         = Base64.fromBase64("SGFsbG9BcHAgaW1hZ2U=")
    const videoInfo         = Base64.fromBase64("SGFsbG9BcHAgdmlkZW8=") 
    const voiceNoteInfo     = Base64.fromBase64("SGFsbG9BcHAgYXVkaW8=") 

    const mainStore = useMainStore()
    const connStore = useConnStore()
    const avatarImageUrlPrefix = mainStore.devCORSWorkaroundUrlPrefix + 'https://avatar-cdn.halloapp.net/'

    const { getDerivedKey, 
            decryptChunk, decryptBinArr, verifyHMAC,
            isUint8ArrayEqual, combineBinaryArrays 
    } = useHACrypto()

    async function fetchVoiceNote(type: SubjectType, voiceNote: any) {
  
        let mediaBlob: Blob | undefined
        
        if (voiceNote.mediaType == MediaType.Audio) {

            if (voiceNote.blob) {
                
                mediaBlob = voiceNote.blob
            } else {

            
                mediaBlob = await fetchMediaBlob(voiceNoteInfo, voiceNote)
                if (mediaBlob) {
                    /* voicenotes are stored directly with their subjects and not in the commonMedia table */
                    if (voiceNote.type == SubjectType.Comment) {
                        modifyCommentVoiceNote(voiceNote.subjectID, voiceNote.contentID, mediaBlob)
                    }
                }

            }

        }

        return mediaBlob

    }  

    async function fetchCommonMedia(type: SubjectType, mediaList: any) {
        // hal.log("fetchCommonMedia")

        let result = {
            needWatching: false
        }
        
        for (let [index, mediaInfo] of mediaList.entries()) {

            if (mediaInfo.isCodecH265) {
                // album.value[index].errorMsg = t('post.noH265VideoSupportText')
            }

            if (mediaInfo.mediaType == MediaType.Image) {

                let mediaBlob: Blob | undefined

                if (mediaInfo.blob) {
                    
                    mediaBlob = mediaInfo.blob
                } else {

                    result.needWatching = true
                    
                    mediaBlob = await fetchMediaBlob(imageInfo, mediaInfo)
                    if (mediaBlob) {
                        // todo: preview image can be much smaller and less resolution
                        const previewImageBlob = mediaBlob
                        modifyCommonMedia(mediaInfo.type, mediaInfo.subjectID, mediaInfo.contentID, index, mediaBlob, previewImageBlob)
                    }

                }

            }

            if (mediaInfo.mediaType == MediaType.Video) {
                let mediaBlob: Blob | undefined

                if (mediaInfo.previewImage) {
                    hal.log("fetchCommonMedia/video/already in db")
                    mediaBlob = mediaInfo.blob

                } else {
                    result.needWatching = true

                    const chunkSize = mediaInfo.chunkSize
                    if (chunkSize) {
                        hal.log("fetchCommonMedia/video/fetch streaming")
                        

                        // MediaSource is not supported on iOS yet
                        if ('MediaSource' in window) {
                            hal.log('processPostContainer/video/stream/stream via mediaSource')
                            const mediaSource = new MediaSource()
                            const mediaSourceUrl = URL.createObjectURL(mediaSource)
                            const blobSize = mediaInfo.blobSize
                            setupStreamingMediaSource(mediaInfo.type, mediaInfo.subjectID, mediaInfo.contentID, mediaSource, mediaInfo, videoInfo, blobSize, chunkSize)

                        } else {
                            
                            mediaBlob = await getChunkedMediaBlob(mediaInfo, videoInfo, chunkSize)

                            const previewImageBlob = await grabPreviewFromVideo(mediaBlob)
                            modifyCommonMedia(mediaInfo.type, mediaInfo.subjectID, mediaInfo.contentID, index, mediaBlob, previewImageBlob as Blob)

                        }
                                             
                    } else {
                        hal.log("fetchCommonMedia/video/fetch entire media")

                        mediaBlob = await fetchMediaBlob(videoInfo, mediaInfo)
                        if (mediaBlob) {

                            /* todo: check if this is needed */
                            /* h265 video is not supported on desktop browsers except for Safari */
                            // if (!mainStore.isMobile && !mainStore.isSafari) {
                                // let mp4box = MP4Box.createFile()
                                // mp4box.onReady = function(info: any) {
                                //     info.tracks.forEach(function(track: any) {
                                //         const codecType = track.codec.substring(0, 4)
                                //         if (codecType == 'hvc1') {
                                //             hal.prod('processPostContainer/video/non-streaming/can not play h265 video: ' + track.codec)
                                //             // album.value[index].errorMsg = t('post.noH265VideoSupportText')

                                //             setPostMediaIsCodecH265(props.post.postID, index, true)
                                //         }
                                //     })
                                // }
                            
                                /* 
                                * nb: mp4box has a bug that does not process h265 files properly
                                * filed: https://github.com/gpac/mp4box.js/issues/283 
                                */
                                // let mediaBuffer: any = mediaBlob.arrayBuffer()
                                // mediaBuffer.fileStart = 0
                                // mp4box.appendBuffer(mediaBuffer)
                                // mp4box.flush()
                            // }


                            // const mediaBlobUrl = URL.createObjectURL(mediaBlob)
                            // album.value[index].mediaBlob = mediaBlobUrl
                            // album.value[index].isReady = true    
                            
                            const previewImageBlob = await grabPreviewFromVideo(mediaBlob)
                            
                            modifyCommonMedia(mediaInfo.type, mediaInfo.subjectID, mediaInfo.contentID, index, mediaBlob, previewImageBlob as Blob)
                        
                        }
                    }
                }
            }       
            
            
            if (mediaInfo.mediaType == MediaType.Audio) {

                let mediaBlob: Blob | undefined

                if (mediaInfo.blob) {
                    
                    mediaBlob = mediaInfo.blob
                } else {

                    result.needWatching = true
                    
                    mediaBlob = await fetchMediaBlob(voiceNoteInfo, mediaInfo)
                    if (mediaBlob) {
                        /* voicenotes are stored directly with their subjects and not in the commonMedia table */
                        if (mediaInfo.type == SubjectType.Comment) {
                            modifyCommentVoiceNote(mediaInfo.subjectID, mediaInfo.contentID, mediaBlob)
                        }
                    }

                }

            }

        }

        return result
    }    
    
    async function fetchMediaBlob(info: any, media: any) {
        const ciphertextHash = media.hash
        const encryptionKey = media.key
        const downloadUrl = media.downloadURL

        const derivedKeyObj = await getDerivedKey(encryptionKey, info)
        const derivedKey = derivedKeyObj.key

        const mediaBlob = await fetchAndDecrypt(derivedKey, downloadUrl, ciphertextHash)
        if (!mediaBlob) { return undefined }
        return mediaBlob
    }

    async function haFetch(url: any) {
        try {
            const response = await fetch(mainStore.devCORSWorkaroundUrlPrefix + url, { signal: connStore.fetchAbortController.signal })
            return response
        } catch (err) {
            console.log('haFetch/err: ' + err)
            return undefined
        }
    }

    async function fetchAndDecrypt(derivedKey: Uint8Array, url: any, ciphertextHash: any) {
        const IV = derivedKey.slice(0, 16)
        const AESKey = derivedKey.slice(16, 48)
        const SHA256Key = derivedKey.slice(48, 80)

        const response = await haFetch(url)

        if (!response) { return undefined }

        const encryptedBuffer = await response.arrayBuffer()
        const encryptedArrayWithMAC = new Uint8Array(encryptedBuffer)

        const hash = await crypto.subtle.digest("SHA-256", encryptedArrayWithMAC)

        const isCorrectHash = isUint8ArrayEqual(new Uint8Array(hash), ciphertextHash)
        if (!isCorrectHash) {
            hal.log("fetchAndDecrypt/hash does not match: " + ciphertextHash)
        }

        const attachedMAC = encryptedArrayWithMAC.slice(-32)
        const encryptedBinaryArray = encryptedArrayWithMAC.slice(0, -32)

        const isHMACMatch = await verifyHMAC(SHA256Key, encryptedBinaryArray, attachedMAC)
        if (!isHMACMatch) {
            hal.log("fetchAndDecrypt/mismatch HMAC")
        }

        const decryptedBinaryArray = await decryptBinArr(AESKey, IV, encryptedBinaryArray)
        if (!decryptedBinaryArray) return undefined
        /* use blob instead of base64 string as converting to base64 is slow */
        return new Blob([decryptedBinaryArray])
    }


    async function fetchAndDecryptStream(type: SubjectType, subjectID: string, contentID: string, media: any, videoInfo: string, blobSize: any, chunkSize: number, mp4box: any) {
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
                    saveToDB.push(decryptedBinArr)

                    buf.fileStart = fileStartOffset
                    mp4box.appendBuffer(buf)

                    const combine = combineBinaryArrays(saveToDB)
                    const blob = new Blob([combine], {type: "video/mp4"})

                    const previewImageBlob = await grabPreviewFromVideo(blob)
                    modifyCommonMedia(type, subjectID, contentID, media.order, blob, previewImageBlob as Blob)

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
                    saveToDB.push(decryptedBinArr)

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

    function setupStreamingMediaSource(type: SubjectType, subjectID: string, contentID: string, mediaSource: any, media: any, videoInfo: any, blobSize: any, chunkSize: number) {
        let tracks: any = {}
        let mp4box = MP4Box.createFile()
        
        // wait for mediaSource to be ready
        mediaSource.addEventListener('sourceopen', function () {
            fetchAndDecryptStream(type, subjectID, contentID, media, videoInfo, blobSize, chunkSize, mp4box)
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
                        setCommonMediaIsCodecH265(type, subjectID, contentID, media.order, true)
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


    async function grabPreviewFromVideo(blob: Blob) {
        return new Promise(function(resolve, reject) {

            const canvas = document.createElement('canvas')
            const video = document.createElement('video')
            const source = document.createElement('source')
            const context = canvas.getContext('2d')
            const url = URL.createObjectURL(blob)
            const urlRef = url

            video.style.display = 'none'
            canvas.style.display = 'none'

            source.setAttribute('src', urlRef)
            video.setAttribute('crossorigin', 'anonymous')

            video.appendChild(source)
            document.body.appendChild(canvas)
            document.body.appendChild(video)

            if (!context) {
                reject(undefined)
            }

            video.currentTime = 1.0
            video.load()
         
            video.addEventListener('loadedmetadata', function () {
                
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
            })

            video.addEventListener('loadeddata', function () {
                hal.log("grabPreviewFromVideo/loadeddata")
                context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob)
                    }
                    video.remove()
                    canvas.remove()
                })
            })
        })
    }

    /* db */

    async function modifyCommentVoiceNote(subjectID: string, commentID: string, blob: Blob) {
        await db.comment.where('commentID').equals(commentID).modify(function(item) {
            if (item.postID == subjectID) {
                if (item.voiceNote) {
                    item.voiceNote.blob = blob
                }
            }
        })
        return        
    }    

    async function modifyPostVoiceNote(postID: string, blob: Blob) {
        await db.feed.where('postID').equals(postID).modify(function(item) {
            if (item.voiceNote) {
                item.voiceNote.blob = blob
            }
        })
        return        
    }    

    
    async function modifyCommonMedia(type: SubjectType, subjectID: string, contentID: string, order: number, blob: Blob, previewImage?: Blob) {
        if (!db.isOpen()) { return }
        
        await db.commonMedia.where('contentID').equals(contentID).and((commonMed) => {
            return commonMed.subjectID == subjectID && commonMed.type == type && commonMed.order == order
        }).modify(function(med) {
            med.blob = blob
            if (previewImage) {
                med.previewImage = previewImage
            }
        })
        return        
    }

    async function setCommonMediaIsCodecH265(type: SubjectType, subjectID: string, contentID: string, order: number, isCodecH265: boolean) {
        if (!db.isOpen()) { return }
        await db.commonMedia.where('contentID').equals(contentID).and((commonMed) => {
            return commonMed.subjectID == subjectID && commonMed.type == type && commonMed.order == order
        }).modify({
            isCodecH265: isCodecH265
        })
        
        return        
    }

    return { fetchCommonMedia, fetchVoiceNote }
}
