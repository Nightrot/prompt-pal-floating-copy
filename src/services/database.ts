
import { Prompt, PromptVersion, Category } from '@/types/prompt';

class DatabaseService {
  private static instance: DatabaseService;
  private readonly PROMPTS_KEY = 'prompts_vault';
  private readonly CATEGORIES_KEY = 'categories_vault';

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Prompts CRUD
  async getPrompts(): Promise<Prompt[]> {
    try {
      const stored = localStorage.getItem(this.PROMPTS_KEY);
      return stored ? JSON.parse(stored).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      })) : [];
    } catch (error) {
      console.error('Error loading prompts:', error);
      return [];
    }
  }

  async savePrompt(prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Prompt> {
    const prompts = await this.getPrompts();
    const newPrompt: Prompt = {
      ...prompt,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      versions: []
    };
    
    prompts.push(newPrompt);
    localStorage.setItem(this.PROMPTS_KEY, JSON.stringify(prompts));
    return newPrompt;
  }

  async updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt | null> {
    const prompts = await this.getPrompts();
    const index = prompts.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    const currentPrompt = prompts[index];
    
    // Create version if content changed
    if (updates.content && updates.content !== currentPrompt.content) {
      const version: PromptVersion = {
        id: Date.now().toString(),
        content: currentPrompt.content,
        version: currentPrompt.version,
        createdAt: currentPrompt.updatedAt,
        changes: `Version ${currentPrompt.version}`
      };
      
      currentPrompt.versions = currentPrompt.versions || [];
      currentPrompt.versions.push(version);
      currentPrompt.version += 1;
    }
    
    const updatedPrompt = {
      ...currentPrompt,
      ...updates,
      updatedAt: new Date()
    };
    
    prompts[index] = updatedPrompt;
    localStorage.setItem(this.PROMPTS_KEY, JSON.stringify(prompts));
    return updatedPrompt;
  }

  async deletePrompt(id: string): Promise<boolean> {
    const prompts = await this.getPrompts();
    const filtered = prompts.filter(p => p.id !== id);
    localStorage.setItem(this.PROMPTS_KEY, JSON.stringify(filtered));
    return filtered.length < prompts.length;
  }

  // Categories CRUD
  async getCategories(): Promise<Category[]> {
    try {
      const stored = localStorage.getItem(this.CATEGORIES_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultCategories();
    } catch (error) {
      console.error('Error loading categories:', error);
      return this.getDefaultCategories();
    }
  }

  private getDefaultCategories(): Category[] {
    const defaultCategories = [
      { id: '1', name: 'Général', color: '#3B82F6', icon: '📝' },
      { id: '2', name: 'Code', color: '#10B981', icon: '💻' },
      { id: '3', name: 'Marketing', color: '#F59E0B', icon: '📢' },
      { id: '4', name: 'Écriture', color: '#8B5CF6', icon: '✍️' },
      { id: '5', name: 'Analyse', color: '#EF4444', icon: '📊' }
    ];
    
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  }

  async saveCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const categories = await this.getCategories();
    const newCategory: Category = {
      ...category,
      id: Date.now().toString()
    };
    
    categories.push(newCategory);
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
    return newCategory;
  }

  // Search
  async searchPrompts(query: string, categoryFilter?: string): Promise<Prompt[]> {
    const prompts = await this.getPrompts();
    const lowercaseQuery = query.toLowerCase();
    
    return prompts.filter(prompt => {
      const matchesQuery = !query || 
        prompt.title.toLowerCase().includes(lowercaseQuery) ||
        prompt.content.toLowerCase().includes(lowercaseQuery) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery));
      
      const matchesCategory = !categoryFilter || prompt.category === categoryFilter;
      
      return matchesQuery && matchesCategory;
    });
  }
}

export const database = DatabaseService.getInstance();
