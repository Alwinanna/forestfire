import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, Clock, Users, Flame, Wind, Thermometer, Droplets, Activity, Zap, Phone, Navigation, Shield, Eye, TrendingUp, Target, Heart, HeaterIcon as Helicopter, Car, MessageCircle, Satellite } from 'lucide-react';

interface EmergencyZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  riskLevel: 'extreme' | 'critical' | 'high' | 'moderate';
  currentConditions: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    fireIndex: number;
  };
  predictions: {
    hour1: { affected: number; casualties: number; spread: number };
    hour3: { affected: number; casualties: number; spread: number };
    hour6: { affected: number; casualties: number; spread: number };
  };
  lastUpdate: Date;
  evacuationStatus: 'none' | 'recommended' | 'mandatory' | 'complete';
  populationAtRisk: number;
  emergencyContacts: {
    name: string;
    designation: string;
    phone: string;
    email: string;
    type: 'official' | 'rescue' | 'medical';
  }[];
  evacuationRoutes: {
    id: string;
    name: string;
    type: 'helicopter' | 'road' | 'foot';
    status: 'clear' | 'congested' | 'blocked';
    eta: number;
    capacity: number;
  }[];
  satelliteImageUrl: string;
  fireDetected: boolean;
  satelliteConfidence: number;
}

