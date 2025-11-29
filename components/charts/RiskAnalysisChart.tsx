
import React from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const riskData = [
  { day: 'Day 1', infectionRate: 120, hospitalStress: 45, r0: 1.2 },
  { day: 'Day 2', infectionRate: 132, hospitalStress: 48, r0: 1.3 },
  { day: 'Day 3', infectionRate: 145, hospitalStress: 52, r0: 1.4 },
  { day: 'Day 4', infectionRate: 160, hospitalStress: 60, r0: 1.5 },
  { day: 'Day 5', infectionRate: 200, hospitalStress: 75, r0: 1.8 },
  { day: 'Day 6', infectionRate: 250, hospitalStress: 88, r0: 2.1 },
  { day: 'Day 7', infectionRate: 230, hospitalStress: 92, r0: 1.9 },
];

export const RiskAnalysisChart: React.FC = () => {
  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <ComposedChart
          data={riskData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="day" scale="point" padding={{ left: 20, right: 20 }} />
          <YAxis yAxisId="left" label={{ value: 'Infection Rate', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Stress Index / R0', angle: 90, position: 'insideRight' }} />
          <Tooltip 
             contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
          />
          <Legend />
          <Area type="monotone" yAxisId="right" dataKey="hospitalStress" name="Hospital Stress Index (0-100)" fill="#8884d8" stroke="#8884d8" fillOpacity={0.2} />
          <Line yAxisId="left" type="monotone" dataKey="infectionRate" name="Daily Infection Rate" stroke="#ff7300" strokeWidth={2} dot={{ r: 4 }} />
          <Line yAxisId="right" type="monotone" dataKey="r0" name="R0 Estimate" stroke="#82ca9d" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
