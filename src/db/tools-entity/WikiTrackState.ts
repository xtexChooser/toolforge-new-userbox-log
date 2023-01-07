import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class WikiTrackState {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    wiki: string

    @Column('int', { width: 10, unsigned: true })
    rc_id: number

    @Column('timestamp')
    updated_at: Date

}
