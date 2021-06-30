import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from "typeorm";
import { Pet } from "./Pet";

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Pet, (pet) => pet.user)
  pets: Pet[];
}
