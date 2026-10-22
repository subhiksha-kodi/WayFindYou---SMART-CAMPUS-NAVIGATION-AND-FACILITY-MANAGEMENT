import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Map, MapPin, Search, Navigation, Layers, Filter, Clock, Footprints, Compass, UserCheck } from 'lucide-react';
import { FacultyLayout } from '../../components/layout/FacultyLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { CampusMap, CAMPUS_LOCATIONS } from '../../components/navigation/CampusMap';
import { matchCampusLocation } from '../../data/campusLocations';
import { SearchBar } from '../../components/ui/SearchBar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { INITIAL_FACULTY_PROFILE } from '../../services/facultyData';
import { useToast } from '../../context/ToastContext';

export const FACULTY_DESTINATIONS = CAMPUS_LOCATIONS;

export const FacultyCampusMapPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('dest') || searchParams.get('q') || '';
  const { addToast } = useToast();

  const [selectedLoc, setSelectedLoc] = useState(() => matchCampusLocation(initialQuery || 'Sunflower Block'));
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      const matched = matchCampusLocation(initialQuery);
      setSelectedLoc(matched);
      setSearchQuery(initialQuery);
      addToast(`Route calculated to ${matched.name}`, 'info');
    }
  }, [initialQuery]);

  const handleStartNavigation = () => {
    setIsNavigating(true);
    addToast(`Live turn-by-turn navigation active to ${selectedLoc.name}`, 'success');
  };

  const filteredLocations = CAMPUS_LOCATIONS.filter((loc) => {
    const matchesCategory = filterCategory === 'all' || loc.category === filterCategory;
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <FacultyLayout>
      <PageHeader
        title="Interactive Campus Map & Faculty Navigation"
        description="Explore your campus and find point-to-point accessible routes from your Faculty Office to any classroom, venue, or facility."
        breadcrumbs={[{ label: 'Campus Map & Navigation' }]}
        actions={
          <Badge variant="info" size="md">
            Spatial Navigation Layer
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar Location Selector & Search */}
        <div className="lg:col-span-4 space-y-4">
          {/* Starting Office Origin Card */}
          <Card className="border-emerald-200 bg-emerald-50/40">
            <CardContent className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">STARTING POINT</span>
                  <h5 className="text-xs font-black text-slate-900">{INITIAL_FACULTY_PROFILE.office_location}</h5>
                </div>
              </div>
              <Badge variant="success" size="sm">Office Baseline</Badge>
            </CardContent>
          </Card>

          <SearchBar
            placeholder="Search classroom, lab, building or hall..."
            onSearch={(q) => setSearchQuery(q)}
            suggestions={CAMPUS_LOCATIONS.map((l) => l.name)}
          />

          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'academic', label: 'Academic' },
              { id: 'amenities', label: 'Amenities' },
              { id: 'parking', label: 'Parking' },
              { id: 'emergency', label: 'Emergency' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  filterCategory === cat.id
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Active Navigation Summary & Action */}
          {selectedLoc && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="info" size="sm">{selectedLoc.category.toUpperCase()}</Badge>
                  <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                    <Footprints className="w-3.5 h-3.5" /> ~280m • ~4 Mins
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{selectedLoc.name}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{selectedLoc.description}</p>
                </div>

                <Button
                  variant={isNavigating ? 'success' : 'primary'}
                  size="md"
                  fullWidth
                  icon={Navigation}
                  onClick={handleStartNavigation}
                  className="font-extrabold shadow-sm"
                >
                  {isNavigating ? 'LIVE NAVIGATION ACTIVE' : 'START TURN-BY-TURN ROUTE'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Location List Items */}
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredLocations.map((loc) => {
              const isSelected = selectedLoc && selectedLoc.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => {
                    setSelectedLoc(loc);
                    setIsNavigating(false);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{loc.name}</span>
                        <Badge variant={loc.status === 'Open' ? 'success' : 'warning'} size="sm">
                          {loc.code}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{loc.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100 text-xs">
                    <span className="text-slate-400">Hours: <strong className="text-slate-700">{loc.hours}</strong></span>
                    <Button variant={isSelected ? 'primary' : 'outline'} size="xs" icon={Navigation}>
                      {isSelected ? 'Selected' : 'Locate'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Map Canvas Container */}
        <div className="lg:col-span-8">
          <Card className="p-1 border border-slate-200 shadow-sm">
            <CampusMap
              height="h-[620px]"
              selectedDestination={selectedLoc}
              onSelectDestination={(loc) => {
                setSelectedLoc(loc);
                setIsNavigating(false);
              }}
            />
          </Card>
        </div>
      </div>
    </FacultyLayout>
  );
};
