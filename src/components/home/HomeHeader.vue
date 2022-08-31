<script setup lang="ts">
import { ref, computed } from 'vue'

import { useMainStore } from '../../stores/mainStore'
import { useColorStore } from '../../stores/colorStore'
import { useI18n } from 'vue-i18n'

import Avatar from '../media/Avatar.vue'

const props = defineProps(['postID'])

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const colorStore = useColorStore()

const mainStore = useMainStore()

const hoverColor = computed(() => {
    return colorStore.hover
})

const lineColor = computed(() => {
    return colorStore.line
})

const textColor = computed(() => {
    return colorStore.text
})

const headerColor = computed(() => {
    return colorStore.header
})

const iconColor = computed(() => {
    return colorStore.icon
})

const backgroundColor = computed(() => {
    return colorStore.background
})
</script>

<template>

    <div class='header'>

        <div class='container'>
            
            <div class="avatarContainer">
                <Avatar :userID="mainStore.userID" :width="30"></Avatar>
            </div>

            <div class="titleContainer">
                {{ t('general.home') }}
                
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
}

.leftGutter {
    flex: 0 0 10px;
}

.rightGutter {
    flex: 0 0 10px;
}

.avatarContainer {
    flex: 0 0 55px;
    padding: 10px 0px 0px 0px;

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
