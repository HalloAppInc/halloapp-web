<script setup lang="ts">
import { ref } from "vue"

import hal from "../../common/halogger"
import { clients } from "../../proto/clients.js"

import { Base64 } from "js-base64"
import hkdf from "js-crypto-hkdf"

import Autolinker from 'autolinker'

import timeformatter from '../../common/timeformatter'
import GraphemeSplitter from 'grapheme-splitter'

import { useI18n } from 'vue-i18n'

import MediaCarousel from '../media/MediaCarousel.vue'

import MP4Box from 'mp4box'

let isDebug = false

let pushname = (<any>window).han
let avatar = (<any>window).haa

let devCORSWorkaroundUrlPrefix = ""
if (process.env.NODE_ENV?.toString() == "development") {
    isDebug = true 
    devCORSWorkaroundUrlPrefix = "https://cors-anywhere.herokuapp.com/"
    // devCORSWorkaroundUrlPrefix = "https://localhost:4000/"
}

let isAvailable = ref(true)
let isMobile = ref(false)
let isIOS = ref(false)
let isAndroid = ref(false)
let isSafari = ref(false) // mobile Safari and desktop Safari

const { t, locale } = useI18n({
    inheritLocale: true,
    useScope: 'global'
})

const primaryBlue = ref("#007AFF")
const primaryBlueDark = ref("rgb(10, 132, 255, 1)")
const primaryBg = ref("rgb(243, 243, 240)")
const primaryBgDark = ref("rgb(17, 17, 17, 1)")

const headerWidth = ref(450)
const postWidth = ref(430)

const externalShareInfo = Base64.fromBase64("SGFsbG9BcHAgU2hhcmUgUG9zdA==")
const imageInfo         = Base64.fromBase64("SGFsbG9BcHAgaW1hZ2U=")
const videoInfo         = Base64.fromBase64("SGFsbG9BcHAgdmlkZW8=") 
const voiceNoteInfo     = Base64.fromBase64("SGFsbG9BcHAgYXVkaW8=") 

const gothamFontUrl = ref("https://halloapp.com/fonts/gotham/woff2/Gotham-Book_Web.woff2")
const gothamMediumFontUrl = ref("https://halloapp.com/fonts/gotham/woff2/Gotham-Medium_Web.woff2")

const avatarImageUrlPrefix = ref(devCORSWorkaroundUrlPrefix + "https://avatar-cdn.halloapp.net/")
const avatarImageUrl = ref(devCORSWorkaroundUrlPrefix + "https://d1efjkqerxchlh.cloudfront.net/es/assets/avatar.svg")

const postTimestamp = ref("")
let postText: string
let postMentions: any

const isTextPost = ref(false)
const isTextPostTextOnly = ref(false)
const moreMarginForPost = ref(false)

const isTruncatedText = ref(false)

const mediaBoxWidth = ref(300)
const mediaBoxHeight = ref(400)

const showPreviewImage = ref(false)
const previewImageSrc = ref("")

const bodyContent = ref("")

enum MediaType {
    Image,
    Video
}
interface Media {
    type?: MediaType;
    mediaBlob?: any;
    width: number;
    height: number;
    margin: number;
    lengthMins?: String;
    lengthSeconds?: String;
    isReady: boolean;
}
const album = ref({media: [] as Media[]})

const isAlbum = ref(false)

const $postVoiceNote = ref(null)
const showVoiceNote = ref(false)
const postVoiceNoteSrc = ref("")

applyPlatformSpecifics()
setPostSize()
loadFonts()
init()

