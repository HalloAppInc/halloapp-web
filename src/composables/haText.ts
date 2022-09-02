import Autolinker from 'autolinker'
import GraphemeSplitter from 'grapheme-splitter'
import halogger from '../common/halogger'

export function useHAText() {

    function strReplaceAt (text: string, index: number, replacement: string) {
        return text.substring(0, index) + replacement + text.substring(index + 1)
    }

    function populateTextWithMentions(text: string, mentions: any) {
        let result = text

        // if (contactList) {
        //     console.log("populateTextWithMentions 1")
        //     for (var i = 0; i < contactList.length; i++) {
        //         console.log("populateTextWithMentions: " + i)
        //         result = result.replaceAll('@' + contactList[i], '[[am]]' + '@' + contactList[i] + '[[/am]]')
        //     }
        // }

        if (mentions) {
            for (var i = mentions.length - 1; i >= 0; i--) {
                const mention = mentions[i]
                result = strReplaceAt(result, mention.index, '[[am]]' + '@' + mention.name + '[[/am]]')
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
        const GraphemesList = splitter.splitGraphemes(text)
        const MarkdownTags = ['~', '*', '_']
        const Unpaired = 'unpaired'
        const Opening = 'opening'
        const Closing = 'closing'
    
        let result = ''
        let foundTags = []

        for (let i = 0; i < GraphemesList.length; i++) {
            
            const Grapheme = GraphemesList[i]

            if (Grapheme == '\n') {

                /* remove any unpaired tags since we don't pair after newlines (ios logic) */
                let w = foundTags.length
                while (w--) {
                    if (foundTags[w].type == Unpaired) { 
                        foundTags.splice(w, 1)
                    } 
                }

            /* skip all markdown text inside mentions */
            } else if (Grapheme == '[' && ((i + 5) < GraphemesList.length)) { // check for [ first to save some compute cycles

                const openStr = GraphemesList.slice(i, i + 6).join('')
                const openingMentionTag = '[[am]]'

                if (openStr == openingMentionTag) {

                    while ((i + 6) < GraphemesList.length) {
                        const closeStr = GraphemesList.slice(i, i + 7).join('')
                        const closingMentionTag = '[[/am]]'

                        if (closeStr == closingMentionTag) {
                            break
                        }

                        result += GraphemesList[i]
                        i++
                    }

                }

            } else if (MarkdownTags.includes(Grapheme)) {

                /* find an unpaired tag and close it if found */
                let foundUnpaired = false
                let isEmptyMarkdown = false
                for (let j = foundTags.length - 1; j >= 0; j--) {
                    let foundTag: any = foundTags[j]
                    if (foundTag.tag == Grapheme && foundTag.type == Unpaired) {

                        foundUnpaired = true

                        isEmptyMarkdown = (i > 0) && (GraphemesList[i - 1] == Grapheme) && (foundTags[j].index == i - 1)
                        if (!isEmptyMarkdown) {
                            foundTags[j].type = Opening
                        }

                        break
                    }
                }

                if (foundUnpaired) {
                    if (!isEmptyMarkdown) {
                        foundTags.push({ tag: Grapheme, index: i, type: Closing })
                    }
                } else {
                    foundTags.push({ tag: Grapheme, index: i, type: Unpaired })
                }

            }
    
            result += Grapheme
        }

        while (foundTags.length > 0) {
            const tag: any = foundTags.pop() // start from end or else indexes will not match after replacement
            if (tag.type == Unpaired) {
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

            if (tag.type == Opening) {
                placeholderTag = '[[' + placeholderTag
            } else if (tag.type == Closing) {
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
            if (charCount >= maxCharacters) { 
                break 
            }

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
            .replaceAll('[[am]]', '<a class="mention">')
            .replaceAll('[[/am]]', '</a>')

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
            .replaceAll('[[am]]', '<span style="display: inline-block; text-decoration: none; font-style: normal; font-weight: normal; color:#6495ED">')
            .replaceAll('[[/am]]&nbsp;', '[[/am]]')
            .replaceAll('[[/am]]', '</span>&nbsp;')
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