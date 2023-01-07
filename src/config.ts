import { readFileSync } from "fs"

export type TargetWikiConfig = {
    name: string,
    namespace: number,
    title_like: string,
    url_base: string,
    telegram_chat?: string,
    misskey_instance?: string,
}

export const TARGET_WIKIS: TargetWikiConfig[] = [
    {
        name: 'zhwiki',
        namespace: 10,
        title_like: 'User\\_%',
        url_base: 'https://zh.wikipedia.org/',
        telegram_chat: '@zhwpublog',
        misskey_instance: 'misskey.cf',
    }
]

export type Secrets = {
    database: {
        username: string,
        password: string,
    },
    telegram: {
        bot_token: string,
    },
    misskey: any,
}

export const SECRETS = JSON.parse(readFileSync(process.env['HOME'] + '/secrets.json').toString()) as Secrets
