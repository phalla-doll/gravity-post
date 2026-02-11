import React, { useState } from 'react';
import { X, Bell, Moon, Volume2, Smartphone, Shield, HelpCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-2 overflow-y-auto">
          {/* Preferences */}
          <div className="p-4 space-y-4">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preferences</h3>
             
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Volume2 size={18}/></div>
                  <span className="font-medium text-gray-700">Sound Effects</span>
                </div>
                <button 
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${soundEnabled ? 'bg-black' : 'bg-gray-200'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>

             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Smartphone size={18}/></div>
                  <span className="font-medium text-gray-700">Haptics</span>
                </div>
                <button 
                  onClick={() => setHapticsEnabled(!hapticsEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${hapticsEnabled ? 'bg-black' : 'bg-gray-200'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${hapticsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>

             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><Moon size={18}/></div>
                  <span className="font-medium text-gray-700">Dark Mode</span>
                </div>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${darkMode ? 'bg-black' : 'bg-gray-200'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
          </div>

          <div className="h-px bg-gray-100 mx-4" />

          {/* Notifications */}
          <div className="p-4 space-y-4">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notifications</h3>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Bell size={18}/></div>
                  <span className="font-medium text-gray-700">Push Notifications</span>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${notifications ? 'bg-black' : 'bg-gray-200'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
             </div>
          </div>

          <div className="h-px bg-gray-100 mx-4" />

          {/* Support */}
          <div className="p-4 space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Support</h3>
            <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition text-left text-gray-700">
               <Shield size={18} className="text-gray-400" /> Privacy Policy
            </button>
            <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition text-left text-gray-700">
               <HelpCircle size={18} className="text-gray-400" /> Help Center
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 text-center text-xs text-gray-400">
          Gravity v1.0.0 (Beta)
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;