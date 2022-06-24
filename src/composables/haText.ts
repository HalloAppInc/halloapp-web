import Autolinker from 'autolinker'
import GraphemeSplitter from 'grapheme-splitter'
import halogger from '../common/halogger'

export function useHAText() {
    
    // format input message
    function populateTextWithMentions(text: any, contactList: any) {
        let result = text

        if (contactList) {
            for (var i = 0; i < contactList.length; i++) {
                result = result.replaceAll('@' + contactList[i],'[[aa]]' + '@' + contactList[i] + '[[/aa]]')
            }
        }

        return result
    }

    function decorateTextWithMarkdownPlaceholders(text: any) {
        let result = text
            .replace(/((?:^|[^\\])(?:\\.)*)\_(?=[^\s])((\\.|[^_])*)\_/g, '$1[[i]]$2[[/i]]')
            .replace(/((?:^|[^\\])(?:\\.)*)\~(?=[^\s])((\\.|[^~])*)\~/g, '$1[[s]]$2[[/s]]')
            .replace(/((?:^|[^\\])(?:\\.)*)\*(?=[^\s])((\\.|[^*])*)\*/g, '$1[[b]]$2[[/b]]')
        return result
    }

    function decorateTextWithLinks(text: string) {
        const autolinker = new Autolinker({
            stripPrefix: false,
            urls: {
                schemeMatches: true,
                wwwMatches: true,
                tldMatches: true
            },
            stripTrailingSlash: false,
            replaceFn: function (match) {
                let tag = new Autolinker.HtmlTag({
                    tagName: '[[a]]',
                    attrs: { 'href': match.getAnchorHref(), 'target': '_blank', 'rel': 'noopener noreferrer' },
                    innerHtml: match.getMatchedText()
                })
                return tag
            }
        })

        /* looks for links, phone numbers, and emails */
        let textWithAutoLinkerLinks = autolinker.link(text)

        /* convert <[[a]] to [[a]] since AutoLinker custom tags always have '<' */
        let textWithHALinks = textWithAutoLinkerLinks
            .replaceAll('<[[a]]', '[[a]]')
            .replaceAll('</[[a]]>', '[[/a]]')

        return textWithHALinks
    }

    function truncateTextIfNeeded(text: string, maxCharacters: number) {
        let charCount = 0
        let isTruncated = false
        let truncatedText = ''

        let splitter = new GraphemeSplitter()
        const graphemes = splitter.splitGraphemes(text)

        let closingTagsQueue = [] // could be holding [[/b]], [[/s]], [[/i]], or [[/a]]

        for (let i = 0; i < graphemes.length; i++) {
            if (charCount >= maxCharacters) { break }

            /* if matcing closing tags are found, pop them off the queue */
            if ((i + 5) < graphemes.length) {
                const subStr = graphemes.slice(i, i + 6).join('')
                const lastClosingTag = closingTagsQueue[closingTagsQueue.length - 1]
                if (subStr == lastClosingTag) {
                    closingTagsQueue.pop()
                    truncatedText += subStr
                    i += 5
                    continue
                }
            }

            if ((i + 4) < graphemes.length) {
                const subStr = graphemes.slice(i, i + 5).join('')
                const openingTags = ['[[b]]', '[[s]]', '[[i]]', '[[a]]']

                if (openingTags.includes(subStr)) {
                    const closingTag = subStr.slice(0, 2) + '/' + subStr.slice(2)
                    closingTagsQueue.push(closingTag)
                    truncatedText += subStr
                    i += 4

                    /* handle anchor tags, expect attributes inside */
                    if (subStr == '[[a]]') {
                        let linkIndex = i + 1
                        let anchorAttrStr = ''
                        while (linkIndex < graphemes.length) {
                            const closingAnchorTag = ['>']
                            if ((linkIndex + 1) < graphemes.length) {
                                const subAnchorStr = graphemes.slice(linkIndex, linkIndex + 1).join('')
                                if (closingAnchorTag.includes(subAnchorStr)) {
                                    truncatedText += '[[aAttr]]' + anchorAttrStr + '[[/aAttr]]'
                                    i = linkIndex
                                    break
                                }
                            }
                            anchorAttrStr += graphemes[linkIndex]
                            linkIndex++
                        }
                    }
                    continue
                }
            }

            truncatedText += graphemes[i]
            charCount++
        }

        if (charCount >= maxCharacters) {
            isTruncated = true
            /* append all leftover closing tags to truncatedText so all tags will be closed */
            for (let i = 0; i < closingTagsQueue.length; i++) {
                truncatedText += closingTagsQueue.pop()
            }
        }

        return { text: truncatedText, isTruncated: isTruncated, countedChars: charCount }
    }

    function sanitizeHtml(text: string) {
        let element = document.createElement('div')
        element.textContent = text // prefer textContent over innerText, more standardardized and doesn't change newlines to <br>
        return element.innerHTML
    }

    function populateTextWithHtml(text: string) {
        var result = text
            .replaceAll('\n', '<br>')
            .replaceAll('[[i]]', '<i>')
            .replaceAll('[[/i]]', '</i>')
            .replaceAll('[[s]]', '<s>')
            .replaceAll('[[/s]]', '</s>')
            .replaceAll('[[b]]', '<b>')
            .replaceAll('[[/b]]', '</b>')
            .replaceAll('[[aa]]', "<a class='mention'>")
            .replaceAll('[[/aa]]', "</a>")

            .replaceAll('[[a]]', '<a')
            .replaceAll('[[aAttr]]', '')
            .replaceAll('[[/aAttr]]', '>')
            .replaceAll('[[/a]]', '</a>')
        return result
    }

    function processText(text: any, mentions: any, truncateText: boolean = false, maxCharsWhenTruncated: number = 100) {
        let isTruncated: boolean = false

        const textWithMentions = populateTextWithMentions(text, mentions)
        const decoratedTextWithMarkdown = decorateTextWithMarkdownPlaceholders(textWithMentions)
        let textToBeSanitized = decorateTextWithLinks(decoratedTextWithMarkdown)

        let maxCharsAllowed: number = 5000

        if (truncateText) {
            maxCharsAllowed = maxCharsWhenTruncated
        }

        let truncatedText = truncateTextIfNeeded(textToBeSanitized, maxCharsAllowed)
        if (truncatedText.isTruncated) {
            isTruncated = true
            truncatedText.text += '...'
        }

        textToBeSanitized = truncatedText.text

        const santizedHtml = sanitizeHtml(textToBeSanitized)
        const html = populateTextWithHtml(santizedHtml)
        return { html: html, isTruncated: isTruncated }
    }

    return { processText }
}