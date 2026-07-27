import '../app/logic.js';

const {audioPreferences,pinchConfig,freshPinchState,updatePinch}=globalThis.CELESTIAL_LOGIC;
const preferences=audioPreferences({musicEnabled:false,sfxEnabled:true,musicVolume:500,sfxVolume:'bad'});
if(preferences.musicEnabled!==false||preferences.musicVolume!==100||preferences.sfxVolume!==80)throw new Error('Audio preference migration/clamping failed.');
const config=pinchConfig(55);
if(Math.abs(config.close-.317)>.0001||Math.abs(config.open-.497)>.0001||config.stableMs!==140||config.cooldownMs!==450)throw new Error('Pinch calibration changed unexpectedly.');
let state=freshPinchState(),result;
for(const now of [100,180,245]){result=updatePinch(state,{valid:true,ratio:.25,now,sensitivity:55,candidateId:'17'});state=result.state;}
if(result.commitCandidate!=='17'||state.armed)throw new Error('Stable pinch did not commit exactly once.');
result=updatePinch(state,{valid:true,ratio:.7,now:300,sensitivity:55,candidateId:'17'});state=result.state;
if(!state.armed)throw new Error('Open-hand release did not re-arm pinch.');
result=updatePinch(state,{valid:true,ratio:.25,now:520,sensitivity:55,candidateId:'18'});state=result.state;
result=updatePinch(state,{valid:false,now:560,sensitivity:55});
if(result.state.frozenCandidate!==null||result.state.progress!==0)throw new Error('Missing landmarks did not cancel the closing attempt.');
console.log('Runtime logic validation passed: audio preferences and elapsed-time pinch hysteresis.');
