import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, 
  Clock, 
  Users, 
  AlertTriangle, 
  MapPin, 
  Route, 
  Timer, 
  Shield,
  Zap,
  Activity,
  Target,
  CheckCircle,
  XCircle,
  ArrowRight,
  Phone,
  Radio,
  Truck,
  Helicopter,
  Car,
  PersonStanding as Walking
} from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface EvacuationRoute {
  id: string;
  name: string;
  path: { lat: number; lng: number }[];
  safetyWindow: {
    hours: number;
    status: 'safe' | 'warning' | 'critical' | 'unsafe';
    fireArrivalETA: number; // minutes
    evacuationTime: number; // minutes
    safetyMargin: number; // minutes
  };
  capacity: number;
  currentLoad: number;
  transportMode: 'walking' | 'vehicle' | 'helicopter';
  difficulty: 'easy' | 'moderate' | 'difficult';
  infrastructure: {
    bridges: number;
    shelters: number;
    medicalPosts: number;
    communicationTowers: number;
  };
  weatherImpact: 'none' | 'low' | 'moderate' | 'high';
  lastUpdated: Date;
}

interface FireZone {
  id: string;
  center: { lat: number; lng: number };
  radius: number;
  intensity: number;
  spreadDirection: number;
  spreadSpeed: number; // km/h
  timeToReach: { [routeId: string]: number }; // minutes
  confidence: number;
}

interface EvacuationCenter {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  capacity: number;
  currentOccupancy: number;
  facilities: string[];
  status: 'operational' | 'full' | 'evacuating';
  estimatedArrivalTime: number;
  resources: {
    medical: boolean;
    food: boolean;
    shelter: boolean;
    communication: boolean;
    transport: boolean;
  };
}

