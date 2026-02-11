import React, { useState } from 'react';
import { Post } from '../types';
import { X, ThumbsUp, ThumbsDown, AlertTriangle, Share2 } from 'lucide-react';

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
  onVote: (id: string, delta: number) => void;
  onReport: (id: string) => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose, onVote, onReport }) => {
  const [hasVoted, setHasVoted] = useState(0); // -1, 0, 1
  const [hasReported, setHasReported] = useState(false);

  if (!post) return null;

  const handleVote = (delta: number) => {
    if (hasVoted === delta) return; // Already voted this way
    onVote(post.id, delta);
    setHasVoted(delta);
  };

  const handleReport = () => {
    onReport(post.id);
    setHasReported(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border-4"
        style={{ borderColor: post.color }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-2 bg-white/50 hover:bg-white rounded-full transition z-10"
        >
          <X size={20} />
        </button>

        <div 
          className="h-32 w-full flex items-center justify-center p-6"
          style={{ backgroundColor: post.color }}
        >
           {/* Decorative Mood Icon/Text could go here */}
           <span className="text-6xl opacity-20 filter grayscale contrast-200">
             ❝
           </span>
        </div>

        <div className="p-8 text-center -mt-6 bg-white rounded-t-3xl relative">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })} • {post.sentiment}
            </div>
            
            <p className="text-2xl font-bold text-gray-800 leading-tight mb-8">
              "{post.text}"
            </p>

            <div className="flex items-center justify-center gap-6">
              <button 
                onClick={() => handleVote(1)}
                className={`flex flex-col items-center gap-1 transition ${hasVoted === 1 ? 'text-green-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <div className={`p-3 rounded-full ${hasVoted === 1 ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <ThumbsUp size={24} fill={hasVoted === 1 ? "currentColor" : "none"} />
                </div>
                <span className="font-bold text-sm">{post.upvotes + (hasVoted === 1 ? 1 : 0)}</span>
              </button>

              <button 
                onClick={() => handleVote(-1)}
                className={`flex flex-col items-center gap-1 transition ${hasVoted === -1 ? 'text-red-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <div className={`p-3 rounded-full ${hasVoted === -1 ? 'bg-red-100' : 'bg-gray-100'}`}>
                  <ThumbsDown size={24} fill={hasVoted === -1 ? "currentColor" : "none"} />
                </div>
                <span className="font-bold text-sm">Pass</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t flex justify-between text-gray-400">
              <button className="flex items-center gap-2 hover:text-purple-600 transition text-sm">
                <Share2 size={16} /> Share
              </button>
              <button 
                onClick={handleReport}
                disabled={hasReported}
                className={`flex items-center gap-2 transition text-sm ${hasReported ? 'text-red-300' : 'hover:text-red-500'}`}
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