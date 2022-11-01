<script setup lang="ts">
    import { computed, Ref, ref, onUnmounted } from 'vue'
    import { liveQuery } from 'dexie'
    import { storeToRefs } from 'pinia'

    import { useMainStore } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'

    import { db, Comment, CommonMedia, SubjectType, MediaType } from '@/db'

    import hal from '@/common/halogger'

    import { useHAComment } from '@/composables/haComment'
    import { useHAText } from '@/composables/haText'

    import { useHAMediaResize } from '@/composables/haMediaResize'
    import { useHACommonMedia } from '@/composables/haCommonMedia'

    const mainStore = useMainStore()
    const colorStore = useColorStore()

    const { getComment } = useHAComment()
    const { processText } = useHAText()

    const { 
        fetchLinkPreviewMedia,
    } = useHACommonMedia()

    const { setQuoteMediaSize } = useHAMediaResize()

    const props = defineProps(['type', 'subjectID', 'contentID'])

    const message: Ref<any> = ref({})
    const commonMedia: Ref<any | undefined> = ref()

    let msgObservable: any
    let commentSubscription: any

    // todo: only setup observer if the message is not in the database
    setupMessageObserver()

    async function setupMessageObserver() {
        if (props.type == SubjectType.Comment) {
            msgObservable = liveQuery (() => db.comment.where('commentID').equals(props.contentID).and(item => {
                return item.postID == props.subjectID
            }).toArray())
        } else if (props.type == SubjectType.Chat) {
        }

        if (msgObservable) {
            commentSubscription = msgObservable.subscribe({
                next: async (result: any) => { 
                
                    if (result && result.length > 0) {
        
                        message.value = result[0]

                        const linkPreview = message.value.linkPreview

                        const previewUrl = linkPreview.url
                        const url = new URL(previewUrl)
                        const host = url.host
                        
                        message.value.linkPreview.host = host


                        commonMedia.value = linkPreview.preview

                        if (commonMedia.value) {

                            const arrBuf = await fetchLinkPreviewMedia(props.type, commonMedia.value)

                            if (arrBuf) {
                                const mediaBlob = new Blob([arrBuf], {type: 'image/jpeg'})
                                commonMedia.value.blobUrl = URL.createObjectURL(mediaBlob)
                            } 

                        }
                        

                    }
                },
                error: (error: any) => console.error(error)
            })
        }
    }



    onUnmounted(() => {
        if (commentSubscription) { 
            commentSubscription.unsubscribe()
        }        
    })

    const { 
        primaryWhiteBlack: primaryWhiteBlackColor,
        text: textColor,
        icon: iconColor,
        timestamp: timestampColor,
    } = storeToRefs(colorStore)  

</script>

<template>

    <div class='msgLinkPreview'>


        <div v-if='commonMedia?.blobUrl' class='mediaContainer' >
            <img class='imgSmall' :src='commonMedia.blobUrl' :height='commonMedia.height' :width='commonMedia.width'/>

        </div>

        <div class='quoteMessageContainer'>

            
            <div v-if="message?.linkPreview?.title" class='contentHeader'>
                <div class='contentTitle'>
                    {{ message.linkPreview.title }}
                </div>                
            </div>

    
            <div v-if="message?.linkPreview?.host" class='contentBody'>
                {{ message.linkPreview.host }}
            </div>

        </div>
        


    </div>

</template>

<style scoped>
    .msgLinkPreview {
        height: fit-content;
        background-color: v-bind(primaryWhiteBlackColor);
        
        border-radius: 5px;

        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }

    .quoteMessageContainer {
        height: 60px;
        width: calc(100% - 80px);
        overflow: hidden;
        flex-grow: 100;
    }

    .mediaContainer {
        width: 60px;
        height: 60px;
        overflow: hidden;
        background-color: #FFFFFF;
    }

    .imgSmall {
        width: 100%;
        height: 100%;
        object-fit: cover;
        overflow: hidden;

        border-radius: 5px 0px 0px 5px;
    }

    .contentHeader {
        margin: 5px 15px 5px 10px;
        width: fit-content;
        display: flex;

        justify-content: flex-start;
    }

    .contentTitle {
        flex: 1 1 auto;

        color: v-bind(textColor);
        font-weight: bold;
        font-size: 14px;
        
        min-width: 0;

        /* text-overflow: ellipsis; */
       

        user-select: none;

        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;

    }

    .contentBody {
        margin: 5px 10px 20px 10px;
        max-width: 60%;

        color: v-bind(timestampColor);
        font-size: 12px;

        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
    }

    .iconContainer {
        margin: 0px 5px;
        width: fit-content;
        color: v-bind(iconColor);
    }

</style>