# 🚀 项目生产环境就绪计划

## 生产环境密钥参数（重要）

### 原厂数据库

- **远程mongodb数据库信息** `mongodb://mongo:a288efdd705cc506f61c@152.53.193.180:25717/?tls=false`

### AI 服务（Google Gemini）

- **AI Model**: `Gemini-2.5-Pro`
- **Base API URL**: `https://ai.novcase.com/gemini/v1beta`
- **Gemini Key**: `sk-520559`

---

### Shopify 配置

- **Storefront Access Token**:  
  `bb700b526ea36bedf8f3ed68cf8f8974`

- **Admin Access Token**:  
  `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`

- **API Key**:  
  `1332cf0da7e008b854a6978f2e27044e`

- **API Secret Key**:  
  `49066cf6a268bef827734e3847d5ddf0`

- **Webhook Version**:  
  `2025-07`


## 当前系统状态评估

经过对代码库的全面审查，目前系统核心功能已开发完成，但AI模块尚未完全实现，距离生产环境部署尚有差距。系统完成度约为70%，存在以下关键问题：

### 核心问题

1.  **AI服务不完整**
    *   AI推理功能仍在使用模拟或规则引擎，而非真实的深度学习模型。
    *   模型训练功能尚未实现，无法对模型进行迭代和优化。
    *   部分AI服务的关键方法标记为`TODO`，需要完成开发。

2.  **数据与模型**
    *   缺少真实的训练数据集，目前依赖于模拟数据和少量用户历史。
    *   没有实现从外部数据源导入训练数据的功能。
    *   模型评估和验证机制需要与真实模型对接。

3.  **文档与实际情况不一致**
    *   `next.md`文档中关于第六阶段AI模型完善的描述与实际代码不符。

## 下一步行动计划

### 第一阶段：AI模型训练与部署（4周）

1.  **实现模型训练服务**
    *   **任务**: 在`server/src/services/ai/modelTraining.service.ts`中，完成所有标记为`TODO`的AI模型训练方法。
    *   **目标**:
        *   为`numerology`, `tarot`, `iching`, `compatibility`, `bazi`, `starAstrology`, `holistic`等所有模型类型实现真实的训练逻辑。
        *   考虑使用TensorFlow.js或调用外部Python训练脚本。
    *   **示例 - 训练数字学模型**:
        ```typescript
        // server/src/services/ai/modelTraining.service.ts

        private async trainNumerologyModel(model: AiModelDocument, parameters: Record<string, any> = {}): Promise<void> {
          // 1. 数据预处理
          const { features, labels } = this.preprocessData(model.trainingData);
          
          // 2. 构建TensorFlow.js模型
          const tfModel = tf.sequential();
          tfModel.add(tf.layers.dense({inputShape: [features[0].length], units: 32, activation: 'relu'}));
          tfModel.add(tf.layers.dense({units: 16, activation: 'relu'}));
          tfModel.add(tf.layers.dense({units: labels[0].length, activation: 'softmax'}));
          
          // 3. 编译和训练模型
          tfModel.compile({optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy']});
          await tfModel.fit(tf.tensor2d(features), tf.tensor2d(labels), {
            epochs: parameters.epochs || 50,
            batchSize: parameters.batchSize || 32
          });
          
          // 4. 保存模型
          await tfModel.save(`file://${this.modelDir}/numerology-model`);
        }
        ```

2.  **实现数据导入功能**
    *   **任务**: 在`server/src/services/ai/trainingData.service.ts`中，实现从外部数据源导入训练数据的功能。
    *   **目标**: 支持从JSON或CSV文件导入，并能将其转换为标准的训练数据格式。

3.  **部署和验证模型**
    *   **任务**: 训练完成后，将模型文件部署到服务器，并实现模型验证逻辑。
    *   **目标**: `aiInferenceService`能够加载并使用训练好的模型。

### 第二阶段：AI推理服务实现（3周）

1.  **完成AI推理服务**
    *   **任务**: 在`server/src/services/ai/aiInference.service.ts`中，完成所有标记为`TODO`的AI推理方法。
    *   **目标**: 使用已部署的AI模型替换现有的规则引擎和模拟数据。
    *   **示例 - 数字学推理**:
        ```typescript
        // server/src/services/ai/aiInference.service.ts

        private async inferNumerology(model: any, inputData: any): Promise<any> {
          // 1. 加载已训练的模型
          const tfModel = await tf.loadLayersModel(`file://${this.modelDir}/numerology-model/model.json`);
          
          // 2. 预处理输入数据
          const inputTensor = this.preprocessInput(inputData);
          
          // 3. 执行推理
          const prediction = tfModel.predict(inputTensor) as tf.Tensor;
          const result = await prediction.data();
          
          // 4. 解析并返回结果
          return this.formatOutput(result);
        }
        ```

2.  **实现A/B测试**
    *   **任务**: 在`server/src/services/ai/abTesting.service.ts`中，完善A/B测试逻辑。
    *   **目标**: 能够同时运行新旧两个版本的AI模型，并收集用户反馈，以评估模型性能。

### 第三阶段：文档更新与全面测试（2周）

1.  **更新项目文档**
    *   **任务**: 修改`next.md`和其他相关文档，确保其内容与项目实际情况一致。
    *   **目标**: 准确反映项目进度和下一步计划。

2.  **完善测试用例**
    *   **任务**: 针对新实现的AI功能，编写单元测试和集成测试。
    *   **目标**: 确保AI服务的稳定性和准确性，覆盖率达到80%以上。

3.  **端到端测试**
    *   **任务**: 对整个系统进行端到端测试，确保所有模块协同工作正常。
    *   **目标**: 发现并修复潜在的集成问题。

## 总结

完成以上三个阶段后，项目将拥有一个功能完整的AI模块，并为生产环境的全面部署做好准备。后续可以继续进行性能优化、安全加固和功能扩展。

