<script setup lang='ts'>
    import { Ref, ref, toRef } from 'vue'
    import { Base64 } from 'js-base64'
    import { useI18n } from 'vue-i18n'

    import { db, CommonMedia, SubjectType, MediaType } from '@/db'
    
    import hal from '@/common/halogger'
    import { useHACommonMedia } from '@/composables/haCommonMedia'

    const { 
        getCommonMedia,
        fetchCommonMedia
    } = useHACommonMedia()

    const { t } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const imageInfo = Base64.fromBase64("SGFsbG9BcHAgaW1hZ2U=")

    interface Props {
        moment: any,
        postWidth: number,
    }

    const props = defineProps<Props>()

    const mediaBoxWidth     = ref(0)
    const mediaBoxHeight    = ref(0)

    const mediaList: Ref<any[]> = ref([])

    const list: Ref<any[]> = ref([])

    const showImage = ref(false)


    async function processMomentList(moment: any) {

        const image = moment.image
        const selfieImage = moment.selfieImage
        let isSplit = false
       
        if (image) {
            mediaList.value.push(image)
        }

        if (selfieImage) {
            if (moment.selfieLeading) {
                mediaList.value.unshift(selfieImage)
            } else {
                mediaList.value.push(selfieImage)
            }
        }

        setMediaSizes(mediaList.value)

        // mediaList.value.forEach(async (med) => {

        //     const mediaBinArr = await getMediaBinArr(imageInfo, med.img)
        //     if (!mediaBinArr) return
        //     const mediaBlob = new Blob([mediaBinArr], {type: 'image/jpeg'})
        //     const blobUrl = URL.createObjectURL(mediaBlob)

        //     med.blobUrl = blobUrl
        // })

        /* showImage and timeout used as a quick attempt to show both images at once */
        setTimeout(function() {
            showImage.value = true 
        }, 500)       

    }


    async function processMoment(moment: any) {
        const image = moment.image
        const selfieImage = moment.selfieImage
        let isSplit = false
       
        if (image) {
            mediaList.value.push(image)
        }

        if (selfieImage) {
            if (moment.selfieLeading) {
                mediaList.value.unshift(selfieImage)
            } else {
                mediaList.value.push(selfieImage)
            }
        }

        setMediaSizes(mediaList.value)

        // mediaList.value.forEach(async (med) => {

        //     const mediaBinArr = await getMediaBinArr(imageInfo, med.img)
        //     if (!mediaBinArr) return
        //     const mediaBlob = new Blob([mediaBinArr], {type: 'image/jpeg'})
        //     const blobUrl = URL.createObjectURL(mediaBlob)

        //     med.blobUrl = blobUrl
        // })

        /* showImage and timeout used as a quick attempt to show both images at once */
        setTimeout(function() {
            showImage.value = true 
        }, 500)       

    }

    function setMediaSizes(postAlbum: any) {

        const defaultRatio = 1 // square

        mediaBoxWidth.value = props.postWidth - 20
        mediaBoxHeight.value = mediaBoxWidth.value/defaultRatio

        let maxWidth = mediaBoxWidth.value
        const maxHeight = (maxWidth/defaultRatio)

        let tallestMediaItemHeight = 0

        for (let med of postAlbum) {
            
            let width = med.width
            let height = med.height

            if (height > maxHeight) {
                
                const medRatio = med.width/med.height
                if (medRatio > defaultRatio) {
                    width = maxWidth
                    height = width/medRatio
                } else {
                    height = maxHeight
                    width = height*medRatio
                }
            }

            med.adjustedWidth = width
            med.adjustedHeight = height

            if (height > tallestMediaItemHeight) {
                tallestMediaItemHeight = height
            }
        }

        /* set container height shorter if the tallest media is shorter than the default */
        if (tallestMediaItemHeight < mediaBoxHeight.value) {
            mediaBoxHeight.value = tallestMediaItemHeight
        }
    }

    // processMomentList(props.moment)

    init()

    async function makeList() {
        for (let i = 0; i < list.value.length; i++) {
            const med = list.value[i]  
            if (!med.previewImageArrBuf) { continue }
            if (med.previewImageBlobUrl) { continue }

            const previewImageBlob = new Blob([med.previewImageArrBuf], {type: 'image/jpeg'})
            const previewImageBlobUrl = URL.createObjectURL(previewImageBlob)
            med.previewImageBlobUrl = previewImageBlobUrl

            if (i%2 != 0) {
                med.isRotated = true
            }

            med.zIndex = 10 + i
        }
    }


    async function init() {

        const mediaList = await getCommonMedia(SubjectType.FeedPost, '', '9nxVj-dVlKZx7pXECG4Rh7Tk')

        if (mediaList) {
            list.value = mediaList
        }

        await makeList()

        // const needWatching = await fetchCommonMedia(SubjectType.Moment, mediaList)

        // if (needWatching) {   
        //     // setupObserver()
        // }

    }

    // async function setupObserver() {
    //     if (!mainStore.allowDbTransactions) { return }
        
    //     const observable = liveQuery (() => db.commonMedia.where('contentID').equals(props.contentID).and((commonMed) => {
    //         return commonMed.subjectID == props.subjectID && commonMed.type == props.type
    //     }).toArray())

    //     const subscription = observable.subscribe({
    //         next: async result => {
    //             if (!result) { return }
    //             if (result.length == 0) { return }
                
    //             listData.value = result

    //             await makeList()

    //         },
    //         error: error => console.error(error)
    //     })
    // }

    const animateCardIndex = ref(-1)

    function flip(index: number) {
        animateCardIndex.value = index
    
        setTimeout(function() {

            let zIndex = 10

            /* right side of index, inclusive */
            for (let i = index; i < list.value.length; i++) {
                const med = list.value[i]  

                med.zIndex = zIndex
                zIndex++
            }

            /* left side of index */
            for (let i = 0; i < index; i++) {
                const med = list.value[i]  

                med.zIndex = zIndex
                zIndex++
            }            
            
            
        }, 850)

        setTimeout(function() {
            animateCardIndex.value = -1
        }, 1000)

    }

