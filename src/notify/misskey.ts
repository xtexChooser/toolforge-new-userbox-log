import generator from 'megalodon'
import { SECRETS } from '../config'
import { formatUpdateTime, Update } from '../update'

export async function sendMisskeyNotification(update: Update) {
    const client = generator('misskey', update.wiki.misskey_instance, SECRETS.misskey[update.wiki.name] as string)
    console.info('creating Mk Note')
    const resp = await client.postStatus(format(update), {
        visibility: 'unlisted',
    })
    console.info(`created Mk Note at ${resp.data.url}`)
}

function format(update: Update): string {
    const tags: string[] = []
    if (update.rc.rc_bot == 1)
        tags.push('bot')
    return `
**New User-Box Template**

{{[${update.pageTitle}](${update.viewUrl})}} by ${update.user.actor_user ? `<plain>[[</plain>[User:${update.user.actor_name}](${update.wiki.url_base}wiki/Special:Redirect/user/${update.user.actor_user})<plain>]]</plain>` : update.user.actor_name}
At \`${formatUpdateTime(update.rc.rc_timestamp)}\`
*Actor*: id: \`${update.user.actor_id}\` user: \`${update.user.actor_user ?? "(IP user)"}\`
*RC*: id: \`${update.rc.rc_id}\` rev: \`${update.rc.rc_cur_id}\`
${tags.map(tag => `<small>**${tag}**</small>`).join(' ')}
#wpub-logger #wpub-logger-${update.wiki.name}
    `.trim()
}