import { DateTime } from 'luxon'
import { useI18n } from 'vue-i18n'
import halogger from '../common/halogger'

export function useTimeformatter() {

    const { t } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })
    
    const minMs = 1000 * 60
    const hrMs = minMs * 60

    function formatTime(seconds: number, locale: string) {
        let result = ""
        const dt = DateTime.fromSeconds(seconds)
        const currentTime = DateTime.local()
    
        if (currentTime.diff(dt, 'minutes').minutes < 1) {
            result = "Now"
        } else if ((currentTime.diff(dt, 'hours').hours < 6) || (dt.hasSame(currentTime, 'day'))) {   
            result = dt.toFormat("t", { locale: locale })                           // 8:48 PM
        } else if (currentTime.diff(dt, 'days').days < 5) {   
            result = dt.toFormat("ccc t", { locale: locale })                       // Thu 8:48 PM
        } else if (currentTime.diff(dt, 'weeks').weeks < 26) {  
            result = dt.toFormat("LLL d", { locale: locale })                       // Jan 20
        } else {
            result = dt.toFormat("D", { locale: locale })                           // 6/20/2020
        }
        return result
    }

    function formatTimer(countDownDate: any) {
        const now = new Date().getTime()
        const timeDiffMs = countDownDate - now
        const diffMinutes = Math.floor((timeDiffMs % hrMs) / minMs)
        const diffSeconds = Math.floor((timeDiffMs % minMs) / 1000)
        let displaySeconds = diffSeconds.toString()
        if (diffSeconds < 10) {
            displaySeconds = '0' + displaySeconds
        }
        return { display: diffMinutes + ":" + displaySeconds, timeDiffMs: timeDiffMs }
    }

    function formatTimeDateOnlyChat(seconds: number, locale: string) {
        let result = ""
        const dt = DateTime.fromSeconds(seconds)
        const currentTime = DateTime.local()
        
        // TODAY
        if (currentTime.diff(dt, 'days').days < 1) {
            result = t('timestampFormatter.TODAY')
        }
        // YESTERDAY
        else if (currentTime.diff(dt, 'days').days < 2) {
            result = t('timestampFormatter.YESTERDAY')
        }
        // Day of week: TUESDAY
        else if (currentTime.diff(dt, 'days').days < 5) {
            result = dt.toFormat("EEEE", { locale: locale }).toUpperCase()
        }

        // Date: localized numeric date
        else {
            result = dt.toFormat("D", { locale: locale }) 
        }

        return result
    }

    function formatTimeChat(seconds: number, locale: string) {
        // Time: 11:11 am
        const dt = DateTime.fromSeconds(seconds)
        return dt.toFormat("t", { locale: locale })
    }

    function formatTimeFullChat(seconds: number, locale: string) {
        const dt = DateTime.fromSeconds(seconds)

        // date + hh:mm am
        let res = dt.toFormat("D", { locale: locale }) 
        res += " "
        res += formatTimeChat(seconds, locale)

        return res
    }


    return { formatTime, formatTimer, formatTimeDateOnlyChat, formatTimeChat, formatTimeFullChat }
}