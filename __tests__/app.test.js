import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';

describe('auth routes', () => {
  beforeEach(() => {
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
});
