import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Building2, Bell, CalendarDays, MessageSquare, ShieldAlert, Users } from 'lucide-react';
import { FacultyLayout } from '../../components/layout/FacultyLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { INITIAL_FACULTY_PROFILE } from '../../services/facultyData';

export const FacultyDashboardPage = () => {
  const navigate = useNavigate();
  const quickLinks = [
    { label: 'Campus Map', path: '/faculty/map', icon: Map },
    { label: 'Facility Locator', path: '/facilities', icon: Building2 },
    { label: 'Notices', path: '/faculty/notices', icon: Bell },
    { label: 'Events & Meetings', path: '/faculty/events', icon: CalendarDays },
    { label: 'Complaints & Issues', path: '/complaints', icon: MessageSquare },
    { label: 'Visitor Passes', path: '/visitors', icon: Users }
  ];

  return (
    <FacultyLayout>
      <PageHeader
        title={`Welcome, ${INITIAL_FACULTY_PROFILE.name}`}
        description="Manage campus services, facilities, notices, events, and safety tools."
        breadcrumbs={[{ label: 'Faculty Dashboard' }]}
        actions={<Badge variant="navy" size="md">Faculty Portal</Badge>}
      />
      <div className="space-y-8">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0">
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold">Campus services at a glance</h2>
              <p className="text-sm text-blue-100 mt-1">Find facilities, view campus updates, and report issues.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/faculty/map')} className="!bg-white/10 !text-white !border-white/30 hover:!bg-white/20">
              Open Campus Map
            </Button>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <button key={link.path} onClick={() => navigate(link.path)} className="text-left">
              <Card hoverEffect className="p-5 h-full">
                <link.icon className="w-5 h-5 text-blue-600 mb-3" />
                <span className="text-sm font-bold text-slate-900">{link.label}</span>
              </Card>
            </button>
          ))}
        </div>
        <Card>
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Need immediate assistance?</h2>
              <p className="text-sm text-slate-500 mt-1">Use the emergency channel to contact campus support.</p>
            </div>
            <Button variant="danger" size="sm" icon={ShieldAlert} onClick={() => navigate('/emergency')}>Emergency SOS</Button>
          </CardContent>
        </Card>
      </div>
    </FacultyLayout>
  );
};
