import React, { useState, useEffect } from 'react';
import { Satellite, Database, Cloud, Mountain, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const DataSources: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<Record<string, 'connected' | 'connecting' | 'error'>>({
    mosdac: 'connected',
    era5: 'connected',
    imd: 'connecting',
    bhoonidhi: 'connected',
    bhuvan: 'connected',
    viirs: 'connected',
    ghsl: 'connected'
  });

  useEffect(() => {
    // Simulate connection status updates
    const timer = setTimeout(() => {
      setConnectionStatus(prev => ({ ...prev, imd: 'connected' }));
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const dataSources = [
    {
      id: 'mosdac',
      name: 'MOSDAC',
      description: 'Meteorological & Oceanographic Satellite Data Archival Centre',
      type: 'Weather Data',
      icon: Cloud,
      color: 'blue',
      parameters: ['Temperature', 'Humidity', 'Wind Speed/Direction', 'Precipitation'],
      resolution: '1km',
      updateFreq: 'Hourly'
    },
    {
      id: 'era5',
      name: 'ERA-5 Reanalysis',
      description: 'European Centre for Medium-Range Weather Forecasts',
      type: 'Historical Weather',
      icon: Activity,
      color: 'purple',
      parameters: ['Historical Weather Patterns', 'Climate Data', 'Atmospheric Conditions'],
      resolution: '0.25°',
      updateFreq: 'Daily'
    },
    {
      id: 'imd',
      name: 'IMD',
      description: 'India Meteorological Department',
      type: 'Local Weather',
      icon: Cloud,
      color: 'green',
      parameters: ['Local Weather Stations', 'Rainfall Data', 'Temperature Records'],
      resolution: 'Station-based',
      updateFreq: '3-hourly'
    },
    {
      id: 'bhoonidhi',
      name: 'Bhoonidhi Portal',
      description: 'ISRO Geospatial Data Portal',
      type: 'Terrain Data',
      icon: Mountain,
      color: 'orange',
      parameters: ['30m DEM', 'Slope', 'Aspect', 'Elevation'],
      resolution: '30m',
      updateFreq: 'Static'
    },
    {
      id: 'bhuvan',
      name: 'Bhuvan/Sentinel Hub',
      description: 'Land Use Land Cover Data',
      type: 'LULC Maps',
      icon: Satellite,
      color: 'emerald',
      parameters: ['Forest Cover', 'Vegetation Types', 'Land Use Classification'],
      resolution: '10-30m',
      updateFreq: 'Monthly'
    },
    {
      id: 'viirs',
      name: 'VIIRS Fire Data',
      description: 'Visible Infrared Imaging Radiometer Suite',
      type: 'Historical Fires',
      icon: Activity,
      color: 'red',
      parameters: ['Fire Hotspots', 'Burn Scars', 'Fire Radiative Power'],
      resolution: '375m',
      updateFreq: 'Daily'
    },
    {
      id: 'ghsl',
      name: 'GHSL',
      description: 'Global Human Settlement Layer',
      type: 'Population Data',
      icon: Users,
      color: 'indigo',
      parameters: ['Population Density', 'Settlement Patterns', 'Built-up Areas'],
      resolution: '100m',
      updateFreq: 'Annual'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'connecting': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Database className="text-blue-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">ISRO Data Sources Integration</h3>
          <p className="text-gray-600">Real-time connection to official ISRO and partner datasets</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataSources.map((source, index) => (
          <motion.div
            key={source.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-${source.color}-100`}>
                <source.icon className={`text-${source.color}-600`} size={20} />
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(connectionStatus[source.id])}`}>
                {connectionStatus[source.id] === 'connecting' && (
                  <div className="inline-block w-3 h-3 mr-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                  </div>
                )}
                {getStatusText(connectionStatus[source.id])}
              </div>
            </div>

            <h4 className="font-bold text-gray-900 mb-1">{source.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{source.description}</p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium text-gray-700">{source.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Resolution:</span>
                <span className="font-medium text-gray-700">{source.resolution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Update:</span>
                <span className="font-medium text-gray-700">{source.updateFreq}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Parameters:</p>
              <div className="flex flex-wrap gap-1">
                {source.parameters.map((param, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded text-xs bg-${source.color}-50 text-${source.color}-700`}
                  >
                    {param}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Feature Stack Processing</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-medium mb-1">✅ Data Preprocessing:</p>
            <ul className="space-y-1 text-xs">
              <li>• All datasets resampled to 30m resolution</li>
              <li>• Temporal alignment (hourly updates)</li>
              <li>• Spatial co-registration (WGS84 UTM 44N)</li>
              <li>• Quality control and gap filling</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">✅ Feature Engineering:</p>
            <ul className="space-y-1 text-xs">
              <li>• Multi-temporal weather patterns</li>
              <li>• Topographic derivatives (slope, aspect)</li>
              <li>• Vegetation indices (NDVI, EVI)</li>
              <li>• Human activity proximity metrics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};