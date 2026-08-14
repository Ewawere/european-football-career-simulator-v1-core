import { PlayerGenerator } from './models/Player';
import { CLUBS } from './data/FootballDatabase';
import { SaveLoadEngine, SaveGame } from './engine/SaveLoadEngine';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log("==================================================");
  console.log("  EUROPEAN FOOTBALL CAREER SIMULATOR — PHASE 9A");
  console.log("  Save/Load Persistence & Fidelity Demo");
  console.log("==================================================\n");

  const demoFilePath = path.join(__dirname, '../demo_savegame.json');

  // Clean up previous demo save if any
  if (fs.existsSync(demoFilePath)) {
    fs.unlinkSync(demoFilePath);
  }

  // 1. Create a Career State
  console.log("1. Initializing Career...");
  const player = PlayerGenerator.createNewPlayer("Alex Hunter", "RW", "England", "Arsenal");
  player.overall = 74;
  player.potential = 88;
  player.personality.ambition = 81;
  player.personality.confidence = 64;
  player.personality.professionalism = 77;

  const arsenal = CLUBS.find(c => c.id === 'ars') || null;

  const gameState: SaveGame = {
    saveVersion: '1.0.0',
    savedAt: new Date().toISOString(),
    careerDate: '2025-05-15',
    player,
    currentClub: arsenal,
    leagueStandings: [
      { clubId: 'ars', played: 37, won: 27, drawn: 7, lost: 3, gf: 82, ga: 24, gd: 58, points: 88 }
    ],
    newsHistory: [
      {
        id: 'news-demo-1',
        timestamp: new Date(),
        headline: 'ARSENAL WONDERKID SHINES IN SEMI-FINAL',
        summary: 'Alex Hunter provides crucial assist.',
        source: 'The Athletic',
        category: 'MATCH_REPORT',
        isPlayerFeatured: true
      }
    ],
    socialHistory: [
      {
        id: 'soc-demo-1',
        actorType: any => 'FAN',
        actorHandle: '@GoonerLife',
        actorName: 'Gooner Life',
        content: 'This kid is special! 🔴⚪',
        likes: 3400,
        retweets: 890,
        hashtags: ['#ArsenalWonderkid'],
        timestamp: new Date()
      } as any
    ],
    careerMilestones: [
      {
        id: 'ms-demo-1',
        date: '2025-05-10',
        title: 'Professional Debut',
        description: 'Made first team debut against Chelsea.',
        category: 'DEBUT'
      }
    ],
    transferOffers: [
      {
        id: 'tr-demo-1',
        clubId: 'dor',
        clubName: 'Borussia Dortmund',
        transferFee: 20000000,
        wageOffer: 50000,
        status: 'PENDING'
      }
    ],
    calendarState: {
      currentDate: '2025-05-15',
      seasonYear: 2025,
      matchday: 37
    }
  };

  console.log(`   BEFORE SAVE:`);
  console.log(`   - Career Date: ${gameState.careerDate}`);
  console.log(`   - Player: ${gameState.player.name} (${gameState.player.overall} OVR, Ambition: ${gameState.player.personality.ambition})`);
  console.log(`   - Club: ${gameState.currentClub?.name}`);
  console.log(`   - Milestones: ${gameState.careerMilestones.length}`);
  console.log(`   - Transfer Offers: ${gameState.transferOffers.length}\n`);

  // 2. Save Game
  console.log("2. Saving career state to disk atomically...");
  SaveLoadEngine.saveGame(gameState, demoFilePath);
  console.log(`   ✅ Successfully saved to ${demoFilePath}\n`);

  // 3. Load Game
  console.log("3. Loading career state back from disk with validation...");
  const loadedState = SaveLoadEngine.loadGame(demoFilePath);
  console.log(`   ✅ Successfully loaded save version ${loadedState.saveVersion}\n`);

  // 4. Verify Fidelity
  console.log("4. AFTER LOAD (Fidelity Verification):");
  console.log(`   - Career Date: ${loadedState.careerDate}`);
  console.log(`   - Player: ${loadedState.player.name} (${loadedState.player.overall} OVR, Ambition: ${loadedState.player.personality.ambition})`);
  console.log(`   - Club: ${loadedState.currentClub?.name}`);
  console.log(`   - Milestones: ${loadedState.careerMilestones.length} (${loadedState.careerMilestones[0].title})`);
  console.log(`   - Transfer Offers: ${loadedState.transferOffers.length} (${loadedState.transferOffers[0].clubName})`);
  console.log(`   - News History: ${loadedState.newsHistory.length} articles`);
  console.log(`   - Social History: ${loadedState.socialHistory.length} posts\n`);

  // Clean up demo file
  if (fs.existsSync(demoFilePath)) {
    fs.unlinkSync(demoFilePath);
  }

  console.log("==================================================");
  console.log("  PHASE 9A SAVE/LOAD DEMO COMPLETE SUCCESSFULLY!");
  console.log("==================================================");
}

main().catch(err => console.error(err));
