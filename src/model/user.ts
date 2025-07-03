import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class user {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    role!: string

    @Column()
    email!: string

    @Column()
    password!: string
    
    @Column()
    age!: Number  

    @Column()
    phone_number!: Number
}