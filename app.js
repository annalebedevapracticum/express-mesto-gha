const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const process = require('process');
const routes = require('./routes/index');

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

app.listen(PORT, () => {
  console.log(`Server is working! Port: ${PORT}`);
});
app.use(errors());
app.use(routes);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  res.status(errorStatus).send({ message: errorStatus === 500 ? 'На сервере произошла ошибка' : err.message });
  next();
});
