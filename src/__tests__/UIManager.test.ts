import { GameSession } from '../ui/UIManager';
import * as fs from 'fs';
import * as path from 'path';

describe('Milestone 9C: Playable UI & Session Persistence', () => {
  const testSavePath = path.join(__dirname, 'ui_test_save.json');

  afterEach(() => {
    if (fs.existsSync(testSavePath)) {
      fs.unlinkSync(testSavePath);
    }
  });

  test('GameSession initializes and saves/loads correctly', () => {
    const session = new GameSession(testSavePath);
    expect(session.player).toBeDefined();
    expect(session.currentClub).toBeDefined();

    session.player.overall = 82;
    session.save();

    expect(fs.existsSync(testSavePath)).toBe(true);

    const session2 = new GameSession(testSavePath);
    session2.load();
    expect(session2.player.overall).toBe(82);
  });
});
