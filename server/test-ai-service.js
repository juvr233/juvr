/**
 * AI命理服务测试脚本
 * 用于测试AI命理解读API
 */
import axios from 'axios';

// API基础URL
const API_BASE_URL = 'http://localhost:3000';

/**
 * 测试数字学解读
 */
async function testNumerologyReading() {
  console.log('测试数字学解读...');
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ai/reading`, {
      modelType: 'numerology',
      inputData: {
        birthDate: '1990-01-01',
        name: '张三'
      }
    });
    
    console.log('数字学解读结果:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('测试数字学解读失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 测试塔罗牌解读
 */
async function testTarotReading() {
  console.log('测试塔罗牌解读...');
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ai/reading`, {
      modelType: 'tarot',
      inputData: {
        question: '我应该如何应对当前工作中的挑战，以实现职业成长？',
        spread: 'celtic-cross', // 假设使用凯尔特十字牌阵
        cards: [
          { name: 'The Fool', reversed: false }, // 1. 现状
          { name: 'The Magician', reversed: true }, // 2. 挑战
          { name: 'The High Priestess', reversed: false }, // 3. 潜意识
          { name: 'The Emperor', reversed: false }, // 4. 过去
          { name: 'The Hierophant', reversed: true }, // 5. 目标
          { name: 'The Lovers', reversed: false }, // 6. 未来
          { name: 'The Chariot', reversed: false }, // 7. 自身
          { name: 'Strength', reversed: true }, // 8. 外界
          { name: 'The Hermit', reversed: false }, // 9. 希望与恐惧
          { name: 'Wheel of Fortune', reversed: false } // 10. 结果
        ]
      }
    });
    
    console.log('塔罗牌解读结果:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('测试塔罗牌解读失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 测试易经解读
 */
async function testIChingReading() {
  console.log('测试易经解读...');
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ai/reading`, {
      modelType: 'iching',
      inputData: {
        question: '我应该如何处理当前的人际关系挑战？',
        hexagram: '101111'
      }
    });
    
    console.log('易经解读结果:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('测试易经解读失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('开始测试AI命理解读服务...');
    
    // 测试数字学解读
    await testNumerologyReading();
    
    // 测试塔罗牌解读
    await testTarotReading();
    
    // 测试易经解读
    await testIChingReading();
    
    console.log('所有测试完成！');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 运行测试
main();
