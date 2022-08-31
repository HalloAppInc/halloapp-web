<script setup lang="ts">
import { ref, computed } from 'vue'

import { useColorStore } from '../../stores/colorStore'

import { useMainStore } from '../../stores/mainStore'

import { useI18n } from 'vue-i18n'

import Avatar from '../media/Avatar.vue'

const props = defineProps(['title'])

const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const colorStore = useColorStore()

const mainStore = useMainStore()

const hoverColor = computed(() => {
    return colorStore.hover
})

const iconColor = computed(() => {
    return colorStore.icon
})


</script>

<template>

    <div class='groupHeader'>

        <div class='container'>
           
            <div v-if="!mainStore.showSidebar" class='iconContainer' @click="$emit('toggleSidebar')">
                <div class='iconShadow'>
                    <font-awesome-icon :icon="['fas', 'angle-left']" style="font-size: 25px;"/>
                </div>
            </div>
           
            <!-- <div class="avatarContainer">
                <Avatar :userID="111" :width="30"></Avatar>
            </div>            -->

            <div class='titleContainer'>
                {{ mainStore.groupsPageGroup.title }}
            </div>

        </div>
    </div>

</template>

<style scoped>

.groupHeader {
    position: sticky;
    top: 0px;
    width: 100%;
    height: 50px;
    background-color: rgb(243, 243, 240);
    z-index: 2;
}

.container {
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

}

.leftGutter {
    flex: 0 0 10px;
}

.rightGutter {
    flex: 0 0 10px;
}

.iconContainer {
    flex: 0 0 50px;
    
    color: v-bind(iconColor);

    display: flex;
    justify-content: center;
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

.avatarContainer {
    padding-top: 5px;
    padding-left: 15px;
    flex: 0 0 65px;
}

.avatar {

    background-color: lightgray;
    border-radius: 50%;
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
