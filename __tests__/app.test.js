import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import UserService from '../lib/services/UserServices.js';

describe('auth routes', () => {
  beforeAll(() => {
    return setup(pool);
  });

  test('signs up a user via POST', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoUrl: 'profilephoto.url'
      });

    expect(res.body).toEqual({
      id: '1',
      email: 'test@test.com',
      profilePhotoUrl: 'profilephoto.url'
    });
  });

  test('logs in a user via POST', async() => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
        profilePhotoUrl: 'profilephoto.url'
      });

    expect(res.body).toEqual({
      id: '1',
      email: 'test@test.com',
      profilePhotoUrl: 'profilephoto.url'
    });
  });

  test('verifies a user is logged in', async() => {
    const agent = request.agent(app);
    const user = await UserService.create({
      email: 'hello@jello.com',
      password: 'ahoy',
      profilePhotoUrl: 'jellybean'
    });

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'hello@jello.com',
        password: 'ahoy',
        profilePhotoUrl: 'jellybean'
      });

    const res = await agent
      .get('/api/v1/verify');

    expect(res.body).toEqual({
      id: user.id,
      email: 'hello@jello.com',
      passwordHash: expect.any(String),
      profilePhotoUrl: 'jellybean',
      iat: expect.any(Number),
      exp: expect.any(Number)
    });
  });
});
