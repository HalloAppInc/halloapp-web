import { defineComponent } from 'vue'

import nacl from 'tweetnacl'

export default defineComponent({
    keygen() {
        let key = nacl.box.keyPair()
        // console.log("--> " + key.publicKey)
        // console.log("--> " + key.secretKey)
        return key
    },

    combineBinaryArrays(arrays: any) {
        let totalLength = arrays.reduce((a: any, b: any) => a + b.byteLength, 0)
        let result = new Uint8Array(totalLength)
        let offset = 0
        for (let arr of arrays) {
            result.set(arr, offset)
            offset += arr.byteLength
        }
        return result
    }
})