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

    const { fetchAndModifyAvatar } = useHAAvatar()

    const { 
        secondaryBg: secondaryBgColor

    } = storeToRefs(colorStore)  


    const avatarWidth = props.width.toString() + 'px'
    const avatarHeight = props.width.toString() + 'px'

    const borderWidth = ref('0px')

    const avatarImageUrl = ref(mainStore.devCORSWorkaroundUrlPrefix + "https://web.halloapp.com/assets/avatar.svg")

    if (props.useBorder) {
        borderWidth.value = '2px'
    }

    setupObserver()

    async function setupObserver() {
        const observable = liveQuery (() => db.avatar.where('userID').equals(props.userID).first())
        const avatarSubscription = observable.subscribe({
            next: result => {
                if (!result) { return }
                if (!mainStore.allowDbTransactions) { return }

                if (result.arrBuf) { 
                    const blob = new Blob( [ result.arrBuf ], { type: 'image/jpeg' } )
                    const avatarImgBlobUrl = URL.createObjectURL(blob)
                    avatarImageUrl.value = avatarImgBlobUrl
                } else {
                    if (result.avatarID) {
                        fetchAndModifyAvatar(result.userID, result.avatarID)
                    }
                }

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

        border: 2px solid v-bind(secondaryBgColor);
        border-width: v-bind(borderWidth);
    } 

</style>
