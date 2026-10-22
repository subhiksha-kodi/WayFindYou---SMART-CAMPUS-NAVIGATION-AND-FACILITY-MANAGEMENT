import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Navigation, CheckCircle2, Volume2, Compass, ArrowRight, Accessibility } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useToast } from '../context/ToastContext';
import { matchCampusLocation } from '../data/campusLocations';

export const VoiceNavPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Tap the microphone and say a destination.');
  const [hasSpeechSupport, setHasSpeechSupport] = useState(true);
  const [lang, setLang] = useState('en-US'); // 'en-US' | 'tanglish'
  const isTanglish = lang === 'tanglish';

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setHasSpeechSupport(false);
    }
  }, []);

  const handleMicClick = () => {
    if (isListening) {
      setIsListening(false);
      setStatusMessage(isTanglish
        ? 'Ketpathu niruthappattu. Meendum microphone-ai thadavum.'
        : 'Listening paused. Tap microphone to speak destination again.');
      return;
    }

    setTranscript('');
    setIsListening(true);
    setStatusMessage(isTanglish
      ? 'Ketkirathu... Unga ilakku idathai theruvaga pesavum (utha: Unavagam, Noolagam, CS303)'
      : 'Listening... Speak your destination clearly (e.g., Main Cafeteria, CS303, Library)');

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
        setStatusMessage(isTanglish
          ? 'Kural angeekaara pizhai. Meendum microphone-ai thadavum.'
          : 'Speech recognition error. Tap microphone to retry.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      // Simulation for browsers without Web Speech API
      setTimeout(() => {
        const samplePlaces = isTanglish
          ? ['Unavagam', 'Noolagam', 'Maruthuvamanaai', 'Parking']
          : ['Main Cafeteria', 'Central Library', 'Classroom CS303', 'Medical Centre'];
        const chosen = samplePlaces[Math.floor(Math.random() * samplePlaces.length)];
        setTranscript(chosen);
        setIsListening(false);
        setStatusMessage(isTanglish ? `Neenga sonnatu: "${chosen}"` : `You said: "${chosen}"`);
      }, 2200);
    }
  };

  const handleStartNavigation = () => {
    if (transcript) {
      const matched = matchCampusLocation(transcript);
      addToast(`Starting voice-guided navigation to ${matched.name}`, 'success');
      navigate(`/map?q=${encodeURIComponent(matched.name)}`);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Voice Navigation Assistant"
        description="Hands-free speech-guided campus navigation. Speak any building, classroom code, or facility to receive instant directions."
        breadcrumbs={[{ label: 'Voice Navigation' }]}
        actions={
          <Badge variant="info" size="md" icon={Volume2}>
            Web Speech API
          </Badge>
        }
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-8 text-center shadow-md">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {isTanglish ? 'Neenga enge poga virumbureenga?' : 'Where would you like to go?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">{statusMessage}</p>
            </div>

            {/* Language Toggle */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit mx-auto">
              <button
                onClick={() => { setLang('en-US'); setTranscript(''); setStatusMessage('Tap the microphone and say a destination.'); }}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  !isTanglish ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => { setLang('tanglish'); setTranscript(''); setStatusMessage('Microphone-ai thadavi unga ilakku idathai pesavum.'); }}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  isTanglish ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tanglish
              </button>
            </div>

            {/* Large Microphone Trigger Button */}
            <div className="relative py-4">
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping max-w-[140px] max-h-[140px] mx-auto" />
              )}
              <button
                onClick={handleMicClick}
                className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mx-auto transition-all shadow-lg ${
                  isListening
                    ? 'bg-red-600 text-white ring-8 ring-red-100 scale-105'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                }`}
                aria-label={isListening ? (isTanglish ? 'Ketpathai Niruthu' : 'Stop Listening') : (isTanglish ? 'Ketka Thodangu' : 'Start Listening')}
              >
                {isListening ? (
                  <MicOff className="w-12 h-12 animate-pulse" />
                ) : (
                  <Mic className="w-12 h-12" />
                )}
              </button>
            </div>

            {/* Speech Result Display */}
            {transcript ? (
              <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl text-left animate-in fade-in space-y-2">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                  {isTanglish ? 'Kandariayapatta Ilakku' : 'Recognized Destination'}
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">
                    {isTanglish ? 'Neenga sonnatu:' : 'You said:'} &quot;{transcript}&quot;
                  </span>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                </div>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon={Navigation}
                    onClick={handleStartNavigation}
                  >
                    {isTanglish ? 'Vazhikaattal Thodangu' : 'Start Navigation'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-500 max-w-md mx-auto">
                <p className="font-semibold text-slate-700 mb-1">
                  {isTanglish ? 'Utharana Kural Kattalaigal:' : 'Sample Voice Commands:'}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {(isTanglish
                    ? ['"Unavagam enge?"', '"CS303 enga irukku?"', '"Noolagam kaattu"', '"Maruthuvamanaiku poi kaattu"']
                    : ['"Navigate to Main Cafeteria"', '"Where is CS303?"', '"Find nearest ATM"', '"Take me to Medical"']
                  ).map((cmd, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-mono text-[11px] text-slate-600">
                      {cmd}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};
