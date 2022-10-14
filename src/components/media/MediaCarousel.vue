<script setup lang="ts">
    import { Ref, ref, toRef, watch, defineEmits} from 'vue'
    import { storeToRefs } from 'pinia'
    import { liveQuery } from 'dexie'
    import { useI18n } from 'vue-i18n'

    import { useMainStore } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'
    import hal from "@/common/halogger"

    import { useHACommonMedia } from '@/composables/haCommonMedia'

    import { db, Post, CommonMedia, MediaType, Mention, SubjectType } from '@/db'

    const mainStore = useMainStore()
    const colorStore = useColorStore()

    const { getCommonMedia, fetchCommonMedia
    } = useHACommonMedia()

    const { t } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const { 
        primaryBlue: primaryBlueColor,
        primaryLightgray: primaryLightgrayColor,
        primaryWhiteBlack: primaryWhiteBlackColor,
        background: backgroundColor,
        secondaryBg: secondaryBgColor,
    } = storeToRefs(colorStore)  

    const emit = defineEmits<{
        (e: 'clickPrevious'): void
        (e: 'clickNext'): void
        (e: 'selectMedia', index: number): void
        (e: 'openMedia', mediaList: any, idx: number, contentID: string): void
    }>()

    interface Props {
        type: SubjectType,
        subjectID: string,
        contentID: string,
        showPreviewImage: boolean,
        previewImageSrc: string,
        postWidth: number,
        selectedMediaIndex: number,
       
    }
    const props = defineProps<Props>()

    const showPreviewImage  = toRef(props, 'showPreviewImage')
    const previewImageSrc   = toRef(props, 'previewImageSrc')
    const selectedMedia     = toRef(props, 'selectedMediaIndex')

    const mediaBoxWidth = ref(200)  // set to minimize box expanding/shrinking when loaded, 300 seems too much
    const mediaBoxHeight = ref(200) // set to minimize box expanding/shrinking when loaded, 400 seems too much

    const $postMediaContainer = ref(null)
    const $mediaCarousel = ref(null)

    let isDragStarted = false // indicate mousedown or touchstart
    let dragStartX = 0
    let dragStartY = 0

    let preventClick = false // used to prevent going into fullscreen (click) after dragging

    const listData: Ref<any[]> = ref([])

    init()

    async function init() {

        const mediaList = await getCommonMedia(props.type, props.subjectID, props.contentID)

        if (!mediaList) { 
            mediaBoxHeight.value = 0
            return 
        }

        listData.value = mediaList
        await makeList()

        const needWatching = await fetchCommonMedia(props.type, mediaList)

        if (needWatching) {   
            setupObserver()
        }

    }

    async function setupObserver() {
        const observable = liveQuery (() => db.commonMedia.where('contentID').equals(props.contentID).and((commonMed) => {
            return commonMed.subjectID == props.subjectID && commonMed.type == props.type
        }).toArray())

        const subscription = observable.subscribe({
            next: async result => {
                if (!result) { return }
                if (result.length == 0) { return }
                
                listData.value = result

                await makeList()

            },
            error: error => console.error(error)
        })
    }

    async function makeList() {
        setMediaSizes(listData)
        // todo: optimize by not redo-ing the entire list
        for (let i = 0; i < listData.value.length; i++) {
            const med = listData.value[i]
            if (!med.previewImage) { continue }
            if (med.previewImageUrl) { continue }
            const previewImageUrl = URL.createObjectURL(med.previewImage)
            med.previewImageUrl = previewImageUrl
        }

    }

    function setMediaSizes(mediaList: any) {
        if (!mediaList) { return }

        const defaultRatio = 0.75 // 3/4 width/height portrait ratio

        mediaBoxWidth.value = props.postWidth // media carousel single slide width
        mediaBoxHeight.value = mediaBoxWidth.value/defaultRatio

        const maxBoxWidth = mediaBoxWidth.value - 50 // width of media inside album
        const maxBoxHeight = maxBoxWidth/defaultRatio 

        let tallestMediaItemHeight = 0

        for (const [index, mediaItem] of mediaList.value.entries()) {
            let mediaItemWidth = mediaItem.width
            let mediaItemHeight = mediaItem.height

            /* most of the time the item height or width will be greater */
            if (mediaItemHeight > maxBoxHeight || mediaItemWidth > maxBoxWidth) {

                const mediaItemRatio = mediaItemWidth/mediaItemHeight

                /* item is wider, scale by max width */
                if (mediaItemRatio > defaultRatio) {
                    mediaItemWidth = maxBoxWidth
                    mediaItemHeight = mediaItemWidth/mediaItemRatio
                } 
    
                /* scale by max height */
                else {
                    mediaItemHeight = maxBoxHeight
                    mediaItemWidth = mediaItemHeight*mediaItemRatio
                }
            }

            /* add margins so carousel have some spacing between slides */
            const mediaItemMargin = props.postWidth - mediaItemWidth

            mediaItem.margin = mediaItemMargin
            mediaItem.width = mediaItemWidth
            mediaItem.height = mediaItemHeight

            if (mediaItemHeight > tallestMediaItemHeight) {
                tallestMediaItemHeight = mediaItemHeight
            }
        }

        /* set carousel slide height shorter if the tallest media is shorter than the default */
        if (tallestMediaItemHeight < mediaBoxHeight.value) {
            mediaBoxHeight.value = tallestMediaItemHeight
        }
    }
    

    function videoLoaded(event: Event, index: number) {
        const vid = (event.target as HTMLVideoElement)
        vid.currentTime += 2.0 // 1 sec seem the best compromise as some videoes are blank from 0.1 to 0.5
    }

    function clickPrevious(event: Event) {
        if (!$mediaCarousel.value) { return }
        const carousel = $mediaCarousel.value as HTMLElement
        carousel.style.transition = "transform 0.25s"

        if (selectedMedia.value <= 0) { return }

        const previous = selectedMedia.value - 1
        const moveX = (-mediaBoxWidth.value) * previous

        emit('clickPrevious')
        // selectedMedia.value -= 1

        // const moveX = (-mediaBoxWidth.value) * selectedMedia.value
        carousel.style.transform = "translateX(" + moveX + "px)"
    }

    function clickNext(event: Event) {
        if (!$mediaCarousel.value) { return }
        const carousel = $mediaCarousel.value as HTMLElement
        carousel.style.transition = "transform 0.25s"    

        if (selectedMedia.value >= (listData.value.length - 1) ) { 
            return 
        }

        const next = selectedMedia.value + 1
        const moveX = (-mediaBoxWidth.value) * next

        emit('clickNext')
        // selectedMedia.value += 1

        // const moveX = (-mediaBoxWidth.value) * selectedMedia.value
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

        if (Math.abs(diffX) > 10) {
            preventClick = true
        }

        if (!dragThrottled) {    
            dragCarousel(diffX)  
            dragThrottled = true
            setTimeout(function () {          
                dragThrottled = false          
            }, 75)
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

        const leftEdgeOfCarousel = 0
        const rightEdgeOfCarousel = (-mediaBoxWidth.value)*(listData.value.length - 1)

        const moveX = (-mediaBoxWidth.value)*(selectedMedia.value) + diffX

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
            if (moveX > leftEdgeOfCarousel) { return }
            carousel.style.transition = transition
            carousel.style.transform = "translateX(" + moveX + "px)"
        } else if (diffX < -minDiff) {
            if (moveX < rightEdgeOfCarousel) { return }
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

        let moveToSelectedMedia = selectedMedia.value

        if (diffX < -threshold) {
            if (selectedMedia.value >= (listData.value.length - 1) ) { 
                // selectedMedia.value = listData.value.length - 1
                moveToSelectedMedia = listData.value.length - 1
            } else {
                moveToSelectedMedia += 1
                // selectedMedia.value += 1
            }
        } else if (diffX > threshold) {
            if (selectedMedia.value <= 0) { 
                // selectedMedia.value = 0 
                moveToSelectedMedia = 0
                
            } else {
                moveToSelectedMedia -= 1
               
                // selectedMedia.value -= 1
            }
        }

        if (moveToSelectedMedia != selectedMedia.value) {
            emit('selectMedia', moveToSelectedMedia)
        }

        const moveX = (-mediaBoxWidth.value) * moveToSelectedMedia
        carousel.style.transition = "transform 0.35s ease-out"
        carousel.style.transform = "translateX(" + moveX + "px)"

        dragStartX = 0
        dragStartY = 0
    }

    watch(() => props.selectedMediaIndex, (newValue, oldValue) => {
        if (newValue != oldValue) {
            if (!$mediaCarousel.value) { return }
            const carousel = $mediaCarousel.value as HTMLElement    

            const moveX = (-mediaBoxWidth.value) * newValue
            carousel.style.transition = "transform 0.35s ease-out"
            carousel.style.transform = "translateX(" + moveX + "px)"
        }
    })

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

    function clickCapture(event: any) {
        if (preventClick) {
            event.stopPropagation();
            preventClick = false
        }
    }

</script>

<template>
    
    <div class="mediaCarouselWrapper">
        <div id="postMediaContainer" ref="$postMediaContainer"
            @mousedown="mouseDown" 
            @mousemove="mouseMove" 
            @mouseup="mouseUp" @mouseleave="mouseUp"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd" @touchcancel="touchEnd"
            @click.capture="clickCapture">

            <div v-if="listData.length > 0" class="mediaCarousel" ref="$mediaCarousel">

                <div v-for="(item, index) in listData" :key="item.contentID" class="mediaBox">

                    <div v-if='item.isCodecH265' class='mediaLoaderBox'>
                        <div :class="['mediaErrorMsg']">{{ t('post.noH265VideoSupportText') }}</div>
                    </div>

                    <div v-else-if="!item.previewImageUrl" class="mediaLoaderBox">
                        <div class="loader"></div>
                    </div>
                    
                    <img v-else-if="item.mediaType == MediaType.Image" class="postImage" 
                        :src="item.previewImageUrl" :width="item.width" :height="item.height" 
                        :style="'margin-left: ' + item.margin + 'px; margin-right: ' + item.margin + 'px;'"
                        @click="$emit('openMedia', listData, index, props.contentID)"
                        alt="Post Image">


                    <img v-else-if="item.mediaType == MediaType.Video" class="postImage" 
                        :src="item.previewImageUrl" :width="item.width" :height="item.height" 
                        :style="'margin-left: ' + item.margin + 'px; margin-right: ' + item.margin + 'px;'"
                        @click="$emit('openMedia', listData, index, props.contentID)"
                        alt="Video Preview Image">


                    <div v-if='item.mediaType == MediaType.Video' class='playIconContainer'>
                        <div class="playCircle">
                            <div class="playIcon">
                                <font-awesome-icon :icon="['fas', 'play']" size='xl' />
                            </div>
                        </div>
                    </div>

                    
                    <!-- <video v-else-if="item.mediaType == MediaType.Video" class="postVideo" 
                        :width="item.width" :height="item.height"
                        :style="'margin-left: ' + item.margin + 'px; margin-right: ' + item.margin + 'px;'" 
                        preload="metadata" @loadedmetadata="videoLoaded($event, index)" playsinline controls controlsList="">
                        <source v-if="item.blobUrl" :src="item.blobUrl" type="video/mp4">
                        <p>{{ t('mediaCarousel.noVideoSupportText') }}</p>
                    </video> -->

                </div>
            </div>
            
            <img v-else-if="showPreviewImage" id="previewImage" :src="previewImageSrc" alt="Link Preview">

            <button v-if="!mainStore.isMobile && (selectedMedia != 0)" class="carouselButton carouselButtonPrevious" @click="clickPrevious">
                <font-awesome-icon :icon="['fas', 'chevron-left']" />
            </button>
            <button v-if="!mainStore.isMobile && (selectedMedia < listData.length - 1)" class="carouselButton carouselButtonNext" @click="clickNext">
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </button>     

        </div>

        <div v-if="listData.length > 1" class="mediaIndicatorBox">
            <div v-for="(media, index) in listData" :class="['mediaIndicator', {selected: index == selectedMedia}]"
                @click="emit('selectMedia', index)">
            </div>
        </div>
    </div>

</template>

<style scoped>

    .mediaCarouselWrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

    }

    #postMediaContainer {
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

    .mediaCarousel {
        position: absolute;

        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: horizontal;

        transition: transform 0.25s;
        transform: translateX(calc(-100% * v-bind(selectedMedia)));

        user-select: none;
    }

    .mediaBox {
        position: relative;

        width: v-bind(mediaBoxWidth + 'px');
        height: v-bind(mediaBoxHeight + 'px');
        
        background-color: v-bind(secondaryBgColor);

        display: flex;
        justify-content: center;
        align-items: center;
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

    .mediaIndicatorBox {
        text-align: center;
        padding: 10px;
        display: flex;
        flex-direction: horizontal;
        justify-content: center;
    }

    .mediaIndicator {
        margin: 0px 4px 0px 4px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background-color: v-bind(primaryLightgrayColor);
    }
    .mediaIndicator:hover {
        background-color: v-bind(primaryBlueColor);
        cursor: pointer;
    }

    .selected {
        background-color: #FF4500;
    }


    .postImage {
        object-fit: contain;    
        -webkit-user-drag: none;
        border-radius: 15px;
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

        z-index: 1; /* need to be higher than video play button */
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
        width: 40px;
        height: 40px;
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
        width: 70px;
        height: 70px;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        
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
