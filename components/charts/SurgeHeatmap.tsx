import React, { useState, useEffect } from 'react';

// Initial mock data for different regions.
const initialSurgeData: { [key: string]: number[][] } = {
  'Global': [
    [20, 40, 60, 80, 95, 85, 70, 50, 30, 10, 25, 45, 65, 85, 90, 75],
    [30, 50, 70, 90, 80, 60, 40, 20, 15, 35, 55, 75, 95, 80, 60, 40],
    [10, 20, 30, 40, 50, 60, 70, 80, 90, 80, 70, 60, 50, 40, 30, 20],
    [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 85, 75, 65, 55, 45, 35],
    [40, 60, 80, 70, 50, 30, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  ],
  'North America': [
    [70, 85, 90, 80, 60, 40, 30, 50, 65, 80, 95, 85, 70, 50, 30, 20],
    [60, 75, 80, 70, 50, 30, 20, 40, 55, 70, 85, 75, 60, 40, 20, 10],
    [50, 60, 70, 60, 40, 20, 10, 30, 45, 60, 75, 65, 50, 30, 10, 5],
    [40, 50, 60, 50, 30, 10, 5, 20, 35, 50, 65, 55, 40, 20, 5, 0],
    [30, 40, 50, 40, 20, 5, 0, 10, 25, 40, 55, 45, 30, 10, 0, 0],
  ],
  'Europe': [
    [10, 20, 35, 25, 15, 10, 20, 30, 40, 50, 45, 30, 20, 10, 5, 15],
    [15, 25, 40, 30, 20, 15, 25, 35, 45, 55, 50, 35, 25, 15, 10, 20],
    [20, 30, 45, 35, 25, 20, 30, 40, 50, 60, 55, 40, 30, 20, 15, 25],
    [25, 35, 50, 40, 30, 25, 35, 45, 55, 65, 60, 45, 35, 25, 20, 30],
    [30, 40, 55, 45, 35, 30, 40, 50, 60, 70, 65, 50, 40, 30, 25, 35],
  ],
  'Asia': [
    [80, 90, 95, 100, 90, 80, 70, 75, 85, 95, 100, 90, 80, 70, 60, 50],
    [70, 80, 85, 90, 80, 70, 60, 65, 75, 85, 90, 80, 70, 60, 50, 40],
    [60, 70, 75, 80, 70, 60, 50, 55, 65, 75, 80, 70, 60, 50, 40, 30],
    [50, 60, 65, 70, 60, 50, 40, 45, 55, 65, 70, 60, 50, 40, 30, 20],
    [40, 50, 55, 60, 50, 40, 30, 35, 45, 55, 60, 50, 40, 30, 20, 10],
  ],
};

const regions = ['Global', 'North America', 'Europe', 'Asia'];

const getColor = (value: number): string => {
  const clampedValue = Math.max(0, Math.min(100, value));
  if (clampedValue > 85) return 'bg-red-600';
  if (clampedValue > 70) return 'bg-red-500';
  if (clampedValue > 55) return 'bg-yellow-500';
  if (clampedValue > 40) return 'bg-yellow-400';
  if (clampedValue > 25) return 'bg-green-500';
  return 'bg-green-400';
};

interface TooltipState {
  visible: boolean;
  content: string;
  x: number;
  y: number;
}

export const SurgeHeatmap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('Global');
  const [heatmapData, setHeatmapData] = useState(initialSurgeData);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, content: '', x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
        setHeatmapData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const regionData = newData[selectedRegion];
            
            const randomRow = Math.floor(Math.random() * regionData.length);
            const randomCol = Math.floor(Math.random() * regionData[0].length);
            
            regionData[randomRow][randomCol] = Math.floor(Math.random() * 101);

            return newData;
        });
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedRegion]);


  const data = heatmapData[selectedRegion];

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>, value: number) => {
    setTooltip({
      visible: true,
      content: `Surge Intensity: ${value}%`,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    setTooltip(prev => ({ ...prev, x: event.clientX + 15, y: event.clientY + 15 }));
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, content: '', x: 0, y: 0 });
  };


  return (
    <div>
      {tooltip.visible && (
        <div
          style={{ top: tooltip.y, left: tooltip.x }}
          className="fixed bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md shadow-lg z-50 pointer-events-none"
        >
          {tooltip.content}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {regions.map(region => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedRegion === region
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      <div className="grid grid-rows-5 gap-1 mx-auto" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
        {data.flat().map((value, index) => (
          <div
            key={index}
            className={`w-full aspect-square rounded-sm ${getColor(value)} transition-all duration-500 cursor-pointer`}
            onMouseEnter={(e) => handleMouseEnter(e, value)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <span className="sr-only">{value}</span>
          </div>
        ))}
      </div>
       <div className="flex justify-end items-center mt-4 space-x-4 text-xs text-gray-600">
            <span>Low</span>
            <div className="flex shadow-inner rounded-full p-0.5 bg-gray-100">
                <div className="w-6 h-3 bg-green-400 rounded-l-full"></div>
                <div className="w-6 h-3 bg-green-500"></div>
                <div className="w-6 h-3 bg-yellow-400"></div>
                <div className="w-6 h-3 bg-yellow-500"></div>
                <div className="w-6 h-3 bg-red-500"></div>
                <div className="w-6 h-3 bg-red-600 rounded-r-full"></div>
            </div>
            <span>High</span>
        </div>
    </div>
  );
};