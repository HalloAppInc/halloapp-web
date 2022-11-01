<script setup lang="ts">
    import { Ref, ref, toRef } from 'vue'
    import { storeToRefs } from 'pinia'
    import { liveQuery } from 'dexie'
    import { useI18n } from 'vue-i18n'

    import { useMainStore } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'
    import hal from "@/common/halogger"

    import { db, SubjectType, MediaType } from '@/db'

    import { useHAFeed } from '@/composables/haFeed'
    import { useHACommonMedia } from '@/composables/haCommonMedia'
    
    const mainStore = useMainStore()
    const colorStore = useColorStore()

    const { getCommonMedia, fetchCommonMedia
    } = useHACommonMedia()

    const { t } = useI18n({ inheritLocale: true, useScope: 'global' })

    const { 
        primaryWhiteBlack: primaryWhiteBlackColor,
        secondaryBg: secondaryBgColor,
    } = storeToRefs(colorStore)  

    interface Props {
        type: SubjectType,
        subjectID: string,
        contentID: string,
        mediaBoxWidth: number,
        mediaBoxHeight: number,
    }
    const props = defineProps<Props>()

    const mediaBoxWidth     = toRef(props, 'mediaBoxWidth')
    const mediaBoxHeight    = toRef(props, 'mediaBoxHeight')

    const listData: Ref<any[]> = ref([])

    const $postMediaContainer = ref(null)
    const $mediaCarousel = ref(null)

    const selectedMedia = ref(0)

    let isDragStarted = false   // indicate mousedown or touchstart
    let dragStartX = 0
    let dragStartY = 0

    init()

    async function init() {

        const mediaList = await getCommonMedia(props.type, props.subjectID, props.contentID)

        if (mediaList) {
            listData.value = mediaList
            makeList()
        }

        if (!mediaList) { return }
        const needWatching = await fetchCommonMedia(props.type, mediaList)
        if (needWatching) {
            setupObserver()
        }
    }

    async function setupObserver() {
        const observable = liveQuery (() => db.commonMedia.where('contentID').equals(props.contentID).and((commonMed) => {
            const subjectID = props.subjectID ? props.subjectID : ''
            return commonMed.subjectID == subjectID && commonMed.type == props.type
        }).toArray())
  
        const subscription = observable.subscribe({
            next: result => {
                if (!result) { return }
                if (result.length == 0) { return }

                listData.value = result

                makeList()

            },
            error: error => console.error(error)
        })
    }

    async function makeList() {
        for (let i = 0; i < listData.value.length; i++) {
            const med = listData.value[i]
            if (!med.arrBuf) { continue }
            if (med.previewImageBlobUrl) { continue }

            const blob = new Blob([med.previewImageArrBuf], {type: 'image/jpeg'})
            const previewImageBlobUrl = URL.createObjectURL(blob)
            med.previewImageBlobUrl = previewImageBlobUrl
        }
    }

    function videoLoaded(event: Event, index: number) {
        const vid = (event.target as HTMLVideoElement)
        vid.currentTime += 1.0 // 1 sec seem the best compromise as some videoes are blank from 0.1 to 0.5
    }

    function clickPrevious(event: Event) {
        if (!$mediaCarousel.value) { return }
        const carousel = $mediaCarousel.value as HTMLElement
        carousel.style.transition = "transform 0.25s"

        if (selectedMedia.value <= 0) { return }
        selectedMedia.value -= 1

        const moveX = (-mediaBoxWidth.value) * selectedMedia.value
        carousel.style.transform = "translateX(" + moveX + "px)"
    }

    function clickNext(event: Event) {
        if (!$mediaCarousel.value) { return }
        const carousel = $mediaCarousel.value as HTMLElement
        carousel.style.transition = "transform 0.25s"    

        if (selectedMedia.value >= (listData.value.length - 1) ) { 
            return 
        }
        selectedMedia.value += 1

        const moveX = (-mediaBoxWidth.value) * selectedMedia.value
        carousel.style.transform = "translateX(" + moveX + "px)"
    }

    /* drag events */

    function mouseDown(event: Event) {
        const drag = (event as DragEvent)
        const clientX = drag.clientX
        startCarouselDrag(clientX)
    }

    function touchStart(event: Event) {
        const touch = (event as TouchEvent)
        if (touch.changedTouches.length < 1) { return }
        const clientX = touch.changedTouches[0].clientX
        startCarouselDrag(clientX)
    }

    function startCarouselDrag(clientX: number) {
        isDragStarted = true
        dragStartX = clientX
    }

    let dragThrottled = false

    function mouseMove(event: Event) {
        if (!isDragStarted) { return }
        const drag = (event as DragEvent) 
        const clientX = drag.clientX

        const diffX = clientX - dragStartX

        if (!dragThrottled) {    
            dragCarousel(diffX)  
            dragThrottled = true
            setTimeout(function () {          
                dragThrottled = false          
            }, 50)
        }
    }

    function touchMove(event: Event) {
        const touch = (event as TouchEvent)
        if (touch.changedTouches.length < 1) { return }
        const clientX = touch.changedTouches[0].clientX
        const clientY = touch.changedTouches[0].clientY

        const diffX = clientX - dragStartX
        const diffY = clientY - dragStartY

        if ((Math.abs(diffX) > 5) && (Math.abs(diffY) > 0)) {
            event.preventDefault() /* stops jittery vertical movement when swiping */
        }    

        touchMoveThrottled(clientX, clientY, diffX)
    }

    function touchMoveThrottled(clientX: number, clientY: number, diffX: number) {
        if (!isDragStarted) { return }

        if (!$postMediaContainer.value) { return }
        const postMediaContainer = $postMediaContainer.value as HTMLElement

        const box = postMediaContainer.getBoundingClientRect()

        const withinX = clientX > box.left && clientX < box.right
        const withinY = clientY > box.top && clientY < box.bottom
        const withinBox = withinX && withinY
    
        if (withinBox) {
            dragCarousel(diffX)
        } else {
            stopCarouselDrag(clientX)
        }
    }


    function dragCarousel(diffX: number) {
        if (!$mediaCarousel.value) { return }
        const carousel = $mediaCarousel.value as HTMLElement

        if (!$postMediaContainer.value) { return }
        const postMediaContainer = $postMediaContainer.value as HTMLElement

        /* get the width of the element that contains the carousel */
        const parentParentWidth = postMediaContainer.parentElement?.parentElement?.offsetWidth
        if (!parentParentWidth) { return }

        /* no need for dragging since all the thumbnails fit */
        if (parentParentWidth > carousel.offsetWidth) {

            /* special case where user has dragged carousel already and then expands window, bring carousel back to full view */
            const computedStyle = window.getComputedStyle(carousel)
            const cssMatrix = new WebKitCSSMatrix(computedStyle.transform)
            const currentTranslateX = cssMatrix.m41

            if (currentTranslateX != 0) {
                carousel.style.transform = "translateX(0px)"
            }

            return
        }

        const leftEdgeOfCarousel = 0
        const rightEdgeOfCarousel = parentParentWidth - carousel.offsetWidth
    
        let moveX = diffX

        const computedStyle = window.getComputedStyle(carousel)
        const cssMatrix = new WebKitCSSMatrix(computedStyle.transform)
        const currentTranslateX = cssMatrix.m41

        moveX = currentTranslateX + moveX        

        /* 
        * Different platforms/browsers have different results when dragging slides in the carousel,
        * especially when the page is first loaded and then dragging the 1st slide to the 2nd 
        */

        // Desktop Chrome needs transition to be > 0.10s for smooth drags, minDiff 5 helps
        let transition = "transform 0.15s"
        let minDiff = 5

        // Desktop Safari needs transition to be < 0.15s for smooth drags, minDiff 3 helps
        if (mainStore.isSafari) {
            transition = "transform 0.10s"
            minDiff = 3
        }

        // Mobile Safari needs transition set to none for smooth drags, minDiff 0 helps
        if (mainStore.isMobile) {
            transition = "none"
            minDiff = 0       
        }
        
        if (diffX > minDiff) {
    
            if (moveX > leftEdgeOfCarousel) { 
                carousel.style.transition = transition
                carousel.style.transform = "translateX(" + leftEdgeOfCarousel + "px)"
                stopCarouselDrag(0)
                return 
            }

            carousel.style.transition = transition
            carousel.style.transform = "translateX(" + moveX + "px)"

        } else if (diffX < -minDiff) {

            // console.log('moveX: ' + moveX + ' rightEdge: ' + rightEdgeOfCarousel)

            if (moveX < rightEdgeOfCarousel) { 
     
                carousel.style.transition = transition
                carousel.style.transform = "translateX(" + rightEdgeOfCarousel + "px)"
                            
                stopCarouselDrag(0)
                return 
            }
            

            carousel.style.transition = transition
            carousel.style.transform = "translateX(" + moveX + "px)"

        }
    }


    function stopCarouselDrag(clientX: number) {
        if (!isDragStarted) { return }
        isDragStarted = false

        if (!$mediaCarousel.value) { return }
        const carousel = $mediaCarousel.value as HTMLElement    

        const diffX = clientX - dragStartX    

        const threshold = mediaBoxWidth.value*0.25 /* should be < 0.3 for easier swiping */

        // if (diffX < -threshold) {
        //     if (selectedMedia.value >= (listData.value.length - 1) ) { 
        //         selectedMedia.value = listData.value.length - 1
        //     } else {
        //         selectedMedia.value += 1
        //     }
        // } else if (diffX > threshold) {
        //     if (selectedMedia.value <= 0) { 
        //         selectedMedia.value = 0 
        //     } else {
        //         selectedMedia.value -= 1
        //     }
        // }

        // const moveX = (-mediaBoxWidth.value) * selectedMedia.value
        // carousel.style.transition = "transform 0.35s ease-out"
        // carousel.style.transform = "translateX(" + moveX + "px)"

        dragStartX = 0
        dragStartY = 0
    }

    function mouseUp(event: Event) {
        const drag = (event as DragEvent)
        const clientX = drag.clientX
        stopCarouselDrag(clientX)
    }

    function touchEnd(event: Event) {
        const touch = (event as TouchEvent)
        if (touch.changedTouches.length < 1) { return }
        const clientX = touch.changedTouches[0].clientX
        stopCarouselDrag(clientX)
    }

