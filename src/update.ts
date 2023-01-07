import { And, DataSource, LessThanOrEqual, Like, MoreThan } from "typeorm";
import { TargetWikiConfig } from "./config";
import { ToolsDB } from "./db/data-source";
import { Actor } from "./db/entity/Actor";
import { RecentChanges } from "./db/entity/RecentChanges";
import { WikiTrackState } from "./db/tools-entity/WikiTrackState";

export type Update = {
    wiki: TargetWikiConfig,
    rc: RecentChanges,
    viewUrl: string,
    pageTitle: string,
    user: Actor,
}

export async function checkUpdates(wiki: TargetWikiConfig, db: DataSource): Promise<Update[]> {
    const newRcID = await getLatestRcID(db)
    console.info(`latest rc id: ${newRcID}`)
    console.info('getting wiki track state...')
    const wikiState = await ToolsDB.manager.findOneBy(WikiTrackState, { wiki: wiki.name })
        || await (async () => {
            const state = new WikiTrackState()
            state.wiki = wiki.name
            state.rc_id = newRcID - 100000
            return state
        })()

    const updates = await Promise.all((await db.manager.find(RecentChanges, {
        order: {
            rc_id: 'DESC'
        },
        where: {
            rc_id: And(LessThanOrEqual(newRcID), MoreThan(wikiState.rc_id)),
            rc_namespace: wiki.namespace,
            rc_new: 1,
            rc_title: Like(wiki.title_like)
        }
    })).map(async rc => {
        console.info(`found rc: ${rc.rc_id}`, rc)
        return {
            wiki,
            rc,
            viewUrl: `${wiki.url_base}?curid=${rc.rc_cur_id}`,
            pageTitle: parsePageTitle(rc.rc_title.toString()),
            user: await db.manager.findOneByOrFail(Actor, { actor_id: rc.rc_actor })
        } as Update
    }))

    wikiState.rc_id = newRcID
    wikiState.updated_at = new Date()
    console.info('saving wiki track state...')
    await ToolsDB.manager.save(wikiState)
    console.info('saved wiki track state')

    return updates
}

async function getLatestRcID(db: DataSource): Promise<number> {
    const rc = await db.manager.findOne(RecentChanges, {
        select: {
            rc_id: true
        },
        where: {},
        order: {
            rc_id: 'DESC'
        },
    })
    return rc.rc_id
}

export function parsePageTitle(title: string): string {
    return title.toString().replace(/_/g, ' ')
}