async function init() {  
    const urlHashComponent = location.hash
    let base64Key = urlHashComponent.slice(2) // strip out "#" and "k"
    let base64Blob = (<any>window).hab

    if (isDebug) {
        /* hardcoded tests */
        
        /* pushname and avatar */
        // avatar = "Hvhqsmhx-uKSX2oAEYpKe5xK"
        // pushname = "Test Tony"

        /* text only (containerBlob) */
        // base64Key = "1crhORb2-zpiYiP1FpIj"
        // base64Blob = "tmAByxD_n3aHWTERMWmvCUwu2hsxd93HznAdEobwYFzE_WDmif_cfC1hklandhd1XVjwGPZE2NgXGJhmcnDeSLwiAI_Xe41wZlYZSubQerc_AyNTfclb0UcLjqEIxQtsr1JfzjyT5RyzvENk4yHnXdGSwoTOIyUBn-qzy9n8LFyygfb7je6hz8Wzn5H_UDXCOLQmW5pqnr2yFpYMlIaqYuSnn591pnbhlfQruonWks1O64AjwGtPVtvBFJmguybkTRRI4_O_zFereoFKh3l3cCIoJiIfKoCBlWVYKAhudc1iCErBv9R3JVFXW7OavHPOkpw-Kfxs-VpE9gtDEY7R2C4lMMI4tcXDSKS5MC-OgGMzOgsAhmauxuO5xq3aP1-194msfvFIqS_D_BUEKehkP8MmB4inBxaVpUdeKGQIml7rXn_Um94lYJE9shzZisWE06NJrcUU2kq8kKfR1ne737IxZGrPxJgqMEGrInwlie0petpgLVSVD6tTahR9LRL8"

        /* preview link with no img (containerBlob) */
        // base64Key = "ni-rEmBOXV4bUpuX1NGh"
        // base64Blob = "c8lxbGwFwYBOomnApInTTqiIX8rB7DGR9p6WSeDMFBQFK4qs4YUj8E5E7TVd28tbqgP6_jRWqEm19sat-99mMA2u-_tHJxHG5N9QuklFJ47vEePHV70OwcSZj8LcNRVwbbVLXFLmwsWR3X3kIgsU87P-x1BNxTOJOGMtIB8kcXXthGGGfVJXlWd7H0LqCPsvmV7t1a5v6WEA7ww0ymuqwJ4OyqW7DksxOaISfhPOw2ryo78KMc6-bY9cZU7g9zdYAozdcle65pZcDh4RdQyAdzstQhK67HbuLVLRwkfa6tq2Sx-zzWKQjy8j6_G7h5lKNRhIkKzVDFDS1MMuH_qqqVc16rMvy5PgZ0HVEwrGUV5wXj-8LQ570bmOGxGg68wDH-feQW44ONo7QTx-hCj-oW99y8KJ55vD93n19oH76aV8sSYIJ59dY3L3zLG3b3Xb3hCieXnVrbJP-aBR1ozxRA0kk5MzcuzcKcB1DtuIKnjdyWse4YE8O81J-dyYyj_x3BugFj_6zcH3uzEtfvUnt5Myikn33qihk6k1sD-GMV0"

        /* link (containerBlob) */
        // base64Key = "q_7-0tj8FwD4EGCFIVE3"
        // base64Blob = "ByPDFckM0eLcOtWuUxPTEi9gbcOFirPblouY5ruQWGaAQMW78VuKBwQX6i7hWuRx-dnoZhXZKEDNYiWcdUD9Ty9oDCqO7pwFEKM-QrCTE_9hv605-BXzgMVfyoUvwgFiUZJZHhP0KuYxh-jsDEXxk-BlFgP2txQ-cXVpLHpt6_xfz0opYfjxXQGKOzhYq_VR_RjiSXej5qNG6iZk7Ek1KE03EXxRFQe0Y5lSThxuSBqj1klar7VV_obu9h_alDWYMz8iGUwZhPvFS66qcscyJgpY9v04oYMFchzuzY8Ud4NKQo5fKezR5HbFUWK_1T90TOoDVna_U_zJTfkIHDuzNTxaTB-7MXwo5hT7N64hWQ4aI8J9gyxdYyGPay-MuX5LdwaiVmrsBWd9RtnBpmaCPA"

        /* one landscape image (containerBlob) */
        // base64Key = "CAC5YiVKS-b4mgGNU6ma"
        // base64Blob = "7rdxgS-S_GbBpAQSP5QWtfQRFmNQQZxhFYZ_xH5aSpL6G6AHE3oRHQdHsSAFSIZAW4TI_z65eJeRybOjGGr64r1m7hZ-rm86l47yd1i1rLVSZLyk6HSC5RnOFW2Iv8tbEX6eWZWpSd2p16dLOCW_Re1lrlODu-dUUwJHGg47PzykMPPNvRDvkPK-rnV-_Q83ESVmieNilM00A0PP4eQolmZTwgDFEylRF1zzoI2YtPgfDGTMM5gOJKl7D74StW9SVOjHlLyemUnrQBMrNSmHWaOOXUk2S1W-ql2W2SkJZFwRCkZMJ2kjbfvxmZKM7Dff"

        /* one image and one voicenote (containerBlob + timestamp) */
        // base64Key = "2VsrkbHtkp87bTFsFgmS"
        // base64Blob = "mXDlo3Q-LO5sglf_3YrhZvDW9RaVulgu0sXDGfJYbKeRs8fTrOjqqkm3FIpukbHJ-cFyaH52kXjSB9y9w3BTXWCnKvNm4-xHgT44vLcHZ_FljO6K_xEP-5YY9zN3Gc4mm-AOjTUy41ud1D4XDZoWZv7dFN5aenXhMZTqfzN-NHKtsG5XU8NWFqnQp_dukX7JfOFDhsE5n9XWhEyqaMy4oiDx6uScNdblzjImeBm0CcPNBCA7_zPQ-QpHoL00ZOfhZTBcRh8Ft5oJPwhjuK7LhIIt9HvUcpSd7N28KrcUeCqfmrE3zfe0Q0RhTuD6FyQ8WYHrwxoTve9XlneRyAOZ2KsSL8dnd7YCpLpfvdq2nh1k09gN7IxRKyQ7vivKPORxrsi6ZMQnxF3_KWumn5VqmXSB86vlvopWT6p-OACo02sANK9ztqSd6mVpkt4ZguoFDmMEwGCzUXkW0g8tQS8K2A"

        /* text only */
        // base64Key = "06kaXk7TsDYQz0cYgIvO"
        // base64Blob = "uIGPNSl9ynuliYIqq8yRzsBygO6RDrdC6952_KusY9brjOod4uNcBOU5tyOSqM7FAiQonU7nAtDH0F_yjklQfTtUwMfAhGHER5BHepuzwWDxyNSGVMlcKvFFmI7wQGit"

        /* text link */
        // base64Key = "C443nzVbfx-7EtmkG_ra"
        // base64Blob = "jXAp16t_XAh5aNy_I1yYXtQ0xti05WiUkdTqIfMgwPoy5Fd-MUZ06LHY3pjmHJpDmQIUGJaCpvrieRraAOeeocxAzkoRg682Be3BXYWnPXmjCgNZ9VIwuCvP5Wq8fx-YaNnxnhJgaIbX0jCAbuNPCC7OtPPwSVq4-B2yb5Iun58zeTapNhME-ZXijEr9ngNBL7a6F8WAzHX4WcgSUqLH3YQ6G0AiaNxqwC0SqN4kilVRiqqmAuHQdIzZ0gEnwtWoqnanYiNBGlGPXv7-KRb9IT4aaagX79uBr2xJBLn8pHM"

        /* tall text with newlines and an image, edge case */
        // base64Key = "3ecOetpiHz4qyk1ZpnhW"
        // base64Blob = "7XsGiBTrQorsga4q3stGvZT_0zGjhvkqLuiCUTl1U1z5x6w1BVVD7V2LkYpr8dVhYvWzy7S469NkS4UAxCblV2nr9Jss3VBJJ0mSh0Ow6YRVtJ_T0WksLmki2vCdCx74IiLZtPC6SMM6DnaYXl0MDgHvc5d80wq1CZrqIBw6XBzEeRDVh7JPcfvt9ShhaO9nmW7v3ecUib-ncx6DWAQ0KywH6cM52XCDZn8FlFfnH5xmlqrIxvuK2ew4KoJ4KyQlPPtnJHdhWUHYuCWxqrIdf-AhLmYsnCmggVyq2UeY3WJw_PcQt8IMl4QTfhdi-7zh"

        /* long text that's more than 3 lines */
        // base64Key = "WTBSeqmjvaylUdmbqvUZ"
        // base64Blob = "0bSaIW38tvqjOzgJwtuNo9BEPdFv_eXNZb9ExZlSXJJAwWBosgKNvoLcC-CXX1CDyQbbdV0Gwo3jbHSrBIBdxiyD5Kocb-g57c7HxoumIZRs87kNlUJkwaIKTg09vlmSaWkumWewG_eXFdwalRjpdVgZ-7UufSPZzSJfhGWVrQTp7A7MUou97dZsBQ8W6oUlIx-JxhWXodKJrcnkRVBqrnh_PJ-hdccn3oJxyHFR-ky3O3C7u070h1O422V8EYBHlLccQuY48nuQjPkUBIX8oF236llZnkjA7ZSlbbai2USxsZ9qYxGjLvMgniECvOPga7ro2Y3G2S1Hcpmcx0-37roPQl2de6yFIX1xYqihXMF-sfbY2j4TpwDbvzo_1ESGC4wxmON1nEqTkx2GXPy0w2QwEbPCsd1W-5oDcpblO_027JTe9kz0TaBmGuB4SEipBM5Mcu4ka2_9ZwcyLMg25-n1EjRWmhmzWw6LphsKLTT10xdVqC8iQ-ZMNjtmawCcEQyspM2B6vSb8k3mLwNuS5bwQh-TZC74H0zGT6HdG7s-5HnRYfxn29Q23ljUawjFJuKaITA3XJPn03XAgbdRZW_4S-yw2TsVIJ6Y1abL7SnfxwKZggpRoXet6w5UR2UycXj8ef8YTwjrFz_bjlBkSUbPYSLr9nLGvDArDptNcQzt70OZxhsOoZ8sktYJL1rfa_6TpR5-hS27vrsi8-XQQkh3D-kSzjcKbvlq42UeokU81Tck6boQd8CYCroFXhxgAZNQeVD_uLUt77DzcTIEAdL6T_99sNu5_Q6OxtrQsN9jjyHfD1nE_gMdc6LtK3Qgk7KEaoyrEIQqB-MTMTUUzfNAK-Mz7fFqhHcBrceo85n6ufxNEoMxzNqpRFodtAgAvc5c-VZ8JlXiiVf8gyK1h_OR4mBeywy2gHq0vjrbuGI4D80NvIFegGyzgiJHI9MHTqbg3LCdRX6-r8O2XN86GfbsVzlr35QZ1_giRjeC6vZuaabQWPZI_flo09L_tNss"

        /* album one video */
        // base64Key = "D0KdllVMJtpygwW6C0U7"
        // base64Blob = "tRtKsV0ASfYfdrSKm_zN4uvsSaZTaMn731vUxuW_Aa98AQSEvQdWmvVwdvpQtcrfLdB60jFZWXVDufUgZh7iZYmc5FLf2OqaXNVLWZlL99AwY4EHL-r3wEMpaYB9_FmRIinW8lSYnwXbOsu04xSEPaSddm9hMOJIQ73W_OiodMlO19zn6XUYlODifg_jnKAKtoVrasTQGXoOB3OIKYhJXFqIc1ELMo5giRJncvWsUYUV_QLJ37qFD20rMck926kTk--4ggFX_e9XwDV7AGCcN99cLSiD0UOHU8B_2x3U7gz-fzI4-rVMC8Tg38GkieQ5urR9us1TV8RIbIbGboZP7g"

        /* album streaming video */
        // base64Key = "Lwemc3kAhtoUnx6YYg0t"
        // base64Blob = "dERdeyV1nCUjzrxUMEso4S70AjbvG3MqAIvG6i1qj9Sx8tIEIjpA9ERlUlsiX-hSqgtfSQQY7vFsBp61EAre4gzDrH8QytT3A9-O20f6YG8cFLY__uO1t8LEw8YSwPriYhmLLcx3T2vtKclFPqiP1h8WXV5xnMw2krOY_wK0sUqpiQmIO0KG1DvYoGAx_2zwbHYedbZR3KZ6JGl6RprvWygBds8ulFyleu27R5Fyf_suPzBG-KKKBH8Jg0azg8hOAgvI6SbiIVRgdSnEg2GJIFe5_I4rJ6k37T4KC6CGOvEynRMKRx_De4Ysr4HOBDQwviAMeMMOMEHNwNOGjI2pMQ"

        /* album video HDR */
        // base64Key = "_YuLwY6EXrQ-hugnvcCR"
        // base64Blob = "nXq-WmvjeH6YKE6GR9kVfxWrfZX6-XgL11Isr7hi_dL3YopD0j6FsNakniKEXLhi9Tz3xuCNFBaWcu7YvGHnVLHpYxvg6eb0ejT2cNxo6-dh8ZGKby7eG6knroY26Tcy6kLRpiypC8eA0WEvHWXpz2XV6lBUPL0nP6yijS5Mgq03guHloBbsql_18DfvLc1Pm5IXqLTB8ZQvl0HjUHbIdJT8qjec461O5EoOBPFUjOOoBVWbvBOCsRCnG9TuSFjYfdohVTDwYdFiOz5F-g-rflp3rx8QeQHYp6Sjtnt7LLcdHAXmU7Siz7vnAPYFCw_st1oo77FypBZ9PzpOG2qook54PJ5cjMYaUbeQ7Xuaq1w"

        /* album multiple image/video */
        // base64Key = "i0UShAio3htmgUKaXqMk"
        // base64Blob = "a7q7iGWpsxhZFG_8GwKVtbudbmQ4uRKxCXxd7S5siNSHKMi5z3TxajzKwq30yip1ST9pR2PkU9_Rsu6rt2yPZnGaqoBZKQwj7Bmng9WJCf8hNvJ3KAlWeRpUXLjyl_XGYnhKiK1JV8968fa1rJBQeVMIYC5a-KIf11WwrcKxQiDyhw_PFUbMgkCkavQWQf7LaktAvLwHhU-jeWI4oKUmpmgtS3-u8TXkBML9TMZZeW2Z3xlYOkgYhg0waUoV3JTcD0VMjAa1TlPlaM7Zm-jZ-Zv3q1palBJkIDSfEWOs6mXDNZwgH1oEafQiTzcL7DnXinJ6K2wKVd_UrJgJi5NdTOqc6c9bg6D2HwjDBVIKNtcVFpH2jkKEGqWOIbf8HT0j-Ng_kn6kEK8WPUkYIoCFDmFrUguuTsUUZzTUPMXEFKWkywD1JvDsEdEiSwKD-rdKo66-FLZtvt6iX4xGwULXb9Vj4kJP5qLE3g6cGwAXpuPD_Trbuk7nhEFiGCkuL_faoH4hnPWN4UkE8HZJGhVQOhdraV7nx5wxo1fbdLET1Exr6RZk61Lufn1aGtqj8ywJmM1weiJ7XsGbSAUPSk-THqNzOso9vE2Fuw2TS2u8EF4"

        /* album multiple image/video, another example */
        // base64Key = "OkZQ4mAR7aZbTT-2Jqhf"
        // base64Blob = "5V_N-7N8VDvKwWvTPQZYweMwXhX9IBAFtioFHRLNc_01Pth-1IO7SZvpnEl62p5GymMEGAddyEgCrHfY77goBI83nLhWpNymYhPc9hMs8fZOA4e7pncAZsLX-vb5ii0rMKYt-WnYjaTxbtfNwKhiabv81nkCk8vZHwjdv3tMQ2ibgFfj7d5TXdVn1cEwNiTtA_h4IFH-PA_Zch_Y3GE2U_KEQ4FjprOu6jZLydhkIsF8hx3C8-Twt8gU3pMX26DZE8RHGDBcuqLG308s4MqfMLFJxDv9z7t9acceOHr0V8fHPhALLLBFXw8bKpjo6ZCWKqdwC2DAk20TQOSRMJo2ldpkJ0Wee-oB5mvQxlcu6FB8ZryGwXfi-LjMyzpip1XZIDmtZVEVDTk-BB6fcn0KlTD7QcIpy_mu67X7jJDThqPTxuODlLGaKftdx7vhsubRB8h2M3H35OrzbyOvLhQXIMZcZZkPr1EXRhfhYvqLgXWuaWKKCranahKctaZNRnbp3_U0ZagTGSFgWBlJavK3JjUgkNogFEjEedM4eYN3zKKvbCUpxLBEom6mwpzRNaFROlZAat7mm3fdQol0bDlMwEepn0ftDBwkda77-Q53GFoL4kkjR5WaSxLA1zq7FTVofA9sLwnmYuBpxgFwu4_vXLGryX0d3DI5xGsxx7lCmkRODOgmhvHlsbz8pCw3smy368gsFNfR1UsSkWVKcZ2O6LfDzV8cmDBgd6b_j7RWVds9ikkrxOPhBq8FQE7Ib3I2"

        /* album 1 portrait image with ratio greater than 3/4 fits exactly with audio note */
        // base64Key = "WuMHusEbVQWjuciqKFs9"
        // base64Blob = "PtUYOfiREgXNJsqdrre2eW1NwRXEEnyOUk4YAHcn2sar2s65XZrHWNasdyjzgcZD4B_5MORircrsAtuG3uaei6OiviAiBvfyusbU8wo86nVqft8DezbtBMYq8UoFEhOfnP9CU8T-Y94QJ1hlb1nzs4e7QrJZqGyYlz_n7Uwvd240jJqGablWW1frmSe-ycn4aEIYeXmjPlc42VaiSIxtJHZ-BWJMyoIGeeGURQUuJkbo73UE1uY6Vxp9ZFzp_FRRCfP-Y-GEEG1dpfcmTaObtx8IOW95S-xBW1fBjVYNkq6e7eIXpzFsUVf-BjNbbLK1geEBgyr4zLSx6WAvvajyfPF_F4wFNCFD7grePWselMHiO-PZ5s5RlMhg30UPeyPXySAQjVuvMdna-3Ki0vjSb70HONayesr2wgPC5BQGiFrwA_HO8lB_2R9Xj_58pVWb58rmg8iwefdeOkhUlLp_4w"

        /* album 1 landscape video */
        // base64Key = "O-aWqrkm7a4-6jVQyrTb"
        // base64Blob = "pL6bvxLi5BsxKyNjfOJMPe4aH6GmYhYAISWOW7jcLGdFjiJg6yYBsaO7taz67bgiLgMwhN306XNX1nOX82_PrnKKcbsSpyF0SK5BaAeQ1rhkA8Uk1l5DIXaYB1wfrRy5JCNxiKiZRSbNgz263Y1ujxkjlgbvmqZDtGBW9Oi9uDBTvREMaieCkjcVgy9FGgTAFgDGC87nO51JD5x49KdnbXprFmXu37SLTab86DXJseBs50jmus6XHc3J5VwFHb9I0IJsYuDFzC6BQDOVD45OdB2AFY8bFvrKSt-j75_o7Ye1ytlvyWDSoW6kfZpgSINm"

        /* only voicenote */
        // base64Key = "Epk6C8x3Lnd2I2ai_Ag0"
        // base64Blob = "AQOrEK5VazQ8KQYvNr6G4T0rZbJpregNSHJ7etoKrpQVwrWQ7NiTGJMvYt1v7I2CsduY3cf0RYQ3aDQGV7KGxzS3dFtkcVYnh0HnetWemmkC-r6pEGIW7bpuIkqIT-oSaFbXYc3vdN98Zj-oXgPmGdEcBJppGOYqQkHuxan2y25ayOmGK8zACeAj_TBbVuBnB4IWF7WpMenNNgNqYhTeQQ"
    }

    if (!base64Key || !base64Blob) {
        isAvailable.value = false
        return
    }

    const key = Base64.toUint8Array(base64Key)
    const blobArrayWithMAC = Base64.toUint8Array(base64Blob)

    const derivedKeyObj = await getDerivedKey(key, externalShareInfo)
    const derivedKey = derivedKeyObj.key

    const IV = derivedKey.slice(0, 16)
    const AESKey = derivedKey.slice(16, 48)
    const SHA256Key = derivedKey.slice(48, 80)

    const attachedMAC = blobArrayWithMAC.slice(-32)
    const blobArray = blobArrayWithMAC.slice(0, -32)

    const isHMACMatch = await verifyHMAC(SHA256Key, blobArray, attachedMAC)
    if (!isHMACMatch) {
        hal.log("init/mismatch HMAC")
    }

    const decryptedCiphertextArray = await decryptBlob(AESKey, IV, blobArray)
    decodeAndProcessPostContainer(decryptedCiphertextArray)
}

async function getDerivedKey(secret: any, info: any) {
    const derivedKeyObj = await hkdf.compute(secret, 'SHA-256', 80, info, new Uint8Array())
    return derivedKeyObj
}

async function decryptBlob(rawKey: any, IV: any, ciphertext: any) {
    const baseKey = await window.crypto.subtle.importKey(           
        "raw",
        rawKey,                                                 
        "AES-CBC",
        true,
        ["decrypt"]
    )
    .catch( (error) => { hal.log("decryptBlob/importKey error: " + error) })
    
    const decryptedCiphertext = await window.crypto.subtle.decrypt(
        { name: "AES-CBC", iv: IV },
        baseKey as CryptoKey,
        ciphertext
    )
    .catch( (error) => { hal.log("decryptBlob/decrypt error: " + error) })

    let decryptedCiphertextArray = new Uint8Array(decryptedCiphertext)
    return decryptedCiphertextArray
}

async function verifyHMAC(rawKey: any, ciphertext: any, signature: any) {
    const algorithm =  { name: "HMAC", hash: "SHA-256" }
    const baseKey = await window.crypto.subtle.importKey(           
        "raw",
        rawKey,                                                 
        algorithm,
        false,
        ["sign", "verify"]
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

async function decodeProtobufToPostContainer(binArray: Uint8Array) {
    let tryPostContainer = false
    try {
        const postContainerBlob = clients.PostContainerBlob.decode(binArray)

        if (postContainerBlob && postContainerBlob.hasOwnProperty("postContainer")) {
            const containerTimestamp = <number>postContainerBlob.timestamp
            if (containerTimestamp) {
                postTimestamp.value = timeformatter.format(containerTimestamp, <string>locale.value)
            }
            return postContainerBlob.postContainer
        } else {
            tryPostContainer = true
        }
    } catch (e) {
        hal.log("decodeProtobufToPostContainer/error " + e)
        tryPostContainer = true
    }

    if (tryPostContainer) {
        hal.log("decodeProtobufToPostContainer/try fallback to PostContainer")
        const err = clients.PostContainer.verify(binArray)
        if (err) {
            throw err
        }
        const message = clients.PostContainer.decode(binArray)
        return message
    }
}

async function decodeAndProcessPostContainer(binArray: Uint8Array) {
    const postContainer = await decodeProtobufToPostContainer(binArray)
    hal.log("decodeAndProcessPostContainer/decoded: ", postContainer)
    processPostContainer(postContainer)
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

async function getChunkedMediaBlob(media: any, info: string, chunkSize: number) {
    const ciphertextHash = media.ciphertextHash
    const encryptionKey = media.encryptionKey
    const downloadUrl = media.downloadUrl

    /* download blob */
    const response = await fetch(devCORSWorkaroundUrlPrefix + downloadUrl)
    const encryptedBuffer = await response.arrayBuffer()
    const encryptedArray = new Uint8Array(encryptedBuffer)

    /* check hash */
    const hash = await crypto.subtle.digest("SHA-256", encryptedArray)
    const isCorrectHash = isUint8ArrayEqual(new Uint8Array(hash), ciphertextHash)
    if (!isCorrectHash) {
        hal.log('getChunkedMediaBlob/hash does not match')
    }

    const chunksArr = []
    let chunkCounter = 0
    for (let i = 0; i < encryptedArray.length; i += chunkSize) {
        const chunkWithMAC = encryptedArray.slice(i, i + chunkSize)
        const chunkInfo = info + ' ' + chunkCounter
        const decryptedBinArr = await decryptChunk(chunkWithMAC, encryptionKey, chunkInfo)
        chunksArr.push(decryptedBinArr)
        chunkCounter++
    }

    const combinedBinArr = combineBinaryArrays(chunksArr)
    return new Blob([combinedBinArr])
}

async function getMediaBlob(info: any, media: any) {
    const ciphertextHash = media.ciphertextHash
    const encryptionKey = media.encryptionKey
    const downloadUrl = media.downloadUrl

    const derivedKeyObj = await getDerivedKey(encryptionKey, info)
    const derivedKey = derivedKeyObj.key

    const mediaBlob = await fetchAndDecrypt(derivedKey, downloadUrl, ciphertextHash)
    return mediaBlob
}

async function fetchAndDecrypt(derivedKey: Uint8Array, url: any, ciphertextHash: any) {
    const IV = derivedKey.slice(0, 16)
    const AESKey = derivedKey.slice(16, 48)
    const SHA256Key = derivedKey.slice(48, 80)

    const response = await fetch(devCORSWorkaroundUrlPrefix + url)

    const encryptedBuffer = await response.arrayBuffer()
    const encryptedArrayWithMAC = new Uint8Array(encryptedBuffer)

    const hash = await crypto.subtle.digest("SHA-256", encryptedArrayWithMAC)

    const isCorrectHash = isUint8ArrayEqual(new Uint8Array(hash), ciphertextHash)
    if (!isCorrectHash) {
        hal.log("fetchAndDecrypt/hash does not match")
    }

    const attachedMAC = encryptedArrayWithMAC.slice(-32)
    const encryptedBinaryArray = encryptedArrayWithMAC.slice(0, -32)

    const isHMACMatch = await verifyHMAC(SHA256Key, encryptedBinaryArray, attachedMAC)
    if (!isHMACMatch) {
        hal.log("fetchAndDecrypt/mismatch HMAC")
    }

    const decryptedBinaryArray = await decryptBlob(AESKey, IV, encryptedBinaryArray)

    /* use blob instead of base64 string as converting to base64 is slow */
    return new Blob([decryptedBinaryArray])
}

function populateTextWithMentions(text: any, mentions: any) {
    let result = ''

    if (mentions) {
        const textArray = [...text]
        let mentionsStartingIndex = 0

        textArray.forEach( (char, idx) => {
            if (char == "@") {
                let isMention = false
                let pushname = ''
                for (let i = mentionsStartingIndex; i < mentions.length; i++) {
                    if (mentions[i].index == idx) {
                        isMention = true
                        pushname = mentions[i].name
                        mentionsStartingIndex++
                        break
                    }
                }

                if (isMention) {
                    result += "[[b]]" + "@" + pushname + "[[/b]]"
                } else {
                    result += char
                }
            } else {
                result += char
            }
        })
    } else {
        result = text
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
    const autolinker = new Autolinker( { 
        stripPrefix: false, 
        urls: { 
            schemeMatches: true, 
            wwwMatches: true, 
            tldMatches: true
        },
        stripTrailingSlash: false,
        replaceFn: function( match ) {
            let tag = new Autolinker.HtmlTag( {
                tagName : '[[a]]',
                attrs: { 'href': match.getAnchorHref(), 'target': '_blank', 'rel': 'noopener noreferrer' },
                innerHtml : match.getMatchedText()
            })
            return tag
        }        
    })

    /* looks for links, phone numbers, and emails */
    let textWithAutoLinkerLinks = autolinker.link( text )

    /* convert <[[a]] to [[a]] since AutoLinker custom tags always have '<' */
    let textWithHALinks = textWithAutoLinkerLinks
        .replaceAll('<[[a]]', '[[a]]')
        .replaceAll('</[[a]]>', '[[/a]]')

    return textWithHALinks
}

/* custom HA truncation, expects hardcoded HA specific tags [[b]], [[s]], [[i]], [[a]] */
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
                    while(linkIndex < graphemes.length) {
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

        .replaceAll('[[a]]', '<a')
        .replaceAll('[[aAttr]]', '')
        .replaceAll('[[/aAttr]]', '>')
        .replaceAll('[[/a]]', '</a>')
    return result
}

function processText(text: any, mentions: any, isTextPostTextOnly: boolean, truncateText: boolean = true) {
    const textWithMentions = populateTextWithMentions(text, mentions)
    const decoratedTextWithMarkdown = decorateTextWithMarkdownPlaceholders(textWithMentions)
    let textToBeSanitized = decorateTextWithLinks(decoratedTextWithMarkdown)

    // rough estimate of 330 chars for 12 lines and 110 for 3 lines
    let maxCharsForTextOnlyPosts = 330
    let maxChars = 110

    if (!truncateText) {
        maxCharsForTextOnlyPosts = 5000
        maxChars = 5000
        isTruncatedText.value = false
    }

    let truncatedText = truncateTextIfNeeded(textToBeSanitized, isTextPostTextOnly ? maxCharsForTextOnlyPosts : maxChars)
    if (truncatedText.isTruncated) {
        isTruncatedText.value = true
        truncatedText.text += '...'
    }

    // if text only && there's not too much text, give more margin to post
    if (isTextPostTextOnly && truncatedText.countedChars < 190) {
        moreMarginForPost.value = true
    }

    textToBeSanitized = truncatedText.text

    const santizedHtml = sanitizeHtml(textToBeSanitized)
    const html = populateTextWithHtml(santizedHtml) 
    return html
}

async function decryptChunk(chunkWithMAC: any, encryptionKey: any, chunkInfo: any) {
    const derivedKeyObj = await getDerivedKey(encryptionKey, chunkInfo)
    const derivedKey = derivedKeyObj.key

    const IV = derivedKey.slice(0, 16)
    const AESKey = derivedKey.slice(16, 48)
    const SHA256Key = derivedKey.slice(48, 80)

    const MAC = chunkWithMAC.slice(-32)
    const chunk = chunkWithMAC.slice(0, -32)

    const isHMACMatch = await verifyHMAC(SHA256Key, chunk, MAC)
    if (!isHMACMatch) {
        hal.log('decryptChunk/' + chunkInfo + '/mismatch HMAC')
    }

    const decryptedBinArr = await decryptBlob(AESKey, IV, chunk)
    return decryptedBinArr
}

async function fetchAndDecryptStream(media: any, videoInfo: string, blobSize: number, chunkSize: number, mp4box: any) {
    const ciphertextHash = media.ciphertextHash
    const encryptionKey = media.encryptionKey
    const downloadUrl = media.downloadUrl

    const response: any = await fetch(devCORSWorkaroundUrlPrefix + downloadUrl)
    const reader = response.body.getReader()

    const fullBinArr = new Uint8Array(blobSize)
    let fullBinArrOffset = 0
    let chunkCounter = 0

    let videoInfoCount  = 0 // info for decryption, starts at 0
    let fileStartOffset = 0 // mp4box file offset, starts at 0

    while (true) {
        const { value, done } = await reader.read()
        if (done) {
            hal.log('fetchAndDecryptStream/finish fetching')

            // check hash of full binary array
            const hash = await crypto.subtle.digest("SHA-256", fullBinArr)
            const isCorrectHash = isUint8ArrayEqual(new Uint8Array(hash), ciphertextHash)
            if (!isCorrectHash) {
                hal.log('fetchAndDecryptStream/hash does not match')
            }
    
            let start = chunkCounter*chunkSize
            let end = (chunkCounter + 1)*chunkSize
            const chunkWithMAC = fullBinArr.slice(start, end)
            const chunkInfo = videoInfo + ' ' + videoInfoCount
            const decryptedBinArr = await decryptChunk(chunkWithMAC, encryptionKey, chunkInfo)

            let buf: any = decryptedBinArr.buffer
            buf.fileStart = fileStartOffset
            mp4box.appendBuffer(buf)

            break
        }

        // copies received data to full binary array
        fullBinArr.set(value, fullBinArrOffset)

        const presetChunkedOffset = chunkCounter*chunkSize
        const diffOffset = fullBinArrOffset - presetChunkedOffset

        fullBinArrOffset += value.length

        let chunksToProcess = Math.floor((diffOffset + value.length)/chunkSize)
   
        for(let i = 0; i < chunksToProcess; i++) {
            // hal.log("fetchAndDecryptStream/chunk " + chunkCounter)
         
            let start = chunkCounter*chunkSize
            let end = (chunkCounter + 1)*chunkSize
            const chunkWithMAC = fullBinArr.slice(start, end)
            const chunkInfo = videoInfo + ' ' + videoInfoCount
            const decryptedBinArr = await decryptChunk(chunkWithMAC, encryptionKey, chunkInfo)

            let buf: any = decryptedBinArr.buffer
            buf.fileStart = fileStartOffset
            mp4box.appendBuffer(buf)
            
            chunkCounter++
            videoInfoCount++
            fileStartOffset += decryptedBinArr.length
        }
    }
}

function setupStreamingMediaSource(mediaSource: any, media: any, videoInfo: any, blobSize: any, chunkSize: any) {
    let tracks: any = {}
    let mp4box = MP4Box.createFile()
	
    // wait for mediaSource to be ready
	mediaSource.addEventListener('sourceopen', function () {
		fetchAndDecryptStream(media, videoInfo, blobSize, chunkSize, mp4box)
	})

	mp4box.onError = function(error: any) {
		console.error('setupStreamingMediaSource/mp4box/error: ', error)
		mediaSource.endOfStream('decode')
	}

	mp4box.onReady = function(info: any) {
		hal.log('setupStreamingMediaSource/mp4box/ready')
        // console.dir(info)

		info.tracks.forEach(function(track: any) {
			const mime = 'video/mp4; codecs="' + track.codec + '"'
			if (MediaSource.isTypeSupported(mime)) {
				let mediaSourceBuffer = mediaSource.addSourceBuffer(mime)
				let trackEntry = {
					mediaSourceBuffer: mediaSourceBuffer,
					segBuffers: [],
					meta: track,
					ended: false
				}
				mediaSourceBuffer.addEventListener('updateend', popBuffer.bind(null, trackEntry))
				mp4box.setSegmentOptions(track.id, null, {
					nbSamples: 1000
				})
				tracks[track.id] = trackEntry
			}
		})

		let initSegs = mp4box.initializeSegmentation()
		initSegs.forEach(function(initSegment: any) {
			appendBuffer(tracks[initSegment.id], initSegment.buffer, false)
		})

        mp4box.start()
	}

	mp4box.onSegment = async function (id: any, user: any, buffer: any, nextSample: any) {
        hal.log("mp4box/onSegment/track " + id + "/buffer length: " + buffer.byteLength)
		let track = tracks[id]
		appendBuffer(track, buffer, nextSample === track.meta.nb_samples)
	}

	function appendBuffer (track: any, buffer: any, ended: any) {
		track.segBuffers.push({
			buffer: buffer,
			ended: ended || false
		})
		popBuffer(track)
	}

	function popBuffer(track: any) {
		endMediaSourceIfNeeded()
		if (track.mediaSourceBuffer.updating || track.segBuffers.length === 0) { return }
		let segBuffer = track.segBuffers.shift()
		try {
			track.mediaSourceBuffer.appendBuffer(segBuffer.buffer)
			track.ended = segBuffer.ended
		} catch (e) {
			console.error('mp4box/popBuffers/error: ', e)
		}
		endMediaSourceIfNeeded()
	}

	function endMediaSourceIfNeeded() {
		if (mediaSource.readyState !== 'open') { return }

		let ended = Object.keys(tracks).every(function(id) {
			let track = tracks[id]
			return track.ended && !track.mediaSourceBuffer.updating
		})

		if (ended) { mediaSource.endOfStream() }
	}
}

async function processPostContainer(postContainer: any) {

    if (avatar && avatar != "" && avatar != "{{ avatar }}") { // {{ avatar }} is when it's in debug mode
        avatarImageUrl.value = avatarImageUrlPrefix.value + avatar
    }

    let isVoiceNote = false
    let voiceNoteMedia: any

    if (postContainer.album) {
        isAlbum.value = true
        setMediaSizes(postContainer.album)
    }

    if (postContainer.text) {
        isTextPost.value = true
    }

    if (postContainer.voiceNote) {
        isVoiceNote = true
        voiceNoteMedia = postContainer.voiceNote.audio
    }

    if (isAlbum.value) {
        /* text */
        if (postContainer.album.text) {
            postText = postContainer.album.text.text
            postMentions = postContainer.album.text.mentions            
            bodyContent.value = processText(postText, postMentions, false)
        }

        /* media */
        if (postContainer.album.media) {

            for (const [index, mediaInfo] of postContainer.album.media.entries()) {
                
                if (mediaInfo.image) {
                    const media = mediaInfo.image.img
                    const mediaBlob = await getMediaBlob(imageInfo, media)
                    const object = URL.createObjectURL(mediaBlob)
                    album.value.media[index].mediaBlob = object
                    album.value.media[index].isReady = true
                }

                if (mediaInfo.video) {
                    const media = mediaInfo.video.video
                    const isStream = JSON.stringify(mediaInfo.video.streamingInfo) !== '{}'
                    if (isStream) {
                        const chunkSize = mediaInfo.video.streamingInfo.chunkSize

                        // MediaSource is not supported on iOS yet
                        if ('MediaSource' in window) {
                            hal.log('processPostContainer/video/stream/stream via mediaSource')
                            const mediaSource = new MediaSource()
                            const mediaSourceUrl = URL.createObjectURL(mediaSource)
                            const blobSize = mediaInfo.video.streamingInfo.blobSize
                            setupStreamingMediaSource(mediaSource, media, videoInfo, blobSize, chunkSize)

                            album.value.media[index].mediaBlob = mediaSourceUrl
                        } else {
                            hal.log('processPostContainer/video/stream/get entire blob')
                            const mediaBlob = await getChunkedMediaBlob(media, videoInfo, chunkSize)
                            const mediaBlobUrl = URL.createObjectURL(mediaBlob)
                            album.value.media[index].mediaBlob = mediaBlobUrl
                        }

                        album.value.media[index].isReady = true                                               
                    } else {
                        const mediaBlob = await getMediaBlob(videoInfo, media)
                        const mediaBlobUrl = URL.createObjectURL(mediaBlob)
                        album.value.media[index].mediaBlob = mediaBlobUrl
                        album.value.media[index].isReady = true                               
                    }
                }                
            }
        }

        /* voiceNote inside album */
        if (postContainer.album.voiceNote) {
            isVoiceNote = true
            voiceNoteMedia = postContainer.album.voiceNote.audio
        }     
    }

    /* voiceNote */
    if (isVoiceNote) {
        const mediaBlob = await getMediaBlob(voiceNoteInfo, voiceNoteMedia)
        postVoiceNoteSrc.value = URL.createObjectURL(mediaBlob)
        showVoiceNote.value = true

        if (!isAlbum.value) {
            mediaBoxHeight.value = 0
        }
    }

    if (isTextPost.value) {
        /* link preview */
        if (postContainer.text.link &&
            postContainer.text.link.preview &&
            postContainer.text.link.preview[0] &&
            postContainer.text.link.preview[0].img
            ) {
                const previewImage = postContainer.text.link.preview[0]
                const media = previewImage.img
                const mediaBlob = await getMediaBlob(imageInfo, media)
                previewImageSrc.value = URL.createObjectURL(mediaBlob)
                showPreviewImage.value = true

                mediaBoxWidth.value = postWidth.value - 30
                mediaBoxHeight.value = 250
        } else {
            isTextPostTextOnly.value = true
            mediaBoxWidth.value = postWidth.value - 30
            mediaBoxHeight.value = 0
        }

        /* process text after checking if it's text only */
        if (postContainer.text.text) {
            postText = postContainer.text.text
            postMentions = postContainer.text.mentions            
            bodyContent.value = processText(postText, postMentions, isTextPostTextOnly.value)
        }        
    }

}

function applyPlatformSpecifics() {
    const userAgent = navigator.userAgent || navigator.vendor || (<any>window).opera

    if ('ontouchstart' in document.documentElement && userAgent.match(/Mobi/)) {
        isMobile.value = true
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !(<any>window).MSStream) {
        isIOS.value = true
    }
    if (/android/i.test(userAgent)) {
        isAndroid.value = true
    }

    if (userAgent.indexOf('Safari') != -1 && userAgent.indexOf('Chrome') == -1) {
        isSafari.value = true
    }
}

/* 
    Fonts are loaded dynamically to make development on localhost easier 
        1. Assets on AWS are cors enabled and thus a proxy server is needed on localhost
        2. There's no way to use variables in @font-face src's url in css
*/
function loadFonts() {

    let normalFont = gothamFontUrl.value
    let mediumFont = gothamMediumFontUrl.value

    // non-Safari browsers require a proxy server for font fetches
    if (!isSafari.value) {
        normalFont = devCORSWorkaroundUrlPrefix + normalFont
        mediumFont = devCORSWorkaroundUrlPrefix + mediumFont
    }

    let style = document.createElement('style')

    style.appendChild(document.createTextNode("\
    @font-face {\
        font-family: 'Gotham';\
        src: url('" + normalFont + "') format('woff2');\
        font-weight: 300;\
        font-style: normal;\
    }\
    @font-face {\
        font-family: 'Gotham';\
        src: url('" + mediumFont + "') format('woff2');\
        font-weight: 500;\
        font-style: normal;\
    }\
    "))
    document.head.appendChild(style)
}

function setPostSize() {
    const maxPostWidth = 400    // max width of entire card allowed
    const minPostWidth = 200    // min width of card

    const sideGutters = 60

    // limit post to maxPostWidth if window is large
    if (window.innerWidth >= maxPostWidth) {
        headerWidth.value = maxPostWidth - 10
        postWidth.value = maxPostWidth - sideGutters

    // size post to window's size
    } else if (window.innerWidth < maxPostWidth && window.innerWidth >= minPostWidth) {
        headerWidth.value = window.innerWidth - 30
        postWidth.value = window.innerWidth - 80

    // if window is too small, keep post to minPostWidth
    } else if (window.innerWidth < minPostWidth) {
        headerWidth.value = minPostWidth
        postWidth.value = minPostWidth
    }
}

function setMediaSizes(postAlbum: any) {
    if (!postAlbum.media) { return }

    const defaultRatio = 0.75 // 3/4 width/height portrait ratio

    mediaBoxWidth.value = postWidth.value // media carousel single slide width
    mediaBoxHeight.value = mediaBoxWidth.value/defaultRatio

    const maxBoxWidth = mediaBoxWidth.value - 50 // width of media inside album
    const maxBoxHeight = maxBoxWidth/defaultRatio 

    let tallestMediaItemHeight = 0

    for (const media of postAlbum.media) {
        const type = media.image ? MediaType.Image : MediaType.Video
        let mediaItem: any
        if (type == MediaType.Image) {
            mediaItem = media.image
        } else if (type == MediaType.Video) {
            mediaItem = media.video
        }

        let mediaItemWidth = mediaItem.width
        let mediaItemHeight = mediaItem.height

        if (mediaItemHeight > maxBoxHeight) {
            const mediaItemRatio = mediaItem.width/mediaItem.height
            if (mediaItemRatio > defaultRatio) {
                mediaItemWidth = maxBoxWidth
                mediaItemHeight = mediaItemWidth/mediaItemRatio
            } else {
                mediaItemHeight = maxBoxHeight
                mediaItemWidth = mediaItemHeight*mediaItemRatio
            }
        }

        /* add margins so carousel have some spacing between slides */
        let mediaItemMargin = postWidth.value - mediaItemWidth

        const obj: Media = { type: type, width: mediaItemWidth, height: mediaItemHeight, margin: mediaItemMargin, isReady: false }
        album.value.media.push(obj)

        if (mediaItemHeight > tallestMediaItemHeight) {
            tallestMediaItemHeight = mediaItemHeight
        }
    }

    /* set carousel slide height shorter if the tallest media is shorter than the default */
    if (tallestMediaItemHeight < mediaBoxHeight.value) {
        mediaBoxHeight.value = tallestMediaItemHeight
    }
}

function openApp() {
}

function expandText() {
    bodyContent.value = processText(postText, postMentions, isTextPostTextOnly.value, false)   
}

</script>

<template>

    <!-- post row -->
    <div v-if="isAvailable" id="postRow">
        <div :class="['post', {morePostMargin: moreMarginForPost}]">

            <!-- postHeader row -->
            <div id="postHeader">
                <img id="avatarImage" crossorigin="" :src="avatarImageUrl" alt="Avatar">
                <div id="nameBox">
                    <div id="name">
                        {{ pushname }}
                    </div>
                    <div id="time">
                        {{ postTimestamp }}
                    </div>
                </div>
            </div>

            <MediaCarousel  
                :isMobile="isMobile"
                :isSafari="isSafari"
                :isAlbum="isAlbum"
                :album="album.media"
                :showPreviewImage="showPreviewImage"
                :previewImageSrc="previewImageSrc"
                :mediaBoxWidth="mediaBoxWidth"
                :mediaBoxHeight="mediaBoxHeight">
            </MediaCarousel>

            <div id="postBody">
                <div :class="['postBodyContent', {textOnlySize: isTextPostTextOnly }]">
                   
                    <audio v-if="showVoiceNote" autobuffer="autobuffer" ref="$postVoiceNote" id="postVoiceNote" preload="metadata" controls controlsList="nodownload">
                        <source :src="postVoiceNoteSrc" type="audio/mpeg">
                        <p>{{ t('post.noAudioSupportText') }}</p>
                    </audio>   

                    <span v-else v-html="bodyContent">
                    </span>
                    <span v-if="isTruncatedText" id="readMore" @click="expandText">
                        {{ t('post.more') }}
                    </span>

                </div>
            </div>

            <!-- postFooter row -->
            <div id="postFooter">
                <div id="commentButton" @click="">
                    <img id="commentIcon" src="https://d1efjkqerxchlh.cloudfront.net/es/assets/Comment.png" alt="Comment Icon">
                    <div>
                        {{ t('post.comment') }}
                    </div>
                    <div id="newCommentIndicator">
                    </div>
                </div>
                <div id="replyButton" @click="">
                    <img id="replyIcon" src="https://d1efjkqerxchlh.cloudfront.net/es/assets/Reply.png" alt="Reply Icon">
                    <div>
                        {{ t('post.replyPrivately') }}
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div v-else id="postNotAvailableRow">
        <div id="postNotAvailableHeading">
            {{ t('post.postNoLongerAvailableTitle') }}
        </div>
        <div id="postNotAvailableBody">
            {{ t('post.postNoLongerAvailable') }}
        </div>
    </div>

</template>

<style scoped>

#headerRow {
    position: sticky;
    z-index: 2;
    top: 0px;

    width: 100%;
    flex: 0 0 60px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5px 5px;    

    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px); /* mobile Safari */
}

/* post row */
#postRow {
    position: relative;
    z-index: 1;

    width: 100%;
    padding-bottom: 25px;
    
    background-color: rgb(243, 243, 240);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
@media (prefers-color-scheme: dark) {
    #postRow {
        background-color: rgb(17, 17, 17, 1);
    }
}

.post {
    position: relative;
    width: v-bind(postWidth + 'px');

    margin: 20px 0px 20px 0px;
    padding: 10px 10px 15px 10px;
 
    border-radius: 15px;
    background-color: white;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;
    
    display: flex;
    flex-direction: column;
}

.morePostMargin {
    margin: 70px 0px 100px 0px;
}
@media (prefers-color-scheme: dark) {
    .post {
        background-color: rgba(47, 46, 42, 1);
    }
}

/* postHeader row */
.post #postHeader {
    margin-top: auto;
    margin-bottom: 7px;
    max-width: 340px;

    display: flex;
    flex-direction: horizontal;
    align-items: center;
    gap: 0px 8px;

    font-size: 16px;
    text-align: center;
}
.post #avatarImage {
    height: 45px; 
    width: 45px; 
    object-fit: contain; 
    border-radius: 50%; 
    background-color: gray;
} 
.post #nameBox {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 3px 0px;
}
.post #nameBox #name {
    font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
    font-size: 18px;
    font-weight: 400;
    color: rgb(0, 0, 0)
}
@media (prefers-color-scheme: dark) {
    .post #nameBox #name {
        color: rgba(255, 255, 255, 1);
    }
}

