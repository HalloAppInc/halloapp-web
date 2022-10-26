<script setup lang="ts">
    import { Ref, ref, computed } from 'vue'
    import { useI18n } from 'vue-i18n'
  
    import { db } from '@/db'
    
    import { useMainStore } from '@/stores/mainStore'
    import { useConnStore } from '@/stores/connStore'
    import { useColorStore } from '@/stores/colorStore'

    import hal from '@/common/halogger'

    import HomeHeader from '@/components/home/HomeHeader.vue'
    import FeedList from '@/components/feed/FeedList.vue'

    const mainStore = useMainStore()
    const connStore = useConnStore()
    const colorStore = useColorStore()

    const { t, locale } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

</script>

<template>

    <FeedList ref="feedRef" :atMainFeed='true' >
        <template v-slot:header>
            <div class='header'>
                <HomeHeader/>
            </div>
        </template>
    </FeedList>

</template>

<style scoped>
    .header {
        position: sticky;
        top: 0px;
        width: 100%;
        height: 50px;
        z-index: 2;
    }
</style>
