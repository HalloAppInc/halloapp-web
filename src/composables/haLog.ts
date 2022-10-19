import { useI18n } from 'vue-i18n'

export function useHALog() {

    const log = function(data: any) {        
        
        var superbind = console.log.bind(window.console);

        var timestamp = '[' + Date.now() + '] '
        // return logBind(timestamp, arguments)
        return function() {
            superbind(timestamp)
        }
    }

    return {
        log,    
    }
}