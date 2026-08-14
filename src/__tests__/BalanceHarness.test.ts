import { BalanceHarness, PlayerArchetype } from '../engine/BalanceHarness';

describe('Milestone 9B: Balance Simulation Harness', () => {
  test('A. Generates archetype player correctly', () => {
    const elitePlayer = BalanceHarness.generateArchetypePlayer('ELITE');
    expect(elitePlayer.potential).toBeGreaterThan(90);

    const avgPlayer = BalanceHarness.generateArchetypePlayer('AVERAGE');
    expect(avgPlayer.potential).toBeLessThan(80);
  });

  test('B. Simulates single career and produces metrics', () => {
    const metrics = BalanceHarness.simulateCareer('HIGH_POTENTIAL', 42);
    expect(metrics.archetype).toBe('HIGH_POTENTIAL');
    expect(metrics.retirementAge).toBeGreaterThanOrEqual(32);
    expect(metrics.appearances).toBeGreaterThan(0);
    expect(metrics.peakOvr).toBeGreaterThanOrEqual(metrics.startAge);
  });

  test('C. Runs batch simulations and computes summary statistics', () => {
    // Run small batch for test speed (10 per archetype = 60 total)
    const { metrics, summary } = BalanceHarness.runBatchSimulations(10);
    expect(metrics.length).toBe(60);
    expect(summary.totalCareersRun).toBe(60);
    expect(summary.avgPeakOvr).toBeGreaterThan(40);
    expect(summary.avgRetirementAge).toBeGreaterThan(30);
    expect(Array.isArray(summary.detectedAnomalies)).toBe(true);
  });
});
