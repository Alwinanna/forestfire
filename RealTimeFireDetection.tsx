import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, MapPin, Clock, Zap, AlertTriangle, Eye, Target } from 'lucide-react';

interface FireDetection {
  id: string;
  lat: number;
  lng: number;
  confidence: number;
  temperature: number;
  size: number;
  satellite: string;
  detectionTime: Date;
  status: 'new' | 'confirmed' | 'monitoring' | 'contained';
  frp: number; // Fire Radiative Power
}

export const RealTimeFireDetection: React.FC = () => {
  const [fireDetections, setFireDetections] = useState<FireDetection[]>([
    {
      id: 'fire-001',
      lat: 29.5319,
      lng: 78.7718,
      confidence: 95,
      temperature: 387,
      size: 2.3,
      satellite: 'INSAT-3D',
      detectionTime: new Date(Date.now() - 300000), // 5 min ago
      status: 'confirmed',
      frp: 45.2
    },
    {
      id: 'fire-002',
      lat: 29.3919,
      lng: 79.4542,
      confidence: 87,
      temperature: 342,
      size: 1.8,
      satellite: 'INSAT-3DR',
      detectionTime: new Date(Date.now() - 600000), // 10 min ago
      status: 'monitoring',
      frp: 32.1
    },
    {
      id: 'fire-003',
      lat: 29.4500,
      lng: 79.2000,
      confidence: 78,
      temperature: 298,
      size: 0.9,
      satellite: 'Cartosat-3',
      detectionTime: new Date(Date.now() - 900000), // 15 min ago
      status: 'new',
      frp: 18.7
    }
  ]);

  const [totalDetections, setTotalDetections] = useState(23);
  const [activeHotspots, setActiveHotspots] = useState(12);

  useEffect(() => {
    // Simulate real-time fire detection updates
    const timer = setInterval(() => {
      // Randomly add new fire detections
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const newFire: FireDetection = {
          id: `fire-${Date.now()}`,
          lat: 29.3 + Math.random() * 0.4,
          lng: 78.7 + Math.random() * 0.8,
          confidence: 70 + Math.random() * 30,
          temperature: 280 + Math.random() * 150,
          size: 0.5 + Math.random() * 3,
          satellite: ['INSAT-3D', 'INSAT-3DR', 'Cartosat-3'][Math.floor(Math.random() * 3)],
          detectionTime: new Date(),
          status: 'new',
          frp: 10 + Math.random() * 50
        };

        setFireDetections(prev => [newFire, ...prev.slice(0, 9)]); // Keep last 10
        setTotalDetections(prev => prev + 1);
        setActiveHotspots(prev => prev + 1);
      }

      // Update existing fire statuses
      setFireDetections(prev => prev.map(fire => ({
        ...fire,
        temperature: Math.max(250, fire.temperature + (Math.random() - 0.5) * 20),
        size: Math.max(0.1, fire.size + (Math.random() - 0.6) * 0.5),
        frp: Math.max(5, fire.frp + (Math.random() - 0.5) * 10)
      })));
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-red-600 bg-red-100';
      case 'confirmed': return 'text-orange-600 bg-orange-100';
      case 'monitoring': return 'text-yellow-600 bg-yellow-100';
      case 'contained': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const highConfidenceDetections = fireDetections.filter(fire => fire.confidence >= 85).length;
  const averageTemperature = Math.round(fireDetections.reduce((sum, fire) => sum + fire.temperature, 0) / fireDetections.length);

  return (
    <div className="card-primary space-component">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600 rounded-lg">
            <Flame className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-heading-3 font-bold text-white">Real-Time Fire Detection</h3>
            <p className="text-body-small text-slate-400">ISRO satellite thermal anomaly detection</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <div className="status-warning"></div>
            <span className="text-body-small font-semibold text-red-400">ACTIVE</span>
          </div>
          <p className="text-caption text-slate-400">Last scan: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Detection Statistics */}
      <div className="grid-responsive grid-1-2-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">{activeHotspots}</div>
          <div className="text-sm opacity-90">Active Hotspots</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">{highConfidenceDetections}</div>
          <div className="text-sm opacity-90">High Confidence</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">{averageTemperature}°C</div>
          <div className="text-sm opacity-90">Avg Temperature</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">{totalDetections}</div>
          <div className="text-sm opacity-90">Total Today</div>
        </motion.div>
      </div>

      {/* Fire Detection List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {fireDetections.map((fire, index) => (
          <motion.div
            key={fire.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <Target className="text-red-400" size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-white">Fire Detection #{fire.id.split('-')[1]}</h4>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <MapPin size={12} />
                    <span>{fire.lat.toFixed(4)}, {fire.lng.toFixed(4)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(fire.status)}`}>
                  {fire.status.toUpperCase()}
                </span>
                <span className={`text-sm font-bold ${getConfidenceColor(fire.confidence)}`}>
                  {fire.confidence}% confidence
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-slate-400">Temperature:</span>
                <div className="font-bold text-red-400">{fire.temperature}°C</div>
              </div>
              <div>
                <span className="text-slate-400">Size:</span>
                <div className="font-bold text-orange-400">{fire.size.toFixed(1)} km²</div>
              </div>
              <div>
                <span className="text-slate-400">FRP:</span>
                <div className="font-bold text-yellow-400">{fire.frp.toFixed(1)} MW</div>
              </div>
              <div>
                <span className="text-slate-400">Satellite:</span>
                <div className="font-bold text-blue-400">{fire.satellite}</div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-600">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock size={12} />
                  <span>Detected: {fire.detectionTime.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <Eye size={12} />
                  <span>Monitoring</span>
                </div>
              </div>
            </div>

            {/* Fire Intensity Indicator */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Fire Intensity</span>
                <span>{Math.round((fire.temperature - 250) / 200 * 100)}%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (fire.temperature - 250) / 200 * 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detection Algorithm Info */}
      <div className="mt-6 p-4 bg-red-900/30 rounded-lg border border-red-600">
        <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
          <Zap size={16} />
          ISRO Fire Detection Algorithm
        </h4>
        <div className="grid-responsive grid-1-2 text-sm text-red-200">
          <div>
            <p className="font-medium mb-1">🔥 Detection Method:</p>
            <ul className="space-y-1 text-xs">
              <li>• Thermal infrared anomaly detection</li>
              <li>• Contextual fire algorithm</li>
              <li>• Multi-temporal analysis</li>
              <li>• False alarm filtering</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">📊 Validation Criteria:</p>
            <ul className="space-y-1 text-xs">
              <li>• Temperature threshold: &gt;320K</li>
              <li>• Brightness temperature test</li>
              <li>• Contextual test with neighbors</li>
              <li>• Cloud and water masking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};