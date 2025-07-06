import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Wind, Eye, Activity, Satellite } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
}

interface RealTimeStatsProps {
  weatherData: WeatherData;
}

export const RealTimeStats: React.FC<RealTimeStatsProps> = ({ weatherData }) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: Thermometer,
      label: 'Temperature',
      value: `${weatherData.temperature}°C`,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      trend: weatherData.temperature > 30 ? 'high' : 'normal'
    },
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weatherData.humidity}%`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: weatherData.humidity < 20 ? 'critical' : 'normal'
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: `${weatherData.windSpeed} km/h`,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: weatherData.windSpeed > 20 ? 'high' : 'normal'
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${weatherData.visibility} km`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: 'normal'
    },
    {
      icon: Activity,
      label: 'Pressure',
      value: `${weatherData.pressure} hPa`,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      trend: 'normal'
    },
    {
      icon: Satellite,
      label: 'Satellite Status',
      value: 'Active',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      trend: 'normal'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Real-Time Environmental Data</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600">
            Updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${
              stat.trend === 'critical' ? 'border-red-300 bg-red-50' :
              stat.trend === 'high' ? 'border-orange-300 bg-orange-50' :
              'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={stat.color} size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              </div>
              {stat.trend === 'critical' && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
              {stat.trend === 'high' && (
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Data Sources</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div>• ISRO INSAT-3D Satellite</div>
          <div>• Ground Weather Stations</div>
          <div>• AWS IoT Sensors</div>
          <div>• Doppler Radar Network</div>
        </div>
      </div>
    </div>
  );
};