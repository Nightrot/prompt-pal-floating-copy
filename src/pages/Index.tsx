
import React, { useState, useEffect } from 'react';
import { FloatingButton } from '@/components/FloatingButton';
import { PromptOverlay } from '@/components/PromptOverlay';
import { AddPromptForm } from '@/components/AddPromptForm';
import { database } from '@/services/database';

const Index = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [promptCount, setPromptCount] = useState(0);

  useEffect(() => {
    // Charger le nombre de prompts pour l'affichage
    const loadPromptCount = async () => {
      const prompts = await database.getPrompts();
      setPromptCount(prompts.length);
    };
    loadPromptCount();
  }, []);

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.02\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo et titre */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="text-3xl font-bold text-white">P</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              PromptVault
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Votre bibliothèque de prompts intelligente.<br />
              Recherchez, organisez et copiez vos prompts en un clic.
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">{promptCount}</div>
              <div className="text-gray-300">Prompts enregistrés</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">5</div>
              <div className="text-gray-300">Catégories</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">∞</div>
              <div className="text-gray-300">Possibilités</div>
            </div>
          </div>

          {/* Fonctionnalités */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-left">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-3">Recherche instantanée</h3>
              <p className="text-gray-300">
                Trouvez rapidement vos prompts grâce à la recherche en temps réel par titre, contenu ou tags.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-left">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-white mb-3">Interface overlay</h3>
              <p className="text-gray-300">
                Accédez à vos prompts depuis n'importe quelle application avec l'interface flottante.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-left">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-white mb-3">Copie intelligente</h3>
              <p className="text-gray-300">
                Copiez instantanément vos prompts dans le presse-papiers d'un simple clic.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-left">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-white mb-3">Gestion des versions</h3>
              <p className="text-gray-300">
                Gardez un historique des modifications de vos prompts avec le système de versions.
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Cliquez sur le bouton flottant pour commencer →
            </p>
            <div className="animate-bounce">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto opacity-60"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <FloatingButton onClick={toggleOverlay} isVisible={showOverlay} />

      {/* Overlays */}
      <PromptOverlay isVisible={showOverlay} onClose={() => setShowOverlay(false)} />
      <AddPromptForm isVisible={showAddForm} onClose={() => setShowAddForm(false)} />

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Index;
