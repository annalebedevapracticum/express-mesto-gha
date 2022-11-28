const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then(user => {
      res.send({ data: user });
    })
    .catch(err => {
      if (err.path == '_id') {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }

      res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => {
      res.send({ data: user });
    })
    .catch(err => {
      if (err._message == 'Validation failed') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(user => {
      res.send({ data: user })
    })
    .catch(err => {
      if (err.path == '_id') {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      if (err._message == 'Validation failed') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении пользователя.' });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.path == '_id') {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      if (err._message == 'Validation failed') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      res.status(500).send({ message: err.message });
    });
};

