import React, { useState } from 'react';
import { X, Bookmark, FileText, Ghost } from 'lucide-react';
import { Post } from '../types';

interface UserPostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: Post[];
  savedPostIds: Set<string>;
  onPostClick: (post: Post) => void;
}

const UserPostsModal: React.FC<UserPostsModalProps> = ({ isOpen, onClose, posts, savedPostIds, onPostClick }) => {
  const [activeTab, setActiveTab] = useState<'mine' | 'saved'>('mine');

  if (!isOpen) return null;

  // Filter posts
  const myPosts = posts.filter(p => p.isMine);
  const savedPosts = posts.filter(p => savedPostIds.has(p.id));

  const displayPosts = activeTab === 'mine' ? myPosts : savedPosts;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Tabs */}
        <div className="border-b border-white/40 sticky top-0 z-10 bg-white/30 backdrop-blur-md">
            <div className="flex justify-between items-center p-4 pb-2">
                <h2 className="text-lg font-bold text-gray-800 pl-2">Library</h2>
                <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition text-gray-600">
                    <X size={20} />
                </button>
            </div>
            
            <div className="flex px-4 pb-0">
                <button 
                    onClick={() => setActiveTab('mine')}
                    className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'mine' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    <FileText size={16} /> My Drops
                </button>
                <button 
                    onClick={() => setActiveTab('saved')}
                    className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'saved' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    <Bookmark size={16} /> Saved
                </button>
            </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 bg-transparent">
            {displayPosts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                    <div className="bg-white/40 p-6 rounded-full mb-4 backdrop-blur-sm border border-white/50">
                        {activeTab === 'mine' ? <Ghost size={32} /> : <Bookmark size={32} />}
                    </div>
                    <p className="font-medium">
                        {activeTab === 'mine' ? "You haven't dropped anything yet." : "No saved posts yet."}
                    </p>
                    <p className="text-xs mt-1 opacity-70">
                        {activeTab === 'mine' ? "Time to speak your mind!" : "Hit the bookmark icon on any post."}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {displayPosts.map(post => (
                        <div 
                            key={post.id}
                            onClick={() => {
                                onPostClick(post);
                                // Optional: Close this modal if you want to jump straight to physics view detail
                                // onClose(); 
                            }}
                            className="bg-white/60 p-4 rounded-2xl shadow-sm border border-white/50 hover:bg-white/80 hover:shadow-md transition-all cursor-pointer flex gap-4 items-start backdrop-blur-sm"
                        >
                            <div 
                                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                                style={{ backgroundColor: post.color + '40', color: '#333' }}
                            >
                                {post.sentiment.substring(0,2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-gray-800 font-medium line-clamp-2 text-sm leading-relaxed">
                                    {post.text}
                                </p>
                                <div className="flex gap-3 mt-2 text-xs text-gray-400">
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">👍 {post.upvotes}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserPostsModal;