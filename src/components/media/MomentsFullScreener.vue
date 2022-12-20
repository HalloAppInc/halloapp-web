<script setup lang="ts">
    import { Ref, ref, toRef, toRefs, computed, onMounted, onUnmounted, watch } from 'vue'
    import { storeToRefs } from 'pinia'
    import { liveQuery } from 'dexie'
    import { useI18n } from 'vue-i18n'

    import { useMainStore } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'

    import { db, CommonMedia, SubjectType, MediaType } from '@/db'

    import Avatar from '@/components/media/Avatar.vue'
    import { useHAMediaResize } from '@/composables/haMediaResize'
    import { useHACommonMedia } from '@/composables/haCommonMedia'
    import MomentCard from '@/components/moment/MomentCard.vue'
    
    import { useTimeformatter } from '@/composables/timeformatter'

    const mainStore = useMainStore()
    const colorStore = useColorStore()

    const { formatTime } = useTimeformatter()
    const { t, locale } = useI18n({ inheritLocale: true, useScope: 'global' })

    const props = defineProps(['type', 'subjectID', 'contentID', 'showFullScreener', 
        'selectedMediaIndex', 'selectMediaList',
        'animateCardIndex', 'animateRight'
    ])

    const selectMediaIdx = toRef(props, 'selectedMediaIndex')
    const animateCardIndex = toRef(props, 'animateCardIndex')
    const animateRight = toRef(props, 'animateRight')
    
    const { 
        primaryWhiteBlack: primaryWhiteBlackColor,
        background: backgroundColor,
        shadow: shadowColor,
        icon: iconColor,
        wrapper: wrapperColor,
        text: textColor,
        timestamp: timestampColor,
    } = storeToRefs(colorStore)      

    const emit = defineEmits<{
        (e: 'clickPrevious'): void
        (e: 'clickNext'): void
        (e: 'selectMedia', index: number): void
    }>()


    const listData: Ref<any[]> = ref([])

    listData.value = props.selectMediaList

    const cardWidth = ref(420)
    const cardHeight = ref(500)


    function closeFullScreener() {
        props.showFullScreener.value = false
    }

    function closeFullScreenerOnEscape(e: any) {
        if (e.key === 'Escape') {
            closeFullScreener()
        }        
    }    

    onMounted(() => {
        document.addEventListener("keydown", closeFullScreenerOnEscape)
    })    

    onUnmounted(() => {
        document.removeEventListener("click", closeFullScreener)
    })

</script>

<template>

    <div v-if='props.showFullScreener.value' class='fullScreenerMask' @click="closeFullScreener">
        <div class='wrapper'>

            <!-- close icon -->
            <div class='closeIconContainer'>
                <div class='iconContainer' @click='closeFullScreener' @click.stop>
                    <font-awesome-icon :icon="['fas', 'xmark']" size='2xl' />
                </div>
            </div>

            <div class='content'>

                <div v-if='listData && listData[selectMediaIdx]' class='momentContainer' @click.stop>

                    <div v-for="(item, index) in listData" class='momentWrapper'>

                        <div v-if='index == selectMediaIdx' :class='["userRow"]' :style='{ zIndex: item.zIndex }'>
                            <Avatar :userID='item.userID' :width='50' :key='item.userID'></Avatar>
                            <div class="nameBox">
                                <div class="name">
                                    {{ mainStore.pushnames[item.userID] }}
                                </div>
                                <div class="time">
                                    {{ formatTime(item.timestamp, locale as string) }}
                                </div>
                            </div>        
                        </div>

                        <div :class='["momentCard", {
                                momentCardAnimateRight: animateCardIndex == index && animateRight,
                                momentCardAnimateLeft: animateCardIndex == index && !animateRight}]'
                            :style='{ zIndex: item.zIndex }'>
                            
                            <MomentCard v-if='(item.zIndex > (10 + listData.length - 3)) || (item.zIndex == 10)'
                                :key='item.postID'
                                :postID='item.postID'
                                :cardWidth='400'>
                            </MomentCard>

                        </div>

                        <div v-if="mainStore.userID == item.userID" class="userReceiptsBox">

                            <div v-for='(value, idx) in item.userReceipts' :style="{ 'z-index': (idx*-1 + 100) }">

                                <Avatar :style="{ 'margin-right': '-8px' }"
                                    :userID="(value.uid as number)" :width='20' :useBorder=true>
                                </Avatar>
                            </div>

                        </div>

                        
                    </div>


                </div>





                <div v-if="listData.length > 1" class='leftArrowIconContainer'>
                    <div class='iconContainer'
                        @click="emit('clickPrevious')"
                        @click.stop>
                        <div class='iconShadow'>
                            <font-awesome-icon :icon="['fas', 'angle-left']" size='lg' />
                        </div>
                    </div>
                </div>

                <div v-if="listData.length > 1" class='rightArrowIconContainer'>
                    <div class='iconContainer'
                       
                        @click="emit('clickNext')" 
                        @click.stop>
                        <div class='iconShadow'>
                            <font-awesome-icon :icon="['fas', 'angle-right']" size='lg' />
                        </div>
                    </div>
                </div>
                
            </div>

            <div class="footer">
                <div class='mediaTray'>
                </div>
            </div>

        </div>
    </div>

