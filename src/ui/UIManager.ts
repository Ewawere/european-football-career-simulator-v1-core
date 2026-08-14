import { Player, Position } from './models/Player';
import { Club, CLUBS } from './data/FootballDatabase';
import { SaveLoadEngine, SaveGame, Standing, Milestone, TransferOffer, WorldCalendarState } from './engine/SaveLoadEngine';
import { NewsArticle } from './models/News';
import { SocialPost } from './models/Social';
import { PersonalityEngine } from './engine/PersonalityEngine';
import { MatchEngine } from './engine/MatchEngine';
import { EventAnalyzerPipeline } from './engine/EventAnalyzerPipeline';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

export class GameSession {
  player: Player;
  currentClub: Club | null;
  leagueStandings: Standing[];
  newsHistory: NewsArticle[];
  socialHistory: SocialPost[];
  careerMilestones: Milestone[];
  transferOffers: TransferOffer[];
  calendarState: WorldCalendarState;
  saveFilePath: string;

  constructor(saveFilePath: string = 'savegame.json') {
    this.saveFilePath = saveFilePath;
    // Default initial new career state
    this.player = PlayerGenerator.createNewPlayer('Alex Hunter', Position.RW, 'England', 'Arsenal');
    this.currentClub = CLUBS.find(c => c.id === 'ars') || null;
    this.leagueStandings = [
      { clubId: 'ars', played: 1, won: 1, drawn: 0, lost: 0, gf: 2, ga: 1, gd: 1, points: 3 },
      { clubId: 'rma', played: 1, won: 1, drawn: 0, lost: 0, gf: 3, ga: 0, gd: 3, points: 3 },
      { clubId: 'dor', played: 1, won: 0, drawn: 0, lost: 1, gf: 1, ga: 2, gd: -1, points: 0 }
    ];
    this.newsHistory = [];
    this.socialHistory = [];
    this.careerMilestones = [
      {
        id: 'ms-init',
        date: '2025-08-01',
        title: 'Youth Academy Contract',
        description: 'Signed initial professional academy agreement with Arsenal.',
        category: 'MILESTONE'
      }
    ];
    this.transferOffers = [];
    this.calendarState = {
      currentDate: '2025-08-10',
      seasonYear: 2025,
      matchday: 1
    };
  }

  save(): void {
    const state: SaveGame = {
      saveVersion: '1.0.0',
      savedAt: new Date().toISOString(),
      careerDate: this.calendarState.currentDate,
      player: this.player,
      currentClub: this.currentClub,
      leagueStandings: this.leagueStandings,
      newsHistory: this.newsHistory,
      socialHistory: this.socialHistory,
      careerMilestones: this.careerMilestones,
      transferOffers: this.transferOffers,
      calendarState: this.calendarState
    };
    SaveLoadEngine.saveGame(state, this.saveFilePath);
  }

  load(): void {
    const loaded = SaveLoadEngine.loadGame(this.saveFilePath);
    this.player = loaded.player;
    this.currentClub = loaded.currentClub;
    this.leagueStandings = loaded.leagueStandings;
    this.newsHistory = loaded.newsHistory;
    this.socialHistory = loaded.socialHistory;
    this.careerMilestones = loaded.careerMilestones;
    this.transferOffers = loaded.transferOffers;
    this.calendarState = loaded.calendarState;
  }
}

export class UIManager {
  private session: GameSession;
  private rl: readline.Interface;

