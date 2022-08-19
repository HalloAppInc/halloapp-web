
<script setup lang="ts">
import { Ref, ref, watch, watchEffect, computed } from 'vue'

import { useMainStore } from '../../stores/mainStore'
import { useConnStore } from '../../stores/connStore'

import HomeHeader from './HomeHeader.vue'
import Post from './Post.vue'
import Comment from '../comment/CommentMain.vue'
import hal from '../../common/halogger'

import { Dexie, liveQuery } from "dexie"
import { db, Feed, PostMedia, Mention } from '../../db'

import { useI18n } from 'vue-i18n'

import { clients } from "../../proto/clients.js"
import { useTimeformatter } from '../../composables/timeformatter'

const mainStore = useMainStore()
const connStore = useConnStore()

const { formatTime, formatTimer } = useTimeformatter()

const listBoxWidth = ref('100%')
const showComments = ref(false)

const inViewPostID = ref('')

const content = ref<HTMLElement | null>(null)
let handleScrollTimer: any

const { t, locale } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const listData: Ref<Feed[]> = ref([])

const feedObservable = liveQuery (() => db.feed
    .toArray()
)

// Subscribe
const subscription = feedObservable.subscribe({
    next: result => { 
        // console.log('homeMain/feedObservable: ', JSON.stringify(result))
        if (result) {
            listData.value = result
        }

    },
    error: error => console.error(error)
})

let firstFeed: Feed = { postID: '1' }
insertPostIfNotExist(firstFeed)

// setTimeout(setMention, 3000)

// function setMention() {
//     db.feed.where('postID').equals('1').modify( (x: Feed) => {
//         const mention: Mention = {
//             index: 5,
//             userID: '2',
//             name: 'Test5'
//         }
//         x.mentions = [mention]
//     })
// }

init()

async function init() {

    if (!mainStore.haveFetchedInitialMainFeed) {
        console.log('homeMain/init/fetch initial main feed')

        const cursor = mainStore.mainFeedCursor
        connStore.getFeedItems(cursor, async function(webContainer: any) {

            mainStore.haveFetchedInitialMainFeed = true

            processFeedItems(webContainer)
        })

    } else {

        const cursor = mainStore.mainFeedCursor
        connStore.getFeedItems(cursor, async function(webContainer: any) {
            processFeedItems(webContainer)
        })

    }

}


async function processFeedItems(webContainer: any) {
    const feedResponse = webContainer?.feedResponse
    
    if (!feedResponse) { return }

    const items = feedResponse.items

    for (let i = 0; i < items.length; i++) {
        const serverPost = items[i].post
        if (!serverPost) { continue }
        processPostContainer(serverPost)
    }

}

