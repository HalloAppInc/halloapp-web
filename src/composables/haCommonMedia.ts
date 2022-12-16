import { ref } from 'vue'
import { Dexie } from 'dexie'
import { useI18n } from 'vue-i18n'
import { Base64 } from 'js-base64'
import MP4Box from 'mp4box'

import { useMainStore } from '@/stores/mainStore'
import { useConnStore } from '@/stores/connStore'
import { db, SubjectType, MediaType, CommonMedia } from '@/db'

import { useHALog } from '@/composables/haLog'
import { useHACrypto } from '@/composables/haCrypto'

import { web } from '@/proto/web'

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

    const { hal } = useHALog()

    async function fetchCommonMedia(type: SubjectType, mediaList: any) {
        // hal.log("fetchCommonMedia")

        let result = {
            needWatching: false
        }
        
        for (let [index, med] of mediaList.entries()) {

            if (med.mediaType == MediaType.Image) {
                if (med.previewImageArrBuf) { 
                    continue 
                } 

                result.needWatching = true

                let mediaArrBuf: ArrayBuffer | undefined
                hal('fetchCommonMedia/image/fetch ' + med.contentID)()

                mediaArrBuf = await fetchMediaArrBuf(imageInfo, med)

                if (mediaArrBuf) {
                    // todo: preview image can be much smaller and less resolution
                    const previewImageArrBuf = mediaArrBuf
                    modifyCommonMedia(med.type, med.subjectID, med.contentID, index, mediaArrBuf, previewImageArrBuf)
                }
            }

            if (med.mediaType == MediaType.Video) {
                if (med.previewImageArrBuf) { continue } 
                result.needWatching = true

                let mediaArrBuf: ArrayBuffer | undefined
                
                const chunkSize = med.chunkSize
                if (chunkSize) {
                    hal("fetchCommonMedia/video/fetch chunked video")()
                    
                    mediaArrBuf = await fetchChunkedMediaArrBuf(med, videoInfo, chunkSize)

                    if (mediaArrBuf) {
                        const mediaBlob = new Blob([mediaArrBuf], {type: 'video/mp4'})
                        const previewImageBlob = await grabPreviewFromVideo(mediaBlob)
                        const previewImageArrBuf = await (previewImageBlob as Blob).arrayBuffer()
                        modifyCommonMedia(med.type, med.subjectID, med.contentID, index, mediaArrBuf, previewImageArrBuf)
                    }


                    // MediaSource is not supported on iOS yet
                    // if ('MediaSource' in window) {
                    //     hal.log('processPostContainer/video/stream/stream via mediaSource')
                    //     const mediaSource = new MediaSource()
                    //     const mediaSourceUrl = URL.createObjectURL(mediaSource)
                    //     const blobSize = mediaInfo.blobSize
                    //     setupStreamingMediaSource(mediaInfo.type, mediaInfo.subjectID, mediaInfo.contentID, mediaSource, mediaInfo, videoInfo, blobSize, chunkSize)

                    // } else {
                        
                        // mediaArrBuf = await fetchChunkedMediaArrBuf(med, videoInfo, chunkSize)

                        // if (mediaArrBuf) {

                        //     const mediaBlob = new Blob([mediaArrBuf], {type: 'video/mp4'})
                        //     const previewImageBlob = await grabPreviewFromVideo(mediaBlob)
                        //     const previewImageArrBuf = await (previewImageBlob as Blob).arrayBuffer()
                        //     modifyCommonMedia(med.type, med.subjectID, med.contentID, index, mediaArrBuf, previewImageArrBuf)
                        // }

                    // }
                                            
                } else {
                    hal('haCommonMedia/fetchCommonMedia/video/fetch not chunked media (should not reach this code block)')()

                    mediaArrBuf = await fetchMediaArrBuf(videoInfo, med)
                    if (mediaArrBuf) {

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
                        

                        const mediaBlob = new Blob([mediaArrBuf], {type: 'video/mp4'})
                        const previewImageBlob = await grabPreviewFromVideo(mediaBlob)
                        const previewImageArrBuf = await (previewImageBlob as Blob).arrayBuffer()                   
                        
                        modifyCommonMedia(med.type, med.subjectID, med.contentID, index, mediaArrBuf, previewImageArrBuf)
                    
                    }
                }
                
            }       
            
            // todo: not used yet but can be unified for all commonMedia fetching, fetchVoiceNote can be removed when done 
            // if (med.mediaType == MediaType.Audio) {
            //     if (med.blob) { continue }
            //     result.needWatching = true
            //     let mediaArrBuf: ArrayBuffer | undefined

            //     mediaArrBuf = await fetchMediaArrBuf(voiceNoteInfo, med)
            //     if (mediaArrBuf) {
            //         /* voicenotes are stored directly with their subjects and not in the commonMedia table */
            //         if (med.type == SubjectType.Comment) {
            //             modifyCommentVoiceNote(med.subjectID, med.contentID, mediaArrBuf)
            //         }
            //     }

            // }

        }

        return result
    }    
    
    async function fetchMomentMedia(postID: string, image: any, selfie?: any, blurredImage?: any, blurredSelfieImage?: any) {
        
        let arrBuf: ArrayBuffer | undefined
        let selfieArrBuf: ArrayBuffer | undefined
        let blurredArrBuf: ArrayBuffer | undefined
        let blurredSelfieArrBuf: ArrayBuffer | undefined

        let needSaving: boolean = false
  
        if (image.arrBuf) {
            arrBuf = image.arrBuf
            if (blurredImage?.arrBuf) {
                blurredArrBuf = blurredImage.arrBuf
            }
        } else {
            needSaving = true
            arrBuf = await fetchMediaArrBuf(imageInfo, image)

            if (arrBuf) {
                const blob = new Blob([arrBuf], {type: 'image/jpeg'})
                const blurredBlob = await makeBlurredPreview(blob)
                blurredArrBuf = await (blurredBlob as Blob).arrayBuffer()
            }
            
        }

        if (selfie) {
            if (selfie.arrBuf) {
                selfieArrBuf = selfie.arrBuf
                if (blurredSelfieImage?.arrBuf) {
                    blurredSelfieArrBuf = blurredSelfieImage.arrBuf
                }

            } else {
                needSaving = true
                selfieArrBuf = await fetchMediaArrBuf(imageInfo, selfie)

                if (selfieArrBuf) {
                    const blob = new Blob([selfieArrBuf], {type: 'image/jpeg'})
                    const blurredBlob = await makeBlurredPreview(blob)
                    blurredSelfieArrBuf = await (blurredBlob as Blob).arrayBuffer()
                }

            }
        }

        if (needSaving && arrBuf) {
            modifyPostMoment(postID, arrBuf, selfieArrBuf, blurredArrBuf, blurredSelfieArrBuf)
        }
        
        return {
            imageArrBuf: arrBuf,
            selfieArrBuf: selfieArrBuf,
            blurredImageArrBuf: blurredArrBuf,
            blurredSelfieArrBuf: blurredSelfieArrBuf
        }
    }  

    async function fetchVoiceNote(type: SubjectType, voiceNote: any) {
        if (voiceNote.mediaType != MediaType.Audio) { return undefined }

        let mediaArrBuf: ArrayBuffer | undefined
  
        if (voiceNote.arrBuf) {
            mediaArrBuf = voiceNote.arrBuf
        } else {

            mediaArrBuf = await fetchMediaArrBuf(voiceNoteInfo, voiceNote)
            if (mediaArrBuf) {
                /* voicenotes are stored directly with their subjects and not in the commonMedia table */
                if (voiceNote.type == SubjectType.Comment) {
                    modifyCommentVoiceNote(voiceNote.subjectID, voiceNote.contentID, mediaArrBuf)
                } else if (voiceNote.type == SubjectType.FeedPost) {
                    modifyPostVoiceNote(voiceNote.contentID, mediaArrBuf)
                }
            }
        }
        
        return mediaArrBuf
    }  

    async function fetchLinkPreviewMedia(type: SubjectType, linkPreviewMedia: any) {
  
        let mediaArrBuf: ArrayBuffer | undefined
        
        if (linkPreviewMedia.mediaType == MediaType.Image) {

            if (linkPreviewMedia.arrBuf) {
                mediaArrBuf = linkPreviewMedia.arrBuf
            } else {

                mediaArrBuf = await fetchMediaArrBuf(imageInfo, linkPreviewMedia)
                if (mediaArrBuf) {
                    /* link preview media are stored directly with their subjects and not in the commonMedia table */
                    if (linkPreviewMedia.type == SubjectType.Comment) {
                        modifyCommentLinkPreviewMedia(linkPreviewMedia.subjectID, linkPreviewMedia.contentID, mediaArrBuf)
                    }
                }
            }

        }

        return mediaArrBuf
    }      
    
    async function fetchMediaArrBuf(info: any, media: any) {
        const ciphertextHash = media.hash
        const encryptionKey = media.key
        const downloadUrl = media.downloadURL

        const derivedKeyObj = await getDerivedKey(encryptionKey, info)
        const derivedKey = derivedKeyObj.key

        const decryptedBinArr = await fetchAndDecrypt(derivedKey, downloadUrl, ciphertextHash)
        if (!decryptedBinArr) { return undefined }
        // let type = 'image/jpeg'
        // if (media.mediaType == MediaType.Video) { type = 'video/mp4'}
        // else if (media.mediaType == MediaType.Audio) { type = 'audio/mpeg'}
        // const mediaBlob = new Blob([decryptedBinArr], {type: type})
        return decryptedBinArr.buffer
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

        const hash = await crypto.subtle.digest('SHA-256', encryptedArrayWithMAC)

        const isCorrectHash = isUint8ArrayEqual(new Uint8Array(hash), ciphertextHash)
        if (!isCorrectHash) {
            hal('fetchAndDecrypt/hash does not match: ' + ciphertextHash)()
        }

        const attachedMAC = encryptedArrayWithMAC.slice(-32)
        const encryptedBinArr = encryptedArrayWithMAC.slice(0, -32)

        const isHMACMatch = await verifyHMAC(SHA256Key, encryptedBinArr, attachedMAC)
        if (!isHMACMatch) {
            hal('fetchAndDecrypt/mismatch HMAC')()
        }

        const decryptedBinArr = await decryptBinArr(AESKey, IV, encryptedBinArr)
        if (!decryptedBinArr) return undefined
        /* use blob instead of base64 string as converting to base64 is slow */
        return decryptedBinArr
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
                hal('haCommonMedia/fetchAndDecryptStream/finish fetching')()

                // check hash of full binary array
                const hash = await crypto.subtle.digest("SHA-256", fullBinArr)
                const isCorrectHash = isUint8ArrayEqual(new Uint8Array(hash), ciphertextHash)
                if (!isCorrectHash) {
                    hal('haCommonMedia/fetchAndDecryptStream/hash does not match')()
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

                    const combinedBinArr = combineBinaryArrays(saveToDB)

                    const mediaBlob = new Blob([combinedBinArr], {type: 'video/mp4'})
                    const previewImageBlob = await grabPreviewFromVideo(mediaBlob)
                    const previewImageArrBuf = await (previewImageBlob as Blob).arrayBuffer()

                    modifyCommonMedia(type, subjectID, contentID, media.order, combinedBinArr, previewImageArrBuf)

                } else {
                    hal('haCommonMedia/fetchAndDecryptStream/done/error')()
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
                // hal.log('haCommonMedia/fetchAndDecryptStream/chunk ' + chunkCounter)
            
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
                    hal('haCommonMedia/fetchAndDecryptStream/chunk/' + chunkCounter + '/error')()
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
            hal('setupStreamingMediaSource/mp4box/ready')()
            // console.dir(info)

            info.tracks.forEach(function(track: any) {
                const mime = 'video/mp4; codecs="' + track.codec + '"'

                if (!mainStore.isMobile && !mainStore.isSafari) {
                    const codecType = track.codec
                    if (codecType.substring(0, 4) == 'hvc1') {
                        hal('setupStreamingMediaSource/video/streaming/can not play h265 video: ' + track.codec)()
                        modifyCommonMediaIsCodecH265(type, subjectID, contentID, media.order, true)
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
            hal("mp4box/onSegment/track " + id + "/buffer length: " + buffer.byteLength)()
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

    async function fetchChunkedMediaArrBuf(media: any, info: string, chunkSize: number) {
        const ciphertextHash = media.hash
        const encryptionKey = media.key
        const downloadUrl = media.downloadURL

        /* download from AWS */
        const response = await fetch(mainStore.devCORSWorkaroundUrlPrefix + downloadUrl)
        const encryptedArrBuf = await response.arrayBuffer()
        const encryptedBinArr = new Uint8Array(encryptedArrBuf)

        /* check hash */
        const hash = await crypto.subtle.digest('SHA-256', encryptedBinArr)
        const isCorrectHash = isUint8ArrayEqual(new Uint8Array(hash), ciphertextHash)
        if (!isCorrectHash) {
            hal('haCommonMedia/fetchChunkedMediaArrBuf/hash does not match')()
            return undefined
        }

        const chunksArr = []
        let chunkCounter = 0
        for (let i = 0; i < encryptedBinArr.length; i += chunkSize) {
            const chunkWithMAC = encryptedBinArr.slice(i, i + chunkSize)
            const chunkInfo = info + ' ' + chunkCounter
            const decryptedBinArr = await decryptChunk(chunkWithMAC, encryptionKey, chunkInfo)
            if (!decryptedBinArr) { 
                return undefined 
            }

            chunksArr.push(decryptedBinArr)
            chunkCounter++
        }

        const combinedBinArr = combineBinaryArrays(chunksArr)
        return combinedBinArr.buffer
    }

    async function makeBlurredPreview(blob: Blob) {
        return new Promise(function(resolve, reject) {

            const canvas = document.createElement('canvas')
            var image = new Image()

            const url = URL.createObjectURL(blob)
            const urlRef = url

            image.style.display = 'none'
            canvas.style.display = 'none'

            document.body.appendChild(canvas)

            image.src = urlRef
    
            image.onload = function(ev) {

                canvas.width = image.width
                canvas.height = image.height

                const context = canvas.getContext('2d')
                
                if (!context) {
                    reject(undefined)
                    return
                }

                let blurPercent = Math.abs(image.width * 0.10)

                context.filter = 'blur(' + blurPercent + 'px)'

                context.drawImage(image, 0, 0, image.width, image.height)
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob)
                    }
                    canvas.remove()
                }, 
                'image/jpeg', 
                0.90) // Safari: does not use quality
            }
           
        })
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

            video.addEventListener('loadedmetadata', function () {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight

                // Safari: need delay so seeked event will fire
                setTimeout(() => {
                    video.currentTime = 1.0
                }, 200)

            })

            video.addEventListener('seeked', function () {
                // hal.log('haCommonMedia/grabPreviewFromVideo/seeked')

                context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob)
                    }
                    video.remove()
                    canvas.remove()
                }, 
                'image/jpeg', 
                0.90) // Safari: does not use quality
            })

            video.load()
        })
    }

    /* db */

    async function getCommonMedia(type: SubjectType, subjectID: string, contentID: string) {
        const arr = await db.commonMedia.where('contentID').equals(contentID).and((commonMed) => {
            return commonMed.subjectID == subjectID && commonMed.type == type
        }).toArray()

        if (!arr || arr.length == 0) {
            return undefined
        }
        return arr
    }

    async function insertCommonMedia(type: SubjectType, subjectID: string, contentID: string, commonMediaArr: any) {
        if (commonMediaArr.length < 1) { 
            return 
        }

        const dbCommonMedia = await getCommonMedia(type, subjectID, contentID)
        
        if (!dbCommonMedia) {

            db.commonMedia.bulkAdd(commonMediaArr).then(function(lastKey) {
                // hal.log('haFeed/insertCommonMedia/bulkPut/success')
            }).catch(Dexie.BulkError, function (e) {
                hal('haFeed/insertCommonMedia/bulkPut/error ' + e)()
            })

        } else {
            // hal.log('haFeed/insertCommonMedia/exit/object already in db')
        }       
        return 
    }    

    async function modifyCommonMedia(type: SubjectType, subjectID: string, contentID: string, order: number, arrBuf: ArrayBuffer, previewImageArrBuf?: ArrayBuffer) {
        if (!mainStore.allowDbTransactions) { return }
        
        await db.commonMedia.where('contentID').equals(contentID).and((commonMed) => {
            return commonMed.subjectID == subjectID && commonMed.type == type && commonMed.order == order
        }).modify(function(med: CommonMedia) {
            hal('haCommonMedia/modifyCommonMedia')()      

            med.arrBuf = arrBuf

            if (previewImageArrBuf) {
                med.previewImageArrBuf = previewImageArrBuf
            }
        })
        return        
    }

    async function modifyCommonMediaIsCodecH265(type: SubjectType, subjectID: string, contentID: string, order: number, isCodecH265: boolean) {
        if (!mainStore.allowDbTransactions) { return }
        await db.commonMedia.where('contentID').equals(contentID).and((commonMed) => {
            return commonMed.subjectID == subjectID && commonMed.type == type && commonMed.order == order
        }).modify({
            isCodecH265: isCodecH265
        })
        
        return        
    }

    /* table specific functions */
    async function modifyPostMoment(postID: string, arrBuf: ArrayBuffer, selfieArrBuf?: ArrayBuffer, blurredArrBuf?: ArrayBuffer, blurredSelfieArrBuf?: ArrayBuffer) {
        await db.post.where('postID').equals(postID).modify(function(item) {
            if (item.moment) {
                item.moment.image.arrBuf = arrBuf

                if (item.moment.selfieImage && selfieArrBuf) {
                    item.moment.selfieImage.arrBuf = selfieArrBuf
                }

                if (item.moment.blurredImage && blurredArrBuf) {
                    item.moment.blurredImage.arrBuf = blurredArrBuf
                }

                if (item.moment.blurredSelfieImage && blurredSelfieArrBuf) {
                    item.moment.blurredSelfieImage.arrBuf = blurredSelfieArrBuf
                }                
            }
        })
        return        
    } 

    async function modifyPostLinkPreviewMedia(postID: string, blob: Blob) {
        await db.post.where('postID').equals(postID).modify(function(item) {
            if (item.linkPreview?.preview) {
                item.linkPreview.preview.blob = blob
            }
        })
        return        
    }     

    async function modifyPostVoiceNote(postID: string, arrBuf: ArrayBuffer) {
        await db.post.where('postID').equals(postID).modify(function(item) {
            if (item.voiceNote) {
                item.voiceNote.arrBuf = arrBuf
            }
        })
        return        
    } 

    async function modifyCommentVoiceNote(subjectID: string, commentID: string, arrBuf: ArrayBuffer) {
        await db.comment.where('commentID').equals(commentID).modify(function(item) {
            if (item.postID == subjectID) {
                if (item.voiceNote) {
                    item.voiceNote.arrBuf = arrBuf
                }
            }
        })
        return        
    }

    async function modifyCommentLinkPreviewMedia(subjectID: string, commentID: string, arrBuf: ArrayBuffer) {
        await db.comment.where('commentID').equals(commentID).modify(function(item) {
            if (item.postID == subjectID) {
                if (item.linkPreview?.preview) {
                    item.linkPreview.preview.arrBuf = arrBuf
                }
            }
        })
        return        
    }    
  
    return {
        fetchMomentMedia,
        fetchCommonMedia,
        fetchVoiceNote,
        fetchLinkPreviewMedia,

        getCommonMedia,
        insertCommonMedia,
        modifyCommonMedia, modifyCommonMediaIsCodecH265,

        modifyPostVoiceNote, modifyPostLinkPreviewMedia

        }
}
