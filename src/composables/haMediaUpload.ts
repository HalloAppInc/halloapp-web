import { useMainStore } from '../stores/mainStore'
import { useConnStore } from '../stores/connStore'
import { resolveComponent } from 'vue'

export function useHAMediaUpload() {

    const mainStore = useMainStore()
    const connStore = useConnStore()

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

        if (!mainStore.isConnectedToServer) { return }

        const request = new Request(mainStore.devCORSWorkaroundUrlPrefix + getUrl)
    
        let status = -1
        let remainRetryTimes = 3
        let response: any
    
        while (status != 200 && remainRetryTimes > 0) {
            response = await fetch(request)
            status = response.status
            remainRetryTimes -= 1
        }

        let mediaBlobUrl = ''
    
        // use up all the retry and still fail
        if (remainRetryTimes == 0 && status != 200) {
            console.log('HTTP GET: Fail to download, status =', status)
        }
        // succeed
        else {
            let mediaBlob: Blob = await response.blob()
            mediaBlobUrl = URL.createObjectURL(mediaBlob)
        }

        return {status, mediaBlobUrl}
    }

    async function uploadAndDownLoad(file: any, list: any) {
        // if the file is valid
        if (file) {
            await connStore.getMediaUrl(1000, async function (val: any) {
                // upload
                let resultPUT = await sendMediaToServer(file, val.iq?.uploadMedia?.url?.put)
                // proceed when upload succeessfully
                if (resultPUT == 200) {
                    // download
                    let resultGET = await getMediaFromServer(val.iq?.uploadMedia?.url?.get)
                    // if download success
                    if (resultGET?.status == 200) {
                        list.push(resultGET?.mediaBlobUrl)
                    }
                }
            })
        }
    }

    return { uploadAndDownLoad }
}