.post #nameBox #time {
    font-size: 15px;
    font-weight: 500;
    color: rgb(0, 0 , 0, 0.4)
}
@media (prefers-color-scheme: dark) {
    .post #nameBox #time {
        color: rgba(255, 255, 255, 0.4);
    }
}

.post #postMediaContainer {
    position: relative;
    
    border-radius: 15px;
    overflow: hidden;

    flex: 0 0 v-bind(mediaBoxHeight + 'px');
    width: v-bind(mediaBoxWidth + 'px');
    align-self: center;

    display: flex;
    align-items: center;
    justify-content: center;
}

#postVoiceNote {
    width: 100%;
    object-fit: contain;
}

#previewImage {
    object-fit: contain;
}

#postBody {
    padding: 0px 0px 15px 0px;

    overflow: hidden;
}
.postBodyContent {
    margin: 5px 0px 0px 0px;

    font-size: 17px;
    line-height: 20px;
    font-weight: 400;

    /* text is manually truncated already so line-clamp serves
     * as a max number of lines we want to show for some edge cases
     * (ie. lots of newlines between words) */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important;
    -webkit-line-clamp: 500;
    -webkit-box-orient: vertical;
    white-space: normal; 

    overflow-wrap: break-word;
    user-select: text;
}
@media (prefers-color-scheme: dark) {
    .postBodyContent {
        color: rgba(255, 255, 255, 0.90)
    }
}
.postBodyContent #readMore {
    color: v-bind(primaryBlue);
    cursor: pointer;
}
@media (prefers-color-scheme: dark) {
    .postBodyContent #readMore {
        color: v-bind(primaryBlueDark);
    }
}
@media (pointer: fine) {
    .postBodyContent #readMore:hover {
        color: black;
    }
}

