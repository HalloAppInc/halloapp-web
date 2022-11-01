<script setup lang="ts">
    import { ref } from 'vue'

</script>

<template>

    <div class='homeSidebarWrapper'>

        <div class='listBox'> 

        </div>
    </div>

</template>

<style scoped>
    .homeSidebarWrapper {
        height: 100%;

        background-color: rgb(243, 243, 240);

        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        overflow: hidden;
    }

    .listBox {
        overflow-y: auto;
        overflow-x: hidden;
        height: 100%;
    }

    *::-webkit-scrollbar {
    width: 5px;
    }

    *::-webkit-scrollbar-track {
    background: white;        /* color of the tracking area */
    }

    *::-webkit-scrollbar-thumb {
    background-color: rgb(172, 169, 169);    /* color of the scroll thumb */
    
    border: 0px solid white;  /* creates padding around scroll thumb */
    }

</style>
