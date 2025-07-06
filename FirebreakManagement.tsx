import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Scissors, 
  MapPin, 
  Ruler, 
  Clock, 
  Users, 
  Truck, 
  AlertTriangle, 
  CheckCircle,
  Navigation,
  TreePine,
  Zap,
  Target,
  Activity,
  Shield
} from 'lucide-react';

interface Firebreak {
  id: string;
  name: string;
  coordinates: { start: { lat: number; lng: number }; end: { lat: number; lng: number } };
  length: number; // meters
  width: number; // meters
  status: 'planned' | 'in_progress' | 'completed' | 'maintenance_needed';
  priority: 'critical' | 'high' | 'medium' | 'low';
  terrain: 'flat' | 'moderate_slope' | 'steep' | 'ridge';
  vegetationType: 'dense_forest' | 'mixed_forest' | 'grassland' | 'shrubland';
  estimatedTime: number; // hours
  requiredPersonnel: number;
  equipment: string[];
  effectiveness: number; // percentage
  lastMaintenance: Date;
  createdBy: string;
  notes: string;
}

interface FirebreakTeam {
  id: string;
  name: string;
  location: string;
  personnel: number;
  equipment: string[];
  status: 'available' | 'deployed' | 'returning';
  currentTask?: string;
  eta?: number;
}

