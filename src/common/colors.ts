import { faTurkishLira } from '@fortawesome/free-solid-svg-icons'
import { defineComponent } from 'vue'

export default defineComponent({
    getColor(mode: string) {
        // if mode is auto, follow OS's color schema
        if (mode == 'auto'){
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return "black";
            }
            else {
                return "#f0f2f5";
            }
        }
        // change color manually
        else if (mode == 'dark'){
            return "black";
        }
        else if (mode == 'light'){
            return "#f0f2f5";
        }
    },
    primaryBlue: "#007AFF",
    primaryBlueDark: "rgb(10, 132, 255, 1)",
})