</template>

<style scoped>
    .fullScreenerMask {
        position: fixed;
        z-index: 20;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(60px);
        -webkit-backdrop-filter: blur(60px);
        background-color: v-bind(wrapperColor);
        display: table;
    }

    .wrapper {
        width: 100vw;
        height: 100vh;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .header {
        flex: 1 1 50px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .content {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .momentContainer {
        position: relative;
        
        flex: 0 0 v-bind(cardWidth + 'px'); 
        height: v-bind(cardHeight + 'px');
        user-select: none;
    }

    /* .momentWrapper {
        position: relative;
        
        width: 100%;
        height: 100%;
    } */

    .userRow {
        position: absolute;
        top: 0;
        left: 10px;

        display: flex;
        flex-direction: horizontal;
        align-items: center;
        gap: 0px 8px;


    }

    .userRow .nameBox {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 3px 0px;
    }
    .userRow .nameBox .name {
        font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
        font-size: 16px;
        font-weight: 400;
        text-align: left;
        color: v-bind(textColor);
    }
    .userRow .nameBox .time {
        font-size: 14px;
        font-weight: 500;
        color: v-bind(timestampColor);
    }

    .momentCard {
        position: absolute;
        top: 60px;
        right: 0;
        
        width: v-bind(cardWidth + 'px');
        height: v-bind(cardHeight + 'px');

        border-radius: 10px;

        padding-top: 10px;
        background-color: white;

        box-shadow: rgb(230, 230, 230) 0px 0px 2px;
        
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        z-index: 10;
    }

    .momentCardAnimateRight {
        animation: flipRight 1s cubic-bezier(.73,0,.33,1);
    }

    .momentCardAnimateLeft {
        animation: flipLeft 1s cubic-bezier(.73,0,.33,1);
    }    

    .userReceiptsBox {
        display: flex;
        flex-direction: horizontal;
        justify-content: center;
        align-items: center;
    }


    .footer {
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .chatBoxTray {
        width: 500px;
        margin-bottom: 100px;
        display: flex;
        flex-direction: row;
    }

    .leftArrowIconContainer {
        position: fixed;
        left: 0;
    }

    .rightArrowIconContainer {
        position: fixed;
        right: 0;
    }

    .closeIconContainer {
        position: fixed;
        top: 5px;
        left: 15px;
    }

    .iconContainer {
        margin: 20px;
        color: v-bind(iconColor);
    }

    .iconContainer:hover {
        cursor: pointer;
    }

    .iconShadow {
        width: 40px;
        height: 40px;
        background-color: #C0C0C0;
        display: flex;
        justify-content: center;
        align-items: center;

        border-radius: 50%;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
    }

    .iconShadow:active {
        box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
    }

    .iconShadowFrbidden {
        background-color: #E5E4E2;
    }

    .iconContainerForbidden {
        color: #C0C0C0;
    }

    .iconContainerForbidden:active {
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
    }

    .iconContainerForbidden:hover {
        cursor: default;
    }

    .mediaTray {
        padding-left: 20px;
        padding-right: 20px;
        height: 100px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .smallPreviewContainer {
        width: fit-content;
        height: 56px;
        padding-left: 5px;
        overflow-y: hidden;
        overflow-x: auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .squareContainer {
        position: relative;
        user-select: none;
        z-index: 2;
        width: 50px;
        height: 50px;
        margin-right: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        overflow: hidden;

        outline: 1px solid gainsboro;
    }

    .squareContainer:hover {
        cursor: pointer;
    }

    .imgSmallContainer {
        z-index: 1;

        width: 50px;
        height: 50px;
        overflow: hidden;
    }

    .imgSmall {
        z-index: 0;

        overflow: hidden;
    }

    .selected {
        outline: 3px solid #1E90FF;
    }


    .playIconContainer {
        position: absolute;
        width: fit-content;
        height: fit-content;
        left: 50%;
        bottom: 50%;

        transform: translate(-50%, 50%);

        color: v-bind(primaryWhiteBlackColor);
        z-index: 10;
    }

    .playIconContainer .playCircle {
        position: absolute;
        width: fit-content;
        height: fit-content;
        left: 50%;
        bottom: 50%;

        transform: translate(-50%, 50%);
        width: 25px;
        height: 25px;
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);

        /* using a bg allows the play button to show through better even when the image is white */
        background:rgba(0, 0, 0, 0.1);         
        
        border-radius: 50%;
    }

    .playIconContainer .playIcon {
        position: absolute;
        width: fit-content;
        height: fit-content;
        left: 50%;
        bottom: 50%;

        transform: translate(-50%, 50%);

        border-radius: 50%;
    }    


    @keyframes flipRight {
        0% {
            z-index: 20;
        }
        50% {
            transform: rotate(-3deg) translateX(450px);
        }     
        90% {
            z-index: 1;
        }
    }

    @keyframes flipLeft {
        0% {
            z-index: 20;
        }
        50% {
            transform: rotate(3deg) translateX(-450px);
        }     
        90% {
            z-index: 1;
        }
    }

</style>