</script>

<template>

    <div class='momentComponent'>

        <div class='momentContainer'>

            <div v-for="(item, index) in list" class='momentWrapper'>

                <div :class='["momentCard", {momentCardRotate: item.isRotated, momentCardAnimate: animateCardIndex == index}]'
                    :style='{ zIndex: item.zIndex }'
                    @click='flip(index)'>
                    <div :class='["moment"]' >
                        <!-- {{ item }} -->
                        <img v-if='item.previewImageBlobUrl' class="image" :src="item.previewImageBlobUrl"
                            alt="Post Image">
                    </div>
                </div>

            </div>
       
        </div>
        
    </div>

</template>

<style scoped>

    .momentComponent {
        position: relative;
        width: 100%;
        height: 100%;

        margin-top: 20px;
        margin-bottom: 20px;

        /* 
        flex: 0 0 v-bind(mediaBoxHeight + 'px'); 
        width: v-bind(mediaBoxWidth + 'px'); 
        */
        align-self: center;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        
    }

    .momentContainer {
        position: relative;
        
        flex: 0 0 320px; 
        height: 370px;

    }

    .momentCard {
        position: absolute;
        top: 0;
        right: 0;
        width: 320px;
        height: 370px;

        border-radius: 10px;

        padding-top: 10px;
        background-color: white;

        box-shadow: rgb(230, 230, 230) 0px 0px 7px;
        
        

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        z-index: 10;
    }

    .momentCardRotate {
        transform: rotate(-2deg);
    }

    .momentCardAnimate {
        animation : flipX 1s cubic-bezier(.73,0,.33,1);

    }    
    /* .moment:active {
        animation : flipY 1s cubic-bezier(.73,0,.33,1);
    } */

    .image {
        display: block; /* use block as images by default are inline and have an unsightly gap of 5px below it */
        width: 300px;
        height: 300px;
        border-radius: 10px;
        object-fit: cover;    
        -webkit-user-drag: none;
    }

    @media (prefers-color-scheme: dark) {
        .mediaBox {
            background-color: rgba(47, 46, 42, 1);
        }
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


    @keyframes flipX {
        0% {
            z-index: 20;
        }
        50% {
            transform: translateX(340px);
           
        }
        70% {
            z-index: 1;
        }
        /* 100% {
            z-index: 1;
            opacity: 1;
        } */

        /* 40% {
            transform: translate(120px, 0px, 120, 0);
           
        }
        60% {
            transform: translate(-60px, 0px, 180, 0);
           
        }
        80% {
            transform: translate(-60px, 0px, 120, 0);
           
        }               
        100% {
            transform: translate(60px, 0px, 60, 0);
            
        } */
    }

    @keyframes flipY {
        50% {
            transform: translateY(-20px);
            
        }
        /* 100% {
            z-index: 1;
        }         */
        /* 40% {
            transform: translate(120px, 0px, 120, 0);
           
        }
        60% {
            transform: translate(-60px, 0px, 180, 0);
           
        }
        80% {
            transform: translate(-60px, 0px, 120, 0);
           
        }               
        100% {
            transform: translate(60px, 0px, 60, 0);
            
        } */
    }

</style>
