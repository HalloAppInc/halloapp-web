import { DateTime } from "luxon"
import { defineComponent } from 'vue'

export default defineComponent({
    format: function(seconds: number, locale: string) {
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
})