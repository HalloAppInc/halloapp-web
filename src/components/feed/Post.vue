<script setup lang="ts">
    import { toRef, Ref, ref, onBeforeUnmount } from "vue"
    import { storeToRefs } from 'pinia'
    import { liveQuery } from "dexie"
    import { useI18n } from 'vue-i18n'

    import { useMainStore } from '@/stores/mainStore'
    import { useConnStore } from '@/stores/connStore'
    import { useIconStore } from '@/stores/iconStore'
    import { useColorStore } from '@/stores/colorStore'

    import { db, SubjectType, Post, MediaType, CommonMedia } from '@/db'

    import { web } from "@/proto/web.js"

    import { useHAComment } from '@/composables/haComment'
    import { useHACommonMedia } from '@/composables/haCommonMedia'
    import { useHAText } from '@/composables/haText'
    import { useTimeformatter } from '@/composables/timeformatter'

    import hal from "@/common/halogger"

    import Avatar from '@/components/media/Avatar.vue'
    import MediaCarousel from '@/components/media/MediaCarousel.vue'
    import LinkPreview from '@/components/media/LinkPreview.vue'
    import FullScreener from '@/components/media/FullScreener.vue'

    interface Props {
        post: Post,
        postID: string,
        atMainFeed: boolean
    }
    const props = defineProps<Props>()
    const post = toRef(props, 'post')

    const { t, locale } = useI18n({ inheritLocale: true, useScope: 'global' })

    const mainStore = useMainStore()
    const connStore = useConnStore()
    const iconStore = useIconStore()
    const colorStore = useColorStore()
    
    const { requestCommentsIfNeeded } = useHAComment()

    const { processText } = useHAText()
    const { formatTime } = useTimeformatter()

    const { comment: commentIcon,
    } = storeToRefs(iconStore)

    const { primaryBlue: primaryBlueColor,
            primaryLightgray: primaryLightgrayColor,
            background: backgroundColor, 
            secondaryBg: secondaryBgColor,
            text: textColor,
            timestamp: timestampColor,
    } = storeToRefs(colorStore)
       
    const { 
        getCommonMedia, fetchLinkPreviewMedia, fetchVoiceNote
    } = useHACommonMedia()

    const headerWidth = ref(450)
    const postWidth = ref(430)

    const isDeleted = ref(false)

    const postTimestamp = ref("")

    const isAlbum = ref(false)
    const commonMedia: Ref<CommonMedia[]> = ref([])

    const mediaBoxWidth = ref(300)
    const mediaBoxHeight = ref(400)

    const bodyContent = ref("")
    const isTextPostTextOnly = ref(false)
    const isTruncatedText = ref(false)

    const $postVoiceNote = ref(null)
    const showVoiceNote = ref(false)
    const postVoiceNoteSrc = ref("")

    const showPreviewImage = ref(false)
    const previewImageSrc = ref("")

    const userReceipts: Ref<web.ReceiptInfo[]> = ref([])

    const subjectID = ref(props.post.groupID ? props.post.groupID : '')

    /* fullscreener */
    const showFullScreener = ref({ 'value': false })
    const selectMediaList = ref()
    const selectedMediaIndex = ref(0)
    const selectMediaContentID = ref()

    let mediaSubscription: any

    setPostSize()
    processPost(props.post)
    setupObserver()

    async function setupObserver() {
        if (!mainStore.allowDbTransactions) { return }
        const mediaObservable = liveQuery (() => db.commonMedia.where('contentID').equals(props.postID).toArray())
        mediaSubscription = mediaObservable.subscribe({
            next: resultList => { 
                commonMedia.value = resultList
            },
            error: error => console.error(error)
        })
    }

    onBeforeUnmount(() => {
        if (mediaSubscription) {
            mediaSubscription.unsubscribe()
        }
    })

    async function processPost(post: Post) {
        const postID = post.postID

        let isVoiceNote = false
        let voiceNoteMedia: any

        if (props.post.retractState == web.PostDisplayInfo.RetractState.RETRACTED) {
            isDeleted.value = true
            return
        }

        postTimestamp.value = formatTime(post.timestamp, locale.value as string)

        const dbCommonMedia = await getCommonMedia(SubjectType.FeedPost, subjectID.value, postID)
        if (dbCommonMedia) {
            commonMedia.value = dbCommonMedia
            isAlbum.value = true
        }

        /* voiceNote */
        if (post.voiceNote) {
            isVoiceNote = true
            voiceNoteMedia = post.voiceNote
            

            let arrBuf: ArrayBuffer | undefined

            if (voiceNoteMedia.arrBuf) {
                arrBuf = voiceNoteMedia.arrBuf
            } else {
                arrBuf = await fetchVoiceNote(SubjectType.FeedPost, voiceNoteMedia) as any
            }

            if (arrBuf) {
                const voiceNoteBlob = new Blob([arrBuf], {type: 'audio/mpeg'})
                postVoiceNoteSrc.value = URL.createObjectURL(voiceNoteBlob)
                showVoiceNote.value = true

                if (!isAlbum.value) {
                    mediaBoxHeight.value = 0
                }
            }
        }

        /* link preview */
        if (post.linkPreview && commonMedia.value.length == 0) {
            /* if media for link preview exists */
            if (post.linkPreview?.preview) {
                    const linkPreviewMedia = post.linkPreview.preview

                    let arrBuf: ArrayBuffer | undefined

                    if (linkPreviewMedia.arrBuf) {
                        arrBuf = linkPreviewMedia.arrBuf
                    } else {
                        arrBuf = await fetchLinkPreviewMedia(SubjectType.FeedPost, linkPreviewMedia)
                    }

                    if (arrBuf) {
                        const mediaBlob = new Blob([arrBuf], {type: 'image/jpeg'})
                        previewImageSrc.value = URL.createObjectURL(mediaBlob)
                        showPreviewImage.value = true

                        mediaBoxWidth.value = postWidth.value - 30
                        mediaBoxHeight.value = 250
                    }
            }
        }

        /* process text after checking if it's text only */
        if (props.post.text) {         
            
            if (commonMedia.value.length == 0 && !post.linkPreview) {
                isTextPostTextOnly.value = true
                mediaBoxWidth.value = postWidth.value - 30
                mediaBoxHeight.value = 0
            }

            const truncateText = true  
            bodyContent.value = processPostText(props.post.text, post.mentions, truncateText, isTextPostTextOnly.value)
        }

        /* user receipts */
        if (props.post.userReceipts) {
            userReceipts.value = props.post.userReceipts.slice(0, 3)
        }

        /* 
         * preemptively request comments for the post, before user even clicks on comments
         * so that the comment screen have less flicker
         */
        if (!isDeleted.value) {
            requestCommentsIfNeeded(postID, 20, function() {})            
        }
    }

    function setPostSize() {
        const maxPostWidth = 400    // max width of entire card allowed
        const minPostWidth = 200    // min width of card

        const sideGutters = 60

        // limit post to maxPostWidth if window is large
        if (window.innerWidth >= maxPostWidth) {
            headerWidth.value = maxPostWidth - 10
            postWidth.value = maxPostWidth - sideGutters

        // size post to window's size
        } else if (window.innerWidth < maxPostWidth && window.innerWidth >= minPostWidth) {
            headerWidth.value = window.innerWidth - 30
            postWidth.value = window.innerWidth - 80

        // if window is too small, keep post to minPostWidth
        } else if (window.innerWidth < minPostWidth) {
            headerWidth.value = minPostWidth
            postWidth.value = minPostWidth
        }
    }

    function processPostText(text: string, mentions: any, truncateText: boolean = true, isTextPostTextOnly: boolean) {        
        // rough estimate of 330 chars for 12 lines and 110 for 3 lines
        const maxCharsWhenTruncatedForTextOnlyPost: number = 330
        let maxCharsWhenTruncated: number = 110

        if (isTextPostTextOnly) {
            maxCharsWhenTruncated = maxCharsWhenTruncatedForTextOnlyPost
        }

        const processedText = processText(text, mentions, truncateText, maxCharsWhenTruncated)
        isTruncatedText.value = processedText.isTruncated
        return processedText.html
    }

    function expandText() {
        if (props.post.text) {
            const truncateText = false
            bodyContent.value = processPostText(props.post.text, props.post.mentions, truncateText, isTextPostTextOnly.value)
        } 
    }

    function openMedia(mediaList: any, idx: number, contentID: string) {
        mainStore.triggerFirstInteraction()

        selectMediaList.value = mediaList
        selectedMediaIndex.value = idx
        selectMediaContentID.value = contentID
        // go to fullscreener
        showFullScreener.value.value = true
    }

    function clickPrevious() {
        if (selectedMediaIndex.value > 0) {
            selectedMediaIndex.value -= 1
        }
    }

    function clickNext() {
        if (selectedMediaIndex.value < commonMedia.value.length - 1) {
            selectedMediaIndex.value += 1
        }
    }

    function selectMedia(index: number) {
        if (index < 0) {
            selectedMediaIndex.value = 0
        } else if (index > commonMedia.value.length) {
            selectedMediaIndex.value = commonMedia.value.length - 1
        } else {
            selectedMediaIndex.value = index
        }
    }

