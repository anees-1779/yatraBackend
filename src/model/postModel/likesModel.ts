import { Entity, PrimaryColumn, ManyToOne } from "typeorm";
import { user } from "../userModel/userModel";

@Entity()
export class like{
  @PrimaryColumn()
  id!: Number

  @ManyToOne(() => user, (user: any) =>{
    user.likes, { onDelete: "CASCADE"}
  })
  user!: user
}