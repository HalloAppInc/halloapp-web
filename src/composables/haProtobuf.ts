import { clients } from '../proto/clients.js'
import hal from '../common/halogger'

export function useHAProtobuf() {

    function createMedia(media: any, ciphertextHash: Uint8Array, downloadUrl: string,
        encryptionKey: Uint8Array, isStream?: boolean, chunkSize?: number, blobSize?: number) {
        if (media.type == 'image') {
            let encryptedResource = clients.EncryptedResource.create({
                'ciphertextHash': ciphertextHash,
                'downloadUrl': downloadUrl,
                'encryptionKey': encryptionKey
            })

            let image = clients.Image.create({
                'img': encryptedResource,
                'width': media.width,
                'height': media.height
            })

            let albumMedia = clients.AlbumMedia.create(({
                'image': image
            }))

            hal.log('haProtobuf/haProtobuf/Create Image')

            return albumMedia
        }
        else if (media.type == 'video') {

            let encryptedResource = clients.EncryptedResource.create({
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

            let video = clients.Video.create({
                'video': encryptedResource,
                'width': media.width,
                'height': media.height,
                'streamingInfo': streamingInfo
            })

            let albumMedia = clients.AlbumMedia.create(({
                'video': video
            }))

            hal.log('haProtobuf/haProtobuf/Create Video')

            return albumMedia
        }
    }

    function createChatContainer(message: any, mediaArray: clients.AlbumMedia[]) {
        let text = clients.Text.create({
            'text': message.text,
            'mentions': message.mentions,
            'link': null // need to add Link
        })

        let album = clients.Album.create({
            'media': mediaArray,
            'text': text,
            'voiceNote': null
        })

        let context = clients.ChatContext.create({
            'feedPostId': null,
            'feedPostMediaIndex': null,
            'chatReplyMessageId': message.replyIdx,
            'chatReplyMessageMediaIndex': null,
            'chatReplyMessageSenderId': message.replySenderId
        })

        let chatContainer = clients.ChatContainer.create({
            'context': context,
            'album': album
        })

        let chatContainerBuf = clients.ChatContainer.encodeDelimited(chatContainer).finish()

        hal.log('haProtobuf/createChatContainer/Create ChatContainer')

        return chatContainerBuf
    }

    function decodeFromChatContainer(binArray: Uint8Array) {
        hal.log('haProtobuf/decodeFromChatContainer/Decode ChatContainer')
        return clients.ChatContainer.decodeDelimited(binArray)
    }

    function decodeFromMedia(media: clients.IAlbumMedia) {
        // media type is image
        if (media.image) {
            const downloadUrl = media.image.img?.downloadUrl as string
            const ciphertextHash = media.image.img?.ciphertextHash as Uint8Array
            const decryptionKey = media.image.img?.encryptionKey as Uint8Array
            const type = 'image'
            const chunkSize = -1
            const blobSize = -1

            hal.log('haProtobuf/decodeFromMedia/Decode Image')

            return { type, chunkSize, blobSize, downloadUrl, ciphertextHash, decryptionKey }
        }
        // media type is video
        else {
            const isStream = JSON.stringify(media.video?.streamingInfo) !== '{}'
            if (isStream) {
                const downloadUrl = media.video?.video?.downloadUrl as string
                const ciphertextHash = media.video?.video?.ciphertextHash as Uint8Array
                const decryptionKey = media.video?.video?.encryptionKey as Uint8Array
                const type = 'video'
                const chunkSize = media.video?.streamingInfo?.chunkSize as number
                const blobSize = media.video?.streamingInfo?.blobSize as number

                hal.log('haProtobuf/decodeFromMedia/Decode Streaming Video')

                return { type, chunkSize, blobSize, downloadUrl, ciphertextHash, decryptionKey }
            }
            else {
                const downloadUrl = media.video?.video?.downloadUrl as string
                const ciphertextHash = media.video?.video?.ciphertextHash as Uint8Array
                const decryptionKey = media.video?.video?.encryptionKey as Uint8Array
                const type = 'video'
                const chunkSize = -1
                const blobSize = -1

                hal.log('haProtobuf/decodeFromMedia/Decode Video')

                return { type, chunkSize, blobSize, downloadUrl, ciphertextHash, decryptionKey }
            }
        }
    }

    return { createMedia, createChatContainer, decodeFromChatContainer, decodeFromMedia }
}