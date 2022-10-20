import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMainStore } from '@/stores/mainStore.js'

import { useTimeformatter } from '@/composables/timeformatter'

export function useHALog() {

    const mainStore = useMainStore()

    const haConsoleLog = function(...arg: any[]) {
        // clean up
        if (mainStore.savedLogs.length > 500) {
            for (let i = 0; i <= 500; i++) {
                mainStore.savedLogs.pop()
            }
        }

        if (arg.length > 1) {
            const str = arg[1] + ' ' + arg[2]
            mainStore.savedLogs.push(str)
        }
        console.log.apply(console, arg)
    }

    const hal = function() {
        var timestamp = function() {}
        timestamp.toString = function() {
            return getFullTimestamp()
        }

        return {
            log: haConsoleLog.bind(console, '%s', timestamp)
        }
    }()

    function getFullTimestamp() {
        const pad = (n:any, s=2) => (`${new Array(s).fill(0)}${n}`).slice(-s)
        const d = new Date()

        return `[${pad(d.getFullYear().toString().substring(-2),2)}${pad(d.getMonth()+1)}${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(),3)}]`
    }    

    return {
        hal
    }
}