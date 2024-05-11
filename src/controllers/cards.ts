import { Request, Response, NextFunction } from 'express';
import { constants } from 'http2';
import Card from '../models/card';
import { ForbiddenError } from '../errors';

function toggleLikes(action: 'like' | 'dislike', req: Request, res: Response, next: NextFunction) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { [action === 'like' ? '$addToSet' : '$pull']: { likes: req.user?._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch(next);
}

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((data) => res.send({ data }))
    .catch(next);
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.valueOf() !== req.user?._id) {
        throw new ForbiddenError();
      }
      return card.delete();
    })
    .then((card) => res.send(card))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(constants.HTTP_STATUS_CREATED).send(card))
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  toggleLikes('like', req, res, next);
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  toggleLikes('dislike', req, res, next);
};
