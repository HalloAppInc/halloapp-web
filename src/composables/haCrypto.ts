import hal from '../common/halogger'

import { Base64 } from 'js-base64'
import hkdf from 'js-crypto-hkdf'

import nacl from 'tweetnacl'

export function useHACrypto() {

    const imageInfo     = Base64.fromBase64("SGFsbG9BcHAgaW1hZ2U=")
    const videoInfo     = Base64.fromBase64("SGFsbG9BcHAgdmlkZW8=")
    const voiceNoteInfo = Base64.fromBase64("SGFsbG9BcHAgYXVkaW8=") 

    async function encryptImageOrNonStreamVideo(plaintextArray: Uint8Array, encryptionKey: Uint8Array) {
        const derivedKeyObj = await getDerivedKey(encryptionKey, imageInfo)
        const derivedKey = derivedKeyObj.key

        const IV = derivedKey.slice(0, 16)
        const AESKey = derivedKey.slice(16, 48)
        const SHA256Key = derivedKey.slice(48, 80)

        // encryt plain text
        const encryptedBinaryArray = await encryptBinArr(AESKey, IV, plaintextArray)

        // add HMAC
        const encryptedArrayWithMAC = await attachHMAC(SHA256Key, encryptedBinaryArray)

        // calculate hash
        const hash = await crypto.subtle.digest("SHA-256", encryptedArrayWithMAC)
        const ciphertextHash = new Uint8Array(hash)

        const encryptedBuffer = encryptedArrayWithMAC.buffer as ArrayBuffer

        /* hal.log(
            'haCrypto/encryptImageOrNonStreamVideo/' +
            'plaintextArray: ' + plaintextArray.byteLength + 
            '\nencryptedBinaryArray' + encryptedBinaryArray.byteLength +
            '\nencryptedArrayWithMAC' + encryptedArrayWithMAC.byteLength + 
            '\nencryptedBuffer' + encryptedBuffer.byteLength) */

        return { encryptedBuffer, ciphertextHash }

    }

    async function decryptImageOrNonStreamVideo(encryptedBuffer: ArrayBuffer, ciphertextHash: any, decryptionKey: Uint8Array) {
        const derivedKeyObj = await getDerivedKey(decryptionKey, imageInfo)
        const derivedKey = derivedKeyObj.key

        const IV = derivedKey.slice(0, 16)
        const AESKey = derivedKey.slice(16, 48)
        const SHA256Key = derivedKey.slice(48, 80)

        const encryptedArrayWithMAC = new Uint8Array(encryptedBuffer)

        const hash = await crypto.subtle.digest("SHA-256", encryptedArrayWithMAC)

        const isCorrectHash = isUint8ArrayEqual(new Uint8Array(hash), ciphertextHash)
        if (!isCorrectHash) {
            hal.log("haCrypto/decryptImageOrNonStreamVideo/hash does not match")
        }

        const attachedMAC = encryptedArrayWithMAC.slice(-32)
        const encryptedBinaryArray = encryptedArrayWithMAC.slice(0, -32)

        const isHMACMatch = await verifyHMAC(SHA256Key, encryptedBinaryArray, attachedMAC)
        if (!isHMACMatch) {
            hal.log("haCrypto/decryptImageOrNonStreamVideo/mismatch HMAC")
        }

        const decryptedBinaryArray = await decryptBinArr(AESKey, IV, encryptedBinaryArray)

        return decryptedBinaryArray
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
            ["sign", "verify"]
        )
        .catch((error) => { hal.log("haCrypto/verifyHMAC/importKey error: " + error) })

        const isValid = await window.crypto.subtle.verify(
            algorithm,
            baseKey as CryptoKey,
            signature,
            ciphertext
        )
        .catch((error) => { hal.log("haCrypto/verifyHMAC/verify error: " + error) })

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
            .catch((error) => { hal.log("haCrypto/attachHMAC/importKey error: " + error) })

        const signature = await window.crypto.subtle.sign(
            algorithm,
            baseKey as CryptoKey,
            ciphertext
        )
            .catch((error) => { hal.log("haCrypto/attachHMAC/verify error: " + error) })

        // concatenate ArrayBuffer
        let encryptedArrayWithMAC = new Uint8Array(signature?.byteLength + ciphertext.byteLength)
        encryptedArrayWithMAC.set(new Uint8Array(ciphertext), 0)
        if (signature) {
            encryptedArrayWithMAC.set(new Uint8Array(signature), ciphertext?.byteLength)
        }
        return encryptedArrayWithMAC
    }

    async function encryptBinArr(rawKey: any, IV: any, plaintext: any) {
        const baseKey = await window.crypto.subtle.importKey(
            "raw",
            rawKey,
            "AES-CBC",
            true,
            ["encrypt"]
        )
            .catch((error) => { hal.log("haCrypto/encryptBinArr/importKey error: " + error) })

        const encryptedBinaryArray = await window.crypto.subtle.encrypt(
            { name: "AES-CBC", iv: IV },
            baseKey as CryptoKey,
            plaintext
        )
            .catch((error) => { hal.log("haCrypto/encryptBinArr/encrypt error: " + error) })

        return encryptedBinaryArray
    }

    async function decryptBinArr(rawKey: any, IV: any, ciphertext: any) {
        const baseKey = await window.crypto.subtle.importKey(
            "raw",
            rawKey,
            "AES-CBC",
            true,
            ["decrypt"]
        )
        .catch((error) => { hal.log("haCrypto/decryptBinArr/importKey error: " + error) })

        const decryptedCiphertext = await window.crypto.subtle.decrypt(
            { name: "AES-CBC", iv: IV },
            baseKey as CryptoKey,
            ciphertext
        )
        .catch((error) => { hal.log("haCrypto/decryptBinArr/decrypt error: " + error) })

        if (!decryptedCiphertext) return undefined
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
        let keypair = nacl.box.keyPair()
        let encryptionKey = keypair.secretKey as Uint8Array
        return encryptionKey
    }


    async function encryptVideo(plaintextArray: Uint8Array, encryptionKey: Uint8Array, chunkSize: number) {

        const encryptedchunksArr = []
        let chunkCounter = 0
        for (let i = 0; i < plaintextArray.length; i += chunkSize) {
            const chunkplaintextArray = plaintextArray.slice(i, i + chunkSize)
            const chunkInfo = videoInfo + ' ' + chunkCounter
            const encryptedChunkBuffer = await encryptChunk(chunkplaintextArray, encryptionKey, chunkInfo)
            encryptedchunksArr.push(encryptedChunkBuffer)
            chunkCounter++
        }

        const combinedBinArr = combineBinaryArrays(encryptedchunksArr)
        const encryptedBuffer = combinedBinArr.buffer as ArrayBuffer

        // count chunksize and blobsize after encryption
        const encryptedChunkSize = encryptedchunksArr[0].byteLength
        const encryptedBufferSize = encryptedBuffer.byteLength

        // calculate hash
        const hash = await crypto.subtle.digest("SHA-256", combinedBinArr)
        const ciphertextHash = new Uint8Array(hash)

        return { encryptedBuffer, ciphertextHash, encryptedChunkSize, encryptedBufferSize }
    }


    async function encryptChunk(plaintextChunk: any, encryptionKey: any, chunkInfo: any) {
        const derivedKeyObj = await getDerivedKey(encryptionKey, chunkInfo)
        const derivedKey = derivedKeyObj.key

        const IV = derivedKey.slice(0, 16)
        const AESKey = derivedKey.slice(16, 48)
        const SHA256Key = derivedKey.slice(48, 80)

        const plaintextChunkBuffer = await new Response(plaintextChunk).arrayBuffer()

        // encryt plain text
        const encryptedBinaryChunk = await encryptBinArr(AESKey, IV, plaintextChunkBuffer)

        // add HMAC
        const encryptedChunkWithMAC = await attachHMAC(SHA256Key, encryptedBinaryChunk)

        /* hal.log(
            'haCrypto/encryptChunk/' +
            'chunk Info: ' + chunkInfo + 
            '\nplaintextArray: ' + plaintextChunkBuffer.byteLength + 
            '\nencryptedBinaryArray' + encryptedBinaryChunk.byteLength +
            '\nencryptedArrayWithMAC' + encryptedChunkWithMAC.byteLength) */

        // hal.log('haCrypto/encryptChunk/Encrypted chunk ' + chunkInfo)
        return encryptedChunkWithMAC
    }


    function combineBinaryArrays(arrays: any) {
        let totalLength = arrays.reduce((a: any, b: any) => a + b.byteLength, 0)
        let result = new Uint8Array(totalLength)
        let offset = 0
        for (let arr of arrays) {
            result.set(arr, offset)
            offset += arr.byteLength
        }
        return result
    }


    async function decryptVideo(encryptedBuffer: ArrayBuffer, ciphertextHash: Uint8Array, 
        decryptionKey: Uint8Array, chunkSize: number) {
        const encryptedArray = new Uint8Array(encryptedBuffer)

        // check hash
        const hash = await crypto.subtle.digest("SHA-256", encryptedArray)
        const isCorrectHash = isUint8ArrayEqual(new Uint8Array(hash), ciphertextHash)
        if (!isCorrectHash) {
            hal.log('haCrypto/decryptVideo/hash does not match')
        }

        const chunksArr = []
        let chunkCounter = 0
        for (let i = 0; i < encryptedArray.length; i += chunkSize) {
            const chunkWithMAC = encryptedArray.slice(i, i + chunkSize)
            const chunkInfo = videoInfo + ' ' + chunkCounter
            const decryptedBinArr = await decryptChunk(chunkWithMAC, decryptionKey, chunkInfo)
            chunksArr.push(decryptedBinArr)
            chunkCounter++
        }

        const combinedBinArr = combineBinaryArrays(chunksArr)
        return combinedBinArr
    }

    async function decryptChunk(encryptedArray: any, decryptionKey: any, chunkInfo: any) {
        const derivedKeyObj = await getDerivedKey(decryptionKey, chunkInfo)
        const derivedKey = derivedKeyObj.key

        const IV = derivedKey.slice(0, 16)
        const AESKey = derivedKey.slice(16, 48)
        const SHA256Key = derivedKey.slice(48, 80)

        const MAC = encryptedArray.slice(-32)
        const chunk = encryptedArray.slice(0, -32)

        /* hal.log(
            'haCrypto/decryptChunk/' +
            'chunk Info: ' + chunkInfo + 
            '\nMAC: ' + MAC.byteLength + 
            '\nchunk: ' + chunk.byteLength +
            '\nencryptedArrayWithMAC: ' + encryptedArray.byteLength) */

        const isHMACMatch = await verifyHMAC(SHA256Key, chunk, MAC)
        if (!isHMACMatch) {
            hal.log('haCrypto/decryptChunk/' + chunkInfo + '/mismatch HMAC')
        }

        const decryptedBinArr = await decryptBinArr(AESKey, IV, chunk)
        return decryptedBinArr
    }


    async function decryptStream(reader: any, ciphertextHash: Uint8Array, 
        decryptionKey: Uint8Array, chunkSize: number, fullBinArr: Uint8Array, mp4box: any) {
        
        let fullBinArrOffset = 0
        let chunkCounter = 0
    
        let videoInfoCount  = 0 // info for decryption, starts at 0
        let fileStartOffset = 0 // mp4box file offset, starts at 0

        while (true) {
            const { value, done } = await reader.read()
            if (done) {
                hal.log('haCrypto/decryptStream/finish fetching')
    
                // check hash of full binary array
                const hash = await crypto.subtle.digest("SHA-256", fullBinArr)
                const isCorrectHash = isUint8ArrayEqual(new Uint8Array(hash), ciphertextHash)
                if (!isCorrectHash) {
                    hal.log('haCrypto/decryptStream/hash does not match')
                }
        
                let start = chunkCounter * chunkSize
                let end = (chunkCounter + 1) * chunkSize
                const chunkWithMAC = fullBinArr.slice(start, end)
                const chunkInfo = videoInfo + ' ' + videoInfoCount
                const decryptedBinArr = await decryptChunk(chunkWithMAC, decryptionKey, chunkInfo)
    
                if (decryptedBinArr) {
                    let buf: any = decryptedBinArr.buffer
                    buf.fileStart = fileStartOffset
                    mp4box.appendBuffer(buf)
                } else {
                    hal.log('haCrypto/decryptStream/done/error')
                }
    
                break
            }
    
            // copies received data to full binary array
            fullBinArr.set(value, fullBinArrOffset)
    
            const presetChunkedOffset = chunkCounter * chunkSize
            const diffOffset = fullBinArrOffset - presetChunkedOffset
    
            fullBinArrOffset += value.length
    
            let chunksToProcess = Math.floor((diffOffset + value.length)/chunkSize)
       
            for(let i = 0; i < chunksToProcess; i++) {
             
                let start = chunkCounter * chunkSize
                let end = (chunkCounter + 1) * chunkSize
                const chunkWithMAC = fullBinArr.slice(start, end)
                const chunkInfo = videoInfo + ' ' + videoInfoCount
                const decryptedBinArr = await decryptChunk(chunkWithMAC, decryptionKey, chunkInfo)
    
                if (decryptedBinArr) {
                    let buf: any = decryptedBinArr.buffer
                    buf.fileStart = fileStartOffset
                    mp4box.appendBuffer(buf)
                
                    chunkCounter++
                    videoInfoCount++
                    fileStartOffset += decryptedBinArr.length
                } else {
                    hal.log('haCrypto/decryptStream/error')
                    break
                }
            }
        }
    }

    return { 
        getDerivedKey, 
        encryptImageOrNonStreamVideo, encryptVideo,
        decryptChunk, decryptBinArr,
        decryptImageOrNonStreamVideo,
        decryptVideo, decryptStream,
        verifyHMAC,
        keygen,
        isUint8ArrayEqual, combineBinaryArrays
    }
}