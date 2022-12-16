<script setup lang='ts'>
    import { Ref, ref, toRef, watch } from 'vue'
    import { useI18n } from 'vue-i18n'

    import { useTimeformatter } from '@/composables/timeformatter'
    import { useHAUtils } from '@/composables/haUtils'

    import MomentCard from '@/components/moment/MomentCard.vue'

    const { isPast24Hours, diffInSeconds } = useTimeformatter()

    const { t, locale } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    interface Props {
        momentPosts: any,
        postWidth: number,
    }

    const props = defineProps<Props>()

    const { debounce } = useHAUtils()

    const refMomentPosts = toRef(props, 'momentPosts')

    const mediaBoxWidth     = ref(0)

    const list: Ref<any[]> = ref([])


    let currentMoment = 0
    const animateCardIndex = ref(-1)
    let animateRight = true

    let removeTimers: any = {}


    makeList(props.momentPosts)

    watch(refMomentPosts, async (newVal, oldVal) => {
        makeList(newVal)
    })

    async function makeList(newVal: any) {

        let haveNewMoments = false

        for (let i = newVal.length - 1; i >= 0; i--) {
            let item = newVal[i]
            
            if (isPast24Hours(item.timestamp)) { continue }

            const timeToRemove = Math.abs(diffInSeconds(item.timestamp))

            clearTimeout(removeTimers[item.userID])
            removeTimers[item.userID] = setTimeout(function () {
                console.log('Moment/makeList/removing moment: ' + item.userID)
                const index = list.value.indexOf(item)
                if (index > -1) {
                    list.value.splice(index, 1)
                }
            }, timeToRemove*1000)


            if (!needToAdd(item.userID, item.timestamp)) { continue } 

            const lastIndex = list.value.length - 1
            item.zIndex = 10 + lastIndex

            list.value.unshift(item)

            haveNewMoments = true
        }

        if (haveNewMoments) {
            currentMoment = 0
            await decorateList()
        }
    }

    async function decorateList() {
        let isRotated = false

        let zIndex = 10 + list.value.length - 1
        for (let i = 0; i < list.value.length; i++) {
            let item = list.value[i]

            item.isRotated = isRotated
            isRotated = !isRotated
            
            item.zIndex = zIndex
            zIndex--
        }
    }

    function needToAdd(userID: string, timestamp: number) {
        if (list.value.length == 0) { return true }

        for (let i = list.value.length - 1; i >= 0; i--) {
            const listItem = list.value[i]
            if (userID != listItem.userID) { continue }

            if (timestamp > listItem.timestamp) {
                // delete old moment
                list.value.splice(i, 1)
                return true
            } else {
                return false
            }
        }

        return true        
    }    

    const flip = debounce(function(isAnimateRight: boolean) {

        if (isAnimateRight) {
            animateRight = true
            debouncedFlipRight()
        } else {
            animateRight = false
            debouncedFlipLeft()
        }

    }, 500)


    function debouncedFlipRight() {

        const index = currentMoment
        animateCardIndex.value = index

        let previousMomentIndex = index - 1
        if (previousMomentIndex < 0) {
            previousMomentIndex = list.value.length - 1
        }

        list.value[previousMomentIndex].zIndex = 10 + list.value.length - 2

        let zIndex = 10 + list.value.length - 1

        /* right side of index, inclusive */
        for (let i = previousMomentIndex; i < list.value.length; i++) {
            if (i == index) { 
                zIndex--
                continue 
            }
            const item = list.value[i]  

            item.zIndex = zIndex 
            zIndex--
        }

        /* left side of index */
        for (let i = 0; i < previousMomentIndex; i++) {
            if (i == index) { 
                zIndex--
                continue 
            }
            const item = list.value[i]  

            item.zIndex = zIndex
            zIndex--
            
        }           

        setTimeout(function() {
            list.value[index].zIndex = 10 + list.value.length - 2
        }, 900)

        setTimeout(function() {
            animateCardIndex.value = -1
            
            currentMoment--
            if (currentMoment < 0) {
                currentMoment = list.value.length - 1
            }      
        }, 900)

    }

    function debouncedFlipLeft() {

        const index = currentMoment
        animateCardIndex.value = index

        setTimeout(function() {

            let zIndex = 10 + list.value.length - 1

            list.value[index].zIndex = 10

            
            let nextMoment = index + 1
            if (nextMoment >= list.value.length) {
                nextMoment = 0
            }        

            /* right side of index, inclusive */
            for (let i = nextMoment; i < list.value.length; i++) {
                if (i == index) { continue }
                const item = list.value[i]  

                item.zIndex = zIndex
                zIndex--
            }

            /* left side of index */
            for (let i = 0; i < nextMoment; i++) {
                if (i == index) { continue }
                const item = list.value[i]  

                item.zIndex = zIndex
                zIndex--
            }            
            
        }, 900)

        setTimeout(function() {
            animateCardIndex.value = -1
            
            currentMoment++
            if (currentMoment >= list.value.length) {
                currentMoment = 0
            }            

        }, 900)

    }

