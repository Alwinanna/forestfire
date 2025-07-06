import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Shield, Satellite, Users, Mail, Lock, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SanjeevaniLogo } from './SanjeevaniLogo';

interface LoginForm {
  email: string;
  password: string;
  employeeId: string;
}

export const LoginScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    await login(data.email, data.password, data.employeeId);
    setIsLoading(false);
  };

  const authorizedPersonnel = [
    {
      role: 'Forest Department Director',
      email: 'director@forest.gov.in',
      password: 'ForestDir2024',
      employeeId: 'FD001',
      icon: '👨‍💼',
      color: 'from-blue-600 to-blue-700',
      clearance: 'Level 5'
    },
    {
      role: 'Fire Operations Chief',
      email: 'fireops@emergency.gov.in',
      password: 'FireOps2024',
      employeeId: 'FO001',
      icon: '👩‍🚒',
      color: 'from-red-600 to-red-700',
      clearance: 'Level 4'
    },
    {
      role: 'ISRO Satellite Analyst',
      email: 'analyst@isro.gov.in',
      password: 'ISRO2024',
      employeeId: 'IS001',
      icon: '🛰️',
      color: 'from-purple-600 to-purple-700',
      clearance: 'Level 3'
    },
    {
      role: 'Field Observer',
      email: 'observer@forest.gov.in',
      password: 'Observer2024',
      employeeId: 'OB001',
      icon: '👨‍🔬',
      color: 'from-green-600 to-green-700',
      clearance: 'Level 2'
    }
  ];

  const fillCredentials = (cred: typeof authorizedPersonnel[0]) => {
    setValue('email', cred.email);
    setValue('password', cred.password);
    setValue('employeeId', cred.employeeId);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Sanjeevani Sacred Herb Mythology */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 via-emerald-900 to-green-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-green-900/30 to-yellow-900/20"></div>
        
        {/* Sacred Floating Particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Government Emblem */}
        <div className="absolute top-8 left-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
            <Shield className="text-white" size={24} />
          </div>
          <div className="text-white">
            <div className="text-sm font-bold">GOVERNMENT OF INDIA</div>
            <div className="text-xs opacity-80">Ministry of Environment & Forests</div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Sanjeevani Sacred Herb Logo */}
            <div className="mb-12 text-center">
              <SanjeevaniLogo size="xl" animated={true} />
              <motion.div 
                className="mt-8 p-6 bg-gradient-to-r from-emerald-900/50 to-green-900/50 rounded-xl border border-emerald-500/30 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <h3 className="text-lg font-bold text-yellow-300 mb-3">🌿 The Sacred Ramayana Legend</h3>
                <div className="text-emerald-200 text-sm leading-relaxed space-y-2">
                  <p>
                    When Lakshmana fell unconscious from Indrajit's arrow, mighty Hanuman flew to Dronagiri mountain to fetch the 
                    <span className="text-yellow-300 font-semibold"> Sanjeevani herb</span> - the divine medicine that conquers death.
                  </p>
                  <p className="text-yellow-200 text-xs mt-3 italic">
                    "Unable to identify the specific herb, Hanuman carried the entire mountain to Lanka, saving Lakshmana's life."
                  </p>
                </div>
              </motion.div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Satellite size={28} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Divine Vision Technology</h3>
                  <p className="text-emerald-300">ISRO satellites watch over forests like celestial guardians</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <AlertTriangle size={28} className="text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Prophetic Intelligence</h3>
                  <p className="text-emerald-300">AI models predict fire with ancient wisdom and modern precision</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Users size={28} className="text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Life Protection Mission</h3>
                  <p className="text-emerald-300">Saving lives and forests, continuing Sanjeevani's sacred legacy</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gradient-to-r from-red-900/40 to-orange-900/40 rounded-lg border border-red-500/30">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="text-red-400" size={24} />
                <span className="text-red-400 font-bold">SACRED SYSTEM - AUTHORIZED ACCESS ONLY</span>
              </div>
              <p className="text-sm text-red-200">
                This divine technology protects our sacred forests. Like the Sanjeevani herb, 
                it must be used only by those pure of heart and authorized by the realm.
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Sacred Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
      </div>

      {/* Right Side - Sacred Access Portal */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 bg-slate-900">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md mx-auto w-full"
        >
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <SanjeevaniLogo size="lg" animated={true} />
            <div className="text-white mt-4">
              <div className="text-sm font-bold">GOVERNMENT OF INDIA</div>
              <div className="text-xs opacity-80">Forest Fire Prediction System</div>
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">SACRED ACCESS PORTAL</h2>
              <p className="text-slate-400">Authorized Guardians Only</p>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-yellow-500 rounded mx-auto mt-3"></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Sacred Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    {...register('email', { 
                      required: 'Sacred email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email format'
                      }
                    })}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="your.name@gov.in"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Employee ID Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Guardian ID
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    {...register('employeeId', { 
                      required: 'Guardian ID is required',
                      pattern: {
                        value: /^[A-Z]{2}\d{3}$/,
                        message: 'Format: XX000 (e.g., FD001)'
                      }
                    })}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="FD001"
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
                {errors.employeeId && (
                  <p className="mt-1 text-sm text-red-400">{errors.employeeId.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Sacred Mantra (Password)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    {...register('password', { 
                      required: 'Sacred mantra is required',
                      minLength: {
                        value: 8,
                        message: 'Mantra must be at least 8 characters'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter your sacred mantra"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-yellow-600 text-white py-3 px-4 rounded-lg font-bold hover:from-emerald-700 hover:via-green-700 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Invoking Sacred Access...
                  </div>
                ) : (
                  '🌿 ENTER SANJEEVANI REALM'
                )}
              </button>
            </form>

            {/* Authorized Personnel */}
            <div className="mt-8 pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-4 text-center">Sacred Guardians of the Forest</p>
              <div className="space-y-2">
                {authorizedPersonnel.map((person, index) => (
                  <div 
                    key={index} 
                    className={`p-3 bg-gradient-to-r ${person.color} rounded-lg text-white text-xs cursor-pointer hover:opacity-90 transition-opacity border border-white/20`}
                    onClick={() => fillCredentials(person)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{person.icon}</span>
                        <span className="font-bold">{person.role}</span>
                      </div>
                      <span className="bg-white/20 px-2 py-1 rounded text-xs">
                        {person.clearance}
                      </span>
                    </div>
                    <div className="space-y-1 text-white/90 text-xs">
                      <div>📧 {person.email}</div>
                      <div>🔒 {person.password}</div>
                      <div>🆔 {person.employeeId}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sacred Security Notice */}
            <div className="mt-6 p-4 bg-emerald-900/30 rounded-lg border border-emerald-500/30">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold mb-2">
                <Shield size={16} />
                SACRED PROTECTION NOTICE
              </div>
              <div className="text-emerald-200 text-xs space-y-1">
                <div>• All access blessed and monitored by divine algorithms</div>
                <div>• Unauthorized access disturbs cosmic balance</div>
                <div>• Report security incidents to the Sacred Council</div>
                <div>• Session blessed for 30 minutes of divine activity</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};