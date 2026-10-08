import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { inquiryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const STATUS_BADGE = {
  pending:  'badge badge-warning',
  replied:  'badge badge-success',
  closed:   'badge badge-slate',
};

export default function InquiriesPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState(null);
  const [replies, setReplies]     = useState({});
  const [sending, setSending]     = useState({});

  const load = async () => {
    try {
      const { data } = await inquiryAPI.getAll();
      setInquiries(data.inquiries);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this inquiry?')) return;
    try {
      await inquiryAPI.delete(id);
      setInquiries(p => p.filter(i => i._id !== id));
      toast.success('Inquiry deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleReply = async (id) => {
    if (!replies[id]?.trim()) return;
    setSending(p => ({ ...p, [id]: true }));
    try {
      await inquiryAPI.reply(id, replies[id]);
      await load();
      setReplies(p => ({ ...p, [id]: '' }));
      toast.success('Reply sent!');
    } catch { toast.error('Failed to send reply'); }
    finally { setSending(p => ({ ...p, [id]: false })); }
  };

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      <div className="page-container py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare size={22} className="text-primary-600" />
            {user?.role === 'buyer' ? 'My Inquiries' : 'Received Inquiries'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{inquiries.length} total inquiries</p>
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
            {user?.role === 'buyer' && (
              <>
                <p className="text-slate-400 text-sm mb-6">Find a property and send your first inquiry</p>
                <Link to="/properties" className="btn-primary">Browse Properties</Link>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            {inquiries.map(inq => (
              <div key={inq._id} className="card overflow-hidden">
                {/* Header row */}
                <div
                  className="p-5 cursor-pointer hover:bg-slate-50/80 transition-colors"
                  onClick={() => setExpanded(expanded === inq._id ? null : inq._id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {(user?.role === 'buyer' ? inq.ownerId?.name : inq.userId?.name)?.charAt(0) ?? '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          {user?.role === 'buyer' ? inq.ownerId?.name : inq.userId?.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {user?.role === 'buyer' ? 'Property Owner' : inq.userId?.email}
                        </p>
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

                {/* Expanded body */}
                {expanded === inq._id && (
                  <div className="border-t border-slate-100 p-5 animate-slide-down space-y-4">
                    <div className="bg-slate-50 rounded-2xl p-4">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Message</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{inq.message}</p>
                    </div>

                    {inq.reply && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-2">Reply</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{inq.reply}</p>
                        {inq.repliedAt && (
                          <p className="text-xs text-slate-400 mt-2">{new Date(inq.repliedAt).toLocaleString()}</p>
                        )}
                      </div>
                    )}

                    {/* Reply form — owners/admins only */}
                    {user?.role !== 'buyer' && inq.status !== 'replied' && (
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
                          disabled={sending[inq._id]}
                          className="btn-primary text-sm py-2"
                        >
                          {sending[inq._id]
                            ? <><LoadingSpinner size="sm" color="white" inline /> Sending…</>
                            : <><Send size={14} /> Send Reply</>}
                        </button>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(inq._id)}
                        className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
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
