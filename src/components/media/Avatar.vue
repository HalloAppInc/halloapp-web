<script setup lang="ts">
import { ref, toRef } from "vue"

import hal from "../../common/halogger"

import { useMainStore } from '../../stores/mainStore'
import { db } from '../../db'
import { useI18n } from 'vue-i18n'

const mainStore = useMainStore()

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const props = defineProps({
    userID: {
        type: String,
        required: true
    },
    avatarID: {
        type: String,
        required: false
    },
    width: {
        type: String,
        required: true
    },    
})

const avatarWidth = props.width
const avatarHeight = props.width

let localAvatarID: string = ''
let avatarPath: string = ''

if (props.userID == 'TonyTemp') {
    localAvatarID = 'Hvhqsmhx-uKSX2oAEYpKe5xK'
    avatarPath = 'Hvhqsmhx-uKSX2oAEYpKe5xK'
}

let avatarDefaultImageUrl = ref(mainStore.devCORSWorkaroundUrlPrefix + "https://web.halloapp.com/assets/avatar.svg")
let avatarImageUrl = ref(mainStore.devCORSWorkaroundUrlPrefix + "https://avatar-cdn.halloapp.net/" + avatarPath)

if (!avatarPath || avatarPath == '') {
    avatarImageUrl = avatarDefaultImageUrl
}

getAvatar()

async function getAvatar() {
	const avatarArr = await db.avatar.where('userID').equals(avatarPath).toArray()
    let avatarImgBlob: Blob

    if (avatarArr.length > 0 && avatarArr[0].image) {
        avatarImgBlob = new Blob( [ avatarArr[0].image ], { type: 'image/jpeg' } )
    } else {
        hal.log('Avatar/db/not found: ' + avatarPath)

        const request = new Request(avatarImageUrl.value)
        const response = await fetch(request)
        avatarImgBlob = await response.blob()

        const avatarImgBuf = await avatarImgBlob.arrayBuffer()
        try {
            const id = await db.avatar.put({
                userID: props.userID,
                avatarID: localAvatarID,
                image: avatarImgBuf,
            })
        } catch (error) {
            hal.log('Avatar/db/put/error ' + error)
        }
    }

    const avatarImgBlobUrl = URL.createObjectURL(avatarImgBlob)
    avatarImageUrl.value = avatarImgBlobUrl 
}

</script>

<template>

<img class="avatarImage" crossorigin="" :src="avatarImageUrl" alt="Avatar"/>

</template>

<style scoped>

.avatarImage {
    height: v-bind(avatarWidth); 
    width: v-bind(avatarHeight); 
    object-fit: contain; 
    border-radius: 50%; 
    background-color: gray;
} 

</style>
