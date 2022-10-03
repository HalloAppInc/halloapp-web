<script setup lang="ts">
    import { computed, Ref, ref, onUnmounted } from 'vue'
    import { liveQuery } from 'dexie'
    import { storeToRefs } from 'pinia'

    import { useMainStore } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'

    import { db, Comment, CommonMedia, SubjectType, MediaType } from '@/db'

    import hal from '@/common/halogger'

    import { useHAFeed } from '@/composables/haFeed'
    import { useHAText } from '@/composables/haText'

    import { useHAMediaResize } from '@/composables/haMediaResize'

    
    const mainStore = useMainStore()
    const colorStore = useColorStore()
    const { getComment } = useHAFeed()
    const { processText } = useHAText()

    const { setQuoteMediaSize } = useHAMediaResize()

    const props = defineProps(['type', 'subjectID', 'contentID'])


    const quotedMessage: Ref<any> = ref({})
    const quotedMedia: Ref<any> = ref({})

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
                next: (result: any) => { 
                
                    if (result && result.length > 0) {
        
                        quotedMessage.value = result[0]

                    }
                },
                error: (error: any) => console.error(error)
            })
        }
    }


    let mediaObservable: any
    let mediaSubscription: any
    if (props.type == SubjectType.Comment) {
        mediaObservable = liveQuery (() => db.commonMedia.where('contentID').equals(props.contentID).and(item => {
            return item.subjectID == props.subjectID && item.type == props.type
        }).toArray())
    } else if (props.type == SubjectType.Chat) {
    }

    if (mediaObservable) {
        mediaSubscription = mediaObservable.subscribe({
            next: (result: any) => { 
                
                if (result && result.length > 0) {
                    
                    quotedMedia.value = result[0]
                    if (quotedMedia.value.previewImage) {
                        quotedMedia.value.previewImageBlobUrl = URL.createObjectURL(quotedMedia.value.previewImage)
                    }

                }
            },
            error: (error: any) => console.error(error)
        })
    }    


    onUnmounted(() => {
        if (commentSubscription) { 
            commentSubscription.unsubscribe()
        }        
        if (mediaSubscription) { 
            mediaSubscription.unsubscribe()
        }

    })


    /* todo: check why we are resizing this before deleting commented block */

    // const quoteMedia = computed(() => {
    //     let res = setQuoteMediaSize(props.quoteMessage.media)
    //     let result = {
    //         'url': props.quoteMessage.media.url,
    //         'width': res?.mediaItemWidth,
    //         'height': res?.mediaItemHeight 
    //     }
    //     // hal.log('Quote/compute quoteMedia/', result)
    //     return result
    // })

    const textColor = computed(() => {
        return colorStore.text
    })
    const iconColor = computed(() => {
        return colorStore.icon
    })
</script>

<template>

    <!-- Quote -->
    <div class='quoteContainer'>


        <div class='attachMediaContainer' v-if='quotedMedia.previewImageBlobUrl'>
            <img class='imgSmall' :src='quotedMedia.previewImageBlobUrl' :height='quotedMedia.height' :width='quotedMedia.width'/>
        </div>

        <div class='quoteMessageContainer'>

            <!-- sender infomation -->
            <div class='contentHeader'>
                <div v-if="quotedMessage.userID == mainStore.userID" class='contentTitle'>
                    Me
                </div>
                <div v-else class='contentTitle'>
                    {{ mainStore.pushnames[quotedMessage.userID] }}
                </div>                
            </div>

            <!-- message details -->
            <div class='contentBody'>
                <!-- if attached media -->

                <div v-if="quotedMessage.text" class='TextContainer'>
                    <div>{{ quotedMessage.value }}</div>
                    <span v-html='processText(quotedMessage.text, quotedMessage.mentions, true).html' class='noOverFlow'></span>
                </div>
                <div v-else-if='quotedMedia' class='iconContainer' >
                    <font-awesome-icon v-if="quotedMedia.mediaType == MediaType.Image" :icon="['fas', 'camera']" size='sm' />
                    <font-awesome-icon v-else-if="quotedMedia.mediaType == MediaType.Video" :icon="['fas', 'video']" size='sm' />
                </div>    
                <div v-else-if='quotedMessage.voiceNote' class='iconContainer' >
                    <font-awesome-icon :icon="['fas', 'microphone']" size='sm' />
                </div>                    
            </div>

        </div>
        


    </div>

</template>

<style scoped>
    .quoteContainer {
        height: fit-content;
        background-color: rgb(0, 0, 0, 0.05);
        border-left: 5px solid #6495ED;
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

    .attachMediaContainer {
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
    }

    .contentHeader {
        margin: 10px 15px 5px 10px;
        width: fit-content;
        display: flex;

        justify-content: flex-start;
    }

    .contentTitle {
        color: v-bind(textColor);
        font-weight: bold;
        font-size: 10px;
        flex: 1 1 auto;
        min-width: 0;
        text-overflow: ellipsis;
        white-space: nowrap;

        user-select: none;
    }

    .contentBody {
        margin: 5px 10px 20px 5px;
        max-width: 60%;

        color: v-bind(textColor);
        font-size: small;

        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
    }

    .iconContainer {
        margin: 0px 5px;
        width: fit-content;
        color: v-bind(iconColor);
    }

    .TextContainer {
        margin: 0px 5px;
        max-height: 30px;
        min-width: 100px;
        overflow: hidden;

        /* wrap text when it is too long */
        overflow-wrap: anywhere;
        white-space: normal;
    }

    .noOverFlow {
        overflow-wrap: anywhere;
        white-space: normal;
    }
</style>