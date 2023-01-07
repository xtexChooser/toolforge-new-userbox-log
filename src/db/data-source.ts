import { DataSource } from "typeorm"
import { SECRETS, TargetWikiConfig } from "../config"
import { Actor } from "./entity/Actor"
import { RecentChanges } from "./entity/RecentChanges"
import { WikiTrackState } from "./tools-entity/WikiTrackState"

export const ToolsDB = new DataSource({
    type: "mariadb",
    host: "tools.db.svc.wikimedia.cloud",
    port: 3306,
    username: SECRETS.database.username,
    password: SECRETS.database.password,
    database: `${SECRETS.database.username}__main`,
    synchronize: true,
    logging: true,
    entities: [WikiTrackState],
})

export async function getWikiDatabase(target: TargetWikiConfig): Promise<DataSource> {
    const ds = new DataSource({
        type: "mariadb",
        host: `${target.name}.analytics.db.svc.wikimedia.cloud`,
        port: 3306,
        username: SECRETS.database.username,
        password: SECRETS.database.password,
        database: `${target.name}_p`,
        synchronize: false,
        logging: true,
        entities: [RecentChanges, Actor],
    })
    await ds.initialize()
    return ds
}