  constructor() {
    this.session = new GameSession();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async start(): Promise<void> {
    console.clear();
    console.log("==================================================");
    console.log("  EUROPEAN FOOTBALL CAREER SIMULATOR — LIVE GAME");
    console.log("==================================================");
    
    if (fs.existsSync('savegame.json')) {
      await this.promptLoadExisting();
    } else {
      this.session.save(); // create initial save
    }

    await this.mainMenu();
  }

  private async promptLoadExisting(): Promise<void> {
    return new Promise((resolve) => {
      this.rl.question("\nFound existing save game (savegame.json). Load it? (y/n): ", async (answer) => {
        if (answer.trim().toLowerCase() === 'y') {
          try {
            this.session.load();
            console.log("✅ Career loaded successfully!");
          } catch (e) {
            console.log(`❌ Failed to load save: ${(e as Error).message}. Starting new career.`);
          }
        }
        resolve();
      });
    });
  }

  private async mainMenu(): Promise<void> {
    console.clear();
    const p = this.session.player;
    const clubName = this.session.currentClub?.name || 'Free Agent';
    const archetype = PersonalityEngine.getArchetype(p);

    console.log(`==================================================`);
    console.log(` 🏠 CAREER HUB | Date: ${this.session.calendarState.currentDate}`);
    console.log(`==================================================`);
    console.log(` Player: ${p.name} | ${p.position} | Age: ${p.age}`);
    console.log(` Club: ${clubName} | OVR: ${p.overall} (Pot: ${p.potential})`);
    console.log(` Market Value: €${(p.marketValue / 1000000).toFixed(1)}M | Manager Trust: ${p.managerTrust}/100`);
    console.log(` Personality: [ ${archetype} ]`);
    console.log(`--------------------------------------------------`);
    console.log(` [1] ⚽ Play Next Match / Simulate Fixture`);
    console.log(` [2] 🏋️ Training & Development`);
    console.log(` [3] 👤 Player Profile & Attributes`);
    console.log(` [4] 📅 Calendar & Schedule`);
    console.log(` [5] 📰 News Feed (${this.session.newsHistory.length})`);
    console.log(` [6] 📱 Social Media (${this.session.socialHistory.length})`);
    console.log(` [7] 💰 Transfers & Contracts (${this.session.transferOffers.length})`);
    console.log(` [8] 🏆 Career Legacy & Milestones`);
    console.log(` [9] 💾 Save Game`);
    console.log(` [10] 📂 Load Game`);
    console.log(` [0] 🚪 Exit Game`);
    console.log(`==================================================`);

    this.rl.question("\nSelect option: ", async (choice) => {
      switch (choice.trim()) {
        case '1':
          await this.handlePlayMatch();
          break;
        case '2':
          await this.handleTraining();
          break;
        case '3':
          this.handlePlayerProfile();
          break;
        case '4':
          this.handleCalendar();
          break;
        case '5':
          this.handleNewsFeed();
          break;
        case '6':
          this.handleSocialFeed();
          break;
        case '7':
          this.handleTransfers();
          break;
        case '8':
          this.handleCareerLegacy();
          break;
        case '9':
          this.handleSaveGame();
          break;
        case '10':
          this.handleLoadGame();
          break;
        case '0':
          console.log("\nThanks for playing European Football Career Simulator!");
          this.rl.close();
          return;
        default:
          console.log("Invalid selection. Press Enter to continue.");
          await this.waitEnter();
          break;
      }
      await this.mainMenu();
    });
  }

  private async handlePlayMatch(): Promise<void> {
    console.clear();
    console.log("==================================================");
    console.log(" ⚽ MATCHDAY SIMULATION");
    console.log("==================================================");

    const clubName = this.session.currentClub?.name || 'Arsenal';
    const opponent = 'Chelsea';
    console.log(` Fixture: ${clubName} vs ${opponent} (Premier League)`);
    console.log(` Matchday: #${this.session.calendarState.matchday}\n`);

    const matchResult = MatchEngine.simulateMatch(
      clubName,
      opponent,
      this.session.player,
      true,
      0
    );

    console.log(` Full Time Result: ${clubName} ${matchResult.homeScore} - ${matchResult.awayScore} ${opponent}`);
    console.log(` Your Match Rating: ⭐ ${matchResult.playerRating.toFixed(1)} / 10.0`);
    console.log(` Minutes Played: ${matchResult.minutesPlayed}'\n`);

    // Process pipeline events (News, Social, Reputation)
    const pipelineResult = EventAnalyzerPipeline.processMatchEvent(this.session.player, {
      competition: 'Premier League',
      opponent,
      homeTeam: clubName,
      awayTeam: opponent,
      homeScore: matchResult.homeScore,
      awayScore: matchResult.awayScore,
      playerRating: matchResult.playerRating,
      playerGoals: matchResult.homeScore > 0 ? 1 : 0,
      playerAssists: 0,
      isWinningGoal: matchResult.homeScore > matchResult.awayScore,
      isTrophyMatch: false
    });

    // Add to history
    this.session.newsHistory.push(...pipelineResult.news);
    this.session.socialHistory.push(...pipelineResult.socialPosts);
    this.session.calendarState.matchday++;
    this.session.calendarState.currentDate = '2025-08-17'; // advance date

    this.session.save();
    console.log("💾 Game automatically saved after match.");
    console.log("\nPress Enter to return to Career Hub.");
    await this.waitEnter();
  }

  private async handleTraining(): Promise<void> {
    console.clear();
    console.log("==================================================");
    console.log(" 🏋️ TRAINING & DEVELOPMENT");
    console.log("==================================================");
    console.log(" Select focus area for this week's training:");
    console.log(" [1] Shooting & Finishing");
    console.log(" [2] Dribbling & Ball Control");
    console.log(" [3] Physical & Stamina");
    console.log(" [4] Tactical Positioning & Vision");
    console.log(" [0] Back");

    return new Promise((resolve) => {
      this.rl.question("\nSelect option: ", async (choice) => {
        if (choice.trim() >= '1' && choice.trim() <= '4') {
          const p = this.session.player;
          p.overall = Math.min(p.potential, p.overall + 1);
          console.log(`\n✅ Training completed successfully! Your overall rating increased to ${p.overall}.`);
          this.session.save();
        }
        await this.waitEnter();
        resolve();
      });
    });
  }

  private handlePlayerProfile(): void {
    console.clear();
    const p = this.session.player;
    console.log("==================================================");
    console.log(" 👤 PLAYER PROFILE & ATTRIBUTES");
    console.log("==================================================");
    console.log(` Name: ${p.name} | Position: ${p.position} | Age: ${p.age}`);
    console.log(` Nationality: ${p.nationality} | Preferred Foot: ${p.preferredFoot}`);
    console.log(` Overall: ${p.overall} | Potential: ${p.potential} | Reputation: ${p.reputation}`);
    console.log(`--------------------------------------------------`);
    console.log(` ATTRIBUTES:`);
    console.log(` - Finishing: ${p.attributes.finishing} | Passing: ${p.attributes.passing}`);
    console.log(` - Dribbling: ${p.attributes.dribbling} | Pace: ${p.attributes.pace}`);
    console.log(` - Strength: ${p.attributes.strength} | Stamina: ${p.attributes.stamina}`);
    console.log(` - Vision: ${p.attributes.vision} | Composure: ${p.attributes.composure}`);
    console.log(`--------------------------------------------------`);
    console.log(` PERSONALITY:`);
    console.log(` - Team Player: ${p.personality.teamPlayer} | Confidence: ${p.personality.confidence}`);
    console.log(` - Ambition: ${p.personality.ambition} | Loyalty: ${p.personality.loyalty}`);
    console.log(` - Ego: ${p.personality.ego} | Professionalism: ${p.personality.professionalism}`);
    console.log(` Archetype: [ ${PersonalityEngine.getArchetype(p)} ]`);
    console.log(`==================================================`);
    this.waitEnterSync();
  }

  private handleCalendar(): void {
    console.clear();
    console.log("==================================================");
    console.log(" 📅 CALENDAR & FIXTURES");
    console.log("==================================================");
    console.log(` Current Date: ${this.session.calendarState.currentDate} (Season Year: ${this.session.calendarState.seasonYear})`);
    console.log(` Current Matchday: #${this.session.calendarState.matchday}\n`);
    console.log(` Upcoming Fixtures:`);
    console.log(` - Matchday ${this.session.calendarState.matchday}: Arsenal vs Chelsea (Premier League)`);
    console.log(` - Matchday ${this.session.calendarState.matchday + 1}: Manchester United vs Arsenal (Premier League)`);
    console.log(` - Matchday ${this.session.calendarState.matchday + 2}: Arsenal vs Tottenham (North London Derby)`);
    console.log(`==================================================`);
    this.waitEnterSync();
  }

  private handleNewsFeed(): void {
    console.clear();
    console.log("==================================================");
    console.log(" 📰 NEWS FEED");
    console.log("==================================================");
    if (this.session.newsHistory.length === 0) {
      console.log(" No news articles yet. Play a match to generate media reports!");
    } else {
      this.session.newsHistory.slice(-5).forEach((art, idx) => {
        console.log(` [${idx + 1}] (${art.source}) ${art.headline}`);
        console.log(`     "${art.summary}"\n`);
      });
    }
    console.log(`==================================================`);
    this.waitEnterSync();
  }

  private handleSocialFeed(): void {
    console.clear();
    console.log("==================================================");
    console.log(" 📱 SOCIAL MEDIA FEED");
    console.log("==================================================");
    if (this.session.socialHistory.length === 0) {
      console.log(" No social posts yet. Play a match to see fan and media reactions!");
    } else {
      this.session.socialHistory.slice(-5).forEach((post, idx) => {
        console.log(` [${idx + 1}] ${post.actorHandle} (${post.actorName}): "${post.content}"`);
        console.log(`     ❤️ ${post.likes} likes | ${post.hashtags.join(' ')}\n`);
      });
    }
    console.log(`==================================================`);
    this.waitEnterSync();
  }

  private handleTransfers(): void {
    console.clear();
    console.log("==================================================");
    console.log(" 💰 TRANSFERS & CONTRACTS");
    console.log("==================================================");
    console.log(` Current Club: ${this.session.currentClub?.name || 'None'}`);
    console.log(` Market Value: €${(this.session.player.marketValue / 1000000).toFixed(1)}M\n`);
    console.log(` Scout Interest:`);
    this.session.player.scoutInterests.forEach(s => {
      console.log(` - ${s.clubName}: ${s.interestPercent}% interest`);
    });
    console.log(`\n Active Offers: ${this.session.transferOffers.length}`);
    console.log(`==================================================`);
    this.waitEnterSync();
  }

  private handleCareerLegacy(): void {
    console.clear();
    console.log("==================================================");
    console.log(" 🏆 CAREER LEGACY & MILESTONES");
    console.log("==================================================");
    this.session.careerMilestones.forEach((m, idx) => {
      console.log(` [${idx + 1}] ${m.date} - ${m.title}`);
      console.log(`     ${m.description}\n`);
    });
    console.log(`==================================================`);
    this.waitEnterSync();
  }

  private handleSaveGame(): void {
    try {
      this.session.save();
      console.log("\n✅ Game saved successfully to savegame.json!");
    } catch (e) {
      console.log(`\n❌ Failed to save: ${(e as Error).message}`);
    }
    this.waitEnterSync();
  }

  private handleLoadGame(): void {
    try {
      this.session.load();
      console.log("\n✅ Game loaded successfully from savegame.json!");
    } catch (e) {
      console.log(`\n❌ Failed to load: ${(e as Error).message}`);
    }
    this.waitEnterSync();
  }

  private async waitEnter(): Promise<void> {
    return new Promise((resolve) => {
      this.rl.question("\nPress Enter to continue...", () => {
        resolve();
      });
    });
  }

  private waitEnterSync(): void {
    // Synchronous placeholder pause for menu views
    // Handled by returning to mainMenu via readline callback in production loop
  }
}
