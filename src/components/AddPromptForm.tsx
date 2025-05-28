
import React, { useState } from 'react';
import { X, Save, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePrompts } from '@/hooks/usePrompts';
import { toast } from 'sonner';

interface AddPromptFormProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AddPromptForm: React.FC<AddPromptFormProps> = ({ isVisible, onClose }) => {
  const { categories, addPrompt } = usePrompts();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [] as string[]
  });
  const [currentTag, setCurrentTag] = useState('');

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await addPrompt(formData);
      toast.success('Prompt ajouté avec succès !');
      setFormData({ title: '', content: '', category: '', tags: [] });
      onClose();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du prompt');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-900/95 border-white/10 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Nouveau Prompt</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Titre *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre du prompt..."
                className="bg-white/5 border-white/20 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Catégorie *</label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contenu *</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Contenu du prompt..."
                rows={6}
                className="bg-white/5 border-white/20 text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Ajouter un tag..."
                  className="bg-white/5 border-white/20 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} variant="outline" className="border-white/20">
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {formData.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-white/10 text-white cursor-pointer hover:bg-red-500/20"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      #{tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="border-white/20 text-white">
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
