import {
  Router, Request, Response, NextFunction,
} from 'express';
import mongoose from 'mongoose';
import { isCelebrateError } from 'celebrate';
import { constants } from 'http2';
import usersRouter from './users';
import cardsRouter from './cards';
import { RouteNotExistsError } from '../errors';

const router = Router();

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use(() => { throw new RouteNotExistsError(); });
// eslint-disable-next-line
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { message } = err;
  let status: number;

  switch (true) {
    case isCelebrateError(err):
    case err instanceof mongoose.Error.ValidationError:
      status = constants.HTTP_STATUS_BAD_REQUEST;
      break;
    case err instanceof mongoose.Error.CastError:
    case err instanceof mongoose.Error.DocumentNotFoundError:
    case err instanceof RouteNotExistsError:
      status = constants.HTTP_STATUS_NOT_FOUND;
      break;
    default:
      status = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }

  res.status(status).send({ message });
});

export default router;
