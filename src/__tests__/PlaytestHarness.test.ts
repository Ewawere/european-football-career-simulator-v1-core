import { PlaytestHarness } from '../engine/PlaytestHarness';

describe('Milestone 9D: Playtest & Bug Bash Harness', () => {
  test('Complete end-to-end playtest executes without P0/P1 failures', () => {
    const harness = new PlaytestHarness();
    const result = harness.runFullPlaytest();

    expect(result.success).toBe(true);
    expect(result.issues.every(i => i.status === 'FIXED' || i.severity === 'P3' || i.severity === 'P4')).toBe(true);
  });
});
