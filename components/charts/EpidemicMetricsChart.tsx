
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { riskData } from './RiskAnalysisChart';

export const EpidemicMetricsChart: React.FC = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={riskData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" axisLine={false} tickLine={false} label={{ value: 'Infection Rate', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} label={{ value: 'R0', angle: 90, position: 'insideRight' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Line yAxisId="left" type="monotone" dataKey="infectionRate" stroke="#8884d8" name="Infection Rate" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 4 }} />
          <Line yAxisId="right" type="monotone" dataKey="r0" stroke="#82ca9d" name="R0 Trend" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
