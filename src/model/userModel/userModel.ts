import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { post } from "../postModel/postModel"
import { like } from "../postModel/likesModel"
import { comment } from "../postModel/commentsModel"

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

    @Column({default: false})
    is_loggged_in!: boolean

    @Column({default: null, nullable: true})
    opt!: string

    @OneToMany(() => post, (post:any) => post.user)
    posts!: post[];

    @OneToMany(() => like, (like) => like.user)
    likes!: like[];

    @OneToMany(() => comment, (comment) => comment.user)
    comments!: comment[];
}