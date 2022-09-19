import { ClubEntity } from "../club/club.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SocioEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    birthdate: Date;

    @ManyToMany(() => ClubEntity, club => club.socios)
    clubs?: ClubEntity[];
}
