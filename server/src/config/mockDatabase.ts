import { logger } from './logger';

// 创建一个简单的内存数据库模拟
class MockDatabase {
  private static instance: MockDatabase;
  private collections: Map<string, any[]>;
  
  private constructor() {
    this.collections = new Map();
    logger.info('MockDatabase 已初始化');
  }
  
  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }
  
  // 获取或创建集合
  public getCollection(name: string): any[] {
    if (!this.collections.has(name)) {
      this.collections.set(name, []);
      logger.debug(`创建集合: ${name}`);
    }
    return this.collections.get(name) || [];
  }
  
  // 添加文档到集合
  public addToCollection(name: string, document: any): any {
    const collection = this.getCollection(name);
    // 生成唯一ID
    document._id = this.generateObjectId();
    collection.push(document);
    logger.debug(`添加文档到集合 ${name}: ${JSON.stringify(document)}`);
    return document;
  }
  
  // 查找文档
  public findInCollection(name: string, query: any): any[] {
    const collection = this.getCollection(name);
    
    // 简单匹配查询
    return collection.filter(doc => {
      for (const key in query) {
        if (doc[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }
  
  // 更新文档
  public updateInCollection(name: string, query: any, update: any): any {
    const collection = this.getCollection(name);
    const matchedDocs = this.findInCollection(name, query);
    
    if (matchedDocs.length > 0) {
      const doc = matchedDocs[0];
      const index = collection.indexOf(doc);
      
      // 应用更新
      for (const key in update) {
        if (key === '$set') {
          for (const setKey in update[key]) {
            doc[setKey] = update[key][setKey];
          }
        } else {
          doc[key] = update[key];
        }
      }
      
      collection[index] = doc;
      logger.debug(`更新文档: ${JSON.stringify(doc)}`);
      return doc;
    }
    
    return null;
  }
  
  // 删除文档
  public removeFromCollection(name: string, query: any): number {
    const collection = this.getCollection(name);
    const initialLength = collection.length;
    
    // 过滤留下不匹配的文档
    const newCollection = collection.filter(doc => {
      for (const key in query) {
        if (doc[key] === query[key]) {
          return false;
        }
      }
      return true;
    });
    
    this.collections.set(name, newCollection);
    return initialLength - newCollection.length;
  }
  
  // 模拟ObjectId
  private generateObjectId(): string {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
      return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
  }
  
  // 清除所有数据
  public clear(): void {
    this.collections.clear();
    logger.info('MockDatabase 已清除');
  }
}

export default MockDatabase.getInstance();
