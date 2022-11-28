const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const process = require('process');

const { PORT = 3000 } = process.env;
const app = express();

process.on('uncaughtException', (err, origin) => {
  console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});

app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, err => {
  if (err) throw err;
  console.log('Connected to MongoDB!!!')
});

app.use((req, res, next) => {
  req.user = {
    _id: '6383a5d05b0bcb685ab005fa'
  };

  next();
});
app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));
app.use('*', (req,res,next) => {
  res.status(404).send('url not found');
});
app.listen(PORT, () => {
  console.log('Server is working! Port: ' + PORT);
});