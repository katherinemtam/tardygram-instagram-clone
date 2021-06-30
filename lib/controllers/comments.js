import { Router } from 'express';
import ensureAuth from '../middleware/ensure-auth';
import Comment from '../models/Comment.js';


export default Router()
  .post('/', ensureAuth, (req, res, next) => {
    Comment.create({ ...req.body, commentBy: req.user.id })
      .then(comment => res.send(comment))
      .catch(next);
  })

  .delete('/:id', ensureAuth, (req, res, next) => {
    Comment.delete(req.params.id)
      .then(comment => res.send(comment))
      .catch(next);
  })
;
