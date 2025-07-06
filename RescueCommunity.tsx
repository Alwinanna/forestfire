import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Phone, MapPin, Clock, Star, MessageCircle, AlertTriangle } from 'lucide-react';

interface VolunteerGroup {
  id: string;
  name: string;
  type: 'ngo' | 'community' | 'professional' | 'government';
  location: string;
  contactPerson: string;
  phone: string;
  email: string;
  specialization: string[];
  availability: '24/7' | 'daytime' | 'emergency_only';
  volunteers: number;
  rating: number;
  responseTime: number; // in minutes
  equipment: string[];
  recentOperations: number;
}

export const RescueCommunity: React.FC = () => {
  const [rescueGroups] = useState<VolunteerGroup[]>([
    {
      id: 'group-001',
      name: 'Uttarakhand Disaster Response Force',
      type: 'government',
      location: 'Dehradun Headquarters',
      contactPerson: 'Commandant Rajesh Singh',
      phone: '+91-135-2715000',
      email: 'udrf@gov.in',
      specialization: ['Search & Rescue', 'Medical Aid', 'Evacuation', 'Fire Fighting'],
      availability: '24/7',
      volunteers: 150,
      rating: 4.9,
      responseTime: 15,
      equipment: ['Rescue Vehicles', 'Medical Equipment', 'Communication Gear', 'Fire Equipment'],
      recentOperations: 23
    },
    {
      id: 'group-002',
      name: 'Himalayan Rescue Association',
      type: 'ngo',
      location: 'Nainital',
      contactPerson: 'Dr. Priya Sharma',
      phone: '+91-5942-235000',
      email: 'info@himalayanrescue.org',
      specialization: ['Mountain Rescue', 'Medical Emergency', 'Tourist Assistance'],
      availability: '24/7',
      volunteers: 85,
      rating: 4.8,
      responseTime: 25,
      equipment: ['Climbing Gear', 'Medical Kits', 'Communication Radios', 'Stretchers'],
      recentOperations: 18
    },
    {
      id: 'group-003',
      name: 'Corbett Wildlife Rescue Team',
      type: 'professional',
      location: 'Jim Corbett National Park',
      contactPerson: 'Shri Vikram Thapa',
      phone: '+91-5947-251000',
      email: 'rescue@corbett.gov.in',
      specialization: ['Wildlife Rescue', 'Forest Fire', 'Tourist Evacuation'],
      availability: '24/7',
      volunteers: 45,
      rating: 4.7,
      responseTime: 20,
      equipment: ['Wildlife Tranquilizers', 'Rescue Nets', 'First Aid', 'Forest Vehicles'],
      recentOperations: 12
    },
    {
      id: 'group-004',
      name: 'Kumaon Youth Volunteer Corps',
      type: 'community',
      location: 'Almora District',
      contactPerson: 'Smt. Sunita Bisht',
      phone: '+91-5962-230000',
      email: 'kyvc@community.org',
      specialization: ['Community Mobilization', 'Relief Distribution', 'Evacuation Support'],
      availability: 'daytime',
      volunteers: 200,
      rating: 4.5,
      responseTime: 35,
      equipment: ['Vehicles', 'Communication', 'Basic Medical', 'Food Supplies'],
      recentOperations: 15
    },
    {
      id: 'group-005',
      name: 'Garhwal Emergency Response Network',
      type: 'ngo',
      location: 'Pauri Garhwal',
      contactPerson: 'Shri Mohan Rawat',
      phone: '+91-1368-222000',
      email: 'gern@rescue.org',
      specialization: ['Emergency Response', 'Medical Aid', 'Disaster Relief'],
      availability: '24/7',
      volunteers: 120,
      rating: 4.6,
      responseTime: 30,
      equipment: ['Ambulances', 'Medical Equipment', 'Relief Supplies', 'Communication'],
      recentOperations: 20
    },
    {
      id: 'group-006',
      name: 'Dehradun Fire & Rescue Volunteers',
      type: 'community',
      location: 'Dehradun City',
      contactPerson: 'Shri Anil Kumar',
      phone: '+91-135-2715100',
      email: 'dfrv@volunteers.org',
      specialization: ['Fire Fighting', 'Urban Rescue', 'Emergency Medical'],
      availability: '24/7',
      volunteers: 75,
      rating: 4.4,
      responseTime: 18,
      equipment: ['Fire Extinguishers', 'Rescue Tools', 'Medical Kits', 'Safety Gear'],
      recentOperations: 28
    }
  ]);

  const [selectedGroup, setSelectedGroup] = useState<VolunteerGroup | null>(null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'government': return 'bg-blue-600 text-white';
      case 'ngo': return 'bg-green-600 text-white';
      case 'professional': return 'bg-purple-600 text-white';
      case 'community': return 'bg-orange-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case '24/7': return 'text-green-500';
      case 'daytime': return 'text-yellow-500';
      case 'emergency_only': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const requestRescue = (group: VolunteerGroup) => {
    const message = `EMERGENCY RESCUE REQUEST
    
Location: ${group.location}
Time: ${new Date().toLocaleString()}
Contact: ${group.contactPerson}
Phone: ${group.phone}

This is an urgent request for rescue assistance in forest fire emergency.
Please respond immediately.

Sanjeevani Forest Fire System`;

    // Open phone dialer
    window.open(`tel:${group.phone}`, '_self');
    
    // Also prepare SMS
    const smsUrl = `sms:${group.phone}?body=${encodeURIComponent(message)}`;
    setTimeout(() => {
      window.open(smsUrl, '_blank');
    }, 1000);
  };

  const sendEmail = (group: VolunteerGroup) => {
    const subject = `URGENT: Forest Fire Rescue Request - ${new Date().toLocaleString()}`;
    const body = `Dear ${group.contactPerson},

This is an urgent request for rescue assistance from the Sanjeevani Forest Fire Prediction System.

EMERGENCY DETAILS:
- Time: ${new Date().toLocaleString()}
- Location: Forest fire emergency in Uttarakhand region
- Required Assistance: ${group.specialization.join(', ')}
- Contact for coordination: Emergency Command Center

Please respond immediately and coordinate with local authorities.

Thank you for your service.

Sanjeevani AI Forest Fire System
Government of India`;

    window.open(`mailto:${group.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const totalVolunteers = rescueGroups.reduce((sum, group) => sum + group.volunteers, 0);
  const averageResponseTime = Math.round(rescueGroups.reduce((sum, group) => sum + group.responseTime, 0) / rescueGroups.length);
  const totalOperations = rescueGroups.reduce((sum, group) => sum + group.recentOperations, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-primary space-component">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-lg">
              <Heart className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-heading-2 font-bold text-white">🚑 RESCUE COMMUNITY</h2>
              <p className="text-body-small text-slate-400">Connect with rescue teams and volunteer organizations</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-400">{rescueGroups.length}</div>
            <p className="text-caption text-slate-400">Rescue Groups</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid-responsive grid-1-2-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">{totalVolunteers}</div>
          <div className="text-sm opacity-90">Total Volunteers</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">{averageResponseTime} min</div>
          <div className="text-sm opacity-90">Avg Response Time</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">{totalOperations}</div>
          <div className="text-sm opacity-90">Recent Operations</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 text-white text-center"
        >
          <div className="text-2xl font-bold">4.7</div>
          <div className="text-sm opacity-90">Avg Rating</div>
        </motion.div>
      </div>

      {/* Quick Access - Emergency Groups */}
      <div className="card-emergency space-component text-white">
        <h3 className="text-heading-3 font-bold mb-4">🚨 EMERGENCY RESCUE CONTACTS</h3>
        <div className="grid-responsive grid-1-2">
          {rescueGroups.filter(g => g.availability === '24/7' && g.rating >= 4.7).map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 rounded-lg p-4 border border-red-400"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-white">{group.name}</h4>
                  <p className="text-sm text-red-200">{group.contactPerson}</p>
                  <p className="text-xs text-red-300">{group.location}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getTypeColor(group.type)}`}>
                    {group.type.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400" size={12} />
                    <span className="text-yellow-400 text-sm font-bold">{group.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-blue-300" />
                  <span className="text-white">{group.volunteers} volunteers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-green-300" />
                  <span className="text-white">{group.responseTime} min response</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle size={14} className="text-orange-300" />
                  <span className="text-white">{group.recentOperations} recent ops</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => requestRescue(group)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={16} />
                  CALL NOW
                </button>
                <button
                  onClick={() => sendEmail(group)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  EMAIL
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* All Rescue Groups */}
      <div className="card-primary space-component">
        <h3 className="text-heading-3 font-bold text-white mb-4">All Rescue Organizations</h3>
        <div className="space-y-4">
          {rescueGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors cursor-pointer"
              onClick={() => setSelectedGroup(selectedGroup?.id === group.id ? null : group)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <Users className="text-red-400" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-white">{group.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(group.type)}`}>
                        {group.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-400" size={14} />
                        <span className="text-yellow-400 font-bold">{group.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-1">{group.contactPerson}</p>
                    <p className="text-xs text-slate-400 mb-2">{group.location}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users size={12} className="text-blue-400" />
                        <span className="text-blue-400">{group.volunteers} volunteers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-green-400" />
                        <span className="text-green-400">{group.responseTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} className={getAvailabilityColor(group.availability)} />
                        <span className={getAvailabilityColor(group.availability)}>
                          {group.availability.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      requestRescue(group);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                    title="Emergency Call"
                  >
                    <Phone size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sendEmail(group);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                    title="Send Email"
                  >
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedGroup?.id === group.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-slate-600"
                >
                  <div className="grid-responsive grid-1-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Specialization</h5>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {group.specialization.map((spec, idx) => (
                          <span key={idx} className="bg-green-600/20 text-green-400 text-xs px-2 py-1 rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                      
                      <h5 className="font-semibold text-white mb-2">Equipment</h5>
                      <div className="flex flex-wrap gap-1">
                        {group.equipment.map((eq, idx) => (
                          <span key={idx} className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded">
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-white mb-2">Contact Information</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-green-400" />
                          <span className="text-slate-300">{group.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle size={14} className="text-blue-400" />
                          <span className="text-slate-300">{group.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-orange-400" />
                          <span className="text-slate-300">{group.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => requestRescue(group)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone size={16} />
                      Emergency Call
                    </button>
                    <button
                      onClick={() => sendEmail(group)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={16} />
                      Send Email
                    </button>
                    <button
                      onClick={() => {
                        const whatsappUrl = `https://wa.me/${group.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Emergency rescue request from Sanjeevani Forest Fire System. Please respond immediately.`)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Emergency Protocol */}
      <div className="card-emergency space-component text-white">
        <h3 className="text-heading-3 font-bold mb-4">🚨 RESCUE REQUEST PROTOCOL</h3>
        <div className="grid-responsive grid-1-2-3">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Phone size={16} />
              Step 1: Immediate Contact
            </h4>
            <ul className="space-y-1 text-sm text-red-100">
              <li>• Call the nearest rescue group</li>
              <li>• Provide exact location coordinates</li>
              <li>• Describe the emergency situation</li>
              <li>• Give contact information</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <MapPin size={16} />
              Step 2: Location Details
            </h4>
            <ul className="space-y-1 text-sm text-red-100">
              <li>• Share GPS coordinates</li>
              <li>• Describe landmarks nearby</li>
              <li>• Mention access routes</li>
              <li>• Identify safe landing zones</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Heart size={16} />
              Step 3: Coordination
            </h4>
            <ul className="space-y-1 text-sm text-red-100">
              <li>• Stay in constant communication</li>
              <li>• Follow rescue team instructions</li>
              <li>• Prepare for evacuation</li>
              <li>• Assist other victims if safe</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};