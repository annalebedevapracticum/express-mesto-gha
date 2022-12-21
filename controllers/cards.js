const CustomError = require('../helpers/CustomError');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new CustomError('Переданы некорректные данные при создании карточки', 400);
      }
      throw err;
    }).catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        throw new CustomError('Карточка с указанным _id не найдена', 404);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new CustomError('Доступ запрещен', 403);
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CustomError('Карточка с указанным _id не найдена', 400);
      }
      throw err;
    }).catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new CustomError('Передан несуществующий _id карточки', 404);
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CustomError('Переданы некорректные данные для постановки лайка.', 400);
      }
      throw err;
    }).catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new CustomError('Передан несуществующий _id карточки.', 404);
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CustomError('Переданы некорректные данные для снятия лайка.', 400);
      }
      throw err;
    }).catch(next);
};
