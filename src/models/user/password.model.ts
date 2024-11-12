import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
  } from "typeorm";
  
  import User from "./user.model";
  @Entity("UserPassword", {
    schema: "User",
  })
  export default class UserPassword {
    @PrimaryGeneratedColumn("uuid")
    passwordID: string;
  
    @OneToOne(() => User)
    @JoinColumn({ name: "userId" })
    user: User;
  
    @Column()
    hash: string;
  
    @Column()
    salt: string;
  
    @Column({ type: "bigint" })
    createdAt: string;
  
    @Column({
      nullable: true,
      type: "bigint",
    })
    updatedAt: string | null;
  }
  