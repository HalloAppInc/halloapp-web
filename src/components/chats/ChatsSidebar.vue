<script setup lang="ts">
import { ref } from 'vue'

import { useTimeformatter } from '../../composables/timeformatter'
import { useI18n } from 'vue-i18n'

import { useMainStore } from '../../stores/mainStore'

const { formatTime } = useTimeformatter()

const mainStore = useMainStore()

const { t, locale } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const listData = [
    { 
        title: "Thou with no name",
        subtitle: "this is a link",
        timestamp: "1649204213",
    },
    { 
        title: "Tree",
        subtitle: "apple",
        timestamp: "1649204213",
    },
    { 
        title: "Bob",
        subtitle: "this is a link",
        timestamp: "1649204213",
    },     
    { 
        title: "Jessy",
        subtitle: "this is a link",
        timestamp: "1649204213",
    },
    { 
        title: "Nathan",
        subtitle: "this is a link",
        timestamp: "1649204213",
    },
    { 
        title: "Kai",
        subtitle: "this is a link",
        timestamp: "1649204213",
    },
    { 
        title: "Rebecca",
        subtitle: "this is a link",
        timestamp: "1649204213",
    },     
    { 
        title: "Dylan",
        subtitle: "this is a link",
        timestamp: "1649204213",
    },          
]

const chatList = [
    { 
        title: "UserB",
        subtitle: "apple",
        timestamp: "1649204213",
        userID: 'X9l9StZ_IjuqFqGvBqa27',
    },
    {
        title: 'abcd123',
        subtitle: 'this is a link',
        timestamp: "1649204213",
        userID: 'i7tenqOTRKxvqknYdrihB',
    },
    {
        title: '?@#$%^&',
        subtitle: 'this is a link',
        timestamp: "1649204213",
        userID: 'BoXcNaWI5BAAuiPaPE9Of',
    },
    {
        title: '123_A',
        subtitle: 'this is a link',
        timestamp: "1649204213",
        userID: 'Zgd_82oo6kNmsIdLyqbB6',
    }

]

function openChat(userID: string) {
    mainStore.chatID = userID
    console.log('ChatSidebar/openChat/', mainStore.chatID)
}

</script>

<template>

<div class="wrapper">
    <div class="header"> 
        
    </div>
    <div class="listBox"> 
        <div v-for="value in chatList" class="container" @click='openChat(value.userID)'>
            <div class="avatarContainer">
                <div class="avatar"></div>
            </div>
            <div class="content">
                <div class="contentHeader">
                    <div class="contentTitle">
                        {{ value.title }}
                    </div>
                    <div class="contentTimestamp">
                        {{ formatTime(parseInt(value.timestamp), locale) }}
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

    border-right: 1px solid #b8b7b7;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    overflow: hidden;
}

.header {
    flex: 0 0 50px;
    background-color: #f0f2f5;
    padding: 10px;
}

.listBox {
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
