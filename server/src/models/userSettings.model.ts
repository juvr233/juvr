import mongoose, { Document } from 'mongoose';

export interface IUserSettings extends Document {
  user: mongoose.Types.ObjectId;
  theme: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacySettings: {
    shareProfile: boolean;
    shareHistory: boolean;
    shareResults: boolean;
  };
  customization: {
    favoriteFeatures: string[];
    defaultPage: string;
  };
}

const userSettingsSchema = new mongoose.Schema<IUserSettings>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system'
  },
  language: {
    type: String,
    enum: ['zh-CN', 'en-US'],
    default: 'zh-CN'
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    }
  },
  privacySettings: {
    shareProfile: {
      type: Boolean,
      default: false
    },
    shareHistory: {
      type: Boolean,
      default: false
    },
    shareResults: {
      type: Boolean,
      default: false
    }
  },
  customization: {
    favoriteFeatures: [{
      type: String,
      enum: ['numerology', 'tarot', 'iching', 'compatibility', 'holistic', 'starAstrology', 'bazi']
    }],
    defaultPage: {
      type: String,
      default: 'home'
    }
  }
}, {
  timestamps: true
});

// 用户设置索引
userSettingsSchema.index({ user: 1 }, { unique: true }); // 确保每个用户只有一个设置记录
userSettingsSchema.index({ theme: 1 }); // 主题统计分析
userSettingsSchema.index({ language: 1 }); // 语言偏好分析
userSettingsSchema.index({ 'notifications.email': 1 }); // 电子邮件通知偏好
userSettingsSchema.index({ 'privacySettings.shareResults': 1 }); // 隐私设置偏好
userSettingsSchema.index({ 'customization.favoriteFeatures': 1 }); // 用户偏好的功能分析
userSettingsSchema.index({ 'customization.defaultPage': 1 }); // 默认页面分析

const UserSettings = mongoose.model<IUserSettings>('UserSettings', userSettingsSchema);

export default UserSettings;
