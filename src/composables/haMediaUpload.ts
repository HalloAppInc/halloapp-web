import { useMainStore } from '../stores/mainStore'
import { useConnStore } from '../stores/connStore'

import { Base64 } from 'js-base64'
import { clients } from '../proto/clients.js'
import hal from '../common/halogger'
import hkdf from 'js-crypto-hkdf'

export function useHAMediaUpload() {

    const imageInfo = Base64.fromBase64("SGFsbG9BcHAgaW1hZ2U=")
    const videoInfo = Base64.fromBase64("SGFsbG9BcHAgdmlkZW8=") 

    const mainStore = useMainStore()
    const connStore = useConnStore()

    function saveMetaDataFromImage(file: any, uploadFiles: any) {
        let img = new Image()
        img.onload = function () {
            uploadFiles.push({
                'file': file,
                'preview': img.src,
                'type': 'image',
                'url': img.src,
                'width': img.width,
                'height': img.height
            })      
        }
        img.src = URL.createObjectURL(file)
    }

    function saveMetaDataFromVideo(file: any, uploadFiles: any) {
        const canvas = document.createElement('canvas')
        const video = document.createElement('video')
        const source = document.createElement('source')
        const context = canvas.getContext('2d')
        const url = URL.createObjectURL(file)
        const urlRef = url
    
        video.style.display = 'none'
        canvas.style.display = 'none'
    
        source.setAttribute('src', urlRef)
        video.setAttribute('crossorigin', 'anonymous')
    
        video.appendChild(source)
        document.body.appendChild(canvas)
        document.body.appendChild(video)
    
        if (!context) {
            console.log(`Couldn't retrieve context 2d`)
            return
        }
    
        video.currentTime = 0.1
        video.load()
        video.addEventListener('loadedmetadata', function () {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
        })
    
        video.addEventListener('loadeddata', function () {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
            canvas.toBlob((blob) => {
                if (blob) {
                    let img = new File([blob], 'preview')
                    uploadFiles.push({
                        'file': file,
                        'preview': URL.createObjectURL(img),
                        'type': 'video',
                        'url': url,
                        'width': video.videoWidth,
                        'height': video.videoHeight,
                    })
                }
                video.remove()
                canvas.remove()
            })
        })
    }

    async function encrypt(plaintext: any) {
        const base64Key = "ni-rEmBOXV4bUpuX1NGh"
        const base64Blob = "c8lxbGwFwYBOomnApInTTqiIX8rB7DGR9p6WSeDMFBQFK4qs4YUj8E5E7TVd28tbqgP6_jRWqEm19sat-99mMA2u-_tHJxHG5N9QuklFJ47vEePHV70OwcSZj8LcNRVwbbVLXFLmwsWR3X3kIgsU87P-x1BNxTOJOGMtIB8kcXXthGGGfVJXlWd7H0LqCPsvmV7t1a5v6WEA7ww0ymuqwJ4OyqW7DksxOaISfhPOw2ryo78KMc6-bY9cZU7g9zdYAozdcle65pZcDh4RdQyAdzstQhK67HbuLVLRwkfa6tq2Sx-zzWKQjy8j6_G7h5lKNRhIkKzVDFDS1MMuH_qqqVc16rMvy5PgZ0HVEwrGUV5wXj-8LQ570bmOGxGg68wDH-feQW44ONo7QTx-hCj-oW99y8KJ55vD93n19oH76aV8sSYIJ59dY3L3zLG3b3Xb3hCieXnVrbJP-aBR1ozxRA0kk5MzcuzcKcB1DtuIKnjdyWse4YE8O81J-dyYyj_x3BugFj_6zcH3uzEtfvUnt5Myikn33qihk6k1sD-GMV0"

        const key = Base64.toUint8Array(base64Key)
        const blobArrayWithMAC = Base64.toUint8Array(base64Blob)

        const derivedKeyObj = await getDerivedKey(key, imageInfo)
        const derivedKey = derivedKeyObj.key

        const IV = derivedKey.slice(0, 16)
        const AESKey = derivedKey.slice(16, 48)
        const SHA256Key = derivedKey.slice(48, 80)

        const plaintextArray = await new Response(plaintext).arrayBuffer()
    
        // encryt plain text
        const encryptedBinaryArray = await encryptMedia(AESKey, IV, plaintextArray)

        // add HMAC
        const encryptedArrayWithMAC = await attachHMAC(SHA256Key, encryptedBinaryArray)
        
        // calculate hash
        const hash = await crypto.subtle.digest("SHA-256", encryptedArrayWithMAC)
        const ciphertextHash = new Uint8Array(hash)

        const encryptedBuffer = encryptedArrayWithMAC.buffer

        return {encryptedBuffer, ciphertextHash}

    }

    async function decrypt(encryptedBuffer: any, ciphertextHash: any) {
        const base64Key = "ni-rEmBOXV4bUpuX1NGh"
        const base64Blob = "c8lxbGwFwYBOomnApInTTqiIX8rB7DGR9p6WSeDMFBQFK4qs4YUj8E5E7TVd28tbqgP6_jRWqEm19sat-99mMA2u-_tHJxHG5N9QuklFJ47vEePHV70OwcSZj8LcNRVwbbVLXFLmwsWR3X3kIgsU87P-x1BNxTOJOGMtIB8kcXXthGGGfVJXlWd7H0LqCPsvmV7t1a5v6WEA7ww0ymuqwJ4OyqW7DksxOaISfhPOw2ryo78KMc6-bY9cZU7g9zdYAozdcle65pZcDh4RdQyAdzstQhK67HbuLVLRwkfa6tq2Sx-zzWKQjy8j6_G7h5lKNRhIkKzVDFDS1MMuH_qqqVc16rMvy5PgZ0HVEwrGUV5wXj-8LQ570bmOGxGg68wDH-feQW44ONo7QTx-hCj-oW99y8KJ55vD93n19oH76aV8sSYIJ59dY3L3zLG3b3Xb3hCieXnVrbJP-aBR1ozxRA0kk5MzcuzcKcB1DtuIKnjdyWse4YE8O81J-dyYyj_x3BugFj_6zcH3uzEtfvUnt5Myikn33qihk6k1sD-GMV0"

        const key = Base64.toUint8Array(base64Key)
        const blobArrayWithMAC = Base64.toUint8Array(base64Blob)

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
    
        const decryptedBinaryArray = await decryptMedia(AESKey, IV, encryptedBinaryArray)
    
        return new Blob([decryptedBinaryArray])
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

    async function verifyHMAC(rawKey: any, ciphertext: any, signature: any) {
        const algorithm =  { name: "HMAC", hash: "SHA-256" }
        const baseKey = await window.crypto.subtle.importKey(           
            "raw",
            rawKey,                                                 
            algorithm,
            false,
            ["verify"]
        )
        .catch( (error) => { hal.log("verifyHMAC/importKey error: " + error) })
        
        const isValid = await window.crypto.subtle.verify(
            algorithm,
            baseKey as CryptoKey,
            signature,
            ciphertext
        )
        .catch( (error) => { hal.log("verifyHMAC/verify error: " + error) })
    
        return isValid
    }

    async function attachHMAC(rawKey: any, ciphertext: any) {
        const algorithm =  { name: "HMAC", hash: "SHA-256" }
        const baseKey = await window.crypto.subtle.importKey(           
            "raw",
            rawKey,                                                 
            algorithm,
            false,
            ["sign"]
        )
        .catch( (error) => { hal.log("attachHMAC/importKey error: " + error) })
        
        const signature = await window.crypto.subtle.sign(
            algorithm,
            baseKey as CryptoKey,
            ciphertext
        )
        .catch( (error) => { hal.log("attachHMAC/verify error: " + error) })

        // concatenate ArrayBuffer
        let encryptedArrayWithMAC = new Uint8Array(signature?.byteLength + ciphertext.byteLength)
        encryptedArrayWithMAC.set(new Uint8Array(ciphertext), 0)
        if ( signature ) {
            encryptedArrayWithMAC.set(new Uint8Array(signature), ciphertext?.byteLength)
        }
        return encryptedArrayWithMAC
    }

    async function getDerivedKey(secret: any, info: any) {
        const derivedKeyObj = await hkdf.compute(secret, 'SHA-256', 80, info, new Uint8Array())
        return derivedKeyObj
    }

    async function encryptMedia(rawKey: any, IV: any, plaintext: any) {
        const baseKey = await window.crypto.subtle.importKey(           
            "raw",
            rawKey,                                                 
            "AES-CBC",
            true,
            ["encrypt"]
        )
        .catch( (error) => { hal.log("encryptMedia/importKey error: " + error) })

        const encryptedBinaryArray = await window.crypto.subtle.encrypt(
            { name: "AES-CBC", iv: IV },
            baseKey as CryptoKey,
            plaintext
        )
        .catch( (error) => { hal.log("encryptMedia/encrypt error: " + error) })

        return encryptedBinaryArray
    }

    async function decryptMedia(rawKey: any, IV: any, ciphertext: any) {
        const baseKey = await window.crypto.subtle.importKey(           
            "raw",
            rawKey,                                                 
            "AES-CBC",
            true,
            ["decrypt"]
        )
        .catch( (error) => { hal.log("decryptMedia/importKey error: " + error) })
        
        const decryptedCiphertext = await window.crypto.subtle.decrypt(
            { name: "AES-CBC", iv: IV },
            baseKey as CryptoKey,
            ciphertext
        )
        .catch( (error) => { hal.log("decryptMedia/decrypt error: " + error) })
    
        let decryptedCiphertextArray = new Uint8Array(decryptedCiphertext)
        return decryptedCiphertextArray
    }

    async function testEncryptionAndDecryption(file: any) {
        const fileBlob = new Blob([file])
        const encryptedFile = await encrypt(fileBlob)
        const decryptedBlob = await decrypt(encryptedFile.encryptedBuffer, encryptedFile.ciphertextHash)

        const DecryptedFile = new File([decryptedBlob], "img")

        console.log('Is same =', file.toString() === DecryptedFile.toString())

        /* console.log('plaintext=', file,
                    'fileBlob=', fileBlob,
                    'encryptedBlob=', encryptedFile,
                    'decryptedBlob=', decryptedBlob,
                    'decryptedFile=', DecryptedFile) */
        
        return decryptedBlob

    }

    async function sendMediaToServer(file: any, putUrl: string) {

        if (!mainStore.isConnectedToServer) { return }

        let status = -1
        let remainRetryTimes = 3
    
        while (status != 200 && remainRetryTimes > 0) {
            let response = await fetch(mainStore.devCORSWorkaroundUrlPrefix + putUrl,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: file
                })
    
            status = response.status
            remainRetryTimes -= 1
        }

        // use up all the retry and still fail
        if (remainRetryTimes == 0 && status != 200) {
            console.log('HTTP PUT: Fail to upload, status =', status)
        }

        return status
    }

    async function getMediaFromServer(getUrl: string) {
        
        let status = -1
        let recvBlob: any = {}

        if (!mainStore.isConnectedToServer) {  return { status, recvBlob }}

        const request = new Request(mainStore.devCORSWorkaroundUrlPrefix + getUrl)
    
        let remainRetryTimes = 3
        let response: any
    
        while (status != 200 && remainRetryTimes > 0) {
            response = await fetch(request)
            status = response.status
            remainRetryTimes -= 1
        }
    
        // use up all the retry and still fail
        if (remainRetryTimes == 0 && status != 200) {
            console.log('HTTP GET: Fail to download, status =', status)
        }
        // succeed
        else {
            recvBlob = await response.blob()
        }

        return { status, recvBlob }
    }

    async function uploadAndDownLoad(file: any, list: any, type: any) {        // if the file is valid
        if (file) {
            // testEncryptionAndDecryption(file)
            //upload and download
            if (type == 'image') {
                await connStore.getMediaUrl(1000, async function (val: any) {
                    // file to blob, encrypt and upload
                    const fileBlob = new Blob([file])
                    const { encryptedBuffer, ciphertextHash } = await encrypt(fileBlob)
                    let resultPUT = await sendMediaToServer(encryptedBuffer, val.iq?.uploadMedia?.url?.put)
                    // proceed when upload succeessfully
                    if (resultPUT == 200) {
                        // download
                        const { status, recvBlob } = await getMediaFromServer(val.iq?.uploadMedia?.url?.get)
                        // if download success
                        if (status == 200) {
                            // convert from blob to ArrayBuffer
                            const recvEncryptedBuffer = await new File([recvBlob], '').arrayBuffer()
                            // decrypt the arrayBuffer
                            const decryptedBlob = await decrypt(recvEncryptedBuffer, ciphertextHash)
                            const mediaBlobUrl = URL.createObjectURL(decryptedBlob)
                            list.push(mediaBlobUrl)
                        }
                    }
                })
            }
            else {
                // upload video
            }
        }
        else {
            hal.log('uploadAndDownLoad: file not exists!')
        }
    }

    return { saveMetaDataFromImage, saveMetaDataFromVideo, uploadAndDownLoad }
}