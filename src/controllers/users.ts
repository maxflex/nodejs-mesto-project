import { NextFunction, Request, Response } from 'express';
import { UpdateQuery } from 'mongoose';
import bcrypt from 'bcrypt';
import { constants } from 'http2';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';
import { UnauthorizedError } from '../errors';

function updateUser(update: UpdateQuery<IUser>, req: Request, res: Response, next: NextFunction) {
  User.findByIdAndUpdate(req.user?._id, update, { new: true, runValidators: true })
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
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then((user) => res.status(constants.HTTP_STATUS_CREATED).send({
      ...user.toObject(),
      password: undefined,
    }))
    .catch(next);
};

export const getProfile = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .orFail()
    .then((user) => res.send(user))
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

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedError();
      }
      const { _id } = user;
      const token = jwt.sign({ _id }, 'secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
