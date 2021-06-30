import { Router } from 'express';
import ensureAuth from '../middleware/ensure-auth.js';
import Post from '../models/Post.js';

export default Router()
  .post('/', ensureAuth, (req, res, next) => {
    Post.insert({ ...req.body, userId: req.user.id })
      .then(post => res.send(post))
      .catch(next);
  });
