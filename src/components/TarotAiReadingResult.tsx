import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import type { TarotCard } from '../utils/tarotCards';

interface TarotAiReadingResultProps {
  cards: TarotCard[];
  spreadType: string;
  question: string;
  readingId?: string; // 可选的解读ID，用于评价
  aiReading?: any; // 如果已经有AI解读结果，可以直接传入
  onRatingSubmitted?: () => void; // 评分提交后的回调
}

const TarotAiReadingResult: React.FC<TarotAiReadingResultProps> = ({ 
  cards, 
  spreadType,
  question,
  readingId,
  aiReading: initialAiReading,
  onRatingSubmitted
}) => {
  const [activeCard, setActiveCard] = useState<number>(0);
  const [aiReading, setAiReading] = useState<any>(initialAiReading);
  const [isLoading, setIsLoading] = useState<boolean>(!initialAiReading);
  const [error, setError] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [ratingSubmitted, setRatingSubmitted] = useState<boolean>(false);
  
  // 获取位置名称
  const getPositionNames = (spreadType: string): string[] => {
    switch(spreadType) {
      case 'three-card':
        return ['过去', '现在', '未来'];
      case 'five-card':
        return ['当前情况', '挑战', '基础', '潜在未来', '最终结果'];
      case 'celtic-cross':
        return [
          '当前情况', '挑战', '基础', '过去影响', 
          '潜在未来', '即将到来的影响', '内在自我', '外部影响', 
          '希望或恐惧', '最终结果'
        ];
      default:
        return [];
    }
  };
  
  const positions = getPositionNames(spreadType);
  
  // 在组件挂载时获取AI解读，如果尚未提供
  React.useEffect(() => {
    const fetchAiReading = async () => {
      if (!initialAiReading) {
        try {
          setIsLoading(true);
          setError('');
          
          // 调用AI服务获取解读
          const reading = await aiService.getEnhancedTarotReading(
            question,
            spreadType,
            cards.map(card => ({
              name: card.name,
              position: card.position || '',
              reversed: card.isReversed
            })),
            'ai' // 使用AI模型进行解读
          );
          
          setAiReading(reading);
        } catch (err) {
          setError('获取AI解读失败，请稍后再试');
          console.error('获取AI解读错误:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchAiReading();
  }, [initialAiReading, question, spreadType, cards]);
  
  // 提交评价
  const handleSubmitRating = async () => {
    if (!readingId) return;
    
    try {
      await aiService.evaluateTarotReading(readingId, rating, feedback, isFavorite);
      setRatingSubmitted(true);
      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    } catch (err) {
      console.error('提交评价失败:', err);
    }
  };
  
  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-purple-100">
        <div className="w-12 h-12 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
        <p className="mt-4 text-lg">正在生成AI解读，请稍候...</p>
      </div>
    );
  }
  
  // 渲染错误状态
  if (error) {
    return (
      <div className="p-6 bg-red-900/30 rounded-xl border border-red-500/20 text-center">
        <p className="text-red-100">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md transition-colors"
        >
          重试
        </button>
      </div>
    );
  }
  
  // 渲染解读结果
  return (
    <div className="mt-12 p-6 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl backdrop-blur-sm border border-purple-500/20">
      <h2 className="text-2xl font-bold text-center text-purple-100 mb-2">
        塔罗牌AI解读
      </h2>
      <p className="text-center text-purple-300 mb-6">
        问题：{question}
      </p>
      
      {/* 卡牌选择器 */}
      <div className="flex justify-center mb-8 overflow-x-auto pb-4 max-w-full gap-2">
        {cards.map((card, idx) => (
          <div 
            key={idx}
            className={`relative cursor-pointer transition-all ${activeCard === idx ? 'scale-110 -translate-y-2' : 'opacity-70 hover:opacity-100'}`}
            onClick={() => setActiveCard(idx)}
          >
            <img 
              src={card.image} 
              alt={card.name}
              className={`w-20 h-32 object-cover rounded-lg border-2 ${activeCard === idx ? 'border-purple-400' : 'border-transparent'} ${card.isReversed ? 'rotate-180' : ''}`}
            />
            {positions[idx] && (
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-900 text-xs px-2 py-0.5 rounded-full text-white whitespace-nowrap">
                {positions[idx]}
              </span>
            )}
          </div>
        ))}
      </div>
      
      {/* 活跃卡牌解读 */}
      {aiReading && activeCard < cards.length && (
        <div className="mb-8 p-4 bg-purple-900/40 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-100 mb-2">
            {cards[activeCard].name} {cards[activeCard].isReversed ? '(逆位)' : '(正位)'} - {positions[activeCard]}
          </h3>
          <p className="text-purple-200">
            {aiReading.interpretations && aiReading.interpretations[activeCard] ? 
              aiReading.interpretations[activeCard].interpretation : 
              '此卡无解读信息'}
          </p>
        </div>
      )}
      
      {/* 总体解读 */}
      {aiReading && (
        <div className="space-y-6">
          <div className="p-4 bg-indigo-900/40 rounded-lg">
            <h3 className="text-lg font-semibold text-indigo-100 mb-2">总体解读</h3>
            <p className="text-indigo-200">{aiReading.overallReading}</p>
          </div>
          
          <div className="p-4 bg-violet-900/40 rounded-lg">
            <h3 className="text-lg font-semibold text-violet-100 mb-2">建议</h3>
            <p className="text-violet-200">{aiReading.advice}</p>
          </div>
        </div>
      )}
      
      {/* 解读评价 */}
      {readingId && !ratingSubmitted && (
        <div className="mt-8 p-4 bg-blue-900/30 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-100 mb-4">评价解读</h3>
          
          <div className="mb-4">
            <p className="text-blue-200 mb-2">这个解读对你有帮助吗？</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star}
                  className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-400'}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-blue-200 mb-2" htmlFor="feedback">
              你对这个解读有什么反馈？
            </label>
            <textarea
              id="feedback"
              className="w-full p-2 bg-blue-950 border border-blue-500/30 rounded-md text-white"
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="分享你的感受或想法..."
            ></textarea>
          </div>
          
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="favorite"
              className="mr-2"
              checked={isFavorite}
              onChange={() => setIsFavorite(!isFavorite)}
            />
            <label htmlFor="favorite" className="text-blue-200">
              将此解读添加到收藏
            </label>
          </div>
          
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md transition-colors"
            onClick={handleSubmitRating}
            disabled={rating === 0}
          >
            提交评价
          </button>
        </div>
      )}
      
      {ratingSubmitted && (
        <div className="mt-8 p-4 bg-green-900/30 rounded-lg text-center text-green-200">
          感谢您的评价！您的反馈有助于我们改进AI解读服务。
        </div>
      )}
    </div>
  );
};

export default TarotAiReadingResult;
