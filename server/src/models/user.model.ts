import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  registrationDate: Date;
  lastLogin: Date;
  isActive: boolean;
  role: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: [true, '用户名是必填项'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少需要3个字符'],
    maxlength: [50, '用户名不能超过50个字符']
  },
  email: {
    type: String,
    required: [true, '邮箱是必填项'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, '请提供有效的邮箱地址']
  },
  password: {
    type: String,
    required: [true, '密码是必填项'],
    minlength: [6, '密码至少需要6个字符']
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true,
});

// 密码加密
userSchema.pre('save', async function(this: IUser, next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('密码加密失败'));
    }
  }
});

// 密码比对方法
userSchema.methods.comparePassword = async function(enteredPassword: string): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
