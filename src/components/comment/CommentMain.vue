<script setup lang="ts">
    import { Ref, ref, toRef, computed, watch } from 'vue'
    import { liveQuery } from "dexie"
    import { useI18n } from 'vue-i18n'
    import { storeToRefs } from 'pinia'

    import { useMainStore  } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'

    import { db, Post, SubjectType } from '@/db'

    import { useHAText } from '@/composables/haText'
    import { useTimeformatter } from '@/composables/timeformatter'

    import Avatar from '@/components/media/Avatar.vue'

    import FullScreener from '@/components/media/FullScreener.vue'
    import CommentHeader from '@/components/comment/CommentHeader.vue'
    import MediaThumbnails from '@/components/media/MediaThumbnails.vue'
    import MsgPanel from '@/components/msg/MsgPanel.vue'
    import InputBox from '@/components/chats/InputBox.vue'

    const mainStore = useMainStore()
    const colorStore = useColorStore()

    const { formatTime } = useTimeformatter()

    const { 
        primaryBlue: primaryBlueColor,
        tertiaryBg: tertiaryBgColor,
        text: textColor,
        secondaryBorder: secondaryBorderColor
     } = storeToRefs(colorStore)  

    interface Props {
        postID: string,
    }
    const props = defineProps<Props>()

    const { processText } = useHAText()
            
    const { t, locale } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const post: Ref<any | undefined> = ref()
    const subjectID = ref('')
    const postText = ref('')
    
    let subscription: any

    const showFullScreener = ref({ 'value': false })
    const selectMediaList = ref()
    const selectedMediaIndex = ref()
    const selectMediaContentID = ref()

    function openMedia(mediaList: any, idx: number, contentID: string) {
        console.log("commentMain/openMedia " + idx)
        console.dir(mediaList)
        selectMediaList.value = mediaList
        selectedMediaIndex.value = idx
        selectMediaContentID.value = contentID
        // go to fullscreener
        showFullScreener.value.value = true
    }

    function clickPrevious() {
        console.log('pre')
        if (selectedMediaIndex.value > 0) {
            selectedMediaIndex.value -= 1
        }
    }

    function clickNext() {
        console.log('next')
        if (selectedMediaIndex.value < selectMediaList.value.length - 1) {
            selectedMediaIndex.value += 1
            console.log('next ' + selectedMediaIndex.value)
        }
    }

    function selectMedia(index: number) {
        console.log('select')
        if (index < 0) {
            selectedMediaIndex.value = 0
        } else if (index > selectMediaList.value.length) {
            selectedMediaIndex.value = selectMediaList.value.length - 1
        } else {
            selectedMediaIndex.value = index
        }
    }    

    watch(() => props.postID, (newValue, oldValue) => {
        if (newValue != oldValue) {
            setupObserver()
        }
    })

    const numMedia = ref(0)

    setupObserver()

    async function setupObserver() {
        if (subscription) { subscription.unsubscribe() }
        const observable = liveQuery (() => db.post.where('postID').equals(props.postID).toArray())
        subscription = observable.subscribe({
            next: async result => {
                if (!result) { return }
                if (result.length == 0) { return }

                post.value = result[0]

                numMedia.value = await db.commonMedia.where('contentID').equals(post.value.postID).count()

                if (post.value.text) {
                    const truncateText = true
                    const maxCharsWhenTruncated = 500
                    const processedText = processText(post.value.text, post.value.mentions, truncateText, maxCharsWhenTruncated)
                    postText.value = processedText.html
                    if (post.value.groupID) {
                        subjectID.value = post.value.groupID
                    }
                } else if (post.value.voiceNote) {
                    const blob = post.value.voiceNote.blob
                    post.value.voiceNote.blobUrl = URL.createObjectURL(blob)
                }
            },
            error: error => console.error(error)
        })
    }

    // todo: look into object to see if it's needed
    const replyQuoteIdx = ref({'value': -1})

    const showFullHeaderTitles = ref(false)

    function handleScrolled(scrollTop: number) {
        if (scrollTop > 25) {
            showFullHeaderTitles.value = true
        } else {
            showFullHeaderTitles.value = false
        }
    }

</script>

