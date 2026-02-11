import React from 'react';
import { LogOut } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 bg-red-100/50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <LogOut size={32} className="ml-1" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">Log Out?</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Are you sure you want to leave the gravity pile? You can always drop back in later.
        </p>

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-white/50 border border-white/60 text-gray-700 font-bold rounded-xl hover:bg-white/80 transition"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition shadow-lg shadow-red-200"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;