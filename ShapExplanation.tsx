import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShapExplanation as ShapData } from '../types';
import { Brain, TrendingUp } from 'lucide-react';

interface ShapExplanationProps {
  shapData: ShapData;
  location: string;
}

export const ShapExplanation: React.FC<ShapExplanationProps> = ({ shapData, location }) => {
  const chartData = shapData.topFactors.map(factor => ({
    name: factor.factor,
    impact: Math.abs(factor.impact * 100),
    color: factor.impact > 0 ? '#dc2626' : '#16a34a'
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Brain className="text-purple-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">AI Explanation</h3>
          <p className="text-gray-600">Why {location} has {(shapData.riskScore * 100).toFixed(0)}% fire risk</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Risk Score</span>
          <span className="text-lg font-bold text-red-600">{(shapData.riskScore * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${shapData.riskScore * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Contributing Factors
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis 
                label={{ value: 'Impact (%)', angle: -90, position: 'insideLeft' }}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: any) => [`${value.toFixed(1)}%`, 'Impact']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="impact" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-gray-900">Detailed Analysis</h4>
        {shapData.topFactors.map((factor, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{factor.factor}</span>
              <span className="text-sm font-bold text-red-600">
                {(factor.impact * 100).toFixed(1)}% impact
              </span>
            </div>
            <p className="text-sm text-gray-600">{factor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};