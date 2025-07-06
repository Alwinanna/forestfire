import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SanjeevaniLogo } from './SanjeevaniLogo';

export const SplashScreen: React.FC = () => {
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    const steps = [
      { delay: 500, step: 1 },
      { delay: 1500, step: 2 },
      { delay: 2500, step: 3 },
      { delay: 3500, step: 4 }
    ];

    steps.forEach(({ delay, step }) => {
      setTimeout(() => setLoadingStep(step), delay);
    });
  }, []);

  const loadingSteps = [
    { 
      text: "Connecting to Divine Satellites...",
      color: "text-emerald-400"
    },
    { 
      text: "Loading Sacred Weather Data...",
      color: "text-blue-400"
    },
    { 
      text: "Awakening AI Consciousness...",
      color: "text-orange-400"
    },
    { 
      text: "Sanjeevani Ready!",
      color: "text-yellow-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Sacred Background Particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Divine Light Rays */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent"
            style={{
              left: `${12.5 * (i + 1)}%`,
              transformOrigin: 'center bottom',
            }}
            animate={{
              rotate: [0, 2, -2, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Government Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
        >
          <div className="text-emerald-300 text-sm font-semibold mb-2">
            GOVERNMENT OF INDIA
          </div>
          <div className="text-emerald-400 text-xs opacity-80">
            Ministry of Environment & Forests
          </div>
        </motion.div>

        {/* Sacred Sanjeevani Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="mb-12"
        >
          <SanjeevaniLogo size="xl" animated={true} />
        </motion.div>

        {/* Sacred Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mb-12 max-w-2xl mx-auto"
        >
          <div className="bg-emerald-900/30 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/30">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">
              🌿 The Death-Conquering Medicine 🌿
            </h3>
            <div className="text-emerald-200 text-sm leading-relaxed space-y-3">
              <p>
                When Lakshmana fell unconscious from Indrajit's arrow, mighty Hanuman brought the 
                <span className="text-yellow-300 font-semibold"> Sanjeevani herb </span> 
                from Dronagiri mountain and saved his life.
              </p>
              <p className="text-yellow-200 text-xs italic mt-4">
                "Just as Sanjeevani conquered death, our AI system protects forests from destruction."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loading Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="space-y-6"
        >
          {/* Sacred Loading Bar */}
          <div className="w-80 mx-auto">
            <div className="bg-emerald-900/50 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-400"
                initial={{ width: 0 }}
                animate={{ width: `${(loadingStep / 4) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Loading Steps */}
          <div className="space-y-3">
            {loadingSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: loadingStep >= index + 1 ? 1 : 0.3,
                  x: 0 
                }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`flex items-center justify-center gap-3 ${
                  loadingStep >= index + 1 ? step.color : 'text-slate-500'
                }`}
              >
                <motion.div
                  className={`w-2 h-2 rounded-full ${
                    loadingStep >= index + 1 ? 'bg-current' : 'bg-slate-600'
                  }`}
                  animate={loadingStep >= index + 1 ? {
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1]
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <div className="text-sm font-medium">
                  {step.text}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sacred Completion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: loadingStep >= 4 ? 1 : 0 }}
            transition={{ duration: 1, delay: 3.5 }}
            className="text-center mt-8"
          >
            <div className="text-yellow-300 text-lg font-bold mb-2">
              🕉️ Sacred System Awakened 🕉️
            </div>
            <div className="text-emerald-400 text-xs mt-1">
              Divine protection activated
            </div>
          </motion.div>
        </motion.div>

        {/* Ready to Continue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loadingStep >= 4 ? 1 : 0, y: 0 }}
          transition={{ duration: 0.8, delay: 4 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-emerald-300 text-sm text-center"
          >
            <div className="mb-2">✨ Ready to Enter Sacred Realm ✨</div>
            <div className="text-xs opacity-70">
              Preparing sacred access portal
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Sacred Border Glow */}
      <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-lg pointer-events-none">
        <motion.div
          className="absolute inset-0 border-2 border-yellow-400/30 rounded-lg"
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};