import React, { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Menu, User, FileText, Bookmark, Settings, LogOut } from 'lucide-react';
import PhysicsWorld from './components/PhysicsWorld';
import CreatePostModal from './components/CreatePostModal';
import PostDetailModal from './components/PostDetailModal';
import { Post, SentimentType } from './types';
import { generateInitialPosts } from './services/geminiService';
import { INITIAL_POSTS_COUNT, SENTIMENT_COLORS } from './constants';

// Simple ID helper
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initialize with Gemini data
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const generated = await generateInitialPosts();
      
      const newPosts: Post[] = generated.map(g => ({
        id: generateId(),
        text: g.text,
        sentiment: g.sentiment,
        color: g.color,
        createdAt: Date.now(),
        upvotes: Math.floor(Math.random() * 50),
        isFlagged: false
      }));

      // Add a welcome post
      newPosts.unshift({
        id: 'welcome-post',
        text: "Welcome to Gravity! Drop a thought.",
        sentiment: SentimentType.HAPPY,
        color: SENTIMENT_COLORS[SentimentType.HAPPY],
        createdAt: Date.now(),
        upvotes: 100,
        isFlagged: false
      });

      setPosts(newPosts);
      setIsLoading(false);
    };
    init();
  }, []);

  const handleCreatePost = async (text: string, sentiment: SentimentType) => {
    // We trust the user's selected sentiment. 
    // In a real app, we might still run a safety check here, but for responsiveness we skip it.
    
    const newPost: Post = {
      id: generateId(),
      text,
      sentiment: sentiment,
      color: SENTIMENT_COLORS[sentiment],
      createdAt: Date.now(),
      upvotes: 0,
      isFlagged: false
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const handleVote = useCallback((id: string, delta: number) => {
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, upvotes: p.upvotes + delta } : p
    ));
  }, []);

  const handleReport = useCallback((id: string) => {
    // In a real app, send to backend. Here we just flag it locally.
    setPosts(prev => prev.map(p => 
      p.id === id ? { ...p, isFlagged: true } : p
    ));
    alert("Thanks for keeping the pile clean. We've received your report.");
  }, []);

  const refreshPile = useCallback(async () => {
      setPosts([]); // Clear to trigger re-fall
      setIsLoading(true);
      setTimeout(async () => {
          const generated = await generateInitialPosts();
          const newPosts: Post[] = generated.map(g => ({
            id: generateId(),
            text: g.text,
            sentiment: g.sentiment,
            color: g.color,
            createdAt: Date.now(),
            upvotes: Math.floor(Math.random() * 50),
            isFlagged: false
          }));
          setPosts(newPosts);
          setIsLoading(false);
      }, 500);
  }, []);

  return (
    <div 
      className="h-screen w-screen flex flex-col relative overflow-hidden bg-slate-50 font-sans text-slate-900"
      onClick={() => isMenuOpen && setIsMenuOpen(false)}
    >
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 pointer-events-none flex justify-between items-start">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/50 pointer-events-auto">
           <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
             Gravity
           </h1>
           <p className="text-sm text-slate-500 font-medium">The social pile.</p>
        </div>
        
        <div className="flex gap-2 pointer-events-auto items-start">
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
             
             <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
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
                    
                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-3 transition-colors">
                      <User size={18} /> Profile
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-3 transition-colors">
                      <FileText size={18} /> My Posts
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-3 transition-colors">
                      <Bookmark size={18} /> Saved
                    </button>
                    <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 flex items-center gap-3 transition-colors">
                      <Settings size={18} /> Settings
                    </button>
                    <div className="h-px bg-gray-100 my-1" />
                    <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
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
        ) : (
            <PhysicsWorld posts={posts} onPostClick={setSelectedPost} />
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

      {/* Modals */}
      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreatePost} 
      />

      <PostDetailModal 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)}
        onVote={handleVote}
        onReport={handleReport}
      />
    </div>
  );
};

export default App;