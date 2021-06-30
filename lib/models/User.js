import pool from '../utils/pool.js';
import jwt from 'jsonwebtoken';

export default class User {
  id;
  username;
  passwordHash;
  profilePhotoUrl;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.passwordHash = row.password_hash;
    this.profilePhotoUrl = row.profile_photo_url;
  }

  static async insert({ username, passwordHash, profilePhotoUrl }) {
    
    const { rows } = await pool.query(`
      INSERT INTO users (username, password_hash, profile_photo_url)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [username, passwordHash, profilePhotoUrl]);

    return new User(rows[0]);
  }

  static async findByUsername(username) {
    
    const { rows } = await pool.query(`
      SELECT *
      FROM users
      WHERE username = $1
    `, [username]);

    if(!rows[0]) return null;
    return new User(rows[0]);
  }

  authToken() {
    //(info, 'SIGNATURE', time limit)
    return jwt.sign(
      { ...this }, 
      process.env.APP_SECRET, 
      { expiresIn: '24h' }
    );
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      profilePhotoUrl: this.profilePhotoUrl
    };
  }
}
