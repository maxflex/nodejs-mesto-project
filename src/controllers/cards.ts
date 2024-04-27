import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { ErrorNotFound } from '../errors';

export const getCards = (req: Request, res: Response) => {
  Card.find({}).then((data) => res.send({ data }));
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка с указанным _id не найдена');
      }
      res.send(card);
    })
    .catch(next);
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  // @ts-expect-error
  const owner = req.user._id;

  return Card.create({
    name,
    link,
    owner,
  }).then((card) => res.status(201).send(card));
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
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Передан несуществующий _id карточки');
      }
      res.send(card);
    })
    .catch(next);
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // @ts-expect-error
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Передан несуществующий _id карточки');
      }
      res.send(card);
    })
    .catch(next);
};
