import { defineComponent } from 'vue'

export default defineComponent({
    log: function() {
        if (process.env.NODE_ENV != 'development') { return () => {} }
        return console.log.bind(window.console)
    }(),
    dir: function() {
        if (process.env.NODE_ENV != 'development') { return () => {} }
        return console.dir.bind(window.console)
    }(),
    prod: function() {
        return console.log.bind(window.console)
    }(),    
})