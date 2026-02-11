import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, RefreshCw, Menu, User, FileText, Bookmark, Settings, LogOut, Search, X, Ghost } from 'lucide-react';
import PhysicsWorld from './components/PhysicsWorld';
import CreatePostModal from './components/CreatePostModal';
import PostDetailModal from './components/PostDetailModal';
import ProfileModal from './components/ProfileModal';
import SettingsModal from './components/SettingsModal';
import LogoutModal from './components/LogoutModal';
import UserPostsModal from './components/UserPostsModal';

import { Post, SentimentType } from './types';
import { generateInitialPosts } from './services/geminiService';
import { INITIAL_POSTS_COUNT, SENTIMENT_COLORS } from './constants';

// Simple ID helper
const generateId = () => Math.random().toString(36).substr(2, 9);

type ActiveModal = 'profile' | 'posts' | 'settings' | 'logout' | null;

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Menu Modals State
  const [activeMenuModal, setActiveMenuModal] = useState<ActiveModal>(null);

  // Saved Posts State (Lifted)
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize with Gemini data
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const generated = await generateInitialPosts();
      
      const newPosts: Post[] = generated.map((g, index) => ({
        id: generateId(),
        text: g.text,
        sentiment: g.sentiment,
        color: g.color,
        createdAt: Date.now(),
        upvotes: Math.floor(Math.random() * 50),
        isFlagged: false,
        // Mark first 5 posts as "mine" for demo purposes
        isMine: index < 5 
      }));

      // Add a welcome post
      newPosts.unshift({
        id: 'welcome-post',
        text: "Welcome to Gravity! Drop a thought.",
        sentiment: SentimentType.HAPPY,
        color: SENTIMENT_COLORS[SentimentType.HAPPY],
        createdAt: Date.now(),
        upvotes: 100,
        isFlagged: false,
        isMine: false
      });

      setPosts(newPosts);
      setIsLoading(false);
    };
    init();
  }, []);

  const handleCreatePost = async (text: string, sentiment: SentimentType) => {
    const newPost: Post = {
      id: generateId(),
      text,
      sentiment: sentiment,
      color: SENTIMENT_COLORS[sentiment],
      createdAt: Date.now(),
      upvotes: 0,
      isFlagged: false,
      isMine: true
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const handleVote = useCallback((id: string, delta: number) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, upvotes: p.upvotes + delta } : p
    ));
  }, []);

  const handleReport = useCallback((id: string) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, isFlagged: true } : p
    ));
    alert("Thanks for keeping the pile clean. We've received your report.");
  }, []);

  const handleToggleSave = useCallback((id: string) => {
    setSavedPostIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        return next;
    });
  }, []);

  const refreshPile = useCallback(async () => {
      setPosts([]); // Clear to trigger re-fall
      setIsLoading(true);
      // Reset search when refreshing
      setSearchQuery('');
      setTimeout(async () => {
          const generated = await generateInitialPosts();
          const newPosts: Post[] = generated.map((g, index) => ({
            id: generateId(),
            text: g.text,
            sentiment: g.sentiment,
            color: g.color,
            createdAt: Date.now(),
            upvotes: Math.floor(Math.random() * 50),
            isFlagged: false,
            isMine: index < 5
          }));
          setPosts(newPosts);
          setIsLoading(false);
      }, 500);
  }, []);

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    return posts.filter(post => 
      post.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleMenuClick = (modalType: ActiveModal) => {
      setActiveMenuModal(modalType);
      setIsMenuOpen(false);
  };

  const handleLogout = () => {
      setActiveMenuModal(null);
      alert("You have been logged out (Demo).");
  };

  return (
    <div 
      className="h-screen w-screen flex flex-col relative overflow-hidden bg-slate-50 font-sans text-slate-900"
      onClick={() => {
        if (isMenuOpen) setIsMenuOpen(false);
      }}
    >
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 pointer-events-none flex justify-between items-start">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 pr-6 shadow-sm border border-white/50 pointer-events-auto flex items-center gap-3">
           {/* Custom Logo */}
           <div className="relative w-10 h-10 flex-shrink-0">
             <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9333EA" />
                    <stop offset="1" stopColor="#DB2777" />
                  </linearGradient>
                </defs>
                <circle cx="16" cy="32" r="10" fill="url(#logo-gradient)" />
                <circle cx="34" cy="28" r="9" fill="url(#logo-gradient)" fillOpacity="0.9" />
                <circle cx="24" cy="14" r="9" fill="url(#logo-gradient)" />
             </svg>
           </div>

           <div>
             <h1 className="text-2xl font-black tracking-tight text-slate-800 leading-none">
               Gravity
             </h1>
             <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">The Social Pile</p>
           </div>
        </div>
        
        <div className="flex gap-2 pointer-events-auto items-center">
             <button 
                onClick={(e) => {
                  e.stopPropagation();
                  refreshPile();
                }}
                className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-white/50 hover:bg-white text-slate-600 transition"
                title="Refresh Pile"
             >
                <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
             </button>

             {/* Search Button / Expandable Input */}
             <div className={`relative transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${isSearchOpen ? 'w-64' : 'w-auto'}`}>
                {isSearchOpen ? (
                    <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search pile..."
                            autoFocus
                            className="w-full pl-10 pr-10 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-purple-300 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm transition-all"
                            style={{ height: '46px' }}
                        />
                        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500" />
                        <button 
                            onClick={handleCloseSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsSearchOpen(true);
                            setIsMenuOpen(false); // Close menu if open
                        }}
                        className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-white/50 hover:bg-white text-slate-600 transition flex items-center justify-center"
                    >
                        <Search size={20} />
                    </button>
                )}
             </div>
             
             <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                    setIsSearchOpen(false); // Close search if menu opens
                  }}
                  className={`p-3 backdrop-blur-md rounded-full shadow-sm border border-white/50 hover:bg-white transition flex items-center justify-center ${isMenuOpen ? 'bg-white text-purple-600 ring-2 ring-purple-100' : 'bg-white/80 text-slate-600'}`}
                >
                  <Menu size={20} />
                </button>

                {isMenuOpen && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden py-2 z-50 animate-in slide-in-from-top-2 fade-in duration-200 origin-top-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-4 py-3 border-b border-gray-100 mb-1">
                      <p className="text-sm font-bold text-gray-900">Guest User</p>
                      <p className="text-xs text-gray-500 truncate">user@gravity.app</p>
                    </div>
                    
                    <button 
                        onClick={() => handleMenuClick('profile')}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-3 transition-colors"
                    >
                      <User size={18} /> Profile
                    </button>
                    <button 
                        onClick={() => handleMenuClick('posts')}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-3 transition-colors"
                    >
                      <FileText size={18} /> My Posts
                    </button>
                    <button 
                        onClick={() => handleMenuClick('posts')} // Reusing posts modal with saved tab active logic could be better, but simpler to just open library
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-3 transition-colors"
                    >
                      <Bookmark size={18} /> Saved
                    </button>
                    <button 
                        onClick={() => handleMenuClick('settings')}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-3 transition-colors"
                    >
                      <Settings size={18} /> Settings
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
                    <button 
                        onClick={() => handleMenuClick('logout')}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
             </div>
        </div>
      </header>

      {/* Physics Canvas */}
      <main className="flex-1 relative">
        {isLoading && posts.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                <p>Building the pile...</p>
            </div>
        ) : filteredPosts.length === 0 && searchQuery ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2 p-4 animate-in fade-in zoom-in duration-300">
                <div className="bg-white p-6 rounded-full shadow-lg mb-2">
                    <Ghost size={48} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-700">Poof! Nothing here.</h3>
                <p className="text-center max-w-xs text-sm text-slate-500">
                    We couldn't find any thought bubbles matching "<span className="font-semibold text-purple-600">{searchQuery}</span>".
                </p>
                <button 
                  onClick={handleCloseSearch}
                  className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition shadow-md"
                >
                  Clear search
                </button>
            </div>
        ) : (
            <PhysicsWorld posts={filteredPosts} onPostClick={setSelectedPost} />
        )}
      </main>

      {/* Floating Action Button */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="pointer-events-auto group relative flex items-center gap-3 px-6 py-3 bg-black text-white rounded-full shadow-2xl hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all duration-300"
        >
           <Plus className="group-hover:rotate-90 transition-transform duration-300" />
           <span className="font-semibold text-lg">Drop Thought</span>
        </button>
      </div>

      {/* Creation & Detail Modals */}
      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreatePost} 
      />

      <PostDetailModal 
        post={selectedPost} 
        isSaved={selectedPost ? savedPostIds.has(selectedPost.id) : false}
        onClose={() => setSelectedPost(null)}
        onVote={handleVote}
        onReport={handleReport}
        onToggleSave={handleToggleSave}
      />

      {/* User Menu Modals */}
      <ProfileModal 
        isOpen={activeMenuModal === 'profile'} 
        onClose={() => setActiveMenuModal(null)} 
      />
      
      <UserPostsModal 
        isOpen={activeMenuModal === 'posts'} 
        onClose={() => setActiveMenuModal(null)} 
        posts={posts}
        savedPostIds={savedPostIds}
        onPostClick={(post) => {
            setActiveMenuModal(null); // Close list
            setSelectedPost(post);    // Open detail
        }}
      />

      <SettingsModal 
        isOpen={activeMenuModal === 'settings'} 
        onClose={() => setActiveMenuModal(null)} 
      />

      <LogoutModal 
        isOpen={activeMenuModal === 'logout'} 
        onClose={() => setActiveMenuModal(null)} 
        onConfirm={handleLogout} 
      />

    </div>
  );
};

export default App;