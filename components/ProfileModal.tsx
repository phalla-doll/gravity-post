import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Activity, Edit2, Save, Camera } from 'lucide-react';

interface UserProfile {
  name: string;
  handle: string;
  bio: string;
  location: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userProfile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  // Sync with prop updates
  useEffect(() => {
    if (isOpen) {
        setEditedProfile(userProfile);
        setIsEditing(false);
    }
  }, [isOpen, userProfile]);

  if (!isOpen) return null;

  const handleSave = () => {
    // Basic validation
    let handle = editedProfile.handle.trim();
    if (!handle.startsWith('@')) handle = '@' + handle;
    
    onUpdateProfile({
        ...editedProfile,
        handle
    });
    setIsEditing(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-32 bg-gradient-to-r from-purple-500 to-pink-500">
           <button 
            onClick={onClose} 
            className="absolute top-3 right-3 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition z-10 backdrop-blur-sm"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-6 pb-6 -mt-12 relative">
           <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-4xl overflow-hidden relative group">
             👾
             {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white cursor-pointer hover:bg-black/60 transition">
                    <Camera size={24} />
                </div>
             )}
           </div>
           
           <div className="mt-4">
             {isEditing ? (
                 <div className="space-y-3 mb-4">
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Name</label>
                        <input 
                            type="text" 
                            value={editedProfile.name}
                            onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                            className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 font-bold text-gray-800"
                            placeholder="Display Name"
                        />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Handle</label>
                        <input 
                            type="text" 
                            value={editedProfile.handle}
                            onChange={(e) => setEditedProfile({...editedProfile, handle: e.target.value})}
                            className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-purple-600 font-medium"
                            placeholder="@handle"
                        />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Location</label>
                         <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                value={editedProfile.location}
                                onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                                className="w-full pl-9 pr-3 py-2 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm font-medium text-gray-700"
                                placeholder="City, Planet"
                            />
                         </div>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Bio</label>
                        <textarea 
                            value={editedProfile.bio}
                            onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                            className="w-full px-3 py-2 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 text-sm text-gray-700 resize-none h-20"
                            placeholder="Tell us about yourself..."
                            maxLength={100}
                        />
                     </div>
                     <button 
                        onClick={handleSave}
                        className="w-full py-2 bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition shadow-lg"
                     >
                        <Save size={18} /> Save Changes
                     </button>
                 </div>
             ) : (
                 <>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-black text-gray-800">{userProfile.name}</h2>
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50/50 rounded-full transition"
                            title="Edit Profile"
                        >
                            <Edit2 size={16} />
                        </button>
                    </div>
                    <p className="text-purple-600 font-medium">{userProfile.handle}</p>
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                        {userProfile.bio}
                    </p>
                 </>
             )}
             
             <div className="flex gap-4 mt-4 text-xs text-gray-500 font-medium">
               <div className="flex items-center gap-1">
                 <MapPin size={14} /> {userProfile.location}
               </div>
               <div className="flex items-center gap-1">
                 <Calendar size={14} /> Joined Today
               </div>
             </div>
           </div>

           {!isEditing && (
            <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-white/40 p-4 rounded-2xl text-center border border-white/50 backdrop-blur-sm">
                <div className="text-2xl font-black text-gray-900">12</div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Drops</div>
                </div>
                <div className="bg-white/40 p-4 rounded-2xl text-center border border-white/50 backdrop-blur-sm">
                <div className="text-2xl font-black text-gray-900">45</div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Upvotes</div>
                </div>
            </div>
           )}

           <div className="mt-6 pt-6 border-t border-gray-200/50 flex items-center justify-between text-sm text-gray-500">
              <span className="flex items-center gap-2"><Activity size={16} className="text-green-500"/> Online</span>
              <span>Level 1 Observer</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;