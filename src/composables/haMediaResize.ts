import halogger from '../common/halogger'

export function useHAMediaResize() {

    let maxBoxHeight = 400
    let maxBoxWidth = 300

    let longImageWidth = 400
    let longImageHeight = 100

    let defaultRatio = 0.75 // 3/4 width/height portrait ratio

    function setMediaSizeInMediaList(mediaList: any) {
        if (!mediaList) { return }

        let numberOfMedia = mediaList.length

        if (numberOfMedia >= 3) {
            maxBoxWidth = 150
            maxBoxHeight = 150
            defaultRatio = 1
        }
        else if (numberOfMedia == 2) {
            maxBoxWidth = 150
            maxBoxHeight = 300
            defaultRatio = 0.5
        }
        else {
            maxBoxHeight = 300
            maxBoxWidth = 300
            defaultRatio = 1
        }

        for (let i = 0; i < mediaList.length; i++) {
            let media = mediaList[i]
            let res: any
            // last media if there are 3 media
            if (i == 2 && mediaList.length == 3) {
                maxBoxWidth = 305
                maxBoxHeight = 150
                defaultRatio = 305/150
                res = setMediaSizes(media, -1)
            }
            res = setMediaSizes(media, numberOfMedia)
            media.width = res?.mediaItemWidth
            media.height = res?.mediaItemHeight
        }
    }

    function setMediaSizes(media: any, numberOfMedia: number) {
        if (!media) { return }

        /* const type = media.image ? MediaType.Image : MediaType.Video
        let mediaItem: any
        if (type == MediaType.Image) {
            mediaItem = media.image
        } else if (type == MediaType.Video) {
            mediaItem = media.video
        } */

        let mediaItemWidth: number = media.width
        let mediaItemHeight: number = media.height
        const mediaItemRatio = mediaItemWidth / mediaItemHeight

        // Square
        if (numberOfMedia >= 3 || numberOfMedia == 1) {
            if (mediaItemRatio > defaultRatio) {
                mediaItemWidth = maxBoxWidth * mediaItemRatio
                mediaItemHeight = maxBoxHeight
            } else {
                mediaItemWidth = maxBoxWidth
                mediaItemHeight = maxBoxHeight / mediaItemRatio
            }
        }
        // rectangle
        else if (numberOfMedia == 2) {
            if (mediaItemRatio > defaultRatio) {
                mediaItemWidth = maxBoxHeight * mediaItemRatio
                mediaItemHeight = maxBoxHeight
            } else {
                mediaItemWidth = maxBoxWidth
                mediaItemHeight = maxBoxWidth / mediaItemRatio
            }
        }
        /* else if (numberOfMedia == 1) {
            // if image height is too big
            if (mediaItemHeight > maxBoxHeight) {
                if (mediaItemRatio > defaultRatio) {
                    mediaItemWidth = maxBoxWidth
                    mediaItemHeight = mediaItemWidth / mediaItemRatio
                }
                // width:height = 3:4 ~ 1:2
                else if (mediaItemRatio > 0.5) {
                    mediaItemHeight = maxBoxHeight
                    mediaItemWidth = mediaItemHeight * mediaItemRatio
                }
                // width:height > 1:2
                else {
                    mediaItemWidth = maxBoxWidth
                    mediaItemHeight = maxBoxHeight
                }
            }
            // width is too big
            else if (mediaItemWidth > maxBoxWidth) {
                // long image 
                // width : height > 2:1
                if (mediaItemRatio > 2) {
                    mediaItemWidth = longImageWidth
                    mediaItemHeight = longImageHeight
                }
                // width : height = 2:1 ~ 3 : 4
                else if (mediaItemRatio > defaultRatio) {
                    mediaItemWidth = maxBoxWidth
                    mediaItemHeight = mediaItemWidth / mediaItemRatio
                }
            }
        } */
        else if (numberOfMedia == -1) {
            // last media if there are 3 media
            if (mediaItemRatio > defaultRatio) {
                mediaItemWidth = maxBoxHeight * mediaItemRatio
                mediaItemHeight = maxBoxHeight
            } else {
                mediaItemWidth = maxBoxWidth
                mediaItemHeight = maxBoxWidth / mediaItemRatio
            }
        }

        return { mediaItemWidth, mediaItemHeight }
    }

    function setPreviewMediaSizes(media: any) {
        if (!media) { return }

        /* const type = media.image ? MediaType.Image : MediaType.Video
        let mediaItem: any
        if (type == MediaType.Image) {
            mediaItem = media.image
        } else if (type == MediaType.Video) {
            mediaItem = media.video
        } */

        maxBoxHeight = 50
        maxBoxWidth = 50

        defaultRatio = 1 // 1/1 width/height portrait ratio
        let mediaItemWidth: number = media.width
        let mediaItemHeight: number = media.height

        const mediaItemRatio = mediaItemWidth / mediaItemHeight
        if (mediaItemRatio > defaultRatio) {
            mediaItemWidth = maxBoxHeight * mediaItemRatio
            mediaItemHeight = maxBoxHeight
        } else {
            mediaItemWidth = maxBoxWidth
            mediaItemHeight = maxBoxWidth / mediaItemRatio
        }

        return { mediaItemWidth, mediaItemHeight }
    }

    function setQuoteMediaSize(media: any) {
        if (!media) { return }

        maxBoxHeight = 80
        maxBoxWidth = 80

        defaultRatio = 1 // 1/1 width/height portrait ratio

        let mediaItemWidth: number = media.width
        let mediaItemHeight: number = media.height

        const mediaItemRatio = mediaItemWidth / mediaItemHeight
        if (mediaItemRatio > defaultRatio) {
            mediaItemWidth = maxBoxHeight * mediaItemRatio
            mediaItemHeight = maxBoxHeight
        } else {
            mediaItemWidth = maxBoxWidth
            mediaItemHeight = maxBoxWidth / mediaItemRatio
        }

        return { mediaItemWidth, mediaItemHeight }
    }

    return { setMediaSizeInMediaList, setPreviewMediaSizes, setQuoteMediaSize }
}