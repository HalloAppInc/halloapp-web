<script setup lang="ts">
    import { Ref, ref, computed, nextTick, watch, onMounted, onUnmounted, onUpdated, onActivated } from 'vue'
    import { number } from '@intlify/core-base'
    import { liveQuery } from 'dexie'
    import { storeToRefs } from 'pinia'

    import { useI18n } from 'vue-i18n'
    import GraphemeSplitter from 'grapheme-splitter'
    import { alea } from 'seedrandom'

    import { db, Comment, CommonMedia, SubjectType, MediaType } from '@/db'

    import { useMainStore } from '@/stores/mainStore'
    import { useConnStore } from '@/stores/connStore'
    import { useColorStore } from '@/stores/colorStore'

    import hal from '@/common/halogger'

    import { useHAComment } from '@/composables/haComment'
    import { useTimeformatter } from '@/composables/timeformatter'
    import { useHAMediaResize } from '@/composables/haMediaResize'
    import { useHADatabase } from '@/composables/haDb'
    import { useHAText } from '@/composables/haText'
    import { useHACommonMedia } from '@/composables/haCommonMedia'
    
    import Popup from '@/components/chats/Popup.vue'
    import Quote from '@/components/msg/Quote.vue'
    import MsgLinkPreview from '@/components/msg/MsgLinkPreview.vue'
    
    import FullScreener from '@/components/media/FullScreener.vue'
    import MediaCollage from '@/components/media/MediaCollage.vue'
    import Notification from '@/components/chats/Notification.vue'

    const { getCommonMedia, fetchVoiceNote
    } = useHACommonMedia()    

    const mainStore = useMainStore()
    const connStore = useConnStore()
    const colorStore = useColorStore()

    const { requestCommentsIfNeeded } = useHAComment()

    const count = ref(50)

    const { t, locale } = useI18n({
        inheritLocale: true,
        useScope: 'global'
    })

    const { processText } = useHAText()
    const { formatTimeDateOnlyChat, formatTimeChat, formatTimeFullChat, timeDiffBiggerThanOneDay } = useTimeformatter()
    const { setMediaSizeInMediaList } = useHAMediaResize()
    const { getMessageByID, deleteMessageByID, cleanMessageContentByID, 
            loadMessageList, notifyWhenChanged, getMedia, 
            getContactByName, getContacts } = useHADatabase()

    const emit = defineEmits<{(e: 'scrolled', scrollTop: number): void}>()

    interface Props {
        type: SubjectType,
        subjectID: string, // postID
        replyQuoteIdx?: string
    }
    const props = defineProps<Props>()

    let msgObservable: any
    if (props.type == SubjectType.Comment) {
        msgObservable = liveQuery (() => db.comment.where('postID').equals(props.subjectID)
            .reverse()
            .sortBy('timestamp')
        )
    } else if (props.type == SubjectType.Chat) {

        // const groupId = props.groupID

        // msgObservable = liveQuery (() => db.post.where('groupID').equals(groupId)
        //     .reverse()
        //     .sortBy('timestamp')
        // )

    }

    if (msgObservable) {
        const subscription = msgObservable.subscribe({
            next: (result: any) => { 
                if (result) {
                    dbListData.value = result
                    makeList()
                }
            },
            error: (error: any) => console.error(error)
        })
    }

    const dbListData: Ref<any[]> = ref([])
    const listData: Ref<any[]> = ref([])    
        
    const commonMediaLists = ref({} as any) // contain arrays of commonMedia per data item

    const isInitialized = ref(false)

    async function makeList() {

        listData.value = await processDBCommentList(dbListData, count.value) as any

        for (const element of listData.value) {
        
            if (element.type == 'timestamp') { continue }

            if (props.type == SubjectType.Comment) {
                if (!commonMediaLists.value[element.commentID]) {

                    const num = await db.commonMedia.toArray()

                    const mediaArr = await getCommonMedia(SubjectType.Comment, props.subjectID, element.commentID)
                    if (mediaArr) {
                        commonMediaLists.value[element.commentID] = mediaArr

                    } 

                }
            }
        }

        if (!isInitialized.value) {
            isInitialized.value = true
            // nextTick(() => {
                
            //     shouldScrollToBottom = false
            // })
            
        }

        /* don't scroll to the bottom if user has scrolled up */
        if (!showJumpDownButton.value) {
            gotoBottom('auto')
        }

    }


    

    const menu = ref<HTMLElement | null>(null)
    const content = ref<HTMLElement | null>(null)

    const floatMenuPositionX = ref(0)
    const floatMenuPositionY = ref(0)

    const chatPanelHeight = ref(0)

    let handleScrollTimer: any
    let requestTimer: any

    const showJumpDownButton = ref(false)
    const showMenu = ref(false)
    const showReply = ref(false)
    const showFullScreener = ref({ 'value': false })
    const showPopup = ref({ 'value': false, 'type': 'delete', 'messageType': 'normal' })
    const isForDeletedMessage = ref(false)

    const selectMessageIdx = ref(-1)
    const selectMediaList = ref()
    const selectMediaIdx = ref()
    const selectMediaContentID = ref()
    
    const menuTimestamp = ref('')
    const quoteMessage = ref({})
    const NotificationQueue: Ref<string[]> = ref([])

    // set floating time stamp's content
    const currentMsgTimestamp = ref()

    const data = ref()

    const messageNumber = computed(() => {
        if (data.value) {
            return data.value.length
        }
        else {
            return 0
        }
    })

    onActivated(() => {
        if (!content.value) { return }
        let element = content.value
        element.scrollTop = savedScrollTop
    })


    // listen to msg list, when a new msg comes in, scroll to the bottom
    // watch(messageNumber, (newVal, oldVal) => {
    //     if (newVal > oldVal) {
    //         showReply.value = false
    //         nextTick(() => {
    //             gotoBottom('smooth')
    //             handleScroll()
    //         })
    //     }
    // })

    // watch(chatPanelHeight, () => {
    //     nextTick(() => {
    //         gotoBottom('auto')
    //     })
    // })

    // watch(messageListFromDB, () => {
    //     parseMessage()
    
    //     handleScroll()
    // })


    const { 
        background: backgroundColor,
        tertiaryBg: tertiaryBgColor,
        header: headerColor,
        text: textColor,
        outBoundMsgBubble: outBoundMsgBubbleColor,
        inBoundMsgBubble: inBoundMsgBubbleColor,
        timeBubble: timeBubbleColor,
        timestamp: timestampColor,
        icon: iconColor,
        hover: hoverColor,
        borderline: borderlineColor,
        nameList: nameListColors

    } = storeToRefs(colorStore)  

    function getColor(seed: string, max: number) {
        const arng = new alea(seed)
        const rand = (Math.abs(arng.int32()))
        const result = rand%max
        return nameListColors.value[result]
    }

    // console.log("-0-> " + getColor('hello', 10))
    
    // nextTick(() => {
        // handleScroll()
        // gotoBottom('auto')
        // new ResizeObserver(setChatPanelHeight).observe(content.value!)
    // })

    async function processDBCommentList(messageListFromDB: any, numMsgToShow: number) {
        let result = []

        if (!messageListFromDB.value) {
            return []
        }

        let listLength = messageListFromDB.value.length
        if (listLength > numMsgToShow) {
            listLength = numMsgToShow
        }

        for(let i = 0; i < listLength; i++) {
            const message = messageListFromDB.value[i]
    
            let formattedTime = formatTimeChat(message.timestamp, locale.value as string)
            let type = (message.userID == mainStore.userID) ? 'outBound' : 'inBound'
            // not delete
            if ( message.text != undefined) {
                let textHtml = processText(message.text, message.mentions).html
                let resMsg = appendSpaceForMsgInfo(textHtml, formattedTime, type == 'outBound')

                // let quotedMessage
                // if (message.parentCommentID) {
                //     quotedMessage = await getQuoteMessageData(message.parentCommentID)
                //     if (quotedMessage) {
                //         message.quotedMessage = quotedMessage
                //     }
                // }

                message.textHtml = textHtml
                message.textFont = resMsg[1]
            
                message.formattedTime = formattedTime
            }

            if (message.voiceNote) {
               
                const voiceNoteBlob = await fetchVoiceNote(props.type, message.voiceNote) as any

                if (voiceNoteBlob) {
                    message.voiceNoteBlobUrl = URL.createObjectURL(voiceNoteBlob)
                }
            }
            
            result.unshift(message)

            /* add timestamp bubbles */
            if (messageListFromDB.value[i + 1]) {
                const msgTimestamp = message.timestamp
                const nextMsgTimestamp = messageListFromDB.value[i+1].timestamp
                
                if (msgTimestamp && nextMsgTimestamp 
                    && timeDiffBiggerThanOneDay(msgTimestamp, nextMsgTimestamp)) {
                    result.unshift({
                        'type': 'timestamp',
                        'unixTimestamp': msgTimestamp,
                        'timestamp': formatTimeDateOnlyChat(msgTimestamp, locale.value as string),
                    })
        
                }
            }
            /* add timestamp to the last of the messages */ 
            else {
                if (message.timestamp) {
                    result.unshift({
                        'type': 'timestamp',
                        'timestamp': formatTimeDateOnlyChat(message.timestamp, locale.value as string),
                    })
                    
                }                
            }

        }
        return result
    }

    // add extra space after text to fit time stamp and checkmarks
    function appendSpaceForMsgInfo(msg: string, time: string, isOutBound: boolean) {
        let width = 0
        let result = ''
        if (isOutBound) {
            width = time.length * 2.5 + 15
        }
        else {
            width = time.length * 2.5 + 5
        }
        let newDiv = "<span style='padding: 0px " + width + "px;display: inline-block;'></span>" // padding:0px "+ width +"px;
        result = msg.concat(newDiv)

        let font = ''
        let lessThanThreeEmoji = false

        let splitter = new GraphemeSplitter()
        const graphemes = splitter.splitGraphemes(msg)

        if (graphemes.length <= 3) {

            lessThanThreeEmoji = true // assume true to begin
    
            const emojiRegx = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/i

            for (let i = 0; i < graphemes.length; i++) {
                if (!emojiRegx.test(graphemes[i])) {
                    lessThanThreeEmoji = false
                    break
                }
            }
        } 
        
        if (msg.length != 0 && lessThanThreeEmoji) {
            font = 'onlyEmoji'
        }
        else {
            font = 'noOverflow'
        }

        return [result, font]
    }

    function setChatPanelHeight() {
        chatPanelHeight.value = content.value ? content.value.clientHeight : 0
    }

    function handleScroll() {
        clearTimeout(handleScrollTimer)
        handleScrollTimer = setTimeout(debouncedHandleScroll, 15) // 15 seems the best but can be tinkered with
    }

    // when scroll the scroll bar get the scroll bar's current height
    // get the value of timestamp of the msg bubble at current floating timestamp's height
    function debouncedHandleScroll() {
        shouldScrollToBottom = false

        if (!content.value) { return }

        let contentViewportOffset = content.value.getBoundingClientRect() // offset is relative to viewport

        /* hide static timestamp bubbles when they're above the floating timestamp */
        let staticTimestampList = content.value?.getElementsByClassName('staticTimestamp')
        if (staticTimestampList) {

            for (let i = staticTimestampList.length - 1; i >= 0; i--) { // start from most recent msg
                let staticTimestamp = staticTimestampList[i] as HTMLElement

                if (staticTimestamp.offsetHeight > 0) {

                    let staticTimestampViewportOffset = staticTimestamp.getBoundingClientRect()

                    const topAreaRelativeToContent = contentViewportOffset.top + 10

                    if (staticTimestampViewportOffset.top <= topAreaRelativeToContent) {
                        staticTimestamp.style.visibility = 'hidden'
                        // break to save a little bit of cycle since each run should hide at max one timestamp
                        break
                    } else {
                        staticTimestamp.style.visibility = 'visible'
                    }
                }
            }
        }

        /* change floating timestamp */
        if (data.value && data.value.length != 0) {

            let closestElement = document.elementFromPoint(contentViewportOffset.left, contentViewportOffset.top)

            // find the timestamp in msg bubble
            let timestampEl = closestElement?.getElementsByClassName('timestamp')[0] as HTMLDivElement
            if (timestampEl) {
                let unixTimestamp = timestampEl.getAttribute('data-msg-timestamp') as string
                currentMsgTimestamp.value = formatTimeDateOnlyChat(parseInt(unixTimestamp), locale.value as string)
            }
            if (!timestampEl) {
                // find the timestamp in static timestamp bubble
                timestampEl = closestElement?.getElementsByClassName('timestampBig')[0] as HTMLDivElement
                if (timestampEl) {
                    currentMsgTimestamp.value = timestampEl.textContent
                }
            }
        }
        else {
            currentMsgTimestamp.value = 'No Messages'
        }

        /* toggle jump button visiblity */
        if (content.value &&
            content.value.scrollTop + content.value.clientHeight < content.value.scrollHeight - 50) {
            showJumpDownButton.value = true
        }
        else {
            showJumpDownButton.value = false
        }

        let element = content.value

        if (element.scrollTop < 100) {
            
            if (props.type == SubjectType.Comment) {
                const postID = props.subjectID

                // debounce request separately since scrolling is debounced at 15 and that's too frequent for requests
                clearTimeout(requestTimer)
                requestTimer = setTimeout(() => {
                    requestCommentsIfNeeded(postID, 30, function() {})
                }, 1000)               
                
            }

            count.value += 10
            makeList()
        }

        /* emit event so commentHeader knows to change title display */
        emit('scrolled', element.scrollTop)

        savedScrollTop = element.scrollTop
    }

    let savedScrollTop = 0 // store scroll position

    // jump to bottom
    function gotoBottom(type: ScrollBehavior | undefined) {
        // behavior can be instant(auto)/smooth
        content.value?.scrollTo({ left: 0, top: content.value?.scrollHeight, behavior: type })
    }

    async function gotoChatWith(event: any) {
        let contactName = event.target.innerText.substring(1)
        // go to chat with that user
        hal.log('ChatPanel/gotoChatWith/' + contactName)
        const contact = await getContactByName(contactName)
        if (contact) {
            mainStore.chatID = contact.userID
        }
    }

    function openMenu(event: any, forInBound: boolean, idx: number, timestamp: number) {
        showMenu.value = !showMenu.value
        // if close menu
        if (!showMenu.value) {
            return
        }

        // if this is a deleted message
        if (!timestamp) {
            isForDeletedMessage.value = true
            selectMessageIdx.value = idx
        }
        else {
            isForDeletedMessage.value = false
            menuTimestamp.value = formatTimeFullChat(timestamp, locale.value as string)
            selectMessageIdx.value = idx
        }

        // set floating menu position
        let bounds = event.target.getBoundingClientRect()
        // X position
        floatMenuPositionX.value = window.outerWidth - bounds['right']
        // if its for inbound msg, make it align right; for outbound msg align left
        if (forInBound) {
            nextTick(() => {
                if (menu.value) {
                    floatMenuPositionX.value -= menu.value.clientWidth
                }
            })
        }
        // Y position
        // clientHeight + scrollTop = scrollHeight
        if (content.value) {
            // if not overflow
            if (content.value?.scrollHeight <= content.value?.clientHeight) {
                // get floating menu's Y position
                const eleList = document.getElementsByClassName('containerChat')
                const ele = eleList[eleList.length - 1]
                floatMenuPositionY.value = -1 * ( ele.getBoundingClientRect()['bottom'] - bounds['top']) + 20
            }
            else {
                floatMenuPositionY.value = -1 * (content.value?.scrollHeight - bounds['top'] - content.value?.scrollTop) + 20
            }
            let bottomOffset = content.value?.clientHeight - bounds['top']
            // visual offset, do not let part of menu hidden under input box
            if (bottomOffset <= 80) {
                let msgBubble
                // get msg bubble's height
                if (event.target.nodeName == 'svg') {
                    msgBubble = event.target.parentElement.parentElement.parentElement
                    floatMenuPositionY.value -= msgBubble.clientHeight
                }
                else if (event.target.nodeName == 'path') {
                    msgBubble = event.target.parentElement.parentElement.parentElement.parentElement
                    floatMenuPositionY.value -= msgBubble.clientHeight
                }
                else if (event.target.nodeName == 'DIV' && event.target.className == 'togglerIconContainer') {
                    msgBubble = event.target.parentElement.parentElement
                    floatMenuPositionY.value -= msgBubble.clientHeight
                }
                
                // move 90px upwards if this message is not deleted
                if (!isForDeletedMessage.value) {
                    floatMenuPositionY.value -= 90
                }
            }
        }
    }

    // add listener on floating menu
    function closeMenu() {
        showMenu.value = false
    }

    let shouldScrollToBottom = true

    /* used for first load, scroll to bottom */
    onUpdated(() => {
        
        if (shouldScrollToBottom) {
            gotoBottom('auto')
        }
        
    })

    onMounted(() => {
        document.addEventListener("click", closeMenu)
    })

    onUnmounted(() => {
        document.removeEventListener("click", closeMenu)
    })

    function deleteMessage(id: number, deleteForEveryone: boolean) {
        // delete for everyone: delete message content in db
        if (deleteForEveryone) {
            hal.log('ChatPanel/deleteMessage/delete for everyone')
            cleanMessageContentByID(id)
        }
        // delete for me: delete whole record in db
        else {
            hal.log('ChatPanel/deleteMessage/delete for me')
            deleteMessageByID(id)
        }
    }

    function openPopup() {
        if (isForDeletedMessage.value) {
            showPopup.value.messageType = 'deleted'
        }
        else {
            showPopup.value.messageType = 'normal'
        }
        showPopup.value.value = true
    }

    function openMedia(mediaList: any, idx: number, contentID: string) {
        console.log("msgPanel/openMedia " + idx)
        console.dir(mediaList)
        selectMediaList.value = mediaList
        selectMediaIdx.value = idx
        selectMediaContentID.value = contentID
        // go to fullscreener
        showFullScreener.value.value = true
    }

    async function openReply(id: number) {
        // showReply.value = true
        // showMenu.value = false
        // // get quote message
        // props.replyQuoteIdx.value = id
        // quoteMessage.value = await getQuoteMessageData(id)
        // // set focus on inputBox
        // const ele = document.getElementsByClassName('textarea')[0] as HTMLElement
        // ele.focus()
        // // move cursor to the end
        // let range = document.createRange()
        // range.selectNodeContents(ele)
        // range.collapse(false)
        // let selection = window.getSelection()
        // if (selection) {
        //     selection.removeAllRanges()
        //     selection.addRange(range)
        // }
    }

    async function getQuoteMessageData(id: number) {
        const message = await getMessageByID(id)
        if (!message) {
            const data = {
                'id': number,
                'sender': '',
                'text': 'Message deleted'
            }
            return data
        }
        else {
            const data = JSON.parse(JSON.stringify(message))
            if (message.fromUserID == mainStore.loginUserID) {
                data['sender'] = 'YOU'
            }
            else {
                data['sender'] = 'User1'
            }
            // if has media
            if (message.mediaID != null) {
                const mediaArray = await getMedia([message.mediaID[0]]) 
                const file = new Blob([mediaArray[0].file]) 
                const newMedia: any = {
                    'type': mediaArray[0].type,
                    'width': mediaArray[0].width,
                    'height': mediaArray[0].height,
                    'url': URL.createObjectURL(file),
                }
                data['media'] = newMedia
            }
            return data
        }
    }

    function gotoQuoteMessage(commentID: string) {
        

        const targetElement = document.getElementById('messageBubble' + commentID)
        if (targetElement) {
            
            const offsetTop = targetElement.offsetTop - targetElement.offsetHeight
            content.value?.scrollTo({ left: 0, top: offsetTop, behavior: 'smooth' })
            setTimeout(() => {
                targetElement.classList.add('chatBubbleAnimation')

                setTimeout(() => {
                    
                    targetElement.classList.remove('chatBubbleAnimation')
                }, 1800)
            }, 300)
        }
      
    }


