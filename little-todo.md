# 🔧 Little Todo - 最小开发单元任务清单

## 🚨 极高优先级任务 (立即执行)

### SEC-001: 敏感信息安全修复
**文件**: `/next.md`

#### SEC-001-A: 移除敏感信息文件
- [ ] **任务**: 将 `/next.md` 文件从版本控制中移除
- [ ] **执行**: `git rm next.md`
- [ ] **验证**: 确认文件不在git状态中
- [ ] **时间估计**: 2分钟
- [ ] **依赖**: 无

#### SEC-001-B: 创建环境变量模板
- [ ] **任务**: 创建 `.env.example` 文件
- [ ] **内容**: 包含所有需要的环境变量但不含实际值
- [ ] **位置**: 根目录和 `/server/` 目录
- [ ] **时间估计**: 5分钟
- [ ] **依赖**: SEC-001-A

#### SEC-001-C: 更新.gitignore
- [ ] **任务**: 确保 `.env` 和 `next.md` 在 `.gitignore` 中
- [ ] **文件**: `/.gitignore`
- [ ] **添加行**: 
  ```
  .env
  .env.local
  .env.production
  next.md
  *.md.secret
  ```
- [ ] **时间估计**: 2分钟
- [ ] **依赖**: 无

## 🔴 高优先级任务 (本周完成)

### CODE-001: 控制台日志清理
**文件**: `/src/pages/TarotPage.tsx`

#### CODE-001-A: 清理音乐播放失败日志
- [ ] **任务**: 替换第101行的console.log
- [ ] **位置**: `/src/pages/TarotPage.tsx:101`
- [ ] **当前代码**: `console.log('Music playback failed:', e)`
- [ ] **替换为**: 
  ```typescript
  if (process.env.NODE_ENV === 'development') {
    console.log('Music playback failed:', e);
  }
  ```
- [ ] **时间估计**: 2分钟
- [ ] **依赖**: 无

#### CODE-001-B: 清理音效播放失败日志
- [ ] **任务**: 替换第185行的console.log
- [ ] **位置**: `/src/pages/TarotPage.tsx:185`
- [ ] **当前代码**: `console.log('Sound effect failed', e)`
- [ ] **替换为**: 
  ```typescript
  if (process.env.NODE_ENV === 'development') {
    console.log('Sound effect failed', e);
  }
  ```
- [ ] **时间估计**: 2分钟
- [ ] **依赖**: 无

#### CODE-001-C: 验证日志清理
- [ ] **任务**: 搜索项目中所有console.log使用
- [ ] **执行**: `grep -r "console\.log" src/`
- [ ] **验证**: 确保生产环境不会输出调试信息
- [ ] **时间估计**: 5分钟
- [ ] **依赖**: CODE-001-A, CODE-001-B

### AUDIO-001: 音频资源本地化
**文件**: `/src/pages/TarotPage.tsx`, `/src/pages/TarotPage.tsx.new`

#### AUDIO-001-A: 创建音频资源目录
- [ ] **任务**: 在public目录下创建音频文件夹
- [ ] **路径**: `/public/audio/`
- [ ] **子目录**: 
  - `/public/audio/background/`
  - `/public/audio/effects/`
- [ ] **时间估计**: 1分钟
- [ ] **依赖**: 无

#### AUDIO-001-B: 下载背景音乐文件
- [ ] **任务**: 将外部音频文件下载到本地
- [ ] **当前URL**: `https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3`
- [ ] **目标路径**: `/public/audio/background/tarot-background.mp3`
- [ ] **时间估计**: 3分钟
- [ ] **依赖**: AUDIO-001-A

#### AUDIO-001-C: 创建音频配置文件
- [ ] **任务**: 创建音频配置常量文件
- [ ] **文件**: `/src/config/audio.ts`
- [ ] **内容**: 导出音频文件路径配置
- [ ] **代码**:
  ```typescript
  export const AUDIO_CONFIG = {
    background: {
      tarot: '/audio/background/tarot-background.mp3'
    },
    effects: {
      cardFlip: '/audio/effects/card-flip.wav',
      cardSelect: '/audio/effects/card-select.wav'
    }
  };
  ```
