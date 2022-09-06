<script setup lang="ts">
import { ref, toRef } from "vue"

import hal from "../../common/halogger"

import { useMainStore } from '../../stores/mainStore'
import { db } from '../../db'
import { useI18n } from 'vue-i18n'

import { useHAAvatar } from '../../composables/haAvatar'
import { storeToRefs } from 'pinia'
import { liveQuery } from "dexie"

const mainStore = useMainStore()

const { getAvatar } = useHAAvatar()


const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const props = defineProps({
    userID: {
        type: Number,
        required: true
    },
    avatarID: {
        type: String,
        required: false
    },
    width: {
        type: Number,
        required: true
    },
    from: {
        type: String,
        required: false
    }
})


setupObserver()

async function setupObserver() {

    const feedObservable = liveQuery (() => db.avatar.where('userID').equals(props.userID)
        .toArray()
    )

    const subscription = feedObservable.subscribe({
        next: result => { 
            if (result && result.length > 0) {
                if (result[0].image) {
                    if (result[0].image.size > 0) {
                        const avatarImgBlobUrl = URL.createObjectURL(result[0].image)
                        avatarImageUrl.value = avatarImgBlobUrl 
                    }

                }
            }

        },
        error: error => console.error(error)
    })

}




const avatarWidth = props.width.toString() + 'px'
const avatarHeight = props.width.toString() + 'px'

let localAvatarID: string = ''
let avatarPath: string = ''

if (props.userID == 111) {
    localAvatarID = 'Hvhqsmhx-uKSX2oAEYpKe5xK'
    avatarPath = 'Hvhqsmhx-uKSX2oAEYpKe5xK'
}

const avatarImageUrl = ref(mainStore.devCORSWorkaroundUrlPrefix + "https://web.halloapp.com/assets/avatar.svg")
// const avatarImageUrl = ref(mainStore.devCORSWorkaroundUrlPrefix + "https://avatar-cdn.halloapp.net/" + avatarPath)

init()

async function init() {
    const avatarImgBlob = await getAvatar(props.userID)

    if (avatarImgBlob) {
        const avatarImgBlobUrl = URL.createObjectURL(avatarImgBlob)
        avatarImageUrl.value = avatarImgBlobUrl 
    }
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
