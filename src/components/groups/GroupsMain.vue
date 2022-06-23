<script setup lang="ts">

import { useMainStore } from '../../stores/mainStore'


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
}

</style>
