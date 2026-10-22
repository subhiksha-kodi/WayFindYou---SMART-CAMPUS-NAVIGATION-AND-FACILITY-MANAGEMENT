import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldAlert, Volume2, VolumeX, Video, Phone, CheckCircle2, Eye, ShieldCheck, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  getAllSOSAlerts,
  getActiveUnacknowledgedSOSAlerts,
  acknowledgeSOSAlert,
  getSOSMediaBlob,
  SOS_EVENT_NAME
} from '../../services/sosService';
import { startEmergencySirenSound, stopEmergencySirenSound } from '../../utils/sosAlarmAudio';

export const AdminSOSMonitor = () => {
  const [activeAlerts, setActiveAlerts] = useState(() => getActiveUnacknowledgedSOSAlerts());
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [soundMuted, setSoundMuted] = useState(false);

  const syncAlerts = () => {
    const active = getActiveUnacknowledgedSOSAlerts();
    setActiveAlerts(active);
  };

  useEffect(() => {
    syncAlerts();

    const handleSOSEvent = () => syncAlerts();
    window.addEventListener(SOS_EVENT_NAME, handleSOSEvent);
    window.addEventListener('storage', handleSOSEvent);

    const interval = setInterval(syncAlerts, 2000);

    return () => {
      window.removeEventListener(SOS_EVENT_NAME, handleSOSEvent);
      window.removeEventListener('storage', handleSOSEvent);
      clearInterval(interval);
    };
  }, []);

  const hasUnacknowledged = activeAlerts.length > 0;
  const currentEmergency = activeAlerts[0] || null;

  // Manage Siren Sound
  useEffect(() => {
    if (hasUnacknowledged && !soundMuted) {
      startEmergencySirenSound();
    } else {
      stopEmergencySirenSound();
    }

    return () => {
      stopEmergencySirenSound();
    };
  }, [hasUnacknowledged, soundMuted]);

  // Load video blob if available
  useEffect(() => {
    let activeUrl = null;
    let isSubscribed = true;

    if (selectedAlert) {
      if (selectedAlert.videoUrl && selectedAlert.videoUrl.startsWith('blob:')) {
        setMediaBlobUrl(selectedAlert.videoUrl);
      } else if (selectedAlert.mediaId || selectedAlert.id) {
        getSOSMediaBlob(selectedAlert.mediaId || selectedAlert.id).then((blob) => {
          if (isSubscribed && blob) {
            activeUrl = URL.createObjectURL(blob);
            setMediaBlobUrl(activeUrl);
          }
        });
      }
    } else {
      setMediaBlobUrl(null);
    }

    return () => {
      isSubscribed = false;
      if (activeUrl) URL.revokeObjectURL(activeUrl);
    };
  }, [selectedAlert]);

  const handleAcknowledge = (alertId) => {
    acknowledgeSOSAlert('all_active', 'Security Squad Dispatched & Alarm Silenced');
    stopEmergencySirenSound();
    setActiveAlerts([]);
    setSelectedAlert(null);
  };

  const handleToggleSound = () => {
    if (soundMuted) {
      setSoundMuted(false);
      startEmergencySirenSound();
    } else {
      setSoundMuted(true);
      stopEmergencySirenSound();
    }
  };

  if (!hasUnacknowledged && !selectedAlert) {
    return null;
  }

  return (
    <>
      {/* Flashing Top Emergency Alarm Banner across Admin Portal */}
      {hasUnacknowledged && currentEmergency && (
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white px-4 py-3 shadow-lg border-b-2 border-red-800 animate-pulse flex flex-col sm:flex-row items-center justify-between gap-3 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-bounce">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-white text-red-700 px-2 py-0.5 rounded-md">
                  🚨 EMERGENCY ALARM ACTIVE
                </span>
                <span className="text-xs text-red-100 font-mono">
                  {currentEmergency.time}
                </span>
              </div>
              <p className="text-sm font-extrabold mt-0.5">
                {currentEmergency.studentName} ({currentEmergency.studentId}) — {currentEmergency.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-lg bg-black/20 hover:bg-black/30 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              title={soundMuted ? 'Unmute Emergency Siren' : 'Mute Emergency Siren'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-amber-300" /> : <Volume2 className="w-4 h-4 text-white animate-pulse" />}
              <span>{soundMuted ? 'Muted' : 'Siren Sounding'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedAlert(currentEmergency)}
              className="px-3 py-1.5 rounded-lg bg-white text-red-700 hover:bg-slate-100 active:bg-slate-200 font-black text-xs transition-all flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer border-0"
            >
              <Video className="w-4 h-4 text-red-600 shrink-0" />
              <span>View SOS Video & Respond</span>
            </button>
          </div>
        </div>
      )}

      {/* SOS Emergency Control Room Modal */}
      <Modal
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        title="🚨 SOS EMERGENCY CONTROL ROOM"
        maxWidth="max-w-2xl"
      >
        {selectedAlert && (
          <div className="space-y-5 py-2">
            {/* Header Status Card */}
            <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" size="sm" icon={ShieldAlert}>
                    CRITICAL EMERGENCY PANIC TRIGGER
                  </Badge>
                  <span className="text-xs font-bold text-red-700">{selectedAlert.time} • {selectedAlert.date}</span>
                </div>
                <h4 className="text-lg font-black text-slate-900">{selectedAlert.studentName}</h4>
                <p className="text-xs text-slate-600">
                  ID: <strong className="font-mono text-slate-900">{selectedAlert.studentId}</strong> • Dept: <strong className="text-slate-900">{selectedAlert.department}</strong>
                </p>
              </div>

              <div className="text-right sm:self-start">
                <button
                  onClick={handleToggleSound}
                  className="px-3 py-1.5 rounded-lg bg-red-100 text-red-800 text-xs font-bold inline-flex items-center gap-1.5 border border-red-300"
                >
                  {soundMuted ? <VolumeX className="w-4 h-4 text-slate-600" /> : <Volume2 className="w-4 h-4 text-red-600 animate-pulse" />}
                  <span>{soundMuted ? 'Siren Muted' : 'Mute Alarm Siren'}</span>
                </button>
              </div>
            </div>

            {/* Location & Message Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Incident Location</span>
                <p className="text-xs font-extrabold text-slate-900">{selectedAlert.location}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Emergency Contact</span>
                <p className="text-xs font-extrabold text-slate-900">{selectedAlert.phone || '+91 99001 98765'}</p>
              </div>
            </div>

            {/* Recorded Video & Voice Player */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Recorded SOS Camera Video & Voice Stream</span>
                <span className="text-[10px] text-red-600 font-semibold">Webcam + Mic Recorded Clip</span>
              </h5>

              <div className="rounded-xl border-2 border-slate-900 bg-black overflow-hidden relative shadow-inner">
                {mediaBlobUrl || selectedAlert.videoUrl ? (
                  <video
                    src={mediaBlobUrl || selectedAlert.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-64 object-contain bg-black"
                  />
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center p-6 text-center space-y-2 text-slate-400">
                    <Video className="w-10 h-10 text-slate-600 animate-pulse" />
                    <p className="text-xs font-semibold text-slate-300">Live Camera Stream Unavailable</p>
                    <p className="text-[11px] text-slate-500 max-w-xs">
                      The emergency location panic signal was received successfully. Security team has been alerted.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Panic Message */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
              <strong className="font-bold">Broadcast Log:</strong> {selectedAlert.alertMessage}
            </div>

            {/* Action Response Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <a
                href={`tel:${selectedAlert.phone || '+919900198765'}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                Call Student ({selectedAlert.phone || '+91 99001 98765'})
              </a>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setSelectedAlert(null)}
                >
                  Close Window
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  icon={ShieldCheck}
                  onClick={() => handleAcknowledge(selectedAlert.id)}
                  className="bg-red-600 hover:bg-red-700 font-extrabold shadow-md"
                >
                  Dispatch Security & Stop Alarm
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
