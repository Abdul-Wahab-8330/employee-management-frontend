import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = {
  awaited: "#facc15",   // yellow-400
  submitted: "#3b82f6", // blue-500
  approved: "#10b981",  // green-500
  rejected: "#ef4444",  // red-500
};

const TaskChartCard = ({ tasks }) => {
  const total = tasks.length;

  const grouped = {
    awaited: tasks.filter(t => t.status === 'awaited').length,
    submitted: tasks.filter(t => t.status === 'submitted').length,
    approved: tasks.filter(t => t.status === 'approved').length,
    rejected: tasks.filter(t => t.status === 'rejected').length,
  };

  const data = Object.entries(grouped)
    .filter(([, count]) => count > 0)
    .map(([key, value]) => ({
      name: key,
      value,
    }));

  const successRate = grouped.approved > 0
    ? (grouped.approved / total) * 100
    : grouped.submitted > 0
      ? (grouped.submitted / total) * 100
      : 0;

  return (
    <div className="bg-blue-50 col-span-2 md:col-span-1 lg:col-span-2 p-4 rounded-xl shadow-lg text-center">
      <h4 className="text-lg font-semibold text-purple-800 mb-2">Task Overview</h4>
      <div className="w-full h-42 relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs text-gray-500">Success Rate</p>
            <p className="text-2xl font-bold text-purple-700">{successRate.toFixed(0)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskChartCard;
