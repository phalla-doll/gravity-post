import React from 'react';
import { X, MapPin, Calendar, Activity } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-32 bg-gradient-to-r from-purple-500 to-pink-500">
           <button 
            onClick={onClose} 
            className="absolute top-3 right-3 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-6 pb-6 -mt-12 relative">
           <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-4xl overflow-hidden">
             👾
           </div>
           
           <div className="mt-4">
             <h2 className="text-2xl font-black text-gray-800">Guest User</h2>
             <p className="text-purple-600 font-medium">@gravity_guest</p>
             <p className="text-gray-600 mt-2 text-sm leading-relaxed">
               Just floating around in the gravity well. I like dropping thoughts and watching them collide.
             </p>
             
             <div className="flex gap-4 mt-4 text-xs text-gray-500 font-medium">
               <div className="flex items-center gap-1">
                 <MapPin size={14} /> Internet
               </div>
               <div className="flex items-center gap-1">
                 <Calendar size={14} /> Joined Today
               </div>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-3 mt-6">
             <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
               <div className="text-2xl font-black text-gray-900">12</div>
               <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Drops</div>
             </div>
             <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100">
               <div className="text-2xl font-black text-gray-900">45</div>
               <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Upvotes</div>
             </div>
           </div>

           <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <span className="flex items-center gap-2"><Activity size={16} className="text-green-500"/> Online</span>
              <span>Level 1 Observer</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;