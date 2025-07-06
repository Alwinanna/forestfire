import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation, MapPin, Clock, Users, AlertTriangle, Route, Car, Truck, Plane } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface EvacuationRoute {
  id: string;
  name: string;
  startPoint: { lat: number; lng: number; name: string };
  endPoint: { lat: number; lng: number; name: string };
  waypoints: { lat: number; lng: number }[];
  distance: number;
  estimatedTime: number;
  capacity: number;
  currentLoad: number;
  status: 'clear' | 'congested' | 'blocked';
  transportMode: 'walking' | 'vehicle' | 'helicopter';
  priority: 'high' | 'medium' | 'low';
  safetyLevel: number;
}

interface SafeZone {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  capacity: number;
  currentOccupancy: number;
  facilities: string[];
  contactNumber: string;
  status: 'available' | 'full' | 'emergency_only';
}

export const EvacuationRoutes: React.FC = () => {
  const [evacuationRoutes, setEvacuationRoutes] = useState<EvacuationRoute[]>([
    {
      id: 'route-001',
      name: 'Jim Corbett to Ramnagar Emergency Route',
      startPoint: { lat: 29.5319, lng: 78.7718, name: 'Jim Corbett Core Zone' },
      endPoint: { lat: 29.3947, lng: 79.1314, name: 'Ramnagar Safe Zone' },
      waypoints: [
        { lat: 29.5200, lng: 78.8000 },
        { lat: 29.4800, lng: 78.9000 },
        { lat: 29.4200, lng: 79.0500 }
      ],
      distance: 45.2,
      estimatedTime: 65,
      capacity: 2000,
      currentLoad: 450,
      status: 'clear',
      transportMode: 'vehicle',
      priority: 'high',
      safetyLevel: 95
    },
    {
      id: 'route-002',
      name: 'Nainital Hill Station Evacuation',
      startPoint: { lat: 29.3919, lng: 79.4542, name: 'Nainital Mall Road' },
      endPoint: { lat: 29.3500, lng: 79.3000, name: 'Haldwani Relief Center' },
      waypoints: [
        { lat: 29.3800, lng: 79.4000 },
        { lat: 29.3700, lng: 79.3500 },
        { lat: 29.3600, lng: 79.3200 }
      ],
      distance: 32.8,
      estimatedTime: 45,
      capacity: 3000,
      currentLoad: 1200,
      status: 'congested',
      transportMode: 'vehicle',
      priority: 'high',
      safetyLevel: 88
    },
    {
      id: 'route-003',
      name: 'Helicopter Evacuation Route',
      startPoint: { lat: 29.5000, lng: 78.8500, name: 'Dhikala Helipad' },
      endPoint: { lat: 29.4500, lng: 79.2000, name: 'Haldwani Airport' },
      waypoints: [],
      distance: 25.0,
      estimatedTime: 15,
      capacity: 50,
      currentLoad: 12,
      status: 'clear',
      transportMode: 'helicopter',
      priority: 'high',
      safetyLevel: 98
    }
  ]);

  const [safeZones, setSafeZones] = useState<SafeZone[]>([
    {
      id: 'safe-001',
      name: 'Ramnagar Emergency Relief Center',
      coordinates: { lat: 29.3947, lng: 79.1314 },
      capacity: 5000,
      currentOccupancy: 1200,
      facilities: ['Medical Aid', 'Food & Water', 'Shelter', 'Communication'],
      contactNumber: '+91-5947-251234',
      status: 'available'
    },
    {
      id: 'safe-002',
      name: 'Haldwani District Headquarters',
      coordinates: { lat: 29.2183, lng: 79.5130 },
      capacity: 8000,
      currentOccupancy: 2800,
      facilities: ['Hospital', 'Food Distribution', 'Temporary Housing', 'Transport Hub'],
      contactNumber: '+91-5946-235678',
      status: 'available'
    },
    {
      id: 'safe-003',
      name: 'Dehradun Emergency Campus',
      coordinates: { lat: 30.3165, lng: 78.0322 },
      capacity: 10000,
      currentOccupancy: 3500,
      facilities: ['Medical Center', 'Food Court', 'Dormitories', 'Helicopter Landing'],
      contactNumber: '+91-135-2715432',
      status: 'available'
    }
  ]);

  const getRouteColor = (status: string) => {
    switch (status) {
      case 'clear': return '#10b981';
      case 'congested': return '#f59e0b';
      case 'blocked': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'vehicle': return Car;
      case 'helicopter': return Plane;
      case 'walking': return Users;
      default: return Navigation;
    }
  };

  const openGoogleMapsRoute = (route: EvacuationRoute) => {
    const start = `${route.startPoint.lat},${route.startPoint.lng}`;
    const end = `${route.endPoint.lat},${route.endPoint.lng}`;
    const waypoints = route.waypoints.map(wp => `${wp.lat},${wp.lng}`).join('|');
    
    const googleMapsUrl = `https://www.google.com/maps/dir/${start}/${end}${waypoints ? `/${waypoints}` : ''}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-emergency space-component text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Navigation className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-heading-2 font-bold">🚨 EVACUATION ROUTES</h2>
              <p className="text-body-small text-red-100">Real-time evacuation guidance with Google Maps integration</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{evacuationRoutes.length}</div>
            <p className="text-caption text-red-200">Active Routes</p>
          </div>
        </div>
      </div>

      {/* Route Status Overview */}
      <div className="grid-responsive grid-1-2-3">
        {evacuationRoutes.map((route, index) => {
          const TransportIcon = getTransportIcon(route.transportMode);
          const loadPercentage = (route.currentLoad / route.capacity) * 100;
          
          return (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-primary space-component"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <TransportIcon className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{route.name}</h3>
                    <p className="text-sm text-slate-400">{route.distance} km • {route.estimatedTime} min</p>
                  </div>
                </div>
                <span 
                  className="px-2 py-1 rounded text-xs font-bold text-white"
                  style={{ backgroundColor: getRouteColor(route.status) }}
                >
                  {route.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">From:</span>
                  <span className="text-white font-medium">{route.startPoint.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">To:</span>
                  <span className="text-white font-medium">{route.endPoint.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Capacity:</span>
                  <span className="text-white font-medium">{route.currentLoad}/{route.capacity}</span>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Route Load</span>
                  <span>{loadPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <motion.div 
                    className={`h-2 rounded-full ${
                      loadPercentage > 80 ? 'bg-red-500' : 
                      loadPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${loadPercentage}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => openGoogleMapsRoute(route)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin size={16} />
                  Open in Google Maps
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors">
                    Share Route
                  </button>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors">
                    Report Issue
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Map */}
      <div className="card-primary space-component">
        <h3 className="text-heading-3 font-bold text-white mb-4">Live Evacuation Map</h3>
        <div className="h-96 rounded-lg overflow-hidden">
          <MapContainer
            center={[29.4, 79.0]}
            zoom={9}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            {/* Evacuation Routes */}
            {evacuationRoutes.map((route) => (
              <Polyline
                key={route.id}
                positions={[
                  [route.startPoint.lat, route.startPoint.lng],
                  ...route.waypoints.map(wp => [wp.lat, wp.lng] as [number, number]),
                  [route.endPoint.lat, route.endPoint.lng]
                ]}
                pathOptions={{
                  color: getRouteColor(route.status),
                  weight: 5,
                  opacity: 0.8
                }}
              />
            ))}

            {/* Safe Zones */}
            {safeZones.map((zone) => (
              <Marker
                key={zone.id}
                position={[zone.coordinates.lat, zone.coordinates.lng]}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold">{zone.name}</h4>
                    <p className="text-sm">Capacity: {zone.currentOccupancy}/{zone.capacity}</p>
                    <p className="text-sm">Contact: {zone.contactNumber}</p>
                    <div className="mt-2">
                      {zone.facilities.map((facility, idx) => (
                        <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Safe Zones */}
      <div className="card-primary space-component">
        <h3 className="text-heading-3 font-bold text-white mb-4">Emergency Safe Zones</h3>
        <div className="grid-responsive grid-1-2-3">
          {safeZones.map((zone, index) => {
            const occupancyPercentage = (zone.currentOccupancy / zone.capacity) * 100;
            
            return (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-white">{zone.name}</h4>
                    <p className="text-sm text-slate-400">Contact: {zone.contactNumber}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    zone.status === 'available' ? 'bg-green-100 text-green-800' :
                    zone.status === 'full' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {zone.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Occupancy:</span>
                    <span className="text-white font-medium">{zone.currentOccupancy}/{zone.capacity}</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <motion.div 
                      className={`h-2 rounded-full ${
                        occupancyPercentage > 90 ? 'bg-red-500' : 
                        occupancyPercentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${occupancyPercentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-slate-400">Available Facilities:</p>
                  <div className="flex flex-wrap gap-1">
                    {zone.facilities.map((facility, idx) => (
                      <span key={idx} className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-xs font-semibold transition-colors">
                    Get Directions
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-xs font-semibold transition-colors">
                    Call Center
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Emergency Instructions */}
      <div className="card-emergency space-component text-white">
        <h3 className="text-heading-3 font-bold mb-4">🚨 EVACUATION INSTRUCTIONS</h3>
        <div className="grid-responsive grid-1-2-3">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle size={16} />
              Immediate Actions
            </h4>
            <ul className="space-y-1 text-sm text-red-100">
              <li>• Stay calm and follow official instructions</li>
              <li>• Take essential documents and medicines</li>
              <li>• Use designated evacuation routes only</li>
              <li>• Help elderly, children, and disabled persons</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Route size={16} />
              Route Selection
            </h4>
            <ul className="space-y-1 text-sm text-red-100">
              <li>• Choose routes marked as "CLEAR"</li>
              <li>• Avoid congested or blocked routes</li>
              <li>• Follow traffic control personnel</li>
              <li>• Report route conditions to authorities</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Users size={16} />
              At Safe Zones
            </h4>
            <ul className="space-y-1 text-sm text-red-100">
              <li>• Register at reception immediately</li>
              <li>• Follow camp rules and regulations</li>
              <li>• Inform family about your safety</li>
              <li>• Cooperate with relief personnel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};