</script>

<template>

    <div v-if='list.length > 0' class='momentComponent'>

        <div class='momentContainer'>

            <div v-for="(item, index) in list" class='momentWrapper'>

                <div :class='["momentCard", {momentCardRotate: item.isRotated, 
                        momentCardAnimateRight: animateCardIndex == index && animateRight,
                        momentCardAnimateLeft: animateCardIndex == index && !animateRight}]'
                    :style='{ zIndex: item.zIndex }'>
                    
                    <MomentCard v-if='(item.zIndex > (10 + list.length - 3)) || (item.zIndex == 10)'
                        :key='item.postID'
                        :postID='item.postID'>
                    </MomentCard>

                </div>
                
            </div>
       
            <button v-if='list.length > 1' class="carouselButton carouselButtonPrevious" @click="flip(false)">
                <font-awesome-icon :icon="['fas', 'chevron-left']" />
            </button>
            <button v-if='list.length > 1' class="carouselButton carouselButtonNext" @click="flip(true)">
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </button> 

        </div>
        
    </div>

</template>

<style scoped>

    .momentComponent {
        position: relative;
        width: 100%;
        height: 100%;

        margin-top: 20px;
        margin-bottom: 20px;

        /* 
        flex: 0 0 v-bind(mediaBoxHeight + 'px'); 
        width: v-bind(mediaBoxWidth + 'px'); 
        */
        align-self: center;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .momentContainer {
        position: relative;
        
        flex: 0 0 320px; 
        height: 370px;
    }

    .momentCard {
        position: absolute;
        top: 0;
        right: 0;
        width: 320px;
        height: 370px;

        border-radius: 10px;

        padding-top: 10px;
        background-color: white;

        box-shadow: rgb(230, 230, 230) 0px 0px 7px;
        
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        z-index: 10;
    }

    .momentCardRotate {
        transform: rotate(-2deg);
    }

    .momentCardAnimateRight {
        animation: flipRight 1s cubic-bezier(.73,0,.33,1);
    }

    .momentCardAnimateLeft {
        animation: flipLeft 1s cubic-bezier(.73,0,.33,1);
    }    

    .image {
        display: block; /* use block as images by default are inline and have an unsightly gap of 5px below it */
        width: 300px;
        height: 300px;
        border-radius: 10px;
        object-fit: cover;    
        -webkit-user-drag: none;
    }

    @media (prefers-color-scheme: dark) {
        .mediaBox {
            background-color: rgba(47, 46, 42, 1);
        }
    }

    .carouselButton {
        position: absolute;
        top: 50%;

        width: 50px;
        height: 50px;

        transform: translateY(-130%);
        z-index: 0;

        padding: 0px;
        margin: 0.5rem;
        border: none;

        font-size: 1.5rem;
        cursor: pointer;

        transition: color 0.2s;
        /* background-color: rgb(171, 165, 165); */
        color: rgba(0, 0, 0, 0.5);
        opacity: 0.9;
    }
    .carouselButton:hover {
        color: rgba(0, 0, 0, 0.9);
        opacity: 1;
    }

    .carouselButtonPrevious {
        left: -70px;
        border-radius: 50%;
    }
    .carouselButtonNext {
        right: -70px;
        border-radius: 50%;
    }    

    .mediaLoaderBox {
        min-width: v-bind(mediaBoxWidth + 'px');
    
        display: flex;
        flex-direction: horizontal;
        justify-content: center;
        align-items: center;
    }
    .mediaErrorMsg {
        text-align: center;
        padding-left: 50px;
        padding-right: 50px;
        font-size: 12px;
        color: gray;
    }
    .loader {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3498db;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 2s linear infinite;
    }

    @keyframes flipRight {
        0% {
            z-index: 20;
        }
        50% {
            transform: rotate(-3deg) translateX(350px);
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
            transform: rotate(3deg) translateX(-350px);
        }     
        90% {
            z-index: 1;
        }
    }

</style>