async function processPostContainer(serverPost: any) {
    hal.log('homeMain/processPostContainer')

    let postObject: Feed = { postID: serverPost.id }

    const publisherUID = serverPost.publisherUID

    const payloadBinArr = serverPost.payload
    if (!payloadBinArr) { return }
    const postContainer = await decodeToPostContainer(payloadBinArr)

    if (!postContainer) { return }

    if (publisherUID) {
        postObject.userID = publisherUID
        // todo: process publisher avatar
    }

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
                
                if (mediaInfo.image) {
                    const encryptedResourceInfo = mediaInfo.image.img
                }

                if (mediaInfo.video) {
                    const media = mediaInfo.video.video
                    const isStream = JSON.stringify(mediaInfo.video.streamingInfo) !== '{}'
                    if (isStream) {
                        const chunkSize = mediaInfo.video.streamingInfo?.chunkSize
                  
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

    insertPostIfNotExist(postObject)

}

async function insertPostIfNotExist(post: any) {

    const postID = post.postID
    const dbFeedsList = await db.feed.where('postID').equals(postID).toArray()
    
    if (dbFeedsList.length == 0) {
        try {
            const id = await db.feed.put(post)
            hal.log('homeMain/processPostContainer/record/postObject: \n' + JSON.stringify(post) + '\n\n')
        } catch (error) {
            hal.log('Avatar/db/put/error ' + error)
        }
    } else {
        // hal.log('homeMain/processPostContainer/exit/postObject already in db \n' + JSON.stringify(post) + '\n\n')
    }


}


async function decodeToPostContainer(binArray: Uint8Array) {
    hal.log("homeMain/decodeToPostContainer")
    const err = clients.PostContainer.verify(binArray)
    if (err) {
        throw err
    }
    const postContainer = clients.PostContainer.decode(binArray)
    return postContainer
}

watchEffect(() => {
    if (mainStore.scrollToTop == 'home') {
        scrollToTop()
        mainStore.scrollToTop = ''
    }
})

function scrollToTop() {    
    content.value?.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
}

function openCommentsIfNeeded(postID: string) {
    if (showComments.value) {
        inViewPostID.value = postID
    } else {
        commentsClick(postID)
    }
}

function commentsBackClick() {
    commentsClick('')
}

function commentsClick(postID: string) {
    if (listBoxWidth.value == '100%') {
        let width = '500px'
        if (mainStore.isMobile) {
            width = '0px'
        }
        listBoxWidth.value = width

        inViewPostID.value = postID
        showComments.value = true
        mainStore.mobileNavlessPanel = 'comments'
    } else {
        listBoxWidth.value = '100%'

        inViewPostID.value = ''
        showComments.value = false
        mainStore.mobileNavlessPanel = ''
    }
}

function handleScroll() {
    clearTimeout(handleScrollTimer)
    handleScrollTimer = setTimeout(debouncedHandleScroll, 250)
}

function debouncedHandleScroll() {
    if (!content.value) { return }

    const contentViewportRect = content.value.getBoundingClientRect()
    const pointX = (contentViewportRect.width / 2) + contentViewportRect.left
    const pointY = contentViewportRect.top + 100
    
    const closestTopElement = document.elementFromPoint(pointX, pointY)
    const closestElement = closestTopElement?.closest('[data-ha-postID]')

    if (closestElement) {
        const attr = closestElement.getAttribute('data-ha-postID')
        if (attr) {
            inViewPostID.value = attr
        }
    }
}

</script>

<template>

<div class="homeMainWrapper">
    
    <div class="listBox" ref='content' @scroll='handleScroll()'>

        <div class='header'>
            <HomeHeader/>
        </div>

        <div v-for="value in listData" class="container">
            <!-- data-ha-postID is used only for detecting post while scrolling -->
            <Post
                :postID="value.postID"
                :userID="value.userID" 
                @commentsClick="openCommentsIfNeeded(value.postID)" 
                :data-ha-postID="value.postID"> 
            </Post>
        </div>
    </div>
 
    <div v-if="showComments" class="comments">
        <Comment :postID='inViewPostID' @backClick="commentsBackClick"></Comment>
    </div>
  
</div>

</template>

<style scoped>

*::-webkit-scrollbar {
    width: 5px;
}

*::-webkit-scrollbar-track {
    background: white;        /* color of the tracking area */
}

*::-webkit-scrollbar-thumb {
    background-color: rgb(172, 169, 169);    /* color of the scroll thumb */

    border: 0px solid white;  /* creates padding around scroll thumb */
}

.homeMainWrapper {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

.listBox {
    position: relative;
    flex: 0 0 v-bind(listBoxWidth);
    height: 100%;

   
    overflow-y: auto;
    overflow-x: hidden;

    transition: flex 300ms ease-in-out;
}

.header {
    position: sticky;
    top: 0px;
    width: 100%;
    height: 50px;
    z-index: 2;
}

.comments {
    flex: 1 1 auto;
    height: 100%;
    
    overflow-y: auto;
    overflow-x: hidden;
    transition: 1s all ease-in-out;
}

</style>
