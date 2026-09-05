import React, { useState } from 'react';
import { User as UserIcon, Fingerprint } from 'lucide-react';
import { User } from '../../types/user.types';

interface UserAvatarProps {
  user?: User | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  shape?: 'circle' | 'rounded';
  showStatusDot?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-20 h-20 sm:w-24 sm:h-24 text-2xl',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  className = '',
  shape = 'circle',
  showStatusDot = false,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Normalize photo URL for high-res Google profile photo
  let photoURL = user?.photoURL;
  if (photoURL && photoURL.includes('googleusercontent.com')) {
    // Upgrade 96px thumbnail to 256px crisp avatar
    photoURL = photoURL.replace(/=s\d+(-c)?$/, '=s256-c');
  }

  const getInitials = (name?: string) => {
    if (!name) return 'CX';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const roundedClass = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';
  const sizeClass = sizeClasses[size];

  return (
    <div className={`relative ${sizeClass} shrink-0 ${className}`}>
      <div className={`w-full h-full ${roundedClass} overflow-hidden bg-zinc-900 border border-white/15 flex items-center justify-center shadow-sm`}>
        {photoURL && !imageFailed ? (
          <img
            src={photoURL}
            alt={user?.displayName || 'User Avatar'}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : user?.displayName ? (
          <span className="font-bold bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            {getInitials(user.displayName)}
          </span>
        ) : (
          <UserIcon className="w-1/2 h-1/2 text-zinc-400" />
        )}
      </div>

      {showStatusDot && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
      )}
    </div>
  );
};
