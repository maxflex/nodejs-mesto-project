import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';
import { IUser } from '../models/user';

declare module 'express-serve-static-core' {
  // eslint-disable-next-line
  interface Request {
    user?: IUser;
  }
}

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError();
  }

  const token = authorization.replace('Bearer ', '');
  let user;

  try {
    user = jwt.verify(token, 'secret');
  } catch {
    throw new UnauthorizedError();
  }

  req.user = user as IUser;
  next();
};
