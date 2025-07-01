### Zenith Destiny 项目核心业务逻辑

**项目核心定位：** 一个集多种命理工具（数字学、塔罗牌、易经等）与AI智能解读于一体的在线命理服务平台。

---

#### 一、用户核心流程

1.  **注册与登录 (`/auth`)**
    *   新用户通过前端界面注册账户。
        * 用户填写基本信息（邮箱、密码、姓名等）并提交
        * 后端验证信息有效性，对密码进行加密处理
        * 创建用户记录并存入数据库
        * 生成验证邮件（可选），发送给用户邮箱进行账户确认
    *   老用户登录，系统通过JWT（JSON Web Token）进行身份验证，并返回一个Token给前端。
        * 用户输入邮箱/用户名和密码
        * 后端验证身份信息，核对密码是否匹配
        * 登录成功后生成JWT令牌，包含用户ID和权限信息
    *   前端将Token存储起来，在后续所有需要认证的请求中携带它。
        * 前端将令牌保存在localStorage或sessionStorage中
        * 为每个需要认证的API请求添加Authorization请求头
    *   社交媒体登录集成（OAuth 2.0）
        * 支持微信、QQ、Google等第三方登录渠道
        * 获取用户基本信息，创建或关联本地用户账户

2.  **进行命理测算 (`/divination/calculate/*`)**
    *   用户无需登录即可访问实时的命理计算功能。
        * 非登录用户可执行基本测算，但无法保存结果
        * 基本测算功能无使用次数限制
    *   用户在前端选择一种测算服务（如数字学、塔罗牌、易经等）。
        * 数字学：生命灵数、表达数、灵魂数等计算
        * 塔罗牌：各种牌阵解读（三张牌阵、凯尔特十字阵等）
        * 易经：六爻占卜、阴阳五行分析
        * 星座占星：星座兼容性、行星影响分析
    *   输入必要信息（如生日、姓名、抽到的牌）。
        * 确保用户输入数据的有效性和完整性
        * 提供友好的日期选择器、名称输入指导等
        * 塔罗牌测算提供虚拟抽牌和实体牌输入两种方式
    *   前端将这些信息发送到对应的后端API（例如 `POST /api/divination/calculate/numerology`）。
        * 前端进行基本数据验证和格式化
        * API请求中包含全部必要参数
    *   后端进行计算，并返回初步的、结构化的测算结果（例如，生命灵数、塔罗牌牌意）。
        * 结果包含基本数据和简要解释
        * 提供明确的指引，引导用户获取更深入的AI解读

3.  **获取AI智能解读 (`/ai`)**
    *   在获得初步测算结果后，用户可以选择获取更深入的AI解读。
        * 基础版AI解读（每日有限次免费使用）
        * 高级版AI解读（需要付费会员身份或单次付费）
    *   前端将测算结果（如牌阵、问题）发送到AI解读API（例如 `POST /api/ai/tarot/reading`）。
        * 附带用户问题的具体上下文和关键词
        * 传递完整的测算数据结构
    *   后端AI服务接收到请求，结合知识库和AI模型，生成一段通顺、人性化的综合解读。
        * 调用特定领域的AI模型（塔罗模型、数字学模型等）
        * 结合用户历史数据（如果有）提供个性化解读
        * 应用多模态技术，同时处理文字和图像信息
    *   AI解读结果返回给前端进行展示。
        * 采用分段式展示，提高可读性
        * 提供语音朗读功能（可选）
        * 提供保存、分享和评价解读结果的选项

4.  **保存与回顾 (`/divination`, `/history`)**
    *   登录用户可以将满意的测算和AI解读结果保存到自己的账户中。
        * 支持添加个人标签和备注
        * 可设置私密或公开分享状态
    *   这个操作会调用需要认证的 `POST /api/divination` 接口，将记录存入数据库。
        * 记录包含完整的测算参数、结果和AI解读
        * 添加时间戳和唯一标识符
    *   用户可以在"历史记录"页面通过 `GET /api/history` 或 `GET /api/divination` 查看、管理或分享自己过往的每一次测算记录。
        * 提供多种筛选方式（按时间、类型、标签等）
        * 支持编辑个人备注和标签
        * 提供历史记录对比分析功能
    *   支持生成PDF报告或图片分享
        * 美观的报告模板，适合社交媒体分享
        * 包含品牌水印和分享链接

