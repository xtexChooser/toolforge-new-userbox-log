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
    console.info('TG resp: ', resp)
}

function format(update: Update): string {
    const tags: string[] = []
    if (update.rc.rc_bot == 1)
        tags.push('bot')
    return `
*_New User\\-Box Template_*
[${update.pageTitle}](${update.viewUrl}) by [User:${update.user.actor_name}](${update.wiki.url_base}wiki/User:${update.user.actor_name})
Actor: id: \`${update.user.actor_id}\` user: \`${update.user.actor_user}\`
RC: id: \`${update.rc.rc_id}\` time: \`${update.rc.rc_timestamp}\`
    current rev: \`${update.rc.rc_cur_id}\`
${tags.map(tag => `*__${tag}__*`).join(' ')}
    `.trim()
}
