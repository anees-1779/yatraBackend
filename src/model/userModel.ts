import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { post } from "./postModel"

@Entity()
export class user {
    @PrimaryGeneratedColumn()
    id!: Number

    @Column()
    name!: String

    @Column()
    role!: String

    @Column()
    email!: String

    @Column()
    password!: String
    
    @Column()
    age!: Number  

    @Column()
    phone_number!: Number

    @OneToMany(() => post, (post:any) => post.user)
    posts!: post[];
}