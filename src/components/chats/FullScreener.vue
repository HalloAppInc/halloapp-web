<script setup lang="ts">
    import { Ref, ref, toRefs, computed, onMounted, onUnmounted, watch } from 'vue'
    import { liveQuery } from 'dexie'

    import { useColorStore } from '@/stores/colorStore'

    import { db, Feed, CommonMedia, SubjectType, MediaType } from '@/db'

    import { useHAMediaResize } from '@/composables/haMediaResize'
    import { useHACommonMedia } from '@/composables/haCommonMedia'


    const colorStore = useColorStore()

    const { fetchCommonMedia
    } = useHACommonMedia()
    const { setPreviewMediaSizes } = useHAMediaResize()


    const props = defineProps(['type', 'subjectID', 'contentID', 'showFullScreener', 'selectMediaIndex', 'selectMediaList'])
   

    init()

    async function init() {
        console.log("init")
        if (!props.selectMediaList) { return }
        const needWatching = await fetchCommonMedia(props.type, props.selectMediaList)


        if (needWatching) {
            setupObserver()
        } else {
            makeList()
        }
    }


    async function setupObserver() {

        console.log("setupObserver")
        console.log("selectMediaIndex: " + props.selectMediaIndex)
        console.log("show: " + props.showFullScreener.value)
        console.log("contentID: " + props.contentID)
        console.log("subjectID: " + props.subjectID)
        console.log("type: " + props.type)

        const observable = liveQuery (() => db.commonMedia.where('contentID').equals(props.contentID).and((commonMed) => {
            return commonMed.subjectID == props.subjectID && commonMed.type == props.type
        }).toArray())
        const subscription = observable.subscribe({
            next: result => {
                if (!result) { return }
                if (result.length == 0) { return }

                console.log("---> observed change")
        
                dbListData.value = result
                makeList()
            },
            error: error => console.error(error)
        })
    }

    // delect media's idx in mediaUrlList
    const selectMediaIdx = ref(-1)

    const dbListData: Ref<any[]> = ref([])
    const mediaUrlList: Ref<any[]> = ref([])

    async function makeList() {

        const result: any = []
        if (!dbListData) { return }
        let list = dbListData
  
        // find media from message list and build a new array for media
      
        for (let i = 0; i < list.value.length; i++) {
            console.log('iterate: ' + i)
            let media = list.value[i]
            let res = setPreviewMediaSizes(media)

            let item: any = {
                'type': media.mediaType,
                'width': res?.mediaItemWidth,
                'height': res?.mediaItemHeight,
            }

            if (media) {
                if (media.blob) {
                    const blobUrl = URL.createObjectURL(media.blob)
                    if (blobUrl) { 
                        item.blobUrl = blobUrl
                    }
                }
                if (media.previewImage) {
                    const previewImageBlobUrl = URL.createObjectURL(media.previewImage)
                    if (previewImageBlobUrl) { 
                        item.previewImageBlobUrl = previewImageBlobUrl
                    }
                } 

            }

            result.push(item)

        }

        mediaUrlList.value = result
        console.log('end result: ')
        console.log(' props.selectMediaIndex.value ' +  props.selectMediaIndex)
        console.log('selectMediaIdx ' + selectMediaIdx.value)


        selectMediaIdx.value = props.selectMediaIndex
        

        console.dir(mediaUrlList.value)
    }
    
    // const mediaUrlList2 = computed(() => {
    //     console.log("---> computed change")
        
    //     const result: any = []
    //     if (!refSelectMediaList) { return result }
    //     let list = refSelectMediaList
  
    //     // find media from message list and build a new array for media
    //     let needToFetchMedia = false
    //     for (let i = 0; i < list.value.length; i++) {
    //         let media = list.value[i]
    //         let res = setPreviewMediaSizes(media)

    //         let item: any = {
    //             'type': media.mediaType,
    //             'width': res?.mediaItemWidth,
    //             'height': res?.mediaItemHeight,
    //         }

    //         if (media) {
    //             if (media.blob) {
    //                 const blobUrl = URL.createObjectURL(media.blob)
    //                 if (blobUrl) { 
    //                     item.blobUrl = blobUrl
    //                 }
    //             }
    //             if (media.previewImage) {
    //                 const previewImageBlobUrl = URL.createObjectURL(media.previewImage)
    //                 if (previewImageBlobUrl) { 
    //                     item.previewImageBlobUrl = previewImageBlobUrl
    //                 }
    //             } else {
    //                 needToFetchMedia = true
    //             }

    //         }


    //         result.push(item)

    //         if (needToFetchMedia) {
    //             fetchCommonMedia(props.type, refSelectMediaList.value)
    //         }


    //         if (refSelectMediaIndex) {
    //             selectMediaIdx.value = refSelectMediaIndex.value
    //         }
    //     }



    //     return result
    // })

    const backgroundColor = computed(() => {
        return colorStore.background
    })
    const wraperColor = computed(() => {
        return colorStore.wraper
    })
    const shadowColor = computed(() => {
        return colorStore.shadow
    })
    const iconColor = computed(() => {
        return colorStore.icon
    })
    const hoverColor = computed(() => {
        return colorStore.hover
    })

    function setVideoSrc(selectMediaIdx: number) {
        let targetElement = document.getElementById('videoFullScreener') as HTMLVideoElement
        targetElement.src = mediaUrlList.value[selectMediaIdx].blobUrl + "#t=1.0"
    }

    function lastMedia() {
        if (selectMediaIdx.value > 0) {
            selectMediaIdx.value -= 1
            if (mediaUrlList.value[selectMediaIdx.value].type == MediaType.Video) {
                setVideoSrc(selectMediaIdx.value)
            }
        }
    }

    function nextMedia() {
        if (selectMediaIdx.value < mediaUrlList.value.length - 1) {
            selectMediaIdx.value += 1
            if (mediaUrlList.value[selectMediaIdx.value].type == MediaType.Video) {
                setVideoSrc(selectMediaIdx.value)
            }
        }
    }

    function openBigImg(idx: number) {
        selectMediaIdx.value = idx
        if (mediaUrlList.value[selectMediaIdx.value].type == MediaType.Video) {
            setVideoSrc(selectMediaIdx.value)
        }
    }

    function closeFullScreener() {
        props.showFullScreener.value = false
    }

    function closeFullScreenerOnEscape(e: any) {
        if (e.key === 'Escape') {
            closeFullScreener()
        }        
    }    


    onMounted(() => {
        document.addEventListener("keydown", closeFullScreenerOnEscape)
    })    

    onUnmounted(() => {
        document.addEventListener("keydown", closeFullScreenerOnEscape)
    })   


