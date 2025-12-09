export interface QAItem {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  important?: boolean;
}

export interface QASection {
  title: string;
  items: QAItem[];
}
