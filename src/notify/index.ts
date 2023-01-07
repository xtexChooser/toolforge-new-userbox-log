import { Update } from "../update";
import { sendMisskeyNotification } from "./misskey";
import { sendTelegramNotification } from "./telegram";

export async function sendNotification(update: Update) {
    if (update.wiki.telegram_chat) await sendTelegramNotification(update)
    if (update.wiki.misskey_instance) await sendMisskeyNotification(update)
}