</script>

<template>

    <div class='msgPanelContent' ref='content' @scroll='handleScroll()'>
        <slot name="subHeader"></slot>
        <!-- chat msg -->
        <div v-if="isInitialized && listData.length > 0" v-for='(value, idx) in listData' class="containerChat">

            <!-- inbound msg -->
            <div v-if="value.type != 'timestamp' && value.userID != mainStore.userID" class='contentTextBody contentTextBodyInBound'
                :class="idx == 0 || (idx != 0 && listData[idx - 1].userID == mainStore.userID) ? 'chatBubbleBigMargin' : 'chatBubbleSmallMargin'">
                <div class="chatBubble chatBubbleInBound" :id="'messageBubble' + value.commentID">

                    <!-- toggler -->
                    <div class='menuToggler menuTogglerInBound'>
                        <div class='togglerIconContainer' @click.stop='openMenu($event, true, idx, value.timestamp)'>
                            <font-awesome-icon :icon="['fas', 'angle-down']" size='xs' />
                        </div>
                    </div>

                    <!-- name -->
                    <div class="name" :style="{ 'color': getColor(value.postID + value.userID.toString(), 11) }">
                        {{ mainStore.pushnames[value.userID] }}
                    </div>

                    <!-- quote -->
                    <div v-if='value.parentCommentID' class='chatReplyContainer' 
                        @click='gotoQuoteMessage(value.parentCommentID)'>
                        <Quote :type="props.type" :subjectID="props.subjectID" :contentID='value.parentCommentID' />
                    </div>

                    <div v-else-if='value.linkPreview' class='chatReplyContainer'>
                        <MsgLinkPreview :type="props.type" :subjectID="props.subjectID" :contentID='value.commentID' />
                    </div>

                    <!-- media -->
                    <div v-if='commonMediaLists && commonMediaLists[value.commentID]' class='mediaContainer' >
                        <MediaCollage  
                            :type="props.type" :subjectID="props.subjectID" :contentID="value.commentID" 
                            :mediaList='commonMediaLists[value.commentID]' 
                            @openMedia='openMedia'/>
                    </div>

                    <div v-if="value.voiceNoteBlobUrl">

                        <audio autobuffer="autobuffer" ref="$postVoiceNote" id="postVoiceNote" preload="metadata" controls controlsList="nodownload">
                            <source :src="value.voiceNoteBlobUrl" type="audio/mpeg">
                            <p>{{ t('post.noAudioSupportText') }}</p>
                        </audio>

                    </div>                    

                    <!-- text -->
                    <!-- <div class='chatTextContainer' :class='{ bigChatTextContainer: value.font == "onlyEmoji" }'> -->
                    <div class='chatTextContainer'>
                        <span v-html='value.textHtml' :class='value.textFont'>
                        </span>
                         <!-- <span v-html='processText(value.text, value.mentions, false).html'> -->
                    </div>                    

                    <!-- timestamp -->
                    <div class='msgInfoContainer' v-if='value.timestamp'>
                        <div class='msgInfoContent'>
                            <div class='timestamp' :data-msg-timestamp='value.timestamp'>
                                {{ value.formattedTime }}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- outBound msg -->
            <div v-else-if="value.type !== 'timestamp'" class='contentTextBody contentTextBodyOutBound'
                :class="idx == 0 || (idx != 0 && listData[idx - 1].userID != mainStore.userID) ? 'chatBubbleBigMargin' : 'chatBubbleSmallMargin'">
                <div class='chatBubble chatBubbleoutBound' :id='"messageBubble" + value.commentID'>

                    <!-- toggler -->
                    <div class='menuToggler menuTogglerOutBound'>
                        <div class='togglerIconContainer' @click.stop='openMenu($event, false, value.id, value.timestamp)'>
                            <font-awesome-icon :icon="['fas', 'angle-down']" size='xs' />
                        </div>
                    </div>

                    <!-- quote -->
                    <div v-if='value.parentCommentID' class='chatReplyContainer' 
                        @click='gotoQuoteMessage(value.parentCommentID)'>
                        <Quote :type="props.type" :subjectID="props.subjectID" :contentID='value.parentCommentID' />
                    </div>

                    <div v-else-if='value.linkPreview' class='chatReplyContainer'>
                        <MsgLinkPreview :type="props.type" :subjectID="props.subjectID" :contentID='value.commentID' />
                    </div>

                    <div v-if='commonMediaLists && commonMediaLists[value.commentID]' 
                        class='mediaContainer'>
                        <MediaCollage  
                            :type="props.type" :subjectID="props.subjectID" :contentID="value.commentID" 
                            :mediaList='commonMediaLists[value.commentID]' 
                            @openMedia='openMedia'/>
                    </div>

                    <div v-if="value.voiceNoteBlobUrl">

                        <audio autobuffer="autobuffer" ref="$postVoiceNote" id="postVoiceNote" preload="metadata" controls controlsList="nodownload">
                            <source :src="value.voiceNoteBlobUrl" type="audio/mpeg">
                            <p>{{ t('post.noAudioSupportText') }}</p>
                        </audio>

                    </div>


                    <!-- text -->
                    <!-- <div class='chatTextContainer' :class='{ bigChatTextContainer: value.font == "onlyEmoji" }'></div> -->
                    <div class='chatTextContainer'>
                        <!-- show message content -->
                        <!-- <span v-html='value.text' :class='value.font' @click="gotoChatWith($event)"></span> -->
                        <span v-html='value.textHtml' :class='value.textFont' @click="gotoChatWith($event)">
                        </span>
                    </div>

                    <!-- timestamp -->
                    <div class='msgInfoContainer' v-if='value.timestamp'>
                        <div class='msgInfoContent'>
                            <div class='timestamp' :data-msg-timestamp='value.timestamp'>
                                {{ value.formattedTime }}
                            </div>
                            <!-- <div class='iconContainer' :class='value.sendToAWS ? "blueIcon" : "grayIcon"'>
                                <font-awesome-icon :icon="['fas', 'check-double']" size='xs' />
                            </div> -->
                        </div>
                    </div>

                </div>
            </div>

            <!-- timestamp -->
            <div v-else-if="value.type == 'timestamp'" class='staticTimestamp contentTextBody contentTextBodyTime'>
                <div class='chatBubble chatBubbleTime'>
                    <div class='timestampContainerBig'>
                        <div class='timestampBig'>
                            {{ value.timestamp }}
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- floating timestamp -->
        <!-- <div class='containerFloatingTimestamp'>
            <div class='contentTextBody contentTextBodyTime'>
                <div class='chatBubble chatBubbleTime'>
                    <div class='timestampContainerBig'>
                        <div class='timestampBig'>
                            {{ currentMsgTimestamp }}
                        </div>
                    </div>
                </div>
            </div>
        </div> -->

        <!-- jump down button -->
        <transition name='button'>
            <div class='buttonContainer' v-show='showJumpDownButton' @click="gotoBottom('smooth')">
                <div class='buttonIconContainer'>
                    <font-awesome-icon :icon="['fas', 'angle-down']" size='lg' />
                </div>
            </div>
        </transition>


        <!-- message bubble sub menu -->
        <div class='chatSettingsContanier' v-if='showMenu' @click.stop>
            <div class='menu' ref='menu'>

                <!-- <div class='menuContainer' @mousedown='openPopup'>
                    <div class='textContainer'>
                        <div class='contentTextBody contentTextBodyForSettings'>
                            {{ t('chatMsgBubbleSettings.deleteMessage') }}
                        </div>
                    </div>
                </div>

                <div v-if='!isForDeletedMessage' class='menuContainer' @mousedown='openReply(selectMessageIdx)'>
                    <div class='textContainer'>
                        <div class='contentTextBody contentTextBodyForSettings'>
                            {{ t('chatMsgBubbleSettings.reply') }}
                        </div>
                    </div>
                </div> -->

                <div v-if='!isForDeletedMessage' class='menuTimestampLong'>
                    <div class='timestampContainerBig'>
                        <div class='timestampBig'>
                            {{ menuTimestamp }}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- popup -->
    <Popup @deleteForEveryone='deleteMessage(selectMessageIdx, true)'
        @deleteForMe='deleteMessage(selectMessageIdx, false)' 
        @confirmOk='deleteMessage(selectMessageIdx, false)'
        :showPopup='showPopup' />

    <!-- Reply -->
    <div class='containerReply' v-if='showReply'>
        <div class='containerReplyWithRightMargin'>
            <Quote :quoteMessage='quoteMessage' />
        </div>
        <div class='iconContainer closeIcon' @click="showReply = false">
            <font-awesome-icon :icon="['fas', 'xmark']" size='lg' />
        </div>
    </div>

    <!-- show media in full screen -->
    <FullScreener v-if="selectMediaContentID && selectMediaList" :key="selectMediaContentID"
        :showFullScreener='showFullScreener'
        :type="props.type"
        :subjectID="props.subjectID"
        :contentID="selectMediaContentID"
        :selectedMediaIndex='selectMediaIdx'
        :selectMediaList='selectMediaList' />

    <!-- notification -->
    <!-- <Notification :NotificationQueue='NotificationQueue'/> -->

