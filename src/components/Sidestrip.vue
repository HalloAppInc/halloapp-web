<script setup lang="ts">
import { ref } from 'vue'
</script>

<template>

sidestrip

</template>

<style scoped>

:root {
    --max-small-screen-height: 350px;
    --max-small-screen-landscape-height: 325px; /* 325 to target small screens (ie. mobile safari iphone se landscape mode) */
}

.row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px 5px;
}

.column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px 10px;
}

/* head row */
#head {
    margin: 30px 0px 25px 0px;
    height: 20px;
}
@media screen and (max-height: var(--max-small-screen-height)) {
    #head {
        margin: 10px 0px 25px 0px;
    }
}  

/* postHeader row */
#postHeader {
    margin-top: auto;
    max-width: 340px;

    display: flex;
    font-size: 16px;
    text-align: center;
}

/* post row */
#post {
    margin: 25px 0px 25px 0px;
    flex: 0 0 130px;

    display: flex;

    border-radius: 15px;
    border: 0.3px solid rgb(0, 0, 0, 0.25);
    background: white;
    width: 350px;
    max-height: 130px;
}
@media screen and (max-height: var(--max-small-screen-height)) {
    #post {
        margin: 15px 0px 10px 0px;
    }
}
#postMediaContainer {
    border-radius: 15px 0px 0px 15px;
    background: #ECECE7;
    overflow: hidden;
    transform: translate(Z);
    -webkit-transform: translateZ(0); /* mobile safari video: rounded corners */

    flex: 0 0 130px;

    display: flex;
    align-items: center;
    justify-content: center;
}
#postImage {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
#postVideo {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
#videoLength {
  position: absolute;
    right: 5px;
    bottom: 5px;
    color: white;
}
#previewImage {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
#avatarImage {
    height: 70%; 
    width: 70%; 
    object-fit: contain; 
    border-radius: 50%; 
    border: 0.3px solid rgb(0, 0, 0, 0.25);
}  
#postBody {
    padding: 15px;

    overflow: hidden;
}
#postBodyTitle {
    font-size: 16px;
    font-weight: 500;

    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal; 
}
#postBodyContent {
    margin: 5px 0px 0px 0px;
    opacity: 50%;
    font-size: 14px;
    font-weight: 400;

    line-height: 18px;

    overflow: hidden;
    text-overflow: ellipsis;

    display: -webkit-box !important;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    white-space: normal; 
}

/* postFooter row */
#postFooter {
    margin: 0px 0px 25px 0px;

    font-size: 16px;
    font-weight: 500;
    line-height: 22px
}
@media screen and (max-height: var(--max-small-screen-landscape-height)) {
    #postFooter {
        margin: 0px 0px 5px 0px;
    }
} 
#postFooterIcons {
    display: flex;
    flex-direction: row;
    gap: 0px 20px;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
}

/* footer row */
#footer {
    margin: auto 15px 10px 15px;

    max-width: 350px;
    text-align: center;
    line-height: 17px;
    font-size: 14px;
    font-weight: 400;
    opacity: 0.40;
}
</style>
