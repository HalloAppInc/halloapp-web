<script setup lang="ts">
    import { Ref, ref, toRef } from "vue"
    import { storeToRefs } from 'pinia'
    import { liveQuery } from "dexie"

    import hal from "../../common/halogger"

    import { useColorStore } from '../../stores/colorStore'

    import { db, Feed, PostMedia, PostMediaType, Mention } from '../../db'
    import { useI18n } from 'vue-i18n'

    const colorStore = useColorStore()

    const { t } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const { 
        background: backgroundColor,
        secondaryBg: secondaryBgColor,
    } = storeToRefs(colorStore)  

    enum MediaType {
        Image,
        Video
    }
    interface Media {
        type?: PostMediaType;
        mediaBlob?: any;
        width: number;
        height: number;
        margin: number;
        lengthMins?: String;
        lengthSeconds?: String;
        isReady: boolean;
    }

    const props = defineProps({
        isMobile: {
            type: Boolean,
            required: true
        },
        isSafari: {
            type: Boolean,
            required: true
        },
        postID: {
            type: String,
            required: true
        },    
        isAlbum: {
            type: Boolean,
            required: true
        },
        album: {
            type: Object,
            required: true
        },
        showPreviewImage: {
            type: Boolean,
            required: true
        },
        previewImageSrc: {
            type: String,
            required: true
        },
        mediaBoxWidth: {
            type: Number,
            required: true
        },
        mediaBoxHeight: {
            type: Number,
            required: true
        }
    })

    const isMobile          = toRef(props, 'isMobile')
    const isSafari          = toRef(props, 'isSafari')
    const isAlbum           = toRef(props, 'isAlbum')
    const album             = toRef(props, 'album')
    const showPreviewImage  = toRef(props, 'showPreviewImage')
    const previewImageSrc   = toRef(props, 'previewImageSrc')
    const mediaBoxWidth     = toRef(props, 'mediaBoxWidth')
    const mediaBoxHeight    = toRef(props, 'mediaBoxHeight')

    const $postMediaContainer = ref(null)
    const $mediaCarousel = ref(null)

    let isDragStarted = false   // indicate mousedown or touchstart
    let dragStartX = 0
    let dragStartY = 0

    const selectedMedia = ref(0)

    function videoLoaded(event: Event, index: number) {
        // hal.log('MediaCarousel/videoLoaded index: ' + index)
        const vid = (event.target as HTMLVideoElement)
        vid.currentTime += 0.001
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

        if (selectedMedia.value >= (props.album.length - 1) ) { 
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
        const rightEdgeOfCarousel = (-mediaBoxWidth.value)*(props.album.length - 1)

        const moveX = (-mediaBoxWidth.value)*(selectedMedia.value) + diffX

        /* 
        * Different platforms/browsers have different results when dragging slides in the carousel,
        * especially when the page is first loaded and then dragging the 1st slide to the 2nd 
        */

        // Desktop Chrome needs transition to be > 0.10s for smooth drags, minDiff 5 helps
        let transition = "transform 0.15s"
        let minDiff = 5

        // Desktop Safari needs transition to be < 0.15s for smooth drags, minDiff 3 helps
        if (isSafari.value) {
            transition = "transform 0.10s"
            minDiff = 3
        }

        // Mobile Safari needs transition set to none for smooth drags, minDiff 0 helps
        if (isMobile.value) {
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

        if (diffX < -threshold) {
            if (selectedMedia.value >= (props.album.length - 1) ) { 
                selectedMedia.value = props.album.length - 1
            } else {
                selectedMedia.value += 1
            }
        } else if (diffX > threshold) {
            if (selectedMedia.value <= 0) { 
                selectedMedia.value = 0 
            } else {
                selectedMedia.value -= 1
            }
        }

        const moveX = (-mediaBoxWidth.value) * selectedMedia.value
        carousel.style.transition = "transform 0.35s ease-out"
        carousel.style.transform = "translateX(" + moveX + "px)"

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

<div id="postMediaContainer" ref="$postMediaContainer"
    @mousedown="mouseDown" 
    @mousemove="mouseMove" 
    @mouseup="mouseUp" @mouseleave="mouseUp"
    @touchstart="touchStart"
    @touchmove="touchMove"
    @touchend="touchEnd" @touchcancel="touchEnd">

    <div v-if="isAlbum" class="mediaCarousel" ref="$mediaCarousel">

        <div v-for="(item, index) in props.album" class="mediaBox">

            <div v-if='item.errorMsg' class='mediaLoaderBox'>
                <div class="mediaErrorMsg">{{ item.errorMsg }}</div>
            </div>

            <div v-else-if="!item.isReady" class="mediaLoaderBox">
                <div class="loader"></div>
            </div>
            
            <img v-else-if="item.type == PostMediaType.Image" class="postImage" :src="item.mediaBlob" :width="item.width" :height="item.height" 
                :style="'margin-left: ' + item.margin + 'px; margin-right: ' + item.margin + 'px;'" 
                alt="Post Image">

            <video v-else-if="item.type == PostMediaType.Video" class="postVideo" 
                :width="item.width" :height="item.height"
                :style="'margin-left: ' + item.margin + 'px; margin-right: ' + item.margin + 'px;'" 
                preload="metadata" @loadedmetadata="videoLoaded($event, parseInt(index))" playsinline controls controlsList="">
                <source v-if="item.mediaBlob" :src="item.mediaBlob" type="video/mp4">
                <p>{{ t('mediaCarousel.noVideoSupportText') }}</p>
            </video>

            <!-- <div v-if="item.type == MediaType.Video" class="mediaLength">
                {{ item.lengthMins }}:{{ item.lengthSeconds }}
            </div> -->

        </div>
    </div>
    
    <img v-else-if="showPreviewImage" id="previewImage" :src="previewImageSrc" alt="Link Preview">

    <button v-if="!isMobile && (selectedMedia != 0)" class="carouselButton carouselButtonPrevious" @click="clickPrevious">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
    </button>
    <button v-if="!isMobile && (selectedMedia < album.length - 1)" class="carouselButton carouselButtonNext" @click="clickNext">
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
    </button>     

</div>

<div v-if="isAlbum && album.length > 1" id="mediaIndicatorBox">
    <div v-for="(media, index) in album" :class="['mediaIndicator', {selected: parseInt(index) == selectedMedia}]">
    </div>
</div>

</template>

<style scoped>

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

#mediaIndicatorBox {
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
    background-color: rgba(0, 0, 0, 0.2);;
    /* opacity: 20%; */
}
@media (prefers-color-scheme: dark) {
    .mediaIndicator {
        background-color: rgba(255, 255, 255, 0.2);
    }
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

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

</style>
