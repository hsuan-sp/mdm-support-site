export interface QAItem {
  id: string;
  question: string;
  answer: string;
  important?: boolean;
  tags?: string[];
  category?: string;
}

export interface QASection {
  title: string;
  items: QAItem[];
}

export interface QAModule {
  id: string; // ID (slug) for anchor linking
  source: string;
  sections: QASection[];
}

export interface GlossaryItem {
  term: string;
  definition: string;
  analogy: string;
  category: string | string[];
  tags?: string[];
}

export interface ChangelogItem {
  version: string;
  date: string;
  type: string;
  content: string;
}