- [ ] **时间估计**: 3分钟
- [ ] **依赖**: AUDIO-001-A

#### AUDIO-001-D: 更新TarotPage.tsx音频引用
- [ ] **任务**: 替换硬编码音频URL
- [ ] **文件**: `/src/pages/TarotPage.tsx`
- [ ] **第229行**: 替换src属性使用配置文件
- [ ] **代码**:
  ```typescript
  import { AUDIO_CONFIG } from '../config/audio';
  // ...
  src={AUDIO_CONFIG.background.tarot}
  ```
- [ ] **时间估计**: 2分钟
- [ ] **依赖**: AUDIO-001-C

#### AUDIO-001-E: 更新TarotPage.tsx.new音频引用
- [ ] **任务**: 替换硬编码音频URL
- [ ] **文件**: `/src/pages/TarotPage.tsx.new`
- [ ] **第246行**: 替换src属性使用配置文件
- [ ] **时间估计**: 2分钟
- [ ] **依赖**: AUDIO-001-C

#### AUDIO-001-F: 测试音频加载
- [ ] **任务**: 验证音频文件正确加载
- [ ] **测试**: 启动开发服务器，检查音频播放
- [ ] **验证**: 确保没有404错误
- [ ] **时间估计**: 5分钟
- [ ] **依赖**: AUDIO-001-D, AUDIO-001-E

## 🟡 中优先级任务 (2周内完成)

### UI-001: 塔罗牌卡牌背面实现
**文件**: `/src/pages/TarotPage.tsx`

#### UI-001-A: 创建卡牌背面组件
- [ ] **任务**: 创建CardBack组件
- [ ] **文件**: `/src/components/CardBack.tsx`
- [ ] **功能**: 显示塔罗牌背面设计
- [ ] **props**: size, className, animated
- [ ] **时间估计**: 15分钟
- [ ] **依赖**: 无

#### UI-001-B: 设计卡牌背面SVG
- [ ] **任务**: 创建卡牌背面SVG图案
- [ ] **文件**: `/src/assets/tarot-card-back.svg`
- [ ] **设计**: 神秘几何图案，符合项目主题
- [ ] **尺寸**: 3:5比例
- [ ] **时间估计**: 20分钟
- [ ] **依赖**: 无

#### UI-001-C: 实现卡牌背面样式
- [ ] **任务**: 添加卡牌背面CSS样式
- [ ] **文件**: `/src/components/CardBack.tsx`
- [ ] **样式**: 
  - 渐变背景
  - 边框效果
  - 悬停动画
- [ ] **时间估计**: 10分钟
- [ ] **依赖**: UI-001-A, UI-001-B

#### UI-001-D: 替换TarotPage中的空div
- [ ] **任务**: 替换第564-566行空div
- [ ] **文件**: `/src/pages/TarotPage.tsx`
- [ ] **替换为**: `<CardBack className="w-full h-full" />`
- [ ] **导入**: `import CardBack from '../components/CardBack';`
- [ ] **时间估计**: 3分钟
- [ ] **依赖**: UI-001-C

#### UI-001-E: 测试卡牌显示
- [ ] **任务**: 测试抽牌阶段卡牌显示
- [ ] **验证**: 确保卡牌背面正确显示
- [ ] **检查**: 响应式布局正常
- [ ] **时间估计**: 10分钟
- [ ] **依赖**: UI-001-D

### ERROR-001: 统一错误处理机制

#### ERROR-001-A: 创建错误处理Hook
- [ ] **任务**: 创建useErrorHandler Hook
- [ ] **文件**: `/src/hooks/useErrorHandler.ts`
- [ ] **功能**: 统一错误显示和日志记录
- [ ] **返回**: showError, clearError, error state
- [ ] **时间估计**: 15分钟
- [ ] **依赖**: 无

#### ERROR-001-B: 创建错误显示组件
- [ ] **任务**: 创建ErrorToast组件
- [ ] **文件**: `/src/components/ErrorToast.tsx`
- [ ] **功能**: 显示用户友好的错误信息
- [ ] **props**: message, type, onClose
- [ ] **时间估计**: 12分钟
- [ ] **依赖**: 无

