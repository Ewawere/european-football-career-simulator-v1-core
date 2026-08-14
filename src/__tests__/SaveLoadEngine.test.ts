import * as fs from 'fs';
import * as path from 'path';
import { SaveLoadEngine, SaveGame } from '../engine/SaveLoadEngine';
import { PlayerGenerator } from '../models/Player';
import { CLUBS } from '../data/FootballDatabase';

describe('Milestone 9A: Save/Load System', () => {
  const testFilePath = path.join(__dirname, 'test_savegame.json');

  afterEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    const tmpPath = `${testFilePath}.tmp`;
    if (fs.existsSync(tmpPath)) {
      fs.unlinkSync(tmpPath);
    }
  });

  const createTestSaveState = (): SaveGame => {
    const player = PlayerGenerator.createNewPlayer('Marcus Rashford', 'LW', 'England', 'Arsenal');
    player.overall = 78;
    player.potential = 88;
    player.personality.ambition = 81;
    player.personality.confidence = 64;
    player.personality.loyalty = 58;
    player.personality.ego = 31;
    player.personality.professionalism = 77;
    player.personality.teamPlayer = 72;

    const club = CLUBS.find(c => c.id === 'ars') || null;

    return {
      saveVersion: '1.0.0',
      savedAt: new Date().toISOString(),
      careerDate: '2025-05-15',
      player,
      currentClub: club,
      leagueStandings: [
        { clubId: 'ars', played: 38, won: 28, drawn: 7, lost: 3, gf: 85, ga: 25, gd: 60, points: 91 }
      ],
      newsHistory: [
        {
          id: 'news-1',
          timestamp: new Date(),
          headline: 'ARSENAL STAR WINS FA CUP',
          summary: 'Sensational display.',
          source: 'BBC Sport',
          category: 'MILESTONE',
          isPlayerFeatured: true
        }
      ],
      socialHistory: [
        {
          id: 'soc-1',
          actorType: any => 'FAN',
          actorHandle: '@Gooner',
          actorName: 'Gooner Fan',
          content: 'Absolute baller!',
          likes: 5000,
          retweets: 1200,
          hashtags: ['#Arsenal'],
          timestamp: new Date()
        } as any
      ],
      careerMilestones: [
        {
          id: 'ms-1',
          date: '2025-05-15',
          title: 'FA Cup Winner',
          description: 'Won first major trophy.',
          category: 'TROPHY'
        }
      ],
      transferOffers: [
        {
          id: 'tr-1',
          clubId: 'dor',
          clubName: 'Borussia Dortmund',
          transferFee: 25000000,
          wageOffer: 60000,
          status: 'PENDING'
        }
      ],
      calendarState: {
        currentDate: '2025-05-15',
        seasonYear: 2025,
        matchday: 38
      }
    };
  };

  test('A. Save creates a file safely', () => {
    const state = createTestSaveState();
    SaveLoadEngine.saveGame(state, testFilePath);
    expect(fs.existsSync(testFilePath)).toBe(true);
  });

  test('B & C. Saved JSON is valid and can be loaded back', () => {
    const state = createTestSaveState();
    SaveLoadEngine.saveGame(state, testFilePath);

    const loaded = SaveLoadEngine.loadGame(testFilePath);
    expect(loaded).toBeDefined();
    expect(loaded.saveVersion).toBe('1.0.0');
    expect(loaded.player.name).toBe('Marcus Rashford');
  });

  test('D & E. Player attributes and personality survive exactly', () => {
    const state = createTestSaveState();
    SaveLoadEngine.saveGame(state, testFilePath);

    const loaded = SaveLoadEngine.loadGame(testFilePath);
    expect(loaded.player.overall).toBe(78);
    expect(loaded.player.potential).toBe(88);
    expect(loaded.player.personality.ambition).toBe(81);
    expect(loaded.player.personality.professionalism).toBe(77);
  });

  test('F, G, H, I, J, K. Milestones, News, Social, Transfers, Standings, Date survive', () => {
    const state = createTestSaveState();
    SaveLoadEngine.saveGame(state, testFilePath);

    const loaded = SaveLoadEngine.loadGame(testFilePath);
    expect(loaded.careerMilestones.length).toBe(1);
    expect(loaded.careerMilestones[0].title).toBe('FA Cup Winner');
    expect(loaded.newsHistory.length).toBe(1);
    expect(loaded.socialHistory.length).toBe(1);
    expect(loaded.transferOffers.length).toBe(1);
    expect(loaded.transferOffers[0].clubName).toBe('Borussia Dortmund');
    expect(loaded.leagueStandings.length).toBe(1);
    expect(loaded.careerDate).toBe('2025-05-15');
  });

  test('L. Null currentClub survives', () => {
    const state = createTestSaveState();
    state.currentClub = null;
    SaveLoadEngine.saveGame(state, testFilePath);

    const loaded = SaveLoadEngine.loadGame(testFilePath);
    expect(loaded.currentClub).toBeNull();
  });

  test('M. Invalid JSON is rejected', () => {
    fs.writeFileSync(testFilePath, 'INVALID_JSON_CONTENT{{{', 'utf-8');
    expect(() => SaveLoadEngine.loadGame(testFilePath)).toThrow(/corrupted/i);
  });

  test('N. Missing required fields are rejected', () => {
    const state = createTestSaveState();
    delete (state as any).player;
    SaveLoadEngine.saveGame(state, testFilePath);

    expect(() => SaveLoadEngine.loadGame(testFilePath)).toThrow(/player/i);
  });

  test('P. Full round-trip state equivalence', () => {
    const state = createTestSaveState();
    SaveLoadEngine.saveGame(state, testFilePath);

    const loaded = SaveLoadEngine.loadGame(testFilePath);
    expect(JSON.stringify(loaded)).toEqual(JSON.stringify(state));
  });
});
