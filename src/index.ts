import { PlayerGenerator } from './models/Player';
import { MatchContext } from './engine/SocialFeedEngine';
import { EventAnalyzerPipeline } from './engine/EventAnalyzerPipeline';
import { InterviewEngine } from './engine/InterviewEngine';
import { PersonalityEngine } from './engine/PersonalityEngine';

async function main() {
  console.log("==================================================");
  console.log("  EUROPEAN FOOTBALL CAREER SIMULATOR — PHASE 8");
  console.log("  Social, Media, Personality & Event Pipeline Demo");
  console.log("==================================================\n");

  // 1. Create Player (16-year-old academy prospect at Arsenal)
  const player = PlayerGenerator.createNewPlayer("Alex Hunter", "RW", "England", "Arsenal");
  
  console.log(`👤 Created Player: ${player.name} (${player.position}), Age ${player.age}`);
  console.log(`   Club: ${player.clubName} | Overall: ${player.overall} | Market Value: €${(player.marketValue / 1000000).toFixed(1)}M`);
  console.log(`   Initial Personality Archetype: [ ${PersonalityEngine.getArchetype(player)} ]\n`);

  // 2. Simulate FA Cup Final Scenario
  console.log("--------------------------------------------------");
  console.log("🏆 SCENARIO: FA Cup Final — Arsenal vs Chelsea");
  console.log("   74' | Score: 1-1 | Alex Hunter is subbed on!");
  console.log("   87' | Alex beats defender... shoots... GOAL! ⚽");
  console.log("   FT  | Arsenal win 2-1!\n");

  const matchContext: MatchContext = {
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

  // Run through Event Analyzer Pipeline
  const pipelineResult = EventAnalyzerPipeline.processMatchEvent(player, matchContext);

  // 📰 3. News Feed
  console.log("📰 NEWS HEADLINES:");
  pipelineResult.news.forEach(art => {
    console.log(`   [${art.source}] ${art.headline}`);
    console.log(`   "${art.summary}"\n`);
  });

  // 📱 4. Social Feed & Trending Topics
  console.log("🔥 TRENDING TOPICS:", pipelineResult.trendingTopics.join('  '));
  console.log("\n📱 SOCIAL MEDIA REACTIONS:");
  pipelineResult.socialPosts.slice(0, 3).forEach(post => {
    console.log(`   ${post.actorHandle} (${post.actorName}): "${post.content}"`);
    console.log(`   ❤️ ${post.likes.toLocaleString()} likes | ${post.hashtags.join(' ')}\n`);
  });

  // 🎤 5. Post-Match Interview
  if (pipelineResult.interview) {
    console.log("--------------------------------------------------");
    console.log("🎤 POST-MATCH INTERVIEW");
    console.log(`   Reporter (${pipelineResult.interview.reporterName} - ${pipelineResult.interview.outlet}):`);
    console.log(`   "${pipelineResult.interview.text}"\n`);

    console.log("   Choose your response:");
    pipelineResult.interview.options.forEach((opt, idx) => {
      console.log(`   [${idx + 1}] (${opt.tone}) "${opt.text}"`);
    });

    // Simulate choosing Option 3 (Ambitious / "This is just the beginning")
    const chosenOption = pipelineResult.interview.options.find(o => o.tone === 'AMBITIOUS') || pipelineResult.interview.options[0];
    console.log(`\n   👉 You chose: (${chosenOption.tone}) "${chosenOption.text}"`);

    InterviewEngine.applyInterviewChoice(player, chosenOption);
  }

  // 📈 6. Updated Career State
  console.log("--------------------------------------------------");
  console.log("📈 CAREER UPDATES:");
  console.log(`   ⭐ Reputation: ${player.reputation} (+${pipelineResult.reputationDelta})`);
  console.log(`   💰 Market Value: €${(player.marketValue / 1000000).toFixed(1)}M`);
  console.log(`   👔 Manager Trust: ${player.managerTrust}/100`);
  console.log(`   🎭 Updated Personality: [ ${PersonalityEngine.getArchetype(player)} ]`);
  console.log(`      (Ambition: ${player.personality.ambition}, Confidence: ${player.personality.confidence}, Professionalism: ${player.personality.professionalism})`);
  
  if (player.scoutInterests.length > 0) {
    console.log(`   👀 Scout Interest (${player.scoutInterests[0].clubName}): ${player.scoutInterests[0].interestPercent}%`);
  }

  console.log("\n==================================================");
  console.log("  PHASE 8 DEMO COMPLETE — THE FOOTBALLER FANTASY IS ALIVE!");
  console.log("==================================================");
}

main().catch(err => console.error(err));
