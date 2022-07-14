import halogger from '../common/halogger'

export function useHAMediaResize() {

    // for composer
    const maxBoxWidthBigSquare = 300
    const maxBoxHeightBigSquare = 300

    const maxBoxWidthSquare = 150
    const maxBoxHeightSquare = 150

    const maxBoxWidthVerticalRectangle = 150
    const maxBoxHeightVerticalRectangle = 300

    const maxBoxWidthHorizontalRectangle = 305
    const maxBoxHeightHorizontalRectangle = 150

    // for mini media carousel
    const maxBoxWidthMiniSquare = 50
    const maxBoxHeightMiniSquare = 50 

    // for reply
    const maxBoxWidthSmallSquare = 80
    const maxBoxHeightSmallSquare = 80 

    const defaultRatioSquare = 1
    const defaultRatioVerticalRectangle = 0.5
    const defaultRatioHorizontalRectangle = 305/150

    let maxBoxWidth = maxBoxWidthSquare
    let maxBoxHeight = maxBoxHeightSquare
    let defaultRatio = defaultRatioSquare // 3/4 width/height portrait ratio

    function setMediaSizeInMediaList(mediaList: any) {
        if (!mediaList) { return }

        let numberOfMedia = mediaList.length

        if (numberOfMedia >= 3) {
            maxBoxWidth = maxBoxWidthSquare
            maxBoxHeight = maxBoxWidthSquare
            defaultRatio = defaultRatioSquare
        }
        else if (numberOfMedia == 2) {
            maxBoxWidth = maxBoxWidthVerticalRectangle
            maxBoxHeight = maxBoxHeightVerticalRectangle
            defaultRatio = defaultRatioVerticalRectangle
        }
        else if (numberOfMedia == 1) {
            maxBoxWidth = maxBoxWidthBigSquare
            maxBoxHeight = maxBoxHeightBigSquare
            defaultRatio = defaultRatioSquare
        }

        for (let i = 0; i < mediaList.length; i++) {
            let media = mediaList[i]
            let res: any
            // last media if there are 3 media
            if (i == 2 && mediaList.length == 3) {
                maxBoxWidth = maxBoxWidthHorizontalRectangle
                maxBoxHeight = maxBoxHeightHorizontalRectangle
                defaultRatio = defaultRatioHorizontalRectangle
                res = setMediaSizes(media, -1)
            }
            res = setMediaSizes(media, numberOfMedia)
            media.width = res?.mediaItemWidth
            media.height = res?.mediaItemHeight
        }
    }

    function setMediaSizes(media: any, numberOfMedia: number) {
        if (!media) { return }

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
        else if (numberOfMedia == 2 || numberOfMedia == -1) {
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

        maxBoxWidth = maxBoxWidthMiniSquare
        maxBoxHeight = maxBoxHeightMiniSquare

        defaultRatio = defaultRatioSquare // 1/1 width/height portrait ratio
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

        maxBoxHeight = maxBoxWidthSmallSquare
        maxBoxWidth = maxBoxHeightSmallSquare

        defaultRatio = defaultRatioSquare // 1/1 width/height portrait ratio
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