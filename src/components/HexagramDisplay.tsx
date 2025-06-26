import { Hexagram, TRIGRAMS } from '../utils/iching';

interface HexagramDisplayProps {
  hexagram: Hexagram;
  changingLines?: number[];
  isTransformed?: boolean;
  showDetails?: boolean;
}

export default function HexagramDisplay({
  hexagram,
  changingLines = [],
  isTransformed = false,
  showDetails = true
}: HexagramDisplayProps) {
  // Get trigram symbols
  const upperTrigramSymbol = TRIGRAMS[hexagram.trigrams.upper as keyof typeof TRIGRAMS]?.symbol || '☰';
  const lowerTrigramSymbol = TRIGRAMS[hexagram.trigrams.lower as keyof typeof TRIGRAMS]?.symbol || '☰';
  
  return (
    <div className="flex flex-col items-center">
      {/* Hexagram title */}
      <div className="flex items-center space-x-4 mb-6">
        <h3 className="text-2xl font-bold text-[#C0A573]">
          {hexagram.id}. {hexagram.name} {hexagram.chineseName}
        </h3>
        {isTransformed && (
          <span className="bg-[#C0A573]/20 text-[#C0A573] px-3 py-1 rounded-full text-sm">
            变卦
          </span>
        )}
      </div>
      
      {/* Hexagram visualization */}
      <div className="flex space-x-12 items-center">
        {/* Chinese character */}
        <div className="text-6xl text-[#C0A573] font-serif">
          {hexagram.chineseName}
        </div>
        
        {/* Lines */}
        <div className="flex flex-col items-center space-y-2">
          {hexagram.lines.slice().reverse().map((line, index) => {
            const isChanging = !isTransformed && changingLines.includes(5 - index + 1);
            const isYang = line.type.includes('yang');
            
            return (
              <div key={index} className="relative group">
                {/* Line representation */}
                <div className={`w-24 h-3 rounded ${
                  isYang 
                    ? 'bg-[#C0A573]' 
                    : 'bg-[#C0A573] relative'
                } ${isChanging ? 'animate-pulse' : ''}`}>
                  {!isYang && (
                    <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-3 bg-[#2C2A4A]"></div>
                  )}
                </div>
                
                {/* Changing line indicator */}
                {isChanging && (
                  <div className="absolute -right-6 top-0">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                    <div className="w-3 h-3 bg-red-400 rounded-full absolute inset-0"></div>
                  </div>
                )}
                
                {/* Line position */}
                <div className="absolute -left-8 top-0 text-xs text-[#C0A573] font-mono">
                  {6 - index}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Trigram symbols */}
        <div className="flex flex-col items-center">
          <div className="text-4xl text-[#C0A573] mb-4" title={hexagram.trigrams.upper}>
            {upperTrigramSymbol}
          </div>
          <div className="text-4xl text-[#C0A573]" title={hexagram.trigrams.lower}>
            {lowerTrigramSymbol}
          </div>
        </div>
      </div>
      
      {/* Interpretation */}
      {showDetails && (
        <div className="mt-10 bg-[#2C2A4A]/50 p-6 rounded-xl border border-[#C0A573]/20 max-w-3xl">
          {/* Judgment and Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="text-lg font-bold text-[#C0A573] mb-3">卦辞</h4>
              <p className="text-[#F0F0F0] italic">{hexagram.judgment}</p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#C0A573] mb-3">象辞</h4>
              <p className="text-[#F0F0F0] italic">{hexagram.image}</p>
            </div>
          </div>
          
          {/* Detailed interpretation */}
          {hexagram.interpretation && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-[#C0A573] mb-3">卦象解析</h4>
                <p className="text-[#F0F0F0]">{hexagram.interpretation.explanation}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-[#C0A573] mb-3">启示</h4>
                <p className="text-[#F0F0F0]">{hexagram.interpretation.revelation}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-[#C0A573] mb-3">指导</h4>
                <p className="text-[#F0F0F0]">{hexagram.interpretation.guidance}</p>
              </div>
            </div>
          )}
          
          {/* Changing lines interpretation */}
          {!isTransformed && changingLines.length > 0 && (
            <div className="mt-8 border-t border-[#C0A573]/20 pt-6">
              <h4 className="text-lg font-bold text-[#C0A573] mb-4">变爻解读</h4>
              <div className="space-y-4">
                {changingLines.map((position) => {
                  const line = hexagram.lines.find(l => l.position === position);
                  
                  return (
                    <div key={position} className="bg-[#2C2A4A]/80 p-4 rounded-lg">
                      <h5 className="font-bold text-[#C0A573]">第{position}爻</h5>
                      {line?.text && <p className="text-[#F0F0F0] italic mt-2">{line.text}</p>}
                      {line?.meaning && <p className="text-[#F0F0F0] mt-2">{line.meaning}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
