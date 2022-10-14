<script setup lang="ts">
    import { PropType, Ref, ref, toRef } from "vue"
    import { storeToRefs } from 'pinia'
    import { liveQuery } from "dexie"
    import { useI18n } from 'vue-i18n'

    import hal from "@/common/halogger"

    import { useMainStore } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'

    import { LinkPreview } from '@/db'

    const props = defineProps({
        post: {
            type: Object,
            required: false
        },              
        linkPreview: {
            type: Object,
            required: false
        },        
        postID: {
            type: String,
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

    const mainStore = useMainStore()
    const colorStore = useColorStore()

    const { t } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const { 
        background: backgroundColor,
        secondaryBg: secondaryBgColor,
    } = storeToRefs(colorStore)  

    const previewImageSrc   = toRef(props, 'previewImageSrc')
    const mediaBoxWidth     = toRef(props, 'mediaBoxWidth')
    const mediaBoxHeight    = toRef(props, 'mediaBoxHeight')

    const previewUrl = props.linkPreview?.url
    const url = new URL(previewUrl)
    const host = url.host
    const pathname = url.pathname
    
    const previewHeight = ref(mediaBoxWidth.value*0.60)
    const imageWidth = ref(previewHeight.value*0.70)
    const imageHeight = ref(previewHeight.value*0.70)

    const width = props.linkPreview?.preview?.width
    const height = props.linkPreview?.preview?.height

    const showLargeImage = ref(false)

    // if (pathname.length > 1) {
    //     showLargeImage.value = false
    // }

    if (width > height) {
        showLargeImage.value = true
    }    

    if (showLargeImage.value) {
        imageWidth.value = mediaBoxWidth.value + 10 // + 10 to account for padding
    }

</script>

<template>

    <a :href="props.linkPreview?.url" target="_blank" style="text-decoration: none;">
        <div :class="['linkPreviewContainer']">

            <div :class="['mainRow']">
                <img :class="['previewImage']" :src="previewImageSrc" alt="Link Preview">

                <div v-if="!showLargeImage" :class="['textColumn']">
                    <div :class="['title']">
                        {{ props.linkPreview?.title }}
                    </div>
                    <div :class="['body']">
                        {{ props.linkPreview?.description}}
                    </div>
                </div>
            </div>

            <div :class="['descriptionRow']">
                <div v-if="showLargeImage" :class="['title']">
                    {{ props.linkPreview?.title }}
                </div>                
                <div :class="['url']">
                    {{ host }}
                </div>
            </div>

        </div>
    </a>

</template>

<style scoped>

    a {
        text-decoration: none;  
    }

    .linkPreviewContainer {
        position: relative;

        border-radius: 15px;
        border: 1px solid rgb(226, 226, 226, 0.5);
        overflow: hidden;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
    }

    .mainRow {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;        
    }
    .mainRow .previewImage {
        width: v-bind(imageWidth + 'px');
        height: v-bind(imageHeight + 'px');
        object-fit: cover;
    }
    .mainRow .textColumn {
        height: v-bind(imageHeight + 'px');
        padding: 20px 10px 20px 15px;
        background-color: rgb(226, 226, 226);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;  
    }
    .mainRow .textColumn .title {
        font-size: 12px;
        line-height: 16px;
        font-weight: bold;
        color: #111b21;        

        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }    
    .mainRow .textColumn .body {
        margin-top: 5px;
        font-size: 10px;
        line-height: 14px;
        color: rgb(119, 113, 113);

        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;       
    }        

    .descriptionRow {
        width: 100%;
        padding: 10px 10px 10px 15px;
        background-color: rgb(241, 240, 240);
        font-size: 11px;
        color: rgb(130, 125, 125);

        display: flex;
        flex-direction: column;
        justify-content: center; 
        align-items: flex-start;
    }

    .descriptionRow .title {

        font-size: 12px;
        line-height: 16px;
        font-weight: bold;
        color: #111b21;   

        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;

    }

    .descriptionRow .url {
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }
   

</style>
