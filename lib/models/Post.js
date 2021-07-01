import pool from '../utils/pool.js';
import Comment from '../models/Comment.js';
import comments from '../controllers/comments.js';

export default class Post {
  id;
  userId;
  photoUrl;
  caption;
  tags;

  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.photoUrl = row.photo_url;
    this.caption = row.caption;
    this.tags = row.tags;
  }

  static async create({ userId, photoUrl, caption, tags }) {
    const { rows } = await pool.query(`
      INSERT INTO posts (user_id, photo_url, caption, tags)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [userId, photoUrl, caption, tags]);

    return new Post(rows[0]);
  }

  static async findAll() {
    const { rows } = await pool.query(`
      SELECT *
      FROM posts
    `);

    return rows.map(post => new Post(post));
  }

  static async findById(id) {
    const { rows } = await pool.query(`
      SELECT  posts.*, comments.*
      FROM posts
      INNER JOIN users
      ON posts.user_id = users.id
      INNER JOIN comments
      ON posts.user_id = comments.comment_by
      WHERE posts.id = $1
    `, [id]);

    return { ...new Post(rows[0]), comments: rows.map(post => post.comment) };
  }

  static async patch(post, id) {
    const { rows } = await pool.query(`
      UPDATE posts
      SET caption = $1
      WHERE id = $2
      RETURNING *
    `, [post.caption, id]);

    return new Post(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(`
      DELETE FROM posts
      WHERE id = $1
      RETURNING *
    `, [id]);

    return new Post(rows[0]);
  }

  static async getPopular() {
    const { rows } = await pool.query(`
      SELECT posts.*, COUNT(comments.comment)
      FROM comments
      INNER JOIN posts
      ON posts.id = comments.post_id
      GROUP BY posts.id
      ORDER BY count DESC
      LIMIT 10
      `);

    return rows.map(row => new Post(row));
  }
}
