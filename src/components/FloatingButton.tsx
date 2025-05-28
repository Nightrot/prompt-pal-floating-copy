
import React from 'react';
import { MessageSquare } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick, isVisible }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed top-4 right-4 z-40 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
        isVisible ? 'scale-110 rotate-45' : 'scale-100 rotate-0'
      }`}
    >
      <MessageSquare className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};
