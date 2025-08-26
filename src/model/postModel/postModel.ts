import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { user } from "../userModel/userModel";
import { comment } from "./commentsModel";
import { like } from "./likesModel";
import { picture as PostImage } from "./imageModel";

@Entity()
export class post{
  @PrimaryGeneratedColumn()
  id!: Number

  @Column()
  description!: string;

  @Column({ type: "float" })
  rating!: Number;

  @Column()
  difficulty!: String;

  @Column()
  destination!: String;

  @Column()
  category!: String;

  @Column({nullable: true, default: 0})
  likes?: Number;

  @Column({nullable: true, default: 0})
  comments?: Number;

  // Post.ts
  @OneToMany(() => PostImage, (image) => image.post, { cascade: true })
  images!: PostImage[];
  
  @ManyToOne(() => user, (user:any) => user.posts, { onDelete: 'CASCADE' })
  user!: user;

  @OneToMany(() => comment, (comment: any) => comment.posts, { onDelete: 'CASCADE' })
  comment!: comment;

  @OneToMany(() => like, (like: any) => like.posts, { onDelete: 'CASCADE' })
  like!: like;
}

