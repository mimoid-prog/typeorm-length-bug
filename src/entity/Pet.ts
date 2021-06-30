import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { User } from "./User";

@Entity()
export class Pet {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: string;

  @Column()
  type: string;

  @ManyToOne(() => User, (user) => user.pets)
  user: User;
}
