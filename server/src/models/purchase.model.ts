import mongoose from 'mongoose';
import { IUser } from './user.model';
import { IPaidService } from './paidService.model';

export interface IPurchase extends mongoose.Document {
  user: mongoose.Types.ObjectId | IUser;
  service: mongoose.Types.ObjectId | IPaidService;
  transactionId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  expiresAt: Date;  // 服务到期时间
}

const purchaseSchema = new mongoose.Schema<IPurchase>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '用户ID是必填项']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaidService',
    required: [true, '服务ID是必填项']
  },
  transactionId: {
    type: String,
    required: [true, '交易ID是必填项']
  },
  amount: {
    type: Number,
    required: [true, '金额是必填项'],
    min: [0, '金额不能为负数']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: [true, '支付方式是必填项']
  },
  expiresAt: {
    type: Date,
    required: [true, '到期时间是必填项']
  }
}, {
  timestamps: true
});

// 索引以提高查询效率
purchaseSchema.index({ user: 1, service: 1 });
purchaseSchema.index({ transactionId: 1 }, { unique: true }); // 确保交易ID唯一
purchaseSchema.index({ status: 1 });
purchaseSchema.index({ expiresAt: 1 });

// 高级查询优化索引
purchaseSchema.index({ user: 1, status: 1 }); // 用户订单状态查询
purchaseSchema.index({ service: 1, status: 1 }); // 服务购买状态统计
purchaseSchema.index({ createdAt: -1 }); // 最新订单查询
purchaseSchema.index({ expiresAt: 1, status: 1 }); // 即将到期订单查询
purchaseSchema.index({ user: 1, expiresAt: 1 }); // 用户服务到期查询
purchaseSchema.index({ amount: -1 }); // 按金额排序查询

const Purchase = mongoose.model<IPurchase>('Purchase', purchaseSchema);

export default Purchase;
