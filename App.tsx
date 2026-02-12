import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { RefreshCw, Menu, User, FileText, Bookmark, Settings, LogOut, Search, X, Ghost, ChevronLeft, ChevronRight } from 'lucide-react';
import PhysicsWorld from './components/PhysicsWorld';
// Use the new Dynamic component (replaces old CreatePostModal logic)
import DynamicPostCreator from './components/CreatePostModal';
import PostDetailModal from './components/PostDetailModal';
import ProfileModal from './components/ProfileModal';
import SettingsModal from './components/SettingsModal';
import LogoutModal from './components/LogoutModal';
import UserPostsModal from './components/UserPostsModal';
import AboutModal from './components/AboutModal';
import CookingPotLoader from './components/CookingPotLoader';

import { Post, SentimentType } from './types';
import { generateInitialPosts } from './services/postService';
import { SENTIMENT_COLORS } from './constants';

// Simple ID helper
const generateId = () => Math.random().toString(36).substr(2, 9);

type ActiveModal = 'profile' | 'posts' | 'settings' | 'logout' | null;

interface UserProfile {
  name: string;
  handle: string;
  bio: string;
  location: string;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  // Removed isCreateModalOpen state as the new component handles itself
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Guest User",
    handle: "@gravity_guest",
    bio: "Just floating around in the gravity well. I like dropping thoughts and watching them collide.",
    location: "Earth"
  });
  
  // Menu Modals State
  const [activeMenuModal, setActiveMenuModal] = useState<ActiveModal>(null);

  // Saved Posts State (Lifted)
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Language State
  const [language, setLanguage] = useState<'en' | 'km'>('en');

  // Helper to calculate optimal post count based on screen area
  const getDynamicPostCount = useCallback(() => {
    if (typeof window === 'undefined') return 50;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    const area = width * height;
    const isMobile = width < 640;
    
    // Heuristic adjusted for denser mobile layout
    // Desktop: ~14000 pixels per post
    // Mobile: ~7000 pixels per post (since they are scaled down significantly)
    // This allows for a higher density of posts on smaller screens.
    const PIXELS_PER_POST = isMobile ? 7000 : 14000; 
    
    const calculated = Math.floor(area / PIXELS_PER_POST);
    
    // Clamping
    const MIN_POSTS = isMobile ? 30 : 25;
    const MAX_POSTS = 120; // Performance cap for Matter.js
    
    return Math.max(MIN_POSTS, Math.min(calculated, MAX_POSTS));
  }, []);

  // Fetch posts when page changes
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setPosts([]); // Clear to trigger re-fall/empty jar effect
      
      const count = getDynamicPostCount();
      const generated = await generateInitialPosts(count);
      
      const newPosts: Post[] = generated.map((g, index) => ({
        id: generateId(),
        text: g.text,
        sentiment: g.sentiment,
        color: g.color,
        createdAt: Date.now(),
        upvotes: Math.floor(Math.random() * 50),
        isFlagged: false,
        // Mark first 5 posts as "mine" for demo purposes on first page
        isMine: page === 1 && index < 5 
      }));

      // Add a welcome post only on page 1
      if (page === 1) {
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
      }

      setPosts(newPosts);
      setIsLoading(false);
    };

    fetchPosts();
  }, [page, getDynamicPostCount]);

  // Focus effect for search
  useEffect(() => {
    if (isSearchOpen) {
        // Delay slightly to match animation
        const timer = setTimeout(() => {
            searchInputRef.current?.focus();
        }, 300);
        return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  const handleNextPage = () => {
    setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    setPage(prev => Math.max(1, prev - 1));
  };

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

    // Append to end so it renders last (on top visually)
    setPosts(prev => [...prev, newPost]);
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

  const refreshPile = useCallback(() => {
     setIsLoading(true);
     setPosts([]);
     setSearchQuery('');
     
     // Quick timeout to allow UI to show empty state before refetching
     setTimeout(async () => {
         const count = getDynamicPostCount();
         const generated = await generateInitialPosts(count);
         
         const newPosts: Post[] = generated.map((g, index) => ({
            id: generateId(),
            text: g.text,
            sentiment: g.sentiment,
            color: g.color,
            createdAt: Date.now(),
            upvotes: Math.floor(Math.random() * 50),
            isFlagged: false,
            isMine: page === 1 && index < 5
         }));
         
         if (page === 1) {
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
         }
         
         setPosts(newPosts);
         setIsLoading(false);
     }, 500);
  }, [page, getDynamicPostCount]);

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
      className="h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900 flex flex-col"
      onClick={() => {
        if (isMenuOpen) setIsMenuOpen(false);
      }}
    >
      
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 p-4 pointer-events-none flex justify-between items-start">
        {/* Logo - Hides on mobile when search is open to prevent overlap */}
        <button 
          onClick={() => setIsAboutModalOpen(true)}
          className={`
            bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 pointer-events-auto flex items-center gap-2.5 hover:bg-white hover:scale-105 active:scale-95 transition-all text-left duration-300
            ${isSearchOpen ? 'w-0 opacity-0 px-0 overflow-hidden md:w-auto md:opacity-100 md:p-2 md:pr-4' : 'p-2 pr-4'}
          `}
          title="About Project"
        >
           {/* Custom Logo */}
           <div className="relative w-8 h-8 flex-shrink-0">
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

           <div className="whitespace-nowrap">
             <h1 className="text-xl font-black font-bold tracking-tight text-slate-800 leading-none">
               Gravity
             </h1>
             <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">The Social Pile</p>
           </div>
        </button>
        
        <div className="flex gap-2 pointer-events-auto items-center">
             {/* Refresh Button - Hides on mobile when search is open */}
             <button 
                onClick={(e) => {
                  e.stopPropagation();
                  refreshPile();
                }}
                className={`
                    bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-white/50 hover:bg-white text-slate-600 transition-all duration-300
                    ${isSearchOpen ? 'w-0 opacity-0 p-0 overflow-hidden md:w-auto md:opacity-100 md:p-3' : 'p-3'}
                `}
                title="Refresh Pile"
             >
                <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
             </button>

             {/* Search Component - Dynamic Expansion */}
             <div 
                className={`
                    relative h-[46px] bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-white/50 
                    flex items-center overflow-hidden
                    transition-all ease-[cubic-bezier(0.25,1,0.5,1)] duration-500
                    ${isSearchOpen 
                        ? 'bg-white ring-2 ring-slate-100 border-slate-300 w-[220px] sm:w-[260px]' 
                        : 'hover:bg-white cursor-pointer w-[46px]'
                    }
                `}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isSearchOpen) {
                        setIsSearchOpen(true);
                        setIsMenuOpen(false);
                    }
                }}
             >
                {/* Search Icon */}
                <div className="absolute left-0 top-0 bottom-0 w-[46px] flex items-center justify-center pointer-events-none z-10">
                    <Search 
                        size={20} 
                        className={`transition-colors duration-300 ${isSearchOpen ? 'text-slate-800' : 'text-slate-600'}`} 
                    />
                </div>

                {/* Input Field */}
                <input 
                    ref={searchInputRef}
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pile..."
                    className={`
                        w-full h-full bg-transparent border-none outline-none pl-12 pr-10 text-sm text-slate-700 placeholder-slate-400
                        transition-opacity duration-300
                        ${isSearchOpen ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'}
                    `}
                />

                {/* Close Button */}
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCloseSearch();
                    }}
                    className={`
                        absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-all duration-300
                        ${isSearchOpen ? 'opacity-100 rotate-0 scale-100 delay-100' : 'opacity-0 rotate-90 scale-50 pointer-events-none'}
                    `}
                >
                    <X size={16} />
                </button>
             </div>
             
             <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                    setIsSearchOpen(false); // Close search if menu opens
                  }}
                  className={`p-3 backdrop-blur-md rounded-full shadow-sm border border-white/50 hover:bg-white transition flex items-center justify-center ${isMenuOpen ? 'bg-white text-slate-900 ring-2 ring-slate-100' : 'bg-white/80 text-slate-600'}`}
                >
                  <Menu size={20} />
                </button>

                {isMenuOpen && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden py-2 z-50 animate-in slide-in-from-top-2 fade-in duration-200 origin-top-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-4 py-3 border-b border-gray-100 mb-1">
                      <p className="text-sm font-bold text-gray-900">{userProfile.name}</p>
                      <p className="text-xs text-gray-500 truncate">user@gravity.app</p>
                    </div>
                    
                    <button 
                        onClick={() => handleMenuClick('profile')}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition-colors"
                    >
                      <User size={18} /> Profile
                    </button>
                    <button 
                        onClick={() => handleMenuClick('posts')}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition-colors"
                    >
                      <FileText size={18} /> My Posts
                    </button>
                    <button 
                        onClick={() => handleMenuClick('posts')} // Reusing posts modal with saved tab active logic could be better, but simpler to just open library
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition-colors"
                    >
                      <Bookmark size={18} /> Saved
                    </button>
                    <button 
                        onClick={() => handleMenuClick('settings')}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-3 transition-colors"
                    >
                      <Settings size={18} /> Settings
                    </button>

                    <div className="h-px bg-gray-100 my-1" />
                    
                    {/* Language Toggle */}
                    <div className="px-4 py-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Language</p>
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setLanguage('en'); }}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                English
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setLanguage('km'); }}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${language === 'km' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Khmer
                            </button>
                        </div>
                    </div>
                    
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

      {/* Main Viewport */}
      <main className="flex-1 relative overflow-hidden">
        
        {/* Loading / Empty States Layered on top if needed */}
        {isLoading && posts.length === 0 && (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 z-30 animate-in fade-in duration-500 pointer-events-none">
                <CookingPotLoader />
            </div>
        )}
        
        {filteredPosts.length === 0 && searchQuery && (
             <div className="fixed inset-0 flex flex-col items-center justify-center text-slate-500 gap-2 p-4 animate-in fade-in zoom-in duration-300 z-30 pointer-events-none">
                <div className="bg-white p-6 rounded-full shadow-lg mb-2">
                    <Ghost size={48} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-700">Poof! Nothing here.</h3>
                <p className="text-center max-w-xs text-sm text-slate-500">
                    We couldn't find any thought bubbles matching "<span className="font-semibold text-slate-800">{searchQuery}</span>".
                </p>
                <button 
                  onClick={() => {
                      handleCloseSearch();
                      // Re-enable pointer events for this button
                  }}
                  className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition shadow-md pointer-events-auto"
                >
                  Clear search
                </button>
            </div>
        )}

        {/* The Physics Container - Full Viewport */}
        <div className="absolute inset-0 w-full h-full" style={{ 
            background: 'linear-gradient(to bottom, #f8fafc 0%, #dbeafe 100%)'
        }}>
           {/* Pagination Controls - The Multiverse Switchers */}
           <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-20">
              {page > 1 && (
                <button 
                    onClick={handlePrevPage}
                    className="pointer-events-auto p-3 bg-white/40 hover:bg-white/80 backdrop-blur-md border border-white/50 rounded-full shadow-lg text-slate-700 hover:scale-110 active:scale-90 transition-all group"
                    title="Previous Universe"
                >
                    <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>
              )}
           </div>

           <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-20">
              <button 
                  onClick={handleNextPage}
                  className="pointer-events-auto p-3 bg-white/40 hover:bg-white/80 backdrop-blur-md border border-white/50 rounded-full shadow-lg text-slate-700 hover:scale-110 active:scale-90 transition-all group"
                  title="Next Universe"
              >
                  <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>

           {/* Page Indicator - Moved to Bottom Center */}
           <div className="absolute bottom-10 right-1/2 translate-x-1/2 px-4 py-1.5 bg-white/30 backdrop-blur-md rounded-full border border-white/40 text-[10px] font-bold tracking-widest text-slate-500 uppercase pointer-events-none z-20 shadow-sm">
              Dimension {page}
           </div>

           {(!isLoading && !(filteredPosts.length === 0 && searchQuery)) && (
               <PhysicsWorld posts={filteredPosts} onPostClick={setSelectedPost} />
           )}
           
        </div>
      </main>

      {/* Replaced fixed bottom button with the Dynamic Post Creator */}
      {/* This component self-renders as a button and expands into the modal */}
      <DynamicPostCreator 
        onSubmit={handleCreatePost} 
        isSearchOpen={isSearchOpen} 
      />

      {/* Creation & Detail Modals */}
      {/* CreatePostModal is removed as it's now integrated via DynamicPostCreator above */}

      <PostDetailModal 
        post={selectedPost} 
        isSaved={selectedPost ? savedPostIds.has(selectedPost.id) : false}
        onClose={() => setSelectedPost(null)}
        onVote={handleVote}
        onReport={handleReport}
        onToggleSave={handleToggleSave}
        currentUserHandle={userProfile.handle}
      />

      {/* User Menu Modals */}
      <ProfileModal 
        isOpen={activeMenuModal === 'profile'} 
        onClose={() => setActiveMenuModal(null)}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
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

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

    </div>
  );
};

export default App;