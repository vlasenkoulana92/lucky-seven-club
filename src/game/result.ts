export type ResultOutcome = 'broke' | 'night' | 'sessionCleared' | 'sessionMissed' | 'daily';

export type ResultPayload = {
  outcome: ResultOutcome;
  headline: string;
  note: string;
  win: boolean;
  /** offer the soft reset as the primary CTA (never a dead end) */
  offerRefill: boolean;
  rows: { label: string; value: string }[];
  /** where SPIN AGAIN should send the player back to */
  replay: 'game' | 'challenge' | 'daily';
};

export function brokeResult(rows: ResultPayload['rows']): ResultPayload {
  return {
    outcome: 'broke',
    headline: 'OUT OF COINS',
    note: 'THE HOUSE KEEPS THE LIGHTS ON — TAKE A FRESH STACK',
    win: false,
    offerRefill: true,
    rows,
    replay: 'game',
  };
}

export function nightResult(rows: ResultPayload['rows'], win: boolean): ResultPayload {
  return {
    outcome: 'night',
    headline: 'NIGHT CLOSED',
    note: win ? 'YOU LEAVE THE FLOOR UP ON THE HOUSE' : 'THE FLOOR TOOK MORE THAN IT GAVE',
    win,
    offerRefill: false,
    rows,
    replay: 'game',
  };
}

export function sessionResult(
  cleared: boolean,
  rows: ResultPayload['rows'],
  replay: 'challenge' | 'daily',
): ResultPayload {
  return {
    outcome: cleared ? 'sessionCleared' : 'sessionMissed',
    headline: cleared ? 'SESSION CLEARED' : 'SESSION MISSED',
    note: cleared
      ? 'THE TABLE PAYS OUT — THE REWARD IS IN YOUR STACK'
      : 'THE SPINS RAN OUT BEFORE THE GOAL DID',
    win: cleared,
    offerRefill: false,
    rows,
    replay,
  };
}