5.  **付费服务 (`/payments`)**
    *   对于高级AI解读、深度报告或无限次测算等高级功能，系统会引导用户进行支付。
        * 提供多种会员套餐（月度、季度、年度）
        * 支持单次付费解锁特定功能
        * 特别优惠活动和折扣码系统
    *   支付流程将通过 `/payments` 相关的API来处理，与第三方支付网关集成。
        * 支持微信支付、支付宝、信用卡等多种支付方式
        * 实现安全的支付流程和状态监控
        * 完整的订单管理和退款机制
    *   会员权益系统
        * 不同等级会员拥有不同权限和使用限制
        * 高级会员享有专属报告模板和解读内容
        * 支持自动续费和会员管理功能

6.  **社区互动与分享 (`/community`)**
    *   用户可以在平台内部社区分享自己的测算结果和心得。
        * 创建匿名或实名讨论帖
        * 上传测算结果截图或直接分享测算链接
    *   解答互助机制
        * 用户可以请求其他社区成员对测算结果提供额外见解
        * 设置悬赏机制，鼓励高质量回答
    *   专家解读服务
        * 平台认证的命理专家提供人工专业解读
        * 用户可预约一对一在线咨询
    *   积分与声望系统
        * 参与社区活动获取积分，可兑换免费测算或折扣
        * 优质内容创作者获得特殊标识和权益

7.  **用户个性化与数据管理 (`/profile`)**
    *   个人信息管理
        * 更新基本资料、修改密码、设置通知偏好
        * 多设备同步用户数据
    *   隐私控制中心
        * 精细化权限设置，控制数据分享范围
        * 支持完全删除账户和相关数据
    *   个性化界面设置
        * 暗黑/明亮模式切换
        * 自定义主题颜色和界面元素
    *   订阅定期运势报告
        * 每日/每周/每月运势推送
        * 基于用户命盘的个性化内容

---

#### 二、后端API体系逻辑

您的后端API主要分为三大块，共同支撑上述业务流程：

1.  **公共计算API (无需认证)**
    *   **职责**：执行即时的、无状态的命理计算。
    *   **端点**：`/api/divination/calculate/*`
    *   **逻辑**：接收前端传入的参数（如生日），运行固定的算法（如生命灵数计算），然后立即返回计算结果。这部分不涉及数据库读写。

2.  **用户数据API (需要认证)**
    *   **职责**：管理与特定用户关联的数据，主要是用户的历史测算记录。
    *   **端点**：`/api/divination`, `/api/history`
    *   **逻辑**：这些API受 `protect` 中间件保护，必须在请求头中携带有效的JWT Token。它们负责对数据库进行增、删、改、查操作，例如创建一条新的测算记录、获取某个用户的所有历史记录。

3.  **AI解读服务API**
    *   **职责**：提供核心的AI智能解读能力。
    *   **端点**：`/api/ai/*`
    *   **逻辑**：
        *   **用户接口 (`/reading`)**：接收测算数据，调用AI模型生成解读文本。这可能是免费或付费的。
        *   **管理接口 (`/models`, `/train`)**：受 `admin` 中间件保护，只有管理员才能访问。用于查看AI模型状态、启动数据收集和模型训练流程，是平台维护和迭代的核心。

---

#### 三、数据流示例（塔罗牌测算）

1.  **用户**：在前端选择“三牌阵”，提出问题“我的职业发展如何？”，并抽了三张牌。
2.  **前端 -> 后端 (计算)**：发送 `POST /api/divination/calculate/tarot` 请求，Body包含牌阵信息和抽到的牌。
3.  **后端 (计算)**：返回每张牌的正/逆位基础牌意。
4.  **前端**：展示基础牌意，并提供一个“获取AI深度解读”的按钮。
5.  **用户**：点击按钮。
6.  **前端 -> 后端 (AI)**：发送 `POST /api/ai/tarot/reading` 请求，Body包含用户的问题和三张牌的信息。
7.  **后端 (AI)**：AI服务综合问题、牌意和牌阵位置，生成一段完整的、关于职业发展的综合性解读。
8.  **后端 -> 前端**：返回AI生成的文本。
9.  **用户**：对结果满意，点击“保存记录”。
10. **前端 -> 后端 (数据)**：发送 `POST /api/divination` 请求（携带Token），Body包含本次测算的所有信息（问题、牌、AI解读等）。
11. **后端 (数据)**：将记录存入与该用户关联的数据库表中。

