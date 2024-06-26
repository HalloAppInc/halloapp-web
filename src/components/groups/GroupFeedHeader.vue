<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useI18n } from 'vue-i18n'

    import { useMainStore } from '@/stores/mainStore'
    import { useColorStore } from '@/stores/colorStore'

    import GroupAvatar from '@/components/media/GroupAvatar.vue'

    const props = defineProps(['title'])

    const { t } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const mainStore = useMainStore()
    const colorStore = useColorStore()

    const { 
        background: backgroundColor,
        text: textColor
    } = storeToRefs(colorStore)  

    const hoverColor = computed(() => {
        return colorStore.hover
    })

    const iconColor = computed(() => {
        return colorStore.icon
    })
</script>

<template>

    <div class='groupHeader'>

        <div class='container'>
           
            <div v-show="!mainStore.showGroupsSidebar" class='iconContainer' @click="$emit('openGroupsSidebar')">
                <div class='iconShadow'>
                    <font-awesome-icon :icon="['fas', 'angle-left']" style="font-size: 25px;"/>
                </div>
            </div>
           
            <div class="avatarContainer">
                <GroupAvatar v-show="mainStore.groupsPageGroupID" :groupID="mainStore.groupsPageGroupID" :width="30"></GroupAvatar>
            </div>           

            <div v-show="mainStore.groupsPageGroupID" class='titleContainer'>
                {{ mainStore.groupnames[mainStore.groupsPageGroupID] }}
            </div>

        </div>
    </div>

</template>

<style scoped>

    .groupHeader {
        position: sticky;
        top: 0px;
        width: 100%;
        height: 50px;
        background-color: v-bind(backgroundColor);
        z-index: 2;
    }

    .container {
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    .leftGutter {
        flex: 0 0 10px;
    }

    .rightGutter {
        flex: 0 0 10px;
    }

    .iconContainer {
        flex: 0 0 50px;
        
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

    .avatarContainer {
        padding-top: 5px;
        padding-left: 15px;
        flex: 0 0 65px;
    }

    .avatar {

        background-color: lightgray;
        border-radius: 50%;
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

</style>
