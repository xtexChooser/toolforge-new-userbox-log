import { SECRETS } from "../config";
import axios, { AxiosError } from 'axios'
import { Update } from "../update";

export const API_BASE = `https://api.telegram.org/bot${SECRETS.telegram.bot_token}/`

export async function sendTelegramNotification(update: Update) {
    const text = format(update)
    console.info(text)
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            const resp = (await axios.post(API_BASE + 'sendMessage', {
                chat_id: update.wiki.telegram_chat,
                parse_mode: 'MarkdownV2',
                text,
                disable_web_page_preview: true,
            }, { responseType: 'json' })).data
            console.info('TG resp: ', resp['ok'])
            break
        } catch (e) {
            const err = e as AxiosError
            if (err.response) {
                const retryAfter = (err.response.data as any)?.parameters?.retry_after
                if (retryAfter) {
                    await new Promise(resolv => setTimeout(resolv, (retryAfter + 2) * 1000))
                }
            }
        }
    }
}

function format(update: Update): string {
    const tags: string[] = []
    if (update.rc.rc_bot == 1)
        tags.push('bot')
    return `
*_New User\\-Box Template_*
\\{\\{[${formatTG(update.pageTitle)}](${update.viewUrl})\\}\\} by ${update.user.actor_user ? `\\[\\[[User:${formatTG(update.user.actor_name)}](${update.wiki.url_base}wiki/Special:Redirect/user/${update.user.actor_user})\\]\\]` : `_${formatTG(update.user.actor_name)}_`}
At \`${formatTG(formatTime(update.rc.rc_timestamp))}\`
*Actor*: id: \`${update.user.actor_id}\` user: \`${update.user.actor_user ?? "_(IP user)_"}\`
*RC*: id: \`${update.rc.rc_id}\` rev: \`${update.rc.rc_cur_id}\`
${tags.map(tag => `*__${formatTG(tag)}__*`).join(' ')}
    `.trim()
}

function formatTime(time: string): string {
    return `UTC ${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)} ${time.slice(8, 10)}:${time.slice(10, 12)}:${time.slice(12, 14)}`
}

function formatTG(str: string): string {
    return str.toString().replace(/-/g, '\\-').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\{/g, '\\{').replace(/\}/g, '\\}')
        .replace(/\*/g, '\\*').replace(/!/g, '\\!').replace(/>/g, '\\>').replace(/#/g, '\\#')
}
