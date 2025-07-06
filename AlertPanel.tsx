import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Users, Clock, MapPin, CheckCircle, Flame, Wind, Thermometer } from 'lucide-react';
import { AlertData } from '../types';
import { VoiceAlert } from './VoiceAlert';
import { format } from 'date-fns';

interface AlertPanelProps {
  alerts: AlertData[];
  onAcknowledge: (alertId: string) => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onAcknowledge }) => {
  const getAlertColor = (level: string) => {
    switch (level) {
      case 'emergency': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'critical': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'warning': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-800/20';
    }
  };

  const getAlertIcon = (level: string) => {
    const iconClass = level === 'emergency' ? 'text-red-600' : 
                     level === 'critical' ? 'text-orange-600' : 'text-yellow-600';
    return <AlertTriangle className={iconClass} size={24} />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Active Alerts</h2>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-slate-400">Live Monitoring</span>
        </div>
      </div>

      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`border-2 rounded-xl p-4 sm:p-6 ${getAlertColor(alert.level)} ${
              alert.level === 'emergency' ? 'shadow-lg shadow-red-200 dark:shadow-red-900/50' : 'shadow-md'
            } bg-slate-800/90 backdrop-blur-sm border-slate-600`}
          >
            <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
              <div className="flex items-center gap-3">
                {getAlertIcon(alert.level)}
                <div>
                  <h3 className="text-lg font-bold text-white">{alert.level.toUpperCase()}</h3>
                  <p className="text-sm text-slate-300 flex items-center gap-1">
                    <MapPin size={14} />
                    {alert.location}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <VoiceAlert alert={alert} isActive={!alert.acknowledged} />
                {!alert.acknowledged && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                  >
                    <CheckCircle size={16} />
                    Acknowledge
                  </button>
                )}
              </div>
            </div>

            <p className="text-slate-200 mb-4 text-sm sm:text-base">{alert.message}</p>

            {/* Mobile-Optimized Impact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={16} className="text-blue-400" />
                  <span className="text-sm font-medium text-slate-300">Population Impact</span>
                </div>
                <p className="text-xl font-bold text-blue-400">{alert.estimatedImpact.estimatedAffected.toLocaleString()}</p>
                <p className="text-xs text-slate-400">{alert.estimatedImpact.settlements} settlements affected</p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={16} className="text-orange-400" />
                  <span className="text-sm font-medium text-slate-300">Evacuation Time</span>
                </div>
                <p className="text-xl font-bold text-orange-400">{alert.estimatedImpact.evacuationTime} min</p>
                <p className="text-xs text-slate-400">Recommended window</p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={16} className="text-red-400" />
                  <span className="text-sm font-medium text-slate-300">6h Casualties</span>
                </div>
                <p className="text-xl font-bold text-red-400">
                  {alert.predictions.find(p => p.timeHour === 6)?.estimatedCasualties.mostLikely || 0}
                </p>
                <p className="text-xs text-slate-400">Most likely estimate</p>
              </div>
            </div>

            {/* Hourly Predictions - Mobile Scrollable */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Hourly Predictions</h4>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {alert.predictions.slice(0, 4).map((prediction, index) => (
                  <div key={index} className="bg-slate-700/30 rounded-lg p-3 min-w-[120px] flex-shrink-0">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 mb-1">{prediction.timeHour}h</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 justify-center">
                          <Users size={12} className="text-orange-400" />
                          <span className="text-xs text-orange-400">{prediction.populationAtRisk.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 justify-center">
                          <Flame size={12} className="text-red-400" />
                          <span className="text-xs text-red-400">{prediction.affectedArea} km²</span>
                        </div>
                        <div className="flex items-center gap-1 justify-center">
                          <AlertTriangle size={12} className="text-yellow-400" />
                          <span className="text-xs text-yellow-400">{prediction.estimatedCasualties.mostLikely}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500">
              Last updated: {format(alert.timestamp, 'HH:mm:ss dd/MM/yyyy')}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {alerts.length === 0 && (
        <div className="text-center py-12 bg-green-900/20 rounded-xl border border-green-600/30">
          <CheckCircle className="mx-auto text-green-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-green-300">All Clear</h3>
          <p className="text-green-400">No active fire alerts in Uttarakhand region</p>
        </div>
      )}
    </div>
  );
};