import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Activity, Thermometer, Wind, Droplets, Eye, Zap } from 'lucide-react';
import { RiskMap } from './RiskMap';
import { AlertPanel } from './AlertPanel';
import { FireSpreadSimulation } from './FireSpreadSimulation';
import { jimCorbettRegion, corbettEmergencyAlert, corbettWeatherData, corbettSensorNetwork } from '../data/uttarakhandPrototype';

export const UttarakhandPrototype: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('jim-corbett-core');
  const [realTimeData, setRealTimeData] = useState(corbettSensorNetwork);
  const [weatherData, setWeatherData] = useState(corbettWeatherData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => prev.map(sensor => ({
        ...sensor,
        lastReading: new Date(),
        data: {
          ...sensor.data,
          temperature: sensor.data.temperature + (Math.random() - 0.5) * 2,
          humidity: Math.max(5, sensor.data.humidity + (Math.random() - 0.5) * 3),
          windSpeed: Math.max(0, sensor.data.windSpeed + (Math.random() - 0.5) * 5),
          smokeDetection: Math.max(0, sensor.data.smokeDetection + (Math.random() - 0.5) * 0.01)
        }
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const selectedRegionData = jimCorbettRegion.find(r => r.id === selectedRegion);
  const criticalZones = jimCorbettRegion.filter(r => r.riskLevel === 'critical').length;
  const highRiskZones = jimCorbettRegion.filter(r => r.riskLevel === 'high').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-green-600 to-orange-600 rounded-xl">
                <MapPin className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Uttarakhand Forest Fire Prototype
                </h1>
                <p className="text-gray-600">Jim Corbett National Park & Kumaon Region</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-600">Fire Weather Index</p>
                <p className="font-bold text-red-600 text-xl">{weatherData.current.fireWeatherIndex}/100</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-semibold"
              >
                EXTREME FIRE DANGER
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Critical Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-4"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-600" size={20} />
              <div>
                <p className="text-xs text-gray-600">Critical Zones</p>
                <p className="text-xl font-bold text-red-600">{criticalZones}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-4"
          >
            <div className="flex items-center gap-2">
              <Thermometer className="text-orange-600" size={20} />
              <div>
                <p className="text-xs text-gray-600">Temperature</p>
                <p className="text-xl font-bold text-orange-600">{weatherData.current.temperature}°C</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-4"
          >
            <div className="flex items-center gap-2">
              <Droplets className="text-blue-600" size={20} />
              <div>
                <p className="text-xs text-gray-600">Humidity</p>
                <p className="text-xl font-bold text-blue-600">{weatherData.current.humidity}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-4"
          >
            <div className="flex items-center gap-2">
              <Wind className="text-green-600" size={20} />
              <div>
                <p className="text-xs text-gray-600">Wind Speed</p>
                <p className="text-xl font-bold text-green-600">{weatherData.current.windSpeed} km/h</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-4"
          >
            <div className="flex items-center gap-2">
              <Zap className="text-purple-600" size={20} />
              <div>
                <p className="text-xs text-gray-600">UV Index</p>
                <p className="text-xl font-bold text-purple-600">{weatherData.current.uvIndex}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Map and Sensors */}
          <div className="lg:col-span-2 space-y-8">
            {/* Interactive Map */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={24} className="text-green-600" />
                Uttarakhand Fire Risk Map (30m Resolution)
              </h2>
              <div className="h-96">
                <RiskMap
                  riskData={jimCorbettRegion}
                  selectedRegion={selectedRegion}
                  onRegionSelect={setSelectedRegion}
                />
              </div>
            </div>

            {/* Real-Time Sensor Network */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity size={24} className="text-blue-600" />
                Live Sensor Network
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {realTimeData.map((sensor) => (
                  <div key={sensor.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{sensor.location}</h4>
                      <div className={`w-3 h-3 rounded-full ${
                        sensor.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                      }`}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Temp:</span>
                        <span className="font-medium ml-1">{sensor.data.temperature?.toFixed(1)}°C</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Humidity:</span>
                        <span className="font-medium ml-1">{sensor.data.humidity?.toFixed(0)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Wind:</span>
                        <span className="font-medium ml-1">{sensor.data.windSpeed?.toFixed(0)} km/h</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Smoke:</span>
                        <span className={`font-medium ml-1 ${
                          sensor.data.smokeDetection > 0.05 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {sensor.data.smokeDetection?.toFixed(3)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Updated: {sensor.lastReading.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fire Spread Simulation */}
            <FireSpreadSimulation
              predictions={corbettEmergencyAlert.predictions}
              location="Jim Corbett National Park"
            />
          </div>

          {/* Right Column - Alerts */}
          <div className="space-y-8">
            <AlertPanel
              alerts={[corbettEmergencyAlert]}
              onAcknowledge={() => {}}
            />

            {/* Wildlife Impact Assessment */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Wildlife Impact Assessment</h3>
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="font-semibold text-orange-900">🐅 Tiger Population at Risk</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Estimated 12-15 tigers in fire spread zone. Emergency relocation protocols activated.
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h4 className="font-semibold text-red-900">🐘 Elephant Corridors</h4>
                  <p className="text-sm text-red-700 mt-1">
                    2 major elephant corridors blocked. Alternative routes identified for safe passage.
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900">🦌 Deer & Small Mammals</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Large herbivore populations moving toward Ramganga river. Natural fire escape behavior observed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prototype Features */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-2">🎯 Prototype Features</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Real-time sensor network simulation</li>
                <li>• Wildlife impact assessment</li>
                <li>• Tourism evacuation planning</li>
                <li>• Multi-zone risk analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">📍 Focus Areas</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Jim Corbett National Park</li>
                <li>• Nainital hill station</li>
                <li>• Ramnagar urban interface</li>
                <li>• Kumaon forest division</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">⚡ Enhanced Capabilities</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• 5-second sensor updates</li>
                <li>• Wildlife behavior integration</li>
                <li>• Tourism impact modeling</li>
                <li>• Multi-hazard assessment</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};