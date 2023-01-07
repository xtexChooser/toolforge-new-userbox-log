import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity('actor')
export class Actor {

    @PrimaryColumn('bigint', { width: 20, unsigned: true })
    actor_id: number

    @Column('int', { width: 10, unsigned: true })
    actor_user?: number

    @Column('varbinary', { length: 255 })
    actor_name: string

}
