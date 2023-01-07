import { Update } from "../update";
import { sendTelegramNotification } from "./telegram";

export async function sendNotification(update: Update) {
    if (update.wiki.telegram_chat) await sendTelegramNotification(update)
}