export const EvacuationCommandCenter: React.FC = () => {
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState<1 | 2 | 3 | 6 | 12 | 24>(1);
  const [evacuationRoutes, setEvacuationRoutes] = useState<EvacuationRoute[]>([]);
  const [fireZones, setFireZones] = useState<FireZone[]>([]);
  const [evacuationCenters, setEvacuationCenters] = useState<EvacuationCenter[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Initialize data
  useEffect(() => {
    initializeEvacuationData();
    
    if (realTimeUpdates) {
      const interval = setInterval(() => {
        updateFireProgression();
        updateRouteStatuses();
        setLastUpdate(new Date());
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [realTimeUpdates, selectedTimeHorizon]);

  const initializeEvacuationData = () => {
    // Initialize evacuation routes with real-world data
    const routes: EvacuationRoute[] = [
      {
        id: 'route-corbett-ramnagar',
        name: 'Jim Corbett Core → Ramnagar Emergency Route',
        path: [
          { lat: 29.5319, lng: 78.7718 }, // Jim Corbett Core
          { lat: 29.5200, lng: 78.8000 },
          { lat: 29.4800, lng: 78.9000 },
          { lat: 29.4200, lng: 79.0500 },
          { lat: 29.3947, lng: 79.1314 }  // Ramnagar
        ],
        safetyWindow: calculateSafetyWindow(45, selectedTimeHorizon),
        capacity: 2000,
        currentLoad: 450,
        transportMode: 'vehicle',
        difficulty: 'moderate',
        infrastructure: {
          bridges: 3,
          shelters: 5,
          medicalPosts: 2,
          communicationTowers: 4
        },
        weatherImpact: 'low',
        lastUpdated: new Date()
      },
      {
        id: 'route-nainital-haldwani',
        name: 'Nainital Hills → Haldwani Safe Corridor',
        path: [
          { lat: 29.3919, lng: 79.4542 }, // Nainital
          { lat: 29.3800, lng: 79.4000 },
          { lat: 29.3600, lng: 79.3500 },
          { lat: 29.3400, lng: 79.3000 },
          { lat: 29.2183, lng: 79.5130 }  // Haldwani
        ],
        safetyWindow: calculateSafetyWindow(35, selectedTimeHorizon),
        capacity: 3000,
        currentLoad: 1200,
        transportMode: 'vehicle',
        difficulty: 'easy',
        infrastructure: {
          bridges: 2,
          shelters: 8,
          medicalPosts: 3,
          communicationTowers: 6
        },
        weatherImpact: 'none',
        lastUpdated: new Date()
      },
      {
        id: 'route-helicopter-evacuation',
        name: 'Emergency Helicopter Evacuation Corridor',
        path: [
          { lat: 29.5000, lng: 78.8500 }, // Dhikala Helipad
          { lat: 29.4500, lng: 79.0000 },
          { lat: 29.4000, lng: 79.1500 },
          { lat: 29.3500, lng: 79.3000 },
          { lat: 29.2183, lng: 79.5130 }  // Haldwani Airport
        ],
        safetyWindow: calculateSafetyWindow(15, selectedTimeHorizon),
        capacity: 200,
        currentLoad: 45,
        transportMode: 'helicopter',
        difficulty: 'easy',
        infrastructure: {
          bridges: 0,
          shelters: 2,
          medicalPosts: 1,
          communicationTowers: 3
        },
        weatherImpact: 'moderate',
        lastUpdated: new Date()
      },
      {
        id: 'route-forest-trail',
        name: 'Emergency Forest Trail (Walking)',
        path: [
          { lat: 29.5100, lng: 78.7900 },
          { lat: 29.5000, lng: 78.8200 },
          { lat: 29.4900, lng: 78.8500 },
          { lat: 29.4800, lng: 78.8800 },
          { lat: 29.4700, lng: 78.9100 }
        ],
        safetyWindow: calculateSafetyWindow(120, selectedTimeHorizon),
        capacity: 500,
        currentLoad: 85,
        transportMode: 'walking',
        difficulty: 'difficult',
        infrastructure: {
          bridges: 1,
          shelters: 3,
          medicalPosts: 0,
          communicationTowers: 1
        },
        weatherImpact: 'high',
        lastUpdated: new Date()
      }
    ];

    // Initialize fire zones
    const zones: FireZone[] = [
      {
        id: 'fire-zone-1',
        center: { lat: 29.5319, lng: 78.7718 },
        radius: 2000, // meters
        intensity: 85,
        spreadDirection: 65, // degrees
        spreadSpeed: 3.5, // km/h
        timeToReach: {
          'route-corbett-ramnagar': 45,
          'route-helicopter-evacuation': 25,
          'route-forest-trail': 90
        },
        confidence: 94
      },
      {
        id: 'fire-zone-2',
        center: { lat: 29.4000, lng: 79.0000 },
        radius: 1500,
        intensity: 72,
        spreadDirection: 120,
        spreadSpeed: 2.8,
        timeToReach: {
          'route-nainital-haldwani': 65,
          'route-helicopter-evacuation': 35
        },
        confidence: 87
      }
    ];

    // Initialize evacuation centers
    const centers: EvacuationCenter[] = [
      {
        id: 'center-ramnagar',
        name: 'Ramnagar Emergency Relief Center',
        location: { lat: 29.3947, lng: 79.1314 },
        capacity: 5000,
        currentOccupancy: 1200,
        facilities: ['Medical Center', 'Food Distribution', 'Temporary Housing', 'Communication Hub'],
        status: 'operational',
        estimatedArrivalTime: 45,
        resources: {
          medical: true,
          food: true,
          shelter: true,
          communication: true,
          transport: true
        }
      },
      {
        id: 'center-haldwani',
        name: 'Haldwani District Emergency Campus',
        location: { lat: 29.2183, lng: 79.5130 },
        capacity: 8000,
        currentOccupancy: 2800,
        facilities: ['Hospital', 'Food Court', 'Dormitories', 'Helicopter Landing', 'Vehicle Depot'],
        status: 'operational',
        estimatedArrivalTime: 35,
        resources: {
          medical: true,
          food: true,
          shelter: true,
          communication: true,
          transport: true
        }
      },
      {
        id: 'center-dehradun',
        name: 'Dehradun State Emergency Headquarters',
        location: { lat: 30.3165, lng: 78.0322 },
        capacity: 10000,
        currentOccupancy: 3500,
        facilities: ['Medical Complex', 'Mass Feeding', 'Accommodation Blocks', 'Command Center'],
        status: 'operational',
        estimatedArrivalTime: 90,
        resources: {
          medical: true,
          food: true,
          shelter: true,
          communication: true,
          transport: true
        }
      }
    ];

    setEvacuationRoutes(routes);
    setFireZones(zones);
    setEvacuationCenters(centers);
  };

  const calculateSafetyWindow = (baseEvacuationTime: number, timeHorizon: number) => {
    const fireArrivalETA = timeHorizon * 60; // Convert hours to minutes
    const safetyMargin = fireArrivalETA - baseEvacuationTime;
    
    let status: 'safe' | 'warning' | 'critical' | 'unsafe';
    if (safetyMargin > 120) status = 'safe';
    else if (safetyMargin > 60) status = 'warning';
    else if (safetyMargin > 0) status = 'critical';
    else status = 'unsafe';

    return {
      hours: timeHorizon,
      status,
      fireArrivalETA,
      evacuationTime: baseEvacuationTime,
      safetyMargin
    };
  };

  const updateFireProgression = () => {
    setFireZones(prev => prev.map(zone => ({
      ...zone,
      radius: zone.radius + (zone.spreadSpeed * 1000 / 120), // Spread per 30 seconds
      intensity: Math.max(50, zone.intensity - Math.random() * 2),
      confidence: Math.min(99, zone.confidence + Math.random() * 2)
    })));
  };

  const updateRouteStatuses = () => {
    setEvacuationRoutes(prev => prev.map(route => ({
      ...route,
      safetyWindow: calculateSafetyWindow(route.safetyWindow.evacuationTime, selectedTimeHorizon),
      currentLoad: Math.max(0, route.currentLoad + Math.floor((Math.random() - 0.7) * 50)),
      lastUpdated: new Date()
    })));
  };

  const getRouteColor = (status: string) => {
    switch (status) {
      case 'safe': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      case 'unsafe': return '#7f1d1d';
      default: return '#6b7280';
    }
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'helicopter': return Helicopter;
      case 'vehicle': return Car;
      case 'walking': return Walking;
      default: return Navigation;
    }
  };

  const openGoogleMapsRoute = (route: EvacuationRoute) => {
    const start = `${route.path[0].lat},${route.path[0].lng}`;
    const end = `${route.path[route.path.length - 1].lat},${route.path[route.path.length - 1].lng}`;
    const waypoints = route.path.slice(1, -1).map(p => `${p.lat},${p.lng}`).join('|');
    
    const googleMapsUrl = `https://www.google.com/maps/dir/${start}/${end}${waypoints ? `/${waypoints}` : ''}`;
    window.open(googleMapsUrl, '_blank');
  };

  const initiateEmergencyEvacuation = (routeId: string) => {
    const route = evacuationRoutes.find(r => r.id === routeId);
    if (!route) return;

    // Simulate emergency evacuation initiation
    alert(`🚨 EMERGENCY EVACUATION INITIATED\n\nRoute: ${route.name}\nSafety Window: ${route.safetyWindow.safetyMargin} minutes\nCapacity: ${route.capacity - route.currentLoad} people available\n\nEmergency services have been notified.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Professional Header */}
      <header className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg">
                <Navigation className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-heading-3 font-bold text-white">AI EVACUATION COMMAND CENTER</h1>
                <p className="text-caption text-slate-400">Real-Time Fire Prediction + Smart Evacuation Planning</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full ${realTimeUpdates ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-body-small font-semibold text-emerald-400">
                    {realTimeUpdates ? 'LIVE UPDATES' : 'PAUSED'}
                  </span>
                </div>
                <p className="text-caption text-slate-400">Last: {lastUpdate.toLocaleTimeString()}</p>
              </div>
              
              <button
                onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  realTimeUpdates 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {realTimeUpdates ? 'LIVE' : 'PAUSED'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Time Horizon Selector */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="container-responsive">
          <div className="flex items-center justify-between py-4">
            <div>
              <h2 className="text-heading-3 font-bold text-white mb-2">Fire Prediction Time Horizon</h2>
              <p className="text-body-small text-slate-400">Select prediction timeframe for evacuation planning</p>
            </div>
            
            <div className="flex gap-2">
              {([1, 2, 3, 6, 12, 24] as const).map((hours) => (
                <button
                  key={hours}
                  onClick={() => setSelectedTimeHorizon(hours)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedTimeHorizon === hours
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {hours}h
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="container-responsive space-section">
        {/* Critical Statistics */}
        <div className="grid-responsive grid-1-2-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-emergency space-component text-white"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-300" size={24} />
              <div>
                <p className="text-caption text-red-200">Active Fire Zones</p>
                <p className="text-heading-2 font-bold">{fireZones.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg space-component text-white"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-300" size={24} />
              <div>
                <p className="text-caption text-green-200">Safe Routes</p>
                <p className="text-heading-2 font-bold">
                  {evacuationRoutes.filter(r => r.safetyWindow.status === 'safe').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg space-component text-white"
          >
            <div className="flex items-center gap-3">
              <Users className="text-blue-300" size={24} />
              <div>
                <p className="text-caption text-blue-200">Evacuation Capacity</p>
                <p className="text-heading-2 font-bold">
                  {evacuationRoutes.reduce((sum, r) => sum + (r.capacity - r.currentLoad), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg space-component text-white"
          >
            <div className="flex items-center gap-3">
              <Timer className="text-purple-300" size={24} />
              <div>
                <p className="text-caption text-purple-200">Min Safety Margin</p>
                <p className="text-heading-2 font-bold">
                  {Math.min(...evacuationRoutes.map(r => r.safetyWindow.safetyMargin))} min
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid-responsive grid-1-2 gap-8">
          {/* Interactive Evacuation Map */}
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
                  attribution='&copy; OpenStreetMap contributors'
                />
                
                {/* Fire Zones */}
                {fireZones.map((zone) => (
                  <Circle
                    key={zone.id}
                    center={[zone.center.lat, zone.center.lng]}
                    radius={zone.radius}
                    pathOptions={{
                      color: '#dc2626',
                      fillColor: '#dc2626',
                      fillOpacity: 0.3,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-bold text-red-600">Active Fire Zone</h4>
                        <p>Intensity: {zone.intensity}%</p>
                        <p>Spread Speed: {zone.spreadSpeed} km/h</p>
                        <p>Confidence: {zone.confidence}%</p>
                      </div>
                    </Popup>
                  </Circle>
                ))}

                {/* Evacuation Routes */}
                {evacuationRoutes.map((route) => (
                  <Polyline
                    key={route.id}
                    positions={route.path.map(p => [p.lat, p.lng] as [number, number])}
                    pathOptions={{
                      color: getRouteColor(route.safetyWindow.status),
                      weight: 6,
                      opacity: 0.8
                    }}
                    eventHandlers={{
                      click: () => setSelectedRoute(route.id)
                    }}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <h4 className="font-bold">{route.name}</h4>
                        <p className="text-sm mb-2">Safety: {route.safetyWindow.status.toUpperCase()}</p>
                        <p className="text-sm">Margin: {route.safetyWindow.safetyMargin} min</p>
                        <p className="text-sm">Capacity: {route.capacity - route.currentLoad} available</p>
                      </div>
                    </Popup>
                  </Polyline>
                ))}

                {/* Evacuation Centers */}
                {evacuationCenters.map((center) => (
                  <Marker
                    key={center.id}
                    position={[center.location.lat, center.location.lng]}
                  >
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-bold">{center.name}</h4>
                        <p className="text-sm">Capacity: {center.currentOccupancy}/{center.capacity}</p>
                        <p className="text-sm">Status: {center.status.toUpperCase()}</p>
                        <div className="mt-2">
                          {center.facilities.map((facility, idx) => (
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

          {/* Evacuation Routes Panel */}
          <div className="space-y-6">
            <div className="card-primary space-component">
              <h3 className="text-heading-3 font-bold text-white mb-4">Evacuation Routes Status</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {evacuationRoutes.map((route, index) => {
                  const TransportIcon = getTransportIcon(route.transportMode);
                  const loadPercentage = (route.currentLoad / route.capacity) * 100;
                  
                  return (
                    <motion.div
                      key={route.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-slate-700/50 rounded-lg p-4 border cursor-pointer transition-all ${
                        selectedRoute === route.id ? 'border-orange-500 bg-orange-900/20' : 'border-slate-600 hover:border-slate-500'
                      }`}
                      onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-600/20 rounded-lg">
                            <TransportIcon className="text-blue-400" size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-white">{route.name}</h4>
                            <p className="text-sm text-slate-400">
                              {route.transportMode.charAt(0).toUpperCase() + route.transportMode.slice(1)} • 
                              {route.difficulty} difficulty
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span 
                            className="px-3 py-1 rounded-lg text-white font-bold text-sm"
                            style={{ backgroundColor: getRouteColor(route.safetyWindow.status) }}
                          >
                            {route.safetyWindow.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-400">
                            {route.safetyWindow.safetyMargin > 0 ? '+' : ''}{route.safetyWindow.safetyMargin} min
                          </span>
                        </div>
                      </div>

                      {/* Safety Timeline */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Safety Window</span>
                          <span>{route.safetyWindow.hours}h prediction</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Clock size={12} className="text-blue-400" />
                          <span className="text-blue-400">Evacuation: {route.safetyWindow.evacuationTime} min</span>
                          <ArrowRight size={12} className="text-slate-500" />
                          <span className="text-orange-400">Fire ETA: {route.safetyWindow.fireArrivalETA} min</span>
                        </div>
                      </div>

                      {/* Capacity Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Route Capacity</span>
                          <span>{route.currentLoad}/{route.capacity}</span>
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
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openGoogleMapsRoute(route);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <MapPin size={14} />
                          Navigate
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            initiateEmergencyEvacuation(route.id);
                          }}
                          className={`py-2 px-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                            route.safetyWindow.status === 'unsafe' 
                              ? 'bg-red-600 hover:bg-red-700 text-white' 
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          <Radio size={14} />
                          {route.safetyWindow.status === 'unsafe' ? 'Emergency' : 'Activate'}
                        </button>
                      </div>

                      {/* Expanded Details */}
                      {selectedRoute === route.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-slate-600"
                        >
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <h5 className="font-semibold text-white mb-2">Infrastructure</h5>
                              <div className="space-y-1 text-sm text-slate-300">
                                <div>Bridges: {route.infrastructure.bridges}</div>
                                <div>Shelters: {route.infrastructure.shelters}</div>
                                <div>Medical Posts: {route.infrastructure.medicalPosts}</div>
                                <div>Comm Towers: {route.infrastructure.communicationTowers}</div>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-semibold text-white mb-2">Conditions</h5>
                              <div className="space-y-1 text-sm text-slate-300">
                                <div>Weather Impact: {route.weatherImpact}</div>
                                <div>Last Updated: {route.lastUpdated.toLocaleTimeString()}</div>
                                <div>Available: {route.capacity - route.currentLoad} people</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Evacuation Centers */}
            <div className="card-primary space-component">
              <h3 className="text-heading-3 font-bold text-white mb-4">Evacuation Centers</h3>
              <div className="space-y-3">
                {evacuationCenters.map((center, index) => {
                  const occupancyPercentage = (center.currentOccupancy / center.capacity) * 100;
                  
                  return (
                    <motion.div
                      key={center.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-white">{center.name}</h4>
                          <p className="text-sm text-slate-400">ETA: {center.estimatedArrivalTime} minutes</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          center.status === 'operational' ? 'bg-green-100 text-green-800' :
                          center.status === 'full' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {center.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-slate-400 mb-1">
                          <span>Occupancy</span>
                          <span>{center.currentOccupancy}/{center.capacity}</span>
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

                      <div className="flex flex-wrap gap-1">
                        {center.facilities.map((facility, idx) => (
                          <span key={idx} className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded">
                            {facility}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Protocol */}
        <div className="mt-8 card-emergency space-component text-white">
          <h3 className="text-heading-3 font-bold mb-4">🚨 EVACUATION PROTOCOL</h3>
          <div className="grid-responsive grid-1-2-3">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target size={16} />
                Phase 1: Assessment (0-15 min)
              </h4>
              <ul className="space-y-1 text-sm text-red-100">
                <li>• Analyze fire spread predictions</li>
                <li>• Identify safe evacuation routes</li>
                <li>• Calculate safety margins</li>
                <li>• Alert emergency services</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Users size={16} />
                Phase 2: Mobilization (15-45 min)
              </h4>
              <ul className="space-y-1 text-sm text-red-100">
                <li>• Deploy evacuation teams</li>
                <li>• Activate transport resources</li>
                <li>• Establish communication</li>
                <li>• Guide population to routes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Shield size={16} />
                Phase 3: Execution (45+ min)
              </h4>
              <ul className="space-y-1 text-sm text-red-100">
                <li>• Monitor route safety status</li>
                <li>• Coordinate with evacuation centers</li>
                <li>• Provide real-time updates</li>
                <li>• Ensure complete evacuation</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};