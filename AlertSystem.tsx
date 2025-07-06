import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Send, Users, MapPin, Clock, Shield, Zap, Phone, Mail } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

export const AlertSystem: React.FC = () => {
  const { sendSMSAlert, sendEmailAlert, smsHistory, emailHistory } = useNotifications();
  const { user } = useAuth();
  const [alertType, setAlertType] = useState<'evacuation' | 'warning' | 'all-clear' | 'custom'>('warning');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [targetArea, setTargetArea] = useState<string>('uttarakhand-region');
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const alertTemplates = {
    evacuation: {
      message: "IMMEDIATE EVACUATION REQUIRED: Forest fire detected in your area. Move to designated safe zones immediately. Follow evacuation routes and emergency personnel instructions.",
      priority: 'critical' as const,
      icon: '🚨'
    },
    warning: {
      message: "FIRE DANGER WARNING: High fire risk conditions detected. Avoid forest areas, report any smoke or fire immediately. Stay alert for further updates.",
      priority: 'high' as const,
      icon: '⚠️'
    },
    'all-clear': {
      message: "ALL CLEAR: Fire threat has been contained. Normal activities may resume in cleared areas. Continue to follow local authority guidance.",
      priority: 'low' as const,
      icon: '✅'
    },
    custom: {
      message: customMessage,
      priority: priority,
      icon: '📢'
    }
  };

  const targetAreas = [
    { id: 'uttarakhand-region', name: 'Uttarakhand Region', population: 45000 },
    { id: 'jim-corbett', name: 'Jim Corbett National Park', population: 12000 },
    { id: 'nainital-district', name: 'Nainital District', population: 28000 },
    { id: 'dehradun-region', name: 'Dehradun Region', population: 35000 },
    { id: 'haridwar-area', name: 'Haridwar Area', population: 22000 }
  ];

  const handleSendAlert = async () => {
    if (isSending) return;

    const template = alertTemplates[alertType];
    const message = alertType === 'custom' ? customMessage : template.message;
    
    if (!message.trim()) return;

    setIsSending(true);

    try {
      // Send both SMS and Email alerts
      await Promise.all([
        sendSMSAlert(message, template.priority),
        sendEmailAlert(message, template.priority)
      ]);
    } catch (error) {
      console.error('Failed to send alerts:', error);
    }

    setIsSending(false);
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

  const selectedArea = targetAreas.find(area => area.id === targetArea);
  const totalAlerts = smsHistory.length + emailHistory.length;
  const successfulAlerts = [...smsHistory, ...emailHistory].filter(alert => alert.status === 'delivered').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <AlertTriangle className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Emergency Alert System</h2>
              <p className="text-red-100">Mass notification system for forest fire emergencies</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="text-yellow-300" size={16} />
              <span className="font-semibold">AUTHORIZED OPERATOR</span>
            </div>
            <p className="text-xs text-red-200">{user?.name} • {user?.employeeId}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Composition */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-6">Compose Alert</h3>
          
          {/* Alert Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">Alert Type</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(alertTemplates).map(([type, template]) => (
                <button
                  key={type}
                  onClick={() => setAlertType(type as any)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    alertType === type
                      ? 'bg-orange-600 text-white border-2 border-orange-400'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{template.icon}</span>
                    <span className="capitalize">{type.replace('-', ' ')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Target Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Target Area</label>
            <select
              value={targetArea}
              onChange={(e) => setTargetArea(e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {targetAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name} ({area.population.toLocaleString()} people)
                </option>
              ))}
            </select>
          </div>

          {/* Priority Level */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Priority Level</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high', 'critical'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    priority === p
                      ? getPriorityColor(p)
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Message Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Message Content</label>
            {alertType === 'custom' ? (
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={4}
                placeholder="Enter custom alert message..."
                maxLength={160}
              />
            ) : (
              <div className="p-3 bg-slate-700/30 border border-slate-600 rounded-lg text-slate-300">
                {alertTemplates[alertType].message}
              </div>
            )}
            <div className="text-xs text-slate-400 mt-1">
              {alertType === 'custom' ? `${customMessage.length}/160 characters` : 'Pre-defined message template'}
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendAlert}
            disabled={isSending || (alertType === 'custom' && !customMessage.trim())}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 rounded-lg font-bold hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isSending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending Emergency Alert...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Send size={20} />
                SEND EMERGENCY ALERT
              </div>
            )}
          </button>

          {/* Alert Preview */}
          {selectedArea && (
            <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-600">
              <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                <Zap size={16} />
                Alert Preview
              </h4>
              <div className="text-blue-200 text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>Target: {selectedArea.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  <span>Population: {selectedArea.population.toLocaleString()} people</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} />
                  <span>Priority: {priority.toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alert History & Statistics */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Alert Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-center text-white">
                <div className="text-2xl font-bold">{totalAlerts}</div>
                <div className="text-sm opacity-90">Total Alerts Sent</div>
              </div>
              <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 text-center text-white">
                <div className="text-2xl font-bold">{successfulAlerts}</div>
                <div className="text-sm opacity-90">Successfully Delivered</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-green-900/30 rounded-lg border border-green-600">
              <div className="flex items-center gap-2 text-green-400 font-semibold mb-1">
                <Shield size={16} />
                System Status: OPERATIONAL
              </div>
              <p className="text-green-200 text-sm">
                All communication channels active. Success rate: {totalAlerts > 0 ? Math.round((successfulAlerts / totalAlerts) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-4">Recent Alerts</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {[...smsHistory.slice(0, 3), ...emailHistory.slice(0, 2)].map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-slate-700/50 rounded-lg p-3 border border-slate-600"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                      {alert.priority.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2">
                      {'recipient' in alert && alert.recipient.includes('@') ? (
                        <Mail className="text-blue-500" size={14} />
                      ) : (
                        <Phone className="text-green-500" size={14} />
                      )}
                      <span className="text-xs text-slate-400 capitalize">{alert.status}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{alert.message}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>To: {alert.recipient}</span>
                    <span>{alert.timestamp.toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
              
              {totalAlerts === 0 && (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto text-slate-600 mb-4" size={48} />
                  <p className="text-slate-400">No alerts sent yet</p>
                  <p className="text-slate-500 text-sm mt-1">Emergency alerts will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};