import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import router from './routes';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(router);

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log('Всё готово. И все в сборе');
});