</script>

<template>

    <div class="mediaThumbnailsWrapper" ref="$postMediaContainer"
        @mousedown="mouseDown" 
        @mousemove="mouseMove" 
        @mouseup="mouseUp" @mouseleave="mouseUp"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd" @touchcancel="touchEnd">

        <div class="mediaCarousel" ref="$mediaCarousel">

            <div v-for="(item, index) in listData" :key="item.contentID" class="mediaBox">

                <div v-if='item.isCodecH265' class='mediaLoaderBox'>
                    
                </div>

                <div v-else-if="!item.previewImageBlobUrl" class="mediaLoaderBox">
                    <div class="loader"></div>
                </div>
                


                <img v-else class="postImage" :src="item.previewImageBlobUrl" :width="mediaBoxWidth" :height="mediaBoxHeight" 
                    @click="$emit('openMedia', listData, index, props.contentID)"
                    alt="Post Image">


                <div v-if='item.mediaType == MediaType.Video' class='playIconContainer'
                    @click="$emit('openMedia', listData, index, props.contentID)">
                    <div class="playCircle">
                        <div class="playIcon">
                            <font-awesome-icon :icon="['fas', 'play']" size='2xs' />
                        </div>
                    </div>
                </div>

            </div>
        </div>
        
        <!-- <img v-else-if="showPreviewImage" id="previewImage" :src="previewImageSrc" alt="Link Preview"> -->

        <!-- <button v-if="!mainStore.isMobile && (selectedMedia != 0)" class="carouselButton carouselButtonPrevious" @click="clickPrevious">
            <font-awesome-icon :icon="['fas', 'chevron-left']" />
        </button>
        <button v-if="!mainStore.isMobile && (selectedMedia < album.length - 1)" class="carouselButton carouselButtonNext" @click="clickNext">
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>      -->

    </div>

