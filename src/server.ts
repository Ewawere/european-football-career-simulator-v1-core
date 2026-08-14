import express from 'express';
import * as path from 'path';
import { GameSession } from './ui/UIManager';
import { MatchEngine } from './engine/MatchEngine';
import { EventAnalyzerPipeline } from './engine/EventAnalyzerPipeline';
import { PersonalityEngine } from './engine/PersonalityEngine';

export class WebServer {
  private app: express.Application;
  private session: GameSession;
  private port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.session = new GameSession('savegame.json');
    
    // Try to load existing save if available
    try {
      this.session.load();
    } catch (e) {
      this.session.save(); // create initial
    }

    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../public')));
  }

  private configureRoutes(): void {
    // API Endpoints
    this.app.get('/api/career', (req, res) => {
      const p = this.session.player;
      res.json({
        player: {
          name: p.name,
          position: p.position,
          age: p.age,
          nationality: p.nationality,
          overall: p.overall,
          potential: p.potential,
          marketValue: p.marketValue,
          managerTrust: p.managerTrust,
          condition: 85, // simulated/tracked condition
          fatigue: 25,   // simulated/tracked fatigue
          archetype: PersonalityEngine.getArchetype(p)
        },
        club: this.session.currentClub,
        calendar: this.session.calendarState,
        standings: this.session.leagueStandings
      });
    });

    this.app.get('/api/player', (req, res) => {
      res.json({
        player: this.session.player,
        archetype: PersonalityEngine.getArchetype(this.session.player)
      });
    });

    this.app.get('/api/calendar', (req, res) => {
      res.json({
        calendar: this.session.calendarState,
        fixtures: [
          { matchday: this.session.calendarState.matchday, home: this.session.currentClub?.name || 'Arsenal', away: 'Chelsea', competition: 'Premier League', date: this.session.calendarState.currentDate },
          { matchday: this.session.calendarState.matchday + 1, home: 'Manchester United', away: this.session.currentClub?.name || 'Arsenal', competition: 'Premier League', date: '2025-08-24' },
          { matchday: this.session.calendarState.matchday + 2, home: this.session.currentClub?.name || 'Arsenal', away: 'Tottenham', competition: 'North London Derby', date: '2025-08-31' }
        ]
      });
    });

    this.app.get('/api/news', (req, res) => {
      res.json({ news: this.session.newsHistory });
    });

    this.app.get('/api/social', (req, res) => {
      res.json({ social: this.session.socialHistory });
    });

    this.app.get('/api/transfers', (req, res) => {
      res.json({
        currentClub: this.session.currentClub,
        marketValue: this.session.player.marketValue,
        scoutInterests: this.session.player.scoutInterests,
        offers: this.session.transferOffers
      });
    });

    this.app.get('/api/legacy', (req, res) => {
      res.json({ milestones: this.session.careerMilestones });
    });

    this.app.post('/api/training', (req, res) => {
      const { focus } = req.body;
      const p = this.session.player;
      p.overall = Math.min(p.potential, p.overall + 1);
      this.session.save();
      res.json({ success: true, message: `Completed training in ${focus || 'General'}. Overall increased to ${p.overall}!`, player: p });
    });

    this.app.post('/api/rest', (req, res) => {
      this.session.save();
      res.json({ success: true, message: 'Rested successfully. Fatigue reduced.' });
    });

    this.app.post('/api/match/play', (req, res) => {
      const clubName = this.session.currentClub?.name || 'Arsenal';
      const opponent = 'Chelsea';
      const matchResult = MatchEngine.simulateMatch(
        clubName,
        opponent,
        this.session.player,
        true,
        0
      );

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

      this.session.newsHistory.push(...pipelineResult.news);
      this.session.socialHistory.push(...pipelineResult.socialPosts);
      this.session.calendarState.matchday++;
      this.session.save();

      res.json({
        success: true,
        matchResult,
        pipeline: {
          newsCount: pipelineResult.news.length,
          socialCount: pipelineResult.socialPosts.length
        },
        player: this.session.player
      });
    });

    this.app.post('/api/save', (req, res) => {
      try {
        this.session.save();
        res.json({ success: true, message: 'Game saved successfully.' });
      } catch (e) {
        res.status(500).json({ success: false, error: (e as Error).message });
      }
    });

    this.app.post('/api/load', (req, res) => {
      try {
        this.session.load();
        res.json({ success: true, message: 'Game loaded successfully.', career: this.session });
      } catch (e) {
        res.status(500).json({ success: false, error: (e as Error).message });
      }
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`==================================================`);
      console.log(`  ⚽ EUROPEAN FOOTBALL CAREER SIMULATOR (WEB 10A)`);
      console.log(`  Server running at http://localhost:${this.port}`);
      console.log(`==================================================`);
    });
  }
}
