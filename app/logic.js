(() => {
  "use strict";

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const integer = (value, fallback) => Number.isFinite(Number(value)) ? Math.round(Number(value)) : fallback;

  function audioPreferences(value = {}) {
    return {
      version: 1,
      musicEnabled: typeof value.musicEnabled === 'boolean' ? value.musicEnabled : true,
      sfxEnabled: typeof value.sfxEnabled === 'boolean' ? value.sfxEnabled : true,
      musicVolume: clamp(integer(value.musicVolume, 70), 0, 100),
      sfxVolume: clamp(integer(value.sfxVolume, 80), 0, 100)
    };
  }

  function pinchConfig(sensitivity = 55) {
    const normalized = clamp(integer(sensitivity, 55), 0, 100) / 100;
    const close = .24 + normalized * .14;
    return {close, open: close + .18, stableMs: 140, continuityMs: 180, cooldownMs: 450};
  }

  function freshPinchState(armed = true) {
    return {armed, history: [], closingSince: 0, frozenCandidate: null, lastAt: 0, cooldownUntil: 0, progress: 0};
  }

  function median(values) {
    const ordered = [...values].sort((a, b) => a - b);
    return ordered[Math.floor(ordered.length / 2)];
  }

  function updatePinch(previous, sample) {
    const config = pinchConfig(sample.sensitivity), now = Number(sample.now) || 0;
    let state = {...previous, history: [...(previous.history || [])]}, commitCandidate = null;
    const discontinuity = !sample.valid || !Number.isFinite(sample.ratio) || (state.lastAt && now - state.lastAt > config.continuityMs);
    if (discontinuity) return {state:{...freshPinchState(state.armed),cooldownUntil:state.cooldownUntil,lastAt:now},commitCandidate};
    state.lastAt = now;
    state.history.push(sample.ratio);
    state.history = state.history.slice(-3);
    const ratio = median(state.history);
    if (ratio >= config.open) return {state:{...freshPinchState(true),lastAt:now,cooldownUntil:state.cooldownUntil},commitCandidate};
    if (now < state.cooldownUntil || !state.armed || ratio > config.close || !sample.candidateId) {
      state.closingSince = 0; state.frozenCandidate = null; state.progress = 0;
      return {state, commitCandidate};
    }
    if (!state.closingSince || state.frozenCandidate !== sample.candidateId) {
      state.closingSince = now; state.frozenCandidate = sample.candidateId; state.progress = 0;
      return {state, commitCandidate};
    }
    state.progress = clamp((now - state.closingSince) / config.stableMs, 0, 1);
    if (state.progress >= 1) {
      commitCandidate = state.frozenCandidate;
      state = {...freshPinchState(false),lastAt:now,cooldownUntil:now + config.cooldownMs,progress:1};
    }
    return {state, commitCandidate};
  }

  const PAIR_RELATIONS = Object.freeze(new Map([
    ['MAJOR-00|MAJOR-21','progression'],['MAJOR-08|MAJOR-11','balance'],
    ['MAJOR-13|MAJOR-20','progression'],['MAJOR-15|MAJOR-16','reinforcement'],
    ['MAJOR-18|MAJOR-19','contrast'],['MAJOR-19|MAJOR-20','progression'],['CUPS-02|SWORDS-03','contrast'],
    ['PENTACLES-04|PENTACLES-06','balance'],['SWORDS-04|WANDS-08','contrast']
  ]));
  const pairKey = (left, right) => [left, right].sort().join('|');

  function cardText(card, reversed, position) {
    const orientation = card[reversed ? 'reversed' : 'upright'];
    return {keywords:card.keywords, core:orientation.core, tension:orientation.tension, reflection:orientation.reflection, action:orientation.action, position:card.position[position]};
  }

  const isReversed = card => Boolean(card?.isReversed ?? (typeof card?.reversed === 'boolean' ? card.reversed : false));

  function spreadRelation(cards) {
    return PAIR_RELATIONS.get(pairKey(cards[1].id, cards[2].id)) || PAIR_RELATIONS.get(pairKey(cards[0].id, cards[1].id)) || 'direct';
  }

  function synthesizeReading(cards) {
    if (!Array.isArray(cards) || cards.length !== 3) throw new Error('A synthesis requires exactly three cards.');
    const positions=['situation','challenge','guidance'], clauses=cards.map((card,index)=>cardText(card,isReversed(card),positions[index]).position), relation=spreadRelation(cards);
    const bridge={
      reinforcement:{en:'Together, the Challenge and Guidance reinforce the same priority.',zh:'挑战与指引共同强调同一个重点。'},
      contrast:{en:'The Challenge and Guidance pull in different directions; hold the contrast before choosing.',zh:'挑战与指引指向不同方向；先容纳这种对照，再作选择。'},
      progression:{en:'The Challenge can develop into the Guidance through deliberate practice.',zh:'通过有意识的练习，挑战可以逐步转向指引。'},
      balance:{en:'The Challenge and Guidance ask for balance rather than an extreme.',zh:'挑战与指引要求的是平衡，而非走向极端。'},
      direct:{en:'',zh:''}
    }[relation];
    const join=locale=>[clauses[0][locale],clauses[1][locale],clauses[2][locale],bridge[locale],cards[2][isReversed(cards[2])?'reversed':'upright'].action[locale]].filter(Boolean).join(locale==='zh'?'':' ');
    return {relation,en:join('en'),zh:join('zh'),movement:{en:clauses.map(value=>value.en).join(' '),zh:clauses.map(value=>value.zh).join('')},action:cardText(cards[2],isReversed(cards[2]),'guidance').action};
  }

  function clone(value) {
    return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
  }

  function deepFreeze(value) {
    if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
  }

  function createReadingSnapshot({snapshot,cards,language,question,readingCreatedAt,meaningEdition,legacy=false,legacyLabel='',focusedReading=null,focusedChoices=null}) {
    if (snapshot?.version === 2) return deepFreeze(clone(snapshot));
    const capturedCards=clone(cards);
    if (!Array.isArray(capturedCards) || capturedCards.length !== 3) throw new Error('A snapshot requires exactly three cards.');
    const reading=synthesizeReading(capturedCards);
    if(focusedReading){focusedReading=globalThis.CELESTIAL_AI.validateResult(focusedReading);reading.en=focusedReading.en;reading.zh=focusedReading.zh;}
    return deepFreeze({version:2,focusedReading:clone(focusedReading),focusedChoices:clone(focusedChoices),language:String(language),legacy:Boolean(legacy),legacyLabel:String(legacyLabel),readingCreatedAt:String(readingCreatedAt),meaningEdition:String(meaningEdition),question:String(question),cards:capturedCards,synthesis:{en:reading.en,zh:reading.zh},movement:clone(reading.movement),groundedAction:clone(reading.action),relation:reading.relation});
  }

  globalThis.CELESTIAL_LOGIC = Object.freeze({audioPreferences, pinchConfig, freshPinchState, updatePinch, isReversed, cardText, spreadRelation, synthesizeReading, createReadingSnapshot});
})();