</template>

<style scoped>

    .mediaThumbnailsWrapper {
        position: relative;
        
        /* border-radius: 15px; */
        overflow: hidden;

        flex: 0 0 v-bind(mediaBoxHeight + 'px');
        width: 100%;


        align-self: center;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .mediaCarousel {
        

        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: horizontal;

        transition: transform 0.25s;
        transform: translateX(calc(-100% * v-bind(selectedMedia)));

        user-select: none;
    }

    .mediaCarousel .mediaBox {
        position: relative;
        margin-right: 5px;

        /* width: v-bind(mediaBoxWidth + 'px');
        height: v-bind(mediaBoxHeight + 'px'); */

        /* width: 50px;
        height: 60px; */
        
        background-color: v-bind(secondaryBgColor);

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .mediaCarousel .mediaBox img {
        width: v-bind(mediaBoxWidth + 'px');
        height: v-bind(mediaBoxHeight + 'px');
        object-fit: cover;    
        -webkit-user-drag: none;
        border-radius: 8px;
    }

    .carouselButton {
        width: 40px;
        height: 50px;

        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;

        padding: 0px;
        margin: 0.5rem;
        border: none;

        font-size: 1.5rem;
        cursor: pointer;

        transition: color 0.2s;
        opacity: 0.6;
    }

    .carouselButton:hover {
        color: rgba(0, 0, 0, 0.5);
        opacity: 1;
    }
    .carouselButtonPrevious {
        left: -10px;
        border-radius: 0px 10px 10px 0px;
    }
    .carouselButtonNext {
        right: -10px;
        border-radius: 10px 0px 0px 10px;
    }

    .selected {
        background-color: #FF4500;
    }

    .postVideo {
        object-fit: contain;
        border-radius: 15px;
        background-color: white;
    }

    #previewImage {
        height: 90%;
        object-fit: contain;
    }

    .mediaLoaderBox {
        min-width: v-bind(mediaBoxWidth + 'px');
    
        display: flex;
        flex-direction: horizontal;
        justify-content: center;
        align-items: center;
    }
    .mediaErrorMsg {
        text-align: center;
        padding-left: 50px;
        padding-right: 50px;
        font-size: 12px;
        color: gray;
    }
    .loader {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3498db;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 2s linear infinite;
    }

    .playIconContainer {
        position: absolute;
        width: fit-content;
        height: fit-content;
        left: 50%;
        bottom: 50%;

        transform: translate(-50%, 50%);

        color: v-bind(primaryWhiteBlackColor);
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

        /* using a bg allows the play button to show through better even when the image is white */
        background:rgba(0, 0, 0, 0.1);         

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

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

</style>