</script>

<template>

    <div>
        <div v-if='!isDeleted' class='postRow'>

            <div :class="['post']">

                <!-- postHeader row -->
                <div id="postHeader">
                    <Avatar :userID='props.post.userID' :width='45'></Avatar>
                    <div id="nameBox">
                        <div class="name">
                            {{ mainStore.pushnames[props.post.userID] }}
                            <span v-if="connStore.devMode" class="devPostID">{{ connStore.devMode }} {{ props.post.postID }}</span>
                            <span v-if="atMainFeed && props.post.groupID" class="groupIndicator">
                                <font-awesome-icon :icon="['fas', 'caret-right']" size='sm' class="groupIndicatorIcon"/>
                            </span>
                            <span v-if="atMainFeed && props.post.groupID" class="groupName" @click="mainStore.gotoGroup(props.post.groupID)">
                                {{ mainStore.groupnames[props.post.groupID] }}
                            </span>
                        </div>
                        <div class="time">
                            {{ postTimestamp }}
                        </div>
                    </div>
                </div>

                <MediaCarousel v-if='!showPreviewImage'
                    :type="SubjectType.FeedPost"
                    :subjectID="subjectID"
                    :contentID="post.postID"
                    :showPreviewImage="showPreviewImage"
                    :previewImageSrc="previewImageSrc"
                    :postWidth="postWidth"
                    :selectedMediaIndex="selectedMediaIndex"
                    @openMedia='openMedia'
                    @clickPrevious="clickPrevious"
                    @clickNext="clickNext"
                    @selectMedia="selectMedia"
                    >
                </MediaCarousel>

                <div :class="['postBody']">
                    <div :class="['postBodyContent', { textOnlySize: isTextPostTextOnly }]">
                    
                        <audio v-if="showVoiceNote" autobuffer="autobuffer" ref="$postVoiceNote" id="postVoiceNote" preload="metadata" controls controlsList="nodownload">
                            <source :src="postVoiceNoteSrc" type="audio/mpeg">
                            <p>{{ t('post.noAudioSupportText') }}</p>
                        </audio>   

                        <span v-else v-html="bodyContent">
                        </span>
                        <span v-if="isTruncatedText" id="readMore" @click="expandText">
                            {{ t('post.more') }}
                        </span>

                    </div>
                </div>

                <LinkPreview v-if="showPreviewImage && post.linkPreview"
                    :post="post"
                    :linkPreview="post.linkPreview"
                    :postID="post.postID"
                    :showPreviewImage="showPreviewImage"
                    :previewImageSrc="previewImageSrc"
                    :mediaBoxWidth="mediaBoxWidth"
                    :mediaBoxHeight="mediaBoxHeight">
                </LinkPreview>

                <!-- postFooter row -->
                <div id="postFooter">
                    <div class="commentButton" @click="$emit('commentsClick')">
                        <img class="commentIcon" :src="commentIcon" alt="Comment Icon">
                        <div>
                            {{ t('post.comment') }}
                        </div>
                        <div v-if="post.unreadComments" class="newCommentIndicator">
                        </div>
                        <div v-else-if="post.haveComments" class="haveCommentIndicator">
                        </div>                    
                    </div>
                    <div v-if="mainStore.userID == post.userID" class="userReceiptsBox">

                        <div v-for='(value, idx) in userReceipts' 
                            class="userReceiptsAvatar" :style="{ 'z-index': (idx*-1 + 100) }">
                    
                            <Avatar :style="{ 'margin-right': '-8px' }"
                                :userID="(value.uid as number)" :width="20" :useBorder=true>
                            </Avatar>
                        </div>

                    </div>
                    <!-- <div id="replyButton" @click="">
                        <img id="replyIcon" src="https://d1efjkqerxchlh.cloudfront.net/es/assets/Reply.png" alt="Reply Icon">
                        <div>
                            {{ t('post.replyPrivately') }}
                        </div>
                    </div> -->
                </div>

            </div>
        </div>

        <div v-else class="postRow">
            <div class="deletedPost">
                <div v-if="props.post.userID == mainStore.userID">
                    You deleted your post
                </div>
                <div v-else>
                    {{ mainStore.pushnames[props.post.userID] }} deleted their post
                </div>
            </div>
        </div>

        <FullScreener v-if="selectMediaContentID && selectMediaList" :key="selectMediaContentID"
            :showFullScreener='showFullScreener'
            :type="SubjectType.FeedPost"
            :subjectID="subjectID"
            :contentID="selectMediaContentID"
            :selectedMediaIndex="selectedMediaIndex"
            :selectMediaList='selectMediaList' 
            @clickPrevious="clickPrevious"
            @clickNext="clickNext"
            @selectMedia="selectMedia"
            />
    </div>

