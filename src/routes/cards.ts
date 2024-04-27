import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import {
  createCard,
  deleteCard,
  dislikeCard,
  getCards,
  likeCard,
} from "../controllers/cards";

const router = Router();

router.get("/cards", getCards);
router.post(
  "/cards",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
    }),
  }),
  createCard
);
router.delete("/cards/:cardId", deleteCard);
router.put("/cards/:cardId/likes", likeCard);
router.delete("/cards/:cardId/likes", dislikeCard);

export default router;