</template>

<style scoped>
    *::-webkit-scrollbar {
        width: 10px;
    }

    *::-webkit-scrollbar-track {
        background: v-bind(tertiaryBgColor);
    }

    *::-webkit-scrollbar-thumb {
        background-color: rgb(172, 169, 169);

        border: 0px solid white;
    }

    .msgPanelContent {

        width: 100%;
        height: 100%;

        overflow-y: auto;
        overflow-x: hidden;
        padding-bottom: 50px;

        display: flex;
        flex-direction: column;

        background-color: v-bind(tertiaryBgColor);

    }

    .containerChat {
        padding: 0px;
        margin: 0px;

        display: flex;
        flex-direction: column;

    }

    .chatReplyContainer {
        margin-bottom: 10px;
    }

    .chatReplyContainer:hover {
        cursor: pointer;
    }

    .contentTextBody {
        width: 100%;

        display: flex;
        flex-direction: row;
    }

    .contentTextBodyInBound {
        align-self: flex-start;

        justify-content: flex-start;
    }

    .contentTextBodyOutBound {
        align-self: flex-end;

        justify-content: flex-end;
    }

    .contentTextBodyTime {
        align-self: center;

        justify-content: center;
    }

    .chatBubble {
        padding: 5px 5px;
        border-radius: 10px;
        position: relative;
        box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.08);
        border: 0.5px solid rgba(0, 0, 0, 0.1);
    }

    .chatBubbleAnimation {
        opacity: 1;
        animation: fade 2s linear;
        z-index: 1;
    }

    .chatBubble:hover .menuToggler {
        display: flex;
    }

    .chatBubbleInBound {
        left: 10px;
        max-width: 60%;
        min-width: 65px; /* can't be less than 65 */
        background: v-bind(inBoundMsgBubbleColor);
        overflow-x: hidden;
    }

    .chatBubbleoutBound {
        right: 10px;
        max-width: 60%;
        min-width: 65px; /* can't be less than 65 */
        background: v-bind(outBoundMsgBubbleColor);
        overflow-x: hidden;
    }

    .chatBubbleTime {
        padding: 0px 5px;
        background: v-bind(timeBubbleColor);
        border: 0.5px solid rgba(101, 61, 61, 0.2);
        box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
        border-radius: 15px;
        width: fit-content;
        margin: 10px 0px 0px 0px;
    }

    .chatBubbleSmallMargin {
        padding: 3px 0px 0px 0px;
    }

    .chatBubbleBigMargin {
        padding: 10px 0px 0px 0px;
    }

    .name {
        padding-bottom: 5px;
        font-weight: bold;
        font-size: 13px;


        align-items: center;
        letter-spacing: 0.02em;

        margin: 3px 10px 0px 5px;
    }

    .chatTextContainer {
        color: v-bind(textColor);
        font-weight: 500;
        font-size: 15px;
        line-height: 120%;

        align-items: center;
        letter-spacing: 0.02em;

        margin: 5px 10px 10px 5px;
    }

    .bigChatTextContainer {
        padding-top: 10px;
    }

    .noOverflow {
        width: calc(100% - 1em);
        overflow-wrap: anywhere;
        white-space: normal;
    }

    .onlyEmoji {
        font-size: 30px;
    }

    .deletedMessage {
        font-size: small;
        color: v-bind(timestampColor)
    }

    .msgInfoContainer {
        height: fit-content;
        width: fit-content;

        position: absolute;
        bottom: 0;
        right: 0;

        margin: 0px 10px 3px 10px;
        align-self: flex-end;
    }

    .msgInfoContent {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .timestamp {
        font-size: 10px;
        color: v-bind(timestampColor);
    }

    .iconContainer {
        padding: 0px 5px;
    }

    .blueIcon {
        color: #1E90FF;
    }

    .grayIcon {
        color: gray;
    }

    .timestampContainerBig {
        margin: 5px 10px;
        width: fit-content;
        flex-direction: column;
    }

    .timestampBig {
        white-space: nowrap;
        width: fit-content;
        font-size: 12px;
        color: v-bind(timestampColor);
    }

    .containerFloatingTimestamp {
        position: absolute;
        align-self: center;
        z-index: 3;
    }

    .buttonContainer {
        position: fixed;
        right: 20px;
        bottom: 150px;

        height: 40px;
        width: 40px;
        display: flex;
        flex-direction: horizontal;
        border-radius: 100%;
        background: v-bind(inBoundMsgBubbleColor);
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);

        align-content: center;

        z-index: 2;
    }

    .buttonContainer:hover {
        cursor: pointer;
    }

    .buttonIconContainer {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: v-bind(iconColor);
    }

    .menuToggler {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        z-index: 1;
        /* set to top layer */

        display: none;
        justify-content: center;
        align-items: center;

        cursor: pointer;
    }

    .menuTogglerInBound {
        background: v-bind(inBoundMsgBubbleColor);
        box-shadow: 0px 0px 20px 20px v-bind(inBoundMsgBubbleColor);
    }

    .menuTogglerOutBound {
        background: v-bind(outBoundMsgBubbleColor);
        box-shadow: 0px 0px 20px 20px v-bind(outBoundMsgBubbleColor);
    }

    .togglerIconContainer {
        width: max-content;
        height: max-content;
        color: #1E90FF;
    }

    .togglerIconContainer:hover {
        cursor: pointer;
    }

    .noOverflow :deep(.mention) {
        display: inline-block; /* needed so text-decoration here can overwrite the markdowns */
        text-decoration: none;
        font-weight: normal;
        font-style: normal;
        color: #6495ED;
    }

    .noOverflow :deep(.mention):hover {
        cursor: pointer;
        color: #6495ED;
        text-decoration: none;
    }

    .mediaContainer {
        padding-bottom: 10px;
        overflow-y: hidden;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .mediaContainer:hover {
        cursor: pointer;
    }

    .imgSquareContainer {
        height: 150px;
        width: 150px;
        margin-right: 5px;
    }

    img {
        border-radius: 5px;

        overflow: hidden;
    }

    img:hover {
        cursor: pointer;
    }

    .chatSettingsContanier {
        position: relative;
        top: v-bind(floatMenuPositionY + 'px');
        right: v-bind(floatMenuPositionX + 'px');

        z-index: 2;
    }

    .menu {
        position: absolute;
        width: fit-content;
        padding: 0px;
        right: 10px;
        background-color: v-bind(backgroundColor);
        border-radius: 5px;
        box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
    }


    .menuContainer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .menuContainer:hover {
        background-color: v-bind(hoverColor);
        cursor: pointer;
    }

    .menuTimestampLong {
        padding: 10px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }


    .textContainer {
        color: v-bind(textColor);
        width: 100%;
        height: 2em;
        padding: 20px;
        border-bottom: 1px solid v-bind(borderlineColor);

        display: flex;
        align-items: center;
    }

    .textContainerlastElement {
        border-bottom: 0px;
    }


    .contentTextBodyForSettings {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }

    .containerReply {
        position: absolute;
        bottom: 50px;
        height: fit-content;
        width: 100%;
        background-color: v-bind(headerColor);

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        z-index: 1;
    }

    .containerReplyWithRightMargin {
        width: 80%;
        margin: 5px 0px;
    }

    .closeIcon {
        margin-left: 5px;
        width: fit-content;
        height: fit-content;
        color: gray;
    }

    .closeIcon:hover {
        cursor: pointer;
    }

    /* animation for button */
    .button-enter-active, .button-leave-active {
        transition: all 0.5s ease
    }

    .button-enter-from, .button-leave-to {
        transform: scale(0.1);
        opacity: 0;
    }

    @keyframes fade {
        10% {
            filter: invert(25%);
        }
        90% {
            filter: invert(25%);
        }
    }

</style>