<script setup lang="ts">
    import { ref } from 'vue'
    import { storeToRefs } from 'pinia'
    import { liveQuery } from 'dexie'
    import { useI18n } from 'vue-i18n'

    import { useMainStore } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'

    import { db } from '@/db'
    import hal from '@/common/halogger'

    import { useHAAvatar } from '@/composables/haAvatar'
    
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
        useBorder: {
            type: Boolean,
            required: false
        }
    })

    const { t } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })
    
    const mainStore = useMainStore()
    const colorStore = useColorStore()

    const { getAvatar } = useHAAvatar()

    const { 

        primaryWhiteBlack: primaryWhiteBlackColor,

    } = storeToRefs(colorStore)  


    const avatarWidth = props.width.toString() + 'px'
    const avatarHeight = props.width.toString() + 'px'

    const borderWidth = ref('0px')

    const avatarImageUrl = ref(mainStore.devCORSWorkaroundUrlPrefix + "https://web.halloapp.com/assets/avatar.svg")

    if (props.useBorder) {
        borderWidth.value = '2px'
    }

    init()

    async function init() {
        const avatarImgBlob = await getAvatar(props.userID)

        if (avatarImgBlob) {
            const avatarImgBlobUrl = URL.createObjectURL(avatarImgBlob)
            avatarImageUrl.value = avatarImgBlobUrl 
        }

        setupObserver()
    }

    async function setupObserver() {
        const observable = liveQuery (() => db.avatar.where('userID').equals(props.userID).toArray())
        const avatarSubscription = observable.subscribe({
            next: result => {
                if (!result) { return }
                if (result.length == 0) { return }
                if (!result[0].image) { return }
                if (result[0].image.size == 0) { return }

                const avatarImgBlobUrl = URL.createObjectURL(result[0].image)
                if (!avatarImgBlobUrl) { return }
                avatarImageUrl.value = avatarImgBlobUrl
            },
            error: error => console.error(error)
        })
    }

    async function open() {
        if (mainStore.userID == props.userID) {
            mainStore.toggleSettings()
        }
    }

</script>

<template>

    <img class="avatarImage" crossorigin="" :src="avatarImageUrl" alt="Avatar" @click="open()"/>

</template>

<style scoped>

    .avatarImage {
        height: v-bind(avatarWidth); 
        width: v-bind(avatarHeight); 
        object-fit: contain; 
        border-radius: 50%; 
        background-color: rgb(0, 0, 0, 0);

        border: 2px solid v-bind(primaryWhiteBlackColor);
        border-width: v-bind(borderWidth);
    } 

</style>