这份业务逻辑为您接下来的开发提供了清晰的蓝图。您可以从实现每个API端点的具体功能开始。

---

#### 四、基础API路由开发

根据上述用户核心流程，我们需要开发以下基础API路由：

### 1. 用户认证路由 (`/api/auth`)

```typescript
// server/src/routes/auth.routes.ts
import express from 'express';
import { register, login, refreshToken, forgotPassword, resetPassword, verifyEmail, socialLogin } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// 用户注册与登录
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// 社交媒体登录
router.post('/social/wechat', socialLogin);
router.post('/social/qq', socialLogin);
router.post('/social/google', socialLogin);

// 账户管理
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email/:token', verifyEmail);

// 需要认证的路由
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});
router.put('/me', protect, (req, res) => {
  // 更新用户信息
});

export default router;
```

### 2. 命理测算路由 (`/api/divination/calculate`)

```typescript
// server/src/routes/divination.routes.ts
import express from 'express';
import { 
  calculateNumerology, 
  generateTarotReading, 
  generateIChingReading, 
  calculateCompatibility, 
  generateHolisticReading
} from '../controllers/divination.controller';

const router = express.Router();

// 实时计算API - 不需要认证
router.post('/calculate/numerology', calculateNumerology);
router.post('/calculate/tarot', generateTarotReading);
router.post('/calculate/iching', generateIChingReading);
router.post('/calculate/compatibility', calculateCompatibility);
router.post('/calculate/holistic', generateHolisticReading);

export default router;
```

### 3. AI解读服务路由 (`/api/ai`)

```typescript
// server/src/routes/ai.routes.ts
import express from 'express';
import { 
  generateAiReading, 
  batchGenerateAiReading,
  generateTarotReading,
  evaluateTarotReading
} from '../controllers/ai.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

// 用户接口 - 生成AI解读
router.post('/reading', generateAiReading);
router.post('/reading/batch', batchGenerateAiReading);
router.post('/tarot/reading', generateTarotReading);
router.post('/tarot/evaluate', protect, evaluateTarotReading);

// 管理接口 - 需要管理员权限
router.get('/models', protect, admin, (req, res) => {
  // 获取AI模型状态
});
router.post('/train/start', protect, admin, (req, res) => {
  // 启动模型训练
});

export default router;
```

### 4. 用户历史记录路由 (`/api/divination`, `/api/history`)

```typescript
// server/src/routes/history.routes.ts
import express from 'express';
import { 
  createDivinationRecord, 
  getDivinationRecords, 
  getDivinationDetail,
  updateDivinationRecord,
  shareDivinationRecord,
  deleteDivinationRecord
} from '../controllers/history.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();
const protectedRoutes = express.Router();

// 应用保护中间件到所有路由
router.use('/', protect, protectedRoutes);

// 记录管理
protectedRoutes.post('/', createDivinationRecord);
protectedRoutes.get('/', getDivinationRecords);
protectedRoutes.get('/:id', getDivinationDetail);
protectedRoutes.put('/:id', updateDivinationRecord);
protectedRoutes.post('/:id/share', shareDivinationRecord);
protectedRoutes.delete('/:id', deleteDivinationRecord);

export default router;
```

### 5. 支付服务路由 (`/api/payments`)

```typescript
// server/src/routes/payment.routes.ts
import express from 'express';
import { 
  createPayment, 
  getPaymentStatus, 
  handlePaymentCallback,
  getSubscriptionStatus,
  cancelSubscription
} from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// 公共支付回调接口
router.post('/callback/:provider', handlePaymentCallback);

// 需要认证的支付相关操作
router.post('/', protect, createPayment);
router.get('/:id', protect, getPaymentStatus);
router.get('/subscription', protect, getSubscriptionStatus);
router.post('/subscription/cancel', protect, cancelSubscription);

export default router;
```