#### ERROR-001-C: 创建API错误处理工具
- [ ] **任务**: 创建API错误处理工具函数
- [ ] **文件**: `/src/utils/errorHandling.ts`
- [ ] **功能**: 
  - parseApiError(error)
  - getErrorMessage(error)
  - isNetworkError(error)
- [ ] **时间估计**: 10分钟
- [ ] **依赖**: 无

#### ERROR-001-D: 更新ShopifyAuthPage错误处理
- [ ] **任务**: 应用新的错误处理机制
- [ ] **文件**: `/src/pages/ShopifyAuthPage.tsx`
- [ ] **替换**: 现有的错误处理逻辑
- [ ] **使用**: useErrorHandler和ErrorToast
- [ ] **时间估计**: 8分钟
- [ ] **依赖**: ERROR-001-A, ERROR-001-B, ERROR-001-C

#### ERROR-001-E: 更新PurchasePage错误处理
- [ ] **任务**: 应用新的错误处理机制
- [ ] **文件**: `/src/pages/PurchasePage.tsx`
- [ ] **替换**: throw new Error处理
- [ ] **时间估计**: 8分钟
- [ ] **依赖**: ERROR-001-A, ERROR-001-B, ERROR-001-C

#### ERROR-001-F: 更新其他页面错误处理
- [ ] **任务**: 批量更新其他页面
- [ ] **文件**: 
  - `/src/pages/ResultsPage.tsx`
  - `/src/pages/MyOrdersPage.tsx`
  - `/src/pages/CompatibilityPage.tsx`
- [ ] **时间估计**: 15分钟
- [ ] **依赖**: ERROR-001-A, ERROR-001-B, ERROR-001-C

### CLEAN-001: 清理.new文件

#### CLEAN-001-A: 对比Layout.tsx文件
- [ ] **任务**: 对比新旧Layout.tsx文件
- [ ] **文件**: `/src/components/Layout.tsx` vs `/src/components/Layout.tsx.new`
- [ ] **决策**: 确定使用哪个版本
- [ ] **文档**: 记录差异和选择原因
- [ ] **时间估计**: 10分钟
- [ ] **依赖**: 无

#### CLEAN-001-B: 合并Layout.tsx更新
- [ ] **任务**: 将有用的更新合并到主文件
- [ ] **执行**: 手动合并或选择新版本
- [ ] **测试**: 确保布局正常工作
- [ ] **时间估计**: 8分钟
- [ ] **依赖**: CLEAN-001-A

#### CLEAN-001-C: 删除Layout.tsx.new
- [ ] **任务**: 删除重复文件
- [ ] **执行**: `rm src/components/Layout.tsx.new`
- [ ] **验证**: 确认文件已删除
- [ ] **时间估计**: 1分钟
- [ ] **依赖**: CLEAN-001-B

#### CLEAN-001-D: 对比TarotPage.tsx文件
- [ ] **任务**: 对比新旧TarotPage.tsx文件
- [ ] **文件**: `/src/pages/TarotPage.tsx` vs `/src/pages/TarotPage.tsx.new`
- [ ] **决策**: 确定使用哪个版本
- [ ] **时间估计**: 15分钟
- [ ] **依赖**: 无

#### CLEAN-001-E: 合并TarotPage.tsx更新
- [ ] **任务**: 将有用的更新合并到主文件
- [ ] **执行**: 手动合并或选择新版本
- [ ] **测试**: 确保塔罗牌功能正常
- [ ] **时间估计**: 12分钟
- [ ] **依赖**: CLEAN-001-D

#### CLEAN-001-F: 删除TarotPage.tsx.new
- [ ] **任务**: 删除重复文件
- [ ] **执行**: `rm src/pages/TarotPage.tsx.new`
- [ ] **时间估计**: 1分钟
- [ ] **依赖**: CLEAN-001-E

