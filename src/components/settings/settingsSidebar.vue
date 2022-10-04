<script setup lang="ts">
    import { computed, ref, watch, nextTick } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useI18n } from 'vue-i18n'

    import { useColorStore } from '@/stores/colorStore'
    import { useMainStore } from '@/stores/mainStore'

    import MainMenu from '@/components/settings/Main.vue'
    import HelpMenu from '@/components/settings/Help.vue'
    import NotificationsMenu from '@/components/settings/Notifications.vue'
    import PrivacyMenu from '@/components/settings/Privacy.vue'
    import SecurityMenu from '@/components/settings/Security.vue'

    const mainStore = useMainStore()
    const colorStore = useColorStore()

    const { t } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const { 
        primaryLightgray: primaryLightgrayColor,
        background: backgroundColor,
        borderline: borderlineColor,
        secondaryBorder: secondaryBorderColor,
    } = storeToRefs(colorStore)  


    const settingsSidebar = ref<HTMLDivElement>()
    const settingSidebarHeight = ref(0)
    const offsetTop = ref()

    watch(settingSidebarHeight, (newVal, oldVal) => {
        offsetTop.value = -1 * newVal / 2
    })

    // find the offset to the top
    nextTick(() => {
        if (settingsSidebar.value) {
            offsetTop.value = settingsSidebar.value?.clientHeight as number / 2 * (-1)
        }
        new ResizeObserver(() => {
            if (mainStore.page == 'settings')
                settingSidebarHeight.value = settingsSidebar.value ? settingsSidebar.value.clientHeight : 0
        }).observe(settingsSidebar.value!)
    })
    </script>


    <template>
        <Transition name='settings'>
            <div class="wrapper" ref='settingsSidebar'>
                <MainMenu />
                <PrivacyMenu />
                <NotificationsMenu />
                <HelpMenu />
                <SecurityMenu />
            </div>  
        </Transition>
    </template>

<style scoped>
.settings-enter-active {
    transition: all 0.15s;
}

.settings-leave-active {
    transition: all 0.3s ease-in-out;
}

.settings-enter-from {
    transform: translateX(-200px);
    opacity: 0;
}

.settings-leave-from {
    transform: translateY(v-bind(offsetTop + 'px'));
    opacity: 1;
}

.settings-leave-to {
    transform: translateY(v-bind(offsetTop + 'px')) translateX(-200px);
    opacity: 0;
}

*::-webkit-scrollbar {
    width: 5px;
}

*::-webkit-scrollbar-track {
    background: white;      /* color of the tracking area */
}

*::-webkit-scrollbar-thumb {
    background-color: rgb(172, 169, 169);       /* color of the scroll thumb */

    border: 0px solid white;        /* creates padding around scroll thumb */
}

.wrapper {
    background-color: v-bind(backgroundColor);

    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    overflow: hidden;

    border-right: 1px solid v-bind(borderlineColor);
}
</style>