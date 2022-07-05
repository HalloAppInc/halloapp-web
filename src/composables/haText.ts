import Autolinker from 'autolinker'
import GraphemeSplitter from 'grapheme-splitter'
import halogger from '../common/halogger'

export function useHAText() {
    
    // format input message
    function populateTextWithMentions(text: any, contactList: any) {
        let result = text

        if (contactList) {
            for (var i = 0; i < contactList.length; i++) {
                result = result.replaceAll('@' + contactList[i], '[[aa]]' + '@' + contactList[i] + '[[/aa]]')
            }
        }

        return result
    }

    function strReplaceCharAt(str: any, index: any, subStr: any) {
        if (index > str.length - 1) { return str }
        return str.substring(0, index) + subStr + str.substring(index + 1)
    }

    function decorateTextWithMarkdownPlaceholders(text: any) {
        let splitter = new GraphemeSplitter()
        const graphemes = splitter.splitGraphemes(text)
        const markdownTags = ['~', '*', '_']
        const unpaired = 'unpaired'
        const opening = 'opening'
        const closing = 'closing'
    
        let result = ''
        let foundTags = []

        for (let i = 0; i < graphemes.length; i++) {
            
            const char = graphemes[i]

            if (char == '\n') {

                /* remove any unpaired tags since we don't pair after newlines (ios logic) */
                let w = foundTags.length
                while (w--) {
                    if (foundTags[w].type == unpaired) { 
                        foundTags.splice(w, 1)
                    } 
                }

            } else if (markdownTags.includes(char)) {

                /* find an unpaired tag and close it if found */
                let foundUnpaired = false
                for (let j = foundTags.length - 1; j >= 0; j--) {
                    let foundTag: any = foundTags[j]
                    if (foundTag.tag == char && foundTag.type == unpaired) {
                        foundTags[j].type = opening
                        foundUnpaired = true
                        break
                    }
                }

                if (foundUnpaired) {
                    foundTags.push({ tag: char, index: i, type: closing })
                } else {
                    foundTags.push({ tag: char, index: i, type: unpaired })
                }
            }
    
            result += char
        }

        while (foundTags.length > 0) {
            const tag: any = foundTags.pop() // start from end or else indexes will not match after replacement
            if (tag.type == unpaired) {
                continue
            }
            let placeholderTag = ''
            if (tag.tag == '*') {
                placeholderTag = 'b]]'
            } else if (tag.tag == '~') {
                placeholderTag = 's]]'
            } else if (tag.tag == '_') {
                placeholderTag = 'i]]'
            }

            if (tag.type == opening) {
                placeholderTag = '[[' + placeholderTag
            } else if (tag.type == closing) {
                placeholderTag = '[[/' + placeholderTag
            }
            result = strReplaceCharAt(result, tag.index, placeholderTag)
        }

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

            /* if matching closing tags are found, pop them off the queue */
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
            .replaceAll('[[aa]]', '<a class="mention">')
            .replaceAll('[[/aa]]', '</a>')

            .replaceAll('[[a]]', '<a')
            .replaceAll('[[aAttr]]', '')
            .replaceAll('[[/aAttr]]', '>')
            .replaceAll('[[/a]]', '</a>')
        return result
    }

    function populateTextWithHtmlForInputBox(text: string) {
        let result = text
            .replaceAll('\n', '<br>')
            .replaceAll('[[i]]', '<span style="color:gray">_</span><i>')
            .replaceAll('[[/i]]', '</i><span style="color:gray">_</span>')
            .replaceAll('[[s]]', '<span style="color:gray">~</span><s>')
            .replaceAll('[[/s]]', '</s><span style="color:gray">~</span>')
            .replaceAll('[[b]]', '<span style="color:gray">*</span><b>')
            .replaceAll('[[/b]]', '</b><span style="color:gray">*</span>')
            .replaceAll('[[aa]]', '<span style="color:#6495ED">')
            .replaceAll('[[/aa]]&nbsp;', '[[/aa]]')
            .replaceAll('[[/aa]]', '</span>&nbsp;')
            .replaceAll('[[a]]', '<a')
            .replaceAll('[[aAttr]]', '')
            .replaceAll('[[/aAttr]]', '>')
            .replaceAll('[[/a]]', '</a>')
        return result
    }

    function processText(text: any, mentions: any, truncateText: boolean = false, 
            maxCharsWhenTruncated: number = 100, forInputBox: boolean = false) {
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
        const html = forInputBox ? 
                    populateTextWithHtmlForInputBox(santizedHtml) : 
                    populateTextWithHtml(santizedHtml)
        return { html: html, isTruncated: isTruncated }
    }

    return { processText }
}