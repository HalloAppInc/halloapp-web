<script setup lang="ts">
    import { Ref, ref, computed } from 'vue'
    import { storeToRefs } from 'pinia'
    import { liveQuery } from 'dexie'

    import { db, SubjectType, MediaType } from '@/db'

    import { useColorStore } from '@/stores/colorStore'

    import { useHACommonMedia } from '@/composables/haCommonMedia'

    const colorStore = useColorStore()

    const { 
        primaryWhiteBlack: primaryWhiteBlackColor,
    } = storeToRefs(colorStore)      

    const { fetchCommonMedia
    } = useHACommonMedia()

    interface Props {
        type: SubjectType,
        subjectID: string,
        contentID: string,
        mediaList: any,
    }
    const props = defineProps<Props>()

    const numberOfMedia = props.mediaList.length


    function makeMed(med: any) {
        if (med && med.previewImageArrBuf) {
            const blob = new Blob([med.previewImageArrBuf, {type: 'image/jpeg'}])

            const previewImageBlobUrl = URL.createObjectURL(blob)
            if (previewImageBlobUrl) { 
                med.previewImageBlobUrl = previewImageBlobUrl
            }
        }
        return med
    }

    const firstMedia = computed(() => {
        let med = listData.value[0] ? listData.value[0] : undefined
        return makeMed(med)
    })
    
    const secondMedia = computed(() => {
        let med = listData.value[1] ? listData.value[1] : undefined
        return makeMed(med)
    })
    const thirdMedia = computed(() => {
        let med = listData.value[2] ? listData.value[2] : undefined
 
        return makeMed(med)
    })

    const fourthMedia = computed(() => {
        let med = listData.value[3] ? listData.value[3] : undefined

        return makeMed(med)
    })    

    const listData: Ref<any[]> = ref([])

    init()

    async function init() {
        const result = await fetchCommonMedia(props.type, props.mediaList)

        if (result.needWatching) {
            setupObserver()
        } else {
            listData.value = props.mediaList
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

                listData.value = result
            },
            error: error => console.error(error)
        })
    }


</script>

<template>

    <div class="mediaCollage">

        <div v-if='numberOfMedia == 1' class='containerOneMedia'>
            <div v-if='!firstMedia || !firstMedia.previewImageArrBuf' class='loaderContainer'>
                <div class='loader'></div>
            </div>

            <div v-if="firstMedia" :class="['imgBigContainer', { 'blur': !firstMedia.previewImageArrBuf }]" @click="$emit('openMedia', mediaList, 0, props.contentID)">
                <img class="image" :src='firstMedia.previewImageBlobUrl' :width='firstMedia.width' :height='firstMedia.height' />

                <div v-if='firstMedia.mediaType == MediaType.Video' class='playIconContainer'>
                    <div class="playCircle">
                        <div class="playIcon">
                            <font-awesome-icon :icon="['fas', 'play']" size='xl' />
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <!-- todo: refactor, these are repetitive -->
        <div v-else-if='numberOfMedia == 2 && secondMedia' class='containerMoreThanOneMedia'>

            <div class='imgVerticalRectangleContainer' @click="$emit('openMedia', mediaList, 0, props.contentID)">

                <img class='image' :src='firstMedia.previewImageBlobUrl' :height='firstMedia.hieght' :width='firstMedia.width' />
                <div class='iconContainer' v-if='firstMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

            <div class='imgVerticalRectangleContainer lastElementInLine' @click="$emit('openMedia', mediaList, 1, props.contentID)">

                <img class='image' :src='secondMedia.previewImageBlobUrl' :height='secondMedia.height' :width='secondMedia.width' />
                <div class='iconContainer' v-if='secondMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

        </div>


        <div v-else-if='numberOfMedia == 3 && thirdMedia' class='containerMoreThanOneMedia'>

            <div class='imgSquareContainer' @click="$emit('openMedia', mediaList, 0, props.contentID)">

                <img :src='firstMedia.previewImageBlobUrl' :height='firstMedia.height' :width='firstMedia.width' />
                <div class='iconContainer' v-if='firstMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

            <div class='imgSquareContainer imgSquareContainerLastElementInRow' @click="$emit('openMedia', mediaList, 1, props.contentID)">

                <img :src='secondMedia.previewImageBlobUrl' :height='secondMedia.height' :width='secondMedia.width' />
                <div class='iconContainer' v-if='secondMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

            <div class='imgHorizontalRectangleContainer' @click="$emit('openMedia', mediaList, 2, props.contentID)">

                <img :src='thirdMedia.previewImageBlobUrl' :height='thirdMedia.height' :width='thirdMedia.width' />
                <div class='iconContainer' v-if='thirdMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

        </div>



        <div v-else-if='numberOfMedia >= 4 && fourthMedia' class='containerMoreThanOneMedia'>

            <div class='imgSquareContainer' @click="$emit('openMedia', mediaList, 0, props.contentID)">

                <img :src='firstMedia.previewImageBlobUrl' :height='firstMedia.hieght' :width='firstMedia.width' />
                <div class='iconContainer' v-if='firstMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

            <div class='imgSquareContainer imgSquareContainerLastElementInRow' @click="$emit('openMedia', mediaList, 1, props.contentID)">

                <img :src='secondMedia.previewImageBlobUrl' :height='secondMedia.hieght' :width='secondMedia.width' />
                <div class='iconContainer' v-if='secondMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

            <div class='imgSquareContainer imgSquareContainerLastElementInCol' @click="$emit('openMedia', mediaList, 2, props.contentID)">

                <img :src='thirdMedia.previewImageBlobUrl' :height='thirdMedia.height' :width='thirdMedia.width' />
                <div class='iconContainer' v-if='thirdMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

            <!-- if 4 media -->
            <div v-if='numberOfMedia == 4' class='imgSquareContainer imgSquareContainerLastElementInRow imgSquareContainerLastElementInCol'
                @click="$emit('openMedia', mediaList, 3, props.contentID)">

                <img :src='fourthMedia.previewImageBlobUrl' :height='fourthMedia.height' :width='fourthMedia.width' />
                <div class='iconContainer' v-if='fourthMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

            <!-- if more than 4 -->
            <div v-else-if='numberOfMedia > 4' @click="$emit('openMedia', mediaList, 3, props.contentID)">
                <div class='imgSquareContainer imgSquareContainerLastElementInRow imgSquareContainerLastElementInCol'>

                    <img class='blurImg' :src='fourthMedia.previewImageBlobUrl' :height='fourthMedia.height' :width='fourthMedia.width' />
                    <div class='iconContainer'>
                        <font-awesome-icon :icon="['fas', 'plus']" size='2x' />
                    </div>

                </div>

            </div>

        </div>

    </div>

