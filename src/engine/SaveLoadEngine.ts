import * as fs from 'fs';
import * as path from 'path';
import { Player } from '../models/Player';
import { Club, League, Standing } from '../data/FootballDatabase';
import { NewsArticle } from '../models/News';
import { SocialPost } from '../models/Social';

export const CURRENT_SAVE_VERSION = "1.0.0";

export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
}

export interface TransferOffer {
  id: string;
  clubId: string;
  clubName: string;
  transferFee: number;
  wageOffer: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface WorldCalendarState {
  currentDate: string;
  seasonYear: number;
  matchday: number;
}

export interface SaveGame {
  saveVersion: string;
  savedAt: string;
  careerDate: string;
  player: Player;
  currentClub: Club | null;
  leagueStandings: Standing[];
  newsHistory: NewsArticle[];
  socialHistory: SocialPost[];
  careerMilestones: Milestone[];
  transferOffers: TransferOffer[];
  calendarState: WorldCalendarState;
}

export class SaveLoadEngine {
  /**
   * Saves game state atomically using a temp file (.tmp) then renaming to prevent corruption
   */
  static saveGame(state: SaveGame, filePath: string = 'savegame.json'): void {
    const serializedState: SaveGame = {
      ...state,
      saveVersion: CURRENT_SAVE_VERSION,
      savedAt: new Date().toISOString()
    };

    const dir = path.dirname(filePath);
    if (dir && dir !== '.' && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const tempFilePath = `${filePath}.tmp`;
    const jsonContent = JSON.stringify(serializedState, null, 2);

    try {
      fs.writeFileSync(tempFilePath, jsonContent, 'utf-8');
      fs.renameSync(tempFilePath, filePath);
    } catch (error) {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      throw new Error(`Failed to save game securely: ${(error as Error).message}`);
    }
  }

  /**
   * Loads and validates a save game from disk
   */
  static loadGame(filePath: string = 'savegame.json'): SaveGame {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Save file not found at: ${filePath}`);
    }

    let rawData: string;
    try {
      rawData = fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read save file: ${(error as Error).message}`);
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(rawData);
    } catch (error) {
      throw new Error(`Save file is corrupted: Invalid JSON format.`);
    }

    // Validate structure & required fields
    SaveLoadEngine.validateSaveData(parsedData);

    // Apply migrations if version differs in the future
    const migratedData = SaveLoadEngine.migrateSave(parsedData);

    return migratedData as SaveGame;
  }

  /**
   * Validates save data structure and types without execution risks
   */
  static validateSaveData(data: any): void {
    if (!data || typeof data !== 'object') {
      throw new Error('Save file is corrupted: Root object is missing or invalid.');
    }

    if (!data.saveVersion || typeof data.saveVersion !== 'string') {
      throw new Error('Save file is corrupted: saveVersion is missing or invalid.');
    }

    if (!data.savedAt || typeof data.savedAt !== 'string') {
      throw new Error('Save file is corrupted: savedAt timestamp is missing.');
    }

    if (!data.careerDate || typeof data.careerDate !== 'string') {
      throw new Error('Save file is corrupted: careerDate is missing.');
    }

    if (!data.player || typeof data.player !== 'object') {
      throw new Error('Save file is corrupted: player object is missing.');
    }

    const p = data.player;
    if (!p.id || !p.name || typeof p.age !== 'number' || !p.attributes || !p.personality) {
      throw new Error('Save file is corrupted: player.attributes or player.personality is missing.');
    }

    if (data.currentClub !== null && (typeof data.currentClub !== 'object' || !data.currentClub.id)) {
      throw new Error('Save file is corrupted: currentClub is invalid.');
    }

    if (!Array.isArray(data.leagueStandings)) {
      throw new Error('Save file is corrupted: leagueStandings must be an array.');
    }

    if (!Array.isArray(data.newsHistory)) {
      throw new Error('Save file is corrupted: newsHistory must be an array.');
    }

    if (!Array.isArray(data.socialHistory)) {
      throw new Error('Save file is corrupted: socialHistory must be an array.');
    }

    if (!Array.isArray(data.careerMilestones)) {
      throw new Error('Save file is corrupted: careerMilestones must be an array.');
    }

    if (!Array.isArray(data.transferOffers)) {
      throw new Error('Save file is corrupted: transferOffers must be an array.');
    }

    if (!data.calendarState || typeof data.calendarState !== 'object') {
      throw new Error('Save file is corrupted: calendarState is missing.');
    }
  }

  /**
   * Handles backward compatibility migrations for future save versions
   */
  static migrateSave(saveData: any): any {
    // If future versions require schema transformations, handle them here based on saveData.saveVersion
    if (saveData.saveVersion === "1.0.0") {
      return saveData;
    }

    // Default fallback migration
    return saveData;
  }
}
