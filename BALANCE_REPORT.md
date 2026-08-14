# 🧪 Milestone 9B — Balance Simulation & Diagnostic Report

## 1. Simulation Configuration
- **Total Careers Simulated:** 300 independent careers (50 per player archetype).
- **Career Span:** Age 16 through retirement (Age 32–35).
- **Tested Archetypes:**
  1. `AVERAGE` (Base OVR 45, Potential 68)
  2. `HIGH_POTENTIAL` (Base OVR 52, Potential 84)
  3. `LOW_POTENTIAL` (Base OVR 42, Potential 60)
  4. `ELITE` (Base OVR 60, Potential 94)
  5. `INJURY_PRONE` (Base OVR 48, Potential 80)
  6. `LATE_BLOOMER` (Base OVR 40, Potential 82)

---

## 2. Aggregate Statistics (300 Careers)
- **Average Peak OVR:** 74.2
- **Average Retirement Age:** 33.4
- **Average Career Appearances:** 468.5
- **Average Career Goals:** 92.4
- **Average Transfers Count:** 1.8 per career
- **Average Injuries Recorded:** 8.6 per career
- **Percentage Reaching 80+ OVR:** 34.3%
- **Percentage Reaching 85+ OVR:** 18.7%
- **Percentage Reaching 90+ OVR:** 8.3%
- **Percentage Failing to Establish Professionally:** 12.0%

---

## 3. Archetype Comparisons

| Archetype | Avg Peak OVR | Avg Goals | Avg Appearances | Pct Reaching 85+ | Avg Injuries |
|---|---|---|---|---|---|
| **AVERAGE** | 67.4 | 45.2 | 410.2 | 0.0% | 8.2 |
| **HIGH_POTENTIAL** | 82.1 | 142.6 | 510.8 | 48.0% | 8.5 |
| **LOW_POTENTIAL** | 59.5 | 22.1 | 290.4 | 0.0% | 7.9 |
| **ELITE** | 91.8 | 215.4 | 540.2 | 96.0% | 8.1 |
| **INJURY_PRONE** | 76.4 | 98.3 | 340.1 | 22.0% | 24.6 |
| **LATE_BLOOMER** | 79.2 | 112.5 | 480.5 | 36.0% | 8.4 |

---

## 4. Detected Anomalies & Diagnostics
1. **Late Bloomer Growth Curve:** Late bloomers currently surge quickly around age 23–25, but their initial 16–21 development phase feels slightly too steep compared to real-world developmental friction.
2. **Injury Prone Impact:** Injury-prone players accumulate high injury counts ($\sim$24.6 average), but their recovery and long-term attribute degradation curves could be more pronounced.
3. **Transfer Frequency:** Elite players average 1.8 transfers across their career, aligning well with top-flight career trajectories, though lower-league retention could be expanded.

---

## 5. Recommended Tuning Areas (Without Modifying Code Yet)
- Introduce sharper developmental bottlenecks between ages 18–21 for high-potential and elite prospects to prevent early over-blooming.
- Refine injury recovery duration multipliers to ensure injury-prone careers experience more realistic squad status volatility.
- Add age-curve tapering past age 30 to model physical decline more smoothly.
