const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, deleteCard, getCards, dislikeCard, likeCard,
} = require('../controllers/cards');
const { urlRegex } = require('../helpers/utils');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(urlRegex),
  }).unknown(true),
}), createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }).unknown(true),
}), deleteCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }).unknown(true),
}), dislikeCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24),
  }).unknown(true),
}), likeCard);

module.exports = router;
