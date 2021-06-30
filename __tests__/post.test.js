import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserServices.js';
import Post from '../lib/models/Post.js';

const agent = request.agent(app);

describe('post routes', () => {
  let user;

  beforeEach(async() => {
    await setup(pool);

    //create user
    user = await UserService.create({
      email: 'test@test.com',
      password: 'password',
      profilePhotoUrl: 'profilephoto.url'
    });

    //logs in user w/ cookie + token
    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoUrl: 'profilephoto.url'
      });

    return user;
  });

  test('creates a post via POST', async () => {
    const res = await agent
      .post('/api/v1/posts')
      .send({
        userId: '1',
        photoUrl: 'cute dog picture',
        caption: 'Happy Doggo Day!',
        tags: ['cute', 'doggo', 'pupper']
      });

    expect(res.body).toEqual({
      id: '1',
      userId: '1',
      photoUrl: 'cute dog picture',
      caption: 'Happy Doggo Day!',
      tags: ['cute', 'doggo', 'pupper']
    });
  });

  test('gets all posts', async() => {
    const firstPost = await Post.create({
      userId: '1',
      photoUrl: 'cute dog picture',
      caption: 'Happy Doggo Day!',
      tags: ['cute', 'doggo', 'pupper']
    });

    const secondPost = await Post.create({
      userId: '1',
      photoUrl: 'beach photo',
      caption: 'Summer Time!',
      tags: ['summer', 'hot', 'beach']
    });
    
    const res = await agent
      .get('/api/v1/posts');

    expect(res.body).toEqual([firstPost, secondPost]);
  });
});
