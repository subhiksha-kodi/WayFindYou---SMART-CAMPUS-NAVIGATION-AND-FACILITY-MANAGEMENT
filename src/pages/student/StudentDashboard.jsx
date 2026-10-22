import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Map,
  Building2,
  Mic,
  Bell,
  MessageSquare,
  ShieldAlert,
  Coffee,
  Star,
  ListOrdered,
  CalendarDays
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { SearchBar } from '../../components/ui/SearchBar';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useStudent } from '../../context/StudentContext';
import { useToast } from '../../context/ToastContext';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { student, events, activeCafeteriaToken } = useStudent();

  const quickLinks = [
    { label: 'Campus Map', path: '/map', icon: Map, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'Facility Locator', path: '/facilities', icon: Building2, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { label: 'Voice Navigation', path: '/voice-navigation', icon: Mic, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Smart Cafeteria', path: '/student/cafeteria', icon: Coffee, color: 'bg-orange-50 text-orange-700 border-orange-200' },
    { label: 'Complaints & History', path: '/student/complaints', icon: MessageSquare, color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { label: 'Facility Feedback', path: '/student/feedback', icon: Star, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    { label: 'Notices & Events', path: '/student/notices', icon: Bell, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' }
  ];

  const handleSearch = (query) => {
    if (!query.trim()) return;
    addToast(`Searching campus facilities for "${query}"...`, 'info');
    navigate(`/facilities?q=${encodeURIComponent(query)}`);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <Badge variant="info" size="sm">Student Portal</Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {student.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Find campus facilities, manage services, and stay connected with campus updates.
            </p>
            <div className="pt-2 max-w-xl">
              <SearchBar
                placeholder="Search facilities, buildings, notices..."
                onSearch={handleSearch}
                suggestions={['Central Library', 'Main Cafeteria', 'Medical Centre', 'Parking Lot', 'Security Office']}
              />
            </div>
          </div>
          <button
            onClick={() => navigate('/student/emergency')}
            className="shrink-0 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2.5"
          >
            <ShieldAlert className="w-5 h-5" />
            EMERGENCY SOS
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {quickLinks.map((link) => (
            <button key={link.path} onClick={() => navigate(link.path)} className="text-left">
              <Card hoverEffect className="p-4 h-full">
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${link.color}`}>
                  <link.icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">{link.label}</span>
              </Card>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold text-slate-900">Campus Events</h2>
                <CalendarDays className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                {events.slice(0, 3).map((event) => (
                  <button key={event.id} onClick={() => navigate('/student/notices')} className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-blue-50 transition-colors">
                    <p className="text-sm font-bold text-slate-900">{event.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{event.date} · {event.venue}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4">Cafeteria Token</h2>
              {activeCafeteriaToken ? (
                <p className="text-sm text-slate-600">Token <strong>#{activeCafeteriaToken.tokenNumber}</strong> is active.</p>
              ) : (
                <p className="text-sm text-slate-500">No active cafeteria token. Visit the cafeteria to place an order.</p>
              )}
              <button onClick={() => navigate('/student/cafeteria')} className="mt-4 text-xs font-bold text-blue-600 hover:text-blue-700">
                Open Smart Cafeteria →
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};