</template>

<style scoped>
    /* post row */
    .postRow {
        position: relative;
        z-index: 1;

        width: 100%;
        padding-bottom: 25px;
        
        /* background-color: rgb(243, 243, 240); */
        background-color: v-bind(backgroundColor);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .postRow .deletedPost {
        position: relative;
  
        margin: 20px 0px 20px 0px;
        padding: 10px 20px 10px 20px;
    
        border-radius: 20px;
        background-color: lightgray;

        font-size: 14px;
        color: gray;
        text-align: center;
        
    }

    .post {
        position: relative;
        width: v-bind(postWidth + 'px');

        margin: 20px 0px 20px 0px;
        padding: 10px 10px 15px 10px;
    
        border-radius: 15px;
        background-color: v-bind(secondaryBgColor);
        box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;
        
        display: flex;
        flex-direction: column;
    }

    .morePostMargin {
        margin: 70px 0px 100px 0px;
    }

    /* postHeader row */
    .post #postHeader {
        margin-top: auto;
        margin-bottom: 7px;
        max-width: 340px;

        display: flex;
        flex-direction: horizontal;
        align-items: center;
        gap: 0px 8px;

        font-size: 16px;
        text-align: center;
    }
    .post #avatarImage {
        height: 45px; 
        width: 45px; 
        object-fit: contain; 
        border-radius: 50%; 
        background-color: gray;
    } 
    .post #nameBox {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 3px 0px;
    }
    .post #nameBox .name {
        font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
        font-size: 16px;
        font-weight: 400;
        text-align: left;
        color: v-bind(textColor);
    }

    .post #nameBox .devPostID {
        font-size: 12px;
    }    
    .post #nameBox .name .groupIndicator {
        margin-right: 5px;
        color: lightgray;
        text-align: bottom;
    }
    .post #nameBox .name .groupIndicator .groupIndicatorIcon {
        margin-bottom: -1px;
    }

    .post #nameBox .name .groupName {
        display: inline-block; /* this breaks the block to the next line when it's too long to fit */
        cursor: pointer;
    }

    .post #nameBox .name .groupName:hover {
        color: v-bind(primaryBlueColor);
    }

    .post #nameBox .time {
        font-size: 14px;
        font-weight: 500;
        color: v-bind(timestampColor);
    }

    .post #postMediaContainer {
        position: relative;
        
        border-radius: 15px;
        overflow: hidden;

        flex: 0 0 v-bind(mediaBoxHeight + 'px');
        width: v-bind(mediaBoxWidth + 'px');
        align-self: center;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    #postVoiceNote {
        width: 100%;
        object-fit: contain;
    }

    #previewImage {
        object-fit: contain;
    }

    .postBody {
        padding: 0px 0px 5px 0px;

        overflow: hidden;
    }
    .postBodyContent {
        margin: 5px 0px 0px 0px;

        font-size: 17px;
        line-height: 20px;
        font-weight: 400;

        /* text is manually truncated already so line-clamp serves
        * as a max number of lines we want to show for some edge cases
        * (ie. lots of newlines between words) */
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box !important;
        -webkit-line-clamp: 500;
        -webkit-box-orient: vertical;
        white-space: normal; 

        overflow-wrap: break-word;
        user-select: text;
        color: v-bind(textColor)
    }
    .postBodyContent #readMore {
        color: v-bind(primaryBlueColor);
        cursor: pointer;
    }
    @media (pointer: fine) {
        .postBodyContent #readMore:hover {
            color: black;
        }
    }

    /* different than figma spec, changed font to 21 instead of 24 */
    .textOnlySize {
        font-size: 21px;
        line-height: 31px;
        font-weight: 400;
    }

    /* postFooter row */
    #postFooter {
        padding: 15px 10px 0px 10px;

        display: flex;
        justify-content: space-between;

        font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
        font-size: 13px;
        font-weight: 400;
        color: v-bind(textColor)
    }

    .commentButton {
        display: flex;
        flex-direction: horizontal;
        align-items: center;

        user-select: none;
        cursor: pointer;
        
    }
    @media (pointer: fine) {
        .commentButton:hover {
            filter: invert(50%) sepia(68%) saturate(7495%) hue-rotate(201deg) brightness(104%) contrast(104%);
        }
    }

    .commentIcon {
        width: 14px;
        height: 14px;
        margin-right: 5px;
        
    }
    @media (prefers-color-scheme: dark) {
        .commentIcon {
            filter: brightness(0) saturate(100%) invert(98%) sepia(11%) saturate(426%) hue-rotate(171deg) brightness(99%) contrast(89%);
        }
    }

    .newCommentIndicator {
        margin-left: 4px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: v-bind(primaryBlueColor);
    }

    .haveCommentIndicator {
        margin-left: 4px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: v-bind(primaryLightgrayColor);
    }    

    .userReceiptsBox {
        display: flex;
        flex-direction: horizontal;
        justify-content: center;
        align-items: center;
    }
    
    #replyButton {
        display: flex;
        flex-direction: horizontal;
        align-items: center;

        user-select: none;
        /* cursor: pointer; */
        color: gray;
        filter: invert(40%);
    }
    @media (pointer: fine) {
        /* #replyButton:hover {
            color: v-bind(primaryBlue);
        } */
    }
    #replyIcon {
        width: 16px;
        height: 12px;
        margin-right: 5px;
    }
    @media (prefers-color-scheme: dark) {
        #replyIcon {
            filter: invert(100%);
        }
    }

</style>
