import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { post } from "./postModel";

@Entity()
export class picture {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fileName!: string;   // store only filename or full URL

  @ManyToOne(() => post, (post) => post.images, { onDelete: "CASCADE" })
  post!: post;
}
