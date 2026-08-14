# Milestone 9C — Repository Architecture Audit & UI Strategy

## 1. Current Application Architecture
- **Language & Runtime:** TypeScript / Node.js.
- **Core Engine Modules:** 
  - Player Generator & Attributes (`src/models/Player.ts`, `src/models/Personality.ts`)
  - Match Engine (`src/engine/MatchEngine.ts`)
  - Social & Media System (`src/engine/SocialFeedEngine.ts`, `src/engine/NewsEngine.ts`, `src/engine/InterviewEngine.ts`, `src/engine/EventAnalyzerPipeline.ts`)
  - Persistence & Save/Load (`src/engine/SaveLoadEngine.ts`)
  - Balance Simulation Harness (`src/engine/BalanceHarness.ts`)

## 2. Current Entry Points
- `src/index.ts` (CLI simulation demo)
- `src/runBalance.ts` (Batch simulation diagnostic runner)

## 3. Existing Dependencies
- `typescript`, `ts-node`, `jest`, `ts-jest`, `@types/node`, `@types/jest`.
- No heavy frontend framework dependencies (`react`, `express`, `electron`, etc.) currently exist in `package.json`.

## 4. Frontend Framework Evaluation
- **Should we add React / Next.js / Electron?** 
  - **No.** Introducing a heavy web framework or GUI desktop framework at this stage would require unnecessary build toolchains, bundlers, and rewrite the existing Node.js core architecture, risking breakage of Phases 1–8 and Milestone 9A.
- **What is the best minimal UI architecture?**
  - An **Interactive Terminal User Interface (TUI)** using Node.js standard streams (`readline`) or a lightweight, robust **CLI Menu Navigator** that presents clean screens (Career Hub, Player Profile, Calendar, Training, Matches, News, Social, Transfers, Career Legacy, and Save/Load) directly in the terminal.
  - This allows the game to remain 100% pure TypeScript/Node.js, fully leveraging existing engines, persistence, and test suites without breaking anything.

## 5. Integration Strategy (Engines as Source of Truth)
- The UI will be purely navigational and presentation-focused.
- It will invoke existing engines directly:
  - **Save/Load:** `SaveLoadEngine.saveGame()` / `SaveLoadEngine.loadGame()`
  - **Matches:** `MatchEngine.simulateMatch()`
  - **Events / Media:** `EventAnalyzerPipeline.processMatchEvent()`
  - **Personality:** `PersonalityEngine`
  - **Player & Clubs:** `PlayerGenerator`, `CLUBS`, `LEAGUES`

## 6. Proposed Milestone 9C Incremental Implementation Plan
1. **`src/ui/UIManager.ts`**: Interactive terminal menu navigation system exposing the requested screens.
2. **`src/ui/screens/`**:
   - `CareerHubScreen.ts` (Overview, status, next match, quick actions)
   - `PlayerProfileScreen.ts` (Attributes, appearance, personality archetype, development)
   - `CalendarScreen.ts` (Schedule, training, fixtures)
   - `MatchScreen.ts` (Playable match flow and moment decisions)
   - `NewsSocialScreen.ts` (News headlines and fan social reactions)
   - `TransfersScreen.ts` (Scout interests and transfer offers)
   - `SaveLoadScreen.ts` (Save and load career slots)
3. **`src/index.ts`**: Updated to launch the Interactive TUI Game Dashboard (`npm start`).
