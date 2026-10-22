import React, { useState } from 'react';
import { MessageSquare, Upload, CheckCircle2, ListOrdered } from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useStudent } from '../../context/StudentContext';
import { useToast } from '../../context/ToastContext';

export const ComplaintTypes = [
  { value: 'Broken Chair', label: 'Broken Chair' },
  { value: 'Broken Desk', label: 'Broken Desk' },
  { value: 'Water Leakage', label: 'Water Leakage' },
  { value: 'Electrical Issue', label: 'Electrical Issue' },
  { value: 'Internet Issue', label: 'Internet Issue' },
  { value: 'Cleaning Required', label: 'Cleaning Required' },
  { value: 'AC Not Working', label: 'AC Not Working' },
  { value: 'Projector Not Working', label: 'Projector Not Working' },
];

export const ComplaintPage = () => {
  const { submitComplaint, complaints } = useStudent();
  const { addToast } = useToast();

  const [type, setType] = useState('Broken Chair');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim() || !description.trim()) {
      addToast('Please fill in location and description', 'warning');
      return;
    }

    const created = submitComplaint({
      type,
      location,
      description,
      photoName: fileName || null
    });

    addToast(`Complaint submitted successfully! Assigned ID: ${created.id}`, 'success');
    setType('Broken Chair');
    setLocation('');
    setDescription('');
    setFileName('');
  };

  return (
    <AppLayout>
      <PageHeader
        title="Complaints & History"
        description="Submit facility issue reports and track the progress of every complaint in one place."
        breadcrumbs={[{ label: 'Complaints' }]}
      />

      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader actions={
            <span className="text-xs text-slate-500">New complaint</span>
          }>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              New Maintenance Complaint Form
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Complaint Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={ComplaintTypes}
              />

              <Input
                label="Location (Building / Floor / Room Number)"
                placeholder="e.g. Academic Block B, Floor 3, Room CS302"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Detailed Issue Description
                </label>
                <textarea
                  rows={4}
                  className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="Describe the issue in detail for campus technicians..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* Upload Image Section */}
              <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 text-xs text-slate-500 space-y-2">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <div>
                  <span className="font-semibold text-slate-700 block">Upload Photo Evidence (Optional)</span>
                  <span className="text-[11px] text-slate-400">PNG, JPG up to 5MB</span>
                </div>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setFileName(e.target.files[0].name);
                      addToast(`Selected file: ${e.target.files[0].name}`, 'info');
                    }
                  }}
                  className="text-xs text-slate-500 mx-auto cursor-pointer block"
                />
                {fileName && <p className="text-xs text-emerald-600 font-semibold">Attached: {fileName}</p>}
              </div>

              <Button type="submit" variant="primary" size="md" fullWidth icon={CheckCircle2}>
                Submit Complaint & Assign ID
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-blue-600" />
              Complaint History & Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {complaints.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No complaints submitted yet.</p>
            ) : (
              complaints.map((item) => (
                <div key={item.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-blue-600 text-sm">{item.id}</span>
                      <span className="font-bold text-sm text-slate-900">{item.type}</span>
                    </div>
                    <Badge variant={item.status === 'Completed' ? 'success' : item.status === 'Pending' ? 'warning' : 'info'} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-700">{item.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <span><strong className="block text-slate-400 uppercase">Location</strong>{item.location}</span>
                    <span><strong className="block text-slate-400 uppercase">Reported On</strong>{item.date}</span>
                    <span><strong className="block text-slate-400 uppercase">Assigned Team</strong>{item.assignedTo}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};