</script>

<template>

    <div v-if='props.showFullScreener.value' class='fullScreenerMask'>
        <div class='wrapper'>

            <!-- close icon -->
            <div class='closeIconContainer'>
                <div class='iconContainer' @click='closeFullScreener'>
                    <font-awesome-icon :icon="['fas', 'xmark']" size='2xl' />
                </div>
            </div>

            <!-- tool box -->
            <!-- <div class='header'>
                <div class='iconContainer'>
                    <font-awesome-icon :icon="['fas', 'face-smile']" size='lg' />
                </div>
            </div> -->

            <!-- image box: show the image -->
            <div class='content'>

                <div v-if="mediaUrlList.length > 1" class='leftArrowIconContainer'>
                    <div class='iconContainer' :class='{ iconContainerForbidden: selectMediaIdx == 0 }'
                        @mousedown='lastMedia()'>
                        <div class='iconShadow' :class='{ iconShadowFrbidden: selectMediaIdx == 0 }'>
                            <font-awesome-icon :icon="['fas', 'angle-left']" size='lg' />
                        </div>
                    </div>
                </div>
                
                <div v-if='mediaUrlList && mediaUrlList[selectMediaIdx] && mediaUrlList[selectMediaIdx].blobUrl && mediaUrlList[selectMediaIdx].type == MediaType.Image' 
                    class='imgContainer'>
                    <img :src='mediaUrlList[selectMediaIdx].blobUrl' />
                </div>

                <div v-if='mediaUrlList && mediaUrlList[selectMediaIdx] && mediaUrlList[selectMediaIdx].blobUrl && mediaUrlList[selectMediaIdx].type == MediaType.Video' 
                    class='videoContainer' >
                    <video controls id='videoFullScreener'>
                        <source :src='mediaUrlList[selectMediaIdx].blobUrl + "#t=1.0"'>
                    </video>
                </div>

                <div v-if="mediaUrlList.length > 1" class='rightArrowIconContainer'>
                    <div class='iconContainer'
                        :class='{ iconContainerForbidden: selectMediaIdx == mediaUrlList.length - 1 }'
                        @mousedown='nextMedia()'>
                        <div class='iconShadow'
                            :class='{ iconShadowFrbidden: selectMediaIdx == mediaUrlList.length - 1 }'>
                            <font-awesome-icon :icon="['fas', 'angle-right']" size='lg' />
                        </div>
                    </div>
                </div>
                
            </div>

            <div class='footer'>
                <!-- media preview and add more media -->
                <div class='mediaTray'>
                    <div v-if="mediaUrlList.length > 1" class='smallPreviewContainer'>
                        <div class='squareContainer' v-for='(value, idx) in mediaUrlList'
                            @click='openBigImg(idx)'
                            :class="{ 'selected': idx == selectMediaIdx }">

                            <div v-if='value.type == MediaType.Image && value.previewImageBlobUrl' class='imgSmallContainer'>
                                <img class='imgSmall' :width='value.width' :height='value.height' :src='value.previewImageBlobUrl' />
                            </div>

                            <div v-else-if='value.type == MediaType.Video' class='imgSmallContainer'>
                                <img class='imgSmall' :width='value.width' :height='value.height' :src='value.previewImageBlobUrl' />
                                <!-- <video :width='value.width' :height='value.height'>
                                    <source :src='value.previewImageBlobUrl + "#t=1.0"'>
                                </video> -->
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>

