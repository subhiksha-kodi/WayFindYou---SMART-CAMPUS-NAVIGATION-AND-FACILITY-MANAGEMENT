import React, { useEffect, useState } from 'react';
import { Star, AlertTriangle, Image, Video, Calendar, User, Eye, CheckCircle2, MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { getAllFeedbackSubmissions, getFeedbackMediaAsset, FEEDBACK_ASPECT_OPTIONS } from '../../services/feedbackService';

export const AdminFeedbackPage = () => {
  const [submissions, setSubmissions] = useState(() => getAllFeedbackSubmissions());
  const [selected, setSelected] = useState(null);
  const [mediaUrls, setMediaUrls] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  useEffect(() => {
    const onStorage = () => setSubmissions(getAllFeedbackSubmissions());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const totalCount = submissions.length;
  const avgOverall = totalCount
    ? Math.round((submissions.reduce((s, it) => s + (it.overallRating || 0), 0) / totalCount) * 10) / 10
    : 0;

  const lowRatingCount = submissions.filter((s) => (s.overallRating || 0) <= 2).length;

  const aspectAverages = FEEDBACK_ASPECT_OPTIONS.map((aspect) => {
    const sum = submissions.reduce((acc, curr) => acc + (curr.aspectRatings?.[aspect.key] || 0), 0);
    const avg = totalCount ? Math.round((sum / totalCount) * 10) / 10 : 0;
    return { ...aspect, avg };
  });

  const openDetail = async (submission) => {
    setSelected(submission);
    setLoadingMedia(true);
    const urls = [];
    try {
      if (submission.media?.photos?.length) {
        for (const p of submission.media.photos) {
          const asset = await getFeedbackMediaAsset(p.id);
          if (asset && asset.blob) {
            urls.push({ type: 'photo', url: URL.createObjectURL(asset.blob), name: p.name, size: p.size });
          }
        }
      }
      if (submission.media?.video) {
        const v = submission.media.video;
        const asset = await getFeedbackMediaAsset(v.id);
        if (asset && asset.blob) {
          urls.push({ type: 'video', url: URL.createObjectURL(asset.blob), name: v.name, size: v.size });
        }
      }
    } catch (err) {
      console.warn('Unable to load attached media assets', err);
    } finally {
      setMediaUrls(urls);
      setLoadingMedia(false);
    }
  };

  const closeDetail = () => {
    mediaUrls.forEach((m) => URL.revokeObjectURL(m.url));
    setMediaUrls([]);
    setSelected(null);
  };

  const renderStars = (rating, sizeClass = 'w-4 h-4') => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Visitor Feedback Center</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            End-to-end post-visit ratings, comments, and media submissions from campus visitors.
          </p>
        </div>
      </div>

      {/* KPI Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-200/60">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Average Rating</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900">{avgOverall}</span>
                <span className="text-xs text-slate-500">/ 5.0</span>
              </div>
              <div className="mt-1">{renderStars(Math.round(avgOverall), 'w-3.5 h-3.5')}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
              <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Submissions</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{totalCount}</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Reviewed campus visits</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className={`p-4 ${lowRatingCount > 0 ? 'bg-rose-50/50 border-rose-200' : ''}`}>
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">Low Rating Alerts</span>
              <span className="text-2xl font-black text-rose-700 mt-1 block">{lowRatingCount}</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Visits rated ≤ 2 stars</span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${lowRatingCount > 0 ? 'bg-rose-500/20 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Aspect Averages</span>
            <div className="space-y-1.5 text-xs">
              {aspectAverages.map((asp) => (
                <div key={asp.key} className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 truncate">{asp.label}:</span>
                  <span className="font-bold text-slate-900">{asp.avg}/5</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Submissions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-extrabold text-slate-900">Submitted Feedback Log</CardTitle>
          {lowRatingCount > 0 && (
            <Badge variant="destructive" size="sm" icon={AlertTriangle}>
              {lowRatingCount} Low-rated {lowRatingCount === 1 ? 'visit' : 'visits'} flagged
            </Badge>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {submissions.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Star className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">No feedback submissions recorded yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Visitor feedback will populate automatically as visitors complete campus trips and submit reviews.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/80 border-b border-slate-200">
                    <th className="px-4 py-3">Visitor</th>
                    <th className="px-4 py-3">Visit Details</th>
                    <th className="px-4 py-3">Overall Rating</th>
                    <th className="px-4 py-3">Comment Preview</th>
                    <th className="px-4 py-3">Media</th>
                    <th className="px-4 py-3">Submitted</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {submissions.map((s) => {
                    const isLow = (s.overallRating || 0) <= 2;
                    return (
                      <tr
                        key={s.id}
                        className={`transition-colors ${
                          isLow ? 'bg-rose-50/60 hover:bg-rose-100/60 border-l-4 border-l-rose-500' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="px-4 py-3.5 align-top">
                          <div className="font-extrabold text-slate-900">{s.visitorName}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">ID: {s.visitorId}</div>
                        </td>

                        <td className="px-4 py-3.5 align-top">
                          <div className="font-bold text-slate-800">{s.visitSnapshot?.host || 'Campus Visit'}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {s.visitSnapshot?.date} • {s.visitSnapshot?.purpose || 'Visit'}
                          </div>
                        </td>

                        <td className="px-4 py-3.5 align-top">
                          <div className="flex items-center gap-2">
                            <span className={`font-black text-sm ${isLow ? 'text-rose-700' : 'text-slate-900'}`}>
                              {s.overallRating} / 5
                            </span>
                            {isLow && (
                              <Badge variant="destructive" size="sm" icon={AlertTriangle}>
                                Low
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1">{renderStars(s.overallRating, 'w-3 h-3')}</div>
                        </td>

                        <td className="px-4 py-3.5 align-top max-w-[260px]">
                          <p className="text-xs text-slate-700 line-clamp-2">
                            {s.comment ? `"${s.comment}"` : <span className="text-slate-400 italic">No written comment</span>}
                          </p>
                        </td>

                        <td className="px-4 py-3.5 align-top">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            {s.media?.photos?.length > 0 && (
                              <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                <Image className="w-3.5 h-3.5" /> {s.media.photos.length}
                              </span>
                            )}
                            {s.media?.video && (
                              <span className="inline-flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                                <Video className="w-3.5 h-3.5" /> 1
                              </span>
                            )}
                            {!s.media?.photos?.length && !s.media?.video && (
                              <span className="text-slate-400">—</span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3.5 align-top text-xs text-slate-500 whitespace-nowrap">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-3.5 align-top text-right">
                          <Button size="sm" variant="outline" icon={Eye} onClick={() => openDetail(s)}>
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Submission Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={closeDetail}
        title={selected ? `Feedback: ${selected.visitorName}` : 'Feedback Entry'}
        maxWidth="max-w-2xl"
      >
        {selected && (
          <div className="space-y-5 py-2">
            {/* Header info */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Visitor & Host</span>
                <h4 className="text-base font-extrabold text-slate-900 mt-0.5">{selected.visitorName}</h4>
                <p className="text-xs text-slate-500">
                  Visited: <strong className="text-slate-700">{selected.visitSnapshot?.host}</strong> on {selected.visitSnapshot?.date}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Overall Score</span>
                <div className="flex items-center justify-end gap-2 mt-0.5">
                  <span className="text-2xl font-black text-slate-900">{selected.overallRating} / 5</span>
                  {selected.overallRating <= 2 && <Badge variant="destructive" size="sm">Low</Badge>}
                </div>
                <div className="mt-1 flex justify-end">{renderStars(selected.overallRating, 'w-4 h-4')}</div>
              </div>
            </div>

            {/* Aspect Ratings breakdown */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Aspect Breakdown</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FEEDBACK_ASPECT_OPTIONS.map((aspect) => {
                  const rating = selected.aspectRatings?.[aspect.key] || 0;
                  return (
                    <div key={aspect.key} className="rounded-xl border border-slate-200 bg-white p-3 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{aspect.label}</span>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-slate-900">{rating} / 5</span>
                        {renderStars(rating, 'w-3.5 h-3.5')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Full Comment */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Written Feedback</h5>
              <div className="p-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 leading-relaxed">
                {selected.comment ? (
                  <p className="whitespace-pre-wrap">"{selected.comment}"</p>
                ) : (
                  <span className="text-slate-400 italic">No written comment provided by the visitor.</span>
                )}
              </div>
            </div>

            {/* Attached Media Assets */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Attached Photos & Video</h5>
              {loadingMedia ? (
                <div className="p-6 text-center text-xs text-slate-500">Loading media attachments...</div>
              ) : mediaUrls.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mediaUrls.map((media, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 bg-white p-2 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 px-1">
                        <span className="truncate">{media.name}</span>
                        <span className="uppercase text-[9px] font-bold text-slate-400">{media.type}</span>
                      </div>
                      {media.type === 'photo' ? (
                        <img
                          src={media.url}
                          alt={media.name}
                          className="w-full h-48 object-cover rounded-lg border border-slate-100"
                        />
                      ) : (
                        <video
                          src={media.url}
                          controls
                          className="w-full h-48 rounded-lg bg-black object-contain"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 text-center">
                  No photos or video attached to this submission.
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <Button variant="primary" size="md" onClick={closeDetail}>
                Done Viewing
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminFeedbackPage;

