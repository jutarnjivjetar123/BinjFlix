import { DatabaseConnection } from "../../../config/database.config";
import User from "../../models/user/user.model";
import UserEmail from "../../models/user/email.model";
import UserPassword from "../../models/user/password.model";
import UserSalt from "../../models/user/salt.model";
import UserPublicId from "../../models/user/publicId.model";

export default class UserRepository {
  /**
   * Checks if a user with the given email already exists in the database.
   *
   * @param email - The email address to check for.
   * @returns A Promise that resolves to `true` if a user with the given email exists, `false` if not, or `null` if an error occurs.
   */
  public static async checkDoesUserWithEmailExist(
    email: string
  ): Promise<boolean> {
    return DatabaseConnection.getRepository(UserEmail)
      .exists({
        where: {
          email: email,
        },
      })
      .then((result) => {
        if (result) {
          console.log(
            "[LOG DATA] - " +
              new Date() +
              " -> LOG::Info::Repository::User::checkDoesUserWithEmailExist::User with email " +
              email +
              " already exists"
          );
          return result;
        }
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::checkDoesUserWithEmailExist::User with email " +
            email +
            " does not exist"
        );
        return result;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::checkDoesUserWithEmailExist::Error while checking if user with email " +
            email +
            " exists, error: " +
            error.message
        );

        return null;
      });
  }

  /**
   * Creates a new user in the database.
   *
   * @param user - The new user to be saved.
   * @returns A Promise that resolves to the saved user, or null if an error occurs.
   */
  public static async createNewUser(user: User): Promise<User> {
    return await DatabaseConnection.getRepository(User)
      .save(user)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::createNewUser::User with id " +
            data.userId +
            " created successfully"
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::createNewUser::Failed to create new User with following error: " +
            error.message
        );
        return null;
      });
  }

  /**
   * Creates a new user email in the database.
   *
   * @param userEmail - The new user email to be saved.
   * @returns A Promise that resolves to the saved user email, or null if an error occurs.
   */
  public static async createNewUserEmail(
    userEmail: UserEmail
  ): Promise<UserEmail> {
    return await DatabaseConnection.getRepository(UserEmail)
      .save(userEmail)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::createNewUserEmail::Created new UserEmail for User with id: " +
            data.user.userId +
            " with email " +
            data.email
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::createNewUserEmail::Failed to create new  UserEmail for User with id: " +
            userEmail.user.userId +
            " with email " +
            userEmail.email +
            " with following error: " +
            error.message
        );
        return null;
      });
  }

  /**
   * Creates a new user password in the database.
   *
   * @param newUserPassword - The new user password to be saved.
   * @returns A Promise that resolves to the saved user password, or null if an error occurs.
   */
  public static async createNewUserPassword(newUserPassword: UserPassword) {
    return await DatabaseConnection.getRepository(UserPassword)
      .save(newUserPassword)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::createNewUserPassword::Created new UserPassword for User with Id: " +
            data.user.userId
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::createNewUserPassword::Failed to create new UserPassword for User with Id: " +
            newUserPassword.user.userId +
            " with error: " +
            error.message
        );
        return null;
      });
  }

  public static async createNewUserSalt(userSalt: UserSalt) {
    return DatabaseConnection.getRepository(UserSalt)
      .save(userSalt)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::createNewUserSalt::Created new UserSalt for User with Id: " +
            data.user.userId
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::createNewUserPassword::Failed to create new UserSalt for User with Id: " +
            userSalt.user.userId +
            " with error: " +
            error.message
        );
        return null;
      });
  }

  public static async createNewUserPublicId(
    newPublicId: UserPublicId
  ): Promise<UserPublicId> {
    return await DatabaseConnection.getRepository(UserPublicId)
      .save(newPublicId)
      .then((data) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::createNewUserPublicId::Created new UserPublicId for User with Id: " +
            data.user.userId
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::createNewUserPublicId::Failed to create new UserPublicId for User with Id: " +
            newPublicId.user.userId +
            " with error: " +
            error.message
        );
        return null;
      });
  }

  /**
   * Retrieves the login data for a user by their email address.
   *
   * @param email - The email address of the user to retrieve login data for.
   * @returns A Promise that resolves to an object containing the user's login data, including the User, UserEmail, UserPassword, UserSalt, and UserPublicId entities. If no user is found with the given email, an empty object is returned.
   */
  public static async getUserLoginDataByEmail(email: string): Promise<any> {
    return await DatabaseConnection.getRepository(User)
      .createQueryBuilder("user")
      .innerJoinAndSelect(
        UserEmail,
        "userEmail",
        "user.userId = userEmail.user.userId"
      )
      .innerJoinAndSelect(
        UserPassword,
        "userPassword",
        "user.userId = userPassword.user.userId"
      )
      .innerJoinAndSelect(
        UserSalt,
        "userSalt",
        "user.userId = userSalt.user.userId"
      )
      .innerJoinAndSelect(
        UserPublicId,
        "userPublicId",
        "user.userId = userPublicId.user.userId"
      )
      .where("userEmail.email = :email", { email: email })
      .getRawOne()
      .then((data) => {
        if (!data) {
          console.log(
            "[LOG DATA] - " +
              new Date() +
              " -> LOG::Info::Repository::User::getUserLoginDataByEmail::No User object with UserEmail with email " +
              email +
              " found, no login data to return"
          );
          return {};
        }
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Info::Repository::User::getUserLoginDataByEmail::Found User object with UserEmail with email " +
            email +
            " with login data objects (User, UserEmail, UserPassword, UserSalt) are to be returned"
        );
        return data;
      })
      .catch((error) => {
        console.log(
          "[LOG DATA] - " +
            new Date() +
            " -> LOG::Error::Repository::User::getUserLoginDataByEmail::Error occurred while trying to fetch User object connected to UserEmail object with email " +
            email +
            " with error: " +
            error.message
        );
        return null;
      });
  }
}
