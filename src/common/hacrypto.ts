import { defineComponent } from 'vue'

import nacl from 'tweetnacl'

export default defineComponent({
    keygen() {
        let key = nacl.box.keyPair()
        // console.log("--> " + key.publicKey)
        // console.log("--> " + key.secretKey)
        return key
    },
})