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
    *   **具体路由**：
        ```typescript
        router.post('/calculate/numerology', calculateNumerology);
        router.post('/calculate/tarot', generateTarotReading);
        router.post('/calculate/iching', generateIChingReading);
        router.post('/calculate/compatibility', calculateCompatibility);
        router.post('/calculate/holistic', generateHolisticReading);
        ```

2.  **用户数据API (需要认证)**
    *   **职责**：管理与特定用户关联的数据，主要是用户的历史测算记录。
    *   **端点**：`/api/divination`, `/api/history`
    *   **逻辑**：这些API受 `protect` 中间件保护，必须在请求头中携带有效的JWT Token。它们负责对数据库进行增、删、改、查操作，例如创建一条新的测算记录、获取某个用户的所有历史记录。
    *   **具体路由**：
        ```typescript
        protectedRoutes.post('/', createDivinationRecord);
        protectedRoutes.get('/', getDivinationRecords);
        protectedRoutes.get('/:id', getDivinationDetail);
        protectedRoutes.put('/:id', updateDivinationRecord);
        protectedRoutes.post('/:id/share', shareDivinationRecord);
        protectedRoutes.delete('/:id', deleteDivinationRecord);
        ```

3.  **AI解读服务API**
    *   **职责**：提供核心的AI智能解读能力。
    *   **端点**：`/api/ai/*`
    *   **逻辑**：
        *   **用户接口 (`/reading`)**：接收测算数据，调用AI模型生成解读文本。这可能是免费或付费的。
            ```typescript
            router.post('/reading', aiController.generateAiReading);
            router.post('/reading/batch', aiController.batchGenerateAiReading);
            router.post('/tarot/reading', tarotAiController.generateTarotReading);
            router.post('/tarot/evaluate', protect, tarotAiController.evaluateTarotReading);
            ```
        *   **管理接口 (`/models`, `/train`)**：受 `admin` 中间件保护，只有管理员才能访问。用于查看AI模型状态、启动数据收集和模型训练流程，是平台维护和迭代的核心。
            ```typescript
            router.get('/models', protect, admin, aiController.getAiModelsStatus);
            router.get('/models/:modelType', protect, admin, aiController.getAiModelDetails);
            router.post('/train/collect', protect, admin, aiController.collectTrainingData);
            router.post('/train/clean', protect, admin, aiController.cleanTrainingData);
            router.post('/train/start', protect, admin, aiController.startModelTraining);
            router.get('/validate/:modelType', protect, admin, aiController.validateModel);
            ```