</template>

<style scoped>

    .containerOneMedia {
        width: 300px;
        height: 300px;

        overflow: hidden;
        display: flex;
    }

    .containerMoreThanOneMedia {
        max-width: 305px;
        max-height: 310px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    img {
        overflow: hidden;
    }

    .imgBigContainer {
        position: relative;
        width: 300px;
        height: 300px;

        border-radius: 5px;
       
       
        overflow: hidden;
    }

    .imgBigContainer .image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .imgVerticalRectangleContainer {
        width: 150px;
        height: 300px;
        overflow: hidden;
        margin-right: 5px;
        border-radius: 5px;

        position: relative;
    }

    .imgVerticalRectangleContainer .image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .lastElementInLine {
        margin-right: 0px;
    }

    .lastElementInColumn {
        margin-bottom: 0px;
    }

    .imgSquareContainer {
        width: 150px;
        height: 150px;
        overflow: hidden;
        margin-right: 5px;
        border-radius: 5px;
        margin-bottom: 5px;

        position: relative;
    }

    .imgSquareContainerLastElementInRow {
        margin-right: 0px;
    }

    .imgSquareContainerLastElementInCol {
        margin-bottom: 0px;
    }

    .imgHorizontalRectangleContainer {
        width: 305px;
        height: 150px;
        overflow: hidden;
        border-radius: 5px;

        position: relative;
    }

    .blurImg {
        filter: blur(4px);
        overflow: hidden;
    }

    .iconContainer {
        position: absolute;
        width: fit-content;
        height: fit-content;
        left: 50%;
        bottom: 50%;

        transform: translate(-50%, 50%);

        color: gainsboro;
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

    .blur {
        filter: blur(5px);
    }

    .loaderContainer {
        position: absolute;
        z-index: 1;
        left: 50%;
        bottom: 50%;
        width: fit-content;
        height: fit-content;
        transform: translate(-50%, 40%);

        flex: 1 1 auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .loader {
        border: 10px solid #f3f3f3;
        border-radius: 50%;
        border-top: 10px solid gray;
        width: 80px;
        height: 80px;
        -webkit-animation: spin 2s linear infinite;
        /* Safari */
        animation: spin 2s linear infinite;
    }

    /* Safari */
    @-webkit-keyframes spin {
        0% {
            -webkit-transform: rotate(0deg);
        }

        100% {
            -webkit-transform: rotate(360deg);
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
</style>