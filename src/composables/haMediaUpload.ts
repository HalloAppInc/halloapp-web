import { useMainStore } from '../stores/mainStore'
import { useConnStore } from '../stores/connStore'

import { clients } from '../proto/clients.js'
import hal from '../common/halogger'

import { useHACrypto } from './haCrypto'
import { useHAProtobuf } from './haProtobuf'

import MP4Box from 'mp4box'

export function useHAMediaUpload() {

    type uploadRecord = { encryptedBuffer: ArrayBufferLike, downloadUrl: number }

    const mainStore = useMainStore()
    const connStore = useConnStore()
    const { encryptImage, decryptImage, encryptVideo, decryptVideo, decryptStream, keygen } = useHACrypto()
    const { createMedia, createChatContainer, decodeFromChatContainer, decodeFromMedia } = useHAProtobuf()

    /* Get image's metadata and store in uploadFiles */
    function saveMetaDataFromImage(file: any, uploadFiles: any) {
        let img = new Image()
        img.onload = function () {
            uploadFiles.push({
                'file': file,
                'preview': img.src,
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
                        'preview': URL.createObjectURL(img),
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
    async function sendMediaToServer(file: any, putUrl: string) {
        if (!mainStore.isConnectedToServer) { return }

        let status = -1
        let remainRetryTimes = 3

        while (status != 200 && remainRetryTimes > 0) {
            if (remainRetryTimes < 3) {
                hal.log('haMediaUpload/sendMediaToServer/HTTP GET: Fail to upload, status =' + status
                    + ', remaining chance =' + (remainRetryTimes - 1))
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
            hal.log('haMediaUpload/sendMediaToServer/HTTP PUT: Fail to upload, status =', status)
        }
        else {
            hal.log('haMediaUpload/sendMediaToServer/HTTP PUT: Upload successfully, status =', status)
        }

        return status
    }

    /* Get media to server through HTTP GET */
    async function getMediaFromServer(getUrl: string) {

        let status = -1
        let recvBlob: any = {}

        if (!mainStore.isConnectedToServer) { return { status, recvBlob } }

        const request = new Request(mainStore.devCORSWorkaroundUrlPrefix + getUrl)

        let remainRetryTimes = 3
        let response: any

        while (status != 200 && remainRetryTimes > 0) {
            if (remainRetryTimes < 3) {
                hal.log('haMediaUpload/getMediaFromServer/HTTP GET: Fail to download, status =' + status
                    + ', remaining chance =' + (remainRetryTimes - 1))
            }
            response = await fetch(request)
            status = response.status
            remainRetryTimes -= 1
        }

        // use up all the retry and still fail
        if (remainRetryTimes == 0 && status != 200) {
            hal.log('haMediaUpload/getMediaFromServer/HTTP GET: Fail to download, status =', status)
        }
        // succeed
        else {
            hal.log('haMediaUpload/getMediaFromServer/HTTP GET: Download successfully, status =', status)
            recvBlob = await response.blob()
        }

        return { status, recvBlob }
    }

    /* Send media to server and create protobuf AlbumMedia */
    async function sendEncryptedMediaAndCreateProtobuf(media: any, chunkSize: number) {
        return new Promise(resolve => {
            connStore.getMediaUrl(1000, async function (val: any) {
                let mediaBlob = new Blob([media.file])
                let uploadUrl = val.iq?.uploadMedia?.url?.put as string
                let downloadUrl = val.iq?.uploadMedia?.url?.get as string
                let encryptionKey = keygen()
                if (media.type == 'image') {
                    let { encryptedBuffer, ciphertextHash } = await encryptImage(mediaBlob, encryptionKey)
                    // isStream is true for video!
                    let albumMedia = createMedia(media, ciphertextHash, downloadUrl, encryptionKey)
                    hal.log('haMediaUpload/sendEncryptedMediaAndCreateProtobuf/Encrypt and create image')
                    await sendMediaToServer(encryptedBuffer, uploadUrl)
                    resolve(albumMedia)
                }
                else {
                    let { encryptedBuffer, ciphertextHash, encryptChunkSize, encryptBlobSize } = await encryptVideo(mediaBlob, encryptionKey, chunkSize)
                    // isStream is true for video!
                    let albumMedia = createMedia(media, ciphertextHash, downloadUrl, encryptionKey, true, encryptChunkSize, encryptBlobSize)
                    hal.log('haMediaUpload/sendEncryptedMediaAndCreateProtobuf/Encrypt and create video')
                    await sendMediaToServer(encryptedBuffer, uploadUrl)
                    resolve(albumMedia)
                }
            })
        })
    }

    /* encrypt media inside message, send media to server and create protobuf chatContainer */
    async function sendAndEncrypt(message: any, chunkSize: number) {
        let mediaArray: clients.AlbumMedia[] = []

        for (const media of message.media) {
            let albumMedia = await sendEncryptedMediaAndCreateProtobuf(media, chunkSize) as clients.AlbumMedia
            mediaArray.push(albumMedia)
        }

        let chatContainerBuf = createChatContainer(message, mediaArray)

        return chatContainerBuf
    }

    /* Download media from server and decrypt it */
    async function decryptRecvMediaAndDecodeProtobuf(media: clients.IAlbumMedia) {
        const { type, chunkSize, blobSize, downloadUrl, ciphertextHash, decryptionKey } = decodeFromMedia(media)
        if (type == 'image') {
            const { status, recvBlob } = await getMediaFromServer(downloadUrl)
            if (status == 200) {
                // convert from blob to ArrayBuffer
                const recvEncryptedBuffer = await new File([recvBlob], '').arrayBuffer()
                // decrypt the arrayBuffer
                const decryptedBlob = await decryptImage(recvEncryptedBuffer, ciphertextHash, decryptionKey)
                hal.log('haMediaUpload/decryptRecvMediaAndDecodeProtobuf/Decrypt image')
                const mediaBlobUrl = URL.createObjectURL(decryptedBlob)
                return mediaBlobUrl
            }
        }
        else {
            const isStream = (chunkSize != -1)
            if (isStream) {
                // MediaSource is not supported on iOS yet
                if ('MediaSource' in window) {
                    hal.log('haCrypto/decryptRecvMediaAndDecodeProtobuf/Decrypt streaminng Video')
                    const mediaSource = new MediaSource()
                    const mediaSourceUrl = URL.createObjectURL(mediaSource)
                    setupStreamingMediaSource(mediaSource, downloadUrl, ciphertextHash, decryptionKey, blobSize, chunkSize)
                    return mediaSourceUrl
                } else {
                    const { status, recvBlob } = await getMediaFromServer(downloadUrl)
                    if (status == 200) {
                        // convert from blob to ArrayBuffer
                        const recvEncryptedBuffer = await new File([recvBlob], '').arrayBuffer()
                        // decrypt the arrayBuffer
                        const decryptedBlob = await decryptVideo(recvEncryptedBuffer, ciphertextHash, decryptionKey, chunkSize)
                        hal.log('haCrypto/decryptRecvMediaAndDecodeProtobuf/Decrypt streaminng Video by entire blob')
                        const mediaBlobUrl = URL.createObjectURL(decryptedBlob)
                        return mediaBlobUrl
                    }
                }
            }
            else {
                const { status, recvBlob } = await getMediaFromServer(downloadUrl)
                if (status == 200) {
                    // convert from blob to ArrayBuffer
                    const recvEncryptedBuffer = await new File([recvBlob], '').arrayBuffer()
                    // decrypt the arrayBuffer
                    const decryptedBlob = await decryptImage(recvEncryptedBuffer, ciphertextHash, decryptionKey)
                    hal.log('haCrypto/decryptRecvMediaAndDecodeProtobuf/Decrypt Video')
                    const mediaBlobUrl = URL.createObjectURL(decryptedBlob)
                    return mediaBlobUrl
                }
            }
        }
    }

    /* Decode protobuf, fetch media from server and decrypt them */
    async function fetchAndDecrypt(binArray: Uint8Array, mediaBolbUrlList: string[]){
        const chatContainer = decodeFromChatContainer(binArray)
        if (chatContainer.album) {
            for (const media of chatContainer.album.media!) {
                let mediaBlobUrl = await decryptRecvMediaAndDecodeProtobuf(media)
                if (mediaBlobUrl) {
                    mediaBolbUrlList.push(mediaBlobUrl)
                }
            }
        }
        hal.log('haMediaUpload/fetchAndDecrypt/download ' + mediaBolbUrlList)
    }

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

    async function fetchAndDecryptStream(downloadUrl: string, ciphertextHash: Uint8Array, 
        decryptionKey: Uint8Array, blobSize: number, 
        chunkSize: number, mp4box: any) {
    
        const response: any = await fetch(mainStore.devCORSWorkaroundUrlPrefix + downloadUrl)
        const reader = response.body.getReader()
        const fullBinArr = new Uint8Array(blobSize)

        decryptStream(reader, ciphertextHash, decryptionKey, chunkSize, fullBinArr, mp4box)
    }

    /* For test only: upload and download media (use protobuf) */
    async function uploadAndDownLoad(file: any, list: any) {
        const message = {
            'media': [{
                'type': file.type,
                'file': file.file,
                'url': file.url,
                'preview': null,
                'width': file.width,
                'height': file.height
            }],
            'replyIdx': 11,
            'replySenderId': 0,
            'mentions': [],
            'text': 'Hello'
        }

        let chatContainerBuf = await sendAndEncrypt(message, 64000)

        fetchAndDecrypt(chatContainerBuf, list)
    }

    return { saveMetaDataFromImage, saveMetaDataFromVideo, uploadAndDownLoad }
}