#### CLEAN-001-G: 对比HomePage.tsx文件
- [ ] **任务**: 对比新旧HomePage.tsx文件
- [ ] **文件**: `/src/pages/HomePage.tsx` vs `/src/pages/HomePage.tsx.new`
- [ ] **决策**: 确定使用哪个版本
- [ ] **时间估计**: 10分钟
- [ ] **依赖**: 无

#### CLEAN-001-H: 合并HomePage.tsx更新
- [ ] **任务**: 将有用的更新合并到主文件
- [ ] **执行**: 手动合并或选择新版本
- [ ] **测试**: 确保首页正常工作
- [ ] **时间估计**: 8分钟
- [ ] **依赖**: CLEAN-001-G

#### CLEAN-001-I: 删除HomePage.tsx.new
- [ ] **任务**: 删除重复文件
- [ ] **执行**: `rm src/pages/HomePage.tsx.new`
- [ ] **时间估计**: 1分钟
- [ ] **依赖**: CLEAN-001-H

### PROJECT-001: Google Cloud SDK清理

#### PROJECT-001-A: 更新根目录.gitignore
- [ ] **任务**: 添加google-cloud-sdk到.gitignore
- [ ] **文件**: `/.gitignore`
- [ ] **添加行**: 
  ```
  # Google Cloud SDK
  google-cloud-sdk/
  gcloud/
  ```
- [ ] **时间估计**: 2分钟
- [ ] **依赖**: 无

#### PROJECT-001-B: 从git中移除SDK文件
- [ ] **任务**: 移除google-cloud-sdk目录
- [ ] **执行**: `git rm -r google-cloud-sdk/`
- [ ] **注意**: 保留本地文件但从版本控制中移除
- [ ] **时间估计**: 3分钟
- [ ] **依赖**: PROJECT-001-A

#### PROJECT-001-C: 创建SDK安装说明
- [ ] **任务**: 创建安装说明文档
- [ ] **文件**: `/docs/google-cloud-sdk-setup.md`
- [ ] **内容**: 如何本地安装和配置SDK
- [ ] **包含**: Docker使用方法
- [ ] **时间估计**: 10分钟
- [ ] **依赖**: 无

#### PROJECT-001-D: 更新README安装说明
- [ ] **任务**: 更新README.md
- [ ] **文件**: `/README.md`
- [ ] **添加**: Google Cloud SDK安装步骤
- [ ] **链接**: 指向详细安装说明
- [ ] **时间估计**: 5分钟
- [ ] **依赖**: PROJECT-001-C

## 🟢 低优先级任务 (1月内完成)

### PERF-001: 图片预加载优化

#### PERF-001-A: 创建图片预加载Hook
- [ ] **任务**: 创建useImagePreloader Hook
- [ ] **文件**: `/src/hooks/useImagePreloader.ts`
- [ ] **功能**: 
  - 分批预加载图片
  - 加载状态管理
  - 错误处理
- [ ] **参数**: imageUrls[], batchSize, delay
- [ ] **时间估计**: 20分钟
- [ ] **依赖**: 无

#### PERF-001-B: 实现懒加载策略
- [ ] **任务**: 添加懒加载配置
- [ ] **文件**: `/src/config/performance.ts`
- [ ] **配置**: 
  - PRELOAD_BATCH_SIZE: 5
  - PRELOAD_DELAY: 100ms
  - LAZY_LOAD_THRESHOLD: 100px
- [ ] **时间估计**: 5分钟
- [ ] **依赖**: 无

#### PERF-001-C: 更新TarotPage图片预加载
- [ ] **任务**: 替换同步预加载逻辑
- [ ] **文件**: `/src/pages/TarotPage.tsx`
- [ ] **第90-95行**: 使用新的预加载Hook
- [ ] **代码**:
  ```typescript
  const { isLoading, loadedCount } = useImagePreloader(
    AUTHENTIC_RWS_DECK.map(card => card.image),
    5, // batch size
    100 // delay
  );
  ```
- [ ] **时间估计**: 8分钟
- [ ] **依赖**: PERF-001-A, PERF-001-B

