import { useState, useEffect } from 'react';
import { MessageSquare, Send, ChevronDown, ChevronUp, Home } from 'lucide-react';
import { inquiryAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const STATUS_BADGE = {
  pending: 'badge badge-warning',
  replied: 'badge badge-success',
  closed:  'badge badge-slate',
};

export default function OwnerInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState(null);
  const [replies, setReplies]     = useState({});
  const [sending, setSending]     = useState({});

  const load = async () => {
    try {
      const { data } = await inquiryAPI.getAll();
      setInquiries(data.inquiries);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleReply = async (id) => {
    if (!replies[id]?.trim()) return;
    setSending(p => ({ ...p, [id]: true }));
    try {
      await inquiryAPI.reply(id, replies[id]);
      await load();
      setReplies(p => ({ ...p, [id]: '' }));
      toast.success('Reply sent!');
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setSending(p => ({ ...p, [id]: false }));
    }
  };

  const pending = inquiries.filter(i => i.status === 'pending').length;

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      <div className="page-container py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare size={22} className="text-primary-600" /> Received Inquiries
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {inquiries.length} total &mdash; <span className="text-amber-600 font-medium">{pending} pending</span>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading inquiries…" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={36} className="text-slate-300" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-700 mb-2">No inquiries yet</h2>
            <p className="text-slate-400 text-sm mb-6">Buyers will send inquiries about your listings here</p>
            <Link to="/owner/listings" className="btn-primary">
              <Home size={16} /> View My Listings
            </Link>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            {inquiries.map(inq => (
              <div key={inq._id} className="card overflow-hidden">
                {/* Header */}
                <div
                  className="p-5 cursor-pointer hover:bg-slate-50/80 transition-colors"
                  onClick={() => setExpanded(expanded === inq._id ? null : inq._id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {inq.userId?.name?.charAt(0) ?? '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{inq.userId?.name}</p>
                        <p className="text-xs text-slate-400">{inq.userId?.email}</p>
                        {inq.propertyId && (
                          <Link
                            to={`/properties/${inq.propertyId._id}`}
                            onClick={e => e.stopPropagation()}
                            className="text-xs text-primary-600 hover:underline mt-0.5 block"
                          >
                            Re: {inq.propertyId.title}
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={STATUS_BADGE[inq.status] || 'badge badge-slate'}>{inq.status}</span>
                      <span className="text-xs text-slate-400">{new Date(inq.createdAt).toLocaleDateString()}</span>
                      {expanded === inq._id
                        ? <ChevronUp size={16} className="text-slate-400" />
                        : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mt-3 pl-[52px]">{inq.message}</p>
                </div>

                {/* Expanded */}
                {expanded === inq._id && (
                  <div className="border-t border-slate-100 p-5 animate-slide-down space-y-4">
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Message</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{inq.message}</p>
                    </div>

                    {inq.reply ? (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-2">Your Reply</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{inq.reply}</p>
                        {inq.repliedAt && (
                          <p className="text-xs text-slate-400 mt-2">{new Date(inq.repliedAt).toLocaleString()}</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          rows={3}
                          className="input-field text-sm resize-none"
                          placeholder="Type your reply…"
                          value={replies[inq._id] || ''}
                          onChange={e => setReplies(p => ({ ...p, [inq._id]: e.target.value }))}
                        />
                        <button
                          onClick={() => handleReply(inq._id)}
                          disabled={sending[inq._id] || !replies[inq._id]?.trim()}
                          className="btn-primary text-sm py-2"
                        >
                          {sending[inq._id]
                            ? <><LoadingSpinner size="sm" color="white" inline /> Sending…</>
                            : <><Send size={14} /> Send Reply</>}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
