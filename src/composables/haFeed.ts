import { Dexie, liveQuery } from 'dexie'

import { useMainStore } from '@/stores/mainStore.js'
import { useConnStore } from '@/stores/connStore.js'

import { db, SubjectType, Feed, PostMedia, PostMediaType, MediaType, Comment, CommonMedia, LinkPreview, CommonMediaLinkPreview, Mention, Group } from '@/db'

import { clients } from '@/proto/clients.js'
import { web } from '@/proto/web.js'

import { useHAAvatar } from '@/composables/haAvatar'
import { useHAText } from '@/composables/haText'

import hal from '@/common/halogger'
import { type } from 'os'

export function useHAFeed() {

    const mainStore = useMainStore()
    const connStore = useConnStore()
    
    const { getAvatar, fetchGroupAvatar } = useHAAvatar()
    const { processText } = useHAText()


    async function processWebContainer(webContainer: any) {
        const feedResponse = webContainer?.feedResponse
        const feedUpdate = webContainer?.feedUpdate

        if (feedResponse) { 
            processFeedResponse(feedResponse)
        } else if (feedUpdate) {
            processFeedUpdate(feedUpdate)
        }
    
    }

    async function processFeedResponse(feedResponse: any) {
        // hal.log('haFeed/processFeedResponse: ' + JSON.stringify(feedResponse))

        const items = feedResponse.items
        const userInfo = feedResponse.userDisplayInfo
        const postInfoList = feedResponse.postDisplayInfo
        const groupInfo = feedResponse.groupDisplayInfo

        /* processs groups first and wait for it to finish as processItems might need to modify groups list */
        await processGroupDisplayInfo(groupInfo)

        if (items.length < 1) { return }

        const firstItemPost = items[0].post
        const lastItemPost = items[items.length - 1].post

        hal.log('haFeed/processFeedResponse/process num items: ' + items.length)
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
                processFeedItem(items[i], postInfo, web.PostDisplayInfo.SeenState.SEEN)
                postInfoList.splice(infoIdx, 1)
            }
        }

        await processUserDisplayInfo(userInfo)

        /* 
         * robustness: should make all processing async/awaits and bulk insert into db,
         * and record only after everything succeeds 
         */
        if (feedResponse.type == web.FeedType.HOME) {

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
                        const numDBItems = await db.feed.count()

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
            const lastItemComment = items[items.length - 1].comment
            if (lastItemComment.postId) {

                // todo: check for timestamp also?
                if (feedResponse.nextCursor) {
                    mainStore.commentCursors[lastItemComment.postId] = feedResponse.nextCursor
                }

            }
        }

    }

    async function processFeedUpdate(feedUpdate: any) {
        hal.log('haFeed/processFeedUpdate: ' + JSON.stringify(feedUpdate))

        const items = feedUpdate.items
        const userInfo = feedUpdate.userDisplayInfo
        const postInfoList = feedUpdate.postDisplayInfo
        const groupInfo = feedUpdate.groupDisplayInfo

        /* processs groups first and wait for it to finish as processItems might need to modify groups list */
        await processGroupDisplayInfo(groupInfo)  

        hal.log('haFeed/processFeedUpdate/process num items: ' + items.length)
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const serverPost = item.post
            const serverComment = item.comment

            if (serverComment) {
                const postID = serverComment.postId
                const infoIdx = postInfoList.findIndex((info: any) => info.id === postID)
                const postInfo = postInfoList[infoIdx]
                processFeedItemComment(item, postInfo)
                postInfoList.splice(infoIdx, 1)

                modifyPostHaveCommentIfNeeded(postID)
            }
            else if (serverPost) {
                const postID = item.post.id
                const groupID = item.post.groupId
                const infoIdx = postInfoList.findIndex((info: any) => info.id === postID)
                const postInfo = postInfoList[infoIdx]
                processFeedItem(item, postInfo, web.PostDisplayInfo.SeenState.UNSEEN)
                postInfoList.splice(infoIdx, 1)
            }
        }

        await processUserDisplayInfo(userInfo)
    }    

    async function processUserDisplayInfo(userInfo: any) {
        for (let j = 0; j < userInfo.length; j++) {
            const info = userInfo[j]
            if (!info) { continue }
            processUserDisplayInfoItem(info)
        }        
    }

    async function processUserDisplayInfoItem(userInfo: any) {
        if (!mainStore.pushnames[userInfo.uid] || mainStore.pushnames[userInfo.uid] != userInfo.contactName) {
            mainStore.pushnames[userInfo.uid] = userInfo.contactName
        }
        getAvatar(userInfo.uid, userInfo.avatarId)
    }

    async function processGroupDisplayInfo(groupInfo: any) {
        for (let j = 0; j < groupInfo.length; j++) {
            const info = groupInfo[j]
            if (!info) { continue }
            await processGroupDisplayInfoItem(info)
        }     
    }

    async function processGroupDisplayInfoItem(info: any) {
        const groupID = info.id
        const name = info.name

        const dbGroupsList = await db.feed.where('groupID').equals(groupID).toArray()
        
        if (dbGroupsList.length == 0) {
            
            let group: Group = { 
                groupID: info.id,
                name: info.name,
                description: info.description,
                background: info.background,
                lastChangeTimestamp: 0
            }            
            await insertGroup(group)
        } else {
            const dbGroup = dbGroupsList[0]
            // todo: modify appropriate based on changes
        }   

        if (!mainStore.groupnames[groupID] || mainStore.groupnames[groupID] != name) {
            mainStore.groupnames[groupID] = name
        }
        fetchGroupAvatar(groupID, info.avatarId)
    }    
    
    function processFeedItem(feedItem: any, postInfo: any, seenState: web.PostDisplayInfo.SeenState) {

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
            seenState: seenState,
            retractState: postInfo.retractState,
            unreadComments: postInfo.unreadComments,
        }

        if (postInfo.userReceipts) {
            postObject.userReceipts = postInfo.userReceipts
        }

        let postMediaArr: PostMedia[] = []
        
        const payloadBinArr = serverPost.payload
        if (!payloadBinArr) { return }
        const postContainer = decodeToPostContainer(payloadBinArr)
    
        // hal.log('haFeed/processServerPost/postContainer:')
        // console.dir(postContainer)
    
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

        // console.log("haFeed/processServerPost/postObject: ")
        // console.dir(postObject)

        /* only modify groups list if the post is not deleted */
        if (groupID && postObject.retractState != web.PostDisplayInfo.RetractState.RETRACTED) {
         
            let mediaType: PostMediaType = 0
            if (postMediaArr.length > 0) {
                const firstMedia = postMediaArr[0]
                mediaType = firstMedia.type
            }

            modifyGroupIfNeeded(postObject, mediaType, isVoiceNote)
        }

        insertPostIfNotExist(postObject)
        insertPostMedia(postObject.postID, postMediaArr)

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
    
        let text = ''
        let isTextComment = false
        let isTextCommentTextOnly = false
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
            if (commentContainer?.text?.link &&
                commentContainer.text.link.preview &&
                commentContainer.text.link.preview[0] &&
                commentContainer.text.link.preview[0].img
                ) {
                    const previewImage = commentContainer.text.link.preview[0]
                    const media = previewImage.img

                    const linkPreview = processCommonMediaLinkPreview(SubjectType.Comment, commentObject.commentID, commentContainer.text.link)
                    if (linkPreview) {
                        commentObject.linkPreview = linkPreview
                    }

            } else {
                isTextCommentTextOnly = true
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

        console.log('haFeed/processFeedItemComment/commnentObject: ')
        console.dir(commentObject)

        insertComment(commentObject)
        insertCommonMedia(SubjectType.Comment, commentObject.postID, commentObject.commentID, commonMediaArr)
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

    function processCommonMediaLinkPreview(type: SubjectType, contentID: string, linkPreview: any) {

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
                subjectID: '', // todo: this needs to be assigned
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

    async function modifyGroupIfNeeded(post: any, mediaType: PostMediaType, isVoiceNote: boolean) {


        await db.group.where('groupID').equals(post.groupID).modify(group => {
            if (group.lastChangeTimestamp < post.timestamp) {
                group.lastChangeTimestamp = post.timestamp

                group.lastContentMediaType = mediaType
                
                if (post.text) {
                    const truncateText = true
                    const maxCharsWhenTruncated = 500
                    const processedText = processText(post.text, post.mentions, truncateText, maxCharsWhenTruncated)
                    group.lastContent = processedText.html
                }

                // todo: figure out if voicenote display is actually neeede

            }

            return

        })
        
                    
    }

    async function insertPostIfNotExist(post: any) {

        const postID = post.postID
        const dbFeedsList = await db.feed.where('postID').equals(postID).toArray()
        
        if (dbFeedsList.length == 0) {
            try {
                const id = await db.feed.put(post)
                // hal.log('haFeed/insertPostIfNotExist/db/put/inserting: ' + post.postID)
            } catch (error) {
                hal.log('haFeed/insertPostIfNotExist/db/put/error ' + error)
            }
        } else {
            hal.log('haFeed/insertPostIfNotExist/exit/post already in db: ' + post.postID)
        }
        
    }

    async function insertComment(comment: Comment) {

        const commentID = comment.commentID
        const dbCommentsList = await db.comment.where('commentID').equals(commentID).toArray()
        
        if (dbCommentsList.length == 0) {
            try {
                const id = await db.comment.put(comment)
                hal.log('haFeed/insertComment/post: ' + comment.postID + ', comment: ' + comment.commentID)
            } catch (error) {
                hal.log('haFeed/insertComment/post: ' + comment.postID + ', ' + 'error: ' + error)
            }
        } else {
            hal.log('haFeed/insertComment/post: ' + comment.postID + ', comment: ' + comment.commentID + ' already exists: ' + comment.commentID)
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

    async function insertPostMedia(postID: string, postMediaArr: any) {
        if (postMediaArr.length < 1) { 
            return 
        }
        const dbPostMediaList = await db.postMedia.where('postID').equals(postID).toArray()
        
        if (dbPostMediaList.length == 0) {
            for (let i = 0; i < postMediaArr.length; i++) {
                let postMedia = postMediaArr[i]
                
                try {
                    const id = await db.postMedia.put(postMedia)
                } catch (error) {
                    hal.log('homeMain/insertPostMedia/db/put/error ' + error)
                    if (!handleDbError(error).continue) {
                        return
                    }
                }
            }

        } else {
            // hal.log('homeMain/processPostContainer/exit/postObject already in db \n' + JSON.stringify(post) + '\n\n')
        }       
        return 
    }

    async function insertCommonMedia(type: SubjectType, subjectID: string, contentID: string, commonMediaArr: any) {
        if (commonMediaArr.length < 1) { 
            return 
        }

        const dbCommonMediaList = await getCommonMediaList(type, subjectID, contentID)
        
        if (!dbCommonMediaList) {
            for (let i = 0; i < commonMediaArr.length; i++) {
                let media = commonMediaArr[i]
                
                try {
                    const id = await db.commonMedia.put(media)
                } catch (error) {
                    hal.log('haFeed/insertCommonMedia/db/put/error ' + error)
                }
            }

        } else {
            // hal.log('haFeed/insertCommonMedia/exit/bbject already in db')
        }       
        return 
    }    

    async function getCommonMediaList(type: SubjectType, subjectID: string, contentID: string) {
        const arr = await db.commonMedia.where('contentID').equals(contentID).and((commonMed) => {
            return commonMed.subjectID == subjectID && commonMed.type == type
        }).toArray()
        if (!arr || arr.length == 0) {
            return undefined
        }
        return arr
    }

    async function getPostMedia(postID: string) {
        const arr = await db.postMedia.where('postID').equals(postID).toArray()
        if (!arr || arr.length == 0) {
            return undefined
        }
        return arr
    }

    async function modifyPostHaveCommentIfNeeded(postID: string) {
        await db.feed.where('postID').equals(postID).modify(function(item) {
            if (!item.haveComments) {
                item.haveComments = true
            }
        })
        return        
    }

    async function modifyPostSeenStateAsUnseen(postID: string) {
        await db.feed.where('postID').equals(postID).modify(function(item) {
            if (!item.seenState) {
                item.seenState = web.PostDisplayInfo.SeenState.UNSEEN
            }
        })
        return        
    }

    async function modifyPostMedia(postID: string, order: number, blob: Blob) {
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

        return new Promise(async function (resolve, reject) {
            try {
                const id = await db.group.put(group)
                return resolve(id)
            } catch (error) {
                hal.log('haFeed/insertGroup/put/error ' + error)
                return reject(error)
            }
        })
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

    async function getComments(postID: string) {
        const arr = await db.comment.where('postID').equals(postID).toArray()
        if (!arr || arr.length == 0) {
            return undefined
        }
        return arr
    }

    async function getComment(postID: string, commentID: string) {
        const commentArr = await db.comment.where('commentID').equals(commentID).and((item) => {
            return item.postID == postID
        }).toArray()
        if (!commentArr || commentArr.length == 0) {
            return undefined
        }
        return commentArr[0]
    }

    return { 
        processWebContainer, 
        getComment,
        getComments,
        getCommonMediaList, getPostMedia,  
        modifyPostMedia, modifyPostVoiceNote, modifyPostLinkPreviewMedia,
        setPostMediaIsCodecH265 
    }
}