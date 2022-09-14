<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useMainStore } from '@/stores/mainStore'
import { useColorStore } from '@/stores/colorStore'

import Avatar from '@/components/media/Avatar.vue'

const props = defineProps(['postID'])

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const mainStore = useMainStore()
const colorStore = useColorStore()

const { 
        background: backgroundColor,
        secondaryBg: secondaryBgColor,
        primaryBlue: primaryBlueColor,
        text: textColor,
    } = storeToRefs(colorStore)  


const hoverColor = computed(() => {
    return colorStore.hover
})

const lineColor = computed(() => {
    return colorStore.line
})

const headerColor = computed(() => {
    return colorStore.header
})

const iconColor = computed(() => {
    return colorStore.icon
})

</script>

<template>

    <div class='header'>

        <div class='container'>
            
            <div class="avatarContainer">
                <Avatar :userID="mainStore.userID" :width="30"></Avatar>
            </div>

            <div class="titleContainer">
                {{ t('general.groups') }}
                
            </div>

            <!-- for now, empty element only used to space things evenly -->
            <div class="avatarContainer">
            </div>

        </div>
    </div>

</template>

<style scoped>

.header {
    overflow-y: auto;
    overflow-x: hidden;
    
    height: 100%;

    background-color: rgb(243, 243, 240);
    
}

.container {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: v-bind(secondaryBgColor);
}

.leftGutter {
    flex: 0 0 10px;
}

.rightGutter {
    flex: 0 0 10px;
}

.avatarContainer {
    flex: 0 0 55px;
    padding: 0px 0px 0px 0px;

    display: flex;
    flex-direction: row;
    justify-content: center;
}

.iconContainer {
    padding: 5px 0px 5px 0px;
    color: v-bind(iconColor);
}

.iconContainer:hover {
    cursor: pointer;
}

.iconShadow {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 50%;
}

.iconShadow:hover {
    background-color: v-bind(hoverColor);
}

.titleContainer {
    font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
    font-size: 14px;

    color: v-bind(iconColor);

    display: flex;
    justify-content: center;
    align-items: center;
}

.verticalLine {
    border-right: 1px solid rgb(200, 200, 200);
    height: 30px;
    margin: 10px 30px;
}

</style>
