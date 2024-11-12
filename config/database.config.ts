import { DataSource } from "typeorm";
import dotenv from "dotenv";

//Import declared entities from src/models/user
import User from "../src/models/user/user.model";
import UserEmail from "../src/models/user/email.model";
import UserPassword from "../src/models/user/password.model";
import UserSalt from "../src/models/user/salt.model";
import UserPublicId from "../src/models/user/publicId.model";
export const DatabaseConnection = new DataSource({
  type: "postgres",
  host: "localhost",
  port: Number(process.env.DATABASE_PORT),
  username: "SuperAdmin",
  password: "1234",
  database: "binjflix",
  entities: [User, UserEmail, UserPassword, UserSalt, UserPublicId],
  logging: false,
  synchronize: true,
  subscribers: [],
  migrations: [],
  uuidExtension: "uuid-ossp",
});

export const initializeDatabaseConnection = async (): Promise<void> => {
  try {
    await DatabaseConnection.initialize();
    console.log(
      new Date() +
        " -> LOG::Success::DatabaseConnection::initializeDatabaseConnection::Database connection initialized"
    );
  } catch (error) {
    console.log(
      new Date() +
        " -> LOG::Error::DatabaseConnection::initializeDatabaseConnection::Database connection initialization failed"
    );
    console.log(error);
  }
};
