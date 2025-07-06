import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radio, 
  MapPin, 
  Users, 
  Truck, 
  Flame, 
  AlertTriangle, 
  Clock, 
  Phone,
  Navigation,
  Shield,
  Activity,
  Zap
} from 'lucide-react';

interface FirefighterTeam {
  id: string;
  callSign: string;
  location: string;
  lat: number;
  lng: number;
  status: 'available' | 'deployed' | 'responding' | 'emergency';
  personnel: number;
  equipment: string[];
  eta: number;
  lastContact: Date;
}

interface EmergencyAlert {
  id: string;
  priority: 'P1' | 'P2' | 'P3';
  type: 'fire_detected' | 'evacuation_needed' | 'equipment_request' | 'medical_emergency';
  location: string;
  coordinates: { lat: number; lng: number };
  message: string;
  timestamp: Date;
  assignedTeams: string[];
  status: 'new' | 'acknowledged' | 'responding' | 'resolved';
}

export const FirefighterCommandCenter: React.FC = () => {
  const [firefighterTeams, setFirefighterTeams] = useState<FirefighterTeam[]>([
    {
      id: 'team-alpha',
      callSign: 'ALPHA-1',
      location: 'Ramnagar Fire Station',
      lat: 29.3947,
      lng: 79.1314,
      status: 'available',
      personnel: 8,
      equipment: ['Fire Engine', 'Water Tanker', 'Rescue Vehicle'],
      eta: 0,
      lastContact: new Date()
    },
    {
      id: 'team-bravo',
      callSign: 'BRAVO-2',
      location: 'Corbett Gate Outpost',
      lat: 29.5319,
      lng: 78.7718,
      status: 'deployed',
      personnel: 6,
      equipment: ['Rapid Response Unit', 'Medical Kit'],
      eta: 15,
      lastContact: new Date()
    },
    {
      id: 'team-charlie',
      callSign: 'CHARLIE-3',
      location: 'Nainital Fire Brigade',
      lat: 29.3919,
      lng: 79.4542,
      status: 'responding',
      personnel: 10,
      equipment: ['Heavy Fire Engine', 'Aerial Ladder', 'Foam Unit'],
      eta: 25,
      lastContact: new Date()
    }
  ]);

  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([
    {
      id: 'alert-001',
      priority: 'P1',
      type: 'fire_detected',
      location: 'Jim Corbett Core Zone - Dhikala',
      coordinates: { lat: 29.5319, lng: 78.7718 },
      message: 'CRITICAL: Large fire detected in tiger habitat. Immediate response required. Wind speed 28 km/h, spreading rapidly northeast.',
      timestamp: new Date(),
      assignedTeams: ['team-bravo'],
      status: 'responding'
    },
    {
      id: 'alert-002',
      priority: 'P1',
      type: 'evacuation_needed',
      location: 'Tourist Lodge Complex - Bijrani',
      coordinates: { lat: 29.5500, lng: 78.8000 },
      message: 'URGENT: 150 tourists need immediate evacuation. Fire approaching from southwest. Evacuation buses dispatched.',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      assignedTeams: ['team-alpha', 'team-charlie'],
      status: 'acknowledged'
    },
    {
      id: 'alert-003',
      priority: 'P2',
      type: 'equipment_request',
      location: 'Kaladhungi Forest Division',
      coordinates: { lat: 29.2833, lng: 79.0833 },
      message: 'Request additional water tankers. Current fire line established but need reinforcement for night operations.',
      timestamp: new Date(Date.now() - 600000), // 10 minutes ago
      assignedTeams: [],
      status: 'new'
    }
  ]);

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Simulate team status updates
      setFirefighterTeams(prev => prev.map(team => ({
        ...team,
        lastContact: new Date(),
        eta: team.status === 'responding' ? Math.max(0, team.eta - 1) : team.eta
      })));

      // Simulate new alerts occasionally
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const newAlert: EmergencyAlert = {
          id: `alert-${Date.now()}`,
          priority: Math.random() < 0.3 ? 'P1' : 'P2',
          type: 'fire_detected',
          location: 'Sensor Grid Alpha-7',
          coordinates: { lat: 29.4 + Math.random() * 0.2, lng: 78.8 + Math.random() * 0.4 },
          message: 'Smoke detected by automated sensors. Verification needed.',
          timestamp: new Date(),
          assignedTeams: [],
          status: 'new'
        };
        
        setEmergencyAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
        
        if (audioEnabled) {
          playAlertSound();
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [audioEnabled]);

  const playAlertSound = () => {
    // In a real system, this would play an actual alert sound
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('New emergency alert received');
      utterance.rate = 1.2;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setEmergencyAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
    ));
  };

  const assignTeam = (alertId: string, teamId: string) => {
    setEmergencyAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, assignedTeams: [...alert.assignedTeams, teamId], status: 'responding' }
        : alert
    ));
    
    setFirefighterTeams(prev => prev.map(team =>
      team.id === teamId ? { ...team, status: 'responding' } : team
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'border-red-500 bg-red-50';
      case 'P2': return 'border-orange-500 bg-orange-50';
      case 'P3': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'deployed': return 'text-blue-600 bg-blue-100';
      case 'responding': return 'text-orange-600 bg-orange-100';
      case 'emergency': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Command Center Header */}
      <header className="bg-red-800 shadow-lg border-b border-red-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-600 rounded-xl">
                <Radio className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  🚨 FIREFIGHTER COMMAND CENTER
                </h1>
                <p className="text-red-200">Uttarakhand Emergency Response - LIVE</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-red-200">Last Update</p>
                <p className="font-semibold text-white">{lastUpdate.toLocaleTimeString()}</p>
              </div>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  audioEnabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}
              >
                🔊 Audio {audioEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Critical Status Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-800 rounded-xl shadow-lg p-4"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-300" size={24} />
              <div>
                <p className="text-sm text-red-200">Active Alerts</p>
                <p className="text-2xl font-bold text-white">
                  {emergencyAlerts.filter(a => a.status !== 'resolved').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-800 rounded-xl shadow-lg p-4"
          >
            <div className="flex items-center gap-3">
              <Users className="text-blue-300" size={24} />
              <div>
                <p className="text-sm text-blue-200">Teams Deployed</p>
                <p className="text-2xl font-bold text-white">
                  {firefighterTeams.filter(t => t.status === 'deployed' || t.status === 'responding').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-orange-800 rounded-xl shadow-lg p-4"
          >
            <div className="flex items-center gap-3">
              <Truck className="text-orange-300" size={24} />
              <div>
                <p className="text-sm text-orange-200">Equipment Units</p>
                <p className="text-2xl font-bold text-white">
                  {firefighterTeams.reduce((sum, team) => sum + team.equipment.length, 0)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-green-800 rounded-xl shadow-lg p-4"
          >
            <div className="flex items-center gap-3">
              <Shield className="text-green-300" size={24} />
              <div>
                <p className="text-sm text-green-200">Personnel</p>
                <p className="text-2xl font-bold text-white">
                  {firefighterTeams.reduce((sum, team) => sum + team.personnel, 0)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emergency Alerts */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Flame size={24} className="text-red-500" />
                Live Emergency Alerts
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">LIVE</span>
              </div>
            </div>

            <AnimatePresence>
              {emergencyAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`border-2 rounded-xl p-4 mb-4 ${getPriorityColor(alert.priority)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded font-bold text-xs ${
                        alert.priority === 'P1' ? 'bg-red-600 text-white' :
                        alert.priority === 'P2' ? 'bg-orange-600 text-white' :
                        'bg-yellow-600 text-black'
                      }`}>
                        {alert.priority}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{alert.type.replace('_', ' ').toUpperCase()}</h3>
                        <p className="text-sm text-gray-700 flex items-center gap-1">
                          <MapPin size={14} />
                          {alert.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {alert.status === 'new' && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
                        >
                          ACKNOWLEDGE
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-800 mb-3 font-medium">{alert.message}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                    <div className="flex gap-2">
                      {alert.assignedTeams.map(teamId => {
                        const team = firefighterTeams.find(t => t.id === teamId);
                        return team ? (
                          <span key={teamId} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                            {team.callSign}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {alert.assignedTeams.length === 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs text-gray-600 mb-2">Assign Team:</p>
                      <div className="flex gap-2">
                        {firefighterTeams.filter(t => t.status === 'available').map(team => (
                          <button
                            key={team.id}
                            onClick={() => assignTeam(alert.id, team.id)}
                            className="px-2 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700"
                          >
                            {team.callSign}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Firefighter Teams Status */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Users size={24} className="text-blue-500" />
              Firefighter Teams Status
            </h2>

            <div className="space-y-4">
              {firefighterTeams.map((team) => (
                <div key={team.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold text-white">{team.callSign}</div>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(team.status)}`}>
                        {team.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="text-gray-400" size={16} />
                      <span className="text-sm text-gray-300">
                        {team.lastContact.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="text-white font-medium">{team.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Personnel</p>
                      <p className="text-white font-medium">{team.personnel} firefighters</p>
                    </div>
                  </div>

                  {team.status === 'responding' && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="text-orange-400" size={16} />
                        <span className="text-sm text-orange-400">ETA: {team.eta} minutes</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.max(10, 100 - (team.eta * 2))}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Equipment</p>
                    <div className="flex flex-wrap gap-1">
                      {team.equipment.map((item, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-600 text-gray-200 rounded text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Radio Communications Simulator */}
        <div className="mt-8 bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Radio size={24} className="text-green-500" />
            Live Radio Communications
          </h3>
          <div className="bg-black rounded-lg p-4 font-mono text-green-400 text-sm">
            <div className="space-y-1">
              <div>[{new Date().toLocaleTimeString()}] ALPHA-1: "Command, we have visual on the fire. Approximately 2 hectares burning, wind pushing northeast."</div>
              <div>[{new Date(Date.now() - 30000).toLocaleTimeString()}] COMMAND: "Copy ALPHA-1. BRAVO-2, what's your ETA to evacuation zone?"</div>
              <div>[{new Date(Date.now() - 60000).toLocaleTimeString()}] BRAVO-2: "Command, ETA 8 minutes. Tourist buses are loaded and moving to safe zone."</div>
              <div>[{new Date(Date.now() - 90000).toLocaleTimeString()}] CHARLIE-3: "Command, requesting water drop coordinates. Helicopter inbound."</div>
              <div className="text-yellow-400">[LIVE] COMMAND: "All units, weather update: Wind shifting to 35 km/h from southwest. Adjust positions accordingly."</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};