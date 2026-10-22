import React, { useState } from 'react';
import { Bell, Download, Calendar, MapPin, CheckCircle2, UserCheck } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { SearchBar } from '../../components/ui/SearchBar';
import { useStudent } from '../../context/StudentContext';
import { useToast } from '../../context/ToastContext';

export const StudentNoticesPage = () => {
  const { notices, events, eventRegistrations, toggleEventRegistration } = useStudent();
  const { addToast } = useToast();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredNotices = notices.filter((n) => {
    const matchesQuery = !query || n.title.toLowerCase().includes(query.toLowerCase()) || n.summary.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const handleDownloadPDF = (notice) => {
    addToast(`Downloading ${notice.pdfName || 'Notice_Document.pdf'}...`, 'success');
  };

  return (
    <AppLayout>
      <PageHeader
        title="Notices, Updates & Campus Events"
        description="Stay informed with official campus updates and register for upcoming events and workshops."
        breadcrumbs={[{ label: 'Notices & Events' }]}
      />

      <div className="space-y-6 max-w-4xl">
        {/* Search & Category Filter Pills */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <SearchBar
              placeholder="Search notices..."
              onSearch={(q) => setQuery(q)}
              size="sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Academic', 'Facilities', 'Events', 'Career'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notices Cards List */}
        <div className="space-y-4">
          {filteredNotices.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-xs text-slate-400">
                No notices found matching your search.
              </CardContent>
            </Card>
          ) : (
            filteredNotices.map((n) => (
              <Card key={n.id}>
                <CardHeader
                  actions={
                    <div className="flex items-center gap-2">
                      <Badge variant={n.urgent ? 'error' : 'info'} size="sm">{n.category}</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Download}
                        onClick={() => handleDownloadPDF(n)}
                      >
                        Download PDF
                      </Button>
                    </div>
                  }
                >
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <CardTitle className="text-base">{n.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 p-5 text-xs text-slate-700">
                  <p className="leading-relaxed text-sm text-slate-900">{n.summary}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    <span>Published by Campus Academic Registrar</span>
                    <span>Date: {n.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-4 pt-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Upcoming Campus Events</h2>
            <p className="text-xs text-slate-500 mt-1">Workshops, hackathons, seminars, and other campus activities.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => {
              const isRegistered = eventRegistrations.includes(event.id);
              return (
                <Card key={event.id}>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-sm">{event.title}</CardTitle>
                      <Badge variant="info" size="sm">{event.category}</Badge>
                    </div>
                    <div className="space-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-blue-600" />{event.date} ({event.time})</div>
                      <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-600" />{event.venue} • {event.building}</div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
                    <Button
                      variant={isRegistered ? 'success' : 'primary'}
                      size="sm"
                      icon={isRegistered ? CheckCircle2 : UserCheck}
                      onClick={() => toggleEventRegistration(event.id)}
                    >
                      {isRegistered ? 'Registered' : 'Register Now'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
