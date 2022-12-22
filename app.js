const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');
const process = require('process');
const { login, createUser } = require('./controllers/users');
const { checkAuth } = require('./middlewares/auth');
const { urlRegex } = require('./helpers/utils');
const CustomError = require('./helpers/CustomError');

const { PORT = 3000 } = process.env;
const app = express();

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});

app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) throw err;
  console.log('Connected to MongoDB!!!');
});

app.use('/cards', checkAuth, require('./routes/cards'));
app.use('/users', checkAuth, require('./routes/users'));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlRegex),
  }),
}), createUser);

app.use('*', checkAuth, (req, res, next) => next(new CustomError('url not found', 404)));
app.listen(PORT, () => {
  console.log(`Server is working! Port: ${PORT}`);
});

app.use(errors());

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  res.status(errorStatus).send({ message: errorStatus === 500 ? 'На сервере произошла ошибка' : err.message });
  next();
});
