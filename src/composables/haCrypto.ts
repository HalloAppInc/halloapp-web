import hal from '../common/halogger'
import hacrypto from '../common/hacrypto'

import { Base64 } from 'js-base64'
import hkdf from 'js-crypto-hkdf'

export function useHACrypto() {

    const imageInfo = Base64.fromBase64("SGFsbG9BcHAgaW1hZ2U=")
    const videoInfo = Base64.fromBase64("SGFsbG9BcHAgdmlkZW8=")

    async function encrypt(plaintext: any, encryptionKey: Uint8Array) {
        const key = encryptionKey

        const derivedKeyObj = await getDerivedKey(key, imageInfo)
        const derivedKey = derivedKeyObj.key

        const IV = derivedKey.slice(0, 16)
        const AESKey = derivedKey.slice(16, 48)
        const SHA256Key = derivedKey.slice(48, 80)

        const plaintextArray = await new Response(plaintext).arrayBuffer()

        // encryt plain text
        const encryptedBinaryArray = await encryptBlob(AESKey, IV, plaintextArray)

        // add HMAC
        const encryptedArrayWithMAC = await attachHMAC(SHA256Key, encryptedBinaryArray)

        // calculate hash
        const hash = await crypto.subtle.digest("SHA-256", encryptedArrayWithMAC)
        const ciphertextHash = new Uint8Array(hash)

        const encryptedBuffer = encryptedArrayWithMAC.buffer

        return { encryptedBuffer, ciphertextHash }

    }

    async function decrypt(encryptedBuffer: ArrayBuffer, ciphertextHash: any, decryptionKey: Uint8Array) {
        const key = decryptionKey

        const derivedKeyObj = await getDerivedKey(key, imageInfo)
        const derivedKey = derivedKeyObj.key

        const IV = derivedKey.slice(0, 16)
        const AESKey = derivedKey.slice(16, 48)
        const SHA256Key = derivedKey.slice(48, 80)

        const encryptedArrayWithMAC = new Uint8Array(encryptedBuffer)

        const hash = await crypto.subtle.digest("SHA-256", encryptedArrayWithMAC)

        const isCorrectHash = isUint8ArrayEqual(new Uint8Array(hash), ciphertextHash)
        if (!isCorrectHash) {
            hal.log("decrypt/hash does not match")
        }

        const attachedMAC = encryptedArrayWithMAC.slice(-32)
        const encryptedBinaryArray = encryptedArrayWithMAC.slice(0, -32)

        const isHMACMatch = await verifyHMAC(SHA256Key, encryptedBinaryArray, attachedMAC)
        if (!isHMACMatch) {
            hal.log("decrypt/mismatch HMAC")
        }

        const decryptedBinaryArray = await dedecryptBlob(AESKey, IV, encryptedBinaryArray)

        return new Blob([decryptedBinaryArray])
    }

    async function getDerivedKey(secret: any, info: any) {
        const derivedKeyObj = await hkdf.compute(secret, 'SHA-256', 80, info, new Uint8Array())
        return derivedKeyObj
    }

    async function verifyHMAC(rawKey: any, ciphertext: any, signature: any) {
        const algorithm = { name: "HMAC", hash: "SHA-256" }
        const baseKey = await window.crypto.subtle.importKey(
            "raw",
            rawKey,
            algorithm,
            false,
            ["verify"]
        )
            .catch((error) => { hal.log("verifyHMAC/importKey error: " + error) })

        const isValid = await window.crypto.subtle.verify(
            algorithm,
            baseKey as CryptoKey,
            signature,
            ciphertext
        )
            .catch((error) => { hal.log("verifyHMAC/verify error: " + error) })

        return isValid
    }

    async function attachHMAC(rawKey: any, ciphertext: any) {
        const algorithm = { name: "HMAC", hash: "SHA-256" }
        const baseKey = await window.crypto.subtle.importKey(
            "raw",
            rawKey,
            algorithm,
            false,
            ["sign"]
        )
            .catch((error) => { hal.log("attachHMAC/importKey error: " + error) })

        const signature = await window.crypto.subtle.sign(
            algorithm,
            baseKey as CryptoKey,
            ciphertext
        )
            .catch((error) => { hal.log("attachHMAC/verify error: " + error) })

        // concatenate ArrayBuffer
        let encryptedArrayWithMAC = new Uint8Array(signature?.byteLength + ciphertext.byteLength)
        encryptedArrayWithMAC.set(new Uint8Array(ciphertext), 0)
        if (signature) {
            encryptedArrayWithMAC.set(new Uint8Array(signature), ciphertext?.byteLength)
        }
        return encryptedArrayWithMAC
    }

    async function encryptBlob(rawKey: any, IV: any, plaintext: any) {
        const baseKey = await window.crypto.subtle.importKey(
            "raw",
            rawKey,
            "AES-CBC",
            true,
            ["encrypt"]
        )
            .catch((error) => { hal.log("encryptBlob/importKey error: " + error) })

        const encryptedBinaryArray = await window.crypto.subtle.encrypt(
            { name: "AES-CBC", iv: IV },
            baseKey as CryptoKey,
            plaintext
        )
            .catch((error) => { hal.log("encryptBlob/encrypt error: " + error) })

        return encryptedBinaryArray
    }

    async function dedecryptBlob(rawKey: any, IV: any, ciphertext: any) {
        const baseKey = await window.crypto.subtle.importKey(
            "raw",
            rawKey,
            "AES-CBC",
            true,
            ["decrypt"]
        )
            .catch((error) => { hal.log("dedecryptBlob/importKey error: " + error) })

        const decryptedCiphertext = await window.crypto.subtle.decrypt(
            { name: "AES-CBC", iv: IV },
            baseKey as CryptoKey,
            ciphertext
        )
            .catch((error) => { hal.log("dedecryptBlob/decrypt error: " + error) })

        let decryptedCiphertextArray = new Uint8Array(decryptedCiphertext)
        return decryptedCiphertextArray
    }

    function isUint8ArrayEqual(arr1: Uint8Array, arr2: Uint8Array) {
        if (arr1.length != arr2.length) {
            return false
        }
        for (let i = 0; i <= arr1.length; i++) {
            if (arr1[i] != arr2[i]) {
                return false
            }
        }
        return true
    }

    function keygen() {
        let keypair = hacrypto.keygen()
        let encryptionKey = keypair.secretKey as Uint8Array
        return encryptionKey
    }


    async function encrytImage(image: any, encryptionKey: Uint8Array) {
        return await encrypt(image, encryptionKey)
    }


    async function encrytVideo(video: any, encryptionKey: Uint8Array, chunkSize: number) {
        const plaintextArray = await new Response(video).arrayBuffer()

        /* const chunksArr = []
        let chunkCounter = 0
        for (let i = 0; i < plaintextArray.length; i += chunkSize) {
            const chunkWithMAC = plaintextArray.slice(i, i + chunkSize)
            const chunkInfo = info + ' ' + chunkCounter
            const decryptedBinArr = await encrypt(chunkWithMAC, encryptionKey, chunkInfo)
            chunksArr.push(decryptedBinArr)
            chunkCounter++
        }

        const combinedBinArr = combineBinaryArrays(chunksArr)
        return new Blob([combinedBinArr]) */
    }


    return { encrypt, decrypt, keygen}
}