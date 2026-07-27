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

  globalThis.CELESTIAL_LOGIC = Object.freeze({audioPreferences, pinchConfig, freshPinchState, updatePinch});
})();

