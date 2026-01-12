import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Group } from "../../group/entity/group.entity";
import { userStatus } from "../types";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  status: userStatus;

  @ManyToMany(() => Group, (group) => group.users)
  @JoinTable({
    name: "user_groups",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "group_id", referencedColumnName: "id" },
  })
  groups: Group[];
}
