import { SECRETS } from "../config";
import axios from 'axios'
import { Update } from "../update";

export const API_BASE = `https://api.telegram.org/bot${SECRETS.telegram.bot_token}/`

export async function sendTelegramNotification(update: Update) {
    const text = format(update)
    const resp = (await axios.post(API_BASE + 'sendMessage', {
        chat_id: update.wiki.telegram_chat,
        parse_mode: 'MarkdownV2',
        text,
    }, { responseType: 'json' })).data
    console.info('TG resp: ', resp['ok'])
}

function format(update: Update): string {
    const tags: string[] = []
    if (update.rc.rc_bot == 1)
        tags.push('bot')
    return `
*_New User\\-Box Template_*
\\{\\{[${formatTG(update.pageTitle)}](${update.viewUrl})\\}\\} by \\[\\[[User:${formatTG(update.user.actor_name)}](${update.wiki.url_base}wiki/Special:Redirect/user/${update.user.actor_user})\\]\\]
At ${formatTG(formatTime(update.rc.rc_timestamp))}
*Actor*: id: \`${update.user.actor_id}\` user: \`${update.user.actor_user}\`
*RC*: id: \`${update.rc.rc_id}\` rev: \`${update.rc.rc_cur_id}\`
${tags.map(tag => `*__${formatTG(tag)}__*`).join(' ')}
    `.trim()
}

function formatTime(time: string): string {
    return `UTC ${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)} ${time.slice(8, 10)}:${time.slice(10, 12)}:${time.slice(12, 14)}`
}

function formatTG(str: string): string {
    return str.replace(/-/g, '\\-')
}
