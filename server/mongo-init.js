// 创建应用数据库和用户
db = db.getSiblingDB('divination');

// 创建应用用户
db.createUser({
  user: 'app_user',
  pwd: process.env.MONGO_APP_PASSWORD || 'app_password',
  roles: [
    { role: 'readWrite', db: 'divination' }
  ]
});

// 创建初始集合
db.createCollection('users');
db.createCollection('aiModels');
db.createCollection('paidServices');
db.createCollection('purchases');
db.createCollection('userHistories');
db.createCollection('divinationQueries');
db.createCollection('divinationMetadata');
db.createCollection('sharedPosts');
db.createCollection('comments');
db.createCollection('userfeedbacks');
db.createCollection('feedbackstats');

// 创建索引以提高查询性能
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.aiModels.createIndex({ "type": 1, "status": 1 });
db.purchases.createIndex({ "user": 1, "status": 1 });
db.purchases.createIndex({ "transactionId": 1 }, { unique: true });
db.userHistories.createIndex({ "user": 1, "createdAt": -1 });
db.divinationQueries.createIndex({ "type": 1, "createdAt": -1 });

// 为用户反馈创建索引
db.userfeedbacks.createIndex({ "userId": 1, "readingId": 1 }, { unique: true });
db.userfeedbacks.createIndex({ "readingType": 1, "rating": 1 });
db.userfeedbacks.createIndex({ "usedForTraining": 1, "rating": 1 });

// 初始化反馈统计数据
db.feedbackstats.insertOne({
  type: 'global',
  lastUpdated: new Date(),
  readingTypes: {
    tarot: { totalCount: 0, averageRating: 0 },
    iching: { totalCount: 0, averageRating: 0 },
    bazi: { totalCount: 0, averageRating: 0 },
    numerology: { totalCount: 0, averageRating: 0 },
    compatibility: { totalCount: 0, averageRating: 0 },
    holistic: { totalCount: 0, averageRating: 0 }
  }
});

// 初始化AI模型数据
db.aiModels.insertMany([
  {
    name: "塔罗牌解读模型",
    type: "tarot",
    version: 1,
    status: "active",
    accuracy: 0.85,
    createdAt: new Date(),
    updatedAt: new Date(),
    parameters: {
      modelType: "neural-network",
      layers: 3,
      featureCount: 128
    },
    trainingDataSize: 1200
  },
  {
    name: "数字学模型",
    type: "numerology",
    version: 1,
    status: "active",
    accuracy: 0.82,
    createdAt: new Date(),
    updatedAt: new Date(),
    parameters: {
      modelType: "neural-network",
      layers: 2,
      featureCount: 64
    },
    trainingDataSize: 800
  },
  {
    name: "易经解读模型",
    type: "iching",
    version: 1,
    status: "active",
    accuracy: 0.88,
    createdAt: new Date(),
    updatedAt: new Date(),
    parameters: {
      modelType: "neural-network",
      layers: 4,
      featureCount: 256
    },
    trainingDataSize: 640
  },
  {
    name: "星座占星模型",
    type: "star_astrology",
    version: 1,
    status: "active",
    accuracy: 0.83,
    createdAt: new Date(),
    updatedAt: new Date(),
    parameters: {
      modelType: "neural-network",
      layers: 3,
      featureCount: 192
    },
    trainingDataSize: 720
  },
  {
    name: "八字命理模型",
    type: "bazi",
    version: 1,
    status: "active",
    accuracy: 0.86,
    createdAt: new Date(),
    updatedAt: new Date(),
    parameters: {
      modelType: "neural-network",
      layers: 4,
      featureCount: 320
    },
    trainingDataSize: 520
  }
]);

// 初始化付费服务数据
db.paidServices.insertMany([
  {
    name: '五张塔罗牌解读',
    slug: 'five-card-tarot',
    description: '使用五张塔罗牌阵为您提供更深入的生活情境分析，包括现状、障碍、建议、原因和潜力五个方面。',
    price: 29.99,
    type: 'tarot',
    featureLevel: 'advanced',
    isActive: true
  },
  {
    name: '十张塔罗牌凯尔特十字阵解读',
    slug: 'ten-card-tarot',
    description: '使用经典的凯尔特十字牌阵，提供全面而深入的人生解读，覆盖过去、现在、未来等多个维度。',
    price: 49.99,
    type: 'tarot',
    featureLevel: 'advanced',
    isActive: true
  },
  {
    name: '周易六十四卦全解',
    slug: 'iching-divination',
    description: '完整访问周易六十四卦的详细解读，包括卦辞、爻辞、形势判断和具体指导。',
    price: 39.99,
    type: 'iching',
    featureLevel: 'advanced',
    isActive: true
  },
  {
    name: '高级命理配对分析',
    slug: 'advanced-compatibility',
    description: '基于数字学和占星学的深度兼容性分析，包括关系优势、挑战和成长方向。',
    price: 35.99,
    type: 'compatibility',
    featureLevel: 'advanced',
    isActive: true
  },
  {
    name: '全面八字命理解析',
    slug: 'complete-bazi',
    description: '根据出生年、月、日、时进行详细的八字命理分析，包括五行平衡、命局特点和发展前景。',
    price: 59.99,
    type: 'bazi',
    featureLevel: 'premium',
    isActive: true
  }
]);

// 创建系统用户（如果在生产环境，请修改此密码）
if (process.env.NODE_ENV !== 'production') {
  db.users.insertOne({
    username: "admin",
    email: "admin@example.com",
    password: "$2a$12$FS0OERFKuB1Jwz94CJx0KuaCSeQbKnK0HnY.UrGFhXvgOmnWIwN8O", // "Admin@123"
    role: "admin",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  db.users.insertOne({
    username: "test",
    email: "test@example.com",
    password: "$2a$12$JKNe9ZwGwPmjLFn4oPPeReoOJ.mTl.whQmRK2xQXl9lPgLHZqZdF2", // "Test@123"
    role: "user",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

// 添加模式版本信息
db.createCollection('schemaversions');
db.schemaversions.insertOne({
  system: 'divination',
  version: '1.1.0',
  features: {
    core: { version: '1.0.0', updatedAt: new Date() },
    userFeedback: { version: '1.0.0', updatedAt: new Date() }
  },
  updatedAt: new Date()
});

print("MongoDB初始化完成！"); 