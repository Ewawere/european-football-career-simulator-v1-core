import { Player } from '../models/Player';
import { NewsArticle } from '../models/News';
import { MatchContext } from './SocialFeedEngine';

export class NewsEngine {
  /**
   * Generates news articles based on match context and milestones
   */
  static generateNewsArticles(player: Player, context: MatchContext): NewsArticle[] {
    const articles: NewsArticle[] = [];
    const club = player.clubName || 'Arsenal';

    if (context.isTrophyMatch && context.isWinningGoal) {
      articles.push({
        id: `news-${Date.now()}-1`,
        timestamp: new Date(),
        headline: `${club.toUpperCase()} ACADEMY STAR ${player.name.toUpperCase()} WINS ${context.competition.toUpperCase()}!`,
        summary: `In a dramatic clash, 18-year-old ${player.name} came off the bench in the 74th minute and scored a stunning late winner to secure the ${context.competition} trophy for ${club}.`,
        source: 'The Athletic',
        category: 'MILESTONE',
        isPlayerFeatured: true
      });
      articles.push({
        id: `news-${Date.now()}-2`,
        timestamp: new Date(),
        headline: `SCOUT WATCH: Dortmund and Real Madrid tracking ${player.name} after Cup final heroics`,
        summary: `Following his decisive match-winning display, major European giants are preparing scouting reports on ${club}'s breakout star.`,
        source: 'Sky Sports',
        category: 'TRANSFER',
        isPlayerFeatured: true
      });
    } else if (context.playerRating >= 8.5) {
      articles.push({
        id: `news-${Date.now()}-1`,
        timestamp: new Date(),
        headline: `${player.name} Puts On Sensational Show in ${club} Victory`,
        summary: `${player.name} produced a dominant performance, earning a ${context.playerRating.toFixed(1)} match rating as ${club} defeated ${context.opponent}.`,
        source: 'BBC Sport',
        category: 'MATCH_REPORT',
        isPlayerFeatured: true
      });
    } else if (context.playerRating < 6.0) {
      articles.push({
        id: `news-${Date.now()}-1`,
        timestamp: new Date(),
        headline: `Questions Raised Over ${player.name}'s Form Following Tough Outing`,
        summary: `${club} struggled to find cohesion as ${player.name} found it difficult to break down ${context.opponent}'s defensive setup.`,
        source: 'Daily Football Gazette',
        category: 'MATCH_REPORT',
        isPlayerFeatured: true
      });
    } else {
      articles.push({
        id: `news-${Date.now()}-1`,
        timestamp: new Date(),
        headline: `${club} Hold Firm in ${context.competition} Battle`,
        summary: `A disciplined performance saw ${club} play out a ${context.homeScore}-${context.awayScore} result against ${context.opponent}.`,
        source: 'BBC Sport',
        category: 'MATCH_REPORT',
        isPlayerFeatured: false
      });
    }

    return articles;
  }
}
