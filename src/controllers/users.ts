import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { ErrorNotFound } from "../errors";

export const getUsers = (req: Request, res: Response) => {
  return User.find({}).then((data) => res.send({ data }));
};

export const getUser = (req: Request, res: Response, next: NextFunction) =>
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound("Пользователь по указанному _id не найден");
      }
      res.send(user);
    })
    .catch(next);

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar }).then((user) =>
    res.status(201).send(user)
  );
};

export const updateProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, about } = req.body;
  // @ts-expect-error
  const userId = req.user._id;
  return User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound("Пользователь с указанным _id не найден");
      }
      res.send(user);
    })
    .catch(next);
};

export const updateAvatar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { avatar } = req.body;
  // @ts-expect-error
  const userId = req.user._id;
  return User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound("Пользователь с указанным _id не найден");
      }
      res.send(user);
    })
    .catch(next);
};
