import { NextFunction, Request, Response } from 'express';
import { UpdateQuery } from 'mongoose';
import { constants } from 'http2';
import User, { IUser } from '../models/user';

function updateUser(update: UpdateQuery<IUser>, req: Request, res: Response, next: NextFunction) {
  // @ts-expect-error
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, update, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
}

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({}).then((data) => res.send({ data })).catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(constants.HTTP_STATUS_CREATED).send(user))
    .catch(next);
};

export const updateProfile = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  updateUser({ name, about }, req, res, next);
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  updateUser({ avatar }, req, res, next);
};
