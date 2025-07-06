import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Activity, Zap, Eye, Signal, Globe, MapPin, Clock } from 'lucide-react';

interface SatelliteData {
  name: string;
  type: string;
  status: 'active' | 'maintenance' | 'offline';
  coverage: string;
  resolution: string;
  lastPass: Date;
  nextPass: Date;
  dataQuality: number;
  fireDetections: number;
  coordinates: { lat: number; lng: number };
}

export const ISROSatelliteMonitor: React.FC = () => {
  const [satellites, setSatellites] = useState<SatelliteData[]>([
    {
      name: 'INSAT-3D',
      type: 'Meteorological',
      status: 'active',
      coverage: 'Indian Subcontinent',
      resolution: '1km (Thermal), 4km (Visible)',
      lastPass: new Date(Date.now() - 1800000), // 30 min ago
      nextPass: new Date(Date.now() + 5400000), // 90 min from now
      dataQuality: 98,
      fireDetections: 23,
      coordinates: { lat: 29.5, lng: 78.8 }
    },
    {
      name: 'INSAT-3DR',
      type: 'Meteorological',
      status: 'active',
      coverage: 'Indian Ocean Region',
      resolution: '1km (Thermal), 1km (Visible)',
      lastPass: new Date(Date.now() - 2700000), // 45 min ago
      nextPass: new Date(Date.now() + 3600000), // 60 min from now
      dataQuality: 95,
      fireDetections: 18,
      coordinates: { lat: 29.3, lng: 79.4 }
    },
    {
      name: 'Cartosat-3',
      type: 'Earth Observation',
      status: 'active',
      coverage: 'Global',
      resolution: '0.25m (Panchromatic)',
      lastPass: new Date(Date.now() - 3600000), // 1 hour ago
      nextPass: new Date(Date.now() + 7200000), // 2 hours from now
      dataQuality: 99,
      fireDetections: 5,
      coordinates: { lat: 29.6, lng: 78.9 }
    },
    {
      name: 'RISAT-2B',
      type: 'Radar Imaging',
      status: 'active',
      coverage: 'All Weather',
      resolution: '1m (Spotlight Mode)',
      lastPass: new Date(Date.now() - 5400000), // 90 min ago
      nextPass: new Date(Date.now() + 1800000), // 30 min from now
      dataQuality: 92,
      fireDetections: 12,
      coordinates: { lat: 29.4, lng: 79.1 }
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate real-time data updates
      setSatellites(prev => prev.map(sat => ({
        ...sat,
        dataQuality: Math.max(85, sat.dataQuality + (Math.random() - 0.5) * 2),
        fireDetections: Math.max(0, sat.fireDetections + Math.floor((Math.random() - 0.7) * 3))
      })));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-100';
      case 'maintenance': return 'text-yellow-500 bg-yellow-100';
      case 'offline': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const totalFireDetections = satellites.reduce((sum, sat) => sum + sat.fireDetections, 0);
  const averageDataQuality = Math.round(satellites.reduce((sum, sat) => sum + sat.dataQuality, 0) / satellites.length);
  const activeSatellites = satellites.filter(sat => sat.status === 'active').length;

  return (
    <div className="card-primary space-component">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Satellite className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-heading-2 font-bold text-white">ISRO Satellite Network</h2>
            <p className="text-body-small text-slate-400">Real-time forest fire monitoring constellation</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <div className="status-online"></div>
            <span className="text-body-small font-semibold text-emerald-400">LIVE</span>
          </div>
          <p className="text-caption text-slate-400">{currentTime.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Network Statistics */}
      <div className="grid-responsive grid-1-2-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">{activeSatellites}</div>
          <div className="text-sm opacity-90">Active Satellites</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">{totalFireDetections}</div>
          <div className="text-sm opacity-90">Fire Detections</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">{averageDataQuality}%</div>
          <div className="text-sm opacity-90">Data Quality</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">24/7</div>
          <div className="text-sm opacity-90">Coverage</div>
        </motion.div>
      </div>

      {/* Satellite Details */}
      <div className="grid-responsive grid-1-2">
        {satellites.map((satellite, index) => (
          <motion.div
            key={satellite.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Satellite className="text-blue-400" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{satellite.name}</h3>
                  <p className="text-sm text-slate-400">{satellite.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(satellite.status)}`}>
                {satellite.status.toUpperCase()}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Coverage:</span>
                <span className="text-white font-medium">{satellite.coverage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Resolution:</span>
                <span className="text-white font-medium">{satellite.resolution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Data Quality:</span>
                <span className="text-green-400 font-medium">{satellite.dataQuality.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fire Detections:</span>
                <span className="text-red-400 font-medium">{satellite.fireDetections}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-600">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock size={12} />
                  <span>Last: {satellite.lastPass.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <Zap size={12} />
                  <span>Next: {satellite.nextPass.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Data Quality Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Signal Strength</span>
                <span>{satellite.dataQuality.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${satellite.dataQuality}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Technical Specifications */}
      <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-600">
        <h4 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
          <Globe size={16} />
          ISRO Forest Fire Detection Capabilities
        </h4>
        <div className="grid-responsive grid-1-2-3 text-sm text-blue-200">
          <div>
            <p className="font-medium mb-1">🛰️ Multi-spectral Imaging:</p>
            <ul className="space-y-1 text-xs">
              <li>• Thermal Infrared (3.7-12 μm)</li>
              <li>• Near Infrared (0.85-0.88 μm)</li>
              <li>• Visible (0.55-0.75 μm)</li>
              <li>• SWIR (1.55-1.75 μm)</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">🔥 Fire Detection Algorithm:</p>
            <ul className="space-y-1 text-xs">
              <li>• Contextual fire detection</li>
              <li>• False alarm filtering</li>
              <li>• Sub-pixel fire detection</li>
              <li>• Fire radiative power</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">📡 Data Processing:</p>
            <ul className="space-y-1 text-xs">
              <li>• Real-time processing</li>
              <li>• Geometric correction</li>
              <li>• Radiometric calibration</li>
              <li>• Cloud masking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};