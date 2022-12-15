const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, getUsers, updateAvatar, updateUser,
} = require('../controllers/users');
const { urlRegex } = require('../helpers/utils');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    link: Joi.string().regex(urlRegex),
  }).unknown(true),
}), updateAvatar);

module.exports = router;
