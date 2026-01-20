export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  progress: number;
  image: string;
  isNew?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  time: string;
  image: string;
  tldr?: string[];
}

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  type: 'stock' | 'crypto';
  holding?: number;
}
