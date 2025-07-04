import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { post } from "./postModel"

@Entity()
export class user {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: String

    @Column()
    username!:String
    
    @Column()
    role!: String

    @Column()
    email!: String

    @Column()
    password!: String
    
    @Column()
    age!: number  

    @Column({type: "bigint"})
    phone_number!: number

    @OneToMany(() => post, (post:any) => post.user)
    posts!: post[];
}