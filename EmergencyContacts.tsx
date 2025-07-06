import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Radio, Shield, Users, MapPin, Clock, Star } from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  alternatePhone?: string;
  jurisdiction: string;
  priority: 'critical' | 'high' | 'medium';
  availability: '24/7' | 'office_hours' | 'emergency_only';
  specialization: string[];
}

export const EmergencyContacts: React.FC = () => {
  const [contacts] = useState<EmergencyContact[]>([
    {
      id: 'contact-001',
      name: 'Shri Rajesh Kumar IFS',
      designation: 'Chief Conservator of Forests',
      department: 'Uttarakhand Forest Department',
      phone: '+91-135-2715432',
      email: 'ccf.uttarakhand@gov.in',
      alternatePhone: '+91-9412345678',
      jurisdiction: 'Entire Uttarakhand State',
      priority: 'critical',
      availability: '24/7',
      specialization: ['Forest Fire Management', 'Wildlife Protection', 'Emergency Coordination']
    },
    {
      id: 'contact-002',
      name: 'Dr. Priya Sharma IPS',
      designation: 'Director General of Police',
      department: 'Uttarakhand Police',
      phone: '+91-135-2715555',
      email: 'dgp.uttarakhand@gov.in',
      alternatePhone: '+91-9412345679',
      jurisdiction: 'Law & Order, Emergency Response',
      priority: 'critical',
      availability: '24/7',
      specialization: ['Emergency Response', 'Evacuation Coordination', 'Traffic Management']
    },
    {
      id: 'contact-003',
      name: 'Wing Commander Amit Singh',
      designation: 'Air Force Station Commander',
      department: 'Indian Air Force - Dehradun',
      phone: '+91-135-2715666',
      email: 'afs.dehradun@iaf.gov.in',
      alternatePhone: '+91-9412345680',
      jurisdiction: 'Aerial Operations & Rescue',
      priority: 'critical',
      availability: '24/7',
      specialization: ['Helicopter Rescue', 'Aerial Firefighting', 'Medical Evacuation']
    },
    {
      id: 'contact-004',
      name: 'Dr. Kavita Devi',
      designation: 'District Magistrate',
      department: 'Nainital District Administration',
      phone: '+91-5942-235678',
      email: 'dm.nainital@gov.in',
      alternatePhone: '+91-9412345681',
      jurisdiction: 'Nainital District',
      priority: 'high',
      availability: '24/7',
      specialization: ['District Coordination', 'Relief Operations', 'Civil Administration']
    },
    {
      id: 'contact-005',
      name: 'Shri Vikram Thapa',
      designation: 'Divisional Forest Officer',
      department: 'Jim Corbett National Park',
      phone: '+91-5947-251234',
      email: 'dfo.corbett@gov.in',
      alternatePhone: '+91-9412345682',
      jurisdiction: 'Jim Corbett National Park',
      priority: 'high',
      availability: '24/7',
      specialization: ['Wildlife Rescue', 'Park Operations', 'Tourist Safety']
    },
    {
      id: 'contact-006',
      name: 'Dr. Sunita Rawat',
      designation: 'Chief Medical Officer',
      department: 'Uttarakhand Health Services',
      phone: '+91-135-2715777',
      email: 'cmo.uttarakhand@gov.in',
      alternatePhone: '+91-9412345683',
      jurisdiction: 'Medical Emergency Response',
      priority: 'high',
      availability: '24/7',
      specialization: ['Emergency Medicine', 'Disaster Medical Response', 'Burn Treatment']
    },
    {
      id: 'contact-007',
      name: 'Shri Mohan Bisht',
      designation: 'Fire Services Director',
      department: 'Uttarakhand Fire & Emergency Services',
      phone: '+91-135-2715888',
      email: 'fire.uttarakhand@gov.in',
      alternatePhone: '+91-9412345684',
      jurisdiction: 'Fire Fighting Operations',
      priority: 'critical',
      availability: '24/7',
      specialization: ['Fire Suppression', 'Rescue Operations', 'Emergency Response']
    },
    {
      id: 'contact-008',
      name: 'Dr. Anil Kumar',
      designation: 'ISRO Regional Director',
      department: 'ISRO - Northern Region',
      phone: '+91-135-2715999',
      email: 'director.north@isro.gov.in',
      alternatePhone: '+91-9412345685',
      jurisdiction: 'Satellite Monitoring & Data',
      priority: 'high',
      availability: 'office_hours',
      specialization: ['Satellite Data', 'Remote Sensing', 'Fire Detection']
    }
  ]);

  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-black';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case '24/7': return 'text-green-500';
      case 'office_hours': return 'text-yellow-500';
      case 'emergency_only': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const makeCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const sendEmail = (email: string, subject: string = 'Forest Fire Emergency') => {
    window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}`, '_blank');
  };

  const criticalContacts = contacts.filter(c => c.priority === 'critical');
  const highPriorityContacts = contacts.filter(c => c.priority === 'high');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-emergency space-component text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Phone className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-heading-2 font-bold">🚨 EMERGENCY CONTACTS</h2>
              <p className="text-body-small text-red-100">Direct access to higher officials and rescue teams</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-caption text-red-200">Officials Available</p>
          </div>
        </div>
      </div>

      {/* Quick Access - Critical Contacts */}
      <div className="card-primary space-component">
        <h3 className="text-heading-3 font-bold text-white mb-4 flex items-center gap-2">
          <Star className="text-yellow-500" size={20} />
          Critical Emergency Contacts
        </h3>
        <div className="grid-responsive grid-1-2">
          {criticalContacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-red-900/30 rounded-lg p-4 border border-red-600"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-white">{contact.name}</h4>
                  <p className="text-sm text-red-300">{contact.designation}</p>
                  <p className="text-xs text-red-400">{contact.department}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(contact.priority)}`}>
                  {contact.priority.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-slate-400" />
                  <span className="text-slate-300">{contact.jurisdiction}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className={getAvailabilityColor(contact.availability)} />
                  <span className={getAvailabilityColor(contact.availability)}>
                    {contact.availability.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => makeCall(contact.phone)}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={16} />
                  Call Now
                </button>
                <button
                  onClick={() => sendEmail(contact.email)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Mail size={16} />
                  Email
                </button>
              </div>

              {contact.alternatePhone && (
                <button
                  onClick={() => makeCall(contact.alternatePhone!)}
                  className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={16} />
                  Alternate: {contact.alternatePhone}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* All Emergency Contacts */}
      <div className="card-primary space-component">
        <h3 className="text-heading-3 font-bold text-white mb-4">All Emergency Officials</h3>
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-700/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors cursor-pointer"
              onClick={() => setSelectedContact(selectedContact?.id === contact.id ? null : contact)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 bg-blue-600/20 rounded-lg">
                    <Shield className="text-blue-400" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-white">{contact.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                        {contact.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-1">{contact.designation}</p>
                    <p className="text-xs text-slate-400 mb-2">{contact.department}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Phone size={12} className="text-green-500" />
                        <span className="text-green-400">{contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} className={getAvailabilityColor(contact.availability)} />
                        <span className={getAvailabilityColor(contact.availability)}>
                          {contact.availability.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      makeCall(contact.phone);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                    title="Call Now"
                  >
                    <Phone size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sendEmail(contact.email);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                    title="Send Email"
                  >
                    <Mail size={16} />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedContact?.id === contact.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-slate-600"
                >
                  <div className="grid-responsive grid-1-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Contact Information</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-blue-400" />
                          <span className="text-slate-300">{contact.email}</span>
                        </div>
                        {contact.alternatePhone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-green-400" />
                            <span className="text-slate-300">Alt: {contact.alternatePhone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-orange-400" />
                          <span className="text-slate-300">{contact.jurisdiction}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-white mb-2">Specialization</h5>
                      <div className="flex flex-wrap gap-1">
                        {contact.specialization.map((spec, idx) => (
                          <span key={idx} className="bg-purple-600/20 text-purple-400 text-xs px-2 py-1 rounded">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => makeCall(contact.phone)}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone size={16} />
                      Call Primary
                    </button>
                    {contact.alternatePhone && (
                      <button
                        onClick={() => makeCall(contact.alternatePhone!)}
                        className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Phone size={16} />
                        Call Alt
                      </button>
                    )}
                    <button
                      onClick={() => sendEmail(contact.email, `URGENT: Forest Fire Emergency - ${new Date().toLocaleString()}`)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail size={16} />
                      Emergency Email
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Emergency Protocols */}
      <div className="card-emergency space-component text-white">
        <h3 className="text-heading-3 font-bold mb-4">🚨 EMERGENCY COMMUNICATION PROTOCOL</h3>
        <div className="grid-responsive grid-1-2-3">
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Radio size={16} />
              Immediate Response (0-5 min)
            </h4>
            <ul className="space-y-1 text-sm text-red-100">
              <li>• Call Fire Services Director</li>
              <li>• Alert Chief Conservator of Forests</li>
              <li>• Notify District Magistrate</li>
              <li>• Contact Air Force for aerial support</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Users size={16} />
              Coordination (5-15 min)
            </h4>
            <ul className="space-y-1 text-sm text-red-100">
              <li>• Establish command center</li>
              <li>• Coordinate with local DFO</li>
              <li>• Alert medical emergency services</li>
              <li>• Notify ISRO for satellite monitoring</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Shield size={16} />
              Sustained Operations (15+ min)
            </h4>
            <ul className="space-y-1 text-sm text-red-100">
              <li>• Regular status updates</li>
              <li>• Resource allocation coordination</li>
              <li>• Media and public communication</li>
              <li>• Inter-state assistance if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};