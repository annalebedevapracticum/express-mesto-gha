const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, deleteCard, getCards, dislikeCard, likeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}), deleteCard);
router.delete('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}), dislikeCard);
router.put('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }),
}), likeCard);

module.exports = router;
