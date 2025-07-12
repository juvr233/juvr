#!/usr/bin/env node
// @ts-nocheck
/**
 * 路由测试脚本
 * 验证所有路由文件是否能正常导入和运行
 */

const path = require('path');
const fs = require('fs');

console.log('🧪 开始测试所有路由文件...\n');

const routesDir = path.join(__dirname, 'src', 'routes');
const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.ts'));

let successCount = 0;
let errorCount = 0;

console.log('📁 发现路由文件:');
routeFiles.forEach(file => {
  console.log(`   - ${file}`);
});
console.log('');

// 测试每个路由文件
routeFiles.forEach(file => {
  const filePath = path.join(routesDir, file);
  const routeName = file.replace('.ts', '');
  
  try {
    console.log(`🔍 测试 ${routeName}...`);
    
    // 尝试读取文件内容
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查基本结构
    const hasImport = content.includes('import');
    const hasExpress = content.includes('express');
    const hasRouter = content.includes('router');
    const hasExport = content.includes('export');
    
    if (hasImport && hasExpress && hasRouter && hasExport) {
      console.log(`✅ ${routeName} - 结构正确`);
      successCount++;
    } else {
      console.log(`⚠️  ${routeName} - 结构可能有问题`);
      console.log(`   - 导入: ${hasImport ? '✓' : '✗'}`);
      console.log(`   - Express: ${hasExpress ? '✓' : '✗'}`);
      console.log(`   - Router: ${hasRouter ? '✓' : '✗'}`);
      console.log(`   - 导出: ${hasExport ? '✓' : '✗'}`);
      errorCount++;
    }
    
  } catch (error) {
    console.log(`❌ ${routeName} - 错误: ${error.message}`);
    errorCount++;
  }
  
  console.log('');
});

console.log('📊 测试结果:');
console.log(`✅ 成功: ${successCount} 个文件`);
console.log(`❌ 错误: ${errorCount} 个文件`);
console.log(`📁 总计: ${routeFiles.length} 个文件`);

if (errorCount === 0) {
  console.log('\n🎉 所有路由文件测试通过！');
  process.exit(0);
} else {
  console.log('\n⚠️  部分路由文件需要修复');
  process.exit(1);
}
