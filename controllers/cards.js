const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send({ data: card }))
    .catch(err => {
      if (err._message == 'card validation failed') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then(card => res.send({ data: card }))
    .catch(err => {
      if (err.path == '_id') {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      }

      res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true, runValidators: true })
    .then(card => res.send({ data: card }))
    .catch(err => {
      if (err.path == '_id') {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      if (err.path == 'likes') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true, runValidators: true })
    .then(card => res.send({ data: card }))
    .catch(err => {
      if (err.path == '_id') {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      }
      if (err.path == 'likes') {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      res.status(500).send({ message: err.message });
    });
};
