<script setup lang="ts">
    import { ref, computed, toRef, watch } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { storeToRefs } from 'pinia'

    import { useMainStore } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'

    import Avatar from '@/components/media/Avatar.vue'

    interface Props {
        groupID: string,
        postID: string,
        userID: number,
        showFullTitles?: boolean
    }
    const props = defineProps<Props>()

    const refShowfullTitles = toRef(props, 'showFullTitles')

    const { t } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const mainStore = useMainStore()
    const colorStore = useColorStore()

    const {
        primaryBlue: primaryBlueColor,
        tertiaryBg: tertiaryBgColor,
        text: textColor,
        icon: iconColor,
        hover: hoverColor,
    } = storeToRefs(colorStore)  

    const flexJustifyContent = ref('space-between')

    watch(refShowfullTitles, () => {
        if (refShowfullTitles.value) {
            flexJustifyContent.value = 'flex-start'
        } else {
            flexJustifyContent.value = 'space-between'
        }
    })

</script>

<template>

    <div class='commentHeader'>

        <div class='container'>
           
            <div class='iconContainer' @click="$emit('backClick')">
                <div class='iconShadow'>
                    <font-awesome-icon v-if='!mainStore.isMobile' :icon="['fas', 'xmark']" style="font-size: 25px;"/>
                    <font-awesome-icon v-else :icon="['fas', 'angle-left']" style="font-size: 25px;"/>
                </div>    
            </div>

            <div v-show="refShowfullTitles" class="nameContainer">
                <Avatar :userID="userID" :width="30" :key="groupID"></Avatar>
                <div class="userName">
                    {{ mainStore.pushnames[userID] }}
                </div>
                <div v-if="props.groupID" class="groupIndicator">
                    <font-awesome-icon :icon="['fas', 'caret-right']" size='sm' class="groupIndicatorIcon"/>
                </div>
                <div v-if="props.groupID" class="groupName" @click="mainStore.gotoGroup(groupID)">
                    {{ mainStore.groupnames[groupID] }}
                </div>
            </div>

            <div v-if="!refShowfullTitles" class='titleContainer'>
                Comments
            </div>

            <div v-if="!refShowfullTitles" class='iconContainer'>
            </div>

        </div>
    </div>

</template>

<style scoped>

    .commentHeader {
        overflow-y: auto;
        overflow-x: hidden;
        
        height: 100%;
        background-color: v-bind(tertiaryBgColor);
    }

    .container {
        display: flex;
        flex-direction: row;
        /* justify-content: space-between; */
        justify-content: v-bind(flexJustifyContent);
        align-items: center;
    }

    .container .nameContainer {
        font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
        font-size: 14px;

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        animation: fadeIn 0.5s linear;
        
    }

    .container .nameContainer .userName {
        margin-left: 10px;
    }    
    .container .nameContainer .groupIndicator {
        margin-left: 5px;
        color: lightgray;
        text-align: bottom;
    }
    .container .nameContainer .groupIndicator .groupIndicatorIcon {
        margin-bottom: -1px;
    }

    .container .nameContainer .groupName {
        
        margin-left: 5px;
        display: inline-block; /* this breaks the block to the next line when it's too long to fit */
        cursor: pointer;
    }

    .container .groupName:hover {
        color: v-bind(primaryBlueColor);
    }    


    .avatarContainer {
        flex: 0 0 70px;
        padding: 5px 0px 5px 0px;
    }

    .avatar {
        width: 40px;
        height: 40px;

        background-color: lightgray;
        border-radius: 50%;
    }

    .iconContainer {
        flex: 0 0 50px;
        padding: 5px 0px 5px 0px;
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

    @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
    } 

    @keyframes fadeOut {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }    

</style>