#### PERF-001-D: 添加加载状态指示器
- [ ] **任务**: 显示图片加载进度
- [ ] **文件**: `/src/pages/TarotPage.tsx`
- [ ] **位置**: 塔罗牌页面顶部
- [ ] **组件**: 加载条或百分比显示
- [ ] **时间估计**: 10分钟
- [ ] **依赖**: PERF-001-C

#### PERF-001-E: 测试预加载性能
- [ ] **任务**: 测试新的预加载策略
- [ ] **验证**: 
  - 初始加载时间
  - 内存使用情况
  - 用户体验改善
- [ ] **工具**: Chrome DevTools
- [ ] **时间估计**: 15分钟
- [ ] **依赖**: PERF-001-D

### PERF-002: 动画性能优化

#### PERF-002-A: 创建性能检测Hook
- [ ] **任务**: 创建usePerformanceDetector Hook
- [ ] **文件**: `/src/hooks/usePerformanceDetector.ts`
- [ ] **功能**: 
  - 检测设备性能
  - FPS监控
  - 内存使用检测
- [ ] **返回**: isLowPerformance, fps, memory
- [ ] **时间估计**: 25分钟
- [ ] **依赖**: 无

#### PERF-002-B: 创建动画降级配置
- [ ] **任务**: 创建动画配置文件
- [ ] **文件**: `/src/config/animations.ts`
- [ ] **配置**: 
  - REDUCED_MOTION_QUERY
  - LOW_PERFORMANCE_ANIMATIONS
  - HIGH_PERFORMANCE_ANIMATIONS
- [ ] **时间估计**: 8分钟
- [ ] **依赖**: 无

#### PERF-002-C: 实现动画降级Hook
- [ ] **任务**: 创建useAdaptiveAnimations Hook
- [ ] **文件**: `/src/hooks/useAdaptiveAnimations.ts`
- [ ] **功能**: 根据性能调整动画
- [ ] **返回**: animationConfig对象
- [ ] **时间估计**: 15分钟
- [ ] **依赖**: PERF-002-A, PERF-002-B

#### PERF-002-D: 更新TarotPage动画
- [ ] **任务**: 应用自适应动画
- [ ] **文件**: `/src/pages/TarotPage.tsx`
- [ ] **替换**: 复杂动画为性能友好版本
- [ ] **时间估计**: 12分钟
- [ ] **依赖**: PERF-002-C

#### PERF-002-E: 更新其他页面动画
- [ ] **任务**: 应用到其他使用动画的页面
- [ ] **文件**: 
  - `/src/pages/HomePage.tsx`
  - `/src/components/Layout.tsx`
- [ ] **时间估计**: 15分钟
- [ ] **依赖**: PERF-002-C

### TEST-001: 核心功能单元测试

#### TEST-001-A: 设置测试工具链
- [ ] **任务**: 配置测试环境
- [ ] **文件**: `/jest.config.cjs`
- [ ] **添加**: 
  - jsdom环境
  - 测试覆盖率配置
  - mock配置
- [ ] **时间估计**: 10分钟
- [ ] **依赖**: 无

#### TEST-001-B: 创建测试工具函数
- [ ] **任务**: 创建测试辅助工具
- [ ] **文件**: `/src/__tests__/test-utils.tsx`
- [ ] **功能**: 
  - renderWithProviders
  - mockApiResponse
  - createMockUser
- [ ] **时间估计**: 15分钟
- [ ] **依赖**: TEST-001-A

#### TEST-001-C: 塔罗牌逻辑测试
- [ ] **任务**: 测试塔罗牌核心逻辑
- [ ] **文件**: `/src/__tests__/utils/tarotCards.test.ts`
- [ ] **测试**: 
  - shuffleDeck功能
  - getDetailedInterpretation
  - 卡牌数据完整性
- [ ] **时间估计**: 20分钟
- [ ] **依赖**: TEST-001-B

#### TEST-001-D: 数字学计算测试
- [ ] **任务**: 测试数字学计算
- [ ] **文件**: `/src/__tests__/utils/numerology.test.ts`
- [ ] **测试**: 
  - 生命数字计算
  - 表达数字计算
  - 边界情况处理
