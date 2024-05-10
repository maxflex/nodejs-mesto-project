import { model, Schema, Document } from 'mongoose';
import { isEmail } from 'validator';

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    min: 2,
    max: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    min: 2,
    max: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: isEmail,
  },
  password: {
    type: String,
    required: true,
    min: 2,
    max: 200,
  },
});

export default model<IUser>('user', userSchema);