export const FirebreakManagement: React.FC = () => {
  const [firebreaks, setFirebreaks] = useState<Firebreak[]>([
    {
      id: 'fb-001',
      name: 'Jim Corbett Main Firebreak',
      coordinates: {
        start: { lat: 29.5319, lng: 78.7718 },
        end: { lat: 29.5500, lng: 78.8000 }
      },
      length: 2800,
      width: 30,
      status: 'completed',
      priority: 'critical',
      terrain: 'moderate_slope',
      vegetationType: 'dense_forest',
      estimatedTime: 12,
      requiredPersonnel: 25,
      equipment: ['Bulldozers', 'Chain Saws', 'Hand Tools', 'Water Tankers'],
      effectiveness: 95,
      lastMaintenance: new Date(Date.now() - 86400000 * 15),
      createdBy: 'Forest Dept. Uttarakhand',
      notes: 'Primary defense line for core tiger habitat protection'
    },
    {
      id: 'fb-002',
      name: 'Nainital Ridge Firebreak',
      coordinates: {
        start: { lat: 29.3919, lng: 79.4542 },
        end: { lat: 29.4100, lng: 79.4700 }
      },
      length: 2200,
      width: 25,
      status: 'in_progress',
      priority: 'high',
      terrain: 'steep',
      vegetationType: 'mixed_forest',
      estimatedTime: 8,
      requiredPersonnel: 20,
      equipment: ['Manual Tools', 'Brush Cutters', 'Mini Excavators'],
      effectiveness: 85,
      lastMaintenance: new Date(Date.now() - 86400000 * 30),
      createdBy: 'Nainital Forest Division',
      notes: 'Tourist area protection - minimize visual impact'
    },
    {
      id: 'fb-003',
      name: 'Emergency Firebreak Alpha',
      coordinates: {
        start: { lat: 29.4500, lng: 78.9000 },
        end: { lat: 29.4700, lng: 78.9200 }
      },
      length: 1500,
      width: 20,
      status: 'planned',
      priority: 'critical',
      terrain: 'flat',
      vegetationType: 'grassland',
      estimatedTime: 4,
      requiredPersonnel: 15,
      equipment: ['Bulldozers', 'Disc Harrows', 'Water Sprayers'],
      effectiveness: 90,
      lastMaintenance: new Date(),
      createdBy: 'Emergency Response Team',
      notes: 'Rapid deployment firebreak for immediate fire threat'
    }
  ]);

  const [firebreakTeams, setFirebreakTeams] = useState<FirebreakTeam[]>([
    {
      id: 'team-001',
      name: 'Uttarakhand Firebreak Unit Alpha',
      location: 'Ramnagar Base',
      personnel: 25,
      equipment: ['2x Bulldozers', '4x Chain Saws', '20x Hand Tools', '1x Water Tanker'],
      status: 'available',
      currentTask: undefined,
      eta: undefined
    },
    {
      id: 'team-002',
      name: 'Nainital Firebreak Crew',
      location: 'Nainital Station',
      personnel: 20,
      equipment: ['1x Mini Excavator', '6x Brush Cutters', '15x Manual Tools'],
      status: 'deployed',
      currentTask: 'Nainital Ridge Firebreak',
      eta: 6
    },
    {
      id: 'team-003',
      name: 'Rapid Response Firebreak Team',
      location: 'Mobile Unit',
      personnel: 15,
      equipment: ['1x Bulldozer', '2x Disc Harrows', '10x Hand Tools'],
      status: 'available',
      currentTask: undefined,
      eta: undefined
    }
  ]);

  const [selectedFirebreak, setSelectedFirebreak] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'planned': return 'text-yellow-600 bg-yellow-100';
      case 'maintenance_needed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-black';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getTeamStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-500';
      case 'deployed': return 'text-blue-500';
      case 'returning': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const calculateFirebreakArea = (length: number, width: number): number => {
    return (length * width) / 10000; // Convert to hectares
  };

  const deployTeam = (teamId: string, firebreakId: string) => {
    const firebreak = firebreaks.find(fb => fb.id === firebreakId);
    if (!firebreak) return;

    setFirebreakTeams(prev => prev.map(team => 
      team.id === teamId 
        ? { 
            ...team, 
            status: 'deployed', 
            currentTask: firebreak.name,
            eta: firebreak.estimatedTime
          }
        : team
    ));

    setFirebreaks(prev => prev.map(fb =>
      fb.id === firebreakId
        ? { ...fb, status: 'in_progress' }
        : fb
    ));
  };

  const totalFirebreaks = firebreaks.length;
  const completedFirebreaks = firebreaks.filter(fb => fb.status === 'completed').length;
  const inProgressFirebreaks = firebreaks.filter(fb => fb.status === 'in_progress').length;
  const totalLength = firebreaks.reduce((sum, fb) => sum + fb.length, 0);
  const availableTeams = firebreakTeams.filter(team => team.status === 'available').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-primary space-component">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-600 rounded-lg">
              <Scissors className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-heading-2 font-bold text-white">🔥 FIREBREAK MANAGEMENT</h2>
              <p className="text-body-small text-slate-400">Strategic vegetation clearing for fire suppression</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Target size={16} />
              Plan New Firebreak
            </button>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-400">{totalFirebreaks}</div>
              <p className="text-caption text-slate-400">Active Firebreaks</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid-responsive grid-1-2-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 text-white text-center"
          >
            <div className="text-2xl font-bold">{completedFirebreaks}</div>
            <div className="text-sm opacity-90">Completed</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white text-center"
          >
            <div className="text-2xl font-bold">{inProgressFirebreaks}</div>
            <div className="text-sm opacity-90">In Progress</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 text-white text-center"
          >
            <div className="text-2xl font-bold">{(totalLength / 1000).toFixed(1)} km</div>
            <div className="text-sm opacity-90">Total Length</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-4 text-white text-center"
          >
            <div className="text-2xl font-bold">{availableTeams}</div>
            <div className="text-sm opacity-90">Teams Available</div>
          </motion.div>
        </div>
      </div>

      <div className="grid-responsive grid-1-2 gap-6">
        {/* Firebreak List */}
        <div className="card-primary space-component">
          <h3 className="text-heading-3 font-bold text-white mb-4">Active Firebreaks</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {firebreaks.map((firebreak, index) => (
              <motion.div
                key={firebreak.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-slate-700/50 rounded-lg p-4 border cursor-pointer transition-all ${
                  selectedFirebreak === firebreak.id ? 'border-orange-500 bg-orange-900/20' : 'border-slate-600 hover:border-slate-500'
                }`}
                onClick={() => setSelectedFirebreak(selectedFirebreak === firebreak.id ? null : firebreak.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-600/20 rounded-lg">
                      <Scissors className="text-orange-400" size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{firebreak.name}</h4>
                      <p className="text-sm text-slate-400">
                        {(firebreak.length / 1000).toFixed(1)} km × {firebreak.width}m wide
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(firebreak.status)}`}>
                      {firebreak.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(firebreak.priority)}`}>
                      {firebreak.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-slate-400">Terrain:</span>
                    <div className="font-medium text-white">{firebreak.terrain.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Vegetation:</span>
                    <div className="font-medium text-white">{firebreak.vegetationType.replace('_', ' ')}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Personnel:</span>
                    <div className="font-medium text-white">{firebreak.requiredPersonnel} people</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Effectiveness:</span>
                    <div className="font-medium text-green-400">{firebreak.effectiveness}%</div>
                  </div>
                </div>

                {/* Effectiveness Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Fire Stopping Effectiveness</span>
                    <span>{firebreak.effectiveness}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <motion.div 
                      className={`h-2 rounded-full ${
                        firebreak.effectiveness >= 90 ? 'bg-green-500' :
                        firebreak.effectiveness >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${firebreak.effectiveness}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedFirebreak === firebreak.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-600"
                  >
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-semibold text-white mb-2">Required Equipment</h5>
                        <div className="flex flex-wrap gap-1">
                          {firebreak.equipment.map((eq, idx) => (
                            <span key={idx} className="bg-orange-600/20 text-orange-400 text-xs px-2 py-1 rounded">
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-white mb-2">Coordinates</h5>
                        <div className="text-sm text-slate-300">
                          <div>Start: {firebreak.coordinates.start.lat.toFixed(4)}, {firebreak.coordinates.start.lng.toFixed(4)}</div>
                          <div>End: {firebreak.coordinates.end.lat.toFixed(4)}, {firebreak.coordinates.end.lng.toFixed(4)}</div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-white mb-2">Notes</h5>
                        <p className="text-sm text-slate-300">{firebreak.notes}</p>
                      </div>

                      {firebreak.status === 'planned' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Deploy first available team
                              const availableTeam = firebreakTeams.find(team => team.status === 'available');
                              if (availableTeam) {
                                deployTeam(availableTeam.id, firebreak.id);
                              }
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <Users size={16} />
                            Deploy Team
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const googleMapsUrl = `https://www.google.com/maps/dir/${firebreak.coordinates.start.lat},${firebreak.coordinates.start.lng}/${firebreak.coordinates.end.lat},${firebreak.coordinates.end.lng}`;
                              window.open(googleMapsUrl, '_blank');
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <Navigation size={16} />
                            View Route
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Firebreak Teams */}
        <div className="card-primary space-component">
          <h3 className="text-heading-3 font-bold text-white mb-4">Firebreak Teams</h3>
          <div className="space-y-4">
            {firebreakTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <Users className="text-blue-400" size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{team.name}</h4>
                      <p className="text-sm text-slate-400">{team.location}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${getTeamStatusColor(team.status)}`}>
                    {team.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-slate-400">Personnel:</span>
                    <div className="font-medium text-white">{team.personnel} people</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Equipment:</span>
                    <div className="font-medium text-white">{team.equipment.length} items</div>
                  </div>
                </div>

                {team.currentTask && (
                  <div className="bg-blue-900/30 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1">
                      <Activity size={14} />
                      Current Task: {team.currentTask}
                    </div>
                    {team.eta && (
                      <div className="text-blue-300 text-sm">
                        ETA: {team.eta} hours remaining
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <h5 className="font-semibold text-white mb-2">Equipment</h5>
                  <div className="flex flex-wrap gap-1">
                    {team.equipment.map((eq, idx) => (
                      <span key={idx} className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Firebreak Strategy Guide */}
      <div className="card-primary space-component">
        <h3 className="text-heading-3 font-bold text-white mb-4">🔥 Firebreak Strategy Guide</h3>
        <div className="grid-responsive grid-1-2-3">
          <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-600">
            <h4 className="font-semibold text-orange-400 mb-2 flex items-center gap-2">
              <Target size={16} />
              Strategic Placement
            </h4>
            <ul className="space-y-1 text-sm text-orange-200">
              <li>• Ridge lines and hilltops</li>
              <li>• Natural barriers (rivers, roads)</li>
              <li>• Upwind of valuable assets</li>
              <li>• Fuel type transitions</li>
              <li>• Access route considerations</li>
            </ul>
          </div>
          
          <div className="bg-green-900/30 rounded-lg p-4 border border-green-600">
            <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
              <Ruler size={16} />
              Sizing Guidelines
            </h4>
            <ul className="space-y-1 text-sm text-green-200">
              <li>• Width: 1.5x flame height</li>
              <li>• Minimum 20m for grassland</li>
              <li>• 30-50m for forest areas</li>
              <li>• Consider slope effects</li>
              <li>• Account for wind patterns</li>
            </ul>
          </div>
          
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
            <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <Shield size={16} />
              Maintenance
            </h4>
            <ul className="space-y-1 text-sm text-blue-200">
              <li>• Annual vegetation clearing</li>
              <li>• Pre-monsoon preparation</li>
              <li>• Post-fire rehabilitation</li>
              <li>• Erosion control measures</li>
              <li>• Access road maintenance</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Uttarakhand & Himachal Success Stories */}
      <div className="card-primary space-component">
        <h3 className="text-heading-3 font-bold text-white mb-4">🏔️ Uttarakhand & Himachal Pradesh Success Stories</h3>
        <div className="grid-responsive grid-1-2">
          <div className="bg-green-900/30 rounded-lg p-4 border border-green-600">
            <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
              <TreePine size={16} />
              Uttarakhand Forest Department
            </h4>
            <div className="space-y-2 text-sm text-green-200">
              <div className="flex justify-between">
                <span>Firebreaks Created (2023):</span>
                <span className="font-bold">450 km</span>
              </div>
              <div className="flex justify-between">
                <span>Fires Stopped:</span>
                <span className="font-bold">89%</span>
              </div>
              <div className="flex justify-between">
                <span>Forest Area Protected:</span>
                <span className="font-bold">12,000 hectares</span>
              </div>
              <div className="flex justify-between">
                <span>Cost Savings:</span>
                <span className="font-bold">₹45 crores</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
            <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <TreePine size={16} />
              Himachal Pradesh Success
            </h4>
            <div className="space-y-2 text-sm text-blue-200">
              <div className="flex justify-between">
                <span>Firebreaks Maintained:</span>
                <span className="font-bold">320 km</span>
              </div>
              <div className="flex justify-between">
                <span>Fire Containment Rate:</span>
                <span className="font-bold">92%</span>
              </div>
              <div className="flex justify-between">
                <span>Tourist Areas Protected:</span>
                <span className="font-bold">25 locations</span>
              </div>
              <div className="flex justify-between">
                <span>Community Involvement:</span>
                <span className="font-bold">150 villages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};