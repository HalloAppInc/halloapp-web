<script setup lang="ts">
import { ref, toRefs } from 'vue'

import { useMainStore } from '../stores/mainStore'

import commonColors from "../common/colors"

const mainStore = useMainStore()

const primaryBlue = commonColors.primaryBlue


</script>

<template>

<div id="wrapper">
    <div class="sideIcon" @click="mainStore.logout()">
        <div>
            <font-awesome-icon :icon="['fas', 'power-off']" />
        </div>
        <div>
            Exit
        </div>
    </div>
</div>

</template>

<style scoped>

#wrapper {
    width: 100%;
    height: 100%;
    color: white;

    padding-bottom: 30px;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
}

.sideIcon {

    color: white;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
}

.sideIcon:hover {
    color: v-bind(primaryBlue);
    cursor: pointer;
}


</style>
