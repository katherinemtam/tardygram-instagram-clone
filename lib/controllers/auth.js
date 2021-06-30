import { Router } from 'express';
import UserService from '../services/UserServices.js';

export default Router()
  .post('/signup', (req, res, next) => {
    UserService.create(req.body)
      .then(user => res.send(user))
      .catch(next);
  });
