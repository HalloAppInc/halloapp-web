<script setup lang="ts">
import { computed } from 'vue'

import { useI18n } from 'vue-i18n'

import popup from './Popup.vue'
import mainMenu from './Main.vue'
import helpMenu from './help.vue'
import notificationsMenu from './Notifications.vue'
import privacyMenu from './Privacy.vue'
import securityMenu from './Security.vue'

import { useColorStore } from '../../stores/colorStore'

const colorStore = useColorStore()

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const backgroundColor = computed(() => {
    return colorStore.background
})

</script>


<template>
    <div class="wrapper">
        <mainMenu />
        <privacyMenu />
        <notificationsMenu />
        <helpMenu />
        <securityMenu />

        <popup />
    </div>
</template>

<style scoped>
*::-webkit-scrollbar {
    width: 5px;
}

*::-webkit-scrollbar-track {
    background: white;
    /* color of the tracking area */
}

*::-webkit-scrollbar-thumb {
    background-color: rgb(172, 169, 169);
    /* color of the scroll thumb */

    border: 0px solid white;
    /* creates padding around scroll thumb */
}

.wrapper {
    background-color: v-bind(backgroundColor);

    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    overflow: hidden;
}
</style>