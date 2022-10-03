<script setup lang="ts">
    import { Ref, ref, computed } from 'vue'
    import { storeToRefs } from 'pinia'
    import { liveQuery } from 'dexie'

    import { db, Feed, CommonMedia, SubjectType, MediaType } from '@/db'

    import { useHACommonMedia } from '@/composables/haCommonMedia'

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

    const firstMedia = computed(() => {
        let med = listData.value[0] ? listData.value[0] : undefined
        if (med && med.previewImage) {
            const previewImageBlobUrl = URL.createObjectURL(med.previewImage)
            if (previewImageBlobUrl) { 
                med.previewImageBlobUrl = previewImageBlobUrl
            }
        }        

        return med
    })
    const secondMedia = computed(() => {
        let med = listData.value[1] ? listData.value[1] : undefined

        if (med && med.blob) {
            const blobUrl = URL.createObjectURL(med.blob)
            if (blobUrl) { 
                med.blobUrl = blobUrl
            }
        }
        return med
    })
    const thirdMedia = computed(() => {
        let med = listData.value[2] ? listData.value[2] : undefined
        if (med && med.blob) {
            const blobUrl = URL.createObjectURL(med.blob)
            if (blobUrl) { 
                med.blobUrl = blobUrl
            }
        }        
        return med
    })

    const fourthMedia = computed(() => {
        let med = listData.value[3] ? listData.value[3] : undefined
        if (med && med.blob) {
            const blobUrl = URL.createObjectURL(med.blob)
            if (blobUrl) { 
                med.blobUrl = blobUrl
            }
        }
        return med
    })    


    const listData: Ref<any[]> = ref([])

    init()

    async function init() {
        const needWatching = await fetchCommonMedia(props.type, props.mediaList)

        // if (avatarImgBlob) {
        //     const avatarImgBlobUrl = URL.createObjectURL(avatarImgBlob)
        //     avatarImageUrl.value = avatarImgBlobUrl 
        // }

        /* some/all media still need to be fetched from AWS and thus need to be watched */
        if (needWatching) {
            setupObserver()
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
                // if (!result[0].image) { return }
                // if (result[0].image.size == 0) { return }

                // const avatarImgBlobUrl = URL.createObjectURL(result[0].image)
                // if (!avatarImgBlobUrl) { return }
                // avatarImageUrl.value = avatarImgBlobUrl
                listData.value = result
            },
            error: error => console.error(error)
        })
    }


</script>

<template>

    <div class="mediaCollage">

        <div v-if='numberOfMedia == 1' class='containerOneMedia'>
            <div v-if='!firstMedia || !firstMedia.previewImage' class='loaderContainer'>
                <div class='loader'></div>
            </div>

            <div v-if="firstMedia" :class="['imgBigContainer', { 'blur': !firstMedia.previewImage }]" @click="$emit('openMedia', mediaList, 0, props.contentID)">
                <img class="image" :src='firstMedia.previewImageBlobUrl' :width='firstMedia.width' :height='firstMedia.height' />
                <div v-if='firstMedia.mediaType == MediaType.Video' class='iconContainer'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>
            </div>

        </div>


        <div v-else-if='numberOfMedia == 2 && secondMedia' class='containerMoreThanOneMedia'>

            <div class='imgVerticalRectangleContainer' @click="$emit('openMedia', mediaList, 0, props.contentID)">

                <img :src='firstMedia.blobUrl' :height='firstMedia.hieght' :width='firstMedia.width' />
                <div class='iconContainer' v-if='firstMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

            <div class='imgVerticalRectangleContainer lastElementInLine' @click="$emit('openMedia', mediaList, 1, props.contentID)">

                <img :src='secondMedia.blobUrl' :height='secondMedia.height' :width='secondMedia.width' />
                <div class='iconContainer' v-if='secondMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

        </div>


        <div v-else-if='numberOfMedia == 3 && thirdMedia' class='containerMoreThanOneMedia'>

            <div class='imgSquareContainer' @click="$emit('openMedia', mediaList, 0, props.contentID)">

                <img :src='firstMedia.blobUrl' :height='firstMedia.height' :width='firstMedia.width' />
                <div class='iconContainer' v-if='firstMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

            <div class='imgSquareContainer imgSquareContainerLastElementInRow' @click="$emit('openMedia', mediaList, 1, props.contentID)">

                <img :src='secondMedia.blobUrl' :height='secondMedia.height' :width='secondMedia.width' />
                <div class='iconContainer' v-if='secondMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

            <div class='imgHorizontalRectangleContainer' @click="$emit('openMedia', mediaList, 2, props.contentID)">

                <img :src='thirdMedia.blobUrl' :height='thirdMedia.height' :width='thirdMedia.width' />
                <div class='iconContainer' v-if='thirdMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

        </div>



        <div v-else-if='numberOfMedia >= 4 && fourthMedia' class='containerMoreThanOneMedia'>

            <div class='imgSquareContainer' @click="$emit('openMedia', mediaList, 0, props.contentID)">

                <img :src='firstMedia.blobUrl' :height='firstMedia.hieght' :width='firstMedia.width' />
                <div class='iconContainer' v-if='firstMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

            <div class='imgSquareContainer imgSquareContainerLastElementInRow' @click="$emit('openMedia', mediaList, 1, props.contentID)">

                <img :src='secondMedia.blobUrl' :height='secondMedia.hieght' :width='secondMedia.width' />
                <div class='iconContainer' v-if='secondMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

            <div class='imgSquareContainer imgSquareContainerLastElementInCol' @click="$emit('openMedia', mediaList, 2, props.contentID)">

                <img :src='thirdMedia.blobUrl' :height='thirdMedia.height' :width='thirdMedia.width' />
                <div class='iconContainer' v-if='thirdMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

            <!-- if 4 media -->
            <div v-if='numberOfMedia == 4' class='imgSquareContainer imgSquareContainerLastElementInRow imgSquareContainerLastElementInCol'
                @click="$emit('openMedia', mediaList, 3, props.contentID)">

                <img :src='fourthMedia.blobUrl' :height='fourthMedia.height' :width='fourthMedia.width' />
                <div class='iconContainer' v-if='fourthMedia.type == "video"'>
                    <font-awesome-icon :icon="['fas', 'play']" size='2x' />
                </div>

            </div>

            <!-- if more than 4 -->
            <div v-else-if='numberOfMedia > 4' @click="$emit('openMedia', mediaList, 3, props.contentID)">
                <div class='imgSquareContainer imgSquareContainerLastElementInRow imgSquareContainerLastElementInCol'>

                    <img class='blurImg' :src='fourthMedia.blobUrl' :height='fourthMedia.height' :width='fourthMedia.width' />
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