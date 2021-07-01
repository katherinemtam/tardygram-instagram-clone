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

  beforeEach(async() => {
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

  test('gets all posts via GET', async() => {
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

  test('gets a post via GET', async() => {
    const post = await Post.create({
      userId: user.id,
      photoUrl: 'beach photo',
      caption: 'Summer Time!',
      tags: ['summer', 'hot', 'beach']
    });

    await Comment.create({
      commentBy: user.id,
      postId: post.id,
      comment: 'Look at this comment!'
    });

    await Comment.create({
      commentBy: user.id,
      postId: post.id,
      comment: 'Wow! Another comment!'
    });

    const res = await agent
      .get(`/api/v1/posts/${post.id}`);
    
    expect(res.body).toEqual({
      ...post, comments: ['Look at this comment!', 'Wow! Another comment!'] 
    });
  });

  test('updates a post via PATCH', async() => {
    const post = await Post.create({
      userId: '1',
      photoUrl: 'beach photo',
      caption: 'Summer Time!',
      tags: ['summer', 'hot', 'beach']
    });

    post.caption = 'Sun\'s out, buns out!';

    const res = await agent
      .patch(`/api/v1/posts/${post.id}`)
      .send({ caption: 'Sun\'s out, buns out!' });

    expect(res.body).toEqual({
      id: '1',
      userId: '1',
      photoUrl: 'beach photo',
      caption: 'Sun\'s out, buns out!',
      tags: ['summer', 'hot', 'beach']
    });

    expect(res.body.caption).not.toEqual('Summer Time!');
  });

  test('deletes a post via DELETE', async() => {
    const post = await Post.create({
      userId: '1',
      photoUrl: 'giant rubber ducky in a pool',
      caption: 'Pool Party',
      tags: ['pool', 'party', 'duck']
    });

    const res = await agent
      .delete(`/api/v1/posts/${post.id}`)
      .send(post);

    expect(res.body).toEqual(post);
  });

  test('returns a list of the top 10 posts with the most comments', async () => {
    const post1 = await Post.create({
      userId: user.id,
      photoUrl: 'cute dog picture',
      caption: 'Happy Doggo Day!',
      tags: ['cute', 'doggo', 'pupper']
    });

    const commentP1C1 = await Comment.create({
      commentBy: user.id,
      postId: post1.id,
      comment: 'comment'
    });

    const commentP1C2 = await Comment.create({
      commentBy: user.id,
      postId: post1.id,
      comment: 'comment'
    });

    const commentP1C3 = await Comment.create({
      commentBy: user.id,
      postId: post1.id,
      comment: 'comment'
    });

    const post2 = await Post.create({
      userId: user.id,
      photoUrl: 'fireworks',
      caption: 'Happy New Years!',
      tags: ['newyear', 'fireworks', 'champagne']
    });

    const commentP2C1 = await Comment.create({
      commentBy: user.id,
      postId: post2.id,
      comment: 'comment'
    });

    const commentP2C2 = await Comment.create({
      commentBy: user.id,
      postId: post2.id,
      comment: 'comment'
    });

    const commentP2C3 = await Comment.create({
      commentBy: user.id,
      postId: post2.id,
      comment: 'comment'
    });

    const post3 = await Post.create({
      userId: user.id,
      photoUrl: 'santa',
      caption: 'Merry Christmas!',
      tags: ['lights', 'snow', 'christmas']
    });

    const commentP3C1 = await Comment.create({
      commentBy: user.id,
      postId: post3.id,
      comment: 'comment'
    });

    const commentP3C2 = await Comment.create({
      commentBy: user.id,
      postId: post3.id,
      comment: 'comment'
    });

    const post4 = await Post.create({
      userId: user.id,
      photoUrl: 'hearts',
      caption: 'Happy Valentine\'s Day!',
      tags: ['love', 'chocolates', 'couples']
    });

    const commentP4C1 = await Comment.create({
      commentBy: user.id,
      postId: post4.id,
      comment: 'comment'
    });

    const commentP4C2 = await Comment.create({
      commentBy: user.id,
      postId: post4.id,
      comment: 'comment'
    });

    const commentP4C3 = await Comment.create({
      commentBy: user.id,
      postId: post4.id,
      comment: 'comment'
    });

    const post5 = await Post.create({
      userId: user.id,
      photoUrl: 'turkey',
      caption: 'Happy Thanksgiving!',
      tags: ['food', 'thanksgiving', 'stuffed']
    });

    const commentP5C1 = await Comment.create({
      commentBy: user.id,
      postId: post5.id,
      comment: 'comment'
    });

    const commentP5C2 = await Comment.create({
      commentBy: user.id,
      postId: post5.id,
      comment: 'comment'
    });

    const post6 = await Post.create({
      userId: user.id,
      photoUrl: 'fireworks',
      caption: 'Happy 4th of July!',
      tags: ['red', 'white', 'blue']
    });

    const commentP6C1 = await Comment.create({
      commentBy: user.id,
      postId: post6.id,
      comment: 'comment'
    });

    const commentP6C2 = await Comment.create({
      commentBy: user.id,
      postId: post6.id,
      comment: 'comment'
    });

    const post7 = await Post.create({
      userId: user.id,
      photoUrl: 'american flag',
      caption: 'Happy Memorial Day!',
      tags: ['america', 'flag', 'salute']
    });

    const commentP7C1 = await Comment.create({
      commentBy: user.id,
      postId: post7.id,
      comment: 'comment'
    });

    const post8 = await Post.create({
      userId: user.id,
      photoUrl: 'black and white photo',
      caption: 'Happy Veteran\'s Day!',
      tags: ['world', 'war', '11/11/18']
    });

    const commentP8C1 = await Comment.create({
      commentBy: user.id,
      postId: post8.id,
      comment: 'comment'
    });

    const post9 = await Post.create({
      userId: user.id,
      photoUrl: 'countdown',
      caption: 'Happy New Year\'s Eve!',
      tags: ['lastday', 'countdown', 'newyearnewme']
    });

    const commentP9C1 = await Comment.create({
      commentBy: user.id,
      postId: post9.id,
      comment: 'comment'
    });

    const commentP9C2 = await Comment.create({
      commentBy: user.id,
      postId: post9.id,
      comment: 'comment'
    });

    const post10 = await Post.create({
      userId: user.id,
      photoUrl: 'George Washington',
      caption: 'Happy Birthday George Washington!',
      tags: ['george', 'washington', 'birthday']
    });

    const post11 = await Post.create({
      userId: user.id,
      photoUrl: 'parade',
      caption: 'Happy Labor Day!',
      tags: ['labor', 'movement', 'america']
    });

    const post12 = await Post.create({
      userId: user.id,
      photoUrl: 'president',
      caption: 'Happy Inauguration Day!',
      tags: ['president', 'vp', 'politics']
    });

    const commentP12C1 = await Comment.create({
      commentBy: user.id,
      postId: post12.id,
      comment: 'comment'
    });

    const post13 = await Post.create({
      userId: user.id,
      photoUrl: 'Martin Luther King Jr.',
      caption: 'Happy Birthday MLK!',
      tags: ['civilrights', 'mlk', 'birthday']
    });

    const res = await agent
      .get('/api/v1/posts/popular');

    expect(res.body).toEqual(expect.arrayContaining([post1, post2, post4, post3, post5, post6, post9, post7, post8, post12]));
  });
});

