import "reflect-metadata"

import { TARGET_WIKIS } from "./config"
import { getWikiDatabase, ToolsDB } from "./db/data-source"
import { sendNotification } from "./notify"
import { checkUpdates } from "./update"

(async function () {
    console.info('initializing tools db conn')
    await ToolsDB.initialize()
    console.info('tools db initialized')

    for (const config of TARGET_WIKIS) {
        console.info(`processing ${config.name}`)
        const ds = await getWikiDatabase(config)
        const updates = await checkUpdates(config, ds)
        console.info(`found ${updates.length} updates on ${config.name}`)
        await ds.destroy()

        for (const update of updates) {
            console.info(`notifying ${update}`)
            sendNotification(update)
        }
        console.info(`processed ${config.name}`)
    }
    console.info('all done')
})()
