import { Router } from 'express';
import UserService from '../services/UserServices.js';
import ensureAuth from '../middleware/ensure-auth.js';

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

export default Router()
  .post('/api/v1/auth/signup', (req, res, next) => {
    UserService.create(req.body)
      .then(user => {
        //attach a JWT to response
        res.cookie('session', user.authToken(), {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS
        });
        res.send(user);
      })
      .catch(next);
  })

  .post('/api/v1/auth/login', (req, res, next) => {
    UserService.authorize(req.body)
      .then(user => {
        //attach a JWT to response
        res.cookie('session', user.authToken(), {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS
        });
        res.send(user);
      })
      .catch(next);
  })

  .get('/api/v1/verify', ensureAuth, (req, res, next) => {
    res.send(req.user)
      .catch(next);
  });
