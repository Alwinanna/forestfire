import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Phone, Send, Clock, CheckCircle, AlertTriangle, Zap, Gift, Globe, Bell } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

export const SMSPanel: React.FC = () => {
  const { sendSMSAlert, smsHistory, availableProviders } = useNotifications();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [isSending, setIsSending] = useState(false);

  const handleSendSMS = async () => {
    if (message.trim() && !isSending) {
      setIsSending(true);
      await sendSMSAlert(message, priority);
      setMessage('');
      setIsSending(false);
    }
  };

  const predefinedMessages = [
    {
      text: "🚨 CRITICAL: Forest fire detected in your area. Evacuate immediately to nearest safe zone.",
      priority: 'critical' as const
    },
    {
      text: "⚠️ HIGH ALERT: Fire risk elevated due to weather conditions. Stay vigilant.",
      priority: 'high' as const
    },
    {
      text: "🔥 EMERGENCY: Fire spreading rapidly. Emergency services deployed. Avoid affected areas.",
      priority: 'critical' as const
    },
    {
      text: "✅ ALL CLEAR: Fire contained. Normal activities can resume in cleared zones.",
      priority: 'low' as const
    },
    {
      text: "🌪️ WEATHER ALERT: High winds detected. Extreme fire danger conditions.",
      priority: 'high' as const
    },
    {
      text: "🚁 EVACUATION: Helicopter rescue in progress. Move to designated pickup points.",
      priority: 'critical' as const
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-black';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="text-green-500" size={16} />;
      case 'sent': return <Clock className="text-blue-500" size={16} />;
      case 'sending': return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'failed': return <AlertTriangle className="text-red-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  const successRate = smsHistory.length > 0 
    ? Math.round((smsHistory.filter(s => s.status === 'delivered').length / smsHistory.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header with FREE SMS Status */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Gift className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">🆓 FREE SMS Alert System</h2>
              <p className="text-green-100">Send emergency notifications at ZERO cost!</p>
            </div>
          </div>
          
          {/* Available Providers */}
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="text-yellow-300" size={16} />
              <span className="font-semibold">FREE ALERTS ACTIVE</span>
            </div>
            <p className="text-xs text-green-200">{availableProviders.length} free methods available</p>
          </div>
        </div>

        {/* Free Methods Available */}
        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Globe size={16} />
            Available FREE Alert Methods:
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {availableProviders.map((provider, index) => (
              <div key={index} className="bg-white/10 rounded px-2 py-1 text-center">
                {provider}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Info & Instructions */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="text-emerald-500" size={20} />
              <div>
                <p className="text-white font-medium">Target Phone: {user?.phone}</p>
                <p className="text-slate-400 text-sm">FREE alerts will be sent to this number</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600">
            <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
              <Bell size={16} />
              How FREE Alerts Work:
            </h4>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• 📱 Browser push notifications (instant)</li>
              <li>• 💬 WhatsApp Web (opens automatically)</li>
              <li>• 📧 Email-to-SMS gateways (carrier dependent)</li>
              <li>• 📨 TextBelt (1 free SMS per day)</li>
            </ul>
          </div>
        </div>

        {/* Send SMS Form */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Alert Priority
            </label>
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Message Content
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={3}
              placeholder="Enter your emergency alert message..."
              maxLength={160}
              disabled={isSending}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-slate-400">
                {message.length}/160 characters • 🆓 FREE
              </span>
              <button
                onClick={handleSendSMS}
                disabled={!message.trim() || isSending}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending FREE Alert...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send FREE Alert 🆓
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predefined Messages */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">🚀 Quick Alert Templates</h3>
          <div className="space-y-3">
            {predefinedMessages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-700/50 rounded-lg p-4 cursor-pointer hover:bg-slate-700 transition-colors border border-slate-600 hover:border-emerald-500"
                onClick={() => {
                  setMessage(msg.text);
                  setPriority(msg.priority);
                }}
              >
                <div className="flex items-start gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(msg.priority)}`}>
                    {msg.priority.toUpperCase()}
                  </span>
                  <p className="text-slate-300 text-sm flex-1">{msg.text}</p>
                  <span className="text-green-400 text-xs font-bold">FREE</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SMS History */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">📱 Recent FREE Alerts</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {smsHistory.length > 0 ? (
              smsHistory.map((sms) => (
                <motion.div
                  key={sms.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(sms.priority)}`}>
                      {sms.priority.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(sms.status)}
                      <span className="text-xs text-slate-400 capitalize">{sms.status}</span>
                      <span className="text-green-400 text-xs font-bold">FREE</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm mb-2">{sms.message}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>To: {sms.recipient}</span>
                    <span>{sms.timestamp.toLocaleString()}</span>
                  </div>
                  {sms.provider && (
                    <div className="text-xs text-slate-500 mt-1">
                      Method: {sms.provider} {sms.messageId && `• ID: ${sms.messageId.substring(0, 8)}...`}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto text-slate-600 mb-4" size={48} />
                <p className="text-slate-400">No FREE alerts sent yet</p>
                <p className="text-slate-500 text-sm mt-1">Start sending completely free emergency alerts!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FREE SMS Statistics */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">📊 FREE Alert Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg p-4 text-center text-white">
            <div className="text-2xl font-bold">{smsHistory.length}</div>
            <div className="text-sm opacity-90">Total FREE Alerts</div>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-center text-white">
            <div className="text-2xl font-bold">
              {smsHistory.filter(s => s.status === 'delivered').length}
            </div>
            <div className="text-sm opacity-90">Successfully Delivered</div>
          </div>
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 text-center text-white">
            <div className="text-2xl font-bold">
              {smsHistory.filter(s => s.priority === 'critical').length}
            </div>
            <div className="text-sm opacity-90">Critical Alerts</div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4 text-center text-white">
            <div className="text-2xl font-bold">{successRate}%</div>
            <div className="text-sm opacity-90">Success Rate</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-green-900/30 rounded-lg border border-green-600">
          <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
            <Gift size={16} />
            💰 Money Saved: $0.00 (All alerts are FREE!)
          </div>
          <p className="text-green-200 text-sm">
            You've sent {smsHistory.length} alerts completely free! Traditional SMS would have cost ~${(smsHistory.length * 0.05).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};