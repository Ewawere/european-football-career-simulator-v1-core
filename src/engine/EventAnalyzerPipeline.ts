import { Player } from '../models/Player';
import { MatchContext, SocialFeedEngine } from './SocialFeedEngine';
import { NewsEngine } from './NewsEngine';
import { NewsArticle } from '../models/News';
import { SocialPost } from '../models/Social';
import { InterviewEngine } from './InterviewEngine';
import { InterviewQuestion } from '../models/Social';

export interface PipelineResult {
  news: NewsArticle[];
  socialPosts: SocialPost[];
  trendingTopics: string[];
  interview?: InterviewQuestion;
  reputationDelta: number;
  marketValueDelta: number;
  scoutInterestDelta: number;
}

export class EventAnalyzerPipeline {
  static processMatchEvent(player: Player, context: MatchContext): PipelineResult {
    // 1. Generate News
    const news = NewsEngine.generateNewsArticles(player, context);

    // 2. Generate Social Reactions & Trending Topics
    const socialPosts = SocialFeedEngine.generateFanReactions(player, context);
    const trendingTopics = SocialFeedEngine.getTrendingTopics(player, context);

    // 3. Calculate Reputation & Market Value Adjustments
    let reputationDelta = 0;
    let marketValueDelta = 0;
    let scoutInterestDelta = 0;

    if (context.isTrophyMatch && context.isWinningGoal) {
      reputationDelta = 8;
      marketValueDelta = 6000000; // +€6M
      scoutInterestDelta = 15;
    } else if (context.playerRating >= 8.5) {
      reputationDelta = 3;
      marketValueDelta = 2000000; // +€2M
      scoutInterestDelta = 5;
    } else if (context.playerRating < 6.0) {
      reputationDelta = -1;
      marketValueDelta = -500000;
      scoutInterestDelta = -2;
    }

    player.reputation = Math.max(0, Math.min(100, player.reputation + reputationDelta));
    player.marketValue = Math.max(10000, player.marketValue + marketValueDelta);

    if (player.scoutInterests.length > 0) {
      player.scoutInterests[0].interestPercent = Math.max(
        0,
        Math.min(100, player.scoutInterests[0].interestPercent + scoutInterestDelta)
      );
    }

    // 4. Trigger Interview if significant event
    let interview: InterviewQuestion | undefined = undefined;
    if (context.isTrophyMatch || context.playerRating >= 8.5 || context.playerRating <= 5.5) {
      interview = InterviewEngine.generateInterview(player, context.isTrophyMatch && context.isWinningGoal);
    }

    return {
      news,
      socialPosts,
      trendingTopics,
      interview,
      reputationDelta,
      marketValueDelta,
      scoutInterestDelta
    };
  }
}
