
export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
  versions?: PromptVersion[];
}

export interface PromptVersion {
  id: string;
  content: string;
  version: number;
  createdAt: Date;
  changes: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}
