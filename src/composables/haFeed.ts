import { clients } from '../proto/clients.js'
import hal from '../common/halogger'

import { Dexie, liveQuery } from "dexie"
import { db, Feed, PostMedia, PostMediaType, Mention } from '../db'

import { useMainStore } from '../stores/mainStore.js'
import { useHAAvatar } from './haAvatar'

export function useHAFeed() {

    const mainStore = useMainStore()

    const { getAvatar } = useHAAvatar()

    async function processWebContainer(webContainer: any) {
        const feedResponse = webContainer?.feedResponse

        if (feedResponse) { 
            processFeedResponse(feedResponse)
        }
    
    }

    async function processFeedResponse(feedResponse: any) {
        // hal.log('haFeed/processFeedResponse: ' + JSON.stringify(feedResponse))

        const items = feedResponse.items
        const userInfo = feedResponse.userDisplayInfo
        const postInfo = feedResponse.postDisplayInfo
    
        for (let i = 0; i < items.length; i++) {
            const serverPost = items[i].post
            if (!serverPost) { continue }
            processServerPost(serverPost)
        }

        for (let j = 0; j < userInfo.length; j++) {
            const info = userInfo[j]
            if (!info) { continue }
            processUserDisplayInfo(info)
        }
    }
    
    async function processUserDisplayInfo(userInfo: any) {
        if (!mainStore.pushnames[userInfo.uid] || mainStore.pushnames[userInfo.uid] != userInfo.contactName) {
            mainStore.pushnames[userInfo.uid] = userInfo.contactName
        }
        getAvatar(userInfo.uid, userInfo.avatarId)
    }


    async function processServerPost(serverPost: any) {
        
        const publisherUID = serverPost.publisherUid

        // console.log("haFeed/processServerPost/serverPost: ")
        // console.dir(serverPost)

        let postObject: Feed = { 
            postID: serverPost.id,
            userID: publisherUID,
            timestamp: serverPost.timestamp 
        }

        let postMediaArr: PostMedia[] = []
        
        const payloadBinArr = serverPost.payload
        if (!payloadBinArr) { return }
        const postContainer = await decodeToPostContainer(payloadBinArr)
    
        // hal.log('haFeed/processServerPost/postContainer: ' + JSON.stringify(postContainer, null, 4))
        // console.dir(postContainer)
    
        if (!postContainer) { return }
    
        if (publisherUID) {
            postObject.userID = publisherUID
        }
    
        let text = ''

        let isTextPost = false
        let isTextPostTextOnly = false
        let isAlbum = false
        let isVoiceNote = false
        let voiceNoteMedia: any
    
        let postMentions: any
    
        if (postContainer.album) {
            isAlbum = true
            // setMediaSizes(postContainer.album)



        }
    
        if (postContainer.text) {
            isTextPost = true
        }
    
        if (postContainer.voiceNote) {
            isVoiceNote = true
            voiceNoteMedia = postContainer.voiceNote.audio
        }
    
        if (isAlbum) {
            /* text */
            if (postContainer.album?.text) {
                if (postContainer.album.text.text) {
                    postObject.text = postContainer.album.text.text
                }
                postMentions = postContainer.album.text.mentions            
            }
    
            /* media */
            if (postContainer.album?.media) {
    
                for (const [index, mediaInfo] of postContainer.album.media.entries()) {
                    
                    if (mediaInfo.image && mediaInfo.image.width && mediaInfo.image.height) {
                        const encryptedResourceInfo = mediaInfo.image.img
                        if (encryptedResourceInfo?.encryptionKey && encryptedResourceInfo?.ciphertextHash && encryptedResourceInfo?.downloadUrl) {
                            let postMedia: PostMedia = {
                                postID: postObject.postID,
                                type: PostMediaType.Image,
                                order: index,
                                width: mediaInfo.image.width,
                                height: mediaInfo.image.height,
                                key: encryptedResourceInfo.encryptionKey,
                                hash: encryptedResourceInfo.ciphertextHash,
                                downloadURL: encryptedResourceInfo.downloadUrl,
                            }
                            postMediaArr.push(postMedia)
                        }
                    }
    
                    if (mediaInfo.video && mediaInfo.video.width && mediaInfo.video.height) {
                        const encryptedResourceInfo = mediaInfo.video.video


                        if (encryptedResourceInfo?.encryptionKey && encryptedResourceInfo?.ciphertextHash && encryptedResourceInfo?.downloadUrl) {
                            let postMedia: PostMedia = {
                                postID: postObject.postID,
                                type: PostMediaType.Video,
                                order: index,
                                width: mediaInfo.video.width,
                                height: mediaInfo.video.height,
                                key: encryptedResourceInfo.encryptionKey,
                                hash: encryptedResourceInfo.ciphertextHash,
                                downloadURL: encryptedResourceInfo.downloadUrl,
                            }

                            const isStream = JSON.stringify(mediaInfo.video.streamingInfo) !== '{}'
                            if (isStream) {
                                const blobVersion = mediaInfo.video.streamingInfo?.blobVersion
                                const chunkSize = mediaInfo.video.streamingInfo?.chunkSize
                                const blobSize = mediaInfo.video.streamingInfo?.blobSize
                                
                                if (chunkSize) {
                                    postMedia.chunkSize = chunkSize                             
                                }
                                if (blobSize) {
                                    postMedia.blobSize = blobSize
                                }    
                                if (blobVersion) {
                                    postMedia.blobVersion = blobVersion
                                }   
                            }

                            postMediaArr.push(postMedia)

                        }

                    }                
                }


            }
    
            /* voiceNote inside album */
            if (postContainer.album?.voiceNote) {
                isVoiceNote = true
                voiceNoteMedia = postContainer.album.voiceNote.audio
            }     
        }
    
        if (isTextPost) {
            /* link preview */
            // if (postContainer.text.link &&
            //     postContainer.text.link.preview &&
            //     postContainer.text.link.preview[0] &&
            //     postContainer.text.link.preview[0].img
            //     ) {
            //         const previewImage = postContainer.text.link.preview[0]
            //         const media = previewImage.img
            // } else {
            //     isTextPostTextOnly = true
            // }
    
            /* process text after checking if it's text only */
            if (postContainer.text?.text) {
                postObject.text = postContainer.text.text
                postMentions = postContainer.text.mentions            
            }        
        }

        if (postMentions) {
            postObject.mentions = processMentions(postMentions)
        }

        // console.log("haFeed/processServerPost/postObject: ")
        // console.dir(postObject)

        insertPostIfNotExist(postObject)
        insertPostMedia(postObject.postID, postMediaArr)  
    }
    

    function processMentions(postMentions: any) {

        let arr: Mention[] = []
        for (let i = 0; i < postMentions.length; i++) {
            const mention: Mention = {
                index: postMentions[i].index,
                userID: postMentions[i].userId,
                name: postMentions[i].name
            }
            arr.push(mention)
        }

        return arr
    }

    async function insertPostIfNotExist(post: any) {
    
        const postID = post.postID
        const dbFeedsList = await db.feed.where('postID').equals(postID).toArray()
        
        if (dbFeedsList.length == 0) {
            try {
                const id = await db.feed.put(post)
            } catch (error) {
                hal.log('homeMain/processPostContainer/db/put/error ' + error)
            }
        } else {
            // hal.log('homeMain/processPostContainer/exit/postObject already in db \n' + JSON.stringify(post) + '\n\n')
        }
    
    }
    
    async function insertPostMedia(postID: string, postMediaArr: any) {
        if (postMediaArr.length < 1) { return }

        const dbPostMediaList = await db.postMedia.where('postID').equals(postID).toArray()
        
        if (dbPostMediaList.length == 0) {
            for (let i = 0; i < postMediaArr.length; i++) {
                let postMedia = postMediaArr[i]
                
                try {
                    const id = await db.postMedia.put(postMedia)

                    const arr = await db.postMedia.toArray()

                } catch (error) {
                    hal.log('homeMain/insertPostMedia/db/put/error ' + error)
                }
            }

        } else {
            // hal.log('homeMain/processPostContainer/exit/postObject already in db \n' + JSON.stringify(post) + '\n\n')
        }
    
    }

    async function getPostMedia(postID: string) {
        const arr = await db.postMedia.where('postID').equals(postID).toArray()
        return arr
    }

    async function modifyPost(postID: string, order: number, blob: Blob) {
        await db.postMedia.where('postID').equals(postID).and((postMedia) => {
            return postMedia.order == order
        }).modify({
            blob: blob
        })
        
        return        
    }
    
    async function decodeToPostContainer(binArray: Uint8Array) {
        const err = clients.Container.verify(binArray)
        if (err) {
            throw err
        }
        const container = clients.Container.decode(binArray)
        const postContainer = container?.postContainer
        return postContainer
    }

    return { processWebContainer, getPostMedia, modifyPost }
}