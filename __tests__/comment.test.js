import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserServices.js';
import Post from '../lib/models/Post.js';

const agent = request.agent(app);

describe('post routes', () => {
  let user;

  beforeEach(async () => {
    await setup(pool);

    //create user
    user = await UserService.create({
      username: 'test',
      password: 'password',
      profilePhotoUrl: 'profilephoto.url'
    });

    //logs in user w/ cookie + token
    await agent
      .post('/api/v1/auth/login')
      .send({
        username: 'test',
        password: 'password',
        profilePhotoUrl: 'profilephoto.url'
      });
  });

  test('creates a comment via POST', async () => {
    //creates a post
    const post = await Post.create({
      userId: '1',
      photoUrl: 'cute dog picture',
      caption: 'Happy Doggo Day!',
      tags: ['cute', 'doggo', 'pupper']
    });

    const res = await agent
      .post('/api/v1/comments')
      .send({
        commentBy: user.id,
        postId: post.id,
        comment: 'That\'s a good boy!'
      });

    expect(res.body).toEqual({
      id: '1',
      commentBy: user.id,
      postId: post.id,
      comment: 'That\'s a good boy!',
    });
  });
});
