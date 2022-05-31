<script setup lang="ts">
import { useMainStore } from '../../stores/mainStore'
import { useColorStore } from '../../stores/colorStore'

import { useI18n } from 'vue-i18n'

import { ref, computed } from 'vue'

const colorStore = useColorStore()
const mainStore = useMainStore()

const checkedSounds = ref(false)
const checkedDesktopAlerts = ref(false)

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const backgroundColor = computed(() => {
    return colorStore.mainBackground
})

const textColor = computed(() => {
    return colorStore.text
})



</script>

<template>
    <div class="content">
        <!-- sounds -->
        <div class="container">
            <div class="iconContainer">
                <input type="checkbox" id="sounds" v-model="mainStore.sounds">
            </div>
            <div class="textContainer" @click="">
                <div class="contentTextBody">
                    {{ t('notifications.sounds') }}
                </div>
            </div>
        </div>
        <!-- desktop alerts -->
        <div class="container">
            <div class="iconContainer">
                <input type="checkbox" id="desktopAlerts" v-model="mainStore.desktopAlerts">
            </div>
            <div class="textContainer" @click="">
                <div class="contentTextBody">
                    {{ t('notifications.desktopAlerts') }}
                </div>
            </div>
        </div>
    </div>
</template>

<style>
*::-webkit-scrollbar {
  width: 5px;
}

*::-webkit-scrollbar-track {
  background: white;        /* color of the tracking area */
}

*::-webkit-scrollbar-thumb {
  background-color: rgb(172, 169, 169);   /* color of the scroll thumb */
  
  border: 0px solid white;  /* creates padding around scroll thumb */
}

.content {
    background-color: v-bind(backgroundColor);
}

.container {
    display: flex;
    flex-direction: horizontal;
    padding: 0px;
    align-items: center;
}

</style>