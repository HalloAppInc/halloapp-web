<script setup lang="ts">
    import { Ref, ref, toRef, toRefs, computed, onMounted, onUnmounted, watch, defineEmits } from 'vue'
    import { storeToRefs } from 'pinia'
    import { liveQuery } from 'dexie'

    import { useMainStore } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'

    import { db, CommonMedia, SubjectType, MediaType } from '@/db'

    import { useHAMediaResize } from '@/composables/haMediaResize'
    import { useHACommonMedia } from '@/composables/haCommonMedia'

    const mainStore = useMainStore()
    const colorStore = useColorStore()

    const { getCommonMedia, fetchCommonMedia } = useHACommonMedia()
    const { setPreviewMediaSizes } = useHAMediaResize()

    const props = defineProps(['type', 'subjectID', 'contentID', 'showFullScreener', 'selectedMediaIndex', 'selectMediaList'])

    const selectMediaIdx = toRef(props, 'selectedMediaIndex')
    
    const { 
        primaryWhiteBlack: primaryWhiteBlackColor,
        background: backgroundColor,
        shadow: shadowColor,
        icon: iconColor,
        wrapper: wrapperColor,
    } = storeToRefs(colorStore)      

    const emit = defineEmits<{
        (e: 'clickPrevious'): void
        (e: 'clickNext'): void
        (e: 'selectMedia', index: number): void
    }>()

    init()

    async function init() {
        if (!props.selectMediaList) { return }

        const list = await getCommonMedia(props.type, props.subjectID, props.contentID)

        const needWatching = await fetchCommonMedia(props.type, props.selectMediaList)

        if (needWatching) {
            setupObserver()
        } else {
            if (list) {
                dbListData.value = list
            }
            makeList()
        }
    }

    async function setupObserver() {

        const observable = liveQuery (() => db.commonMedia.where('contentID').equals(props.contentID).and((commonMed) => {
            return commonMed.subjectID == props.subjectID && commonMed.type == props.type
        }).toArray())
        const subscription = observable.subscribe({
            next: result => {
                if (!result) { return }
                if (result.length == 0) { return }

                dbListData.value = result
                makeList()
            },
            error: error => console.error(error)
        })
    }

    const dbListData: Ref<any[]> = ref([])
    const mediaUrlList: Ref<any[]> = ref([])

    async function makeList() {

        const result: any = []
        if (!dbListData) { return }
        let list = dbListData
  
        for (let i = 0; i < list.value.length; i++) {
            let media = list.value[i]
            let res = setPreviewMediaSizes(media)

            let item: any = {
                'mediaType': media.mediaType,
                'width': media.width,
                'height': media.height,
                'previewWidth': res?.mediaItemWidth,
                'previewHeight': res?.mediaItemHeight,
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
    }
    
    function setVideoSrc(index: number) {
        let targetElement = document.getElementById('videoFullScreener') as HTMLVideoElement
        targetElement.src = mediaUrlList.value[index].blobUrl + "#t=1.0"
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
        document.removeEventListener("click", closeFullScreener)
    })

</script>

<template>

    <div v-if='props.showFullScreener.value' class='fullScreenerMask' @click="closeFullScreener">
        <div class='wrapper'>

            <!-- close icon -->
            <div class='closeIconContainer'>
                <div class='iconContainer' @click='closeFullScreener' @click.stop>
                    <font-awesome-icon :icon="['fas', 'xmark']" size='2xl' />
                </div>
            </div>

            <!-- tool box -->
            <!-- <div class='header'>
                <div class='iconContainer'>
                    <font-awesome-icon :icon="['fas', 'face-smile']" size='lg' />
                </div>
            </div> -->

            <div class='content'>

                <div v-if='mediaUrlList && mediaUrlList[selectMediaIdx] && mediaUrlList[selectMediaIdx].blobUrl && mediaUrlList[selectMediaIdx].mediaType == MediaType.Image' 
                    class='imgContainer'
                    @click.stop>
                    <img :src='mediaUrlList[selectMediaIdx].blobUrl' draggable="false"/>
                </div>

                <div v-if='mediaUrlList && mediaUrlList[selectMediaIdx] && mediaUrlList[selectMediaIdx].blobUrl && mediaUrlList[selectMediaIdx].mediaType == MediaType.Video' 
                    class='videoContainer' 
                    
                    @click.stop>
                    <video id='videoFullScreener' :key="selectMediaIdx"
                        :width='mediaUrlList[selectMediaIdx].width' 
                        controls draggable="false">
                        <source :src='mediaUrlList[selectMediaIdx].blobUrl + "#t=1.0"'>
                    </video>
                </div>


                <div v-if="mediaUrlList.length > 1" class='leftArrowIconContainer'>
                    <div class='iconContainer' :class='{ iconContainerForbidden: selectMediaIdx == 0 }'
                        @click="emit('clickPrevious')"
                        @click.stop>
                        <div class='iconShadow' :class='{ iconShadowFrbidden: selectMediaIdx == 0 }'>
                            <font-awesome-icon :icon="['fas', 'angle-left']" size='lg' />
                        </div>
                    </div>
                </div>

                <div v-if="mediaUrlList.length > 1" class='rightArrowIconContainer'>
                    <div class='iconContainer'
                        :class='{ iconContainerForbidden: selectMediaIdx == mediaUrlList.length - 1 }'
                        @click="emit('clickNext')" 
                        @click.stop>
                        <div class='iconShadow'
                            :class='{ iconShadowFrbidden: selectMediaIdx == mediaUrlList.length - 1 }'>
                            <font-awesome-icon :icon="['fas', 'angle-right']" size='lg' />
                        </div>
                    </div>
                </div>
                
            </div>

            <div class="footer">
                <!-- media preview and add more media -->
                <div class='mediaTray' @click.stop>
                    <div v-if="mediaUrlList.length > 1" class="smallPreviewContainer">
                        <div v-for='(value, index) in mediaUrlList' class="squareContainer" 
                            :class="{ 'selected': index == selectMediaIdx }"
                            @click="emit('selectMedia', index)">

                            <div v-if='value.previewImageBlobUrl' class="imgSmallContainer">
                                <img class="imgSmall" :width='value.previewWidth' :height='value.previewHeight' 
                                    :src='value.previewImageBlobUrl' 
                                    draggable="false"/>


                            </div>


                            <div v-if='value.mediaType == MediaType.Video' class='playIconContainer'>
                                <div class="playCircle">
                                    <div class="playIcon">
                                        <font-awesome-icon :icon="['fas', 'play']" size='2xs' />
                                    </div>
                                </div>
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
        z-index: 20;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(30px);
        background-color: v-bind(wrapperColor);
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
        padding-left: 20px;
        padding-right: 20px;
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
        position: relative;
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


    .playIconContainer {
        position: absolute;
        width: fit-content;
        height: fit-content;
        left: 50%;
        bottom: 50%;

        transform: translate(-50%, 50%);

        color: v-bind(primaryWhiteBlackColor);
        z-index: 10;
    }

    .playIconContainer .playCircle {
        position: absolute;
        width: fit-content;
        height: fit-content;
        left: 50%;
        bottom: 50%;

        transform: translate(-50%, 50%);
        width: 25px;
        height: 25px;
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        
        border-radius: 50%;
    }

    .playIconContainer .playIcon {
        position: absolute;
        width: fit-content;
        height: fit-content;
        left: 50%;
        bottom: 50%;

        transform: translate(-50%, 50%);

        border-radius: 50%;
    }    

</style>