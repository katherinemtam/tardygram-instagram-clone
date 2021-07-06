import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserServices.js';
import Post from '../lib/models/Post.js';
import Comment from '../lib/models/Comment.js';

const agent = request.agent(app);

describe('post routes', () => {
  let user;
  let post;

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

    //creates a post
    post = await Post.create({
      userId: '1',
      photoUrl: 'cute dog picture',
      caption: 'Happy Doggo Day!',
      tags: ['cute', 'doggo', 'pupper']
    });
  });

  test('creates a comment via POST', async () => {
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

  test('deletes a comment via DELETE', async () => {
    const comment = await Comment.create({
      commentBy: user.id,
      postId: post.id,
      comment: 'Look at the face!'
    });

    const res = await agent
      .delete(`/api/v1/comments/${comment.id}`)
      .send(comment);

    expect(res.body).toEqual(comment);
  });
});
