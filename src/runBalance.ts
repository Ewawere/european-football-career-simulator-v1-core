import { BalanceHarness } from './engine/BalanceHarness';

async function main() {
  console.log("==================================================");
  console.log("  EUROPEAN FOOTBALL CAREER SIMULATOR — MILESTONE 9B");
  console.log("  Career Simulation & Balance Diagnostic Harness");
  console.log("==================================================\n");

  console.log("Running batch simulations (50 careers per archetype across 6 archetypes = 300 careers total)...");
  const startTime = Date.now();
  const { summary } = BalanceHarness.runBatchSimulations(50);
  const duration = Date.now() - startTime;

  console.log(`\n✅ Simulations complete in ${duration}ms!\n`);
  console.log("--------------------------------------------------");
  console.log("📊 AGGREGATE BALANCE SUMMARY (300 Careers):");
  console.log("--------------------------------------------------");
  console.log(`- Total Careers Simulated: ${summary.totalCareersRun}`);
  console.log(`- Average Peak OVR: ${summary.avgPeakOvr.toFixed(1)}`);
  console.log(`- Average Retirement Age: ${summary.avgRetirementAge.toFixed(1)}`);
  console.log(`- Average Career Goals: ${summary.avgGoals.toFixed(1)}`);
  console.log(`- Average Career Appearances: ${summary.avgAppearances.toFixed(1)}`);
  console.log(`- Percentage Reaching 80+ OVR: ${summary.pctReached80.toFixed(1)}%`);
  console.log(`- Percentage Reaching 85+ OVR: ${summary.pctReached85.toFixed(1)}%`);
  console.log(`- Percentage Reaching 90+ OVR: ${summary.pctReached90.toFixed(1)}%`);
  console.log(`- Percentage Failing Professionally: ${summary.pctFailed.toFixed(1)}%`);
  console.log(`- Average Transfers per Career: ${summary.avgTransfers.toFixed(1)}`);
  console.log(`- Average Injuries per Career: ${summary.avgInjuries.toFixed(1)}`);

  console.log("\n⚠️ DETECTED ANOMALIES & DIAGNOSTICS:");
  if (summary.detectedAnomalies.length > 0) {
    summary.detectedAnomalies.forEach((anom, idx) => {
      console.log(`  ${idx + 1}. ${anom}`);
    });
  } else {
    console.log("  No critical system anomalies detected. Curve distribution is within acceptable parameters.");
  }

  console.log("\n📄 Full diagnostic breakdown written to BALANCE_REPORT.md");
  console.log("==================================================");
}

main().catch(err => console.error(err));
