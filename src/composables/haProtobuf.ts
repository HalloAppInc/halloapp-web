import { clients } from '@/proto/clients.js'
import hal from '@/common/halogger'

export function useHAProtobuf() {

    function createMedia(
        media: any, ciphertextHash: Uint8Array, 
        downloadUrl: string, encryptionKey: Uint8Array, 
        isStream?: boolean, chunkSize?: number, 
        blobSize?: number) {

        if (media.type == 'image') {
            const encryptedResource = clients.EncryptedResource.create({
                'ciphertextHash': ciphertextHash,
                'downloadUrl': downloadUrl,
                'encryptionKey': encryptionKey
            })

            const image = clients.Image.create({
                'img': encryptedResource,
                'width': media.width,
                'height': media.height
            })

            const albumMedia = clients.AlbumMedia.create(({
                'image': image
            }))

            hal.log('haProtobuf/haProtobuf/Create Image')

            return albumMedia
        }
        else if (media.type == 'video') {

            const encryptedResource = clients.EncryptedResource.create({
                'ciphertextHash': ciphertextHash,
                'downloadUrl': downloadUrl,
                'encryptionKey': encryptionKey
            })

            let streamingInfo = null
            if (isStream) {
                streamingInfo = clients.StreamingInfo.create({
                    'blobVersion': clients.BlobVersion.BLOB_VERSION_DEFAULT, // ?
                    'blobSize': blobSize,
                    'chunkSize': chunkSize
                })
            }

            const video = clients.Video.create({
                'video': encryptedResource,
                'width': media.width,
                'height': media.height,
                'streamingInfo': streamingInfo
            })

            const albumMedia = clients.AlbumMedia.create(({
                'video': video
            }))

            hal.log('haProtobuf/haProtobuf/Create Video')

            return albumMedia
        }
    }

    function createChatContainer(message: any, mediaArray: clients.AlbumMedia[]) {
        const text = clients.Text.create({
            'text': message.text,
            'mentions': message.mentions,
            'link': null // need to add Link
        })

        const album = clients.Album.create({
            'media': mediaArray,
            'text': text,
            'voiceNote': null
        })

        const context = clients.ChatContext.create({
            'feedPostId': null,
            'feedPostMediaIndex': null,
            'chatReplyMessageId': message.replyIdx,
            'chatReplyMessageMediaIndex': null,
            'chatReplyMessageSenderId': message.replySenderId
        })

        let chatContainer: clients.IChatContainer
        if (mediaArray.length == 0) {
            chatContainer = clients.ChatContainer.create({
                'context': context,
                'text': text
            })
        }
        else {
            chatContainer = clients.ChatContainer.create({
                'context': context,
                'album': album
            })
        }

        const chatContainerBuf = clients.ChatContainer.encodeDelimited(chatContainer).finish()

        hal.log('haProtobuf/createChatContainer/Create ChatContainer')

        return chatContainerBuf
    }

    function decodeChatContainer(binArray: Uint8Array) {
        hal.log('haProtobuf/decodeChatContainer/Decode ChatContainer')
        return clients.ChatContainer.decodeDelimited(binArray)
    }

    function decodeMedia(media: clients.IAlbumMedia) {
        // media type is image
        if (media.image) {
            const downloadUrl = media.image.img?.downloadUrl as string
            const ciphertextHash = media.image.img?.ciphertextHash as Uint8Array
            const decryptionKey = media.image.img?.encryptionKey as Uint8Array
            const type = 'image'
            const chunkSize = -1
            const blobSize = -1

            hal.log('haProtobuf/decodeMedia/Decode Image')

            return { type, chunkSize, blobSize, downloadUrl, ciphertextHash, decryptionKey }
        }
        // media type is video
        else {
            const isStream = media.video?.streamingInfo != null
            if (isStream) {
                const downloadUrl = media.video?.video?.downloadUrl as string
                const ciphertextHash = media.video?.video?.ciphertextHash as Uint8Array
                const decryptionKey = media.video?.video?.encryptionKey as Uint8Array
                const type = 'video'
                const chunkSize = media.video?.streamingInfo?.chunkSize as number
                const blobSize = media.video?.streamingInfo?.blobSize as number

                hal.log('haProtobuf/decodeMedia/Decode Streaming Video')

                return { type, chunkSize, blobSize, downloadUrl, ciphertextHash, decryptionKey }
            }
            else {
                const downloadUrl = media.video?.video?.downloadUrl as string
                const ciphertextHash = media.video?.video?.ciphertextHash as Uint8Array
                const decryptionKey = media.video?.video?.encryptionKey as Uint8Array
                const type = 'video'
                const chunkSize = -1
                const blobSize = -1

                hal.log('haProtobuf/decodeMedia/Decode Video')

                return { type, chunkSize, blobSize, downloadUrl, ciphertextHash, decryptionKey }
            }
        }
    }

    return { createMedia, createChatContainer, decodeChatContainer, decodeMedia }
}