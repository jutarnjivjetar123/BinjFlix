import bcrypt from "bcrypt";

export default class EncryptionHelpers {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  static async validatePassword(password, hash): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static async generateSalt(numberOfRounds: number = 12) {
    return bcrypt.genSalt(numberOfRounds);
  }
}
