<script setup lang="ts">
import { ref } from 'vue'

import { computed } from 'vue'

import { useMainStore } from '../stores/mainStore'

const mainStore = useMainStore()

const headerColor = ref(computed(() => {
    // if mode is auto, follow OS's color schema
    if (mainStore.preferColorScheme == 'auto-dark' || mainStore.preferColorScheme == 'auto-light'){
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return "black";
        }
        else {
            return "#f0f2f5";
        }
    }
    // change color manually
    else if (mainStore.preferColorScheme == 'dark'){
        return "black";
    }
    else if (mainStore.preferColorScheme == 'light'){
        return "#f0f2f5";
    }
}))

// listen to the color scheme of the browser
window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', event => {
    if (mainStore.preferColorScheme == 'auto-dark' || mainStore.preferColorScheme == 'auto-light') {
        if (event.matches) {
            mainStore.preferColorScheme = "auto-dark";
        } else {
            mainStore.preferColorScheme = "auto-light";
        }
    }     
})


const listData = [
    { 
        title: "Thou with no name",
        subtitle: "this is a link",
        timestamp: "now",
    },
    { 
        title: "Tree",
        subtitle: "apple",
        timestamp: "now",
    },
    { 
        title: "Bob",
        subtitle: "this is a link",
        timestamp: "now",
    },     
    { 
        title: "Jessy",
        subtitle: "this is a link",
        timestamp: "now",
    },
    { 
        title: "Nathan",
        subtitle: "this is a link",
        timestamp: "now",
    },
    { 
        title: "Kai",
        subtitle: "this is a link",
        timestamp: "now",
    },
    { 
        title: "Rebecca",
        subtitle: "this is a link",
        timestamp: "now",
    },     
    { 
        title: "Dylan",
        subtitle: "this is a link",
        timestamp: "now",
    },          
]


</script>

<template>

<div class="wrapper">
    <div id="header">

    </div>
    <div id="listBox"> 
        <div v-for="value in listData" class="container">
            <div class="avatarContainer">
                <div class="avatar"></div>
            </div>
            <div class="content">
                <div class="contentHeader">
                    <div class="contentTitle">
                        {{ value.title }}
                    </div>
                    <div class="contentTimestamp">
                        {{ value.timestamp }}
                    </div>
                </div>
                <div class="contentBody">
                    {{ value.subtitle }}
                </div>
            </div>
            
        </div>
    </div>
</div>

</template>

<style scoped>


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

.wrapper {

    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    overflow: hidden;
}

#header {
    flex: 0 0 50px;
    background-color: v-bind(headerColor);
    padding: 10px;
}

#listBox {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
}

.container {
    

    display: flex;
    flex-direction: horizontal;
    padding: 0px;
    
 

}
.container:hover {
    background-color: rgb(226, 226, 226);
    cursor: pointer;
}
.avatarContainer {
    flex: 0 0 70px;
    padding: 10px 0px 10px 10px;
}
.avatar {
    width: 50px;
    height: 50px;
 
    background-color: lightgray;
    border-radius: 50%;
}
.content {
    margin-top: 5px;
    width: 100%;
    padding: 10px 10px 10px 5px;
    border-bottom: 1px solid rgb(226, 224, 224);

    color: #3b4a54;

    display: flex;
    width: 100%;
    flex-direction: column;

    user-select: none;

    overflow: hidden;
}

.contentHeader {
    padding-bottom: 3px;
    display: flex;
    
    justify-content: flex-start;
}

.contentTitle {
    color: #111b21;
    font-weight: 600; 

    flex: 1 1 auto;

    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap; 

    user-select: none;

    overflow: hidden;
}

.contentTimestamp {
    flex: 0 0 auto;
    color: gray;

    user-select: none;
}
</style>
