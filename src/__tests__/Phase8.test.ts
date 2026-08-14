import { PlayerGenerator } from '../models/Player';
import { PersonalityEngine } from '../engine/PersonalityEngine';
import { SocialFeedEngine, MatchContext } from '../engine/SocialFeedEngine';
import { NewsEngine } from '../engine/NewsEngine';
import { InterviewEngine } from '../engine/InterviewEngine';
import { EventAnalyzerPipeline } from '../engine/EventAnalyzerPipeline';
import { SocialActorType } from '../models/Social';

describe('Phase 8: Social, Media, Personality & Pipeline System', () => {
  let player = PlayerGenerator.createNewPlayer('Alex Hunter', 'RW', 'England', 'Arsenal');

  beforeEach(() => {
    player = PlayerGenerator.createNewPlayer('Alex Hunter', 'RW', 'England', 'Arsenal');
  });

  test('PersonalityEngine tracks traits and computes archetype', () => {
    const initialArchetype = PersonalityEngine.getArchetype(player);
    expect(initialArchetype).toBeDefined();

    PersonalityEngine.applyPersonalityShift(player, { ambition: 15, confidence: 10 });
    expect(player.personality.ambition).toBeGreaterThan(70);
  });

  test('SocialFeedEngine generates contextual fan reactions and trending topics', () => {
    const context: MatchContext = {
      competition: 'FA Cup Final',
      opponent: 'Chelsea',
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea',
      homeScore: 2,
      awayScore: 1,
      playerRating: 9.2,
      playerGoals: 1,
      playerAssists: 0,
      isWinningGoal: true,
      isTrophyMatch: true
    };

    const reactions = SocialFeedEngine.generateFanReactions(player, context);
    expect(reactions.length).toBeGreaterThan(0);
    expect(reactions.some(r => r.actorType === SocialActorType.FAN)).toBe(true);

    const trends = SocialFeedEngine.getTrendingTopics(player, context);
    expect(trends.length).toBeGreaterThan(0);
  });

  test('NewsEngine generates articles based on match events', () => {
    const context: MatchContext = {
      competition: 'FA Cup Final',
      opponent: 'Chelsea',
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea',
      homeScore: 2,
      awayScore: 1,
      playerRating: 9.2,
      playerGoals: 1,
      playerAssists: 0,
      isWinningGoal: true,
      isTrophyMatch: true
    };

    const articles = NewsEngine.generateNewsArticles(player, context);
    expect(articles.length).toBeGreaterThan(0);
    expect(articles[0].headline).toContain('ARSENAL');
  });

  test('InterviewEngine triggers questions and handles option selection', () => {
    const interview = InterviewEngine.generateInterview(player, true);
    expect(interview.options.length).toBeGreaterThan(0);

    const ambitiousOption = interview.options.find(o => o.tone === 'AMBITIOUS') || interview.options[0];
    const initialAmbition = player.personality.ambition;

    InterviewEngine.applyInterviewChoice(player, ambitiousOption);
    expect(player.personality.ambition).toBeGreaterThanOrEqual(initialAmbition);
  });

  test('EventAnalyzerPipeline ties match events to news, social, and reputation', () => {
    const context: MatchContext = {
      competition: 'FA Cup Final',
      opponent: 'Chelsea',
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea',
      homeScore: 2,
      awayScore: 1,
      playerRating: 9.2,
      playerGoals: 1,
      playerAssists: 0,
      isWinningGoal: true,
      isTrophyMatch: true
    };

    const initialRep = player.reputation;
    const result = EventAnalyzerPipeline.processMatchEvent(player, context);

    expect(result.news.length).toBeGreaterThan(0);
    expect(result.socialPosts.length).toBeGreaterThan(0);
    expect(result.interview).toBeDefined();
    expect(player.reputation).toBeGreaterThan(initialRep);
  });
});
