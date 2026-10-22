import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Navigation, Volume2, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { matchCampusLocation } from '../../data/campusLocations';

export const VoiceNavigationModal = ({ isOpen, onClose, onStartNavigation }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Tap the microphone and say a destination.');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [lang, setLang] = useState('en-US'); // 'en-US' | 'tanglish'
  const isTanglish = lang === 'tanglish';

  useEffect(() => {
    // Check Speech Recognition support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      setStatusMessage(isTanglish ? 'Ketpathu niruthappattu. Meendum microphone-ai thadavum.' : 'Listening stopped. Tap microphone to try again.');
      return;
    }

    setTranscript('');
    setIsListening(true);
    setStatusMessage(isTanglish ? 'Ketkirathu... Unga ilakku idathai pesavum (utha.: Unavagam, Noolagam, CS303)' : 'Listening... Speak your destination clearly (e.g. Cafeteria, CS303, Library)');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = isTanglish ? 'en-IN' : lang;

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        setStatusMessage(isTanglish ? `Neenga sonnatu: "${text}"` : `You said: "${text}"`);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setStatusMessage(isTanglish ? 'Kural angeekaara pizhai. Meendum microphone-ai thadavum.' : 'Could not recognize voice input. Please try again or type below.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      // Simulation fallback for browsers without webkitSpeechRecognition
      setTimeout(() => {
        const demoDestinations = isTanglish
          ? ['Mathiya Noolagam', 'Unavagam', 'Arai CS303', 'Maruthuvamanaai', 'Parking Lot B']
          : ['Central Library', 'Main Cafeteria', 'Classroom CS303', 'Medical Centre', 'Parking Lot B'];
        const randomPick = demoDestinations[Math.floor(Math.random() * demoDestinations.length)];
        setTranscript(randomPick);
        setIsListening(false);
        setStatusMessage(isTanglish ? `Neenga sonnatu: "${randomPick}"` : `You said: "${randomPick}"`);
      }, 2500);
    }
  };

  const handleConfirm = () => {
    if (transcript && onStartNavigation) {
      onStartNavigation(transcript);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isTanglish ? 'Kural VazhikaattalUthaviyaalar' : 'Voice Navigation Assistant'} maxWidth="max-w-md">
      <div className="flex flex-col items-center justify-center text-center space-y-6 py-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {isTanglish ? 'Neenga enge poga virumbureenga?' : 'Where would you like to go?'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">{statusMessage}</p>
        </div>

        {/* Language Toggle */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => { setLang('en-US'); setTranscript(''); setStatusMessage('Tap the microphone and say a destination.'); }}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              !isTamil ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => { setLang('tanglish'); setTranscript(''); setStatusMessage('Microphone-ai thadavi ilakku idathai pesavum.'); }}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              isTanglish ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tanglish
          </button>
        </div>

        {/* Large Microphone Trigger Button */}
        <div className="relative">
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
          )}
          <button
            onClick={toggleListening}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-md ${
              isListening
                ? 'bg-red-600 text-white ring-8 ring-red-100 scale-105'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }`}
            aria-label={isListening ? (isTanglish ? 'Ketpathai Niruthu' : 'Stop Listening') : (isTanglish ? 'Ketka Thodangu' : 'Start Listening')}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 animate-pulse" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>
        </div>

        {/* Voice Feedback Preview Box */}
        {transcript ? (
          <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 text-left animate-in fade-in">
            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">
              {isTanglish ? 'Kandariayapatta Ilakku' : 'Recognized Destination'}
            </span>
            <p className="text-base font-bold text-slate-900 mt-0.5 flex items-center justify-between">
              <span>{transcript}</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </p>
          </div>
        ) : (
          <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-500">
            {isTanglish ? (
              <span>Utharanamaga: <strong>"Unavagam enge?"</strong> illa <strong>"CS303 kaattu"</strong></span>
            ) : (
              <span>Try saying: <strong>"Take me to the Library"</strong> or <strong>"Find CS303"</strong></span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full pt-2">
          <Button variant="outline" size="md" fullWidth onClick={onClose}>
            {isTanglish ? 'Radhu Sey' : 'Cancel'}
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            disabled={!transcript}
            icon={Navigation}
            onClick={handleConfirm}
          >
            {isTanglish ? 'Vazhikaattal Thodangu' : 'Start Navigation'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Helper to map a voice query string to a route path
export const mapVoiceQuery = (query = '') => {
  const q = query.toLowerCase().trim();
  if (q.includes('notice') || q.includes('announcement')) return '/notices';
  if (q.includes('complaint') || q.includes('issue') || q.includes('problem')) return '/complaints';
  if (q.includes('profile')) return '/profile';
  if (q.includes('settings')) return '/settings';

  const matched = matchCampusLocation(query);
  return `/map?q=${encodeURIComponent(matched.name)}`;
};
