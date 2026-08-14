import { Player } from '../models/Player';
import { SocialPost, SocialActorType } from '../models/Social';

export interface MatchContext {
  competition: string; // e.g. 'FA Cup Final', 'Premier League', 'Champions League'
  opponent: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  playerRating: number;
  playerGoals: number;
  playerAssists: number;
  isWinningGoal?: boolean;
  isTrophyMatch?: boolean;
}

export class SocialFeedEngine {
  /**
   * Generates 3 to 6 contextual fan reactions based on match outcome and expectations
   */
  static generateFanReactions(
    player: Player,
    context: MatchContext
  ): SocialPost[] {
    const posts: SocialPost[] = [];
    const club = player.clubName || 'Arsenal';
    const tag = `#${player.name.replace(/\s+/g, '')}`;

    const isYoungAcademy = player.age <= 18 || player.reputation <= 30;
    const isSuperstar = player.marketValue >= 50000000 || player.reputation >= 80;

    // High rating / Hero moment
    if (context.playerRating >= 8.5 || context.isWinningGoal) {
      if (context.isWinningGoal && context.isTrophyMatch) {
        posts.push(
          {
            id: 'post-1',
            actorType: SocialActorType.FAN,
            actorHandle: `@${club}Fanatics`,
            actorName: `${club} Fanatic`,
            content: `THIS KID IS HIM 😭🔥 ${player.name} JUST WON US THE ${context.competition.toUpperCase()}!!`,
            likes: 12400,
            retweets: 3100,
            hashtags: [tag, `#${context.competition.replace(/\s+/g, '')}Champions`],
            timestamp: new Date()
          },
          {
            id: 'post-2',
            actorType: SocialActorType.FAN,
            actorHandle: `@GoonerLife`,
            actorName: `London Is Red`,
            content: `Academy product. Remember the name. ${player.name} is absolute magic!`,
            likes: 8900,
            retweets: 1850,
            hashtags: [tag, `#FutureIsNow`],
            timestamp: new Date()
          },
          {
            id: 'post-3',
            actorType: SocialActorType.JOURNALIST,
            actorHandle: `@FabrizioTransfers`,
            actorName: `Fabrizio Romano`,
            content: `Understand top European clubs are already monitoring ${player.name} after that sensational performance. A generational talent emerging. 🚨🔥`,
            likes: 45000,
            retweets: 12100,
            hashtags: [tag, `#TransferNews`],
            timestamp: new Date()
          },
          {
            id: 'post-4',
            actorType: SocialActorType.CLUB,
            actorHandle: `@${club}Official`,
            actorName: club,
            content: `UNBELIEVABLE MOMENT! ${player.name} delivers when it matters most! 🏆🔴⚪`,
            likes: 28900,
            retweets: 6400,
            hashtags: [tag],
            timestamp: new Date()
          }
        );
      } else {
        posts.push(
          {
            id: 'post-1',
            actorType: SocialActorType.FAN,
            actorHandle: `@TacticalAnalyst`,
            actorName: `Tactical Mind`,
            content: `What a display from ${player.name} tonight. ${context.playerGoals} goals and absolute domination on the pitch.`,
            likes: 3400,
            retweets: 510,
            hashtags: [tag, `#Matchday`],
            timestamp: new Date()
          },
          {
            id: 'post-2',
            actorType: SocialActorType.FAN,
            actorHandle: `@${club}Central`,
            actorName: `${club} Central`,
            content: `${player.name} was everywhere today! 90 minutes of pure class. 👏🔥`,
            likes: 2100,
            retweets: 380,
            hashtags: [tag],
            timestamp: new Date()
          },
          {
            id: 'post-3',
            actorType: SocialActorType.FAN,
            actorHandle: `@FootballFanatic`,
            actorName: `Matchday Fan`,
            content: `Give ${player.name} a new 10-year contract immediately!`,
            likes: 1800,
            retweets: 240,
            hashtags: [tag],
            timestamp: new Date()
          }
        );
      }
    } 
    // Average or mediocre rating (e.g. 6.0 - 6.8) - expectations make the difference!
    else if (context.playerRating < 6.8) {
      if (isYoungAcademy) {
        posts.push(
          {
            id: 'post-1',
            actorType: SocialActorType.FAN,
            actorHandle: `@AcademyWatch`,
            actorName: `Youth Scouting`,
            content: `${player.name} had a quiet game today, but he's only ${player.age}. Give him time to adjust to high intensity.`,
            likes: 1200,
            retweets: 110,
            hashtags: [tag, `#YouthDevelopment`],
            timestamp: new Date()
          },
          {
            id: 'post-2',
            actorType: SocialActorType.FAN,
            actorHandle: `@${club}Daily`,
            actorName: `${club} News`,
            content: `Not his best match, but clear potential is there. Learning curve for the youngster.`,
            likes: 850,
            retweets: 60,
            hashtags: [tag],
            timestamp: new Date()
          },
          {
            id: 'post-3',
            actorType: SocialActorType.PUNTER,
            actorHandle: `@FootballFan`,
            actorName: `Casual Supporter`,
            content: `Bro had a tough spell out there today, but we keep supporting our own.`,
            likes: 450,
            retweets: 30,
            hashtags: [tag],
            timestamp: new Date()
          }
        );
      } else if (isSuperstar) {
        posts.push(
          {
            id: 'post-1',
            actorType: SocialActorType.PUNTER,
            actorHandle: `@FootballFan`,
            actorName: `Disappointed Fan`,
            content: `Bro had a nightmare today. €100M price tag and he barely touched the ball...`,
            likes: 8900,
            retweets: 1400,
            hashtags: [tag, `#Overrated`],
            timestamp: new Date()
          },
          {
            id: 'post-2',
            actorType: SocialActorType.JOURNALIST,
            actorHandle: `@PunditArena`,
            actorName: `Sky Sports Pundit`,
            content: `${player.name} was supposed to be world class, but today's performance was way below standard.`,
            likes: 12300,
            retweets: 2100,
            hashtags: [tag],
            timestamp: new Date()
          },
          {
            id: 'post-3',
            actorType: SocialActorType.FAN,
            actorHandle: `@${club}Realist`,
            actorName: `Realist Fan`,
            content: `We need much more leadership from our star players. ${player.name} needs to step up.`,
            likes: 3100,
            retweets: 420,
            hashtags: [tag],
            timestamp: new Date()
          }
        );
      } else {
        posts.push(
          {
            id: 'post-1',
            actorType: SocialActorType.FAN,
            actorHandle: `@${club}Standard`,
            actorName: `Match Analyst`,
            content: `Standard performance from ${player.name}. Solid effort, but room for improvement.`,
            likes: 650,
            retweets: 45,
            hashtags: [tag],
            timestamp: new Date()
          },
          {
            id: 'post-2',
            actorType: SocialActorType.FAN,
            actorHandle: `@FootyLover`,
            actorName: `Footy Lover`,
            content: `On to the next game. ${player.name} will bounce back stronger.`,
            likes: 410,
            retweets: 25,
            hashtags: [tag],
            timestamp: new Date()
          }
        );
      }
    } 
    // Good standard performance (6.8 - 8.4)
    else {
      posts.push(
        {
          id: 'post-1',
          actorType: SocialActorType.FAN,
          actorHandle: `@${club}Source`,
          actorName: `Club Source`,
          content: `Solid contribution from ${player.name} today. Keeps the midfield fluid and crisp.`,
          likes: 1800,
          retweets: 190,
          hashtags: [tag],
          timestamp: new Date()
        },
        {
          id: 'post-2',
          actorType: SocialActorType.FAN,
          actorHandle: `@MatchdayLive`,
          actorName: `Matchday Live`,
          content: `Good overall game. ${player.name} showed strong composure under pressure.`,
          likes: 1100,
          retweets: 120,
          hashtags: [tag],
          timestamp: new Date()
        },
        {
          id: 'post-3',
          actorType: SocialActorType.JOURNALIST,
          actorHandle: `@LocalExpress`,
          actorName: `Local Sports Express`,
          content: `${player.name} growing into an essential part of the squad's tactical blueprint.`,
          likes: 2200,
          retweets: 280,
          hashtags: [tag],
          timestamp: new Date()
        }
      );
    }

    return posts;
  }

  /**
   * Generates trending topics list (career + world football)
   */
  static getTrendingTopics(player: Player, context?: MatchContext): string[] {
    const trends: string[] = [];

    if (context && context.isTrophyMatch && context.isWinningGoal) {
      trends.push(`#${player.clubName || 'Arsenal'}Wonderkid`, `#${context.competition.replace(/\s+/g, '')}Hero`);
    } else if (context && context.playerRating >= 8.5) {
      trends.push(`#${player.name.replace(/\s+/g, '')}Masterclass`, `#${player.clubName || 'Arsenal'}Win`);
    }

    // World football background trends
    trends.push(
      '#MbappeTransferSaga',
      '#DortmundWonderkid',
      '#ManagerUnderPressure',
      '#PremierLeagueTitleRace'
    );

    return Array.from(new Set(trends)).slice(0, 5);
  }
}
