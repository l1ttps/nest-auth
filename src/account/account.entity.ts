import { Column, Entity, Generated, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Account {
    @PrimaryColumn({ type: "uuid" })
    @Generated("uuid") id: string;
    @Column({ unique: true })
    email: string;
    @Column()
    salt: string;
    @Column({ nullable: true })
    secretKey: string;
    @Column({ nullable: true, })
    secretKeyRft: string;
    @Column({ nullable: true })
    password: string;
    @Column({ nullable: true })
    gender: boolean;
    @Column({ nullable: true })
    birthday: Date;
    @Column({ length: 30, nullable: true })
    name: string;
}