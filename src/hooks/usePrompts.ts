
import { useState, useEffect, useCallback } from 'react';
import { Prompt, Category } from '@/types/prompt';
import { database } from '@/services/database';

export const usePrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [promptsData, categoriesData] = await Promise.all([
        database.getPrompts(),
        database.getCategories()
      ]);
      setPrompts(promptsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPrompts = useCallback(async () => {
    const results = await database.searchPrompts(searchQuery, selectedCategory);
    setPrompts(results);
  }, [searchQuery, selectedCategory]);

  const addPrompt = useCallback(async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    const newPrompt = await database.savePrompt(promptData);
    setPrompts(prev => [...prev, newPrompt]);
    return newPrompt;
  }, []);

  const updatePrompt = useCallback(async (id: string, updates: Partial<Prompt>) => {
    const updatedPrompt = await database.updatePrompt(id, updates);
    if (updatedPrompt) {
      setPrompts(prev => prev.map(p => p.id === id ? updatedPrompt : p));
    }
    return updatedPrompt;
  }, []);

  const deletePrompt = useCallback(async (id: string) => {
    const success = await database.deletePrompt(id);
    if (success) {
      setPrompts(prev => prev.filter(p => p.id !== id));
    }
    return success;
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!loading) {
      searchPrompts();
    }
  }, [searchPrompts, loading]);

  return {
    prompts,
    categories,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    addPrompt,
    updatePrompt,
    deletePrompt,
    refreshData: loadData
  };
};
