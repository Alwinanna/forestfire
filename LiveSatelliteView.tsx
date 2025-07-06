import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Eye, Zap, MapPin, Clock, Download, Share2, Maximize } from 'lucide-react';

interface SatelliteImage {
  id: string;
  satellite: string;
  timestamp: Date;
  coordinates: { lat: number; lng: number };
  resolution: string;
  band: string;
  imageUrl: string;
  fireDetected: boolean;
  confidence: number;
  temperature?: number;
}

export const LiveSatelliteView: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string }>({
    lat: 29.5319,
    lng: 78.7718,
    name: 'Jim Corbett National Park'
  });

  const [satelliteImages, setSatelliteImages] = useState<SatelliteImage[]>([
    {
      id: 'img-001',
      satellite: 'INSAT-3D',
      timestamp: new Date(Date.now() - 300000), // 5 min ago
      coordinates: { lat: 29.5319, lng: 78.7718 },
      resolution: '1km',
      band: 'Thermal Infrared',
      imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
      fireDetected: true,
      confidence: 95,
      temperature: 387
    },
    {
      id: 'img-002',
      satellite: 'Cartosat-3',
      timestamp: new Date(Date.now() - 600000), // 10 min ago
      coordinates: { lat: 29.3919, lng: 79.4542 },
      resolution: '0.25m',
      band: 'Visible',
      imageUrl: 'https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=800&h=600&fit=crop',
      fireDetected: false,
      confidence: 78,
    },
    {
      id: 'img-003',
      satellite: 'RISAT-2B',
      timestamp: new Date(Date.now() - 900000), // 15 min ago
      coordinates: { lat: 29.4500, lng: 79.2000 },
      resolution: '1m',
      band: 'SAR',
      imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&h=600&fit=crop',
      fireDetected: true,
      confidence: 87,
      temperature: 342
    }
  ]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SatelliteImage>(satelliteImages[0]);

  // Simulate real-time satellite data updates
  useEffect(() => {
    const timer = setInterval(() => {
      // Add new satellite image every 30 seconds
      const newImage: SatelliteImage = {
        id: `img-${Date.now()}`,
        satellite: ['INSAT-3D', 'Cartosat-3', 'RISAT-2B'][Math.floor(Math.random() * 3)],
        timestamp: new Date(),
        coordinates: {
          lat: selectedLocation.lat + (Math.random() - 0.5) * 0.1,
          lng: selectedLocation.lng + (Math.random() - 0.5) * 0.1
        },
        resolution: ['1km', '0.25m', '1m'][Math.floor(Math.random() * 3)],
        band: ['Thermal Infrared', 'Visible', 'SAR'][Math.floor(Math.random() * 3)],
        imageUrl: [
          'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&h=600&fit=crop'
        ][Math.floor(Math.random() * 3)],
        fireDetected: Math.random() > 0.6,
        confidence: 70 + Math.random() * 30,
        temperature: Math.random() > 0.5 ? 280 + Math.random() * 150 : undefined
      };

      setSatelliteImages(prev => [newImage, ...prev.slice(0, 9)]); // Keep last 10 images
    }, 30000);

    return () => clearInterval(timer);
  }, [selectedLocation]);

  const locations = [
    { lat: 29.5319, lng: 78.7718, name: 'Jim Corbett National Park' },
    { lat: 29.3919, lng: 79.4542, name: 'Nainital Hill Station' },
    { lat: 29.4500, lng: 79.2000, name: 'Kaladhungi Forest' },
    { lat: 30.3165, lng: 78.0322, name: 'Dehradun Region' }
  ];

  const openGoogleEarth = () => {
    const earthUrl = `https://earth.google.com/web/@${selectedLocation.lat},${selectedLocation.lng},1000a,1000d,35y,0h,0t,0r`;
    window.open(earthUrl, '_blank');
  };

  const downloadImage = (image: SatelliteImage) => {
    // In a real implementation, this would download the actual satellite image
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = `satellite_${image.satellite}_${image.timestamp.toISOString()}.jpg`;
    link.click();
  };

  const shareImage = (image: SatelliteImage) => {
    if (navigator.share) {
      navigator.share({
        title: `Satellite Image - ${image.satellite}`,
        text: `Fire detection: ${image.fireDetected ? 'YES' : 'NO'} | Confidence: ${image.confidence.toFixed(1)}%`,
        url: image.imageUrl
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(image.imageUrl);
      alert('Image URL copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-primary space-component">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Satellite className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-heading-2 font-bold text-white">🛰️ LIVE SATELLITE VIEW</h2>
              <p className="text-body-small text-slate-400">Real-time ISRO satellite imagery and fire detection</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={openGoogleEarth}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Eye size={16} />
              Google Earth
            </button>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <div className="status-online"></div>
                <span className="text-body-small font-semibold text-emerald-400">LIVE</span>
              </div>
              <p className="text-caption text-slate-400">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        {/* Location Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">Select Location</label>
          <select
            value={`${selectedLocation.lat},${selectedLocation.lng}`}
            onChange={(e) => {
              const [lat, lng] = e.target.value.split(',').map(Number);
              const location = locations.find(l => l.lat === lat && l.lng === lng);
              if (location) setSelectedLocation(location);
            }}
            className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {locations.map((location) => (
              <option key={`${location.lat},${location.lng}`} value={`${location.lat},${location.lng}`}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Satellite View */}
      <div className="card-primary space-component">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-heading-3 font-bold text-white">Current Satellite View - {selectedLocation.name}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="bg-slate-600 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize size={16} />
            </button>
          </div>
        </div>

        <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-4' : 'h-96'} rounded-lg overflow-hidden`}>
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
            >
              ✕
            </button>
          )}
          
          <img
            src={selectedImage.imageUrl}
            alt={`Satellite view from ${selectedImage.satellite}`}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Information */}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Satellite size={16} className="text-blue-400" />
              <span className="font-semibold">{selectedImage.satellite}</span>
            </div>
            <div className="space-y-1 text-sm">
              <div>Resolution: {selectedImage.resolution}</div>
              <div>Band: {selectedImage.band}</div>
              <div>Time: {selectedImage.timestamp.toLocaleTimeString()}</div>
              <div className="flex items-center gap-2">
                <span>Fire Detected:</span>
                <span className={selectedImage.fireDetected ? 'text-red-400 font-bold' : 'text-green-400'}>
                  {selectedImage.fireDetected ? 'YES' : 'NO'}
                </span>
              </div>
              {selectedImage.fireDetected && selectedImage.temperature && (
                <div className="text-red-400 font-bold">
                  Temperature: {selectedImage.temperature}°C
                </div>
              )}
            </div>
          </div>

          {/* Fire Detection Overlay */}
          {selectedImage.fireDetected && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-8 h-8 border-4 border-red-500 rounded-full bg-red-500/30"
              />
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                FIRE DETECTED
              </div>
            </div>
          )}
        </div>

        {/* Image Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Confidence:</span>
            <div className="w-32 bg-slate-600 rounded-full h-2">
              <motion.div 
                className={`h-2 rounded-full ${
                  selectedImage.confidence > 90 ? 'bg-green-500' :
                  selectedImage.confidence > 75 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${selectedImage.confidence}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <span className="text-sm font-bold text-white">{selectedImage.confidence.toFixed(1)}%</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadImage(selectedImage)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
              title="Download Image"
            >
              <Download size={16} />
            </button>
            <button
              onClick={() => shareImage(selectedImage)}
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
              title="Share Image"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Satellite Images */}
      <div className="card-primary space-component">
        <h3 className="text-heading-3 font-bold text-white mb-4">Recent Satellite Images</h3>
        <div className="grid-responsive grid-1-2-3">
          {satelliteImages.slice(0, 6).map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-700/50 rounded-lg p-3 border cursor-pointer transition-all ${
                selectedImage.id === image.id ? 'border-blue-500 bg-blue-900/20' : 'border-slate-600 hover:border-slate-500'
              }`}
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative mb-3">
                <img
                  src={image.imageUrl}
                  alt={`${image.satellite} satellite image`}
                  className="w-full h-32 object-cover rounded"
                />
                {image.fireDetected && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    FIRE
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{image.satellite}</span>
                  <span className="text-xs text-slate-400">{image.resolution}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={12} className="text-slate-400" />
                  <span className="text-slate-300">{image.timestamp.toLocaleTimeString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={12} className="text-slate-400" />
                  <span className="text-slate-300">
                    {image.coordinates.lat.toFixed(3)}, {image.coordinates.lng.toFixed(3)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Confidence:</span>
                  <span className={`font-bold ${
                    image.confidence > 90 ? 'text-green-400' :
                    image.confidence > 75 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {image.confidence.toFixed(1)}%
                  </span>
                </div>
                
                {image.temperature && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Temperature:</span>
                    <span className="font-bold text-red-400">{image.temperature}°C</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Satellite Coverage Info */}
      <div className="card-primary space-component">
        <h3 className="text-heading-3 font-bold text-white mb-4">ISRO Satellite Coverage</h3>
        <div className="grid-responsive grid-1-2-3">
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
            <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <Satellite size={16} />
              INSAT-3D
            </h4>
            <ul className="space-y-1 text-sm text-blue-200">
              <li>• Geostationary orbit</li>
              <li>• 1km thermal resolution</li>
              <li>• 15-minute refresh rate</li>
              <li>• Weather monitoring</li>
            </ul>
          </div>
          
          <div className="bg-green-900/30 rounded-lg p-4 border border-green-600">
            <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
              <Eye size={16} />
              Cartosat-3
            </h4>
            <ul className="space-y-1 text-sm text-green-200">
              <li>• 0.25m resolution</li>
              <li>• High-resolution imaging</li>
              <li>• Daily revisit capability</li>
              <li>• Detailed fire mapping</li>
            </ul>
          </div>
          
          <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-600">
            <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
              <Zap size={16} />
              RISAT-2B
            </h4>
            <ul className="space-y-1 text-sm text-purple-200">
              <li>• All-weather SAR imaging</li>
              <li>• 1m resolution</li>
              <li>• Day/night capability</li>
              <li>• Cloud penetration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};