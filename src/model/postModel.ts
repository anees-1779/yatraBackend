import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { user } from "./userModel";

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

  @Column({nullable: true})
  likes?: Number;

  @Column({nullable: true})
  comments?: String;

  @ManyToOne(() => user, (user:any) => user.posts, { onDelete: 'CASCADE' })
  user!: user;
}

