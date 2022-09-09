import { Dexie, liveQuery } from "dexie"

import { useMainStore } from '@/stores/mainStore.js'
import { useConnStore } from '@/stores/connStore.js'

import { db, Feed, PostMedia, PostMediaType, LinkPreview, Mention, Group } from '@/db'

import { clients } from '@/proto/clients.js'
import { web } from '@/proto/web.js'

import { useHAAvatar } from '@/composables/haAvatar'

import hal from '../common/halogger'

export function useHAFeed() {

    const mainStore = useMainStore()
    const connStore = useConnStore()

    const { getAvatar, fetchGroupAvatar } = useHAAvatar()

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
        const postInfoList = feedResponse.postDisplayInfo
        const groupInfo = feedResponse.groupDisplayInfo
    
        if (items.length < 1) { return }

        const firstItemPost = items[0].post
        const lastItemPost = items[items.length - 1].post

        /* 
            special case to not process posts as this is usually our first request upon browser refresh
            to pre-emptively (for better UX) see if there are new posts, of which usually there isn't 
        */
        if (firstItemPost.id == mainStore.mainFeedHeadPostID && [3, 5].includes(items.length)) {
            return
        }

        /* 
            nb: There is a special case in which there can be more than 3 or 5 new posts (ie. 10) and 
            we will only process up to 3 or 5, the rest are to be handled via updates
        */
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            let infoIdx = postInfoList.findIndex((info: any) => info.id === item.post.id)
            const postInfo = postInfoList[infoIdx]
            processFeedItem(items[i], postInfo)
            postInfoList.splice(infoIdx, 1)
        }
        
        for (let j = 0; j < userInfo.length; j++) {
            const info = userInfo[j]
            if (!info) { continue }
            processUserDisplayInfo(info)
        }

        for (let j = 0; j < groupInfo.length; j++) {
            const info = groupInfo[j]
            if (!info) { continue }
            processGroupDisplayInfo(info)
        }

        /* 
         * robustness: should make all processing async/awaits and bulk insert into db,
         * and record only after everything succeeds 
         */

        /* record most recent post */
        if (firstItemPost.timestamp >= mainStore.mainFeedHeadPostTimestamp) {
            if (firstItemPost.id != mainStore.mainFeedHeadPostID) {
                mainStore.mainFeedHeadPostID = firstItemPost.id
                mainStore.mainFeedHeadPostTimestamp = firstItemPost.timestamp                
            }
        }

        /* record oldest post */
        if (lastItemPost.timestamp <= mainStore.mainFeedTailPostTimestamp || 
            mainStore.mainFeedTailPostTimestamp == 0) {

            if (lastItemPost.id != mainStore.mainFeedTailPostID) {
                mainStore.mainFeedTailPostID = lastItemPost.id
                mainStore.mainFeedTailPostTimestamp = lastItemPost.timestamp       
                
                /* record nextCursor as there's more items */
                if (feedResponse.nextCursor) {
                    mainStore.mainFeedNextCursor = feedResponse.nextCursor
                    const numDBItems = await db.feed.count()
        
                    /* if there's less than x feed items, fill it */
                    if (numDBItems < 10) {
                        connStore.requestFeedItems(mainStore.mainFeedNextCursor, 10, function() {})
                    }
                } 
                
                /* no more feed items to retrieve, use the oldest post for the next request */
                else {
                    mainStore.mainFeedNextCursor = mainStore.mainFeedTailPostID
                }
            }
        }
    }
    
    async function processUserDisplayInfo(userInfo: any) {
        if (!mainStore.pushnames[userInfo.uid] || mainStore.pushnames[userInfo.uid] != userInfo.contactName) {
            mainStore.pushnames[userInfo.uid] = userInfo.contactName
        }
        getAvatar(userInfo.uid, userInfo.avatarId)
    }

    async function processGroupDisplayInfo(info: any) {

        let group: Group = { 
            groupID: info.id,
            name: info.name
        }

        if (!mainStore.groupnames[group.groupID] || mainStore.groupnames[group.groupID] != group.name) {
            mainStore.groupnames[group.groupID] = group.name
        }
        fetchGroupAvatar(group.groupID, info.avatarId)
        insertGroup(group)
    }    
    
    async function processFeedItem(feedItem: any, postInfo: any) {

        const groupID = feedItem.groupId

        const serverPost = feedItem.post
        if (!serverPost) { return }
        
        const publisherUID = serverPost.publisherUid

        // console.log("haFeed/processServerPost/serverPost: ")
        // console.dir(serverPost)

        let postObject: Feed = { 
            postID: serverPost.id,
            userID: publisherUID,
            timestamp: serverPost.timestamp,
            retractState: postInfo.retractState
        }

        let postMediaArr: PostMedia[] = []
        
        const payloadBinArr = serverPost.payload
        if (!payloadBinArr) { return }
        const postContainer = await decodeToPostContainer(payloadBinArr)
    
        hal.log('haFeed/processServerPost/postContainer:')
        console.dir(postContainer)
    
        if (!postContainer) { return }
    
        if (groupID) {
            postObject.groupID = groupID
        }

        if (publisherUID) {
            postObject.userID = publisherUID
        }
    
        let text = ''
        let isTextPost = false
        let isTextPostTextOnly = false
        let isAlbum = false
        let isVoiceNote = false
    
        let postMentions: any
    
        if (postContainer.album) {
            isAlbum = true
        }
    
        if (postContainer.text) {
            isTextPost = true
        }
    
        if (postContainer.voiceNote) {
            isVoiceNote = true

            const voiceNoteMedia = processVoiceNote(postObject.postID, postContainer.voiceNote)
            if (voiceNoteMedia) {
                postObject.voiceNote = voiceNoteMedia
            }
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
    
                    else if (mediaInfo.video && mediaInfo.video.width && mediaInfo.video.height) {
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
            
                const voiceNoteMedia = processVoiceNote(postObject.postID, postContainer.album.voiceNote)
                if (voiceNoteMedia) {
                    postObject.voiceNote = voiceNoteMedia
                }
            }     
        }
    
        if (isTextPost) {
            /* link preview */
            if (postContainer?.text?.link &&
                postContainer.text.link.preview &&
                postContainer.text.link.preview[0] &&
                postContainer.text.link.preview[0].img
                ) {
                    const previewImage = postContainer.text.link.preview[0]
                    const media = previewImage.img

                    const linkPreview = processLinkPreview(postObject.postID, postContainer.text.link)
                    console.dir(linkPreview)
                    if (linkPreview) {
                        postObject.linkPreview = linkPreview

                    }

            } else {
                isTextPostTextOnly = true
            }
    
            /* process text after checking if it's text only */
            if (postContainer.text?.text) {
                postObject.text = postContainer.text.text
                postMentions = postContainer.text.mentions     
            }        
        }

        if (postMentions) {
            postObject.mentions = processMentions(postMentions)
        }

        console.log("haFeed/processServerPost/postObject: ")
        console.dir(postObject)

        insertPostIfNotExist(postObject)
        insertPostMedia(postObject.postID, postMediaArr)
    }
    
    function processLinkPreview(postID: string, linkPreview: any) {

        let linkPreviewObject: LinkPreview = {
            url: linkPreview.url,
            title: linkPreview.title,
            description: linkPreview.description
        }
        const linkPreviewMedia = linkPreview.preview[0]

        const encryptedResourceInfo = linkPreviewMedia.img
        if (encryptedResourceInfo?.encryptionKey && encryptedResourceInfo?.ciphertextHash && encryptedResourceInfo?.downloadUrl) {
            let postMedia: PostMedia = {
                postID: postID,
                type: PostMediaType.Image,
                order: 0,
                width: linkPreviewMedia.width,
                height: linkPreviewMedia.height,
                key: encryptedResourceInfo.encryptionKey,
                hash: encryptedResourceInfo.ciphertextHash,
                downloadURL: encryptedResourceInfo.downloadUrl,
            }
            linkPreviewObject.preview = postMedia
        }
        return linkPreviewObject        
    }

    function processVoiceNote(postID: string, voiceNote: any) {
        const encryptedResourceInfo = voiceNote.audio
        if (encryptedResourceInfo?.encryptionKey && encryptedResourceInfo?.ciphertextHash && encryptedResourceInfo?.downloadUrl) {
            let postMedia: PostMedia = {
                postID: postID,
                type: PostMediaType.Audio,
                order: 0,
                width: 0,
                height: 0,
                key: encryptedResourceInfo.encryptionKey,
                hash: encryptedResourceInfo.ciphertextHash,
                downloadURL: encryptedResourceInfo.downloadUrl,
            }
            return postMedia
        }
        return undefined
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
        if (!arr || arr.length == 0) {
            return undefined
        }
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

    async function modifyPostVoiceNote(postID: string, blob: Blob) {
        await db.feed.where('postID').equals(postID).modify(function(item) {
            if (item.voiceNote) {
                item.voiceNote.blob = blob
            }
        })
        return        
    }    
    
    async function modifyPostLinkPreviewMedia(postID: string, blob: Blob) {
        await db.feed.where('postID').equals(postID).modify(function(item) {
            if (item.linkPreview?.preview) {
                item.linkPreview.preview.blob = blob
            }
        })
        return        
    }   

    async function setPostMediaIsCodecH265(postID: string, order: number, isCodecH265: boolean) {
        await db.postMedia.where('postID').equals(postID).and((postMedia) => {
            return postMedia.order == order
        }).modify({
            isCodecH265: isCodecH265
        })
        
        return        
    }

    async function insertGroup(group: any) {
        try {
            const id = await db.group.put(group)
        } catch (error) {
            hal.log('haFeed/insertGroup/put/error ' + error)
        }
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

    return { 
        processWebContainer, getPostMedia, 
        modifyPost, modifyPostVoiceNote, modifyPostLinkPreviewMedia,
        setPostMediaIsCodecH265 }
}