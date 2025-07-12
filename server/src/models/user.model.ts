import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password?: string; // Make password optional for OAuth users
  googleId?: string;
  shopifyCustomerId?: string;
  shopifyAccessToken?: string;
  registrationDate: Date;
  lastLogin: Date;
  isActive: boolean;
  role: string;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  failedLoginAttempts: number;
  accountLocked: boolean;
  accountLockedUntil?: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
  generatePasswordResetToken(): Promise<string>;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
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
    required: function(this: any) { return !this.googleId; }, // Required only if not a Google user
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
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  shopifyCustomerId: {
    type: String,
    unique: true,
    sparse: true,
  },
  shopifyAccessToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  accountLocked: {
    type: Boolean,
    default: false
  },
  accountLockedUntil: {
    type: Date
  }
}, {
  timestamps: true,
});

// 密码加密
userSchema.pre('save', async function(this: IUser, next) {
  // Only hash the password if it has been modified (or is new) and exists
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    // 增加加密强度到12
    const salt = await bcrypt.genSalt(12);
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
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(enteredPassword, this.password);
};

// 生成密码重置令牌
userSchema.methods.generatePasswordResetToken = async function(): Promise<string> {
  // 生成随机令牌
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // 加密令牌并保存到数据库
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  // 设置过期时间 (1小时)
  this.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);
  
  await this.save();
  
  return resetToken;
};

// 增加失败登录尝试计数
userSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
  this.failedLoginAttempts += 1;
  
  // 如果失败次数达到5次，锁定账户30分钟
  if (this.failedLoginAttempts >= 5) {
    this.accountLocked = true;
    this.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
  }
  
  await this.save();
};

// 重置登录尝试计数
userSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  this.failedLoginAttempts = 0;
  this.accountLocked = false;
  this.accountLockedUntil = undefined;
  await this.save();
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
