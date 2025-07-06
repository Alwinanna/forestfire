import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Wind, Droplets, Eye, Zap, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface WeatherData {
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  fwi: number;
  ffmc: number;
  dmc: number;
  dc: number;
  isi: number;
  bui: number;
}

export const FireWeatherIndex: React.FC = () => {
  const [currentFWI, setCurrentFWI] = useState(85);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [currentConditions, setCurrentConditions] = useState({
    temperature: 34,
    humidity: 12,
    windSpeed: 28,
    visibility: 6,
    pressure: 1008,
    dewPoint: -2
  });

  useEffect(() => {
    // Generate realistic weather data for the last 24 hours
    const generateWeatherData = () => {
      const data = [];
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(Date.now() - i * 3600000);
        const temp = 25 + Math.sin((24 - i) / 24 * Math.PI * 2) * 8 + Math.random() * 4;
        const humidity = Math.max(5, 30 - Math.sin((24 - i) / 24 * Math.PI * 2) * 20 + Math.random() * 10);
        const windSpeed = 15 + Math.sin((24 - i) / 24 * Math.PI * 4) * 10 + Math.random() * 5;
        
        // Calculate Fire Weather Index components (simplified)
        const ffmc = Math.min(99, Math.max(0, 85 + (35 - temp) * 0.5 + (humidity - 15) * 0.3));
        const dmc = Math.min(300, Math.max(0, 50 + (temp - 20) * 2 - humidity * 0.5));
        const dc = Math.min(1000, Math.max(0, 200 + (temp - 15) * 5 - humidity * 2));
        const isi = Math.min(50, Math.max(0, windSpeed * 0.5 + (99 - ffmc) * 0.1));
        const bui = Math.min(200, Math.max(0, (dmc + dc) * 0.1));
        const fwi = Math.min(100, Math.max(0, Math.sqrt(isi * bui * 0.1)));

        data.push({
          time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          temperature: Math.round(temp),
          humidity: Math.round(humidity),
          windSpeed: Math.round(windSpeed),
          fwi: Math.round(fwi),
          ffmc: Math.round(ffmc),
          dmc: Math.round(dmc),
          dc: Math.round(dc),
          isi: Math.round(isi),
          bui: Math.round(bui)
        });
      }
      return data;
    };

    setWeatherData(generateWeatherData());

    // Update current conditions every 30 seconds
    const timer = setInterval(() => {
      setCurrentConditions(prev => ({
        ...prev,
        temperature: Math.max(20, prev.temperature + (Math.random() - 0.5) * 2),
        humidity: Math.max(5, Math.min(95, prev.humidity + (Math.random() - 0.5) * 3)),
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 5),
      }));

      // Recalculate FWI based on current conditions
      const newFWI = Math.min(100, Math.max(0, 
        (currentConditions.temperature - 15) * 2 + 
        (40 - currentConditions.humidity) * 1.5 + 
        currentConditions.windSpeed * 0.8
      ));
      setCurrentFWI(Math.round(newFWI));
    }, 30000);

    return () => clearInterval(timer);
  }, [currentConditions.temperature, currentConditions.humidity, currentConditions.windSpeed]);

  const getFWIColor = (fwi: number) => {
    if (fwi >= 90) return 'text-red-600 bg-red-100';
    if (fwi >= 70) return 'text-orange-600 bg-orange-100';
    if (fwi >= 50) return 'text-yellow-600 bg-yellow-100';
    if (fwi >= 30) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const getFWILevel = (fwi: number) => {
    if (fwi >= 90) return 'EXTREME';
    if (fwi >= 70) return 'VERY HIGH';
    if (fwi >= 50) return 'HIGH';
    if (fwi >= 30) return 'MODERATE';
    return 'LOW';
  };

  return (
    <div className="card-primary space-component">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-600 rounded-lg">
            <Zap className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-heading-3 font-bold text-white">Fire Weather Index</h3>
            <p className="text-body-small text-slate-400">Canadian Forest Fire Weather System</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`px-3 py-1 rounded-lg font-bold text-lg ${getFWIColor(currentFWI)}`}>
            FWI: {currentFWI}
          </div>
          <p className="text-caption text-slate-400 mt-1">{getFWILevel(currentFWI)}</p>
        </div>
      </div>

      {/* Current Weather Conditions */}
      <div className="grid-responsive grid-1-2-3 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-900/30 rounded-lg p-4 border border-red-600"
        >
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="text-red-500" size={20} />
            <span className="text-red-400 font-semibold">Temperature</span>
          </div>
          <div className="text-2xl font-bold text-white">{currentConditions.temperature}°C</div>
          <div className="text-sm text-red-300">Critical threshold: &gt;30°C</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-900/30 rounded-lg p-4 border border-blue-600"
        >
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="text-blue-500" size={20} />
            <span className="text-blue-400 font-semibold">Humidity</span>
          </div>
          <div className="text-2xl font-bold text-white">{currentConditions.humidity}%</div>
          <div className="text-sm text-blue-300">Critical threshold: &lt;20%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-green-900/30 rounded-lg p-4 border border-green-600"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wind className="text-green-500" size={20} />
            <span className="text-green-400 font-semibold">Wind Speed</span>
          </div>
          <div className="text-2xl font-bold text-white">{currentConditions.windSpeed} km/h</div>
          <div className="text-sm text-green-300">Critical threshold: &gt;25 km/h</div>
        </motion.div>
      </div>

      {/* FWI Components Chart */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">24-Hour Fire Weather Trend</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weatherData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9ca3af"
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="fwi" 
                stroke="#dc2626" 
                fill="#dc2626" 
                fillOpacity={0.3}
                strokeWidth={2}
                name="Fire Weather Index"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FWI Components */}
      <div className="grid-responsive grid-1-2-3">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">Fine Fuel Moisture Code</h5>
          <div className="text-xl font-bold text-orange-400">
            {weatherData[weatherData.length - 1]?.ffmc || 0}
          </div>
          <div className="text-sm text-slate-400">Surface litter moisture</div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">Duff Moisture Code</h5>
          <div className="text-xl font-bold text-yellow-400">
            {weatherData[weatherData.length - 1]?.dmc || 0}
          </div>
          <div className="text-sm text-slate-400">Moderate depth moisture</div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <h5 className="font-semibold text-white mb-2">Drought Code</h5>
          <div className="text-xl font-bold text-red-400">
            {weatherData[weatherData.length - 1]?.dc || 0}
          </div>
          <div className="text-sm text-slate-400">Deep layer moisture</div>
        </div>
      </div>

      {/* Warning System */}
      {currentFWI >= 70 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-red-900/50 rounded-lg border border-red-500"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-400" size={24} />
            <div>
              <h5 className="font-bold text-red-300">EXTREME FIRE WEATHER WARNING</h5>
              <p className="text-red-200 text-sm mt-1">
                Current conditions are extremely conducive to fire ignition and rapid spread. 
                All outdoor burning activities should be suspended immediately.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};