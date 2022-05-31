<script setup lang="ts">

import { useColorStore } from '../../stores/colorStore'

import { computed } from '@vue/reactivity';

import { ref } from 'vue'

const colorStore = useColorStore()

const contentBackgroundColor = computed(() => {
    return  colorStore.homeMainBackground
})

</script>

<template>

<div id="wrapper">

    <div id="header">  
    </div>

    <div id="content">
        
    </div>

</div>

</template>

<style scoped>

#wrapper {
    width: 100%;
    height: 100%;

    border-left: 1px solid #b8b7b7;

    background-color: rgb(229, 229, 247);

    background-image: repeating-radial-gradient( circle at 0 0, transparent 0, #e5e5f7 10px ), repeating-linear-gradient( rgba(242, 193, 139, 0.33), rgb(242, 193, 139, 0.4) );

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

#header {
    flex: 0 0 50px;
    background-color: #f0f2f5;
    padding: 10px;
}

#content {
    flex: 1 1 auto;
    background-color: v-bind(contentBackgroundColor);
}

</style>
