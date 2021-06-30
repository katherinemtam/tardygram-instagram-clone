import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export default class UserService {
  static async create({ username, password, profilePhotoUrl }) {
    const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

    return User.insert({ username, passwordHash, profilePhotoUrl });
  }

  static async authorize({ username, password }) {
    const user = await User.findByUsername(username);
    if(!user) {
      throw new Error('Invalid username/password');
    }

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if(!passwordsMatch) {
      throw new Error('Invalid username/password');
    }

    return user;
  }
}
