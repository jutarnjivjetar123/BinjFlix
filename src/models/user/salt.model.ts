import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";

import User from "./user.model";

@Entity("UserSalt", {
  schema: "User",
})
export default class UserSalt {
  @PrimaryGeneratedColumn("uuid")
  saltID: string;

  @Column()
  salt: string;
  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "bigint" })
  createdAt: string;

  @Column({
    nullable: true,
    type: "bigint",
  })
  modifiedAt: string | null;
}
