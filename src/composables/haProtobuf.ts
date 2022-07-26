import { clients } from '../proto/clients.js'

export function useHAProtobuf() {

    function createMedia(media: any, ciphertextHash: Uint8Array, downloadUrl: string, encryptionKey: Uint8Array, chunkSize?: number) {
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

            return albumMedia
        }
        else if (media.type == 'video') {

            let encryptedResource = clients.EncryptedResource.create({
                'ciphertextHash': ciphertextHash,
                'downloadUrl': downloadUrl,
                'encryptionKey': encryptionKey
            })

            let streamingInfo = clients.StreamingInfo.create({
                'blobVersion': clients.BlobVersion.BLOB_VERSION_DEFAULT, // ?
                'blobSize': media.size,
                'chunkSize': chunkSize
            })

            let video = clients.Video.create({
                'video': encryptedResource,
                'width': media.width,
                'height': media.height,
                'streamingInfo': streamingInfo
            })

            let albumMedia = clients.AlbumMedia.create(({
                'video': video
            }))

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

        return chatContainerBuf
    }

    function decodeFromChatContainer(binArray: Uint8Array) {
        return clients.ChatContainer.decodeDelimited(binArray)
    }

    function decodeFromMedia(media: clients.IAlbumMedia) {
        // media type is image
        if (media.image) {
            const downloadUrl = media.image.img?.downloadUrl as string
            const ciphertextHash = media.image.img?.ciphertextHash as Uint8Array
            const decryptionKey = media.image.img?.encryptionKey as Uint8Array
            return {downloadUrl, ciphertextHash, decryptionKey}
        }
        // media type is video
        else {
            const downloadUrl = media.video?.video?.downloadUrl as string
            const ciphertextHash = media.video?.video?.ciphertextHash as Uint8Array
            const decryptionKey = media.video?.video?.encryptionKey as Uint8Array
            return {downloadUrl, ciphertextHash, decryptionKey}
        }
    }

    return { createMedia, createChatContainer, decodeFromChatContainer, decodeFromMedia }
}