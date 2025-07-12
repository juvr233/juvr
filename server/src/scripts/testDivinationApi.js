#!/usr/bin/env node
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

// 测试命理数据API
async function testDivinationAPI() {
  console.log('开始测试命理数据API...');

  try {
    // 1. 测试数字学计算
    console.log('\n1. 测试数字学计算API');
    const numerologyResponse = await axios.post(`${API_BASE_URL}/divination/calculate/numerology`, {
      birthDate: '1990-05-15',
      name: '张三'
    });
    console.log('数字学计算结果:', numerologyResponse.data);

    // 2. 测试塔罗牌解读
    console.log('\n2. 测试塔罗牌解读API');
    const tarotResponse = await axios.post(`${API_BASE_URL}/divination/calculate/tarot`, {
      spread: 'three-card',
      cards: [
        { name: '愚者', position: '过去', isReversed: false },
        { name: '星星', position: '现在', isReversed: true },
        { name: '太阳', position: '未来', isReversed: false }
      ],
      question: '我的职业发展方向如何？'
    });
    console.log('塔罗牌解读结果:', tarotResponse.data);

    // 3. 测试易经解读
    console.log('\n3. 测试易经解读API');
    const ichingResponse = await axios.post(`${API_BASE_URL}/divination/calculate/iching`, {
      question: '我应该如何改善我的人际关系？'
    });
    console.log('易经解读结果:', ichingResponse.data);

    // 4. 测试兼容性分析
    console.log('\n4. 测试兼容性分析API');
    const compatibilityResponse = await axios.post(`${API_BASE_URL}/divination/calculate/compatibility`, {
      person1: { name: '张三', birthDate: '1990-05-15' },
      person2: { name: '李四', birthDate: '1992-08-21' }
    });
    console.log('兼容性分析结果:', compatibilityResponse.data);

    // 5. 测试综合命理分析
    console.log('\n5. 测试综合命理分析API');
    const holisticResponse = await axios.post(`${API_BASE_URL}/divination/calculate/holistic`, {
      birthDate: '1990-05-15',
      numerology: { lifePathNumber: 3 },
      tarot: { cards: [{ name: '星星', isReversed: false }] }
    });
    console.log('综合命理分析结果:', holisticResponse.data);

    console.log('\n所有测试完成！');
  } catch (error) {
    console.error('测试过程中出错:', error.response ? error.response.data : error.message);
  }
}

// 执行测试
testDivinationAPI();