### 6. 社区互动路由 (`/api/community`)

```typescript
// server/src/routes/community.routes.ts
import express from 'express';
import { 
  createPost, 
  getPosts, 
  getPostDetail,
  createComment,
  likePost,
  followUser,
  getPopularTags
} from '../controllers/community.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// 公共浏览接口
router.get('/posts', getPosts);
router.get('/posts/:id', getPostDetail);
router.get('/tags/popular', getPopularTags);

// 需要认证的互动接口
router.post('/posts', protect, createPost);
router.post('/posts/:id/comments', protect, createComment);
router.post('/posts/:id/like', protect, likePost);
router.post('/users/:id/follow', protect, followUser);

export default router;
```

### 7. 用户个性化与数据管理路由 (`/api/profile`)

```typescript
// server/src/routes/profile.routes.ts
import express from 'express';
import { 
  updateProfile, 
  updatePreferences, 
  getNotificationSettings,
  updateNotificationSettings,
  deleteAccount
} from '../controllers/profile.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// 所有路由都需要认证
router.use(protect);

router.get('/', (req, res) => {
  // 获取用户资料
  res.json({ profile: req.user });
});
router.put('/', updateProfile);
router.put('/preferences', updatePreferences);
router.get('/notifications', getNotificationSettings);
router.put('/notifications', updateNotificationSettings);
router.delete('/account', deleteAccount);

export default router;
```

### 8. 主应用路由注册

```typescript
// server/src/index.ts
import express from 'express';
import authRoutes from './routes/auth.routes';
import divinationRoutes from './routes/divination.routes';
import historyRoutes from './routes/history.routes';
import aiRoutes from './routes/ai.routes';
import paymentRoutes from './routes/payment.routes';
import communityRoutes from './routes/community.routes';
import profileRoutes from './routes/profile.routes';
import homeRoutes from './routes/home.routes';

const app = express();
app.use(express.json());

// API路由
const apiRouter = express.Router();
app.use('/api', apiRouter);

// 注册各模块路由
apiRouter.use('/auth', authRoutes);
apiRouter.use('/divination', divinationRoutes);
apiRouter.use('/history', historyRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/community', communityRoutes);
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/home', homeRoutes);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
```

### 9. API控制器示例实现

下面是一个控制器实现示例，以塔罗牌测算为例：

```typescript
// server/src/controllers/tarot.controller.ts
import { Request, Response } from 'express';
import { TarotCard, TarotSpread } from '../models/tarot.model';

// 生成塔罗牌阵解读
export const generateTarotReading = async (req: Request, res: Response) => {
  try {
    const { question, spread, cards } = req.body;
    
    // 验证请求数据
    if (!question || !spread || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供问题、牌阵类型和抽取的卡牌信息'
      });
    }
    
    // 获取每张牌的基础含义
    const cardsWithMeaning = await Promise.all(cards.map(async (card) => {
      const cardData = await TarotCard.findOne({ name: card.name });
      if (!cardData) {
        return {
          ...card,
          meaning: '未找到此牌的解释'
        };
      }
      
      // 根据正逆位获取对应含义
      const meaning = card.isReversed ? cardData.reversedMeaning : cardData.uprightMeaning;
      
      return {
        ...card,
        meaning
      };
    }));
    
    // 获取牌阵布局信息
    const spreadData = await TarotSpread.findOne({ type: spread });
    
    // 生成基础解读结果
    const result = {
      success: true,
      data: {
        question,
        cards: cardsWithMeaning,
        spread: spreadData ? spreadData.description : '自定义牌阵',
        timestamp: new Date()
      }
    };
    
    res.json(result);
  } catch (error) {
    console.error('塔罗牌解读生成错误:', error);
    res.status(500).json({
      success: false,
      message: '生成塔罗牌解读时出错',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
```

通过以上API路由的开发，我们建立了完整的后端服务体系，支持前面定义的所有用户核心流程。每个路由负责特定的功能域，遵循RESTful API设计原则，并根据需要实施了适当的认证保护。