import { useMainStore } from '../stores/mainStore'
import { useConnStore } from '../stores/connStore'

import { clients } from '../proto/clients.js'
import hal from '../common/halogger'

import { useHACrypto } from './haCrypto'
import { useHAProtobuf } from './haProtobuf'

export function useHAMediaUpload() {

    type uploadRecord = { encryptedBuffer: ArrayBufferLike, downloadUrl: number }

    const mainStore = useMainStore()
    const connStore = useConnStore()
    const { encrypt, decrypt, keygen } = useHACrypto()
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
            hal.log('HTTP PUT: Fail to upload, status =', status)
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
            response = await fetch(request)
            status = response.status
            remainRetryTimes -= 1
        }

        // use up all the retry and still fail
        if (remainRetryTimes == 0 && status != 200) {
            hal.log('HTTP GET: Fail to download, status =', status)
        }
        // succeed
        else {
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
                let { encryptedBuffer, ciphertextHash } = await encrypt(mediaBlob, encryptionKey)
                let albumMedia = createMedia(media, ciphertextHash, downloadUrl, encryptionKey, chunkSize)
                await sendMediaToServer(encryptedBuffer, uploadUrl)
                resolve(albumMedia)
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
        const { downloadUrl, ciphertextHash, decryptionKey } = decodeFromMedia(media)
        const { status, recvBlob } = await getMediaFromServer(downloadUrl)
        if (status == 200) {
            // convert from blob to ArrayBuffer
            const recvEncryptedBuffer = await new File([recvBlob], '').arrayBuffer()
            // decrypt the arrayBuffer
            const decryptedBlob = await decrypt(recvEncryptedBuffer, ciphertextHash, decryptionKey)
            const mediaBlobUrl = URL.createObjectURL(decryptedBlob)
            return mediaBlobUrl
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
        hal.log(mediaBolbUrlList)
    }

    /* For test only: upload and download media (use protobuf) */
    async function uploadAndDownLoad(file: any, list: any) {
        const message = {
            'media': [{
                'type': 'image',
                'file': file.file,
                'url': file.url,
                'preview': null,
                'width': 100,
                'height': 200
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