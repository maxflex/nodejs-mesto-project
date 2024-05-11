import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { isCelebrateError } from 'celebrate';
import { constants } from 'http2';
import { ForbiddenError, RouteNotExistsError, UnauthorizedError } from '../errors';

// eslint-disable-next-line
export default ((err: any, req: Request, res: Response, next: NextFunction) => {
  let { message } = err;
  let status: number;

  switch (true) {
    case err.code === 11000:
      status = constants.HTTP_STATUS_CONFLICT;
      break;
    case err instanceof UnauthorizedError:
      status = constants.HTTP_STATUS_UNAUTHORIZED;
      break;
    case isCelebrateError(err):
    case err instanceof mongoose.Error.CastError:
    case err instanceof mongoose.Error.ValidationError:
      status = constants.HTTP_STATUS_BAD_REQUEST;
      break;
    case err instanceof ForbiddenError:
      status = constants.HTTP_STATUS_FORBIDDEN;
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
