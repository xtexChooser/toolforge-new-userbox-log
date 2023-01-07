import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity('recentchanges')
export class RecentChanges {

    @PrimaryColumn('int', { width: 10, unsigned: true })
    rc_id: number

    @Column('binary', { length: 14 })
    rc_timestamp: string

    @Column('decimal', { precision: 20 })
    rc_actor: number

    @Column('varbinary', { length: 255 })
    rc_title: string

    @Column('int', { width: 10 })
    rc_cur_id: number

    @Column('tinyint', { width: 3, unsigned: true })
    rc_bot: number

    @Column('int', { width: 11 })
    rc_namespace: number

    @Column('tinyint', { width: 3, unsigned: true })
    rc_new: number

}
