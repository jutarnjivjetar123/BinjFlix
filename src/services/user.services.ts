import validator from "validator";
import ReturnObjectHandler from "../utilities/return.handler.utilities";
import UserRepository from "../repository/user/user.repository";
import EncryptionHelpers from "../helpers/encryption.helpers";

import User from "../models/user/user.model";
import UserEmail from "../models/user/email.model";
import UserPassword from "../models/user/password.model";
import UserSalt from "../models/user/salt.model";
import UserPublicId from "../models/user/publicId.model";
export default class UserService {
  /**
   * Registers a new user with the provided email and password.
   *
   * @param email - The email address of the user to register.
   * @param password - The password for the new user.
   * @returns A `ReturnObjectHandler` with the result of the registration process. If successful, the object will contain the created `User` and `UserEmail` instances.
   */
  public static async registerUserByEmail(email: string, password: string) {
    if (!validator.isEmail(email)) {
      return new ReturnObjectHandler("Invalid email address", null, 400);
    }

    //Check if the User with given email exists
    const isEmailTaken = await UserRepository.checkDoesUserWithEmailExist(
      email
    );
    if (isEmailTaken === null) {
      return new ReturnObjectHandler(
        "An error occurred while checking if the email is taken",
        null,
        500
      );
    }
    if (isEmailTaken === true) {
      return new ReturnObjectHandler("Email is taken", null, 400);
    }

    //Create new User
    const newUser = new User();
    newUser.userEmailToSignUp = true;
    newUser.createdAt = new Date().getTime().toString();
    const createdUser = await UserRepository.createNewUser(newUser);

    if (!createdUser) {
      return new ReturnObjectHandler(
        "An error occurred while creating the user",
        null,
        500
      );
    }

    //Create new UserEmail
    const newUserEmail = new UserEmail();
    newUserEmail.user = createdUser;
    newUserEmail.email = email;
    newUserEmail.createdAt = new Date().getTime().toString();

    const createdUserEmail = await UserRepository.createNewUserEmail(
      newUserEmail
    );
    if (!createdUserEmail) {
      return new ReturnObjectHandler(
        "An error occurred while creating the user email",
        null,
        500
      );
    }

    //Create new UserPassword
    const newUserPassword = new UserPassword();
    newUserPassword.hash = await EncryptionHelpers.hashPassword(password);
    newUserPassword.salt = await EncryptionHelpers.generateSalt();
    newUserPassword.user = createdUser;
    newUserPassword.createdAt = new Date().getTime().toString();

    const createdUserPassword = await UserRepository.createNewUserPassword(
      newUserPassword
    );
    if (!createdUserPassword) {
      return new ReturnObjectHandler(
        "An error occurred while creating the user password",
        null,
        500
      );
    }

    //Create new UserSalt
    const newUserSalt = new UserSalt();
    newUserSalt.salt = await EncryptionHelpers.generateSalt();
    newUserSalt.user = createdUser;
    newUserSalt.createdAt = new Date().getTime().toString();

    const createdUserSalt = await UserRepository.createNewUserSalt(newUserSalt);

    if (!createdUserSalt) {
      return new ReturnObjectHandler(
        "An error occurred while creating the user salt",
        null,
        500
      );
    }

    //Create new UserPublicId
    const newUserPublicId = new UserPublicId();
    newUserPublicId.user = createdUser;
    newUserPublicId.createdAt = new Date().getTime().toString();

    const createdUserPublicId = await UserRepository.createNewUserPublicId(
      newUserPublicId
    );
    if (!createdUserPublicId) {
      return new ReturnObjectHandler(
        "An error occurred while creating the user public id",
        null,
        500
      );
    }

    return new ReturnObjectHandler(
      "User successfully created",
      {
        user: createdUser,
        userEmail: createdUserEmail,
        userPublicId: createdUserPublicId,
      },
      200
    );
  }

  /**
   * Logs in a user by their email address and password.
   *
   * @param email - The email address of the user to log in.
   * @param password - The password of the user to log in.
   * @returns A `ReturnObjectHandler` with the login status and user data, or an error message and status code.
   */
  public static async loginUserByEmail(email: string, password: string) {
    if (!validator.isEmail(email)) {
      return new ReturnObjectHandler("Invalid email address", null, 400);
    }

    //Get login data (UserEmail and UserPassword connected to the User with the given email)
    const loginData = await UserRepository.getUserLoginDataByEmail(email);

    if (loginData === null) {
      return new ReturnObjectHandler(
        "An error occurred while fetching the login data",
        null,
        500
      );
    }

    //Check if the retrieved database data has any fields in the given object
    if (Object.keys(loginData).length < 1) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Check if the password is correct
    const isPasswordCorrect = await EncryptionHelpers.validatePassword(
      password,
      loginData["userPassword_hash"]
    );

    if (!isPasswordCorrect) {
      return new ReturnObjectHandler("Invalid password", null, 401);
    }

    console.log(loginData);
    //Attempt to order data into corresponding objects
    const assignValues = (
      result: any,
      object: any,
      prefix: string,
      separator: string = "_"
    ) => {
      Object.keys(result).forEach((key) => {
        if (key.startsWith(`${prefix}${separator}`)) {
          const attribute = key.replace(`${prefix}${separator}`, "");
          console.log(attribute);
          object[attribute] = result[key];
        }
      });
    };

    const user = new User();
    const userEmail = new UserEmail();
    const userPassword = new UserPassword();
    const userSalt = new UserSalt();
    const userPublicId = new UserPublicId();

    assignValues(loginData, user, "user");
    assignValues(loginData, userEmail, "userEmail");
    assignValues(loginData, userPassword, "userPassword");
    assignValues(loginData, userSalt, "userSalt");
    assignValues(loginData, userPublicId, "userPublicId");
    console.log(user);
    const returnData = {
      user,
      userEmail,
      userPassword,
      userSalt,
      userPublicId,
    };
    console.log(returnData);
    return new ReturnObjectHandler("User logged in", returnData, 200);
  }

  private static assignValues(
    unorderedObject: any,
    returnObject: any,
    prefix: string,
    separator: string = "_"
  ): any {
    Object.keys(unorderedObject).forEach((key) => {
      if (key.startsWith(prefix)) {
        const attribute = key.replace(`${prefix}${separator}`, "");
        returnObject[attribute] = unorderedObject[key];
      }
    });
    return returnObject;
  }
}
