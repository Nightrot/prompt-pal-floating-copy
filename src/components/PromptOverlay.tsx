
import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Copy, Edit, Trash2, History, Filter } from 'lucide-react';
import { usePrompts } from '@/hooks/usePrompts';
import { ClipboardService } from '@/services/clipboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface PromptOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

export const PromptOverlay: React.FC<PromptOverlayProps> = ({ isVisible, onClose }) => {
  const {
    prompts,
    categories,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory
  } = usePrompts();

  const [showAddForm, setShowAddForm] = useState(false);

  const handleCopyPrompt = async (content: string, title: string) => {
    const success = await ClipboardService.copyToClipboard(content);
    if (success) {
      toast.success(`"${title}" copié dans le presse-papiers`);
      onClose();
    } else {
      toast.error('Erreur lors de la copie');
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || '#6B7280';
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.icon || '📝';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[80vh] bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <h1 className="text-xl font-semibold text-white">PromptVault</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-white/10">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un prompt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:bg-white/10"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedCategory('')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Tous
            </Button>
          </div>

          {/* Category filters */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(
                  selectedCategory === category.name ? '' : category.name
                )}
                className={`border-white/20 text-white hover:bg-white/10 ${
                  selectedCategory === category.name 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent' 
                    : ''
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Prompts List */}
        <ScrollArea className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : prompts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                {searchQuery ? 'Aucun prompt trouvé' : 'Aucun prompt enregistré'}
              </div>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer votre premier prompt
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {prompts.map((prompt) => (
                <Card key={prompt.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2">{prompt.title}</CardTitle>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{ 
                              backgroundColor: `${getCategoryColor(prompt.category)}20`,
                              color: getCategoryColor(prompt.category),
                              borderColor: `${getCategoryColor(prompt.category)}40`
                            }}
                          >
                            {getCategoryIcon(prompt.category)} {prompt.category}
                          </Badge>
                          {prompt.version > 1 && (
                            <Badge variant="outline" className="text-xs border-yellow-500/50 text-yellow-400">
                              <History className="w-3 h-3 mr-1" />
                              v{prompt.version}
                            </Badge>
                          )}
                        </div>
                        {prompt.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {prompt.tags.map((tag, index) => (
                              <span key={index} className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleCopyPrompt(prompt.content, prompt.title)}
                          className="text-green-400 hover:bg-green-500/20"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-blue-400 hover:bg-blue-500/20"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
                      {prompt.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
