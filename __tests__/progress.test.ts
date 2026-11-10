import {
  MILESTONES,
  claimableMilestones,
  isMilestoneComplete,
  levelForXp,
  levelProgress,
  nextUnlockLabel,
  xpForSpin,
  xpInLevel,
} from '../src/game/progression';
import { XP_PER_LEVEL } from '../src/constants/config';
import { initialState, metricsOf, reducer } from '../src/game/state';

describe('progression', () => {
  it('accrues more XP for a winning spin than for a losing one', () => {
    expect(xpForSpin(false)).toBe(4);
    expect(xpForSpin(true)).toBe(16);
  });

  it('turns XP into Club Levels', () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(XP_PER_LEVEL - 1)).toBe(1);
    expect(levelForXp(XP_PER_LEVEL)).toBe(2);
    expect(xpInLevel(XP_PER_LEVEL + 10)).toBe(10);
    expect(levelProgress(XP_PER_LEVEL / 2)).toBeCloseTo(0.5);
  });

  it('names the next unlock in words', () => {
    expect(nextUnlockLabel(1)).toContain('HIGH TABLE');
    expect(nextUnlockLabel(2)).toContain('SEVEN RUN');
  });

  it('lists five milestones with unique keys', () => {
    expect(MILESTONES).toHaveLength(5);
    expect(new Set(MILESTONES.map(m => m.key)).size).toBe(5);
  });

  it('marks a milestone complete and claimable exactly once', () => {
    let state = { ...initialState(), totalSpins: 120 };
    const metrics = metricsOf(state);
    const spins100 = MILESTONES.find(m => m.key === 'spins100')!;
    expect(isMilestoneComplete(spins100, metrics)).toBe(true);
    expect(claimableMilestones(metrics, []).map(m => m.key)).toContain('spins100');

    const before = state.balance;
    state = reducer(state, { type: 'CLAIM_MILESTONE', key: 'spins100' });
    expect(state.balance).toBe(before + spins100.reward);
    const again = reducer(state, { type: 'CLAIM_MILESTONE', key: 'spins100' });
    expect(again.balance).toBe(state.balance);
    expect(claimableMilestones(metricsOf(state), state.milestonesClaimed)).toHaveLength(0);
  });

  it('refuses to claim a milestone that is not reached', () => {
    const state = initialState();
    const out = reducer(state, { type: 'CLAIM_MILESTONE', key: 'spins500' });
    expect(out.balance).toBe(state.balance);
    expect(out.milestonesClaimed).toHaveLength(0);
  });
});
