import { Request, Response, NextFunction } from 'express';

const fakeAuth = (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  req.user = { _id: '662e59a3a3f1752722df90a2' };
  next();
};

export default fakeAuth;
