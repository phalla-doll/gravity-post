import React, { useState } from 'react';
import { Post } from '../types';
import { X, ThumbsUp, ThumbsDown, AlertTriangle, Share2, Bookmark } from 'lucide-react';

interface PostDetailModalProps {
  post: Post | null;
  isSaved: boolean;
  onClose: () => void;
  onVote: (id: string, delta: number) => void;
  onReport: (id: string) => void;
  onToggleSave: (id: string) => void;
  currentUserHandle?: string; // New Prop
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ 
    post, 
    isSaved, 
    onClose, 
    onVote, 
    onReport, 
    onToggleSave,
    currentUserHandle = '@gravity_guest' // Default fallback
}) => {
  const [hasVoted, setHasVoted] = useState(0); // -1, 0, 1
  const [hasReported, setHasReported] = useState(false);
  const [animatingBtn, setAnimatingBtn] = useState<number | null>(null);

  if (!post) return null;

  const handleVote = (delta: number) => {
    if (hasVoted === delta) return; // Already voted this way
    
    // Trigger animation
    setAnimatingBtn(delta);
    setTimeout(() => setAnimatingBtn(null), 300);

    onVote(post.id, delta);
    setHasVoted(delta);
  };

  const handleReport = () => {
    onReport(post.id);
    setHasReported(true);
  };

  // Determine username to display
  // Use passed currentUserHandle if post is mine
  const username = post.isMine ? currentUserHandle : `@user_${post.id.slice(0, 7)}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-2xl border border-white/60 rounded-[2rem] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ 
            boxShadow: `0 25px 50px -12px ${post.color}50` // Soft colored shadow
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Mood Color */}
        <div 
          className="h-32 w-full flex items-center justify-center p-6 relative"
          style={{ backgroundColor: post.color }}
        >
           {/* Soft gradient overlay for depth */}
           <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
           
           <button 
            onClick={onClose} 
            className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition z-10 backdrop-blur-md border border-white/30"
          >
            <X size={20} />
          </button>

           <span className="text-6xl opacity-30 filter contrast-200 mix-blend-overlay text-white select-none">
             ❝
           </span>
        </div>

        {/* Content Body - Glassmorphism */}
        <div className="p-8 text-center -mt-8 bg-gradient-to-b from-white/95 via-white/80 to-white/60 backdrop-blur-xl rounded-t-[2.5rem] relative border-t border-white/60 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            
            {/* Metadata Pill */}
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-white/60 backdrop-blur-sm mb-5 shadow-sm">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-400/50"></span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{post.sentiment}</span>
            </div>
            
            <p className="text-2xl font-bold text-gray-800 leading-tight mb-3 drop-shadow-sm">
              "{post.text}"
            </p>

            <p className="text-sm font-medium text-gray-500 mb-8 tracking-wide flex items-center justify-center gap-1 opacity-80">
              {username}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-center gap-6">
              {/* Upvote Button */}
              <button 
                onClick={() => handleVote(1)}
                className={`
                  flex flex-col items-center gap-2 transition-all duration-300
                  ${animatingBtn === 1 ? 'scale-110' : 'hover:scale-105'}
                `}
              >
                <div className={`
                  p-4 rounded-full transition-all duration-300 backdrop-blur-md border shadow-sm
                  ${hasVoted === 1 
                    ? 'bg-green-400/20 border-green-400/50 text-green-700 shadow-green-200' 
                    : 'bg-white/40 border-white/60 text-gray-500 hover:bg-white/60'}
                `}>
                  <ThumbsUp 
                    size={24} 
                    className={`transition-transform duration-300 ${animatingBtn === 1 ? '-rotate-12' : ''}`}
                    fill={hasVoted === 1 ? "currentColor" : "none"} 
                  />
                </div>
                <span className={`font-bold text-sm ${hasVoted === 1 ? 'text-green-600' : 'text-gray-400'}`}>
                    {post.upvotes + (hasVoted === 1 ? 1 : 0)}
                </span>
              </button>

              {/* Downvote Button */}
              <button 
                onClick={() => handleVote(-1)}
                className={`
                  flex flex-col items-center gap-2 transition-all duration-300
                  ${animatingBtn === -1 ? 'scale-110' : 'hover:scale-105'}
                `}
              >
                <div className={`
                  p-4 rounded-full transition-all duration-300 backdrop-blur-md border shadow-sm
                  ${hasVoted === -1 
                    ? 'bg-red-400/20 border-red-400/50 text-red-600 shadow-red-200' 
                    : 'bg-white/40 border-white/60 text-gray-500 hover:bg-white/60'}
                `}>
                  <ThumbsDown 
                    size={24} 
                    className={`transition-transform duration-300 ${animatingBtn === -1 ? 'rotate-12' : ''}`}
                    fill={hasVoted === -1 ? "currentColor" : "none"} 
                  />
                </div>
                <span className={`font-bold text-sm ${hasVoted === -1 ? 'text-red-600' : 'text-gray-400'}`}>
                    Pass
                </span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/40 flex justify-between items-center text-gray-500">
              <div className="flex gap-2">
                <button className="flex items-center gap-2 hover:text-purple-600 transition text-sm font-medium hover:bg-white/30 px-3 py-1.5 rounded-lg">
                  <Share2 size={16} /> Share
                </button>
                <button 
                  onClick={() => onToggleSave(post.id)}
                  className={`flex items-center gap-2 transition text-sm font-medium hover:bg-white/30 px-3 py-1.5 rounded-lg ${isSaved ? 'text-blue-600' : 'hover:text-blue-600'}`}
                >
                  <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>

              <button 
                onClick={handleReport}
                disabled={hasReported}
                className={`flex items-center gap-2 transition text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/30 ${hasReported ? 'text-red-400' : 'hover:text-red-500'}`}
              >
                <AlertTriangle size={16} /> {hasReported ? 'Reported' : 'Report'}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;