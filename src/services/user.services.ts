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

    if (Object.keys(loginData).length < 1) {
      return new ReturnObjectHandler("User not found", null, 404);
    }

    //Check if the password is correct
    const isPasswordCorrect = await EncryptionHelpers.validatePassword(
      password,
      loginData["userPassword_hash"]
    );
    console.log("Is password correct: " + isPasswordCorrect);
    if (!isPasswordCorrect) {
      return new ReturnObjectHandler("Invalid password", null, 401);
    }

    console.log(loginData);
    return new ReturnObjectHandler("User found", "TEST DATA", 200);
  }
}