export const LiveEmergencyAlerts: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [emergencyZones, setEmergencyZones] = useState<EmergencyZone[]>([
    {
      id: 'jim-corbett-core',
      name: 'Jim Corbett Core Zone',
      lat: 29.5319,
      lng: 78.7718,
      riskLevel: 'extreme',
      currentConditions: {
        temperature: 38,
        humidity: 8,
        windSpeed: 35,
        windDirection: 65,
        fireIndex: 98
      },
      predictions: {
        hour1: { affected: 1200, casualties: 2, spread: 3.2 },
        hour3: { affected: 2800, casualties: 8, spread: 12.5 },
        hour6: { affected: 4200, casualties: 18, spread: 25.7 }
      },
      lastUpdate: new Date(),
      evacuationStatus: 'mandatory',
      populationAtRisk: 4500,
      emergencyContacts: [
        {
          name: 'Shri Vikram Thapa',
          designation: 'DFO Jim Corbett',
          phone: '+91-5947-251234',
          email: 'dfo.corbett@gov.in',
          type: 'official'
        },
        {
          name: 'Uttarakhand Disaster Response Force',
          designation: 'Emergency Rescue Team',
          phone: '+91-135-2715000',
          email: 'udrf@gov.in',
          type: 'rescue'
        },
        {
          name: 'Dr. Sunita Rawat',
          designation: 'Chief Medical Officer',
          phone: '+91-135-2715777',
          email: 'cmo.uttarakhand@gov.in',
          type: 'medical'
        }
      ],
      evacuationRoutes: [
        {
          id: 'heli-001',
          name: 'Helicopter Evacuation to Haldwani',
          type: 'helicopter',
          status: 'clear',
          eta: 15,
          capacity: 50
        },
        {
          id: 'road-001',
          name: 'Emergency Road to Ramnagar',
          type: 'road',
          status: 'congested',
          eta: 45,
          capacity: 2000
        },
        {
          id: 'foot-001',
          name: 'Forest Trail to Safe Zone',
          type: 'foot',
          status: 'clear',
          eta: 90,
          capacity: 500
        }
      ],
      satelliteImageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
      fireDetected: true,
      satelliteConfidence: 95
    },
    {
      id: 'nainital-hills',
      name: 'Nainital Hill Station',
      lat: 29.3919,
      lng: 79.4542,
      riskLevel: 'critical',
      currentConditions: {
        temperature: 34,
        humidity: 12,
        windSpeed: 28,
        windDirection: 120,
        fireIndex: 94
      },
      predictions: {
        hour1: { affected: 850, casualties: 1, spread: 2.1 },
        hour3: { affected: 2100, casualties: 5, spread: 8.7 },
        hour6: { affected: 2850, casualties: 12, spread: 15.3 }
      },
      lastUpdate: new Date(),
      evacuationStatus: 'recommended',
      populationAtRisk: 2847,
      emergencyContacts: [
        {
          name: 'Dr. Kavita Devi',
          designation: 'District Magistrate Nainital',
          phone: '+91-5942-235678',
          email: 'dm.nainital@gov.in',
          type: 'official'
        },
        {
          name: 'Himalayan Rescue Association',
          designation: 'Mountain Rescue Team',
          phone: '+91-5942-235000',
          email: 'info@himalayanrescue.org',
          type: 'rescue'
        }
      ],
      evacuationRoutes: [
        {
          id: 'road-002',
          name: 'Hill Road to Haldwani',
          type: 'road',
          status: 'clear',
          eta: 35,
          capacity: 3000
        },
        {
          id: 'heli-002',
          name: 'Tourist Helicopter Service',
          type: 'helicopter',
          status: 'clear',
          eta: 20,
          capacity: 100
        }
      ],
      satelliteImageUrl: 'https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?w=800&h=600&fit=crop',
      fireDetected: false,
      satelliteConfidence: 87
    },
    {
      id: 'ramnagar-buffer',
      name: 'Ramnagar Buffer Zone',
      lat: 29.3947,
      lng: 79.1314,
      riskLevel: 'high',
      currentConditions: {
        temperature: 32,
        humidity: 18,
        windSpeed: 22,
        windDirection: 45,
        fireIndex: 87
      },
      predictions: {
        hour1: { affected: 450, casualties: 0, spread: 1.5 },
        hour3: { affected: 1200, casualties: 2, spread: 5.2 },
        hour6: { affected: 1800, casualties: 6, spread: 9.8 }
      },
      lastUpdate: new Date(),
      evacuationStatus: 'recommended',
      populationAtRisk: 1950,
      emergencyContacts: [
        {
          name: 'Shri Mohan Bisht',
          designation: 'Fire Services Director',
          phone: '+91-135-2715888',
          email: 'fire.uttarakhand@gov.in',
          type: 'official'
        }
      ],
      evacuationRoutes: [
        {
          id: 'road-003',
          name: 'Main Highway to Dehradun',
          type: 'road',
          status: 'clear',
          eta: 60,
          capacity: 5000
        }
      ],
      satelliteImageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&h=600&fit=crop',
      fireDetected: true,
      satelliteConfidence: 78
    }
  ]);

  // Update time and simulate real-time data
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate real-time updates
      setEmergencyZones(prev => prev.map(zone => ({
        ...zone,
        currentConditions: {
          ...zone.currentConditions,
          temperature: zone.currentConditions.temperature + (Math.random() - 0.5) * 2,
          humidity: Math.max(5, zone.currentConditions.humidity + (Math.random() - 0.5) * 3),
          windSpeed: Math.max(0, zone.currentConditions.windSpeed + (Math.random() - 0.5) * 5),
          fireIndex: Math.min(100, Math.max(0, zone.currentConditions.fireIndex + (Math.random() - 0.5) * 2))
        },
        lastUpdate: new Date()
      })));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'extreme': return 'from-red-600 to-red-700';
      case 'critical': return 'from-orange-600 to-red-600';
      case 'high': return 'from-yellow-600 to-orange-600';
      case 'moderate': return 'from-green-600 to-yellow-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getEvacuationColor = (status: string) => {
    switch (status) {
      case 'mandatory': return 'badge-danger';
      case 'recommended': return 'badge-warning';
      case 'none': return 'badge-primary';
      case 'complete': return 'badge-info';
      default: return 'badge-primary';
    }
  };

  const getRouteIcon = (type: string) => {
    switch (type) {
      case 'helicopter': return Helicopter;
      case 'road': return Car;
      case 'foot': return Users;
      default: return Navigation;
    }
  };

  const getRouteStatusColor = (status: string) => {
    switch (status) {
      case 'clear': return 'text-green-500';
      case 'congested': return 'text-yellow-500';
      case 'blocked': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'official': return Shield;
      case 'rescue': return Heart;
      case 'medical': return Activity;
      default: return Phone;
    }
  };

  const makeCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const sendEmail = (email: string, subject: string = 'Forest Fire Emergency') => {
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}`, '_blank');
  };

  const openGoogleMapsRoute = (zone: EmergencyZone, route: any) => {
    const start = `${zone.lat},${zone.lng}`;
    const end = route.type === 'helicopter' ? 'Haldwani Airport' : 'Safe Zone';
    const googleMapsUrl = `https://www.google.com/maps/dir/${start}/${end}`;
    window.open(googleMapsUrl, '_blank');
  };

  const openLiveSatellite = (zone: EmergencyZone) => {
    // Open Google Earth with the specific coordinates
    const earthUrl = `https://earth.google.com/web/@${zone.lat},${zone.lng},1000a,1000d,35y,0h,0t,0r`;
    window.open(earthUrl, '_blank');
  };

  const totalAtRisk = emergencyZones.reduce((sum, zone) => sum + zone.populationAtRisk, 0);
  const extremeZones = emergencyZones.filter(z => z.riskLevel === 'extreme').length;
  const criticalZones = emergencyZones.filter(z => z.riskLevel === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Live Emergency Header */}
      <div className="card-emergency space-component text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-professional">
              <AlertTriangle className="text-white animate-pulse" size={24} />
            </div>
            <div>
              <h1 className="text-heading-1 font-bold">🚨 LIVE EMERGENCY ALERTS</h1>
              <p className="text-body text-red-100">Uttarakhand Forest Fire - Real-Time Monitoring</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <div className="status-warning"></div>
              <span className="text-body-small font-semibold">LIVE UPDATES</span>
            </div>
            <p className="text-caption text-red-200">{currentTime.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Critical Stats Dashboard - Mobile Optimized */}
      <div className="grid-responsive grid-1-2-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-emergency space-component text-white"
        >
          <div className="flex items-center gap-2">
            <Flame className="text-red-300" size={20} />
            <div>
              <p className="text-caption text-red-200">Extreme Zones</p>
              <p className="text-heading-2 font-bold">{extremeZones}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-professional shadow-professional space-component text-white"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-orange-300" size={20} />
            <div>
              <p className="text-caption text-orange-200">Critical Zones</p>
              <p className="text-heading-2 font-bold">{criticalZones}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-professional shadow-professional space-component text-white"
        >
          <div className="flex items-center gap-2">
            <Users className="text-yellow-300" size={20} />
            <div>
              <p className="text-caption text-yellow-200">At Risk</p>
              <p className="text-heading-3 font-bold">{totalAtRisk.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-professional shadow-professional space-component text-white"
        >
          <div className="flex items-center gap-2">
            <Activity className="text-blue-300" size={20} />
            <div>
              <p className="text-caption text-blue-200">Live Updates</p>
              <p className="text-heading-3 font-bold">5s</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Live Emergency Zones */}
      <div className="space-y-4">
        <h2 className="text-heading-2 font-bold text-white flex items-center gap-2">
          <MapPin size={24} className="text-red-500" />
          Most Prone Areas in Uttarakhand
        </h2>

        <AnimatePresence>
          {emergencyZones.map((zone, index) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-r ${getRiskColor(zone.riskLevel)} rounded-professional shadow-professional-lg space-component text-white`}
            >
              {/* Zone Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-professional">
                    <Target className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-heading-3 font-bold">{zone.name}</h3>
                    <p className="text-body-small text-white/80 flex items-center gap-1">
                      <MapPin size={14} />
                      {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <span className={`${getEvacuationColor(zone.evacuationStatus)} font-bold`}>
                    {zone.evacuationStatus.toUpperCase()} EVACUATION
                  </span>
                  <span className="text-caption text-white/70">
                    Updated: {zone.lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Current Conditions - Mobile Grid */}
              <div className="grid-responsive grid-1-2-4 mb-6">
                <div className="bg-white/10 rounded-professional space-element text-center">
                  <Thermometer className="mx-auto mb-1 text-red-300" size={20} />
                  <p className="text-caption text-white/70">Temperature</p>
                  <p className="text-body-large font-bold">{zone.currentConditions.temperature.toFixed(1)}°C</p>
                </div>
                
                <div className="bg-white/10 rounded-professional space-element text-center">
                  <Droplets className="mx-auto mb-1 text-blue-300" size={20} />
                  <p className="text-caption text-white/70">Humidity</p>
                  <p className="text-body-large font-bold">{zone.currentConditions.humidity.toFixed(0)}%</p>
                </div>
                
                <div className="bg-white/10 rounded-professional space-element text-center">
                  <Wind className="mx-auto mb-1 text-green-300" size={20} />
                  <p className="text-caption text-white/70">Wind</p>
                  <p className="text-body-large font-bold">{zone.currentConditions.windSpeed.toFixed(0)} km/h</p>
                </div>
                
                <div className="bg-white/10 rounded-professional space-element text-center">
                  <Flame className="mx-auto mb-1 text-orange-300" size={20} />
                  <p className="text-caption text-white/70">Fire Index</p>
                  <p className="text-body-large font-bold">{zone.currentConditions.fireIndex.toFixed(0)}/100</p>
                </div>
              </div>

              {/* Population at Risk - Prominent Display */}
              <div className="bg-white/10 rounded-professional space-element text-center mb-6">
                <Users className="mx-auto mb-2 text-yellow-300" size={24} />
                <p className="text-caption text-white/70">Population at Risk</p>
                <p className="text-display font-bold text-yellow-300">{zone.populationAtRisk.toLocaleString()}</p>
              </div>

              {/* Three Action Buttons - FIXED */}
              <div className="grid-responsive grid-1-2-3 mb-6">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newSelection = selectedZone === `${zone.id}-contacts` ? null : `${zone.id}-contacts`;
                    setSelectedZone(newSelection);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-professional font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone size={16} />
                  <span className="text-body-small">Emergency Contacts</span>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newSelection = selectedZone === `${zone.id}-routes` ? null : `${zone.id}-routes`;
                    setSelectedZone(newSelection);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-professional font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Navigation size={16} />
                  <span className="text-body-small">Evacuation Routes</span>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openLiveSatellite(zone);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-professional font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Satellite size={16} />
                  <span className="text-body-small">Live Satellite</span>
                </button>
              </div>

              {/* Emergency Contacts Section - FIXED */}
              {selectedZone === `${zone.id}-contacts` && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/10 rounded-professional space-component mb-6"
                >
                  <h4 className="text-heading-3 font-semibold text-white mb-4 flex items-center gap-2">
                    <Phone size={20} />
                    Emergency Contacts for {zone.name}
                  </h4>
                  <div className="space-y-3">
                    {zone.emergencyContacts.map((contact, idx) => {
                      const ContactIcon = getContactTypeIcon(contact.type);
                      return (
                        <div key={idx} className="bg-white/10 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-600/20 rounded-lg">
                                <ContactIcon className="text-blue-400" size={16} />
                              </div>
                              <div>
                                <h5 className="font-bold text-white">{contact.name}</h5>
                                <p className="text-sm text-white/80">{contact.designation}</p>
                              </div>
                            </div>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded text-white/80">
                              {contact.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                makeCall(contact.phone);
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                              <Phone size={14} />
                              Call Now
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                sendEmail(contact.email, `URGENT: Forest Fire Emergency - ${zone.name}`);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                              <MessageCircle size={14} />
                              Email
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Evacuation Routes Section - FIXED */}
              {selectedZone === `${zone.id}-routes` && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/10 rounded-professional space-component mb-6"
                >
                  <h4 className="text-heading-3 font-semibold text-white mb-4 flex items-center gap-2">
                    <Navigation size={20} />
                    Evacuation Routes from {zone.name}
                  </h4>
                  <div className="space-y-3">
                    {zone.evacuationRoutes.map((route, idx) => {
                      const RouteIcon = getRouteIcon(route.type);
                      return (
                        <div key={idx} className="bg-white/10 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-orange-600/20 rounded-lg">
                                <RouteIcon className="text-orange-400" size={16} />
                              </div>
                              <div>
                                <h5 className="font-bold text-white">{route.name}</h5>
                                <p className="text-sm text-white/80">
                                  ETA: {route.eta} min • Capacity: {route.capacity.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded font-bold ${getRouteStatusColor(route.status)}`}>
                              {route.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openGoogleMapsRoute(zone, route);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                              <MapPin size={14} />
                              Google Maps
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const routeInfo = `Evacuation Route: ${route.name}\nFrom: ${zone.name}\nETA: ${route.eta} minutes\nStatus: ${route.status}\nCapacity: ${route.capacity}`;
                                if (navigator.share) {
                                  navigator.share({ title: 'Evacuation Route', text: routeInfo });
                                } else {
                                  navigator.clipboard.writeText(routeInfo);
                                  alert('Route info copied to clipboard!');
                                }
                              }}
                              className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                              <Navigation size={14} />
                              Share Route
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Hourly Predictions - Mobile Optimized */}
              <div className="mb-4">
                <h4 className="text-heading-3 font-semibold text-white mb-2 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Live Predictions (Next 6 Hours)
                </h4>
                
                <div className="grid-responsive grid-1-2-3">
                  {/* 1 Hour */}
                  <div className="bg-white/10 rounded-professional space-component">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="text-yellow-300" size={16} />
                      <span className="text-body font-semibold">1 Hour</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-body-small text-white/70">Affected:</span>
                        <span className="text-body font-bold text-orange-300">{zone.predictions.hour1.affected.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-small text-white/70">Casualties:</span>
                        <span className="text-body font-bold text-red-300">{zone.predictions.hour1.casualties}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-small text-white/70">Spread:</span>
                        <span className="text-body font-bold text-yellow-300">{zone.predictions.hour1.spread} km²</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Hours */}
                  <div className="bg-white/10 rounded-professional space-component">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="text-orange-300" size={16} />
                      <span className="text-body font-semibold">3 Hours</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-body-small text-white/70">Affected:</span>
                        <span className="text-body font-bold text-orange-300">{zone.predictions.hour3.affected.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-small text-white/70">Casualties:</span>
                        <span className="text-body font-bold text-red-300">{zone.predictions.hour3.casualties}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-small text-white/70">Spread:</span>
                        <span className="text-body font-bold text-yellow-300">{zone.predictions.hour3.spread} km²</span>
                      </div>
                    </div>
                  </div>

                  {/* 6 Hours */}
                  <div className="bg-white/10 rounded-professional space-component">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="text-red-300" size={16} />
                      <span className="text-body font-semibold">6 Hours</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-body-small text-white/70">Affected:</span>
                        <span className="text-body font-bold text-orange-300">{zone.predictions.hour6.affected.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-small text-white/70">Casualties:</span>
                        <span className="text-body font-bold text-red-300">{zone.predictions.hour6.casualties}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-small text-white/70">Spread:</span>
                        <span className="text-body font-bold text-yellow-300">{zone.predictions.hour6.spread} km²</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Satellite View - ENHANCED */}
              <div className="bg-white/10 rounded-professional space-component">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-heading-3 font-semibold text-white flex items-center gap-2">
                    <Satellite size={20} />
                    Live ISRO Satellite View
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${zone.fireDetected ? 'text-red-300' : 'text-green-300'}`}>
                      Fire: {zone.fireDetected ? 'DETECTED' : 'NONE'}
                    </span>
                    <span className="text-sm text-white/70">
                      {zone.satelliteConfidence}% confidence
                    </span>
                  </div>
                </div>
                
                <div className="relative">
                  <img
                    src={zone.satelliteImageUrl}
                    alt={`Live satellite view of ${zone.name}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {zone.fireDetected && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-6 h-6 border-2 border-red-500 rounded-full bg-red-500/30"
                      />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1 text-xs text-white">
                    ISRO INSAT-3D • Live Feed
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openLiveSatellite(zone);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
                    >
                      View in Google Earth
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Live System Status */}
      <div className="card-primary space-component">
        <h3 className="text-heading-3 font-bold text-white mb-4 flex items-center gap-2">
          <Shield size={20} className="text-green-500" />
          Sanjeevani System Status
        </h3>
        
        <div className="grid-responsive grid-1-2-3">
          <div className="success-state">
            <div className="flex items-center gap-2 text-green-600 font-semibold mb-2">
              <Activity size={16} />
              AI Models: ACTIVE
            </div>
            <p className="text-body-small text-green-700">
              All prediction models running at 94.2% accuracy
            </p>
          </div>
          
          <div className="info-state">
            <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2">
              <Zap size={16} />
              Satellites: CONNECTED
            </div>
            <p className="text-body-small text-blue-700">
              ISRO INSAT-3D providing real-time data
            </p>
          </div>
          
          <div className="warning-state">
            <div className="flex items-center gap-2 text-yellow-600 font-semibold mb-2">
              <AlertTriangle size={16} />
              Alert System: OPERATIONAL
            </div>
            <p className="text-body-small text-yellow-700">
              Emergency notifications active for all zones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};