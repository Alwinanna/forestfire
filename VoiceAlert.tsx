import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { AlertData } from '../types';

interface VoiceAlertProps {
  alert: AlertData;
  isActive: boolean;
}

export const VoiceAlert: React.FC<VoiceAlertProps> = ({ alert, isActive }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  const speakAlert = (text: string) => {
    if (!isEnabled || !('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isActive && alert.level === 'emergency') {
      const alertText = `Emergency Alert: ${alert.message}. Estimated ${alert.estimatedImpact.estimatedAffected} people at risk. Evacuation time: ${alert.estimatedImpact.evacuationTime} minutes.`;
      speakAlert(alertText);
    }
  }, [isActive, alert]);

  const handleManualSpeak = () => {
    const detailedAlert = `
      ${alert.level} alert for ${alert.location}. 
      ${alert.message}
      Current risk assessment: ${alert.estimatedImpact.estimatedAffected} people potentially affected.
      ${alert.estimatedImpact.settlements} settlements in danger zone.
      Recommended evacuation time: ${alert.estimatedImpact.evacuationTime} minutes.
      Fire spread prediction: In 1 hour, ${alert.predictions[0]?.populationAtRisk} people at risk.
      In 3 hours, ${alert.predictions[2]?.populationAtRisk} people at risk.
      Most likely casualties in 6 hours: ${alert.predictions[3]?.estimatedCasualties.mostLikely} people.
    `;
    speakAlert(detailedAlert);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`p-2 rounded-lg transition-colors ${
          isEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
        }`}
        title={isEnabled ? 'Voice alerts enabled' : 'Voice alerts disabled'}
      >
        {isEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
      
      <button
        onClick={handleManualSpeak}
        disabled={isSpeaking}
        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
          isSpeaking 
            ? 'bg-orange-100 text-orange-600 cursor-not-allowed' 
            : 'bg-green-100 text-green-600 hover:bg-green-200'
        }`}
      >
        {isSpeaking ? 'Speaking...' : 'Speak Alert'}
      </button>
    </div>
  );
};