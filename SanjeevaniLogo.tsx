import React from 'react';
import { motion } from 'framer-motion';

interface SanjeevaniLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  variant?: 'full' | 'icon' | 'text';
}

export const SanjeevaniLogo: React.FC<SanjeevaniLogoProps> = ({ 
  size = 'md', 
  animated = true,
  variant = 'full' 
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24'
  };

  const textSizes = {
    sm: 'text-body-large',
    md: 'text-heading-3',
    lg: 'text-heading-2',
    xl: 'text-heading-1'
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.1, rotate: 2 },
    pulse: { 
      scale: [1, 1.08, 1],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const leafVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 2.5, ease: "easeInOut" }
    }
  };

  const glowVariants = {
    initial: { opacity: 0.3 },
    animate: {
      opacity: [0.3, 0.8, 0.3],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const SanjeevaniHerbIcon = () => (
    <motion.div
      className="relative"
      variants={iconVariants}
      initial="initial"
      animate={animated ? "pulse" : "initial"}
      whileHover="hover"
    >
      <svg
        className={`${sizeClasses[size]} w-auto filter drop-shadow-lg`}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Enhanced Divine Glow Effect */}
          <radialGradient id="divineGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </radialGradient>
          
          {/* Enhanced Sacred Herb Gradient */}
          <linearGradient id="herbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="30%" stopColor="#10b981" />
            <stop offset="70%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          
          {/* Enhanced Life Force Gradient */}
          <linearGradient id="lifeForce" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          
          {/* Enhanced Sacred Stem Gradient */}
          <linearGradient id="stemGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="50%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
          
          {/* Enhanced Divine Light Filter */}
          <filter id="divineLight" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Enhanced Sacred Aura */}
          <filter id="sacredAura" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="glow"/>
            <feColorMatrix in="glow" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Enhanced Divine Background Aura */}
        <motion.circle 
          cx="60" 
          cy="60" 
          r="55" 
          fill="url(#divineGlow)" 
          variants={glowVariants}
          initial="initial"
          animate={animated ? "animate" : "initial"}
        />

        {/* Enhanced Sacred Stem */}
        <motion.path
          d="M60 95 Q58 85 60 75 Q62 65 60 55 Q58 45 60 35"
          stroke="url(#stemGradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          filter="url(#divineLight)"
          variants={leafVariants}
          initial="initial"
          animate={animated ? "animate" : "initial"}
        />

        {/* Enhanced Main Sanjeevani Leaf (Center) - The Life-Giving Leaf */}
        <motion.path
          d="M60 35 C75 25, 90 35, 85 55 C80 75, 65 80, 50 75 C35 70, 30 55, 35 40 C40 25, 50 20, 60 35 Z"
          fill="url(#herbGradient)"
          stroke="#047857"
          strokeWidth="2.5"
          filter="url(#sacredAura)"
          variants={leafVariants}
          initial="initial"
          animate={animated ? "animate" : "initial"}
        />

        {/* Enhanced Left Sacred Leaf */}
        <motion.path
          d="M45 50 C35 45, 25 50, 28 65 C31 80, 42 82, 50 78 C58 74, 60 65, 55 55 C50 45, 47 42, 45 50 Z"
          fill="url(#herbGradient)"
          stroke="#047857"
          strokeWidth="2"
          opacity="0.9"
          filter="url(#divineLight)"
          variants={leafVariants}
          initial="initial"
          animate={animated ? "animate" : "initial"}
          transition={{ delay: 0.3 }}
        />

        {/* Enhanced Right Sacred Leaf */}
        <motion.path
          d="M75 50 C85 45, 95 50, 92 65 C89 80, 78 82, 70 78 C62 74, 60 65, 65 55 C70 45, 73 42, 75 50 Z"
          fill="url(#herbGradient)"
          stroke="#047857"
          strokeWidth="2"
          opacity="0.9"
          filter="url(#divineLight)"
          variants={leafVariants}
          initial="initial"
          animate={animated ? "animate" : "initial"}
          transition={{ delay: 0.5 }}
        />

        {/* Enhanced Sacred Veins in Main Leaf - Life Force Channels */}
        <motion.path
          d="M60 40 Q65 50 60 60 M55 45 Q60 50 55 55 M65 45 Q60 50 65 55 M60 35 Q70 45 75 50 M60 35 Q50 45 45 50"
          stroke="url(#lifeForce)"
          strokeWidth="2"
          fill="none"
          opacity="0.9"
          variants={leafVariants}
          initial="initial"
          animate={animated ? "animate" : "initial"}
          transition={{ delay: 0.8 }}
        />

        {/* Enhanced Divine Life Force Particles */}
        {[...Array(15)].map((_, i) => {
          const angle = (i * 24) * Math.PI / 180;
          const radius = 40 + Math.sin(i) * 12;
          const x = 60 + radius * Math.cos(angle);
          const y = 60 + radius * Math.sin(angle);
          
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="#fbbf24"
              opacity="0.8"
              filter="url(#divineLight)"
              initial={{ scale: 0, opacity: 0 }}
              animate={animated ? {
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
                transition: {
                  duration: 3.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }
              } : { scale: 1, opacity: 0.8 }}
            />
          );
        })}

        {/* Enhanced Sacred Healing Aura Rings */}
        {[28, 38, 48].map((radius, i) => (
          <motion.circle
            key={i}
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#10b981"
            strokeWidth="1"
            opacity="0.4"
            initial={{ scale: 0, opacity: 0 }}
            animate={animated ? {
              scale: [0.8, 1.3, 0.8],
              opacity: [0, 0.6, 0],
              transition: {
                duration: 5,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut"
              }
            } : { scale: 1, opacity: 0.4 }}
          />
        ))}

        {/* Enhanced Central Sacred Bindu - Source of Life */}
        <motion.circle
          cx="60"
          cy="50"
          r="4"
          fill="url(#lifeForce)"
          filter="url(#divineLight)"
          initial={{ scale: 0 }}
          animate={animated ? { 
            scale: [0, 1.5, 1],
            transition: { duration: 2, delay: 1.2 }
          } : { scale: 1 }}
        />
      </svg>
    </motion.div>
  );

  const SanjeevaniText = () => (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <motion.h1 
        className={`${textSizes[size]} font-bold gradient-text leading-none`}
        style={{ 
          fontFamily: 'Inter, sans-serif', 
          letterSpacing: '0.02em',
          textShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
        }}
      >
        SANJEEVANI
      </motion.h1>
      <motion.p 
        className="text-caption text-emerald-300 opacity-80 tracking-wider mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.8 }}
      >
        The Life-Giving Medicine
      </motion.p>
    </motion.div>
  );

  if (variant === 'icon') {
    return <SanjeevaniHerbIcon />;
  }

  if (variant === 'text') {
    return <SanjeevaniText />;
  }

  return (
    <div className="flex items-center gap-3">
      <SanjeevaniHerbIcon />
      <SanjeevaniText />
    </div>
  );
};