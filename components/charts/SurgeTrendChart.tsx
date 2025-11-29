
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', OP: 400, IP: 240, ER: 120 },
  { name: 'Tue', OP: 300, IP: 139, ER: 150 },
  { name: 'Wed', OP: 200, IP: 980, ER: 220 },
  { name: 'Thu', OP: 278, IP: 390, ER: 200 },
  { name: 'Fri', OP: 189, IP: 480, ER: 210 },
  { name: 'Sat', OP: 239, IP: 380, ER: 250 },
  { name: 'Sun', OP: 349, IP: 430, ER: 280 },
];

export const SurgeTrendChart: React.FC = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '0.5rem',
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="OP" stackId="a" fill="#06B6D4" name="Out-Patient" />
          <Bar dataKey="IP" stackId="a" fill="#10B981" name="In-Patient" />
          <Bar dataKey="ER" stackId="a" fill="#F59E0B" name="Emergency" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
