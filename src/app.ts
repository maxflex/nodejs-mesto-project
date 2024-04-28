import express from 'express';
import mongoose from 'mongoose';
import router from './routes';
import auth from './middlewares/auth';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(auth);
app.use(router);

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log('Всё готово. И все в сборе');
});
