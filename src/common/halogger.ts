import { defineComponent } from 'vue'

export default defineComponent({
    log: function() {
        if (process.env.NODE_ENV != 'development') { return () => {} }
        return console.log.bind(window.console)
    }(),
})