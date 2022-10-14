<script setup lang="ts">
    import { ref } from 'vue'
    import { storeToRefs } from 'pinia'
    import { liveQuery } from 'dexie'
    import { useI18n } from 'vue-i18n'

    import { useMainStore } from '@/stores/mainStore'
    import { db } from '@/db'
    import hal from '@/common/halogger'

    import { useHAAvatar } from '@/composables/haAvatar'

    const props = defineProps({
        groupID: {
            type: String,
            required: true
        },
        avatarID: {
            type: String,
            required: false
        },
        width: {
            type: Number,
            required: true
        }
    })

    const { t } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const mainStore = useMainStore()

    const { fetchGroupAvatar } = useHAAvatar()

    const avatarWidth = props.width.toString() + 'px'
    const avatarHeight = props.width.toString() + 'px'

    const avatarImageUrl = ref(mainStore.devCORSWorkaroundUrlPrefix + "https://web.halloapp.com/assets/groupAvatar.svg")

    init()

    async function init() {
        const avatarImgBlob = await fetchGroupAvatar(props.groupID)

        if (avatarImgBlob) {
            const avatarImgBlobUrl = URL.createObjectURL(avatarImgBlob)
            avatarImageUrl.value = avatarImgBlobUrl 
        }

        setupObserver()
    }

    async function setupObserver() {
        const observable = liveQuery (() => db.groupAvatar.where('groupID').equals(props.groupID).toArray())
        const subscription = observable.subscribe({
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

</script>

<template>

    <img class="groupAvatarImage" crossorigin="" :src="avatarImageUrl" alt="Group Avatar"/>

</template>

<style scoped>

    .groupAvatarImage {
        height: v-bind(avatarWidth); 
        width: v-bind(avatarHeight); 
        object-fit: cover;
        border-radius: 30%; 
        background-color: rgb(200, 192, 192);
    } 

</style>
