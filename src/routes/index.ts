import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import usersRouter from './users';
import cardsRouter from './cards';
import { RouteNotExistsError } from '../errors';
import { login, createUser } from '../controllers/users';
import {
  auth, errors, requestLogger, errorLogger,
} from '../middlewares';

const router = Router();

router.use(requestLogger);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(200),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(200),
  }),
}), createUser);
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use(() => { throw new RouteNotExistsError(); });
router.use(errorLogger);
router.use(errors);
export default router;
