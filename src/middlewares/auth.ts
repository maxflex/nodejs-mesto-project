import { Request, Response, NextFunction } from 'express';

const fakeAuth = (req: Request, res: Response, next: NextFunction) => {
  // @ts-expect-error
  req.user = { _id: '662b6ed47cadf99b7f400873' };
  next();
};

export default fakeAuth;
