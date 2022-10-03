<script setup lang="ts">
    import { Ref, ref, toRef, computed, watch } from 'vue'
    import { liveQuery } from "dexie"
    import { useI18n } from 'vue-i18n'
    import { storeToRefs } from 'pinia'

    import { useMainStore  } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'

    import { db, Feed, SubjectType } from '@/db'

    import { useHAText } from '@/composables/haText'
    import { useTimeformatter } from '@/composables/timeformatter'

    import Avatar from '@/components/media/Avatar.vue'

    import CommentHeader from '@/components/comment/CommentHeader.vue'
    import MediaThumbnails from '@/components/media/MediaThumbnails.vue'
    import MsgPanel from '@/components/msg/MsgPanel.vue'
    import InputBox from '@/components/chats/InputBox.vue'

    const mainStore = useMainStore()
    const colorStore = useColorStore()

    const { formatTime } = useTimeformatter()

    const { 
        tertiaryBg: tertiaryBgColor,
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

    const post = ref<(Feed | null)>(null)
    const postText = ref('')
    
    let subscription: any

    watch(() => props.postID, (newValue, oldValue) => {
        if (newValue != oldValue) {

            setupObserver()
        }
    })

    const numMedia = ref(0)

    setupObserver()

    async function setupObserver() {
        if (subscription) { subscription.unsubscribe() }
        const observable = liveQuery (() => db.feed.where('postID').equals(props.postID).toArray())
        subscription = observable.subscribe({
            next: async result => {
                if (!result) { return }
                if (result.length == 0) { return }

                post.value = result[0]

                numMedia.value = await db.postMedia.where('postID').equals(post.value.postID).count()

                if (post.value.text) {
                    const truncateText = true
                    const maxCharsWhenTruncated = 500
                    const processedText = processText(post.value.text, post.value.mentions, truncateText, maxCharsWhenTruncated)
                    postText.value = processedText.html
                }



            },
            error: error => console.error(error)
        })
    }

    // todo: look into object to see if it's needed
    const replyQuoteIdx = ref({'value': -1})

</script>

<template>

    <!-- nb: root nodes are affected by scoped styles from parent -->
    <div class='commentMainWrapper'>

        <div class='header'>
            <CommentHeader :postID='postID' @backClick="$emit('backClick')"/>
        </div>

        <MsgPanel v-if="post" :type="SubjectType.Comment" :subjectID="post.postID" :key="post.postID">

            <template v-slot:subHeader>
                <div class='subHeader'>
                    <div>
                        <Avatar :userID="post.userID" :width="30" :key="post.userID"></Avatar>
                    </div>
                    <div class='subHeaderBody'>
                        <div v-if="post">
                            {{ mainStore.pushnames[post.userID] }}
                        </div>

                        <MediaThumbnails v-if="numMedia" class="thumbnails" :key="post.postID"
                            
                            :type=SubjectType.FeedPost
                            :subjectID="post.groupID"
                            :contentID="post.postID"
                            :mediaBoxWidth=50
                            :mediaBoxHeight=50>
                        </MediaThumbnails>
                                  

                        <div v-html="postText" class="text">

                        </div>

                        <div v-if="post" class='timestamp'>
                            {{ formatTime(post.timestamp, locale as string) }}
                        </div>
                    </div>
                </div>
            </template>

        </MsgPanel>
       
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

        border-bottom: 1px solid rgb(232,232,232);

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

    }

    .subHeader .subHeaderBody .thumbnails {
        margin-top: 5px;
    }

    .subHeader .subHeaderBody .text {
        margin-top: 5px;
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