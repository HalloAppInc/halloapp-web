<script setup lang='ts'>
    import { Ref, ref } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useI18n } from 'vue-i18n'
    import { liveQuery } from 'dexie'

    import { db } from '@/db'
    import { useMainStore } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'
    
    import Avatar from '@/components/media/Avatar.vue'
    import hal from '@/common/halogger'

    import { web } from '@/proto/web.js'

    import { useHAFeed } from '@/composables/haFeed'
    import { useHACommonMedia } from '@/composables/haCommonMedia'

    import { useTimeformatter } from '@/composables/timeformatter'

    const mainStore = useMainStore()
    const colorStore = useColorStore()

    const { updateReceipt, modifyPostToSeen } = useHAFeed()
    const { formatTimeDayOnly } = useTimeformatter()

    const { 
        fetchMomentMedia
    } = useHACommonMedia()

    const { 
        background: backgroundColor,
        primaryBlue: primaryBlueColor,
        secondaryBg: secondaryBgColor,
        text: textColor,
    } = storeToRefs(colorStore)  

    const { t, locale } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    interface Props {
        postID: string,
        cardWidth: number
    }

    const props = defineProps<Props>()

    const mediaBoxWidth     = ref(props.cardWidth)
    const mediaBoxHeight    = ref(props.cardWidth)

    const postData: Ref<any> = ref()
    const mediaList: Ref<any[]> = ref([])

    const showImage = ref(false)

    const userReceipts: Ref<web.ReceiptInfo[]> = ref([])

    const avatarSelfieBlobUrl: Ref<any> = ref()

    function setMediaSizes(postAlbum: any) {

        const defaultRatio = 1 // square

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

    function convertArrBufToBlobUrl(arrBuf: ArrayBuffer) {
        const blob = new Blob([arrBuf], {type: 'image/jpeg'})
        const blobUrl = URL.createObjectURL(blob)
        return blobUrl
    }

    async function processMoment() {
        const post = postData.value
        const postID = post.postID
        const moment = post.moment

        const media = await fetchMomentMedia(postID, moment.image, moment.selfieImage, moment.blurredImage, moment.blurredSelfieImage)

        if (!avatarSelfieBlobUrl.value && media.selfieArrBuf) {
            avatarSelfieBlobUrl.value = convertArrBufToBlobUrl(media.selfieArrBuf)
        }

        let img = moment.blurredImage
        let selfieImg = moment.blurredSelfieImage

        let useUnlockedImages = false
        if (post.seenState == web.PostDisplayInfo.SeenState.SEEN && !mainStore.isMomentsLocked) {
            useUnlockedImages = true
        }

        if (useUnlockedImages) {
            img = moment.image
            selfieImg = moment.selfieImage
        
            if (img && media.imageArrBuf) {
                img.previewImageBlobUrl = convertArrBufToBlobUrl(media.imageArrBuf)
            }
            if (selfieImg && media.selfieArrBuf) {
                selfieImg.previewImageBlobUrl = convertArrBufToBlobUrl(media.selfieArrBuf)
            }     
        } else {
            if (img && media.blurredImageArrBuf) {
                img.previewImageBlobUrl = convertArrBufToBlobUrl(media.blurredImageArrBuf)
            }
            if (selfieImg && media.blurredSelfieArrBuf) {
                selfieImg.previewImageBlobUrl = convertArrBufToBlobUrl(media.blurredSelfieArrBuf)
            }    
        }
   
        mediaList.value.splice(0, mediaList.value.length) // clear array

        if (img) {
            mediaList.value.push(img)
        }

        if (selfieImg) {
            if (moment.selfieLeading) {
                mediaList.value.unshift(selfieImg)
            } else {
                mediaList.value.push(selfieImg)
            }
        }

        setMediaSizes(mediaList.value)

        /* showImage and timeout used as a quick attempt to show both images at once */
        let delay = 50

        if (mediaList.value.length > 1) {
            delay = 100
        }

        setTimeout(function() {
            showImage.value = true 
        }, delay)
        

        /* user receipts */
        if (post.userReceipts) {
            userReceipts.value = post.userReceipts.slice(0, 3)
        }

    }

    setupObserver()

    async function setupObserver() {
        if (!mainStore.allowDbTransactions) { return }
        
        const observable = liveQuery (() => db.post.where('postID').equals(props.postID).and((post) => {
            return true
        }).first())

        const subscription = observable.subscribe({
            next: async result => {
                if (!result) { return }
                
                postData.value = result

                await processMoment()

            },
            error: error => console.error(error)
        })
    }

    function splitLocation(location: string) {
        return location.replace(/,/g, ',<br>') 
    }

    function clickOpenMoment() {
        if (mainStore.isMomentsLocked) { return }
        if (postData.value.seenState == web.PostDisplayInfo.SeenState.SEEN) { return }
      
        modifyPostToSeen(postData.value.postID)

        const timestamp = Math.round(Date.now() / 1000)
        updateReceipt(postData.value.postID, mainStore.userID, timestamp, function() {})
    }

</script>

<template>

    <div v-if='postData' class='momentCardComponent'>
        <div v-if='mainStore.isMomentsLocked || postData.seenState != web.PostDisplayInfo.SeenState.SEEN' class='lockedInfo'>
           
            <div v-if='avatarSelfieBlobUrl'>
                <img class="avatarSelfie" crossorigin="" :src="avatarSelfieBlobUrl" alt="Avatar"/>
            </div>
            <Avatar v-else :userID='postData.userID' :width='100'></Avatar>
            <div class='momentText'>
                {{ mainStore.pushnames[postData.userID] }}'s Moment
            </div>
            <div v-if='!mainStore.isMomentsLocked' class='viewButton' @click='clickOpenMoment()'>
                View
            </div>
            <div v-if='mainStore.isMomentsLocked' class='shareMomentText'>
                To see their Moment, share your own from your mobile device
            </div>
        </div>

        <div v-else class='avatar'>
            <Avatar :userID='postData.userID' :width='40'></Avatar>
        </div>

        <div class='mediaContainer'>
            <div v-for="(item, index) in mediaList">
                <img v-if='showImage && item.previewImageBlobUrl' 
                    :class='["image", {imageBlur: postData.seenState != web.PostDisplayInfo.SeenState.SEEN || mainStore.isMomentsLocked}]' :src="item.previewImageBlobUrl" :width="item.adjustedWidth" :height="item.adjustedHeight"
                    alt='Image'>
            </div>
        </div>
        
        <div v-if='postData.userID == mainStore.userID' class='userReceiptsBox'>
            <div v-for='(value, idx) in userReceipts'  
                class="userReceiptsAvatar" :style="{ 'z-index': (idx*-1 + 100) }">
        
                <Avatar :style="{ 'margin-right': '-8px' }"
                    :userID="(value.uid as number)" :width='25' :useBorder=true>
                </Avatar>
            </div>
        </div>
        <div v-else-if='postData.moment.location' class='timeLocation' v-html='splitLocation(postData.moment.location)'>
        </div>
        <div v-else class='timeLocation'>
            {{ formatTimeDayOnly(postData.timestamp, locale as string)}}
        </div>
    
    </div>

</template>

<style scoped>

    .momentCardComponent {
        position: relative;
        width: 100%;
        height: 100%;

        /* 
        flex: 0 0 v-bind(mediaBoxHeight + 'px'); 
        width: v-bind(mediaBoxWidth + 'px'); 
        */
        
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        overflow: hidden;
    }

    .avatarSelfie {
        height: 100px; 
        width: 100px; 
        object-fit: cover; 
        border-radius: 50%; 
        background-color: rgb(0, 0, 0, 0);
    } 


    .avatar {
        position: absolute;
        top: 10px;
        left: 20px;
        z-index: 1;
    }    

    .lockedInfo {
        position: absolute;
        top: 30px;
        width: 100%;
        
        z-index: 1;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        color: white;
    }

    .lockedInfo .momentText {
        margin-top: 20px;
    }
    .lockedInfo .viewButton {
        margin-top: 20px;
        padding: 5px 15px 5px 15px;
        border-radius: 30px;
        background-color: v-bind(primaryBlueColor);

        cursor: pointer;
        user-select: none;
    }

    .lockedInfo .viewButton:hover {

        background-color: black;

    }    

    .lockedInfo .shareMomentText {
        margin-top: 20px;
        padding-left: 20px;
        padding-right: 20px;
        font-size: 14px;
        text-align: center;
    }

    .mediaContainer {
        border-radius: 4px;

        height: v-bind(cardWidth + 'px');
        
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;

            
        overflow: hidden;        

    }
    .image {
        display: block; /* use block as images by default are inline and have an unsightly gap of 5px below it */

        object-fit: cover;    
        -webkit-user-drag: none;
    }

    .imageBlur {
        filter: blur(30px);
    }

    .userReceiptsBox {
        align-self: flex-end;
        margin-top: 10px;
        margin-right: 25px;

        display: flex;
        flex-direction: horizontal;
        justify-content: center;
        align-items: center;
    }

    .timeLocation {
        align-self: flex-end;
        margin-top: 10px;
        margin-right: 20px;
        margin-left: 15px;

        text-align: right;

        font-family: "Bradley Hand", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
        font-size: 20px;
        font-weight: 400;

    }


</style>
