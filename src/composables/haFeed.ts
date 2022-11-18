import { ref } from 'vue'
import { Dexie, liveQuery } from 'dexie'
import { DateTime } from 'luxon'

import { useMainStore } from '@/stores/mainStore.js'
import { useConnStore } from '@/stores/connStore.js'

import {    db, 
            Post, Comment, Group, Mention, CommonMediaLinkPreview,
            CommonMedia, SubjectType, MediaType } from '@/db'

import { clients } from '@/proto/clients.js'
import { web } from '@/proto/web.js'

import { network } from '@/common/network'

import { useHAComment } from '@/composables/haComment'
import { useHAGroup } from '@/composables/haGroup'
import { useHAAvatar } from '@/composables/haAvatar'
import { useHAText } from '@/composables/haText'
import { useHACommonMedia } from '@/composables/haCommonMedia'
import { useHALog } from '@/composables/haLog'

export const gotNewPost = ref(false)

export function useHAFeed() {

    const mainStore = useMainStore()
    const connStore = useConnStore()
    
    const { requestCommentsIfNeeded, requestComments } = useHAComment()
    const { processGroupDisplayInfoList, modifyGroupNumUnseen } = useHAGroup()
    const { insertOrModifyAvatar } = useHAAvatar()
    const { processText } = useHAText()
    const { insertCommonMedia } = useHACommonMedia()
    const { hal } = useHALog()

    let { 
        createReceiptUpdateWebContainer,
        createWebStanzaPacket
    } = network()    

    

    async function updateReceipt(contentID: string, userID: number, timestamp: number, callback?: Function) {
        if (!connStore.isConnectedToMobile) { return }
        console.log('haFeed/updateReceipt')
        
        const receiptUpdateWebContainer = createReceiptUpdateWebContainer(contentID, userID, timestamp)        
        const encryptedWebContainer = connStore.encryptWebContainer(receiptUpdateWebContainer.webContainerBinArr)

        const packet = createWebStanzaPacket(encryptedWebContainer)
        
        const needAuth = true
        connStore.enqueueMessage(packet, receiptUpdateWebContainer.webContainer, needAuth, callback)            
    }


    async function processFeedResponse(feedResponse: any) {
        // hal.log('haFeed/processFeedResponse: ' + JSON.stringify(feedResponse))

        const items = feedResponse.items
        const userInfo = feedResponse.userDisplayInfo
        const postInfoList = feedResponse.postDisplayInfo
        const groupInfo = feedResponse.groupDisplayInfo

        /* processs groups first and wait for it to finish as processItems might need to modify groups list */
        await processGroupDisplayInfoList(groupInfo)

        if (items.length < 1) { return }

        const firstItemPost = items[0].post
        const lastItemPost = items[items.length - 1].post

        hal('haFeed/processFeedResponse/process num items: ' + items.length)()
        if (feedResponse.type == web.FeedType.POST_COMMENTS) {
            for (let i = 0; i < items.length; i++) {
                const item = items[i]
                let infoIdx = postInfoList.findIndex((info: any) => info.id === item.comment.postId)
                const postInfo = postInfoList[infoIdx]
                processFeedItemComment(items[i], postInfo)
                postInfoList.splice(infoIdx, 1)
            }
            if (items.length > 0) {
                const postID = items[0].comment.postId
                modifyPostHaveCommentIfNeeded(postID)
            }
        } else {
            /* 
                special case to not process posts as this is usually our first request upon browser refresh
                to pre-emptively (for better UX) see if there are new posts, of which usually there isn't 
            */
            if (firstItemPost.id == mainStore.mainFeedHeadPostID && [1, 3, 5].includes(items.length)) {
                hal('haFeed/processFeedResponse/redundant, should return in the future, item: ' + items.length)()
                // return
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
        }

        await processUserDisplayInfoList(userInfo)

        /* 
         * robustness: should make all processing async/awaits and bulk insert into db,
         * and record only after everything succeeds 
         */
        if (feedResponse.type == web.FeedType.HOME) {
            // console.log("--> main feed: " + JSON.stringify(feedResponse, null, 2))

            /* record most recent main feed post */
            if (firstItemPost.timestamp >= mainStore.mainFeedHeadPostTimestamp) {
                if (firstItemPost.id != mainStore.mainFeedHeadPostID) {
                    mainStore.mainFeedHeadPostID = firstItemPost.id
                    mainStore.mainFeedHeadPostTimestamp = firstItemPost.timestamp                
                }
            }

            /* record oldest main feed post */
            if (lastItemPost.timestamp <= mainStore.mainFeedTailPostTimestamp || 
                mainStore.mainFeedTailPostTimestamp == 0) {

                if (lastItemPost.id != mainStore.mainFeedTailPostID) {
                    mainStore.mainFeedTailPostID = lastItemPost.id
                    mainStore.mainFeedTailPostTimestamp = lastItemPost.timestamp       
                    
                    /* record nextCursor as there's more items */
                    if (feedResponse.nextCursor) {
                        mainStore.mainFeedNextCursor = feedResponse.nextCursor
                        const numDBItems = await db.post.count()

                        /* if there's less than x feed items, fill it */
                        if (numDBItems < 5) {
                            connStore.requestFeedItems(mainStore.mainFeedNextCursor, 50, function() {})
                        }
                    } 
                    
                    /* no more feed items to retrieve, use the oldest post for the next request */
                    else {
                        mainStore.mainFeedNextCursor = mainStore.mainFeedTailPostID
                    }
                }
            }
        }

        if (feedResponse.type == web.FeedType.GROUP) {

            if (lastItemPost.groupId) {

                // todo: check for timestamp also?
                if (feedResponse.nextCursor) {
                    mainStore.groupFeedCursors[lastItemPost.groupId] = feedResponse.nextCursor
                }

            }
        }

        if (feedResponse.type == web.FeedType.POST_COMMENTS) {
            // console.log("--> " + JSON.stringify(feedResponse, null, 2))

            const lastItemComment = items[items.length - 1].comment
            if (!lastItemComment.postId) { return }

            if (!mainStore.commentCursors[lastItemComment.postId]) {
                mainStore.commentCursors[lastItemComment.postId] = {
                    cursor: '',
                    tailItemID: lastItemComment.commentId, // oldest known item
                    tailItemTimestamp: lastItemComment.timestamp,
                    isRequestingAllItems: false,
                    isAllItemsComplete: false
                }
            }

            const savedCommentCursor = mainStore.commentCursors[lastItemComment.postId]

            if (feedResponse.nextCursor) {
                
                // There can be different items with the same timestamp
                if (lastItemComment.timestamp <= savedCommentCursor.tailItemTimestamp) {

                    if (lastItemComment.commentID != savedCommentCursor.tailItemID) {
                        savedCommentCursor.cursor = feedResponse.nextCursor
                        savedCommentCursor.tailItemID = lastItemComment.commentID
                        savedCommentCursor.tailItemTimestamp = lastItemComment.timestamp

                        if (savedCommentCursor.isRequestingAllItems && !savedCommentCursor.isAllItemsComplete) {
                            setTimeout(function() {
                                requestCommentsIfNeeded(lastItemComment.postId, 50, function() {})
                            }, 1000)
                            
                        }

                    }
                }

            } else {
                mainStore.commentCursors[lastItemComment.postId].isAllItemsComplete = true
            }

            // scenario where items are completed but there are more new items
            if (savedCommentCursor.isAllItemsComplete) {
                const dbComment = await db.comment.where('commentID').equals(lastItemComment.id).first()
                if (dbComment) { return }
                setTimeout(function() {
                    requestComments(lastItemComment.postId, lastItemComment.id, 50, function() {})
                }, 1000)
                
            }

        }

    }

    async function processFeedUpdate(feedUpdate: any) {
        const items = feedUpdate.items
        const userInfo = feedUpdate.userDisplayInfo
        const postInfoList = feedUpdate.postDisplayInfo
        const groupInfo = feedUpdate.groupDisplayInfo

        /* processs groups first and wait for it to finish as processItems might need to modify groups list */
        await processGroupDisplayInfoList(groupInfo)  

        hal('haFeed/processFeedUpdate/process num items: ' + items.length)()
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            console.dir(item)
            const serverPost = item.post
            const serverComment = item.comment

            if (serverComment) {
                hal('haFeed/processFeedUpdate/comment')()
                const postID = serverComment.postId
                const infoIdx = postInfoList.findIndex((info: any) => info.id === postID)
                const postInfo = postInfoList[infoIdx]
                processFeedItemComment(item, postInfo)
                postInfoList.splice(infoIdx, 1)

                modifyPostHaveCommentIfNeeded(postID)
            }
            else if (serverPost) {
                hal('haFeed/processFeedUpdate/post')()
                const postID = item.post.id
                const infoIdx = postInfoList.findIndex((info: any) => info.id === postID)
                const postInfo = postInfoList[infoIdx]
                processFeedItem(item, postInfo)
                postInfoList.splice(infoIdx, 1)
            }
        }

        await processUserDisplayInfoList(userInfo)
    }    

    async function processUserDisplayInfoList(userInfoList: any) {
        for (let j = 0; j < userInfoList.length; j++) {
            const info = userInfoList[j]
            if (!info) { continue }
            processUserDisplayInfo(info)
        }
    }

    async function processUserDisplayInfo(userInfo: any) {
        if (!mainStore.pushnames[userInfo.uid] || mainStore.pushnames[userInfo.uid] != userInfo.contactName) {
            mainStore.pushnames[userInfo.uid] = userInfo.contactName
        }
        await insertOrModifyAvatar(userInfo.uid, userInfo.avatarId)
    }

    async function processFeedItem(feedItem: any, postInfo: any) {
        const groupID = feedItem.groupId

        const serverPost = feedItem.post
        if (!serverPost) { return }
        
        const publisherUID = serverPost.publisherUid

        // console.log("haFeed/processServerPost/serverPost: ")
        // console.dir(serverPost)

        let postObject: Post = { 
            postID: serverPost.id,
            userID: publisherUID,
            timestamp: serverPost.timestamp,
            seenState: postInfo.seenState,
            transferState: postInfo.transferState,
            retractState: postInfo.retractState,
            unreadComments: postInfo.unreadComments,
            expiryTimestamp: feedItem.expiryTimestamp
        }

        if (postInfo.userReceipts) {
            postObject.userReceipts = postInfo.userReceipts
        }

        if (groupID) {
            postObject.groupID = groupID
        }

        if (publisherUID) {
            postObject.userID = publisherUID
        }

        const payloadBinArr = serverPost.payload
        if (!payloadBinArr) { return }
        const postContainer = decodeToPostContainer(payloadBinArr)
    
        hal('haFeed/processFeedItem/postContainer: \n' + JSON.stringify(postContainer) + '\n\n')()
        // console.dir(postContainer)
    
        if (!postContainer) { return }
        if (postContainer.moment) {
            hal('haFeed/processFeedItem/postContainer is a moment, skip')()
            return
        }
    
        const subjectID = postObject.groupID ? postObject.groupID : ''

        let commonMediaArr: CommonMedia[] = []

        let isTextPost = false
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

            const voiceNoteMedia = processCommonMediaVoiceNote(SubjectType.FeedPost, subjectID, postObject.postID, postContainer.voiceNote)
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
                            let commonMedia: CommonMedia = {
                                type: SubjectType.FeedPost,
                                subjectID: subjectID,
                                contentID: postObject.postID,
                                mediaType: MediaType.Image,
                                order: index,
                                width: mediaInfo.image.width,
                                height: mediaInfo.image.height,
                                key: encryptedResourceInfo.encryptionKey,
                                hash: encryptedResourceInfo.ciphertextHash,
                                downloadURL: encryptedResourceInfo.downloadUrl,
                            }
                            commonMediaArr.push(commonMedia)
                        }
                    }
    
                    else if (mediaInfo.video && mediaInfo.video.width && mediaInfo.video.height) {
                        const encryptedResourceInfo = mediaInfo.video.video
                        if (encryptedResourceInfo?.encryptionKey && encryptedResourceInfo?.ciphertextHash && encryptedResourceInfo?.downloadUrl) {
                            let commonMedia: CommonMedia = {
                                type: SubjectType.FeedPost,
                                subjectID: subjectID,
                                contentID: postObject.postID,
                                mediaType: MediaType.Video,
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
                                    commonMedia.chunkSize = chunkSize                             
                                }
                                if (blobSize) {
                                    commonMedia.blobSize = blobSize
                                }    
                                if (blobVersion) {
                                    commonMedia.blobVersion = blobVersion
                                }   
                            }
                            commonMediaArr.push(commonMedia)
                        }
                    }                
                }
            }
    
            /* voiceNote inside album */
            if (postContainer.album?.voiceNote) {
                isVoiceNote = true
            
                const voiceNoteMedia = processCommonMediaVoiceNote(SubjectType.FeedPost, subjectID, postObject.postID, postContainer.album.voiceNote)
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
                const linkPreview = processCommonMediaLinkPreview(SubjectType.FeedPost, subjectID, postObject.postID, postContainer.text.link)
                if (linkPreview) {
                    postObject.linkPreview = linkPreview
                }
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

        // console.log("haFeed/processServerPost/postObject: ")
        // console.dir(postObject)

        insertCommonMedia(SubjectType.FeedPost, subjectID, postObject.postID, commonMediaArr)
        await insertOrModifyPost(postObject)

        /* modify groups list with numUnseen, which depends on post to be added or modified first */
        if (groupID) {
         
            let mediaType: MediaType = 0
            if (commonMediaArr.length > 0) {
                const firstMedia = commonMediaArr[0]
                mediaType = firstMedia.mediaType
            }

            modifyGroupIfNeeded(postObject, mediaType, isVoiceNote)
        }

    }

    function processFeedItemComment(feedItem: any, postInfo: any) {
        const serverComment = feedItem.comment
        if (!serverComment) { return }
        
        const publisherUID = serverComment.publisherUid

        // console.log("haFeed/processFeedItemComment/serverComment: ")
        // console.dir(serverComment)

        let commentObject: Comment = {
            commentID: serverComment.id,
            postID: serverComment.postId,
            userID: publisherUID,
            type: serverComment.CommentType,
            timestamp: serverComment.timestamp,
        }

        if (serverComment.parentCommentId) {
            commentObject.parentCommentID = serverComment.parentCommentId
        }

        // todo: record name

        let commonMediaArr: CommonMedia[] = []
        
        const payloadBinArr = serverComment.payload
        if (!payloadBinArr) { return }
        const commentContainer = decodeToCommentContainer(payloadBinArr)
    
        // hal.log('haFeed/processFeedItemComment/commentContainer:')
        // console.dir(commentContainer)
    
        if (!commentContainer) { return }
    
        let isTextComment = false
        let isAlbum = false
        let isVoiceNote = false
    
        let commentMentions: any
    
        if (commentContainer.album) {
            isAlbum = true
        }
    
        if (commentContainer.text) {
            isTextComment = true
        }
    
        if (commentContainer.voiceNote) {
            isVoiceNote = true

            const voiceNoteMedia = processCommonMediaVoiceNote(SubjectType.Comment, commentObject.postID, commentObject.commentID, commentContainer.voiceNote)
            if (voiceNoteMedia) {
                commentObject.voiceNote = voiceNoteMedia
            }
        }
    
        if (isAlbum) {
            /* text */
            if (commentContainer.album?.text) {
                if (commentContainer.album.text.text) {
                    commentObject.text = commentContainer.album.text.text
                }
                commentMentions = commentContainer.album.text.mentions            
            }
    
            /* media */
            if (commentContainer.album?.media) {
    
                for (const [index, mediaInfo] of commentContainer.album.media.entries()) {
                    
                    if (mediaInfo.image && mediaInfo.image.width && mediaInfo.image.height) {
                        const encryptedResourceInfo = mediaInfo.image.img
                        if (encryptedResourceInfo?.encryptionKey && encryptedResourceInfo?.ciphertextHash && encryptedResourceInfo?.downloadUrl) {
                            let commonMedia: CommonMedia = {
                                type: SubjectType.Comment,
                                subjectID: commentObject.postID,
                                contentID: commentObject.commentID,
                                mediaType: MediaType.Image,
                                order: index,
                                width: mediaInfo.image.width,
                                height: mediaInfo.image.height,
                                key: encryptedResourceInfo.encryptionKey,
                                hash: encryptedResourceInfo.ciphertextHash,
                                downloadURL: encryptedResourceInfo.downloadUrl,
                            }
                            commonMediaArr.push(commonMedia)
                        }
                    }
    
                    else if (mediaInfo.video && mediaInfo.video.width && mediaInfo.video.height) {
                        const encryptedResourceInfo = mediaInfo.video.video
                        if (encryptedResourceInfo?.encryptionKey && encryptedResourceInfo?.ciphertextHash && encryptedResourceInfo?.downloadUrl) {
                            let commonMedia: CommonMedia = {
                                type: SubjectType.Comment,
                                subjectID: commentObject.postID,
                                contentID: commentObject.commentID,
                                mediaType: MediaType.Video,
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
                                    commonMedia.chunkSize = chunkSize                             
                                }
                                if (blobSize) {
                                    commonMedia.blobSize = blobSize
                                }    
                                if (blobVersion) {
                                    commonMedia.blobVersion = blobVersion
                                }   
                            }
                            commonMediaArr.push(commonMedia)
                        }
                    }                
                }
            }
    
            /* voiceNote inside album */
            if (commentContainer.album?.voiceNote) {
                isVoiceNote = true
            
                const voiceNoteMedia = processCommonMediaVoiceNote(SubjectType.Comment, commentObject.postID, commentObject.commentID, commentContainer.album.voiceNote)
                if (voiceNoteMedia) {
                    commentObject.voiceNote = voiceNoteMedia
                }

            }     
        }
    
        if (isTextComment) {
            /* link preview */
            if (commentContainer?.text?.link?.preview &&
                commentContainer.text.link.preview[0].img
                ) {
                const linkPreview = processCommonMediaLinkPreview(SubjectType.Comment, commentObject.postID, commentObject.commentID, commentContainer.text.link)
                if (linkPreview) {
                    commentObject.linkPreview = linkPreview
                }
            }
    
            /* process text after checking if it's text only */
            if (commentContainer.text?.text) {
                commentObject.text = commentContainer.text.text
                commentMentions = commentContainer.text.mentions     
            }        
        }

        if (commentMentions) {
            commentObject.mentions = processMentions(commentMentions)
        }

        // console.log('haFeed/processFeedItemComment/commnentObject: ')
        // console.dir(commentObject)

        insertComment(commentObject)
        insertCommonMedia(SubjectType.Comment, commentObject.postID, commentObject.commentID, commonMediaArr)
    }

    function processCommonMediaLinkPreview(type: SubjectType, subjectID: string, contentID: string, linkPreview: any) {

        let linkPreviewObject: CommonMediaLinkPreview = {
            url: linkPreview.url,
            title: linkPreview.title,
            description: linkPreview.description
        }
        const linkPreviewMedia = linkPreview.preview[0]

        const encryptedResourceInfo = linkPreviewMedia.img
        if (encryptedResourceInfo?.encryptionKey && encryptedResourceInfo?.ciphertextHash && encryptedResourceInfo?.downloadUrl) {
            let commonMedia: CommonMedia = {
                type: type,
                subjectID: subjectID, // todo: this needs to be assigned
                contentID: contentID,
                mediaType: MediaType.Image,
                order: 0,
                width: linkPreviewMedia.width,
                height: linkPreviewMedia.height,
                key: encryptedResourceInfo.encryptionKey,
                hash: encryptedResourceInfo.ciphertextHash,
                downloadURL: encryptedResourceInfo.downloadUrl,
            }
            linkPreviewObject.preview = commonMedia
        }
        return linkPreviewObject        
    }

    function processCommonMediaVoiceNote(type: SubjectType, subjectID: string, contentID: string, voiceNote: any) {
        const encryptedResourceInfo = voiceNote.audio
        if (encryptedResourceInfo?.encryptionKey && encryptedResourceInfo?.ciphertextHash && encryptedResourceInfo?.downloadUrl) {
            let commonMedia: CommonMedia = {
                type: type,
                subjectID: subjectID,
                contentID: contentID,
                mediaType: MediaType.Audio,
                order: 0,
                width: 0,
                height: 0,
                key: encryptedResourceInfo.encryptionKey,
                hash: encryptedResourceInfo.ciphertextHash,
                downloadURL: encryptedResourceInfo.downloadUrl,
            }
            return commonMedia
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

    /* db functions */

    async function modifyGroupIfNeeded(post: any, mediaType: MediaType, isVoiceNote: boolean) {

        const numUnseen = await db.post.where('groupID').equals(post.groupID).and(item => {
            return item.seenState == web.PostDisplayInfo.SeenState.UNSEEN
        }).toArray()

        await db.group.where('groupID').equals(post.groupID).modify(async (group: any) => {

            if (post.retractState != web.PostDisplayInfo.RetractState.RETRACTED) {
                if (group.lastChangeTimestamp < post.timestamp) {
                    group.lastChangeTimestamp = post.timestamp

                    group.lastContentMediaType = mediaType
                    
                    if (post.text) {
                        const truncateText = true
                        const maxCharsWhenTruncated = 500
                        const processedText = processText(post.text, post.mentions, truncateText, maxCharsWhenTruncated)
                        group.lastContent = processedText.html
                    }

                    // todo: figure out if voicenote display is actually needed            
                }
            }

            /* update group numUnseen */
            if (group.numUnseen != numUnseen.length) {
                group.numUnseen = numUnseen.length
            }            

            return
        })  
    }

    async function insertOrModifyPost(post: any) {
        const postID = post.postID
        const dbPost = await db.post.where('postID').equals(postID).first()
        
        if (!dbPost) {

            /* 
             * If the post does not exist, there's no need to show it as deleted
             * Even more so for Moments, in which web does not support yet and does not want to show deleted moments
             */
            if (post.retractState == web.PostDisplayInfo.RetractState.RETRACTED) { return }

            try {
                await db.post.add(post)

                if (mainStore.userID != post.uid) {
                    gotNewPost.value = true
                }

                const isUnseen = post.seenState == web.PostDisplayInfo.SeenState.UNSEEN

                // hal.log('haFeed/insertOrModifyPost/db/add/inserted: ' + post.postID)
            } catch (error) {
                hal('haFeed/insertOrModifyPost/db/add/error ' + error)()
            }
            return
        } 

        hal('haFeed/insertOrModifyPost/post exists: ' + post.postID)()

        const isSeenStateChanged = post.seenState != dbPost.seenState

        // might need to revisit with a better comparison
        if (isSeenStateChanged || 
            post.transferState != dbPost.transferState ||
            post.retractState != dbPost.retractState || 
            post.unreadComments != dbPost.unreadComments ||
            JSON.stringify(post.userReceipts) != JSON.stringify(dbPost.userReceipts)
        ) {

            await db.post.where('postID').equals(postID).modify(function(item) {
                if (item.seenState != post.seenState) {
                    item.seenState = post.seenState
                }
                if (item.transferState != post.transferState) {
                    item.transferState = post.transferState
                }
                if (item.retractState != post.retractState) {
                    item.retractState = post.retractState
                }              
                if (item.unreadComments != post.unreadComments) {
                    item.unreadComments = post.unreadComments
                }                     
                if (JSON.stringify(item.userReceipts) != JSON.stringify(post.userReceipts)) {
                    item.userReceipts = post.userReceipts
                }
            })
        }

    }

    async function insertComment(comment: Comment) {

        const commentID = comment.commentID
        const dbCommentsList = await db.comment.where('commentID').equals(commentID).toArray()
        
        if (dbCommentsList.length == 0) {
            try {
                const id = await db.comment.put(comment)
                hal('haFeed/insertComment/post: ' + comment.postID + ', comment: ' + comment.commentID)()
            } catch (error) {
                hal('haFeed/insertComment/post: ' + comment.postID + ', ' + 'error: ' + error)()
            }
        } else {
            hal('haFeed/insertComment/post: ' + comment.postID + ', comment: ' + comment.commentID + ' already exists: ' + comment.commentID)()
        }
        
    }    
    
    async function deleteExpiredPosts () {
        const currentTime = DateTime.local()
        const currentTimeInSeconds: number = Math.round(currentTime.toSeconds())
        try {
            /* use between as some older mobile clients seem to have expiryTimestamp set to 0 */
            const deleteCount = await db.post.where('expiryTimestamp').between(1, currentTimeInSeconds).delete()
            hal('haFeed/deleteExpiredPosts/deleted: ' + deleteCount)()
        } catch (error) {
            hal('haFeed/deleteExpiredPosts/error: ' + error)()
        }
    }

    function handleDbError(error: any) {
        let result = {
            continue: true
        }
        switch (error.name) {
            case Dexie.errnames.DatabaseClosed:
                console.error ("DatabaseClosed error")
                result.continue = false
                break
            default:
                console.error ("error: " + error)
        }
        return result
    }

    async function modifyPostHaveCommentIfNeeded(postID: string) {
        await db.post.where('postID').equals(postID).modify(function(item) {
            if (!item.haveComments) {
                item.haveComments = true
            }
        })
        return        
    }

    function decodeToPostContainer(binArray: Uint8Array) {
        const err = clients.Container.verify(binArray)
        if (err) {
            throw err
        }
        const container = clients.Container.decode(binArray)
        const postContainer = container.postContainer
        return postContainer
    }

    function decodeToCommentContainer(binArray: Uint8Array) {
        const err = clients.Container.verify(binArray)
        if (err) {
            throw err
        }
        const container = clients.Container.decode(binArray)
        const commentContainer = container.commentContainer
        return commentContainer
    }

    return {
        
        processFeedResponse, processFeedUpdate,
        processUserDisplayInfo,
        updateReceipt,
        deleteExpiredPosts
    }
}