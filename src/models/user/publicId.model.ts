import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import User from "../user/user.model";

@Entity({
  schema: "User",
  name: "UserPublicId",
})
export default class UserPublicId {
  @PrimaryGeneratedColumn("uuid")
  userPublicId: string;

  @OneToOne(() => User)
  @JoinColumn({
    name: "userId",
  })
  user: User;

  @Column("bigint")
  createdAt: string;

  @Column("bigint", {
    nullable: true,
  })
  modifiedAt: string | null;
}
