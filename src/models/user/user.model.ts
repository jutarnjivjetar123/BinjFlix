import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({
  schema: "User",
  name: "User",
})
export default class User {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column("boolean")
  userEmailToSignUp: boolean;

  @Column({ type: "bigint" })
  createdAt: string;

  @Column({
    nullable: true,
    type: "bigint",
  })
  modifiedAt: string | null;
}