<template>

    <!-- nb: root nodes are affected by scoped styles from parent -->
    <div class="commentMainWrapper">

        <div v-if="post" class="header">
            <CommentHeader 
                :groupID="post.groupID ? post.groupID : ''" :postID="postID" :userID="post.userID"
                :showFullTitles="showFullHeaderTitles"
                @backClick="$emit('backClick')"/>
        </div>

        <MsgPanel v-if="post" :type="SubjectType.Comment" :subjectID="post.postID" :key="post.postID"
            @scrolled="handleScrolled">

            <template v-slot:subHeader>
                <div class='subHeader'>
                    <div>
                        <Avatar :userID="post.userID" :width="30" :key="post.userID"></Avatar>
                    </div>
                    <div class='subHeaderBody'>
                        <div v-if="post">
                            {{ mainStore.pushnames[post.userID] }}

                            <span v-if="post.groupID" class="groupIndicator">
                                <font-awesome-icon :icon="['fas', 'caret-right']" size='sm' class="groupIndicatorIcon"/>
                            </span>
                            <span v-if="post.groupID" class="groupName" @click="mainStore.gotoGroup(post?.groupID)">
                                {{ mainStore.groupnames[post.groupID] }}
                            </span>
                            
                        </div>

                        <MediaThumbnails v-if="numMedia" class="thumbnails" :key="post.postID"
                            :type=SubjectType.FeedPost
                            :subjectID="post.groupID ? post.groupID : ''"
                            :contentID="post.postID"
                            :mediaBoxWidth=50
                            :mediaBoxHeight=50
                            @openMedia='openMedia'>
                        </MediaThumbnails>
                                  
                        <div v-if="postText" v-html="postText" class="text">
                        </div>

                        <div v-else-if="post.voiceNote?.blobUrl">

                            <audio autobuffer="autobuffer" preload="metadata" controls controlsList="nodownload">
                                <source :src="post.voiceNote?.blobUrl" type="audio/mpeg">
                                <p>{{ t('post.noAudioSupportText') }}</p>
                            </audio>

                        </div>                        

                        <div v-if="post" class='timestamp'>
                            {{ formatTime(post.timestamp, locale as string) }}
                        </div>
                    </div>
                </div>
            </template>

        </MsgPanel>


        <FullScreener v-if="selectMediaContentID && selectMediaList" :key="selectMediaContentID"
            :showFullScreener='showFullScreener'
            :type="SubjectType.FeedPost"
            :subjectID="post?.groupID ? post.groupID : ''"
            :contentID="selectMediaContentID"
            :selectedMediaIndex='selectedMediaIndex'
            :selectMediaList='selectMediaList'
            @clickPrevious="clickPrevious"
            @clickNext="clickNext"
            @selectMedia="selectMedia" />

       
        <!-- input tray -->
        <!-- <div class='footer'>
            <InputBox 
                :uploadFiles='""'
                :alwaysShowSendButton='false'
                :replyQuoteIdx='replyQuoteIdx' />
        </div> -->

    </div>

</template>

<style scoped>
    .commentMainWrapper {
        width: 100%;
        height: 100%;
        position: relative;

        background-color: rgb(243, 243, 240);

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .header {
        flex: 1 1 50px;
        background-color: #f0f2f5;
    }

    .subHeader {
        background-color: v-bind(tertiaryBgColor);
        padding: 5px 15px 10px 15px;

        border-bottom: 1px solid v-bind(secondaryBorderColor);

        display: flex;
        flex-direction: row;
        gap: 0px 10px;

        z-index: 10; /* used to cover up the floating timestamp in chat panel */
    }

    .subHeader .subHeaderBody {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        color: v-bind(textColor);
    }

    .subHeader .subHeaderBody .thumbnails {
        margin-top: 5px;
    }

    .subHeader .subHeaderBody .groupIndicator {
        margin-right: 5px;
        color: lightgray;
        text-align: bottom;
    }
    .subHeader .subHeaderBody .groupIndicator .groupIndicatorIcon {
        margin-bottom: -1px;
    }

    .subHeader .subHeaderBody .groupName {
        display: inline-block; /* this breaks the block to the next line when it's too long to fit */
        cursor: pointer;
    }

    .subHeader .subHeaderBody .groupName:hover {
        color: v-bind(primaryBlueColor);
    }    

    .subHeader .subHeaderBody .text {
        margin-top: 5px;
        color: v-bind(textColor)
    }
    .subHeader .subHeaderBody .timestamp {
        margin-top: 5px;
        color: gray;
        font-size: 12px;
    }

    .footer {
        width: 100%;
        background-color: rgb(243, 243, 240);
        padding: 5px 10px 5px 10px;
    }

</style>