<script setup lang="ts">
import { computed, watch } from 'vue'

const props = defineProps(['NotificationQueue'])

const numOfNotificationInQueue = computed(() => {
    return props.NotificationQueue.length
})

watch(numOfNotificationInQueue, (newVal, oldVal) => {
    if (newVal > 3) {
        const targetElement = document.getElementById('0')
        targetElement?.classList.remove('notificationContainer-animation-in')
        targetElement?.classList.add('notificationContainer-animation-out')
        setTimeout(() => {
            props.NotificationQueue.splice(0, 1)
        }, 200)
    }
    else {
        // new message comes
        if (newVal > oldVal) {
            setTimeout(() => {
                props.NotificationQueue.splice(0, 1)
            }, 5000)
        }
    }
})

</script>

<template>

    <div class='notificationListContainer'>
        <div class='notificationContainer notificationContainer-animation-in' v-for='(value,idx) in props.NotificationQueue' :id='"" + idx'>
            <div class='textContainer'>
                <div class='contentTextBody contentTextBodyForSettings'>
                    {{ value }}
                </div>
            </div>
        </div>
    </div>

</template>

<style scroped>

@keyframes fadeIn {
    0% { opacity: 0.0; transform: translateY(50px); }
    50% { opacity: 0.3; transform: translateY(10px); }
    100% { opacity: 1.0; transform: translateY(0px); }
}

@keyframes fadeOut {
    0% { opacity: 1.0; }
    50% { opacity: 0.3; }
    100% { opacity: 0; }
}

.notificationListContainer {
    max-height: 160px;
    overflow: hidden;
    width: 150px;
    position: absolute;
    bottom: 60px;
    left: 20px;
}

.notificationContainer-animation-out {
    animation: fadeOut 0.2s 1;
}

.notificationContainer-animation-in {
    animation: fadeIn 0.2s 1;
}

.notificationContainer {
    height: 30px;
    margin: 10px 5px 0px 5px;
    border-radius: 5px;
    align-content: center;
    text-align: center;

    background-color: black;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}



.textContainer {
    font-size: small;
    color: white;
}

</style>