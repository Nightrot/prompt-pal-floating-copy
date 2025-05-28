
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddPromptForm } from '@/components/AddPromptForm';
import { useNavigate } from 'react-router-dom';

const AddPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <h1 className="text-xl font-semibold text-white">PromptVault - Nouveau Prompt</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AddPromptForm 
          isVisible={true} 
          onClose={() => navigate('/')} 
        />
      </div>
    </div>
  );
};

export default AddPrompt;
