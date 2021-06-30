import { Router } from 'express';
import UserService from '../services/UserServices.js';

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

export default Router()
  .post('/signup', (req, res, next) => {
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

  .post('/login', (req, res, next) => {
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
;
