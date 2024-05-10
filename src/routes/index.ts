import {
  Router, Request, Response, NextFunction,
} from 'express';
import mongoose from 'mongoose';
import { isCelebrateError, celebrate, Joi } from 'celebrate';
import { constants } from 'http2';
import usersRouter from './users';
import cardsRouter from './cards';
import { RouteNotExistsError, UnauthorizedError } from '../errors';
import { login, createUser } from '../controllers/users';
import auth from '../middlewares/auth';

const router = Router();

router.post('/signin', login);
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
// eslint-disable-next-line
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  let { message } = err;
  let status: number;

  switch (true) {
    case err instanceof UnauthorizedError:
      status = constants.HTTP_STATUS_UNAUTHORIZED;
      break;
    case isCelebrateError(err):
    case err instanceof mongoose.Error.CastError:
    case err instanceof mongoose.Error.ValidationError:
      status = constants.HTTP_STATUS_BAD_REQUEST;
      break;
    case err instanceof mongoose.Error.DocumentNotFoundError:
    case err instanceof RouteNotExistsError:
      status = constants.HTTP_STATUS_NOT_FOUND;
      break;
    default:
      message = 'На сервере произошла ошибка';
      status = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }

  res.status(status).send({ message });
});

export default router;