/* different than figma spec, changed font to 21 instead of 24 */
.textOnlySize {
    font-size: 21px;
    line-height: 31px;
    font-weight: 400;
}

/* postFooter row */
#postFooter {
    padding: 0px 10px 0px 10px;

    display: flex;
    justify-content: space-between;

    font-family: "Gotham", Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
    font-size: 13px;
    font-weight: 400;
}
@media (prefers-color-scheme: dark) {
    #postFooter {
        color: rgba(255, 255, 255, 0.75)
    }
}
#commentButton {
    display: flex;
    flex-direction: horizontal;
    align-items: center;

    color: gray;

    user-select: none;
    /* cursor: pointer; */
}
@media (pointer: fine) {
    /* #commentButton:hover {
        color: v-bind(primaryBlue);
    } */
}

#commentIcon {
    width: 14px;
    height: 14px;
    margin-right: 5px;

    color: gray;
    filter: invert(40%);
}
@media (prefers-color-scheme: dark) {
    #commentIcon {
        filter: invert(100%);
    }
}

#newCommentIndicator {
    margin-left: 4px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: rgba(0, 122, 255, 0.7);
    display: none;
}
@media (prefers-color-scheme: dark) {
    #newCommentIndicator {
        background-color: v-bind(primaryBlueDark);
    }
}

#replyButton {
    display: flex;
    flex-direction: horizontal;
    align-items: center;

    user-select: none;
    /* cursor: pointer; */
    color: gray;
    filter: invert(40%);
}
@media (pointer: fine) {
    /* #replyButton:hover {
        color: v-bind(primaryBlue);
    } */
}
#replyIcon {
    width: 16px;
    height: 12px;
    margin-right: 5px;
}
@media (prefers-color-scheme: dark) {
    #replyIcon {
        filter: invert(100%);
    }
}

</style>
