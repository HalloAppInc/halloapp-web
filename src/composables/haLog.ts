import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMainStore } from '@/stores/mainStore.js'

import { useTimeformatter } from '@/composables/timeformatter'

export function useHALog() {

    const mainStore = useMainStore()

    const haConsoleLog2 = function(...arg: any[]) {
        // clean up
        // SavedLogs are sent via email in an url, so we should try not to exceed what email clients
        // are willing to accept and what browsers will allow (ie. Chrome can accept up to 2 million chars
        // and Apple Email accepts up to 500k chars)
        if (mainStore.savedLogs.length > 3000) {
            for (let i = 0; i <= 1000; i++) {
                mainStore.savedLogs.pop()
            }
        }

        if (arg.length > 1) {
            const str = arg[1] + ' ' + arg[2]
            mainStore.savedLogs.push(str)
        }
        console.log.apply(console, arg)
    }

    const hal4 = function() {
        var timestamp = function() {}
        timestamp.toString = function() {
            return getFullTimestamp()
        }

        const hh = console.log.bind(window.console, '%s', timestamp)

        return {
            log: haConsoleLog2.bind(window.console, '%s', timestamp)
        }
    }()

    const hal = function(...args: any[]) {
        
        let timestamp = function() {}
        timestamp.toString = function() {
            return getFullTimestamp()
        }

        const argsArray = Array.from(args)
        argsArray.unshift(timestamp)
        const str = argsArray.join(' ')

        mainStore.savedLogs.push(str)

        // clean up
        // SavedLogs are sent via email in an url, so we should try not to exceed what email clients
        // are willing to accept and what browsers will allow (ie. Chrome can accept up to 2 million chars
        // and Apple Email accepts up to 500k chars)
        if (mainStore.savedLogs.length > 3000) {
            for (let i = 0; i <= 1000; i++) {
                mainStore.savedLogs.pop()
            }
        }

        return console.log.bind(window.console, str)
    }

    // const hal = function(...args: any[]) {
    //     return {
    //         log: log(args)
    //     }
    // }

    function getFullTimestamp() {
        const pad = (n:any, s=2) => (`${new Array(s).fill(0)}${n}`).slice(-s)
        const d = new Date()

        return `[${pad(d.getFullYear().toString().substring(-2),2)}${pad(d.getMonth()+1)}${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(),3)}]`
    }

    return {
        hal
    }
}