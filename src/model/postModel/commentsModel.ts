import { Entity, PrimaryColumn, ManyToOne, Column } from "typeorm";
import { user } from "../userModel/userModel";
import { post } from "./postModel";

@Entity()
export class comment{
  @PrimaryColumn()
  id!: Number

  @Column({nullable: true})
  comment_description!: string;

  @ManyToOne(() => user, (user: any) =>{
    user.comments, { onDelete: "CASCADE"}
  })
  user!: user

  @ManyToOne(() => post, (post: any) =>{
    post.comments, { onDelete: "CASCADE"}
  })
  post!: post
}