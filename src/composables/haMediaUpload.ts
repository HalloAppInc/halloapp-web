import { useMainStore } from '../stores/mainStore'
import { useConnStore } from '../stores/connStore'

import { clients } from '../proto/clients.js'
import hal from '../common/halogger'

import { useHACrypto } from './haCrypto'
import { useHAProtobuf } from './haProtobuf'
import { useHADatabase } from './haDb'


import MP4Box from 'mp4box'

export function useHAMediaUpload() {

    type uploadRecord = { encryptedBuffer: ArrayBufferLike, downloadUrl: number }

    const mainStore = useMainStore()
    const connStore = useConnStore()
    const { encryptImageOrNonStreamVideo, decryptImageOrNonStreamVideo, encryptVideo, decryptVideo, decryptStream, keygen } = useHACrypto()
    const { createMedia, createChatContainer, decodeChatContainer, decodeMedia } = useHAProtobuf()
    const { updateMessageAfterSendToAWS, updateMediaAfterSendToAWS } = useHADatabase()

    /* Get image's metadata and store in uploadFiles */
    function saveMetaDataFromImage(file: any, uploadFiles: any) {
        let img = new Image()
        img.onload = function () {
            uploadFiles.push({
                'file': file,
                'preview': file,
                'previewUrl': img.src,
                'type': 'image',
                'url': img.src,
                'width': img.width,
                'height': img.height
            })      
        }
        img.src = URL.createObjectURL(file)
    }

    /* Get video's metadata and store in uploadFiles */
    function saveMetaDataFromVideo(file: any, uploadFiles: any) {
        const canvas = document.createElement('canvas')
        const video = document.createElement('video')
        const source = document.createElement('source')
        const context = canvas.getContext('2d')
        const url = URL.createObjectURL(file)
        const urlRef = url
    
        video.style.display = 'none'
        canvas.style.display = 'none'
    
        source.setAttribute('src', urlRef)
        video.setAttribute('crossorigin', 'anonymous')
    
        video.appendChild(source)
        document.body.appendChild(canvas)
        document.body.appendChild(video)
    
        if (!context) {
            hal.log(`Couldn't retrieve context 2d`)
            return
        }
    
        video.currentTime = 0.1
        video.load()
        video.addEventListener('loadedmetadata', function () {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
        })
    
        video.addEventListener('loadeddata', function () {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
            canvas.toBlob((blob) => {
                if (blob) {
                    let img = new File([blob], 'preview')
                    uploadFiles.push({
                        'file': file,
                        'preview': img,
                        'previewUrl': URL.createObjectURL(img),
                        'type': 'video',
                        'url': url,
                        'width': video.videoWidth,
                        'height': video.videoHeight,
                    })
                }
                video.remove()
                canvas.remove()
            })
        })
    }

    /* Send media to server through HTTP PUT */
    async function sendMediaToAWS(file: any, putUrl: string) {
        if (!mainStore.isConnectedToServer) { return }

        let status = -1
        let remainRetryTimes = 3

        while (status != 200 && remainRetryTimes > 0) {
            if (remainRetryTimes < 3) {
                hal.log('haMediaUpload/sendMediaToAWS/HTTP GET: Fail to upload, status =' + status
                    + ', remaining tries =' + (remainRetryTimes - 1))
            }

            let response = await fetch(mainStore.devCORSWorkaroundUrlPrefix + putUrl,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: file
                })

            status = response.status
            remainRetryTimes -= 1
        }


        // use up all the retry and still fail
        if (remainRetryTimes == 0 && status != 200) {
            hal.log('haMediaUpload/sendMediaToAWS/HTTP PUT: Fail to upload, status =', status)
        }
        else {
            hal.log('haMediaUpload/sendMediaToAWS/HTTP PUT: Upload successfully, status =', status)
        }

        return status
    }

    /* Get media to server through HTTP GET */
    async function getMediaFromAWS(getUrl: string) {

        let status = -1
        let recvBlob: any = {}

        if (!mainStore.isConnectedToServer) { return { status, recvBlob } }

        const request = new Request(mainStore.devCORSWorkaroundUrlPrefix + getUrl)

        let remainRetryTimes = 3
        let response: any

        while (status != 200 && remainRetryTimes > 0) {
            if (remainRetryTimes < 3) {
                hal.log('haMediaUpload/getMediaFromAWS/HTTP GET: Fail to download, status =' + status
                    + ', remaining tries =' + (remainRetryTimes - 1))
            }
            response = await fetch(request)
            status = response.status
            remainRetryTimes -= 1
        }

        // use up all the retry and still fail
        if (remainRetryTimes == 0 && status != 200) {
            hal.log('haMediaUpload/getMediaFromAWS/HTTP GET: Fail to download, status =', status)
        }
        // succeed
        else {
            hal.log('haMediaUpload/getMediaFromAWS/HTTP GET: Download successfully, status =', status)
            recvBlob = await response.blob()
        }

        return { status, recvBlob }
    }

    /* Send media to server and create protobuf AlbumMedia */
    async function sendEncryptedMediaAndCreateProtobuf(media: any, chunkSize: number) {
        return new Promise(resolve => {
            connStore.getMediaUrl(media.file.byteLength, false, async function (val: any) {
                let mediaBlob = new Blob([media.file])
                const mediaBlobArray = await new Response(mediaBlob).arrayBuffer()
                const mediaBlobBuffer = new Uint8Array(mediaBlobArray)
                let uploadUrl = val.iq?.uploadMedia?.url?.put as string
                let downloadUrl = val.iq?.uploadMedia?.url?.get as string
                let encryptionKey = keygen()
                if (media.type == 'image') {
                    let { encryptedBuffer, ciphertextHash } = await encryptImageOrNonStreamVideo(mediaBlobBuffer, encryptionKey)
                    let albumMedia = createMedia(media, ciphertextHash, downloadUrl, encryptionKey)
                    hal.log('haMediaUpload/sendEncryptedMediaAndCreateProtobuf/Encrypt and create image')
                    await sendMediaToAWS(encryptedBuffer, uploadUrl)
                    resolve(albumMedia)
                }
                else {
                    const isStream = true
                    if (isStream) {
                        let { encryptedBuffer, ciphertextHash, encryptedChunkSize, encryptedBufferSize } = await encryptVideo(mediaBlobBuffer, encryptionKey, chunkSize)
                        let albumMedia = createMedia(media, ciphertextHash, downloadUrl, encryptionKey, isStream, encryptedChunkSize, encryptedBufferSize)
                        hal.log('haMediaUpload/sendEncryptedMediaAndCreateProtobuf/Encrypt and create stream video')
                        await sendMediaToAWS(encryptedBuffer, uploadUrl)
                        resolve(albumMedia)
                    }
                    else {
                        let { encryptedBuffer, ciphertextHash } = await encryptImageOrNonStreamVideo(mediaBlobBuffer, encryptionKey)
                        let albumMedia = createMedia(media, ciphertextHash, downloadUrl, encryptionKey, isStream)
                        hal.log('haMediaUpload/sendEncryptedMediaAndCreateProtobuf/Encrypt and create video')
                        await sendMediaToAWS(encryptedBuffer, uploadUrl)
                        resolve(albumMedia)
                    }
                }
            })
        })
    }

    /* encrypt media inside message, send media to server and create protobuf chatContainer */
    async function encryptAndUpload(message: any, chunkSize: number) {
        let mediaArray: clients.AlbumMedia[] = []
        let mediaIDArray: number[] = []

        if (message.media) {
            for (const media of message.media) {
                let albumMedia = await sendEncryptedMediaAndCreateProtobuf(media, chunkSize) as clients.AlbumMedia
                mediaArray.push(albumMedia)
                /* const albumMediaBuf = clients.AlbumMedia.encode(albumMedia).finish().buffer as ArrayBuffer
                const mediaID = await putMedia(albumMediaBuf)
                mediaIDArray.push(mediaID) */
            }
        }

        let chatContainerBuf = createChatContainer(message, mediaArray)
        
        return chatContainerBuf
    }

    /* Download media from server and decrypt it */
    async function decryptDownloadedMediaAndDecode(media: clients.IAlbumMedia) {
        const { type, chunkSize, blobSize, downloadUrl, ciphertextHash, decryptionKey } = decodeMedia(media)
        if (type == 'image') {
            const { status, recvBlob } = await getMediaFromAWS(downloadUrl)
            if (status == 200) {
                // convert from blob to ArrayBuffer
                const recvEncryptedBuffer = await new File([recvBlob], '').arrayBuffer()
                // decrypt the arrayBuffer
                const decryptedBuffer = await decryptImageOrNonStreamVideo(recvEncryptedBuffer, ciphertextHash, decryptionKey)

                if (decryptedBuffer) {
                    const decryptedBlob = new Blob([decryptedBuffer])
                    hal.log('haMediaUpload/decryptDownloadedMediaAndDecode/Decrypt image')
                    const mediaBlobUrl = URL.createObjectURL(decryptedBlob)
                    return mediaBlobUrl
                } else {
                    return undefined
                }
            }
        }
        else {
            const isStream = (chunkSize != -1)
            if (isStream) {
                // MediaSource is not supported on iOS yet
                if ('MediaSource' in window) {
                    hal.log('haCrypto/decryptDownloadedMediaAndDecode/Decrypt streaminng Video')
                    const mediaSource = new MediaSource()
                    const mediaSourceUrl = URL.createObjectURL(mediaSource)
                    setupStreamingMediaSource(mediaSource, downloadUrl, ciphertextHash, decryptionKey, blobSize, chunkSize)
                    return mediaSourceUrl
                } else {
                    const { status, recvBlob } = await getMediaFromAWS(downloadUrl)
                    if (status == 200) {
                        // convert from blob to ArrayBuffer
                        const recvEncryptedBuffer = await new File([recvBlob], '').arrayBuffer()
                        // decrypt the arrayBuffer
                        const decryptedBuffer = await decryptVideo(recvEncryptedBuffer, ciphertextHash, decryptionKey, chunkSize)
                        const decryptedBlob = new Blob([decryptedBuffer])
                        hal.log('haCrypto/decryptDownloadedMediaAndDecode/Decrypt streaminng Video by entire blob')
                        const mediaBlobUrl = URL.createObjectURL(decryptedBlob)
                        return mediaBlobUrl
                    }
                }
            }
            else {
                const { status, recvBlob } = await getMediaFromAWS(downloadUrl)
                if (status == 200) {
                    // convert from blob to ArrayBuffer
                    const recvEncryptedBuffer = await new File([recvBlob], '').arrayBuffer()
                    // decrypt the arrayBuffer
                    const decryptedBuffer = await decryptImageOrNonStreamVideo(recvEncryptedBuffer, ciphertextHash, decryptionKey)
                    if (!decryptedBuffer) { return undefined } 
                    const decryptedBlob = new Blob([decryptedBuffer])
                    hal.log('haCrypto/decryptDownloadedMediaAndDecode/Decrypt Video')
                    const mediaBlobUrl = URL.createObjectURL(decryptedBlob)
                    return mediaBlobUrl
                }
            }
        }
    }

    /* Decode protobuf, fetch media from server and decrypt them */
    async function fetchAndDecrypt(binArray: Uint8Array, mediaBolbUrlList: string[]){
        const chatContainer = decodeChatContainer(binArray)
        if (chatContainer.album) {
            for (const media of chatContainer.album.media!) {
                let mediaBlobUrl = await decryptDownloadedMediaAndDecode(media)
                if (mediaBlobUrl) {
                    mediaBolbUrlList.push(mediaBlobUrl)
                }
            }
        }
        hal.log('haMediaUpload/fetchAndDecrypt/download ' + mediaBolbUrlList)
    }

    /* setup stream for receiving video */
    function setupStreamingMediaSource(mediaSource: any, downloadUrl: string,
        ciphertextHash: Uint8Array, decryptionKey: Uint8Array,
        blobSize: any, chunkSize: any) {

        let tracks: any = {}
        let mp4box = MP4Box.createFile()
        
        // wait for mediaSource to be ready
        mediaSource.addEventListener('sourceopen', function () {
            fetchAndDecryptStream(downloadUrl, ciphertextHash, decryptionKey, blobSize, chunkSize, mp4box)
        })
    
        mp4box.onError = function(error: any) {
            console.error('haMediaUpload/setupStreamingMediaSource/mp4box/error: ', error)
            mediaSource.endOfStream('decode')
        }
    
        mp4box.onReady = function(info: any) {
            hal.log('haMediaUpload/setupStreamingMediaSource/mp4box/ready')
    
            info.tracks.forEach(function(track: any) {
                const mime = 'video/mp4; codecs="' + track.codec + '"'
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
            hal.log("haMediaUpload/setupStreamingMediaSource/mp4box/onSegment/track " + id + "/buffer length: " + buffer.byteLength)
            let track = tracks[id]
            appendBuffer(track, buffer, nextSample === track.meta.nb_samples)
        }
    
        function appendBuffer (track: any, buffer: any, ended: any) {
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
                console.error('haMediaUpload/setupStreamingMediaSource/mp4box/popBuffers/error: ', e)
            }
            endMediaSourceIfNeeded()
        }
    
        function endMediaSourceIfNeeded() {
            if (mediaSource.readyState !== 'open') { return }
    
            let ended = Object.keys(tracks).every(function(id) {
                let track = tracks[id]
                return track.ended && !track.mediaSourceBuffer.updating
            })
    
            if (ended) { mediaSource.endOfStream() }
        }
    }

    /* use stream to fetch video */
    async function fetchAndDecryptStream(downloadUrl: string, ciphertextHash: Uint8Array, 
        decryptionKey: Uint8Array, blobSize: number, 
        chunkSize: number, mp4box: any) {
    
        const response: any = await fetch(mainStore.devCORSWorkaroundUrlPrefix + downloadUrl)
        const reader = response.body.getReader()
        const fullBinArr = new Uint8Array(blobSize)

        decryptStream(reader, ciphertextHash, decryptionKey, chunkSize, fullBinArr, mp4box)
    }

    /* ------------------------------ resumable version ------------------------------ */

    /* encrypt media inside message, send media to server and create protobuf chatContainer */
    async function resumableEncryptAndUpload(message: any, chunkSize: number) {
        let mediaArray: clients.AlbumMedia[] = []
        let mediaIDArray: number[] = []

        if (message.media) {
            for (const media of message.media) {
                let albumMedia = await resumableSendEncryptedMediaAndCreateProtobuf(media, chunkSize) as clients.AlbumMedia
                mediaArray.push(albumMedia)
                /* const albumMediaBuf = clients.AlbumMedia.encode(albumMedia).finish().buffer as ArrayBuffer
                const mediaID = await putMedia(albumMediaBuf)
                mediaIDArray.push(mediaID) */
            }
        }

        let chatContainerBuf = createChatContainer(message, mediaArray)
        
        return chatContainerBuf
    }

    /* Send media to server and create protobuf AlbumMedia */
    function resumableSendEncryptedMediaAndCreateProtobuf(media: any, chunkSize: number) {
        return new Promise(resolve => {
            connStore.getMediaUrl(media.byteLength, true, async function (val: any) {
                let uploadUrl = val.iq?.uploadMedia?.url?.patch as string
                let mediaBlob = new Blob([media.file])
                const mediaBlobArray = await new Response(mediaBlob).arrayBuffer()
                const mediaBlobBuffer = new Uint8Array(mediaBlobArray)
                let encryptionKey = keygen()
                if (media.type == 'image') {
                    let { encryptedBuffer, ciphertextHash } = await encryptImageOrNonStreamVideo(mediaBlobBuffer, encryptionKey)  
                    hal.log('haMediaUpload/resumableSendEncryptedMediaAndCreateProtobuf/Encrypt and create image')
                    const downloadUrl = await resumableSendMediaToAWS(encryptedBuffer, uploadUrl)
                    if (downloadUrl != null) {
                        updateMediaAfterSendToAWS(media.id)
                        let albumMedia = createMedia(media, ciphertextHash, downloadUrl, encryptionKey)
                        resolve(albumMedia)
                    }
                }
                else {
                    const isStream = true
                    if (isStream) {
                        let { encryptedBuffer, ciphertextHash, encryptedChunkSize, encryptedBufferSize } = await encryptVideo(mediaBlobBuffer, encryptionKey, chunkSize)
                        hal.log('haMediaUpload/resumableSendEncryptedMediaAndCreateProtobuf/Encrypt and create stream video')
                        const downloadUrl = await resumableSendMediaToAWS(encryptedBuffer, uploadUrl)
                        if (downloadUrl != null) {
                            updateMediaAfterSendToAWS(media.id)
                            let albumMedia = createMedia(media, ciphertextHash, downloadUrl, encryptionKey, isStream, encryptedChunkSize, encryptedBufferSize)
                            resolve(albumMedia)
                        }
                    }
                    else {
                        let { encryptedBuffer, ciphertextHash } = await encryptImageOrNonStreamVideo(mediaBlobBuffer, encryptionKey)
                        hal.log('haMediaUpload/resumableSendEncryptedMediaAndCreateProtobuf/Encrypt and create video')
                        const downloadUrl = await resumableSendMediaToAWS(encryptedBuffer, uploadUrl)
                        if (downloadUrl != null) {
                            updateMediaAfterSendToAWS(media.id)
                            let albumMedia = createMedia(media, ciphertextHash, downloadUrl, encryptionKey, isStream)
                            resolve(albumMedia)
                        }
                    }
                }
            })
        })
    }

    /* Send media to server through HTTP PUT */
    async function resumableSendMediaToAWS(file: any, uploadUrl: string) {
        if (!mainStore.isConnectedToServer) { return }

        let patchStatus = -1
        let offset: string = '0'
        let remainRetryTimes = 3
        
        while (patchStatus != 204 && remainRetryTimes > 0) {
            let size = file.byteLength
            // only send offset-end part
            let sendFilePart = file.slice(parseInt(offset))
            let response = await fetch(mainStore.devCORSWorkaroundUrlPrefix + uploadUrl,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/offset+octet-stream',
                    'Tus-Resumable': '1.0.0',
                    'Upload-offset': offset,
                    'Upload-Length': size.toString(),
                },
                body: sendFilePart
            })
            patchStatus = response.status
    
            // if upload failed, use HTTP head to resume
            if (patchStatus != 204) {
                let newResponse = await fetch(mainStore.devCORSWorkaroundUrlPrefix + uploadUrl,
                    {
                        method: 'HEAD',
                        headers: {
                            'Tus-Resumable': '1.0.0',
                        },
                    })
                if (newResponse.status == 200) {
                    offset = newResponse.headers.get('Upload-offset') as string
                    remainRetryTimes--
                }
                else {
                    hal.log('haMediaUpload/resumableSendMediaToAWS/HTTP HEAD: fail to resume, status =', response.status)
                    return
                }
            }
            // if successful, return download url
            else {
                hal.log('haMediaUpload/resumableSendMediaToAWS/HTTP PATCH: Upload successfully, status =', response.status)
                return response.headers.get('Download-Location')
            }
        }

        if (remainRetryTimes == 0 && patchStatus != 204) {
            hal.log('haMediaUpload/resumableSendMediaToAWS/HTTP HEAD: fail to resume, status =', patchStatus)
        }

        return
    }

    /* encrypt media inside message, send media to server and create protobuf chatContainer */
    async function resumableFetchAndDecrypt(binArray: Uint8Array, mediaBolbUrlList: string[]){
        const chatContainer = decodeChatContainer(binArray)
        if (chatContainer.album) {
            for (const media of chatContainer.album.media!) {
                let mediaBlobUrl = await resumableDecryptDownloadedMediaAndDecode(media)
                if (mediaBlobUrl) {
                    mediaBolbUrlList.push(mediaBlobUrl)
                }
            }
            hal.log('haMediaUpload/resumableFetchAndDecrypt/download ' + mediaBolbUrlList)
        }
    }

    /* Download media from server and decrypt it */
    async function resumableDecryptDownloadedMediaAndDecode(media: clients.IAlbumMedia) {
        const { type, chunkSize, blobSize, downloadUrl, ciphertextHash, decryptionKey } = decodeMedia(media)
        if (type == 'image') {
            const { status, recvBlob } = await resumableGetMediaFromAWS(downloadUrl)
            if (status == 206) {
                // convert from blob to ArrayBuffer
                const recvEncryptedBuffer = await new File([recvBlob], '').arrayBuffer()
                // decrypt the arrayBuffer
                const decryptedBuffer = await decryptImageOrNonStreamVideo(recvEncryptedBuffer, ciphertextHash, decryptionKey)
                if (!decryptedBuffer) { return undefined }
                const decryptedBlob = new Blob([decryptedBuffer])
                hal.log('haMediaUpload/resumableDecryptDownloadedMediaAndDecode/Decrypt image')
                const mediaBlobUrl = URL.createObjectURL(decryptedBlob)
                return mediaBlobUrl
            }
        }
        else {
            const isStream = (chunkSize != -1)
            if (isStream) {
                // MediaSource is not supported on iOS yet
                if ('MediaSource' in window) {
                    hal.log('haCrypto/resumableDecryptDownloadedMediaAndDecode/Decrypt streaminng Video')
                    const mediaSource = new MediaSource()
                    const mediaSourceUrl = URL.createObjectURL(mediaSource)
                    setupStreamingMediaSource(mediaSource, downloadUrl, ciphertextHash, decryptionKey, blobSize, chunkSize)
                    return mediaSourceUrl
                } else {
                    const { status, recvBlob } = await resumableGetMediaFromAWS(downloadUrl)
                    if (status == 206) {
                        // convert from blob to ArrayBuffer
                        const recvEncryptedBuffer = await new File([recvBlob], '').arrayBuffer()
                        // decrypt the arrayBuffer
                        const decryptedBuffer = await decryptVideo(recvEncryptedBuffer, ciphertextHash, decryptionKey, chunkSize)
                        const decryptedBlob = new Blob([decryptedBuffer])
                        hal.log('haCrypto/resumableDecryptDownloadedMediaAndDecode/Decrypt streaminng Video by entire blob')
                        const mediaBlobUrl = URL.createObjectURL(decryptedBlob)
                        return mediaBlobUrl
                    }
                }
            }
            else {
                const { status, recvBlob } = await resumableGetMediaFromAWS(downloadUrl)
                if (status == 206) {
                    // convert from blob to ArrayBuffer
                    const recvEncryptedBuffer = await new File([recvBlob], '').arrayBuffer()
                    // decrypt the arrayBuffer
                    const decryptedBuffer = await decryptImageOrNonStreamVideo(recvEncryptedBuffer, ciphertextHash, decryptionKey)
                    if (!decryptedBuffer) return undefined
                    const decryptedBlob = new Blob([decryptedBuffer])
                    hal.log('haCrypto/resumableDecryptDownloadedMediaAndDecode/Decrypt Video')
                    const mediaBlobUrl = URL.createObjectURL(decryptedBlob)
                    return mediaBlobUrl
                }
            }
        }
    }

    /* Get media to server through HTTP GET */
    async function resumableGetMediaFromAWS(downloadUrl: string) {        
        let status = -1
        let recvBlob: any = {}

        if (!mainStore.isConnectedToServer) { return { status, recvBlob } }        

        let remainRetryTimes = 3
        let response: any
        let offset = '0'
        let recvArray: Uint8Array = new Uint8Array()

        while (status != 206 && remainRetryTimes > 0) {
            response = await fetch(mainStore.devCORSWorkaroundUrlPrefix + downloadUrl,
                {
                    method: 'GET',
                    headers: {
                        'range': 'bytes=' + offset + '-',
                    },
                })
            
            status = response.status

            if (status == 206) {
                // get received blob
                const newRecvBuffer = await response.arrayBuffer()
                const newRecvArray = new Uint8Array(newRecvBuffer)
                // concacenate
                const concatenateArray = new Uint8Array(recvArray.byteLength + newRecvArray.byteLength)
                concatenateArray.set(recvArray, 0)
                concatenateArray.set(newRecvArray, recvArray.byteLength)
                recvArray = concatenateArray

                const size = recvArray.byteLength
                const fileSize = response.headers.get('Content-Length')
                // if size is not equal to its full size
                if (size != fileSize) {
                    remainRetryTimes -= 1
                    // update offset
                    offset = size.toString()
                }
                else {
                    hal.log('haMediaUpload/resumableGetMediaFromAWS/HTTP GET: Download successfully, status =', status)
                    recvBlob = new Blob([recvArray])
                    return { status, recvBlob }
                }
            }
            // if failed, download from wher 
            else {
                remainRetryTimes -= 1
            }
        }

        // use up all the retry and still fail
        if (remainRetryTimes == 0 && status != 206) {
            hal.log('haMediaUpload/resumableGetMediaFromAWS/HTTP GET: Fail to download, status =', status)
        }

        return { status, recvBlob }
    }

    /* For test only: upload and download media (use protobuf) */
    async function uploadAndDownLoad(file: any, list: any) {
        const message = {
            'media': [{
                'type': file.type,
                'file': file.file,
                'url': file.url,
                'width': file.width,
                'height': file.height
            }],
            'replyIdx': 11,
            'replySenderId': 0,
            'mentions': [],
            'text': '',
        }

        let chatContainerBuf = await encryptAndUpload(message, 64000)
        fetchAndDecrypt(chatContainerBuf, list)
    }

    async function uploadAfterSendMessage(message: any, messageID: number) {
        let chatContainerBuf = await resumableEncryptAndUpload(message, 64000)
        await resumableFetchAndDecrypt(chatContainerBuf, [])
        await updateMessageAfterSendToAWS(messageID)
    }

    return { saveMetaDataFromImage, saveMetaDataFromVideo, uploadAndDownLoad, uploadAfterSendMessage }
}