<style scoped>
    .fullScreenerMask {
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        background-color: v-bind(wraperColor);
        display: table;
    }

    .wrapper {
        width: 100vw;
        height: 100vh;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .header {
        flex: 1 1 50px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .footer {
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .imgContainer {
        user-select: none;
        width: fit-content;
        height: fit-content;
    }

    img {
        max-width: 70vw;
        max-height: 70vh;
        background-color: v-bind(backgroundColor);
        box-shadow: 0px 0px 20px 2px v-bind(shadowColor);
    }

    .videoContainer {
        user-select: none;
        width: fit-content;
        height: fit-content;
    }

    video {
        max-width: 70vw;
        max-height: 70vh;
        background-color: v-bind(backgroundColor);
        box-shadow: 0px 0px 20px 2px v-bind(shadowColor);
    }

    #footer {
        bottom: 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .chatBoxTray {
        width: 500px;
        margin-bottom: 100px;
        display: flex;
        flex-direction: row;
    }

    .leftArrowIconContainer {
        position: fixed;
        left: 0;
    }

    .rightArrowIconContainer {
        position: fixed;
        right: 0;
    }

    .closeIconContainer {
        position: fixed;
        top: 5px;
        left: 15px;
    }

    .iconContainer {
        margin: 20px;
        color: v-bind(iconColor);
    }

    .iconContainer:hover {
        cursor: pointer;
    }

    .iconShadow {
        width: 40px;
        height: 40px;
        background-color: #C0C0C0;
        display: flex;
        justify-content: center;
        align-items: center;

        border-radius: 50%;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
    }

    .iconShadow:active {
        box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
    }

    .iconShadowFrbidden {
        background-color: #E5E4E2;
    }

    .iconContainerForbidden {
        color: #C0C0C0;
    }

    .iconContainerForbidden:active {
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
    }

    .iconContainerForbidden:hover {
        cursor: default;
    }

    .mediaTray {
        height: 100px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .smallPreviewContainer {
        width: fit-content;
        height: 56px;
        padding-left: 5px;
        overflow-y: hidden;
        overflow-x: auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .squareContainer {
        user-select: none;
        z-index: 2;
        width: 50px;
        height: 50px;
        margin-right: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        overflow: hidden;

        outline: 1px solid gainsboro;
    }

    .squareContainer:hover {
        cursor: pointer;
    }

    .imgSmallContainer {
        z-index: 1;

        width: 50px;
        height: 50px;
        overflow: hidden;
    }

    .imgSmall {
        z-index: 0;

        overflow: hidden;
    }

    .selected {
        outline: 3px solid #1E90FF;
    }
</style>