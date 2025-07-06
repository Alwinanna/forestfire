import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  LogOut, 
  Bell, 
  Settings, 
  Radio, 
  MapPin, 
  Satellite, 
  Database, 
  Brain, 
  FileImage,
  AlertTriangle,
  Activity,
  Users,
  Clock,
  Menu,
  X,
  Flame,
  Wind,
  Thermometer,
  Droplets,
  Eye,
  Zap,
  Navigation,
  Phone,
  Heart,
  Cloud,
  Scissors
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { SanjeevaniLogo } from './SanjeevaniLogo';
import { FirefighterCommandCenter } from './FirefighterCommandCenter';
import { UttarakhandPrototype } from './UttarakhandPrototype';
import { RiskMap } from './RiskMap';
import { AlertPanel } from './AlertPanel';
import { DataSources } from './DataSources';
import { MLArchitecture } from './MLArchitecture';
import { RasterOutput } from './RasterOutput';
import { AlertSystem } from './AlertSystem';
import { LiveEmergencyAlerts } from './LiveEmergencyAlerts';
import { ISROSatelliteMonitor } from './ISRO/ISROSatelliteMonitor';
import { FireWeatherIndex } from './ISRO/FireWeatherIndex';
import { RealTimeFireDetection } from './ISRO/RealTimeFireDetection';
import { PopulationRiskAssessment } from './ISRO/PopulationRiskAssessment';
import { EvacuationRoutes } from './Emergency/EvacuationRoutes';
import { EmergencyContacts } from './Emergency/EmergencyContacts';
import { LiveSatelliteView } from './Emergency/LiveSatelliteView';
import { RescueCommunity } from './Emergency/RescueCommunity';
import { RealTimeMLPrediction } from './Advanced/RealTimeMLPrediction';
import { CloudMLDashboard } from './CloudML/CloudMLDashboard';
import { FirebreakManagement } from './Firefighting/FirebreakManagement';
import { uttarakhandRegions, currentAlerts } from '../data/mockData';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { smsHistory, emailHistory } = useNotifications();
  const [activeTab, setActiveTab] = useState<'emergency' | 'cloud' | 'operations' | 'monitoring' | 'analytics' | 'data' | 'models' | 'reports' | 'alerts' | 'evacuation' | 'contacts' | 'satellite' | 'rescue' | 'advanced' | 'firebreaks'>('cloud');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'cloud', label: 'Cloud ML Pipeline', icon: Cloud, color: 'text-blue-500', priority: true },
    { id: 'emergency', label: 'Live Emergency', icon: AlertTriangle, color: 'text-red-500', priority: true },
    { id: 'advanced', label: 'Advanced ML', icon: Brain, color: 'text-purple-500', priority: true },
    { id: 'firebreaks', label: 'Firebreak Strategy', icon: Scissors, color: 'text-orange-500', priority: true },
    { id: 'operations', label: 'Operations', icon: Radio, color: 'text-red-500' },
    { id: 'monitoring', label: 'ISRO Satellites', icon: Satellite, color: 'text-blue-500' },
    { id: 'evacuation', label: 'Evacuation Routes', icon: Navigation, color: 'text-green-500' },
    { id: 'contacts', label: 'Emergency Contacts', icon: Phone, color: 'text-orange-500' },
    { id: 'satellite', label: 'Live Satellite View', icon: Eye, color: 'text-purple-500' },
    { id: 'rescue', label: 'Rescue Community', icon: Heart, color: 'text-pink-500' },
    { id: 'analytics', label: 'Risk Analytics', icon: MapPin, color: 'text-orange-500' },
    { id: 'data', label: 'Data Sources', icon: Database, color: 'text-green-500' },
    { id: 'models', label: 'AI Models', icon: Brain, color: 'text-purple-500' },
    { id: 'reports', label: 'Reports', icon: FileImage, color: 'text-indigo-500' },
    { id: 'alerts', label: 'Alert System', icon: AlertTriangle, color: 'text-yellow-500' }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'from-blue-600 to-blue-700';
      case 'firefighter': return 'from-red-600 to-red-700';
      case 'observer': return 'from-green-600 to-green-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const totalAlerts = smsHistory.length + emailHistory.length;
  const activeIncidents = currentAlerts.filter(alert => !alert.acknowledged).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Professional Mobile-First Header */}
      <header className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50 shadow-xl safe-top">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="mobile-tap-target text-slate-400 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Sanjeevani Logo & Title */}
            <div className="flex items-center gap-3 flex-1 md:flex-none">
              <SanjeevaniLogo size="sm" animated={true} variant="icon" />
              <div className="hidden sm:block">
                <h1 className="text-heading-3 font-bold text-white gradient-text">SANJEEVANI</h1>
                <p className="text-caption text-slate-400">ISRO Forest Fire System</p>
              </div>
            </div>

            {/* Live Status Indicators - Mobile Optimized */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <div className="status-online"></div>
                  <span className="text-body-small font-medium text-emerald-400">CLOUD LIVE</span>
                </div>
                <p className="text-caption text-slate-400">{currentTime.toLocaleTimeString()}</p>
              </div>
              
              <div className="text-right">
                <p className="text-body-small font-medium text-white">{activeIncidents} Active</p>
                <p className="text-caption text-slate-400">{totalAlerts} Alerts</p>
              </div>
            </div>

            {/* User Profile & Actions */}
            <div className="flex items-center gap-2">
              {/* Alert Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="mobile-tap-target text-slate-400 hover:text-white transition-colors relative"
                  aria-label="View notifications"
                >
                  <Bell size={20} />
                  {totalAlerts > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-caption rounded-full flex items-center justify-center animate-pulse">
                      {totalAlerts > 99 ? '99+' : totalAlerts}
                    </span>
                  )}
                </button>
                
                {/* Mobile-Optimized Notification Dropdown */}
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-12 w-80 max-w-[90vw] card-primary z-50"
                  >
                    <div className="space-component border-b border-slate-700">
                      <h3 className="text-heading-3 font-semibold text-white">Emergency Alerts</h3>
                      <p className="text-body-small text-slate-400">{totalAlerts} notifications</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {totalAlerts > 0 ? (
                        [...smsHistory.slice(0, 3), ...emailHistory.slice(0, 2)].map((alert) => (
                          <div key={alert.id} className="space-element border-b border-slate-700 last:border-b-0">
                            <div className="flex items-start gap-2">
                              <AlertTriangle size={16} className="text-red-500 mt-1 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-body-small text-white truncate">{alert.message}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-caption text-slate-400">
                                    {alert.timestamp.toLocaleTimeString()}
                                  </span>
                                  <span className={`badge-${alert.status === 'delivered' ? 'primary' : alert.status === 'sent' ? 'info' : 'warning'}`}>
                                    {alert.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="space-component text-center text-slate-400">
                          <Bell className="mx-auto mb-2" size={32} />
                          <p className="text-body-small">No alerts</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* User Profile - Mobile Optimized */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 bg-gradient-to-r ${getRoleColor(user?.role || '')} rounded-full flex items-center justify-center text-white font-bold text-caption`}>
                  {user?.avatar || user?.name?.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <p className="text-body-small font-medium text-white">{user?.name}</p>
                  <p className="text-caption text-slate-400 truncate max-w-32">{user?.department}</p>
                </div>
              </div>

              {/* Settings & Logout */}
              <div className="flex items-center gap-1">
                <button 
                  className="mobile-tap-target text-slate-400 hover:text-white transition-colors"
                  aria-label="Settings"
                >
                  <Settings size={18} />
                </button>
                <button
                  onClick={logout}
                  className="mobile-tap-target text-slate-400 hover:text-red-400 transition-colors"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          className="fixed inset-0 z-40 md:hidden"
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
          <div className="relative w-80 max-w-[85vw] h-full bg-slate-800 border-r border-slate-700 overflow-y-auto safe-left">
            <div className="space-component border-b border-slate-700">
              <SanjeevaniLogo size="md" animated={true} />
            </div>
            <div className="space-element">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-professional font-medium transition-all mb-1 ${
                    activeTab === tab.id
                      ? 'card-success text-white shadow-professional'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : tab.color} />
                  <span className="flex-1 text-left text-body">{tab.label}</span>
                  {tab.id === 'emergency' && activeIncidents > 0 && (
                    <span className="badge-danger animate-pulse">
                      {activeIncidents}
                    </span>
                  )}
                  {tab.id === 'alerts' && totalAlerts > 0 && (
                    <span className="badge-primary">
                      {totalAlerts}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Desktop Navigation Tabs */}
      <div className="hidden md:block bg-slate-800/50 border-b border-slate-700">
        <div className="container-responsive">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-professional font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'card-success text-white shadow-professional'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-white' : tab.color} />
                <span className="text-body">{tab.label}</span>
                {tab.id === 'emergency' && activeIncidents > 0 && (
                  <span className="badge-danger animate-pulse">
                    {activeIncidents}
                  </span>
                )}
                {tab.id === 'alerts' && totalAlerts > 0 && (
                  <span className="badge-primary">
                    {totalAlerts}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Status Bar - Mobile Optimized */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-b border-blue-500/30">
        <div className="container-responsive">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4 overflow-x-auto">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Activity className="text-blue-500" size={16} />
                <span className="text-body-small text-blue-400 font-semibold">CLOUD ML LIVE</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Users className="text-purple-500" size={16} />
                <span className="text-body-small text-purple-400">Real-Time Satellite</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Clock className="text-green-500" size={16} />
                <span className="text-body-small text-green-400">Auto-Pipeline: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="text-caption text-slate-400 hidden sm:block">
              Guardian: {user?.employeeId}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <main className="container-responsive space-section safe-bottom">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'cloud' && <CloudMLDashboard />}
          {activeTab === 'emergency' && <LiveEmergencyAlerts />}
          {activeTab === 'advanced' && <RealTimeMLPrediction />}
          {activeTab === 'firebreaks' && <FirebreakManagement />}
          {activeTab === 'operations' && <FirefighterCommandCenter />}
          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <ISROSatelliteMonitor />
              <div className="grid-responsive grid-1-2">
                <FireWeatherIndex />
                <RealTimeFireDetection />
              </div>
              <PopulationRiskAssessment />
            </div>
          )}
          {activeTab === 'evacuation' && <EvacuationRoutes />}
          {activeTab === 'contacts' && <EmergencyContacts />}
          {activeTab === 'satellite' && <LiveSatelliteView />}
          {activeTab === 'rescue' && <RescueCommunity />}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid-responsive grid-1-2-3">
                <div className="lg:col-span-2">
                  <div className="card-primary space-component">
                    <h2 className="text-heading-2 font-bold text-white mb-4">Risk Assessment Map</h2>
                    <div className="h-64 sm:h-96">
                      <RiskMap
                        riskData={uttarakhandRegions}
                        selectedRegion="nainital-1"
                        onRegionSelect={() => {}}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <AlertPanel
                    alerts={currentAlerts}
                    onAcknowledge={() => {}}
                  />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'data' && <DataSources />}
          {activeTab === 'models' && <MLArchitecture />}
          {activeTab === 'reports' && <RasterOutput predictions={[]} region="uttarakhand" />}
          {activeTab === 'alerts' && <AlertSystem />}
        </motion.div>
      </main>
    </div>
  );
};