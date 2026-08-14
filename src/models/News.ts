export interface NewsArticle {
  id: string;
  timestamp: Date;
  headline: string;
  summary: string;
  source: string; // e.g., 'BBC Sport', 'Sky Sports', 'The Athletic', 'L\'Équipe'
  category: 'MATCH_REPORT' | 'TRANSFER' | 'AWARD' | 'MILESTONE' | 'MANAGER_TALK';
  isPlayerFeatured: boolean;
}
