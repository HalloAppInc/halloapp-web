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

    const { fetchAndModifyGroupAvatar } = useHAAvatar()

    const avatarWidth = props.width.toString() + 'px'
    const avatarHeight = props.width.toString() + 'px'

    const avatarImageUrl = ref(mainStore.devCORSWorkaroundUrlPrefix + "https://web.halloapp.com/assets/groupAvatar.svg")


    setupObserver()


    async function setupObserver() {
        if (!mainStore.allowDbTransactions) { return }
        const observable = liveQuery (() => db.groupAvatar.where('groupID').equals(props.groupID).first())
        const subscription = observable.subscribe({
            next: result => {
                if (!mainStore.allowDbTransactions) { return }
                if (!result) { return }

                if (result.arrBuf) { 
                    const blob = new Blob( [ result.arrBuf ], { type: 'image/jpeg' } )
                    const avatarImgBlobUrl = URL.createObjectURL(blob)
                    avatarImageUrl.value = avatarImgBlobUrl
                } else {
                    if (result.avatarID) {
                        fetchAndModifyGroupAvatar(result.groupID, result.avatarID)
                    }
                }
                
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