- [ ] **时间估计**: 18分钟
- [ ] **依赖**: TEST-001-B

#### TEST-001-E: 用户认证流程测试
- [ ] **任务**: 测试认证相关组件
- [ ] **文件**: `/src/__tests__/components/SoulChronicleLogin.test.tsx`
- [ ] **测试**: 
  - 登录表单提交
  - 注册流程
  - 错误处理
- [ ] **时间估计**: 25分钟
- [ ] **依赖**: TEST-001-B

#### TEST-001-F: API服务测试
- [ ] **任务**: 测试API服务函数
- [ ] **文件**: `/src/__tests__/services/api.test.ts`
- [ ] **测试**: 
  - API请求配置
  - 错误处理
  - 响应数据处理
- [ ] **时间估计**: 20分钟
- [ ] **依赖**: TEST-001-B

#### TEST-001-G: 组件集成测试
- [ ] **任务**: 测试关键组件
- [ ] **文件**: `/src/__tests__/pages/TarotPage.test.tsx`
- [ ] **测试**: 
  - 页面渲染
  - 用户交互
  - 状态管理
- [ ] **时间估计**: 30分钟
- [ ] **依赖**: TEST-001-B

#### TEST-001-H: 运行测试覆盖率检查
- [ ] **任务**: 检查测试覆盖率
- [ ] **执行**: `npm run test -- --coverage`
- [ ] **目标**: 达到80%覆盖率
- [ ] **时间估计**: 10分钟
- [ ] **依赖**: TEST-001-C through TEST-001-G

### TEST-002: 集成测试

#### TEST-002-A: 设置Cypress测试
- [ ] **任务**: 安装和配置Cypress
- [ ] **包**: `npm install --save-dev cypress`
- [ ] **配置**: `/cypress.config.ts`
- [ ] **时间估计**: 15分钟
- [ ] **依赖**: 无

#### TEST-002-B: 用户完整流程测试
- [ ] **任务**: 端到端用户体验测试
- [ ] **文件**: `/cypress/e2e/user-journey.cy.ts`
- [ ] **测试**: 
  - 注册 → 登录 → 塔罗牌占卜 → 保存结果
- [ ] **时间估计**: 30分钟
- [ ] **依赖**: TEST-002-A

#### TEST-002-C: API集成测试
- [ ] **任务**: 测试前后端API集成
- [ ] **文件**: `/cypress/e2e/api-integration.cy.ts`
- [ ] **测试**: 
  - API请求响应
  - 数据持久化
  - 错误处理
- [ ] **时间估计**: 25分钟
- [ ] **依赖**: TEST-002-A

#### TEST-002-D: 支付流程测试
- [ ] **任务**: 测试支付集成
- [ ] **文件**: `/cypress/e2e/payment.cy.ts`
- [ ] **测试**: 使用测试环境的支付流程
- [ ] **时间估计**: 20分钟
- [ ] **依赖**: TEST-002-A

## 📋 任务执行顺序建议

### 第一天 (安全修复)
1. SEC-001-A through SEC-001-C (立即)
2. CODE-001-A through CODE-001-C (今天)

### 第二天 (基础修复)
3. AUDIO-001-A through AUDIO-001-F
4. PROJECT-001-A through PROJECT-001-D

### 第三-四天 (功能完善)
5. UI-001-A through UI-001-E
6. ERROR-001-A through ERROR-001-F

### 第五天 (清理工作)
7. CLEAN-001-A through CLEAN-001-I

### 第二周 (性能优化)
8. PERF-001-A through PERF-001-E
9. PERF-002-A through PERF-002-E

### 第三-四周 (测试完善)
10. TEST-001-A through TEST-001-H
11. TEST-002-A through TEST-002-D

## 📊 任务统计

- **极高优先级**: 3个任务组，9个子任务
- **高优先级**: 3个任务组，13个子任务  
- **中优先级**: 4个任务组，29个子任务
- **低优先级**: 5个任务组，39个子任务

**总计**: 15个任务组，90个开发单元

**预估总工时**: 约30-40小时