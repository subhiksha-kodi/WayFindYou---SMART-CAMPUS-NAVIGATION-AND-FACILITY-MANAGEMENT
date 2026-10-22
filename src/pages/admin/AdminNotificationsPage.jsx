import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Send, Clock, Radio, ShieldAlert, Video, CheckCircle2, User, Phone, MapPin, ShieldCheck, AlertTriangle, Trash2 } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { useAdmin } from '../../context/AdminContext';
import { useToast } from '../../context/ToastContext';
import { getAllSOSAlerts, acknowledgeSOSAlert, clearAllSOSAlerts, getSOSMediaBlob, SOS_EVENT_NAME } from '../../services/sosService';

export const AdminNotificationsPage = () => {
  const location = useLocation();
  const queryTab = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab] = useState(queryTab || 'sos');

  const { broadcasts, addBroadcastNotification } = useAdmin();
  const { addToast } = useToast();
  const [role, setRole] = useState('Everyone');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const [sosAlerts, setSosAlerts] = useState(() => getAllSOSAlerts());
  const [mediaUrls, setMediaUrls] = useState({});

  const reloadSOS = () => {
    setSosAlerts(getAllSOSAlerts());
  };

  const handleClearAllSOS = () => {
    clearAllSOSAlerts();
    reloadSOS();
    addToast('All recorded SOS emergency videos have been cleared.', 'info');
  };

  useEffect(() => {
    reloadSOS();
    const onSOSEvent = () => reloadSOS();
    window.addEventListener(SOS_EVENT_NAME, onSOSEvent);
    window.addEventListener('storage', onSOSEvent);

    return () => {
      window.removeEventListener(SOS_EVENT_NAME, onSOSEvent);
      window.removeEventListener('storage', onSOSEvent);
    };
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    const urls = {};

    sosAlerts.forEach((alert) => {
      if (alert.videoUrl && alert.videoUrl.startsWith('blob:')) {
        urls[alert.id] = alert.videoUrl;
      } else {
        getSOSMediaBlob(alert.mediaId || alert.id).then((blob) => {
          if (isSubscribed && blob) {
            urls[alert.id] = URL.createObjectURL(blob);
            setMediaUrls((prev) => ({ ...prev, [alert.id]: urls[alert.id] }));
          }
        });
      }
    });

    setMediaUrls((prev) => ({ ...prev, ...urls }));

    return () => {
      isSubscribed = false;
    };
  }, [sosAlerts]);

  const activeCount = sosAlerts.filter((a) => !a.acknowledged).length;
  const dispatchedCount = sosAlerts.filter((a) => a.acknowledged).length;

  const handleAcknowledge = (alertId) => {
    acknowledgeSOSAlert(alertId, 'Acknowledged from Emergency SOS Archive');
    reloadSOS();
    addToast('Security Squad dispatched! Alert saved in Emergency Archive.', 'success');
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    addBroadcastNotification({ role, title, message });
    addToast(`Broadcast announcement sent & saved for: ${role}!`, 'success');
    setTitle('');
    setMessage('');
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Emergency SOS Control Room & Video Log"
        description="Monitor live student emergency SOS video broadcasts, camera clips, and campus security dispatch."
        breadcrumbs={[{ label: 'Emergency SOS Log' }]}
      />

      <div className="space-y-6">
        {/* KPI Summary Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-100/50 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">Total SOS Triggers</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{sosAlerts.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-100/50 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Active Unhandled Alarms</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{activeCount}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-100/50 border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Security Dispatched</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{dispatchedCount}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>

        {/* EMERGENCY SOS VIDEO BROADCAST ARCHIVE */}
        <Card className="border-red-200">
          <CardHeader className="bg-red-50/50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-red-950">
                <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />
                Student Emergency SOS Recorded Video Archive ({sosAlerts.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                {sosAlerts.length > 0 && (
                  <Button
                    variant="outline"
                    size="xs"
                    icon={Trash2}
                    onClick={handleClearAllSOS}
                    className="text-red-700 border-red-300 hover:bg-red-100 font-bold"
                  >
                    Clear All SOS Videos
                  </Button>
                )}
                <Badge variant="destructive" size="sm" icon={ShieldAlert}>
                  Permanent Video Log
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {sosAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No emergency SOS broadcasts recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {sosAlerts.map((alert) => {
                  const isUnack = !alert.acknowledged;
                  const videoSrc = mediaUrls[alert.id] || alert.videoUrl;
                  return (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isUnack
                          ? 'bg-red-50/60 border-red-300 ring-2 ring-red-500/20 shadow-md'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={isUnack ? 'destructive' : 'success'} size="sm">
                              {alert.status}
                            </Badge>
                            <span className="text-xs font-mono font-bold text-slate-700">{alert.id}</span>
                            <span className="text-xs text-slate-400">• {alert.time} ({alert.date})</span>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                              <User className="w-4 h-4 text-slate-500" />
                              {alert.studentName} <span className="text-xs text-slate-500 font-normal">({alert.studentId})</span>
                            </h4>
                            <p className="text-xs text-slate-600 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-red-600" />
                              <strong className="text-slate-900">Incident Location:</strong> {alert.location}
                            </p>
                            <p className="text-xs text-slate-600 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              <strong className="text-slate-900">Contact:</strong> {alert.phone || '+91 99001 98765'} • Dept: {alert.department}
                            </p>
                          </div>

                          <div className="p-3 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono leading-relaxed">
                            {alert.alertMessage}
                          </div>

                          {alert.adminNotes && (
                            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 font-semibold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>Admin Status Note: {alert.adminNotes}</span>
                            </div>
                          )}
                        </div>

                        {/* Recorded Video Container */}
                        <div className="w-full md:w-80 shrink-0 space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Recorded SOS Camera & Audio Stream
                          </span>
                          {videoSrc ? (
                            <video
                              src={videoSrc}
                              controls
                              className="w-full h-44 rounded-lg bg-black object-contain border border-slate-800 shadow-sm"
                            />
                          ) : (
                            <div className="w-full h-44 rounded-lg bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-3 text-center text-xs text-slate-500">
                              <Video className="w-6 h-6 text-slate-400 mb-1" />
                              <span>Panic location signal logged (Camera stream offline)</span>
                            </div>
                          )}

                          {isUnack ? (
                            <Button
                              variant="danger"
                              size="sm"
                              fullWidth
                              icon={CheckCircle2}
                              onClick={() => handleAcknowledge(alert.id)}
                              className="mt-2"
                            >
                              Dispatch Security & Stop Siren
                            </Button>
                          ) : (
                            <div className="py-1 text-center text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span>Saved Permanently in Archive</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
