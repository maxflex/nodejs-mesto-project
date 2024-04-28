import { Request, Response, NextFunction } from 'express';
import { constants } from 'http2';
import Card from '../models/card';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((data) => res.send({ data }))
    .catch(next);
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail()
    .then((card) => res.send(card))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  // @ts-expect-error
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(constants.HTTP_STATUS_CREATED).send(card))
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: {
        // @ts-expect-error
        likes: req.user._id,
      },
    },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch(next);
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // @ts-expect-error
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch(next);
};
