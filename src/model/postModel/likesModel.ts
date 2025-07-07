import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { user } from "../userModel/userModel";
import { post } from "./postModel";

@Entity()
export class like{
  @PrimaryGeneratedColumn()
  id!: Number

  @ManyToOne(() => user, (user: any) =>{
    user.likes, { onDelete: "CASCADE"}
  })
  user!: user

  @ManyToOne(() => post, (post: any) =>{
      post.likes, { onDelete: "CASCADE"}
    })
    post!: post
}