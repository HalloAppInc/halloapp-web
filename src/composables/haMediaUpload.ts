import { useMainStore } from '../stores/mainStore'
import { useConnStore } from '../stores/connStore'

export function useHAMediaUpload() {

    const mainStore = useMainStore()
    const connStore = useConnStore()

    async function sendMediaToServer(file: any, putUrl: string) {

        let status = -1
    
        while (status !== 200) {
            let response = await fetch(mainStore.devCORSWorkaroundUrlPrefix + putUrl,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: file
                })
    
            status = response.status
            // console.log('PUT status =', response.status)
        }
    }

    async function getMediaFromServer(getUrl: string) {

        const request = new Request(mainStore.devCORSWorkaroundUrlPrefix + getUrl)
    
        let status = -1
        let response: any
    
        while (status !== 200) {
            response = await fetch(request)
            status = response.status
        }
    
        let mediaBlob: Blob = await response.blob()
        const mediaBlobUrl = URL.createObjectURL(mediaBlob)
        return mediaBlobUrl
    }

    async function uploadAndDownLoad(file: any, list: any) {
        // if the file is valid
        if (file) {
            connStore.getMediaUrl(1000, async function (val: any) {
                // upload
                await sendMediaToServer(file, val.iq?.uploadMedia?.url?.put)
                // download
                await getMediaFromServer(val.iq?.uploadMedia?.url?.get).then(
                    (res) => {
                        list.push(res)
                    }
                )
            })
        }
    }

    return { uploadAndDownLoad }
}