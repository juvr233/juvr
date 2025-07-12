import { TRIGRAMS } from '../utils/iching';

interface HexagramAnalysisProps {
  upperTrigram: string;
  lowerTrigram: string;
}

export default function HexagramAnalysis({ upperTrigram, lowerTrigram }: HexagramAnalysisProps) {
  // 获取卦的五行属性
  const upperElement = TRIGRAMS[upperTrigram as keyof typeof TRIGRAMS]?.element || "Unknown";
  const lowerElement = TRIGRAMS[lowerTrigram as keyof typeof TRIGRAMS]?.element || "Unknown";

  // 获取卦的属性
  const upperAttribute = TRIGRAMS[upperTrigram as keyof typeof TRIGRAMS]?.attribute || "Unknown";
  const lowerAttribute = TRIGRAMS[lowerTrigram as keyof typeof TRIGRAMS]?.attribute || "Unknown";

  // 获取卦的符号
  const upperSymbol = TRIGRAMS[upperTrigram as keyof typeof TRIGRAMS]?.symbol || "☰";
  const lowerSymbol = TRIGRAMS[lowerTrigram as keyof typeof TRIGRAMS]?.symbol || "☰";

  // 五行相生相克关系
  const elementRelationships: {[key: string]: {[key: string]: string}} = {
    "Metal": {
      "Metal": "中和",
      "Water": "相生",
      "Wood": "相克",
      "Fire": "被克",
      "Earth": "被生"
    },
    "Water": {
      "Metal": "被生",
      "Water": "中和",
      "Wood": "相生",
      "Fire": "相克",
      "Earth": "被克"
    },
    "Wood": {
      "Metal": "被克",
      "Water": "被生",
      "Wood": "中和",
      "Fire": "相生",
      "Earth": "相克"
    },
    "Fire": {
      "Metal": "相生",
      "Water": "被克",
      "Wood": "被生",
      "Fire": "中和",
      "Earth": "相生"
    },
    "Earth": {
      "Metal": "相生",
      "Water": "相克",
      "Wood": "被生",
      "Fire": "被生",
      "Earth": "中和"
    }
  };

  // 确定五行关系
  const elementRelationship = elementRelationships[upperElement]?.[lowerElement] || "未知";

  // 卦象解析
  const analyzeRelationship = () => {
    if (elementRelationship === "相生") {
      return "上下卦五行相生，表示事物的发展较为顺利，能够互相促进，有利于合作和发展。";
    } else if (elementRelationship === "相克") {
      return "上下卦五行相克，表示事物发展过程中可能有阻力和冲突，需要谨慎处理，寻求平衡。";
    } else if (elementRelationship === "被生") {
      return "上卦被下卦五行所生，表示基础能够支持上层发展，但可能需要更多的耐心和滋养。";
    } else if (elementRelationship === "被克") {
      return "上卦被下卦五行所克，表示基础可能会制约上层发展，需要调整策略，化解矛盾。";
    } else {
      return "上下卦五行相同，表示事物处于相对稳定的状态，但可能缺乏变化和活力。";
    }
  };
  
  return (
    <div className="bg-[#2C2A4A]/80 rounded-xl p-6 border border-[#C0A573]/20">
      <h3 className="text-xl font-bold text-[#C0A573] mb-4">卦象五行分析</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-[#F0F0F0] mb-2">上卦: {upperTrigram} {upperSymbol}</h4>
          <p className="text-[#C0A573]">五行: {upperElement}</p>
          <p className="text-[#C0A573]">属性: {upperAttribute}</p>
        </div>
        <div>
          <h4 className="font-semibold text-[#F0F0F0] mb-2">下卦: {lowerTrigram} {lowerSymbol}</h4>
          <p className="text-[#C0A573]">五行: {lowerElement}</p>
          <p className="text-[#C0A573]">属性: {lowerAttribute}</p>
        </div>
      </div>
      
      <div className="mt-6 border-t border-[#C0A573]/20 pt-4">
        <h4 className="font-semibold text-[#F0F0F0] mb-2">五行关系: {elementRelationship}</h4>
        <p className="text-[#F0F0F0]">{analyzeRelationship()}</p>
      </div>
    </div>
  );
}
