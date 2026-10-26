(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const deck = window.CELESTIAL_DECK;
  if (!deck || !Array.isArray(deck.cards) || deck.cards.length !== 78) throw new Error('The approved 78-card production registry did not load.');
  const cards = deck.cards;
  const cardById = new Map(cards.map(card => [card.id, card]));
  const archiveKey = 'celestial-archive-readings-v1';
  const preferenceKey = 'celestial-audio-preferences-v1';
  const logic = window.CELESTIAL_LOGIC;
  if (!logic) throw new Error('The runtime logic helpers did not load.');

  const chapters = [
    {title:"The Question", zh:"问", copy:"A useful question opens a field instead of demanding a verdict. Ask what deserves attention, what pattern is repeating, or what quality can be practiced next.", quote:"The card does not replace your judgment; it gives your judgment another angle of light."},
    {title:"The Shuffle", zh:"洗牌", copy:"Shuffling is a small interruption. It gives the body a role and breaks the mind’s insistence on a rehearsed answer. Fast or slow is less important than present.", quote:"Ritual is attention with a visible shape."},
    {title:"The Reveal", zh:"揭示", copy:"Turn each card completely. Notice the first physical response before reading a definition: attraction, resistance, recognition, confusion. That reaction is part of the material.", quote:"Look once before you begin to name."},
    {title:"The Spread", zh:"牌阵", copy:"A spread is grammar. Positions give each image a job, while the images alter one another. Begin with three positions and read the relationships before adding complexity.", quote:"Meaning lives between the cards as much as inside them."},
    {title:"Reversals", zh:"逆位", copy:"A reversed card can suggest obstruction, interiority, delay, excess, or a quality asking to be reclaimed. Use one consistent method; ambiguity should deepen attention, not erase it.", quote:"A reversal turns the symbol inward—it does not automatically turn it bad."},
    {title:"Care & Closure", zh:"照护与结束", copy:"Close a reading by naming one grounded action. Save it only when returning would be useful. Otherwise, let the paper dissolve and allow the question to change you privately.", quote:"Keep what serves. Release what has completed its work."}
  ];

  const translations = {
    navReading:["Reading","解读"], navDeck:["The deck","牌组"], navSaved:["Saved readings","已存解读"], navGuide:["Guide","指南"],
    entryLede:["A private archive for questions, symbols, and the cards that find you.","一座收藏问题、象征与命定之牌的私人档案馆。"],
    enter:["Enter the archive","进入秘典"], entryNote:["Sound begins only after you enter. Headphones recommended.","声音将在进入后开始。建议佩戴耳机。"],
    review:["Review","审阅"], gatewayTitle:["A little space. A new perspective.","留一点空间，换一种眼光。"], gatewayLede:["Begin with a question, explore the cards, or return to a thought worth keeping.","从一个问题开始，探索牌中的象征，或重温值得留下的想法。"],
    ritual:["Begin a reading","开始解读"], ritualDesc:["Ask, shuffle, reveal, understand.","提问、洗牌、揭示、理解。"], arcana:["Arcana","秘仪之牌"], arcanaDesc:["Browse the complete celestial deck.","浏览完整的天穹牌组。"],
    chamber:["Reading Chamber","占卜室"], chamberDesc:["Return only to readings you chose to keep.","只回到你亲自选择保存的解读。"], grimoire:["Grimoire","秘典"], grimoireDesc:["Six chapters on reading with care.","六章关于谨慎解读的笔记。"],
    questionHelp:["Write in the box above, or leave it blank. Your words stay on this device; the local reading does not analyze your question.","请在上方框内填写，也可留空。文字保留在本机；本地解读不会分析问题内容。"],
    chooseMethod:["Next, choose how to draw","下一步，选择抽牌方式"],
    tapDraw:["Shuffle & tap cards","洗牌后点击选牌"],tapDrawHelp:["Choose three cards by tapping. No camera needed.","点击选择三张牌，无需摄像头。"],
    handDraw:["Shuffle & use Hand Ritual","洗牌后用手势选牌"],handDrawHelp:["Use your camera and pinch to choose three cards.","开启摄像头，通过捏合手势选择三张牌。"],
    ritualPageLede:["Name what is moving through you—or leave the question unspoken.","说出心中正在流动之物，或让问题保持沉默。"], questionLabel:["What deserves your attention? · Write your question","什么值得你关注？· 在下方填写问题"], questionPlaceholder:["What deserves my attention now?","此刻，什么值得我关注？"], begin:["Begin shuffle","开始洗牌"], handRitual:["Hand Ritual","手势仪式"], privacy:["Nothing is saved unless you explicitly choose Save.","除非你明确选择保存，否则不会保存任何内容。"],
    chooseThree:["Choose three cards.","选择三张牌。"], restartDraw:["Restart draw","重新抽牌"], deckScroll:["Scroll left to right through all 78 cards.","从左向右滑动，浏览全部 78 张牌。"], reveal:["Reveal the reading","揭示解读"], meaningTitle:["The pattern between the cards","牌与牌之间的纹理"], synthesis:["Synthesis","综合解读"], synthesisCopy:["A beginning asks for trust, uncertainty asks for patience, and the heart asks to remain open. Move carefully, but keep moving.","新的开始需要信任，不确定需要耐心，而心仍需保持敞开。谨慎前行，但不要停下。"],
    includeSave:["Include question when saving","保存时包含问题"], includeExport:["Include question in exported image","导出图片时包含问题"], includeCopy:["Include question when copying","复制时包含问题"], save:["Save","保存"], export:["Export image","导出图片"], copy:["Copy meaning","复制解读"], newReading:["New reading","新的解读"],
    searchCards:["Search all 78 cards","搜索全部78张牌"], all:["All 78","全部78张"], proofLimit:["78 original cards. Explore the symbols, meanings, and possibilities.","78 张原创卡牌。探索象征、牌义与可能性。"], chamberLede:["A moving gallery of readings you explicitly chose to keep.","仅展示你明确选择保存之解读的移动画廊。"],
    settings:["Settings","设置"], language:["Language","语言"], music:["Ambient music","环境音乐"], musicNote:["Enchanted Valley — Ondrosik · CC0","《Enchanted Valley》— Ondrosik · CC0"], sfx:["Interaction sound","交互声音"], sfxNote:["Menus, cards, save, export, and gestures","菜单、卡牌、保存、导出与手势"], motion:["Motion","动效"], motionNote:["Morph, gallery, reveal, paper, and ambient layers","变形、画廊、揭示、纸张与环境层"], handNote:["Optional invisible local motion tracking; never required","可选的本地隐形动作追踪；永不强制"],
    reviewTitle:["Approved R1.0 baseline","已批准的 R1.0 基准"], reviewIntro:["All finite proof cases were approved on 18 July 2026. They now define the locked baseline for full-deck generation; production remains gated by the completed catalog.","全部有限审核项目已于 2026 年 7 月 18 日获批。它们现为完整牌组生成的锁定基准；生产整合仍须等待完整牌组审核。"], handPrompt:["Open palm to browse. Point to aim. Pinch to select.","张开手掌浏览。伸出食指瞄准。捏合手指选牌。"], handPrivacy:["The camera works only as an invisible local hand-landmark sensor. Its preview is never shown, stored, or uploaded.","摄像头仅作为不可见的本地手部关键点传感器；画面不会显示、保存或上传。"], simulate:["Simulate selection","模拟选择"]
  };

  const reviewItems = [
    ["PAGE-01","Page design","Entry cover","Editorial ivory collage, ceremonial seal, delayed audio start."],
    ["PAGE-02","Page design","Gateway menu","Four destination panels on the original collage background."],
    ["PAGE-03","Page design","Enter the Ritual","Question, shuffle, three-card draw, reveal, meaning, save/export/copy."],
    ["PAGE-04","Page design","Arcana","Searchable proof grid, external titles, card-back-first detail opening."],
    ["PAGE-05","Page design","Reading Chamber","Finite x-axis gallery with selected session at full opacity."],
    ["PAGE-06","Page design","Grimoire","Six-chapter manuscript reading layout."],
    ["PAGE-07","Page design","Settings overlay","Language, music, sound, motion, and Hand Ritual toggles."],
    ["TRANS-01","Transition","Gateway → Ritual morph","Clicked panel compresses toward the shared archive sigil while the ritual room resolves."],
    ["TRANS-02","Transition","Gateway → Arcana morph","Shared-element page change with tonal audio shift."],
    ["TRANS-03","Transition","Gateway → Chamber morph","Shared-element page change into the dark paper archive."],
    ["TRANS-04","Transition","Gateway → Grimoire morph","Shared-element page change from dark seal to light manuscript."],
    ["TRANS-05","Transition","Return to gateway","Compact sigil expands context back into the four-panel menu."],
    ["TRANS-06","Transition","Overlay drawers","Settings and approval manifest slide above the active page."],
    ["MOTION-01","Motion","Ambient raster drift","Original page imagery moves slowly without moving live text."],
    ["MOTION-02","Motion","Deck fan and hover","Card backs fan horizontally and rise on focus or hover."],
    ["MOTION-03","Motion","Deal three cards","Selected backs move from the fan into three reading positions."],
    ["MOTION-04","Motion","Cinematic card emergence","Three backs rise from a dark portal, flare, fan outward, and flip with staggered chimes."],
    ["MOTION-05","Motion","Meaning panel rise","Interpretation arrives after all three cards are visible."],
    ["MOTION-06","Motion","Saved gallery focus","Center session reaches full opacity and scale; neighbors recede."],
    ["MOTION-07","Motion","Save origami pigeon","Report folds and flies toward the Reading Chamber."],
    ["MOTION-08","Motion","Unsave / discard dissolve","Unsaved reading disappears through paper, ink, and gold dust."],
    ["MOTION-09","Motion","Hand Ritual camera","Optional local hand-landmark tracking: open palm browses, one finger aims, and pinch alone selects; no upload or frame storage."],
    ["MOTION-10","Motion","Ceremonial opening ident","Original dark-green celestial sigil assembles through orbit, bloom, dust, and typographic reveal."],
    ["MOTION-11","Motion","Glowing click scatter","Gold and ivory particles burst from pointer and touch interactions."],
    ["MOTION-12","Motion","Staged interface entrances","Every page, drawer, dialog, panel, and content group assembles through ordered opacity, translate, scale, blur, line, and clip reveals."],
    ["SOUND-01","Sound","Ambient soundtrack","Enchanted Valley by Ondrosik; CC0 1.0 Universal. Source: https://ondrosik.sk/music/"],
    ["SOUND-02","Sound","Menu and button cues","Every interactive control has a restrained tactile cue."],
    ["SOUND-03","Sound","Page morph cue","Destination-specific tonal root accompanies each page change."],
    ["SOUND-04","Sound","Shuffle and select cues","Paper-like shuffle and plucked selection notes."],
    ["SOUND-05","Sound","Card reveal cue","Three staggered glass-and-string tones."],
    ["SOUND-06","Sound","Save pigeon cue","Ascending paper-wing phrase."],
    ["SOUND-07","Sound","Discard cue","Descending filtered dissolve."],
    ["SOUND-08","Sound","Export and copy cues","Short confirmation tones for explicit output actions."],
    ["RESP-01","Responsive","Phone portrait","Single-column gateway, two-column Arcana, readable ritual slots."],
    ["RESP-02","Responsive","Phone landscape","Condensed height treatment without clipping primary actions."],
    ["RESP-03","Responsive","Tablet portrait","Two-column gateway and compact editorial type scale."],
    ["RESP-04","Responsive","Tablet landscape","Wide ritual and gallery compositions."],
    ["RESP-05","Responsive","Laptop / desktop","Full four-panel gateway and six-card proof grid."],
    ["LANG-01","Language","EN + 中文 default","Bilingual labels wrap without fixed-height clipping."],
    ["LANG-02","Language","English only","English mode removes secondary bilingual density."],
    ["LANG-03","Language","中文 only","Chinese mode uses the approved CJK fallback chain."],
    ...cards.map((card,index)=>[`CARD-${String(index+1).padStart(2,"0")}`,"Card art",`${card.name} · ${card.zh}`,"Revision 2 local raster proof; locked near-black, muted-gold, warm-ivory palette; sparse flat screen-print composition; external title treatment."]),
    ["CARD-07","Card art","Universal lunar card back","Revision 2 local raster back; the same locked palette, sparse lunar-phase seal, and rotationally balanced composition."],
    ["BG-01","Background","Gateway collage","Original warm-ivory, black, and antique-gold editorial collage."],
    ["BG-02","Background","Ritual chamber","Original dark celestial table scene with central negative space."],
    ["BG-03","Background","Arcana archive","Original etched archive architecture for the card grid."],
    ["BG-04","Background","Reading Chamber","Original paper-pigeon scene and spotlight."],
    ["BG-05","Background","Grimoire manuscript","Original blank archival book environment."],
    ["REPORT-01","Export","Meaning image report","3200×1800 high-density local PNG; monochrome editorial poster with archival type, card montage, denser grain, and gold accents; question inclusion defaults off."],
    ["CAMERA-01","Privacy","Local hand-landmark gesture","Browser camera permission is explicit; 320×240 frames are analyzed in-memory by a local model, never shown, saved, or uploaded, with a manual fallback."],
    ["DATA-01","Privacy","No automatic reading save","Save, export, and copy are separate explicit actions; all question-inclusion toggles default off."]
  ].map(([id,category,title,description])=>({id,category,title,description,status:"approved",note:"Approved by user on 18 July 2026."}));

  function loadSessions(){
    try {
      const raw=JSON.parse(localStorage.getItem(archiveKey)||'[]');
      if(!Array.isArray(raw))return [];
      let migrated=false;const loaded=raw.map(record=>{const storedCards=record.snapshotVersion===2?record.snapshot?.cards:record.cards,hydratedCards=Array.isArray(storedCards)?storedCards.map(item=>{const base=cardById.get(item.id);return base?{...base,isReversed:logic.isReversed(item)}:null;}).filter(Boolean):[];if(record.snapshotVersion===2&&hydratedCards.length===3)return {...record,...record.snapshot,cards:hydratedCards,snapshot:{...record.snapshot,cards:hydratedCards}};const legacyCards=hydratedCards;if(legacyCards.length!==3)return null;migrated=true;const generated=logic.synthesizeReading(legacyCards),snapshot={version:2,legacy:true,legacyLabel:'Legacy record · rendered with current meaning edition / 旧记录 · 使用当前释义版本呈现',language:record.capturedLanguage||'bilingual',readingCreatedAt:record.readingCreatedAt||null,meaningEdition:deck.meaningEdition,question:String(record.question||''),cards:legacyCards,synthesis:{en:generated.en,zh:generated.zh},movement:generated.movement,groundedAction:generated.action};return {...record,snapshotVersion:2,snapshot,...snapshot,cards:legacyCards};}).filter(Boolean);if(migrated)localStorage.setItem(archiveKey,JSON.stringify(loaded.map(sessionRecord)));return loaded;
    } catch { return []; }
  }
  function sessionRecord(session){const snapshot=createReadingSnapshot(session);return {id:session.id,title:session.title,date:session.date,snapshotVersion:2,snapshot};}
  function persistSessions(){
    localStorage.setItem(archiveKey,JSON.stringify(sessions.map(sessionRecord)));
  }
  let sessions = loadSessions();

  let language = "bilingual";
  let activeRoute = "gateway";
  let selectedCards = [];
  let currentDeck = [];
  let readingRevealed = false;
  let readingSaved = false;
  let galleryIndex = 0;
  let toastTimer;
  let gestureStream = null;
  let gestureTimer = null;
  let gestureHands = null;
  let gestureInferenceToken = null;
  let gestureLastInference = 0;
  let gestureSmoothedX = .5;
  let gestureSmoothedY = .5;
  let gesturePalmLastX = null;
  let gestureMode = 'idle';
  let gestureZone = -1;
  let gestureFrames = 0;
  let gestureCooldownUntil = 0;
  let clickParticles = [];
  let dealsInFlight = 0;
  const deckAssignments = new WeakMap();
  let deckScrollFrame = 0;
  let gestureCandidate = null;
  let gestureCandidateIndex = -1;
  let gestureBrowseAnimationTimer = 0;
  let newSessionId = '';
  let saveInFlight = false;
  let exportInFlight = false;
  let exportGeneration = 0;
  let exportSnapshot = null;
  let exportInitiator = null;
  let exportUrls = [];
  let swRegistration = null;
  let pageReleaseId = null;
  let installPrompt = null;
  let readingGeneration = 0;
  let focusedReading = null, focusedChoices = null, aiRequest = null;
  const ai = window.CELESTIAL_AI;
  for (const [key, choices] of Object.entries(ai.presets)) {
    const label=document.createElement('label');
    label.textContent={topic:'Topic · 主题',situation:'Situation · 状态',clarity:'Desired clarity · 希望了解'}[key];
    const select=document.createElement('select');select.id=`ai-${key}`;
    for(const [value,text] of Object.entries(choices)){const option=document.createElement('option');option.value=value;option.textContent=text.join(' · ');select.append(option);}
    label.append(select);$('#ai-presets').append(label);
  }
  function clearFocusedReading(){aiRequest?.abort();aiRequest=null;focusedReading=null;focusedChoices=null;$('#ai-consent').checked=false;$('#ai-status').textContent='';}
  function renderFocusedControls(){
    const choices=focusedChoices||Object.fromEntries(Object.keys(ai.presets).map(key=>[key,$(`#ai-${key}`).value]));
    $('#ai-context').textContent=Object.keys(ai.presets).map(key=>ai.presets[key][choices[key]]?.join(' / ')).join(' · ')+' — '+selectedCards.map(card=>`${card.name} / ${card.zh} (${card.isReversed?'reversed / 逆位':'upright / 正位'})`).join(', ');
    $('#ai-generate').disabled=Boolean(aiRequest||focusedReading||readingSaved||!window.CELESTIAL_AI_ENDPOINT);
    if(!window.CELESTIAL_AI_ENDPOINT&&!focusedReading) $('#ai-status').textContent=bilingual('AI is not connected yet. Your offline reading is ready.','AI 尚未连接。离线解读已就绪。');
    else if(focusedReading) $('#ai-status').textContent=bilingual('AI reflection · based on presets, not your private question.','AI 反思解读 · 根据选项生成，不使用私人问题。');
    else if(readingSaved) $('#ai-status').textContent=bilingual('Saved readings stay unchanged. Start a new ritual to use AI.','已保存的解读保持不变。开始新仪式即可使用 AI。');
  }
  async function focusReading(){
    if(aiRequest||focusedReading||readingSaved||selectedCards.length!==3||!readingRevealed)return;
    if(!$('#ai-consent').checked){$('#ai-status').textContent=bilingual('Please read and accept the consent above first.','请先阅读并同意上方说明。');return;}
    const endpoint=window.CELESTIAL_AI_ENDPOINT;if(!endpoint)return;
    const generation=readingGeneration,controller=new AbortController();aiRequest=controller;
    const choices=Object.fromEntries(Object.keys(ai.presets).map(key=>[key,$(`#ai-${key}`).value]));
    const payload=ai.payload(selectedCards,choices);ai.validateRequest(payload,cards);
    renderFocusedControls();$('#ai-status').textContent=bilingual('Considering the cards…','正在解读卡牌…');
    const timeout=setTimeout(()=>controller.abort(),25000);
    try {
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal});
      if(!response.ok){const failure=await response.json().catch(()=>({}));throw Object.assign(Error('Unavailable'),{code:failure.error,status:response.status});}const result=ai.validateResult(await response.json());
      if(!readingStillCurrent(generation)||readingSaved)return;
      focusedReading=result;focusedChoices=choices;renderMeanings();
    } catch(error) {
      const messages={quota:['The shared service is busy. Wait one minute before trying again.','服务暂时繁忙，请等待一分钟后重试。'],credentials:['The AI service key was rejected. The site owner needs to update it.','AI 服务密钥被拒绝，请网站维护者更新密钥。'],unconfigured:['The AI service is not configured yet.','AI 服务尚未配置完成。'],region:['Free AI is unavailable in your region.','你所在地区暂不提供此免费 AI 服务。']};
      const message=messages[error.code]||(error.status===429?['Google’s free AI quota is currently unavailable. Try again later.','Google 免费 AI 额度暂不可用，请稍后重试。']:error.code?.startsWith('provider')?['Google rejected the AI request. Please try later or contact the site owner.','Google 拒绝了 AI 请求，请稍后重试或联系网站维护者。']:['AI could not complete this reading. Please try again later.','AI 未能完成本次解读，请稍后重试。']);
      if(readingStillCurrent(generation))$('#ai-status').textContent=bilingual(...message)+' '+bilingual('Your offline reading is still available.','离线解读仍可使用。');
    } finally {clearTimeout(timeout);if(aiRequest===controller){aiRequest=null;$('#ai-generate').disabled=Boolean(focusedReading||readingSaved||!endpoint);}}
  }
  $('#ai-generate').addEventListener('click',focusReading);
  let gestureGeneration = 0;
  let gesturePinchState = logic.freshPinchState();
  let gestureFrozenReadingGeneration = 0;
  let gestureFrozenCameraGeneration = 0;
  let activeSavedSession = null;
  const diagnosticEvents=[];
  let diagnosticLastInferenceAt=0;
  let diagnosticInferenceMs=0;
  let diagnosticLastMetricAt=0;
  let firstInferenceResolve=null;
  let gestureInferenceFailures=0;
  let gestureInferenceRetryAt=0;

  function recordDiagnostic(type,data={}){
    const safe={};for(const [key,value] of Object.entries(data))if(typeof value==='number'&&Number.isFinite(value))safe[key]=Math.round(value*1000)/1000;else if(typeof value==='boolean'||typeof value==='string')safe[key]=value;
    diagnosticEvents.push({at:new Date().toISOString(),type,...safe});if(diagnosticEvents.length>80)diagnosticEvents.shift();
  }
  function diagnosticSnapshot(){
    const config=logic.pinchConfig(Number($('#gesture-sensitivity')?.value||55)),preferences=sound?.preferences||loadAudioPreferences();
    return {schema:'celestial-diagnostics-v1',createdAt:new Date().toISOString(),build:'hand-ritual-20261025',audio:{contextState:sound?.ctx?.state||(!sound?.allowed?'locked':'unavailable'),musicEnabled:preferences.musicEnabled,sfxEnabled:preferences.sfxEnabled,musicGain:preferences.musicVolume/100,sfxGain:preferences.sfxVolume/100,masterGain:.85},gesture:{cameraActive:Boolean(gestureStream),mode:gestureMode,inferenceCadenceMs:diagnosticInferenceMs,inferenceFailures:gestureInferenceFailures,sensitivity:Number($('#gesture-sensitivity')?.value||55),closeThreshold:config.close,openThreshold:config.open,stableMs:config.stableMs,continuityMs:config.continuityMs,cooldownMs:config.cooldownMs},events:diagnosticEvents.slice()};
  }
  function refreshDiagnostics(){const preview=$('#diagnostic-preview');if(preview)preview.textContent=JSON.stringify(diagnosticSnapshot(),null,2);}
  function exportDiagnostics(){const blob=new Blob([JSON.stringify(diagnosticSnapshot(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=`celestial-archive-diagnostics-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);sound.cue('confirm');}

  function loadAudioPreferences(){try{return logic.audioPreferences(JSON.parse(localStorage.getItem(preferenceKey)||'{}'));}catch{return logic.audioPreferences();}}
  function persistAudioPreferences(value){try{localStorage.setItem(preferenceKey,JSON.stringify(value));}catch{}}

  class SoundEngine {
    constructor(){this.ctx=null;this.allowed=false;this.master=null;this.sfxBus=null;this.resumePromise=null;this.preferences=loadAudioPreferences();this.track=new Audio('assets/audio/enchanted-valley.mp3');this.track.loop=true;this.track.preload='auto';this.track.addEventListener('pause',()=>this.updateState());this.track.addEventListener('play',()=>this.updateState());}
    get music(){return this.preferences.musicEnabled;} set music(value){this.setPreferences({musicEnabled:Boolean(value)});}
    get sfx(){return this.preferences.sfxEnabled;} set sfx(value){this.setPreferences({sfxEnabled:Boolean(value)});}
    setPreferences(patch){this.preferences=logic.audioPreferences({...this.preferences,...patch});persistAudioPreferences(this.preferences);this.applyGains();this.syncControls();this.syncMusic();}
    syncControls(){const p=this.preferences,music=$('#music-setting'),sfx=$('#sfx-setting'),musicVolume=$('#music-volume'),sfxVolume=$('#sfx-volume');if(music)music.checked=p.musicEnabled;if(sfx)sfx.checked=p.sfxEnabled;if(musicVolume)musicVolume.value=String(p.musicVolume);if(sfxVolume)sfxVolume.value=String(p.sfxVolume);if($('#music-volume-value'))$('#music-volume-value').textContent=`${p.musicVolume}%`;if($('#sfx-volume-value'))$('#sfx-volume-value').textContent=`${p.sfxVolume}%`;if($('#sound-toggle'))$('#sound-toggle').textContent=p.musicEnabled||p.sfxEnabled?'♫':'∅';}
    applyGains(){this.track.volume=this.preferences.musicVolume/100;if(this.ctx)this.sfxBus.gain.setTargetAtTime(this.preferences.sfxEnabled?this.preferences.sfxVolume/100:0,this.ctx.currentTime,.012);}
    updateState(){const running=this.allowed&&(this.preferences.musicEnabled?!this.track.paused:this.ctx?.state==='running'),state=!this.allowed?'locked':running?'running':'suspended',node=$('#audio-state');if(node){node.dataset.state=state;node.textContent=state==='running'?'SOUND RUNNING · 声音运行中':state==='suspended'?'TAP ANY CONTROL TO RESUME · 点击任意控件恢复声音':'SOUND LOCKED UNTIL ENTER · 声音将在进入后开启';}recordDiagnostic('audio-state',{state,musicGain:this.preferences.musicVolume/100,sfxGain:this.preferences.sfxVolume/100});}
    async unlock(){this.allowed=true;await this.syncMusic();return this.ensureAudioRunning();}
    async syncMusic(){if(!this.allowed||!this.preferences.musicEnabled||document.visibilityState!=='visible'){this.track.pause();this.updateState();return false;}try{await this.track.play();this.updateState();return true;}catch{this.updateState();return false;}}
    async ensureAudioRunning(){
      if(!this.allowed)return false;if(this.resumePromise)return this.resumePromise;
      this.resumePromise=(async()=>{try{if(!this.ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC){this.updateState();return false;}this.ctx=new AC();this.sfxBus=this.ctx.createGain();const compressor=this.ctx.createDynamicsCompressor();this.master=this.ctx.createGain();compressor.threshold.value=-18;compressor.knee.value=18;compressor.ratio.value=6;compressor.attack.value=.003;compressor.release.value=.25;this.master.gain.value=.85;this.sfxBus.connect(compressor);compressor.connect(this.master);this.master.connect(this.ctx.destination);this.ctx.addEventListener('statechange',()=>this.updateState());this.applyGains();}if(this.ctx.state!=='running')await this.ctx.resume();await this.syncMusic();this.updateState();return this.ctx.state==='running';}catch{this.updateState();return false;}finally{this.resumePromise=null;}})();return this.resumePromise;
    }
    async tone(freq=440,duration=.14,type="sine",gain=.12,delay=0){
      if(!this.preferences.sfxEnabled||!await this.ensureAudioRunning())return;
      const now=this.ctx.currentTime+delay,osc=this.ctx.createOscillator(),amp=this.ctx.createGain(),filter=this.ctx.createBiquadFilter();
      osc.type=type;osc.frequency.setValueAtTime(freq,now);filter.type="lowpass";filter.frequency.value=2200;amp.gain.setValueAtTime(.0001,now);amp.gain.exponentialRampToValueAtTime(gain,now+.018);amp.gain.exponentialRampToValueAtTime(.0001,now+duration);
      osc.connect(filter);filter.connect(amp);amp.connect(this.sfxBus);osc.start(now);osc.stop(now+duration+.04);
    }
    async cue(kind="tap"){
      if(!this.preferences.sfxEnabled||!await this.ensureAudioRunning())return;
      const root={gateway:196,ritual:220,arcana:247,chamber:174,grimoire:262}[activeRoute]||220;
      if(kind==="flip"){this.tone(root*2,.35,"triangle",.13);this.tone(root*3,.45,"sine",.07,.08);}
      else if(kind==="save"){[1,1.25,1.5,2].forEach((n,i)=>this.tone(root*n,.25,"triangle",.08,i*.1));}
      else if(kind==="dissolve"){[1.5,1.2,1,.75].forEach((n,i)=>this.tone(root*n,.18,"sine",.06,i*.08));}
      else if(kind==="shuffle"){for(let i=0;i<7;i++)this.tone(110+Math.random()*70,.06,"square",.025,i*.035);}
      else if(kind==="select")this.tone(root*1.5,.13,"triangle",.09);
      else if(kind==="route"){this.tone(root,.25,"sine",.08);this.tone(root*1.5,.38,"triangle",.06,.07);}
      else if(kind==="confirm"){this.tone(root*2,.16,"sine",.09);this.tone(root*2.5,.2,"sine",.06,.08);}
      else this.tone(root*2.2,.055,"sine",.035);
    }
  }
  const sound = new SoundEngine();

  function bilingual(en,zh){return language==="en"?en:language==="zh"?zh:`${en}\n${zh}`;}
  function capitalizeFirst(value){return String(value).replace(/^(\s*)([a-z])/,(_,space,letter)=>space+letter.toUpperCase());}
  function titleCase(value){return String(value).replace(/\b[a-z]/g,letter=>letter.toUpperCase());}
  function bilingualMarkup(en,zh){if(language==='en')return `<span lang="en">${escapeHtml(en)}</span>`;if(language==='zh')return `<span lang="zh">${escapeHtml(zh)}</span>`;return `<span class="bilingual-lines"><span lang="en">${escapeHtml(en)}</span><span lang="zh">${escapeHtml(zh)}</span></span>`;}
  function applyBilingualNode(node,en,zh){node.classList.toggle('bilingual-lines',language==='bilingual');if(language==='bilingual')node.innerHTML=`<span lang="en">${escapeHtml(en)}</span><span lang="zh">${escapeHtml(zh)}</span>`;else node.textContent=language==='en'?en:zh;}
  function applyLanguage(next){
    language=next;document.documentElement.dataset.language=next;
    $$('[data-i18n]').forEach(node=>{const pair=translations[node.dataset.i18n];if(pair)applyBilingualNode(node,pair[0],pair[1]);});
    $$('[data-i18n-placeholder]').forEach(node=>{const pair=translations[node.dataset.i18nPlaceholder];if(pair)node.placeholder=bilingual(pair[0],pair[1]);});
    $$('.segmented [data-language]').forEach(button=>button.classList.toggle('is-active',button.dataset.language===next));
    renderArcana();renderChapters();renderSessions();if(readingRevealed&&selectedCards.length===3)renderMeanings();
  }

  function showToast(message){clearTimeout(toastTimer);const toast=$('#toast');toast.textContent=message;toast.classList.add('is-visible');toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),2400);}
  function setOfflineState(state,message,progress=0){const status=$('#offline-status'),fill=$('#offline-progress-fill');if(!status||!fill)return;status.dataset.state=state;status.textContent=message;fill.style.width=`${Math.max(0,Math.min(100,progress))}%`;}
  function offlineWorker(){return navigator.serviceWorker?.controller||swRegistration?.active||swRegistration?.waiting;}
  function requestOfflineStatus(){offlineWorker()?.postMessage({type:'PACK_STATUS'});}
  function prepareOfflinePack(pack){const worker=offlineWorker();if(!worker){setOfflineState('error',bilingual('Offline preparation needs the installed release. Reload once, then try again.','离线准备需要已安装的发布版本。请刷新一次后重试。'));return;}const button=$(pack==='core'?'#prepare-core':'#prepare-gesture');button.disabled=true;setOfflineState('preparing',bilingual(`Preparing ${pack==='core'?'Core':'Gesture'}…`,`正在准备${pack==='core'?'核心包':'手势包'}……`),1);worker.postMessage({type:'PREPARE_PACK',pack});}
  function handleServiceWorkerMessage(event){const data=event.data||{};if(data.type==='RELEASE_ID'){document.documentElement.dataset.workerRelease=data.releaseId;if(pageReleaseId&&data.releaseId!==pageReleaseId)setOfflineState('update',bilingual('Page and offline worker are from different releases. Close other Archive tabs, then reload.','页面与离线服务版本不一致。请关闭其他秘典标签页后刷新。'));return;}if(data.type==='PACK_PROGRESS'){const percent=data.total?Math.round(data.complete/data.total*100):0;setOfflineState('preparing',bilingual(`Preparing ${data.pack==='core'?'Core':'Gesture'} · ${percent}%`,`正在准备${data.pack==='core'?'核心包':'手势包'} · ${percent}%`),percent);}else if(data.type==='PACK_READY'){const button=$(data.pack==='core'?'#prepare-core':'#prepare-gesture');if(button)button.disabled=false;setOfflineState('ready',bilingual(`${data.pack==='core'?'Core':'Gesture'} is ready offline.`,`${data.pack==='core'?'核心包':'手势包'}已可离线使用。`),100);sound.cue('confirm');}else if(data.type==='PACK_STATUS'){const core=data.core?'Core ready':'Core not prepared',gesture=data.gesture?'Gesture ready':'Gesture optional';setOfflineState(data.core?'ready':'idle',bilingual(`${core} · ${gesture}`,`${data.core?'核心包已就绪':'核心包尚未准备'} · ${data.gesture?'手势包已就绪':'手势包可选'}`),data.core?100:0);}else if(data.type==='PACK_ERROR'){const button=$(data.pack==='core'?'#prepare-core':'#prepare-gesture');if(button)button.disabled=false;setOfflineState('error',bilingual('Preparation paused. Check the connection and retry.','准备已暂停。请检查网络后重试。'));}}
  async function registerServiceWorker(){if(!('serviceWorker' in navigator)||location.protocol==='file:'){setOfflineState('error',bilingual('Offline installation is unavailable in this browser context.','当前浏览器环境不支持离线安装。'));return;}try{navigator.serviceWorker.addEventListener('message',handleServiceWorkerMessage);try{pageReleaseId=(await fetch('./asset-manifest.json',{cache:'no-store'}).then(response=>response.ok?response.json():null))?.releaseId||null;}catch{}swRegistration=await navigator.serviceWorker.register('./sw.js');if(swRegistration.waiting)setOfflineState('update',bilingual('A new release is ready. Close other Archive tabs, then reload.','新版本已就绪。请关闭其他秘典标签页后刷新。'));swRegistration.addEventListener('updatefound',()=>swRegistration.installing?.addEventListener('statechange',()=>{if(swRegistration.installing?.state==='installed'&&navigator.serviceWorker.controller)setOfflineState('update',bilingual('A new release is ready. Close other Archive tabs, then reload.','新版本已就绪。请关闭其他秘典标签页后刷新。'));}));await navigator.serviceWorker.ready;offlineWorker()?.postMessage({type:'RELEASE_ID'});requestOfflineStatus();}catch{setOfflineState('error',bilingual('The offline worker could not start. Manual drawing still works online.','离线服务无法启动；在线手动抽牌仍可使用。'));}}
  async function installApp(){if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('#install-app').hidden=true;}

  const sceneSelector = [
    '.entry-copy > *','.gallery-art','.topbar > .brand','.primary-nav > button','.top-actions > *','.gateway-heading > *','.gateway-card','.gateway-foot',
    '.page-heading > *','.question-panel','.ritual-stage-rail','.draw-panel > .ritual-instruction','.deck-selector','.deck-position','.reveal-button',
    '.meaning-head > *','.meaning-card','.synthesis','.reading-detail','.report-options','.report-actions',
    '.filter-row .chip','.arcana-item','.proof-limit','.gallery-arrow','.session-card','.gallery-index > *',
    '.chapter-nav > .eyebrow','.chapter-nav > h2','.chapter-button','.chapter-page > *',
    '.drawer-head > *','.settings-panel section','.drawer-note','.review-intro','.review-filters','.review-item','.review-footer',
    '.dialog-card','.dialog-copy > *','.camera-shell','.hand-stage > .eyebrow','.hand-stage > h3','.hand-stage > p','.gesture-actions'
  ].join(',');
  const sceneAnimations=new WeakMap();
  function revealScene(root,startIndex=0){
    if(!root)return;
    const candidates=root.matches?.(sceneSelector)?[root]:[];
    candidates.push(...$$(sceneSelector,root));
    const nodes=[...new Set(candidates)].filter(node=>!node.hidden&&!node.closest('[hidden]'));
    const motion=document.documentElement.dataset.motion!=='off'&&document.documentElement.dataset.input!=='keyboard'&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
    nodes.forEach((node,index)=>{
      sceneAnimations.get(node)?.cancel();
      node.classList.add('scene-element','is-scene-visible');
      if(!motion)return;
      const animation=node.animate([{opacity:0,translate:'0 24px'},{opacity:1,translate:'0 0'}],{duration:600,delay:Math.min(startIndex+index,8)*55,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
      sceneAnimations.set(node,animation);
    });
  }

  function navigate(route,source){
    if(route===activeRoute)return;
    if(gestureStream)stopGestureCamera();
    sound.cue('route');
    const outgoing=$(`[data-view="${activeRoute}"]`),incoming=$(`[data-view="${route}"]`);if(!incoming)return;
    if(outgoing){outgoing.classList.remove('is-active');outgoing.setAttribute('inert','');outgoing.setAttribute('aria-hidden','true');}
    incoming.classList.add('is-active');incoming.removeAttribute('inert');incoming.setAttribute('aria-hidden','false');incoming.scrollTop=0;activeRoute=route;revealScene(incoming);
    $$('.primary-nav [data-route]').forEach(button=>{if(button.dataset.route===route)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
    closeDrawer('settings');closeDrawer('review');
  }

  function syncViewState(){$$('.view').forEach(view=>{const active=view.dataset.view===activeRoute;view.classList.toggle('is-active',active);if(active)view.removeAttribute('inert');else view.setAttribute('inert','');view.setAttribute('aria-hidden',active?'false':'true');});}

  function enterArchive(){sound.unlock();$('#entry').classList.add('is-leaving');setTimeout(()=>{$('#entry').hidden=true;$('#app').hidden=false;revealScene($('.topbar'));revealScene($(`[data-view="${activeRoute}"]`),2);},document.documentElement.dataset.input==='keyboard'||document.documentElement.dataset.motion==='off'?0:420);}

  function cardMarkup(card,label=true){const orientation=card.isReversed?bilingual('Reversed','逆位'):bilingual('Upright','正位');return `<div class="tarot-card"><div class="card-side card-back"><img src="${deck.back}" alt="Lunar phase tarot card back"></div><div class="card-side card-face ${card.isReversed?'is-reversed':''}"><img src="${card.src}" alt="${card.name} tarot illustration, ${orientation}">${label?`<span class="card-label">${card.code} · ${bilingual(card.name,card.zh)} · ${orientation}</span>`:''}</div></div>`;}

  function randomIndex(max){
    if(max<1)return 0;const range=0x100000000,limit=range-(range%max),value=new Uint32Array(1);do{crypto.getRandomValues(value);}while(value[0]>=limit);return value[0]%max;
  }
  function secureShuffle(items){const shuffled=[...items];for(let i=shuffled.length-1;i>0;i--){const j=randomIndex(i+1);[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}return shuffled;}
  function randomOrientation(){const value=new Uint8Array(1);crypto.getRandomValues(value);return Boolean(value[0]&1);}
  function sanitizeQuestion(value){const clean=String(value).normalize('NFC').replace(/[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/g,' ').replace(/\s+/g,' ').trim(),segments=typeof Intl.Segmenter==='function'?[...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(clean)].length:[...clean].length;if(segments>280)throw new Error('Question exceeds 280 grapheme clusters');return clean;}
  function setReadingStage(stage){const panel=$('#draw-panel');if(panel)panel.dataset.stage=stage;$$('[data-reading-stage]').forEach(node=>node.classList.toggle('is-active',node.dataset.readingStage===stage));}
  function readingStillCurrent(generation){return generation===readingGeneration;}

  function beginRitual(){
    try{$('#question').value=sanitizeQuestion($('#question').value);}catch{showToast(bilingual('Please shorten the question to 280 characters.','请将问题缩短至 280 个字符以内。'));return;}readingGeneration++;clearFocusedReading();activeSavedSession=null;resetGesturePinch(true);currentDeck=secureShuffle(cards);selectedCards=[];dealsInFlight=0;readingRevealed=false;readingSaved=false;$('#question-panel').hidden=true;$('#draw-panel').hidden=false;$('#meaning-panel').hidden=true;$('#deck-selector').hidden=false;$('.deck-position').hidden=false;$('#reading-slots').innerHTML=Array.from({length:3},()=>'<div class="reading-slot is-empty" aria-hidden="true"></div>').join('');$('#reveal-cards').disabled=true;$('#draw-progress').textContent='0 / 3';setReadingStage('choose');sound.cue('shuffle');
    const fan=$('#deck-fan'),selector=$('#deck-selector');fan.innerHTML='';currentDeck.forEach((baseCard,index)=>{const button=document.createElement('button');button.type='button';button.className='deck-choice';button.style.setProperty('--deck-delay',`${Math.min(index,20)*24}ms`);button.style.setProperty('--entry-rotate',`${((index%7)-3)*1.4}deg`);button.dataset.deckIndex=String(index);button.setAttribute('role','option');button.setAttribute('aria-selected','false');button.setAttribute('aria-label',`Choose hidden card ${index+1} of 78`);deckAssignments.set(button,{...baseCard,isReversed:randomOrientation()});button.addEventListener('click',()=>pickCard(button));fan.append(button);});fan.scrollLeft=0;selector.classList.remove('is-resolving');void selector.offsetWidth;selector.classList.add('is-resolving');setTimeout(()=>selector.classList.remove('is-resolving'),1550);updateDeckPosition();updateGestureSelectionPreview();revealScene($('#draw-panel'));
  }
  function pickCard(button,source='manual'){
    if(selectedCards.length>=3||button.classList.contains('is-picked'))return;
    if(source==='manual')resetGesturePinch(true);
    const assigned=deckAssignments.get(button);if(!assigned)return;const generation=readingGeneration,sourceRect=button.getBoundingClientRect(),card={...assigned};selectedCards.push(card);setReadingStage('draw');sound.cue('select');button.setAttribute('aria-selected','true');
    const slot=$$('#reading-slots .reading-slot')[selectedCards.length-1];slot.className='reading-slot is-awaiting-deal';slot.removeAttribute('aria-hidden');slot.innerHTML=cardMarkup(card);dealsInFlight++;animateCardToSlot(button,slot,sourceRect,generation);updateGestureSelectionPreview();$('#draw-progress').textContent=`${selectedCards.length} / 3`;
    if(selectedCards.length===3)$('#draw-instruction').textContent=bilingual('The cards are settling.','牌正在落位。');
  }
  function scrollDeck(direction){const fan=$('#deck-fan');fan.scrollBy({left:direction*fan.clientWidth*.78,behavior:document.documentElement.dataset.motion==='off'?'auto':'smooth'});sound.cue('select');}
  function nearestDeckChoice(){const fan=$('#deck-fan'),choices=$$('.deck-choice:not(.is-picked)',fan);if(!choices.length)return null;const center=fan.getBoundingClientRect().left+fan.clientWidth/2;let nearest=choices[0],distance=Infinity;for(const choice of choices){const rect=choice.getBoundingClientRect(),next=Math.abs(rect.left+rect.width/2-center);if(next<distance){nearest=choice;distance=next;}}return nearest;}
  function updateGestureCandidate(choice=nearestDeckChoice()){
    $$('.deck-choice.is-gesture-candidate').forEach(node=>node.classList.remove('is-gesture-candidate'));
    $$('.deck-choice.is-candidate-arriving').forEach(node=>{node.classList.remove('is-candidate-arriving');node.removeAttribute('data-arrival');});
    gestureCandidate=choice||null;if(gesturePinchState.frozenCandidate&&gesturePinchState.frozenCandidate!==choice?.dataset.deckIndex)resetGesturePinch();if(!choice)return;
    choice.classList.add('is-gesture-candidate');
    const index=Number(choice.dataset.deckIndex||0)+1,label=`${String(index).padStart(2,'0')} / 78`,hud=$('#gesture-candidate-card'),shell=$('.camera-shell'),rail=$('#gesture-deck-rail'),counter=$('#gesture-candidate-index'),previous=gestureCandidateIndex;
    counter.textContent=label;hud.setAttribute('aria-label',`Draw highlighted hidden card ${index} of 78`);hud.classList.toggle('is-locking',gestureZone===1&&gestureFrames>0);
    if(previous>=0&&previous!==index){
      const direction=index>previous?'right':'left';
      shell.dataset.cardShift=direction;
      choice.dataset.arrival=direction;hud.classList.remove('is-changing');rail.classList.remove('is-shifting');counter.classList.remove('is-updating');
      void hud.offsetWidth;
      hud.classList.add('is-changing');rail.classList.add('is-shifting');choice.classList.add('is-candidate-arriving');counter.classList.add('is-updating');
      clearTimeout(gestureBrowseAnimationTimer);
      gestureBrowseAnimationTimer=setTimeout(()=>{hud.classList.remove('is-changing');rail.classList.remove('is-shifting');choice.classList.remove('is-candidate-arriving');choice.removeAttribute('data-arrival');counter.classList.remove('is-updating');},440);
    }
    gestureCandidateIndex=index;
  }
  function updateGestureSelectionPreview(){$('#gesture-draw-count').textContent=`${selectedCards.length} / 3`;$$('#gesture-picked-cards i').forEach((node,index)=>{const card=selectedCards[index];node.classList.toggle('is-filled',Boolean(card));node.textContent=card?'':String(index+1).padStart(2,'0');node.style.backgroundImage=card?`url("${card.src}")`:'';node.style.rotate=card?.isReversed?'180deg':'';if(card){const orientation=card.isReversed?'Reversed · 逆位':'Upright · 正位',zh=card.zh||card.zhName||'';node.setAttribute('aria-label',`${card.name} · ${zh}, ${orientation}`);node.title=`${card.name} · ${zh} · ${orientation}`;}else{node.setAttribute('aria-label',`Selected card slot ${index+1}, empty`);node.removeAttribute('title');}});updateGestureCandidate();}
  function updateDeckPosition(){const fan=$('#deck-fan'),nearest=nearestDeckChoice();if(!nearest)return;const index=Number(nearest.dataset.deckIndex||0);$('#deck-visible-index').textContent=String(index+1).padStart(2,'0');$('#deck-scroll-prev').disabled=fan.scrollLeft<8;$('#deck-scroll-next').disabled=fan.scrollLeft+fan.clientWidth>=fan.scrollWidth-8;updateGestureCandidate(nearest);}
  function updateRevealReadiness(){if(selectedCards.length===3&&dealsInFlight===0){$('#reveal-cards').disabled=false;$('#draw-instruction').textContent=bilingual('The cards are ready.','牌已准备好。');setReadingStage('reveal');}else if(dealsInFlight===0)setReadingStage('choose');}
  function animateCardToSlot(button,slot,sourceRect,generation){
    if(document.documentElement.dataset.motion==="off"){button.classList.add('is-picked');slot.classList.remove('is-awaiting-deal');slot.classList.add('is-dealt');dealsInFlight--;updateRevealReadiness();return;}
    const target=slot.getBoundingClientRect(),clone=document.createElement('div');clone.className='deal-clone';Object.assign(clone.style,{left:`${sourceRect.left}px`,top:`${sourceRect.top}px`,width:`${sourceRect.width}px`,height:`${sourceRect.height}px`,rotate:getComputedStyle(button).getPropertyValue('--r')||'0deg'});document.body.append(clone);button.classList.add('is-picked');
    requestAnimationFrame(()=>requestAnimationFrame(()=>Object.assign(clone.style,{left:`${target.left}px`,top:`${target.top}px`,width:`${target.width}px`,height:`${target.height}px`,rotate:'0deg',scale:'1.015'})));
    setTimeout(()=>{if(!readingStillCurrent(generation)){clone.remove();return;}clone.classList.add('is-settling');slot.classList.remove('is-awaiting-deal');slot.classList.add('is-dealt');dealsInFlight--;updateRevealReadiness();sound.cue('select');setTimeout(()=>clone.remove(),180);},820);
  }
  function revealReading(){
    if(selectedCards.length!==3||readingRevealed)return;
    readingRevealed=true;setReadingStage('reveal');
    if(document.documentElement.dataset.motion==="off"){
      $$('#reading-slots .tarot-card').forEach(card=>card.classList.add('is-flipped'));
      sound.cue('flip');showMeaningPanel();return;
    }
    runRevealCinema();
  }
  function showMeaningPanel(){setReadingStage('meaning');renderMeanings();$('#meaning-panel').hidden=false;revealScene($('#meaning-panel'));$('#meaning-panel').scrollIntoView({behavior:document.documentElement.dataset.motion==='off'?'auto':'smooth',block:'start'});}
  function runRevealCinema(){
    const generation=readingGeneration,cinema=$('#reveal-cinema'),container=$('#cinema-cards'),later=(delay,callback)=>setTimeout(()=>readingStillCurrent(generation)&&callback(),delay);
    $('#reveal-cards').disabled=true;cinema.classList.remove('is-active','is-flipping','is-completing');
    container.innerHTML=selectedCards.map((card,index)=>`<div class="cinema-card" style="--i:${index}"><div class="cinema-card-inner"><img class="cinema-back" src="${deck.back}" alt=""><img class="cinema-face" src="${card.src}" alt="${card.name}" style="${card.isReversed?'transform:rotateY(180deg) rotate(180deg)':'transform:rotateY(180deg)'}"></div></div>`).join('');
    cinema.hidden=false;cinema.setAttribute('aria-hidden','false');requestAnimationFrame(()=>requestAnimationFrame(()=>readingStillCurrent(generation)&&cinema.classList.add('is-active')));animateRevealParticles(generation);
    later(1450,()=>{cinema.classList.add('is-flipping');$$('#reading-slots .tarot-card').forEach((card,index)=>later(index*180,()=>{card.classList.add('is-flipped');sound.cue('flip');}));});
    later(3700,()=>cinema.classList.add('is-completing'));
    later(3820,()=>cinema.classList.remove('is-active'));
    later(4480,()=>{cinema.hidden=true;cinema.setAttribute('aria-hidden','true');cinema.classList.remove('is-flipping','is-completing');container.innerHTML='';showMeaningPanel();});
  }
  function animateRevealParticles(generation){
    const canvas=$('#reveal-particle-canvas'),ctx=canvas.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx.scale(dpr,dpr);
    const sparks=Array.from({length:150},()=>({x:w/2+(Math.random()-.5)*w*.16,y:h*.72+(Math.random()-.5)*40,vx:(Math.random()-.5)*3.4,vy:-1-Math.random()*5,r:.5+Math.random()*2.6,a:.3+Math.random()*.7,life:70+Math.random()*90}));
    const start=performance.now();
    function frame(now){if(!readingStillCurrent(generation)){ctx.clearRect(0,0,w,h);return;}ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='lighter';for(const p of sparks){p.x+=p.vx;p.y+=p.vy;p.vy+=.016;p.life-=1;p.a*=.989;ctx.beginPath();ctx.fillStyle=`rgba(${Math.random()>.28?'218,178,95':'255,244,208'},${p.a})`;ctx.shadowBlur=14;ctx.shadowColor='#d5b470';ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}if(now-start<4400)requestAnimationFrame(frame);else ctx.clearRect(0,0,w,h);}requestAnimationFrame(frame);
  }
  function renderMeanings(){
    renderFocusedControls();
    const roles=[["Situation","现状"],["Challenge","挑战"],["Guidance","指引"]];
    $('#meaning-grid').innerHTML=selectedCards.map((card,index)=>{const orientationEn=card.isReversed?'Reversed':'Upright',orientationZh=card.isReversed?'逆位':'正位',text=logic.cardText(card,card.isReversed,['situation','challenge','guidance'][index]);return `<section class="meaning-card"><header class="meaning-card-head"><span class="meaning-card-number">0${index+1}</span><p class="meaning-card-position">${bilingualMarkup(`${roles[index][0]} · ${orientationEn}`,`${roles[index][1]} · ${orientationZh}`)}</p><h4 class="meaning-card-name">${bilingualMarkup(titleCase(card.name),card.zh)}</h4><p class="meaning-card-keywords">${bilingualMarkup(capitalizeFirst(text.keywords.en),text.keywords.zh)}</p></header><section class="meaning-core"><h5>${bilingualMarkup('Core Meaning','核心含义')}</h5><p>${bilingualMarkup(text.core.en,text.core.zh)}</p></section><div class="meaning-depth"><section class="meaning-depth-item"><h5>${bilingualMarkup('Tension To Notice','需要留意的张力')}</h5><p>${bilingualMarkup(text.tension.en,text.tension.zh)}</p></section><section class="meaning-depth-item"><h5>${bilingualMarkup('Reflection Prompt','反思提示')}</h5><p>${bilingualMarkup(text.reflection.en,text.reflection.zh)}</p></section></div></section>`}).join('');
    const {movementEn,movementZh,synthesisEn,synthesisZh}=readingCopy(selectedCards);applyBilingualNode($('#synthesis-copy'),synthesisEn,synthesisZh);
    const action=logic.cardText(selectedCards[2],selectedCards[2].isReversed,'guidance').action;$('#reading-details').innerHTML=`<section class="reading-detail"><span>01</span><div><h4>${bilingualMarkup('How The Spread Moves','牌阵如何流动')}</h4><p>${bilingualMarkup(capitalizeFirst(movementEn),movementZh)}</p></div></section><section class="reading-detail"><span>02</span><div><h4>${bilingualMarkup('A Grounded Next Step','一个可落实的下一步')}</h4><p>${bilingualMarkup(action.en,action.zh)}</p></div></section><section class="reading-detail"><span>03</span><div><h4>${bilingualMarkup('Keep The Reading Honest','让解读保持诚实')}</h4><p>${bilingualMarkup('Treat resonance as a prompt, not proof. Compare the symbols with observable facts, your values, and the consequences of acting.','把共鸣视为提示，而非证据。请将象征与可观察的事实、你的价值观及行动后果相互对照。')}</p></div></section>`;
  }
  function resetReading(withDissolve=true){
    const generation=++readingGeneration;clearFocusedReading();
    if(withDissolve&&readingRevealed&&!readingSaved){const layer=$('#dissolve-layer');layer.classList.add('is-active');sound.cue('dissolve');setTimeout(()=>layer.classList.remove('is-active'),950);}
    setTimeout(()=>{if(!readingStillCurrent(generation))return;$('#question-panel').hidden=false;$('#draw-panel').hidden=true;$('#meaning-panel').hidden=true;$('#question').value='';selectedCards=[];readingRevealed=false;readingSaved=false;revealScene($('#question-panel'));},withDissolve?520:0);
  }
  function restartDrawingSession(){
    const generation=++readingGeneration;clearFocusedReading();
    if(gestureStream)stopGestureCamera();
    const surface=!$('#meaning-panel').hidden?$('#meaning-panel'):$('#draw-panel');
    if(surface.classList.contains('is-restarting'))return;
    surface.classList.add('is-restarting');$$('.deal-clone,.gesture-draw-clone').forEach(node=>node.remove());sound.cue('dissolve');
    setTimeout(()=>{if(!readingStillCurrent(generation))return;surface.classList.remove('is-restarting');beginRitual();$('#draw-panel').scrollIntoView({behavior:document.documentElement.dataset.motion==='off'?'auto':'smooth',block:'start'});showToast(bilingual('The deck has been reshuffled.','牌组已重新洗牌。'));},380);
  }
  function saveReading(){
    if(saveInFlight)return;if(readingSaved){const existing=sessions.find(session=>session.cards.every((card,index)=>card.id===selectedCards[index]?.id&&logic.isReversed(card)===logic.isReversed(selectedCards[index])))||sessions[galleryIndex];if(existing){saveInFlight=true;newSessionId=existing.id;sound.cue('save');runSaveTransition(existing);}else showToast(bilingual('This reading is already saved.','此解读已保存。'));return;}
    const now=new Date(),session={id:crypto.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}`,title:bilingual(`${selectedCards[0].name} · ${selectedCards[2].name}`,`${selectedCards[0].zh} · ${selectedCards[2].zh}`),date:new Intl.DateTimeFormat('en',{day:'2-digit',month:'short',year:'numeric'}).format(now).toUpperCase(),snapshotVersion:2,readingCreatedAt:now.toISOString(),capturedLanguage:language,meaningEdition:deck.meaningEdition,cards:selectedCards.map(card=>structuredClone(card)),question:$('#save-question').checked?$('#question').value.trim():''};session.snapshot=createReadingSnapshot(session);Object.assign(session,session.snapshot);
    try{saveInFlight=true;sessions.unshift(session);persistSessions();readingSaved=true;renderFocusedControls();activeSavedSession=session;newSessionId=session.id;sound.cue('save');runSaveTransition(session);}
    catch(error){saveInFlight=false;sessions=loadSessions();showToast(bilingual('Local storage is unavailable; the reading was not saved.','本地存储不可用；此解读未被保存。'));}
  }
  function runSaveTransition(session){
    const overlay=$('#save-transition'),report=$('#save-report-sheet'),panel=$('#meaning-panel'),panelRect=panel&&!panel.hidden?panel.getBoundingClientRect():null,source=panelRect?.width?panelRect:{left:innerWidth*.12,top:innerHeight*.14,width:innerWidth*.76,height:innerHeight*.68},target=$('#chamber-shortcut')?.getBoundingClientRect()||{left:innerWidth-72,top:32,width:44,height:44},targetX=target.left+target.width/2,targetY=target.top+target.height/2,motion=document.documentElement.dataset.motion!=='off'&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
    overlay.className='save-transition';overlay.style.setProperty('--target-x',`${targetX}px`);overlay.style.setProperty('--target-y',`${targetY}px`);report.style.left=`${source.left}px`;report.style.top=`${source.top}px`;report.style.width=`${Math.min(source.width,innerWidth-24)}px`;report.style.height=`${Math.min(source.height,innerHeight-24)}px`;$('#save-report-cards').innerHTML=session.cards.map(card=>`<img src="${card.src}" alt="">`).join('');$('#app').classList.add('is-saving');overlay.classList.add('is-active');
    const arrive=()=>{navigate('chamber',$('#chamber-shortcut'));renderSessions();galleryIndex=Math.max(0,sessions.findIndex(item=>item.id===newSessionId));selectSession(galleryIndex,false);const arrived=$$('.session-card').find(card=>sessions[Number(card.dataset.session)]?.id===newSessionId);arrived?.classList.add('is-new');setTimeout(()=>{newSessionId='';arrived?.classList.remove('is-new');},1500);overlay.className='save-transition';$('#app').classList.remove('is-saving');saveInFlight=false;showToast(bilingual('The framed reading arrived in the Reading Chamber.','装裱后的解读已送达占卜室。'));};
    if(!motion){overlay.classList.add('is-contracting','is-folding');setTimeout(arrive,520);return;}
    requestAnimationFrame(()=>requestAnimationFrame(()=>overlay.classList.add('is-contracting')));setTimeout(()=>overlay.classList.add('is-folding'),760);setTimeout(()=>{overlay.classList.add('is-flying');animateSaveTrail(innerWidth/2,innerHeight*.51,targetX,targetY,1350);},1320);setTimeout(arrive,2780);
  }
  function animateSaveTrail(startX,startY,targetX,targetY,duration){
    const canvas=$('#save-trail-canvas'),ctx=canvas.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;ctx.scale(dpr,dpr);const particles=[],start=performance.now();
    function frame(now){const progress=Math.min(1,(now-start)/duration),eased=1-Math.pow(1-progress,3),x=startX+(targetX-startX)*eased,y=startY+(targetY-startY)*eased-Math.sin(progress*Math.PI)*innerHeight*.16;for(let i=0;i<4;i++)particles.push({x:x+(Math.random()-.5)*26,y:y+(Math.random()-.5)*20,vx:-1.5-Math.random()*2.5,vy:(Math.random()-.5)*2,life:28+Math.random()*32,paper:Math.random()>.62,size:2+Math.random()*6,rotate:Math.random()*Math.PI});ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.025;p.life--;p.rotate+=.05;const alpha=Math.max(0,p.life/60);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rotate);ctx.fillStyle=p.paper?`rgba(238,232,218,${alpha})`:`rgba(213,180,112,${alpha})`;ctx.shadowBlur=p.paper?4:12;ctx.shadowColor='#d5b470';if(p.paper)ctx.fillRect(-p.size,-p.size*.65,p.size*2,p.size*1.3);else{ctx.beginPath();ctx.arc(0,0,p.size*.45,0,Math.PI*2);ctx.fill();}ctx.restore();}for(let i=particles.length-1;i>=0;i--)if(particles[i].life<=0)particles.splice(i,1);if(progress<1||particles.length)requestAnimationFrame(frame);else ctx.clearRect(0,0,innerWidth,innerHeight);}requestAnimationFrame(frame);
  }
  function readingCopy(readingCards){
    const result=logic.synthesizeReading(readingCards);if(focusedReading){result.en=focusedReading.en;result.zh=focusedReading.zh;}return {movementEn:result.movement.en,movementZh:result.movement.zh,synthesisEn:result.en,synthesisZh:result.zh,relation:result.relation,action:result.action};
  }
  function createReadingSnapshot(sourceSession=null){
    const savedSource=sourceSession||activeSavedSession,sourceCards=savedSource?.cards||selectedCards;if(sourceCards.length!==3)return null;return logic.createReadingSnapshot({snapshot:savedSource?.snapshot,cards:sourceCards,language:savedSource?.capturedLanguage||language,question:String(savedSource?savedSource.question||'':$('#question').value||'').trim(),readingCreatedAt:savedSource?.readingCreatedAt||new Date().toISOString(),meaningEdition:savedSource?.meaningEdition||deck.meaningEdition,focusedReading:savedSource?.snapshot?.focusedReading||(!savedSource?.snapshot?focusedReading:null),focusedChoices:savedSource?.snapshot?savedSource.snapshot.focusedChoices:focusedChoices,legacy:savedSource?.legacy,legacyLabel:savedSource?.legacyLabel});
  }
  function localizedText(snapshot,en,zh){return snapshot.language==='en'?en:snapshot.language==='zh'?zh:`${en}\n${zh}`;}
  function snapshotSynthesis(snapshot){return (snapshot.focusedReading?'AI reflection / AI 反思解读\n':'')+localizedText(snapshot,snapshot.synthesis.en,snapshot.synthesis.zh);}
  function snapshotPlainText(snapshot){
    const roles=[['Situation','现状'],['Challenge','挑战'],['Guidance','指引']],question=snapshot.includeQuestion&&snapshot.question?`QUESTION / 问题\n${snapshot.question}\n\n`:'';
    return (snapshot.legacyLabel?`${snapshot.legacyLabel}\n\n`:'')+question+snapshot.cards.map((card,index)=>{const text=logic.cardText(card,logic.isReversed(card),['situation','challenge','guidance'][index]);return `${roles[index][0]} / ${roles[index][1]}\n${card.name} / ${card.zh} · ${logic.isReversed(card)?'Reversed / 逆位':'Upright / 正位'}\nKeywords / 关键词: ${text.keywords.en} / ${text.keywords.zh}\nCore Meaning / 核心含义: ${text.core.en} / ${text.core.zh}\nTension / 张力: ${text.tension.en} / ${text.tension.zh}\nReflection Prompt / 反思提示: ${text.reflection.en} / ${text.reflection.zh}\nGrounded Action / 落实行动: ${text.action.en} / ${text.action.zh}`;}).join('\n\n')+`\n\nSynthesis / 综合解读\n${snapshotSynthesis(snapshot)}`;
  }
  async function copyExportSnapshot(snapshot){if(!snapshot)return;try{await navigator.clipboard.writeText(snapshotPlainText(snapshot));sound.cue('confirm');showToast(bilingual('Report text copied.','报告文字已复制。'));}catch{showToast(bilingual('Clipboard access is unavailable. The two image links remain ready.','无法使用剪贴板；两张图像链接仍可使用。'));}}
  function setExportPhase(phase){$$('[data-export-phase]',$('#export-dialog')).forEach(node=>node.hidden=node.dataset.exportPhase!==phase);$('#export-dialog').dataset.phase=phase;}
  function releaseExportUrls(){exportUrls.forEach(url=>URL.revokeObjectURL(url));exportUrls=[];for(const id of ['#export-page-one','#export-page-two']){$(id).removeAttribute('href');}}
  function closeExportDialog(){const dialog=$('#export-dialog');if(dialog.open)dialog.close();else cleanupExportDialog();}
  function cleanupExportDialog(){exportGeneration++;releaseExportUrls();finishExportTransition();const target=exportInitiator;exportInitiator=null;setTimeout(()=>target?.isConnected&&target.focus(),0);}
  function exportReading(sourceSession=null,initiator=null){
    if(exportInFlight)return;const snapshot=createReadingSnapshot(sourceSession);if(!snapshot){showToast(bilingual('Complete a three-card reading before exporting.','请先完成三张牌的解读再导出。'));return;}releaseExportUrls();exportSnapshot=snapshot;exportInitiator=initiator||document.activeElement;$('#export-dialog-question').checked=false;$('#export-question-error').hidden=true;exportInFlight=true;const generation=++exportGeneration,overlay=$('#export-transition'),motion=document.documentElement.dataset.motion!=='off'&&!matchMedia('(prefers-reduced-motion: reduce)').matches;overlay.className='export-transition is-active is-opening is-stamped';$('#app').classList.add('is-exporting');sound.cue('save');setTimeout(()=>{if(generation!==exportGeneration)return;finishExportTransition();setExportPhase('options');const dialog=$('#export-dialog');dialog.showModal();requestAnimationFrame(()=>$('#export-generate').focus());},motion?1100:80);
  }
  function beginExportTransition(){const overlay=$('#export-transition');overlay.className='export-transition is-active is-rendering';$('#app').classList.add('is-exporting');sound.cue('save');}
  function finishExportTransition(){const overlay=$('#export-transition');overlay.className='export-transition';$('#app').classList.remove('is-exporting');exportInFlight=false;const button=$('#export-reading');if(button)button.disabled=false;}
  async function generateExport(){
    if(!exportSnapshot||exportInFlight)return;const includeQuestion=$('#export-dialog-question').checked,questionCount=graphemes(exportSnapshot.question).length,error=$('#export-question-error');
    if(includeQuestion&&questionCount>240){error.textContent=bilingual('The question is longer than 240 characters. Shorten it in the reading, or export without the question.','问题超过 240 个字符。请在解读中缩短问题，或取消包含问题后导出。');error.hidden=false;return;}
    error.hidden=true;releaseExportUrls();exportInFlight=true;const generation=++exportGeneration,snapshot=Object.freeze({...exportSnapshot,includeQuestion,exportedAt:new Date().toISOString()});setExportPhase('rendering');beginExportTransition();
    try{
      $('#export-progress-copy').textContent=bilingual('Loading local card art and export type…','正在加载本地牌面与导出字体……');await waitForExportFonts();validateExportRegistryCapacity();const images=await withTimeout(Promise.all(snapshot.cards.map(card=>loadImage(card.src))),10000,'Card artwork took too long to load.');if(generation!==exportGeneration)return;
      $('#export-progress-copy').textContent=bilingual('Composing Cover + Synthesis…','正在生成封面与综合解读……');let pageOne=renderExportCover(snapshot,images),firstBlob;try{firstBlob=await withTimeout(canvasToPngBlob(pageOne),12000,'Page 1 PNG encoding timed out.');}finally{releaseCanvas(pageOne);pageOne=null;}if(generation!==exportGeneration)return;
      $('#export-progress-copy').textContent=bilingual('Composing Detailed Meanings…','正在生成卡牌映射……');let pageTwo=renderExportDetails(snapshot,images),secondBlob;try{secondBlob=await withTimeout(canvasToPngBlob(pageTwo),12000,'Page 2 PNG encoding timed out.');}finally{releaseCanvas(pageTwo);pageTwo=null;}if(generation!==exportGeneration)return;
      runExportTransition(snapshot,[firstBlob,secondBlob],generation);
    }catch(errorValue){if(generation===exportGeneration)runExportFailureTransition(errorValue);}
  }
  function createExportCanvas(height=1800){const canvas=document.createElement('canvas');canvas.width=3200;canvas.height=height;const ctx=canvas.getContext('2d');ctx.scale(2,2);return {canvas,ctx};}
  function releaseCanvas(canvas){if(canvas){canvas.width=0;canvas.height=0;}}
  function drawExportBackground(ctx,height=900){const bg=ctx.createRadialGradient(1090,390,80,820,430,Math.max(900,height));bg.addColorStop(0,'#292928');bg.addColorStop(.45,'#101111');bg.addColorStop(1,'#030404');ctx.fillStyle=bg;ctx.fillRect(0,0,1600,height);ctx.fillStyle='rgba(238,232,218,.045)';ctx.fillRect(1035,492,565,Math.max(270,height-630));ctx.strokeStyle='rgba(213,180,112,.2)';ctx.strokeRect(18,18,1564,height-36);}
  function renderExportCover(snapshot,images){
    const {canvas,ctx}=createExportCanvas();drawExportBackground(ctx);ctx.fillStyle='rgba(238,232,218,.025)';ctx.fillRect(0,75,94,675);ctx.save();ctx.globalAlpha=.08;ctx.filter='blur(8px)';ctx.fillStyle='#eee8da';ctx.font='420px Georgia,serif';ctx.fillText('A',-80,520);ctx.font='350px Georgia,serif';ctx.fillText('R',360,880);ctx.restore();ctx.strokeStyle='rgba(238,232,218,.12)';ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(310,455,145+i*64,-1.1,2.1);ctx.stroke();}
    ctx.save();ctx.translate(35,728);ctx.rotate(-Math.PI/2);ctx.fillStyle='#d2d0ca';ctx.font='16px JetBrains,monospace';ctx.fillText('A PRIVATE READING FROM THE CELESTIAL ARCHIVE · LOCAL EXPORT',0,0);ctx.restore();drawExportBrand(ctx);images.forEach((img,index)=>{ctx.save();ctx.translate(320+index*155,430+Math.abs(index-1)*42);ctx.rotate((index-1)*.13+(logic.isReversed(snapshot.cards[index])?Math.PI:0));ctx.shadowColor='rgba(0,0,0,.8)';ctx.shadowBlur=32;ctx.drawImage(img,-100,-150,200,300);ctx.restore();});
    ctx.fillStyle='#f0ede7';ctx.font='94px Georgia,serif';ctx.fillText('THE READING',870,230);ctx.font='72px Georgia,serif';ctx.fillText('BETWEEN WORLDS',872,305);ctx.fillStyle='#d7d2c7';ctx.font='52px CelestialCJK,sans-serif';ctx.fillText('牌阵的回声',875,370);ctx.fillStyle='#d5b470';ctx.beginPath();ctx.arc(868,425,10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#eee8da';ctx.font='17px JetBrains,monospace';ctx.fillText(snapshot.readingCreatedAt?formatExportDate(snapshot.readingCreatedAt):'READING DATE UNKNOWN · LEGACY',895,431);if(!snapshot.readingCreatedAt){ctx.fillStyle='#d5b470';ctx.font='15px CelestialCJK,sans-serif';ctx.fillText('解读日期未知 · 旧版记录',895,455);}ctx.strokeStyle='rgba(238,232,218,.35)';ctx.beginPath();ctx.moveTo(1130,425);ctx.lineTo(1535,425);ctx.stroke();ctx.fillStyle='#eee8da';ctx.font='700 17px JetBrains,monospace';snapshot.cards.forEach((card,index)=>ctx.fillText(`${String(index+1).padStart(2,'0')}  ${card.name.toUpperCase()}  ·  ${logic.isReversed(card)?'REVERSED':'UPRIGHT'}`,875,500+index*40));
    ctx.fillStyle='#d5b470';ctx.font='700 22px JetBrains,monospace';ctx.fillText('SYNTHESIS / 综合解读',875,632);ctx.strokeStyle='rgba(213,180,112,.72)';ctx.beginPath();ctx.moveTo(875,652);ctx.lineTo(1535,652);ctx.stroke();drawFittedText(ctx,snapshotSynthesis(snapshot),{x:879,y:660,width:652,height:205,maxSize:20,minSize:15,lineHeight:1.35,family:'Georgia,serif',color:'#eee8da',shadow:true});
    drawGrain(ctx,1600,900);return canvas;
  }
  function renderExportDetails(snapshot,images){
    const {canvas,ctx}=createExportCanvas(2400),question=Boolean(snapshot.includeQuestion&&snapshot.question);drawExportBackground(ctx,1200);drawExportBrand(ctx);ctx.fillStyle='#f0ede7';ctx.font='700 56px Georgia,serif';ctx.fillText('THE DRAWN ARCHIVE',70,88);ctx.fillStyle='#d5b470';ctx.font='700 27px CelestialCJK,sans-serif';ctx.fillText('卡牌映射',70,124);ctx.strokeStyle='rgba(213,180,112,.7)';ctx.beginPath();ctx.moveTo(475,108);ctx.lineTo(1530,108);ctx.stroke();
    if(question){ctx.fillStyle='#d5b470';ctx.font='700 13px JetBrains,monospace';ctx.fillText('QUESTION / 问题',70,151);drawFittedText(ctx,snapshot.question,{x:220,y:137,width:1310,height:50,maxSize:15,minSize:12,lineHeight:1.3,family:'JetBrains,monospace',color:'#eee8da',shadow:true});}
    const top=question?240:160,height=question?816:896,rects=[70,567,1064].map(x=>({x,y:top,width:466,height}));snapshot.cards.forEach((card,index)=>drawMeaningColumn(ctx,snapshot,card,index,rects[index],images[index]));
    if(snapshot.legacy){ctx.fillStyle='rgba(213,180,112,.07)';ctx.fillRect(70,1064,1460,48);drawLocalizedLabel(ctx,snapshot,'LEGACY SAVED LANGUAGE · DETAILS USE CURRENT MEANING EDITION','旧版保存语言 · 详解采用当前牌义版本',84,1081,13);}
    ctx.strokeStyle='rgba(213,180,112,.45)';ctx.beginPath();ctx.moveTo(70,1120);ctx.lineTo(1530,1120);ctx.stroke();ctx.fillStyle='#c8c3b8';ctx.font='11px JetBrains,monospace';if(snapshot.language!=='zh')ctx.fillText('For reflection—not prediction or medical, legal, or financial advice.',70,1142);if(snapshot.language!=='en'){ctx.font='11px CelestialCJK,sans-serif';ctx.fillStyle='#d5b470';ctx.fillText('仅供反思，不构成预测或医疗、法律、财务建议。',70,snapshot.language==='bilingual'?1161:1142);}drawGrain(ctx,1600,1200);return canvas;
  }
  function drawMeaningColumn(ctx,snapshot,card,index,rect,image){
    const roles=[['SITUATION','现状'],['CHALLENGE','挑战'],['GUIDANCE','指引']],{bodySize,layout,labelHeight,sectionGap}=fitMeaningLayout(ctx,snapshot,card,rect);
    ctx.save();ctx.fillStyle='rgba(238,232,218,.035)';ctx.fillRect(rect.x,rect.y,rect.width,rect.height);ctx.strokeStyle='rgba(213,180,112,.42)';ctx.strokeRect(rect.x,rect.y,rect.width,rect.height);drawLocalizedLabel(ctx,snapshot,`${String(index+1).padStart(2,'0')} · ${roles[index][0]}`,`${String(index+1).padStart(2,'0')} · ${roles[index][1]}`,rect.x+18,rect.y+21,14);ctx.save();ctx.translate(rect.x+390,rect.y+82);if(logic.isReversed(card))ctx.rotate(Math.PI);ctx.shadowColor='rgba(0,0,0,.85)';ctx.shadowBlur=18;ctx.drawImage(image,-44,-66,88,132);ctx.restore();
    ctx.fillStyle='#f7f3e9';let nameSize=29;while(nameSize>27){ctx.font=`700 ${nameSize}px Georgia,serif`;if(ctx.measureText(titleCase(card.name)).width<=290)break;nameSize--;}ctx.font=`700 ${nameSize}px Georgia,serif`;if(ctx.measureText(titleCase(card.name)).width>290)throw new Error(`${card.name} cannot fit at the approved 27 px minimum.`);ctx.fillText(titleCase(card.name),rect.x+18,rect.y+64);ctx.fillStyle='#d5b470';ctx.font='700 17px CelestialCJK,sans-serif';ctx.fillText(card.zh,rect.x+18,rect.y+91);drawLocalizedLabel(ctx,snapshot,logic.isReversed(card)?'REVERSED':'UPRIGHT',logic.isReversed(card)?'逆位':'正位',rect.x+18,rect.y+111,14);ctx.strokeStyle='rgba(213,180,112,.42)';ctx.beginPath();ctx.moveTo(rect.x+18,rect.y+145);ctx.lineTo(rect.x+448,rect.y+145);ctx.stroke();
    let y=rect.y+171;for(const row of layout){drawLocalizedLabel(ctx,snapshot,row.labelEn,row.labelZh,rect.x+18,y,16);ctx.strokeStyle='rgba(213,180,112,.25)';ctx.beginPath();ctx.moveTo(rect.x+245,y-4);ctx.lineTo(rect.x+448,y-4);ctx.stroke();y+=labelHeight;ctx.fillStyle='#f7f3e9';ctx.font=`${bodySize}px JetBrains,monospace`;applyTextShadow(ctx);drawTextLines(ctx,row.lines,rect.x+18,y,bodySize*1.5);clearTextShadow(ctx);y+=row.lines.length*bodySize*1.5+sectionGap;}ctx.restore();
  }
  function meaningBlocks(snapshot,card){const text=logic.cardText(card,logic.isReversed(card),'guidance');return [{labelEn:'KEYWORDS',labelZh:'关键词',text:localizedText(snapshot,text.keywords.en,text.keywords.zh)},{labelEn:'CORE MEANING',labelZh:'核心含义',text:localizedText(snapshot,text.core.en,text.core.zh)},{labelEn:'TENSION TO NOTICE',labelZh:'需要留意的张力',text:localizedText(snapshot,text.tension.en,text.tension.zh)},{labelEn:'REFLECTION PROMPT',labelZh:'反思提示',text:localizedText(snapshot,text.reflection.en,text.reflection.zh)},{labelEn:'GROUNDED ACTION',labelZh:'落实行动',text:localizedText(snapshot,text.action.en,text.action.zh)}];}
  function fitMeaningLayout(ctx,snapshot,card,rect){const blocks=meaningBlocks(snapshot,card),labelHeight=snapshot.language==='bilingual'?34:20,sectionGap=14;for(let bodySize=18;bodySize>=13;bodySize--){ctx.font=`${bodySize}px JetBrains,monospace`;let used=0;const layout=blocks.map(block=>{const lines=wrapCanvasText(ctx,block.text,rect.width-36),height=labelHeight+lines.length*bodySize*1.5+sectionGap;used+=height;return {...block,lines,height};});if(used<=rect.height-180)return {bodySize,layout,labelHeight,sectionGap};}throw new Error(`${card.name} details do not fit the approved Page 2 column.`);}
  function validateExportRegistryCapacity(){if(validateExportRegistryCapacity.ready)return;const ctx=document.createElement('canvas').getContext('2d'),rect={x:70,y:240,width:466,height:816};for(const mode of ['bilingual','en','zh'])for(const base of cards)for(const reversed of [false,true])fitMeaningLayout(ctx,{language:mode},{...base,isReversed:reversed},rect);validateExportRegistryCapacity.ready=true;}
  function drawExportBrand(ctx){ctx.fillStyle='#eee8da';ctx.font='700 18px JetBrains,monospace';ctx.fillText('THE CELESTIAL ARCHIVE',1320,58);ctx.font='13px JetBrains,monospace';ctx.fillStyle='#b89555';ctx.fillText('天 穹 秘 典',1420,84);}
  function drawLocalizedLabel(ctx,snapshot,en,zh,x,y,lineHeight=14){ctx.fillStyle='#d5b470';if(snapshot.language!=='zh'){ctx.font=`700 ${Math.max(11,lineHeight)}px JetBrains,monospace`;ctx.fillText(en,x,y);}if(snapshot.language!=='en'){ctx.font=`700 ${Math.max(11,lineHeight)}px CelestialCJK,sans-serif`;ctx.fillText(zh,x,snapshot.language==='bilingual'?y+lineHeight:y);}}
  function formatExportDate(value){return new Intl.DateTimeFormat('en',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(value)).toUpperCase();}
  function graphemes(value){return typeof Intl.Segmenter==='function'?[...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(String(value))].map(item=>item.segment):[...String(value)];}
  function wrapCanvasText(ctx,text,maxWidth){
    const lines=[];for(const paragraph of String(text).split('\n')){const tokens=paragraph.match(/[\p{Script=Han}]|[^\s\p{Script=Han}]+|\s+/gu)||[];let line='';for(const token of tokens){if(ctx.measureText(token).width>maxWidth){for(const part of graphemes(token)){const test=line+part;if(ctx.measureText(test).width>maxWidth&&line.trim()){lines.push(line.trim());line=part;}else line=test;}continue;}const test=line+token;if(ctx.measureText(test).width>maxWidth&&line.trim()){lines.push(line.trim());line=token.trimStart();}else line=test;}if(line.trim())lines.push(line.trim());else if(!paragraph)lines.push('');}return lines;
  }
  function drawTextLines(ctx,lines,x,y,lineHeight){lines.forEach((line,index)=>ctx.fillText(line,x,y+index*lineHeight));}
  function applyTextShadow(ctx){ctx.shadowColor='rgba(0,0,0,.82)';ctx.shadowBlur=3;ctx.shadowOffsetY=2;}
  function clearTextShadow(ctx){ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;}
  function drawFittedText(ctx,text,rect){for(let size=rect.maxSize;size>=rect.minSize;size--){ctx.font=`${size}px ${rect.family}`;const lines=wrapCanvasText(ctx,text,rect.width),lineHeight=size*rect.lineHeight;if(lines.length*lineHeight<=rect.height){ctx.fillStyle=rect.color;if(rect.shadow)applyTextShadow(ctx);drawTextLines(ctx,lines,rect.x,rect.y+size,lineHeight);clearTextShadow(ctx);return {size,lines};}}throw new Error('Export text does not fit its approved layout. Copy the report text or shorten the source copy.');}
  function waitForExportFonts(){return withTimeout(Promise.all([document.fonts.load('16px JetBrains'),document.fonts.load('16px CelestialCJK')]).then(()=>{if(!document.fonts.check('16px JetBrains')||!document.fonts.check('16px CelestialCJK'))throw new Error('A required local export font is unavailable.');}),5000,'Export fonts took too long to load.');}
  function withTimeout(promise,delay,message){return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error(message)),delay);Promise.resolve(promise).then(value=>{clearTimeout(timer);resolve(value);},error=>{clearTimeout(timer);reject(error);});});}
  function canvasToPngBlob(canvas){return new Promise((resolve,reject)=>{try{canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('PNG encoder returned no data.')),'image/png');}catch(error){reject(error);}});}
  function runExportTransition(snapshot,blobs,generation){
    const overlay=$('#export-transition'),motion=document.documentElement.dataset.motion!=='off'&&!matchMedia('(prefers-reduced-motion: reduce)').matches,finish=()=>{if(generation!==exportGeneration)return;finishExportTransition();exportUrls=blobs.map(blob=>URL.createObjectURL(blob));const stamp=new Date(snapshot.exportedAt).toISOString().slice(0,10),links=[$('#export-page-one'),$('#export-page-two')];links.forEach((link,index)=>{link.href=exportUrls[index];link.download=`celestial-archive-reading-${stamp}-page-${String(index+1).padStart(2,'0')}.png`;});setExportPhase('ready');links[0].focus();showToast(bilingual('Both gold-sealed report pages are ready.','两页金色月印报告均已就绪。'));};overlay.classList.remove('is-rendering');if(!motion){overlay.classList.add('is-stamped','is-folding');setTimeout(finish,720);return;}setTimeout(()=>{overlay.classList.add('is-stamped');sound.cue('confirm');},520);setTimeout(()=>overlay.classList.add('is-folding'),1180);setTimeout(finish,2780);
  }
  function runExportFailureTransition(error){const overlay=$('#export-transition');overlay.classList.remove('is-rendering');overlay.classList.add('is-stamped','is-error');sound.cue('dissolve');setTimeout(()=>{finishExportTransition();$('#export-error-copy').textContent=location.protocol==='file:'?bilingual('Export needs the localhost app. Start it with npm run start, then try again.','导出需要 localhost 应用。请运行 npm run start 后重试。'):bilingual(error?.message||'The export failed.','导出失败。');setExportPhase('error');$('#export-retry').focus();},720);}
  function drawGrain(ctx,width,height){const grain=document.createElement('canvas');grain.width=480;grain.height=270;const g=grain.getContext('2d'),data=g.createImageData(grain.width,grain.height);for(let i=0;i<data.data.length;i+=4){const n=Math.random()*255;data.data[i]=n;data.data[i+1]=n;data.data[i+2]=n;data.data[i+3]=Math.random()*52;}g.putImageData(data,0,0);ctx.save();ctx.globalAlpha=.21;ctx.globalCompositeOperation='screen';ctx.imageSmoothingEnabled=false;ctx.drawImage(grain,0,0,width,height);ctx.globalAlpha=.13;ctx.strokeStyle='#eee8da';for(let i=0;i<95;i++){const y=Math.random()*height,x=Math.random()*width,length=12+Math.random()*170;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(Math.min(width,x+length),y+(Math.random()-.5)*2);ctx.stroke();}ctx.restore();}
  function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;});}
  async function copyReading(){
    const snapshot={...createReadingSnapshot(),includeQuestion:$('#copy-question').checked};try{await navigator.clipboard.writeText(snapshotPlainText(snapshot));sound.cue('confirm');showToast(bilingual('Meaning copied.','解读已复制。'));}catch{showToast(bilingual('Clipboard access needs a local server.','剪贴板功能需要本地服务器.'));}
  }

  function renderArcana(){
    const query=($('#card-search')?.value||'').toLowerCase(),filter=$('.filter-row .chip.is-active')?.dataset.filter||'all';$('#arcana-grid').innerHTML=cards.map(card=>{const visible=(filter==='all'||card.group===filter)&&`${card.id} ${card.name} ${card.zh} ${card.keywords.en} ${card.keywords.zh} ${card.motif}`.toLowerCase().includes(query);return `<button class="arcana-item" type="button" data-card="${card.id}" ${visible?'':'hidden'}><img src="${card.src}" alt="${card.name} tarot card illustration" loading="lazy"><b>${bilingualMarkup(card.name,card.zh)}</b><small><span>${card.code}</span>${bilingualMarkup(card.keywords.en,card.keywords.zh)}</small></button>`;}).join('');$$('.arcana-item').forEach(item=>item.addEventListener('click',()=>openCard(cards.find(card=>card.id===item.dataset.card))));
  }
  function openCard(card){
    const dialog=$('#card-dialog'),upright=logic.cardText(card,false,'situation'),reversed=logic.cardText(card,true,'challenge');$('#dialog-card').innerHTML=cardMarkup({...card,reversed:false});$('#dialog-copy').innerHTML=`<p class="eyebrow">${card.id} · ${deck.meaningEdition}</p><h2>${bilingualMarkup(card.name,card.zh)}</h2><p class="dialog-keywords">${bilingualMarkup(card.keywords.en,card.keywords.zh)}</p><p>${bilingualMarkup(upright.core.en,upright.core.zh)}</p><div class="dialog-meaning-depth"><b>${bilingualMarkup('Reversed','逆位')}</b><p>${bilingualMarkup(reversed.core.en,reversed.core.zh)}</p><b>${bilingualMarkup('Reflection','反思')}</b><p>${bilingualMarkup(upright.reflection.en,upright.reflection.zh)}</p><b>${bilingualMarkup('Practice','行动')}</b><p>${bilingualMarkup(upright.action.en,upright.action.zh)}</p></div>`;dialog.showModal();revealScene(dialog);sound.cue('select');setTimeout(()=>{$('#dialog-card .tarot-card')?.classList.add('is-flipped');sound.cue('flip');},700);
  }

  function renderSessions(){
    $('#gallery-total').textContent=String(sessions.length).padStart(2,'0');
    if(!sessions.length){$('#session-gallery').innerHTML=`<article class="session-empty"><div><p class="eyebrow">NOTHING KEPT · 尚未保存</p><h3>${bilingualMarkup('The chamber is quiet.','占卜室仍很安静。')}</h3><p>${bilingualMarkup('Complete a reading and choose Save when you want to return to it. Exporting or copying never saves a chamber entry.','完成解读后，只有主动选择保存才会在此留下记录。导出或复制不会自动保存。')}</p></div></article>`;$('#gallery-current').textContent='00';return;}
    galleryIndex=Math.min(galleryIndex,sessions.length-1);$('#session-gallery').innerHTML=sessions.map((session,index)=>`<article class="session-card ${index===galleryIndex?'is-selected':''}" data-session="${index}"><div class="session-cards">${session.cards.map(card=>`<img src="${card.src}" alt="${card.name}, ${logic.isReversed(card)?'reversed':'upright'}">`).join('')}</div><div class="session-copy"><span class="session-date">${session.date}</span><h3>${escapeHtml(session.title)}</h3>${session.legacyLabel?`<small>${escapeHtml(session.legacyLabel)}</small>`:''}<p class="session-summary-label">${bilingualMarkup('Synthesis','综合解读')}</p><p class="session-summary" tabindex="0" role="region" aria-label="Reading summary · 解读摘要">${escapeHtml(localizedText(session,session.synthesis.en,session.synthesis.zh))}</p><div class="question-actions"><button class="button ghost" type="button" data-open-session="${index}">${bilingualMarkup('Open reading','打开解读')}</button><button class="button ghost" type="button" data-export-session="${index}">${bilingualMarkup('Export image','导出图片')}</button><button class="button ghost" type="button" data-delete-session="${index}">${bilingualMarkup('Delete','删除')}</button></div></div></article>`).join('');$$('.session-card').forEach(card=>card.addEventListener('click',()=>selectSession(Number(card.dataset.session))));$$('[data-open-session]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();openSavedSession(Number(button.dataset.openSession));}));$$('[data-export-session]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();exportReading(sessions[Number(button.dataset.exportSession)],button);}));$$('[data-delete-session]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();deleteSavedSession(Number(button.dataset.deleteSession));}));selectSession(galleryIndex,false);
  }
  function selectSession(index,scroll=true){if(!sessions.length){galleryIndex=0;$('#gallery-current').textContent='00';return;}galleryIndex=(index+sessions.length)%sessions.length;$$('.session-card').forEach((card,i)=>card.classList.toggle('is-selected',i===galleryIndex));$('#gallery-current').textContent=String(galleryIndex+1).padStart(2,'0');if(scroll)$$('.session-card')[galleryIndex]?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});sound.cue('select');}
  function openSavedSession(index){const session=sessions[index];if(!session)return;readingGeneration++;clearFocusedReading();focusedReading=session.snapshot?.focusedReading||null;focusedChoices=session.snapshot?.focusedChoices||null;activeSavedSession=session;selectedCards=session.cards.map(card=>({...card}));readingRevealed=true;readingSaved=true;$('#question').value=session.question||'';$('#question-panel').hidden=true;$('#draw-panel').hidden=false;$('#deck-selector').hidden=true;$('.deck-position').hidden=true;$('#reading-slots').innerHTML=selectedCards.map(card=>`<div class="reading-slot is-dealt">${cardMarkup(card)}</div>`).join('');$$('#reading-slots .tarot-card').forEach(card=>card.classList.add('is-flipped'));$('#deck-fan').innerHTML='';$('#draw-instruction').textContent=bilingual('Saved reading','已保存的解读');$('#draw-progress').textContent='3 / 3';$('#reveal-cards').disabled=true;navigate('ritual',$('.brand'));showMeaningPanel();}
  function deleteSavedSession(index){const session=sessions[index];if(!session||!confirm(bilingual(`Delete “${session.title}”?`,`删除“${session.title}”？`)))return;sessions.splice(index,1);persistSessions();galleryIndex=Math.max(0,Math.min(galleryIndex,sessions.length-1));renderSessions();sound.cue('dissolve');showToast(bilingual('Saved reading deleted.','已删除保存的解读。'));}

  function renderChapters(){
    const active=Number($('#chapter-list .is-active')?.dataset.chapter||0);$('#chapter-list').innerHTML=chapters.map((chapter,index)=>`<button class="chapter-button ${index===active?'is-active':''}" type="button" data-chapter="${index}"><span>0${index+1}</span>${bilingualMarkup(chapter.title,chapter.zh)}</button>`).join('');$$('.chapter-button').forEach(button=>button.addEventListener('click',()=>showChapter(Number(button.dataset.chapter))));showChapter(active,false);
  }
  function showChapter(index,withSound=true){$$('.chapter-button').forEach((button,i)=>button.classList.toggle('is-active',i===index));const chapter=chapters[index];$('#chapter-page').innerHTML=`<p class="eyebrow">CHAPTER 0${index+1} · ${chapter.zh}</p><h3>${bilingualMarkup(chapter.title,chapter.zh)}</h3><p>${chapter.copy}</p><blockquote>${chapter.quote}</blockquote><p class="eyebrow">MYSTERY TAROT · THE CELESTIAL ARCHIVE</p>`;if(withSound){sound.cue('select');revealScene($('#chapter-page'));}}

  function openDrawer(name){const panel=$(`#${name}-panel`);if(!panel)return;panel.classList.add('is-open');panel.removeAttribute('inert');panel.setAttribute('aria-hidden','false');revealScene(panel);sound.cue('select');}
  function closeDrawer(name){const panel=$(`#${name}-panel`);if(!panel)return;panel.classList.remove('is-open');panel.setAttribute('inert','');panel.setAttribute('aria-hidden','true');}
  function renderReview(){
    const visible=reviewItems.filter(item=>reviewFilter==='all'||item.status===reviewFilter);$('#review-list').innerHTML=visible.map(item=>`<article class="review-item" data-review-id="${item.id}" data-status="${item.status}"><div class="review-meta"><span>${item.id} · ${item.category}</span><span>${item.status}</span></div><h3>${item.title}</h3><p>${item.description}</p><div class="review-actions"><button type="button" data-decision="approved" class="${item.status==='approved'?'selected':''}">Approve</button><button type="button" data-decision="revise" class="${item.status==='revise'?'selected':''}">Revise</button></div><input class="review-note" value="${escapeHtml(item.note)}" placeholder="Optional revision note" aria-label="Review note for ${item.title}"></article>`).join('');$$('.review-item').forEach(node=>{const item=reviewItems.find(candidate=>candidate.id===node.dataset.reviewId);$$('[data-decision]',node).forEach(button=>button.addEventListener('click',()=>{item.status=button.dataset.decision;item.note=$('.review-note',node).value;renderReview();sound.cue('confirm');}));$('.review-note',node).addEventListener('change',event=>item.note=event.target.value);});updateReviewCount();
  }
  function updateReviewCount(){const decided=reviewItems.filter(item=>item.status!=="pending").length;$('#review-count').textContent=`${decided}/${reviewItems.length}`;}
  function exportDecisions(){const payload={manifest:"R1.0",project:"The Celestial Archive · 天穹秘典",proofApproved:true,proofApprovedAt:"2026-07-18T01:16:10Z",approvedFor:"remaining_72_card_generation",productionAuthorized:false,nextGate:"complete_78_card_catalog_and_back_user_approval",exportedAt:new Date().toISOString(),items:reviewItems};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='celestial-archive-r1-review-decisions.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),3000);sound.cue('confirm');showToast('Approved baseline exported.');}
  function escapeHtml(value){return String(value).replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));}

  function revealEntry(){const entry=$('#entry');entry.classList.remove('is-arriving');void entry.offsetWidth;entry.classList.add('is-arriving');entry.dataset.arrival='playing';setTimeout(()=>{entry.classList.remove('is-arriving');entry.dataset.arrival='complete';},2900);}
  function finishOpening(){const opening=$('#opening-sequence');if(!opening||opening.hidden)return;revealEntry();requestAnimationFrame(()=>opening.classList.add('is-ending'));setTimeout(()=>{opening.hidden=true;opening.setAttribute('aria-hidden','true');},620);}
  function runOpeningSequence(){
    const opening=$('#opening-sequence');if(!opening)return;
    const enabled=localStorage.getItem('celestial-opening')!=="off";$('#opening-setting').checked=enabled;
    if(!enabled||matchMedia('(prefers-reduced-motion: reduce)').matches){opening.hidden=true;opening.setAttribute('aria-hidden','true');requestAnimationFrame(revealEntry);return;}
    const canvas=$('#opening-particle-canvas'),ctx=canvas.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx.scale(dpr,dpr);
    const particles=Array.from({length:130},(_,index)=>{const angle=Math.random()*Math.PI*2,r=35+Math.random()*Math.min(w,h)*.34;return{x:w/2+Math.cos(angle)*r,y:h/2+Math.sin(angle)*r,angle,r,speed:.0015+Math.random()*.003,size:.4+Math.random()*2,a:.15+Math.random()*.7,trail:index%5===0};});
    const start=performance.now();function frame(now){ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='lighter';const elapsed=now-start;for(const p of particles){p.angle+=p.speed;p.r*=.9987;const x=w/2+Math.cos(p.angle)*p.r,y=h/2+Math.sin(p.angle)*p.r;ctx.beginPath();ctx.fillStyle=`rgba(${p.trail?'245,232,190':'202,169,97'},${p.a*Math.min(1,elapsed/900)})`;ctx.shadowBlur=p.trail?18:7;ctx.shadowColor='#d5b470';ctx.arc(x,y,p.size,0,Math.PI*2);ctx.fill();}if(elapsed<6200&&!opening.classList.contains('is-ending'))requestAnimationFrame(frame);}requestAnimationFrame(frame);setTimeout(finishOpening,6000);
  }

  function resizeClickCanvas(){const canvas=$('#click-particle-canvas'),dpr=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;canvas.style.width=`${innerWidth}px`;canvas.style.height=`${innerHeight}px`;}
  function burstClick(x,y){if(document.documentElement.dataset.motion==="off")return;for(let i=0;i<18;i++){const angle=Math.random()*Math.PI*2,speed=1.3+Math.random()*4.4;clickParticles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-1.2,life:32+Math.random()*25,max:58,r:.8+Math.random()*2.2,gold:Math.random()>.25});}}
  function animateClickParticles(){const canvas=$('#click-particle-canvas'),ctx=canvas.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.scale(dpr,dpr);ctx.globalCompositeOperation='lighter';clickParticles=clickParticles.filter(p=>p.life>0);for(const p of clickParticles){p.x+=p.vx;p.y+=p.vy;p.vx*=.965;p.vy=p.vy*.965+.05;p.life--;const a=Math.max(0,p.life/p.max);ctx.beginPath();ctx.fillStyle=p.gold?`rgba(224,184,99,${a})`:`rgba(255,244,215,${a})`;ctx.shadowBlur=12;ctx.shadowColor='#d5b470';ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}ctx.restore();canvas.dataset.particles=String(clickParticles.length);requestAnimationFrame(animateClickParticles);}

  function setGestureStatus(en,zh){applyBilingualNode($('#gesture-status'),en,zh);}
  function setGestureSensorState(state,enDetail,zhDetail){const badge=$('#gesture-sensor-state'),detail=$('#gesture-sensor-detail'),stage=$('#hand-dialog .hand-stage'),labels={idle:['HAND TRACKING OFF','手势追踪关闭'],requesting:['LOADING HAND MODEL','正在加载手势模型'],camera:['WAITING FOR CAMERA','等待摄像头权限'],live:['HAND TRACKING LIVE','手势追踪运行中'],error:['HAND TRACKING BLOCKED','手势追踪受阻'],unsupported:['HAND TRACKING UNAVAILABLE','手势追踪不可用']};badge.dataset.state=state;stage.dataset.sensorState=state;applyBilingualNode(badge,...(labels[state]||labels.error));applyBilingualNode(detail,enDetail,zhDetail);}
  function setGestureMode(mode,en,zh){if(gestureMode!==mode)recordDiagnostic('gesture-state',{from:gestureMode,to:mode});gestureMode=mode;const shell=$('.camera-shell'),badge=$('#gesture-mode-badge'),pointer=$('#gesture-pointer');shell.dataset.gesture=mode;badge.dataset.mode=mode;badge.innerHTML=`<b>${escapeHtml(en)}</b><small>${escapeHtml(zh)}</small>`;pointer.classList.toggle('is-pinching',mode==='pinch');pointer.classList.toggle('is-pointing',mode==='point');pointer.classList.toggle('is-browsing',mode==='palm');const label=$('#gesture-pointer span');label.textContent=mode==='pinch'?'PINCH · 捏合':mode==='point'?'POINT · 指向':mode==='palm'?'PALM · 手掌':'HAND · 手';}
  function updateGesturePointer(x,y,mode=gestureMode){const pointer=$('#gesture-pointer');if(Number.isFinite(x))pointer.style.left=`${Math.max(.045,Math.min(.955,x))*100}%`;if(Number.isFinite(y))pointer.style.top=`${Math.max(.08,Math.min(.88,y))*100}%`;pointer.classList.toggle('is-holding',mode==='pinch');}
  function gestureCameraError(error){
    const name=error?.name||'CameraError',code=String(error?.message||name);
    if(code==='GESTURE_CAMERA_PERMISSION_TIMEOUT')return['Camera permission did not finish. Allow camera access in your browser, then retry.','摄像头授权尚未完成。请在浏览器中允许摄像头后重试。','error'];
    if(code==='GESTURE_FIRST_FRAME')return['The camera opened but did not deliver a video frame. Close other camera apps and retry.','摄像头已打开，但未传回画面。请关闭其他使用摄像头的应用后重试。','error'];
    if(code==='GESTURE_FIRST_INFERENCE')return['The hand model stopped responding before its first result. Press Retry hand tracking to rebuild it.','手势模型在首次返回结果前停止响应。请按“重试手势追踪”重新加载。','error'];
    if(name==='ModelUnavailableError')return['The local hand model could not start. Press Retry hand tracking to rebuild it.','本地手势模型无法启动。请按“重试手势追踪”重新加载。','error'];
    if(name==='InsecureContextError')return['Camera access requires a secure local page. Reopen the app from its localhost launcher, not a file URL or LAN HTTP address.','摄像头需要安全的本地页面。请从 localhost 启动器重新打开应用，不要使用文件网址或局域网 HTTP 地址。','unsupported'];
    if(name==='PermissionDeniedError'||name==='NotAllowedError')return['Camera access is blocked. Open this page’s site controls, set Camera to Allow, then press Retry hand tracking.','摄像头权限已被阻止。请在此页面的网站设置中将摄像头改为允许，然后按“重试手势追踪”。','error'];
    if(name==='NotFoundError'||name==='DevicesNotFoundError')return['No camera was found on this device. You can still tap the highlighted card or use Simulate selection.','此设备未检测到摄像头。仍可点击高亮牌，或使用模拟选择。','unsupported'];
    if(name==='NotReadableError'||name==='TrackStartError')return['The camera is busy in another app or browser tab. Close the other camera session and retry.','摄像头正被其他应用或浏览器标签使用。请关闭其他摄像头会话后重试。','error'];
    if(name==='SecurityError')return['The browser or page permission policy blocked camera access. Check site Camera permissions and retry.','浏览器或页面权限策略阻止了摄像头。请检查网站摄像头权限后重试。','error'];
    return[`Hand tracking could not start (${code}). Retry, or select cards by tapping the highlighted card.`,`手势追踪无法启动（${name}）。请重试，或点击高亮牌来选择。`,'error'];
  }
  function animateGestureDraw(card,slotIndex){
    const shell=$('.camera-shell'),candidate=$('#gesture-candidate-card'),slot=$$('#gesture-picked-cards i')[slotIndex],motion=document.documentElement.dataset.motion!=='off'&&!matchMedia('(prefers-reduced-motion: reduce)').matches;if(!shell||!candidate||!slot)return;
    slot.classList.remove('is-arriving');if(!motion){slot.classList.add('is-arriving');setTimeout(()=>slot.classList.remove('is-arriving'),20);return;}
    const shellRect=shell.getBoundingClientRect(),source=candidate.getBoundingClientRect(),target=slot.getBoundingClientRect(),clone=document.createElement('div');clone.className='gesture-draw-clone';clone.setAttribute('aria-hidden','true');clone.innerHTML=`<div class="gesture-draw-clone-inner"><div class="gesture-draw-back"></div><div class="gesture-draw-face${card.isReversed?' is-reversed':''}" style="background-image:url(&quot;${card.src}&quot;)"></div></div>`;Object.assign(clone.style,{left:`${source.left-shellRect.left}px`,top:`${source.top-shellRect.top}px`,width:`${source.width}px`,height:`${source.height}px`});shell.append(clone);candidate.classList.add('is-drawing');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{Object.assign(clone.style,{left:`${target.left-shellRect.left}px`,top:`${target.top-shellRect.top}px`,width:`${target.width}px`,height:`${target.height}px`,rotate:card.isReversed?'-8deg':'8deg',scale:'1.04'});clone.classList.add('is-drawing');}));setTimeout(()=>clone.classList.add('is-revealing'),260);setTimeout(()=>{slot.classList.add('is-arriving');clone.classList.add('is-settling');candidate.classList.remove('is-drawing');},690);setTimeout(()=>{clone.remove();slot.classList.remove('is-arriving');},1020);
  }
  function handDistance(a,b){return Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);}
  function handDistance2d(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
  function fingerExtended(landmarks,tip,pip,mcp){const wrist=landmarks[0];return handDistance(landmarks[tip],wrist)>handDistance(landmarks[pip],wrist)*1.13&&handDistance(landmarks[tip],landmarks[mcp])>handDistance(landmarks[pip],landmarks[mcp])*1.32;}
  function resetGesturePinch(armed=gesturePinchState.armed){gesturePinchState=logic.freshPinchState(armed);gestureFrozenReadingGeneration=0;gestureFrozenCameraGeneration=0;$('#gesture-meter-fill').style.width='0';$('#gesture-candidate-card').classList.remove('is-locking');}
  function disposeGestureHands(){const hands=gestureHands;gestureHands=null;gestureInferenceToken=null;firstInferenceResolve=null;if(typeof hands?.close==='function')Promise.resolve().then(()=>hands.close()).catch(()=>{});}
  async function ensureGestureHands(){
    if(gestureHands)return;if(typeof window.Hands!=='function'){const error=new Error('Hand landmark runtime missing');error.name='ModelUnavailableError';throw error;}
    const assetRoot=new URL('assets/vendor/mediapipe-hands/',document.baseURI).href,requiredAssets=['hands.binarypb','hand_landmark_lite.tflite','hands_solution_simd_wasm_bin.js','hands_solution_simd_wasm_bin.wasm','hands_solution_wasm_bin.js','hands_solution_wasm_bin.wasm'];try{await withTimeout(Promise.all(requiredAssets.map(file=>fetch(`${assetRoot}${file}`).then(response=>{if(!response.ok)throw new Error(file);}))),8000,'GESTURE_RUNTIME_ASSET_FETCH');recordDiagnostic('gesture-stage',{code:'GESTURE_RUNTIME_ASSET_FETCH_OK'});}catch(cause){recordDiagnostic('gesture-error',{code:'GESTURE_RUNTIME_ASSET_FETCH'});const error=new Error('GESTURE_RUNTIME_ASSET_FETCH',{cause});error.name='ModelUnavailableError';throw error;}gestureHands=new window.Hands({locateFile:file=>`${assetRoot}${file}`});gestureHands.setOptions({maxNumHands:1,modelComplexity:0,minDetectionConfidence:.60,minTrackingConfidence:.60,selfieMode:false});gestureHands.onResults(handleGestureResults);
    if(typeof gestureHands.initialize==='function')try{await withTimeout(gestureHands.initialize(),30000,'GESTURE_RUNTIME_CONSTRUCTION');recordDiagnostic('gesture-stage',{code:'GESTURE_RUNTIME_CONSTRUCTION_OK'});}catch(cause){disposeGestureHands();recordDiagnostic('gesture-error',{code:'GESTURE_RUNTIME_CONSTRUCTION'});const error=new Error('GESTURE_RUNTIME_CONSTRUCTION',{cause});error.name='ModelUnavailableError';throw error;}
  }
  function handleGestureResults(results){
    const token=gestureInferenceToken;if(!token||token.generation!==gestureGeneration||!gestureStream)return;if(firstInferenceResolve){firstInferenceResolve();firstInferenceResolve=null;recordDiagnostic('gesture-stage',{code:'GESTURE_FIRST_INFERENCE_OK'});}const landmarks=results.multiHandLandmarks?.[0],now=performance.now(),sensitivity=Number($('#gesture-sensitivity').value),candidateId=gestureCandidate?.dataset.deckIndex||null;if(!landmarks){gesturePalmLastX=null;({state:gesturePinchState}=logic.updatePinch(gesturePinchState,{valid:false,now,sensitivity}));resetGesturePinch(gesturePinchState.armed);setGestureMode('seeking','SHOW YOUR HAND','请举起手');setGestureStatus('Show one hand clearly inside the camera frame.','请将一只手清楚地放入摄像头范围。');return;}
    const smoothing=.32+sensitivity/100*.32,palmSize=Math.max(.0001,handDistance2d(landmarks[0],landmarks[9])),pinchRatio=handDistance2d(landmarks[4],landmarks[8])/palmSize,indexOpen=fingerExtended(landmarks,8,6,5),middleOpen=fingerExtended(landmarks,12,10,9),ringOpen=fingerExtended(landmarks,16,14,13),pinkyOpen=fingerExtended(landmarks,20,18,17),openCount=[indexOpen,middleOpen,ringOpen,pinkyOpen].filter(Boolean).length,palmCenter=[0,5,9,13,17].reduce((point,index)=>({x:point.x+landmarks[index].x/5,y:point.y+landmarks[index].y/5}),{x:0,y:0}),beforeFrozen=gesturePinchState.frozenCandidate,pinchUpdate=logic.updatePinch(gesturePinchState,{valid:true,ratio:pinchRatio,now,sensitivity,candidateId});gesturePinchState=pinchUpdate.state;if(now-diagnosticLastMetricAt>250){diagnosticLastMetricAt=now;recordDiagnostic('gesture-metric',{pinchRatio,closeThreshold:logic.pinchConfig(sensitivity).close,openThreshold:logic.pinchConfig(sensitivity).open,inferenceCadenceMs:diagnosticInferenceMs});}if(!beforeFrozen&&gesturePinchState.frozenCandidate){gestureFrozenReadingGeneration=readingGeneration;gestureFrozenCameraGeneration=gestureGeneration;}
    const closing=Boolean(gesturePinchState.closingSince||pinchUpdate.commitCandidate),point=indexOpen&&!middleOpen&&!ringOpen&&!pinkyOpen,openPalm=openCount>=3;let target=point?landmarks[8]:closing?{x:(landmarks[4].x+landmarks[8].x)/2,y:(landmarks[4].y+landmarks[8].y)/2}:palmCenter;gestureSmoothedX+=(target.x-gestureSmoothedX)*smoothing;gestureSmoothedY+=(target.y-gestureSmoothedY)*smoothing;updateGesturePointer(gestureSmoothedX,gestureSmoothedY,closing?'pinch':point?'point':openPalm?'palm':'seeking');
    if(closing){
      gesturePalmLastX=null;setGestureMode('pinch','PINCH · SELECT','捏合 · 选牌');$('.camera-shell').dataset.browse='hold';$('#gesture-meter-fill').style.width=`${Math.round(gesturePinchState.progress*100)}%`;$('#gesture-candidate-card').classList.add('is-locking');$$('.gesture-zones i').forEach((node,index)=>node.classList.toggle('is-active',index===2));setGestureStatus(`Hold the pinch to select highlighted card ${$('#gesture-candidate-index').textContent}.`,`保持捏合以选择高亮牌 ${$('#gesture-candidate-index').textContent}。`);if(pinchUpdate.commitCandidate)commitGestureSelection(2,pinchUpdate.commitCandidate);return;
    }
    $('#gesture-meter-fill').style.width='0';$('#gesture-candidate-card').classList.remove('is-locking');
    if(point){
      gesturePalmLastX=null;setGestureMode('point','ONE FINGER · AIM','伸出食指 · 瞄准');$('.camera-shell').dataset.browse='hold';$$('.gesture-zones i').forEach((node,index)=>node.classList.toggle('is-active',index===1));setGestureStatus('Point with one finger to move the glowing circle. The deck is locked until your palm opens.','伸出一根手指移动发光圆圈。张开手掌前，牌组会保持静止。');return;
    }
    if(openPalm){
      setGestureMode('palm','OPEN PALM · BROWSE','张开手掌 · 浏览');$$('.gesture-zones i').forEach((node,index)=>node.classList.toggle('is-active',index===0));const fan=$('#deck-fan'),speed=Number($('#gesture-speed').value);if(gesturePalmLastX!==null){const delta=gestureSmoothedX-gesturePalmLastX;if(Math.abs(delta)>.0022){const shift=delta*fan.clientWidth*(3.4+sensitivity*.033)*speed;fan.scrollLeft+=shift;$('.camera-shell').dataset.browse=shift<0?'left':'right';updateDeckPosition();}}gesturePalmLastX=gestureSmoothedX;setGestureStatus('Open palm detected. Move your whole hand left or right to browse the 78 cards.','检测到张开的手掌。左右移动整只手以浏览 78 张牌。');return;
    }
    gesturePalmLastX=null;setGestureMode('seeking','OPEN, POINT, OR PINCH','张掌、指向或捏合');$('.camera-shell').dataset.browse='hold';$$('.gesture-zones i').forEach(node=>node.classList.remove('is-active'));setGestureStatus('Open your palm to browse, point one finger to aim, or pinch to select.','张开手掌浏览，伸出食指瞄准，捏合手指选牌。');
  }
  async function startGestureCamera(){
    if(gestureStream)return;const generation=++gestureGeneration;if($('#draw-panel').hidden)beginRitual();const startButton=$('#start-camera');gestureInferenceFailures=0;gestureInferenceRetryAt=0;startButton.disabled=true;applyBilingualNode(startButton,'Loading hand model…','正在加载手势模型……');resetGesturePinch(true);setGestureSensorState('requesting','Loading the local hand model, then requesting camera access.','正在加载本地手势模型，随后请求摄像头权限。');setGestureStatus('Preparing palm, pointing, and pinch recognition…','正在准备手掌、指向与捏合识别……');
    try{if(!globalThis.isSecureContext){const error=new Error('Secure context required');error.name='InsecureContextError';throw error;}if(!navigator.mediaDevices?.getUserMedia){const error=new Error('MediaDevices unavailable');error.name='NotFoundError';throw error;}await ensureGestureHands();if(generation!==gestureGeneration)return;
      setGestureSensorState('camera','Allow camera access in the browser prompt. If it was blocked, change this site’s camera permission and retry.','请在浏览器提示中允许摄像头。若已阻止，请更改此网站的摄像头权限后重试。');applyBilingualNode(startButton,'Waiting for camera…','等待摄像头……');recordDiagnostic('gesture-stage',{code:'GESTURE_CAMERA_REQUEST'});
      const stream=await withTimeout(navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'user'}}}).then(stream=>{if(generation!==gestureGeneration){stream.getTracks().forEach(track=>track.stop());throw new Error('GESTURE_CAMERA_CANCELLED');}return stream;}),20000,'GESTURE_CAMERA_PERMISSION_TIMEOUT');recordDiagnostic('gesture-stage',{code:'GESTURE_CAMERA_ACQUISITION_OK'});if(generation!==gestureGeneration){stream.getTracks().forEach(track=>track.stop());return;}gestureStream=stream;const track=gestureStream.getVideoTracks()[0];if(track?.applyConstraints)try{await track.applyConstraints({facingMode:'user',width:{ideal:640},height:{ideal:480},frameRate:{ideal:30,max:30}});}catch{}const video=$('#gesture-video');video.srcObject=gestureStream;await withTimeout(video.play().then(()=>video.readyState>=2?undefined:new Promise(resolve=>video.addEventListener('loadeddata',resolve,{once:true}))),8000,'GESTURE_FIRST_FRAME');recordDiagnostic('gesture-stage',{code:'GESTURE_FIRST_FRAME_OK'});if(generation!==gestureGeneration)return;gestureLastInference=0;gestureFrames=0;gestureZone=-1;gesturePalmLastX=null;gestureSmoothedX=.5;gestureSmoothedY=.5;setGestureMode('seeking','SHOW YOUR HAND','请举起手');updateGesturePointer(.5,.5,'seeking');$('#deck-fan').classList.add('is-gesture-browsing');$('.camera-shell').dataset.browse='hold';updateGestureSelectionPreview();$('#hand-dialog .hand-stage').classList.add('is-live');startButton.hidden=true;startButton.disabled=false;$('#stop-camera').hidden=false;setGestureSensorState('live','Open palm browses, one finger aims, and only a pinch selects.','张开手掌浏览，伸出食指瞄准，只有捏合手势会选牌。');setGestureStatus('Show an open palm to browse; the first clear pinch can select immediately.','张开手掌浏览；首次清晰捏合即可直接选牌。');const firstInference=new Promise(resolve=>{firstInferenceResolve=resolve;});gestureTimer=requestAnimationFrame(analyzeGestureFrame);await withTimeout(firstInference,12000,'GESTURE_FIRST_INFERENCE');}
    catch(error){if(generation!==gestureGeneration)return;const code=String(error?.message||'GESTURE_UNKNOWN'),resetRuntime=error?.name==='ModelUnavailableError'||code==='GESTURE_FIRST_INFERENCE'||code.startsWith('GESTURE_RUNTIME_');recordDiagnostic('gesture-error',{code:code.startsWith('GESTURE_')?code:'GESTURE_'+String(error.name||'UNKNOWN').toUpperCase()});stopGestureCamera({preserveStatus:true,resetRuntime});applyBilingualNode(startButton,'Retry hand tracking','重试手势追踪');const [en,zh,state]=gestureCameraError(error);setGestureSensorState(state,en,zh);setGestureStatus(en,zh);showToast(bilingual('Hand tracking paused. Retry here or use the visible tap fallback.','手势追踪已暂停。可在此重试，或使用可见的点击备选方式。'));}
  }
  async function analyzeGestureFrame(now){
    if(!gestureStream)return;gestureTimer=requestAnimationFrame(analyzeGestureFrame);if(document.visibilityState!=='visible'||now<gestureInferenceRetryAt)return;const video=$('#gesture-video'),sensitivity=Number($('#gesture-sensitivity').value),minimumInterval=Math.max(58,82-sensitivity*.22);if(video.readyState<2||gestureInferenceToken||now-gestureLastInference<minimumInterval)return;if(diagnosticLastInferenceAt)diagnosticInferenceMs=now-diagnosticLastInferenceAt;diagnosticLastInferenceAt=now;gestureLastInference=now;const token={generation:gestureGeneration},previousFailures=gestureInferenceFailures;gestureInferenceToken=token;const canvas=$('#gesture-analysis-canvas'),ctx=canvas.getContext('2d',{alpha:false});ctx.save();ctx.translate(canvas.width,0);ctx.scale(-1,1);ctx.drawImage(video,0,0,canvas.width,canvas.height);ctx.restore();try{await gestureHands.send({image:canvas});if(previousFailures)recordDiagnostic('gesture-stage',{code:'GESTURE_INFERENCE_RECOVERED',failureCount:previousFailures});gestureInferenceFailures=0;gestureInferenceRetryAt=0;}catch(cause){if(token.generation===gestureGeneration){gestureInferenceFailures++;const failureCount=gestureInferenceFailures,causeName=String(cause?.name||'Error').slice(0,80),causeMessage=String(cause?.message||cause||'').slice(0,180);if(failureCount<3){gestureInferenceRetryAt=performance.now()+250*failureCount;recordDiagnostic('gesture-warning',{code:'GESTURE_INFERENCE_TRANSIENT',failureCount,causeName,causeMessage});setGestureStatus('Hand tracking paused briefly. Retrying automatically…','手势追踪短暂暂停，正在自动重试……');}else{const error=new Error('GESTURE_INFERENCE_RUNTIME',{cause});error.name='ModelUnavailableError';recordDiagnostic('gesture-error',{code:'GESTURE_INFERENCE_RUNTIME',failureCount,causeName,causeMessage});stopGestureCamera({preserveStatus:true,resetRuntime:true});applyBilingualNode($('#start-camera'),'Retry hand tracking','重试手势追踪');const [en,zh,state]=gestureCameraError(error);setGestureSensorState(state,en,zh);setGestureStatus(en,zh);showToast(bilingual('Hand tracking paused after repeated runtime errors. Retry here or tap the highlighted card.','手势追踪因连续运行错误而暂停。可在此重试，或点击高亮牌。'));}}}finally{if(gestureInferenceToken===token)gestureInferenceToken=null;}
  }
  function commitGestureSelection(zone=1,candidateId=null){if(selectedCards.length>=3)return false;const choice=candidateId?$$('.deck-choice').find(node=>node.dataset.deckIndex===candidateId):gestureCandidate||nearestDeckChoice(),card=choice&&deckAssignments.get(choice);if(!choice||choice.classList.contains('is-picked')||!card||candidateId&&choice!==gestureCandidate||candidateId&&(gestureFrozenReadingGeneration!==readingGeneration||gestureFrozenCameraGeneration!==gestureGeneration)){resetGesturePinch();return false;}gestureCooldownUntil=performance.now()+450;gestureFrames=0;gestureZone=-1;pickCard(choice,'gesture');animateGestureDraw(card,selectedCards.length-1);if(!candidateId)resetGesturePinch(true);const pointer=$('#gesture-pointer');pointer.classList.remove('is-confirmed');void pointer.offsetWidth;pointer.classList.add('is-confirmed');setTimeout(()=>pointer.classList.remove('is-confirmed'),760);const zoneNode=$(`.gesture-zones i[data-zone="${zone}"]`);zoneNode?.classList.add('is-selected');setTimeout(()=>zoneNode?.classList.remove('is-selected'),800);$('.camera-shell').dataset.browse='hold';$('#gesture-candidate-card').classList.remove('is-locking');updateGestureSelectionPreview();setGestureStatus(`Card ${selectedCards.length} of 3 selected. Move left or right for the next card.`,`已选择第 ${selectedCards.length} / 3 张牌。左右移动寻找下一张牌。`);if(selectedCards.length===3){setGestureStatus('Three cards selected. Watch them settle, then reveal the reading.','三张牌已选定。等待卡牌落位，然后揭示解读。');const generation=gestureGeneration;setTimeout(()=>{if(generation!==gestureGeneration)return;$('#hand-dialog').close();stopGestureCamera();},1900);}return true;}
  function stopGestureCamera(options={}){const preserveStatus=options?.preserveStatus===true,resetRuntime=options?.resetRuntime===true;gestureGeneration++;if(gestureTimer){cancelAnimationFrame(gestureTimer);gestureTimer=null;}gestureStream?.getTracks().forEach(track=>track.stop());gestureStream=null;gestureInferenceToken=null;firstInferenceResolve=null;gestureInferenceFailures=0;gestureInferenceRetryAt=0;const video=$('#gesture-video');if(video)video.srcObject=null;gestureFrames=0;gestureZone=-1;gesturePalmLastX=null;resetGesturePinch(true);$('#deck-fan').classList.remove('is-gesture-browsing');$$('.deck-choice.is-gesture-candidate').forEach(node=>node.classList.remove('is-gesture-candidate'));$$('.deck-choice.is-candidate-arriving').forEach(node=>{node.classList.remove('is-candidate-arriving');node.removeAttribute('data-arrival');});gestureCandidate=null;gestureCandidateIndex=-1;clearTimeout(gestureBrowseAnimationTimer);gestureBrowseAnimationTimer=0;$('#hand-dialog .hand-stage').classList.remove('is-live');$('#start-camera').hidden=false;$('#start-camera').disabled=false;$('#stop-camera').hidden=true;$('#gesture-candidate-card').classList.remove('is-locking','is-drawing','is-changing');$('#gesture-deck-rail').classList.remove('is-shifting');$('#gesture-candidate-index').classList.remove('is-updating');$('#gesture-pointer').classList.remove('is-holding','is-confirmed','is-pinching','is-pointing','is-browsing');setGestureMode('idle','SHOW YOUR HAND','请举起手');updateGesturePointer(.5,.5,'idle');$('.camera-shell').removeAttribute('data-browse');$('.camera-shell').removeAttribute('data-card-shift');$$('.gesture-draw-clone').forEach(node=>node.remove());$$('.gesture-zones i').forEach(node=>node.classList.remove('is-active','is-selected'));if(resetRuntime)disposeGestureHands();if(!preserveStatus){applyBilingualNode($('#start-camera'),'Enable hand tracking','启用手势追踪');setGestureSensorState('idle','Tap Enable hand tracking to request camera access.','点击“启用手势追踪”以请求摄像头权限。');setGestureStatus('The camera works only as an invisible local landmark sensor. Its preview is never shown, stored, or uploaded.','摄像头仅作为不可见的本地手部关键点传感器；画面不会显示、保存或上传。');}}

  $('#enter-button').addEventListener('click',enterArchive);
  $$('.route-control').forEach(button=>button.addEventListener('click',()=>navigate(button.dataset.route,button)));
  document.addEventListener('pointerdown',event=>{burstClick(event.clientX,event.clientY);if(event.target.closest('button,label,input,textarea'))sound.cue('tap');});
  $('#begin-ritual').addEventListener('click',beginRitual);$('#restart-draw').addEventListener('click',restartDrawingSession);$('#restart-reading').addEventListener('click',restartDrawingSession);$('#reveal-cards').addEventListener('click',revealReading);$('#save-reading').addEventListener('click',saveReading);$('#export-reading').addEventListener('click',event=>exportReading(null,event.currentTarget));$('#copy-reading').addEventListener('click',copyReading);$('#new-reading').addEventListener('click',()=>resetReading(true));$('#close-meaning').addEventListener('click',()=>resetReading(true));
  $('#export-generate').addEventListener('click',generateExport);$('#export-cancel').addEventListener('click',closeExportDialog);$('#export-render-cancel').addEventListener('click',closeExportDialog);$('#export-close').addEventListener('click',closeExportDialog);$('#export-error-close').addEventListener('click',closeExportDialog);$('#export-retry').addEventListener('click',generateExport);$('#export-copy-report').addEventListener('click',()=>copyExportSnapshot(exportSnapshot));$('#export-error-copy-report').addEventListener('click',()=>copyExportSnapshot(exportSnapshot));$$('#export-page-one,#export-page-two').forEach(link=>link.addEventListener('click',()=>sound.cue('confirm')));$('#export-dialog').addEventListener('cancel',event=>{event.preventDefault();closeExportDialog();});$('#export-dialog').addEventListener('close',cleanupExportDialog);addEventListener('pagehide',()=>{exportGeneration++;releaseExportUrls();});
  $('#card-search').addEventListener('input',renderArcana);$$('.filter-row .chip').forEach(button=>button.addEventListener('click',()=>{$$('.filter-row .chip').forEach(item=>item.classList.remove('is-active'));button.classList.add('is-active');renderArcana();}));
  $('#deck-scroll-prev').addEventListener('click',()=>scrollDeck(-1));$('#deck-scroll-next').addEventListener('click',()=>scrollDeck(1));$('#deck-fan').addEventListener('scroll',()=>{if(deckScrollFrame)return;deckScrollFrame=requestAnimationFrame(()=>{deckScrollFrame=0;updateDeckPosition();});},{passive:true});$('#deck-fan').addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();scrollDeck(-1);}if(event.key==='ArrowRight'){event.preventDefault();scrollDeck(1);}});
  $('#gallery-prev').addEventListener('click',()=>selectSession(galleryIndex-1));$('#gallery-next').addEventListener('click',()=>selectSession(galleryIndex+1));
  $('#session-gallery').addEventListener('keydown',event=>{if(event.key==='ArrowLeft')selectSession(galleryIndex-1);if(event.key==='ArrowRight')selectSession(galleryIndex+1);});
  $('#settings-toggle').addEventListener('click',()=>openDrawer('settings'));$$('.close-drawer').forEach(button=>button.addEventListener('click',()=>closeDrawer(button.dataset.close)));
  $('#prepare-core').addEventListener('click',()=>prepareOfflinePack('core'));$('#prepare-gesture').addEventListener('click',()=>prepareOfflinePack('gesture'));
  $('#diagnostic-settings').addEventListener('toggle',event=>{if(event.currentTarget.open)refreshDiagnostics();});$('#refresh-diagnostics').addEventListener('click',refreshDiagnostics);$('#export-diagnostics').addEventListener('click',exportDiagnostics);
  $('#install-app').addEventListener('click',installApp);addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;$('#install-app').hidden=false;});addEventListener('appinstalled',()=>{installPrompt=null;$('#install-app').hidden=true;showToast(bilingual('The archive is installed.','秘典已安装。'));});if(/iPad|iPhone|iPod/.test(navigator.userAgent)&&!matchMedia('(display-mode: standalone)').matches)$('#ios-install-note').hidden=false;
  $$('#language-control button').forEach(button=>button.addEventListener('click',()=>applyLanguage(button.dataset.language)));$('#music-setting').addEventListener('change',event=>sound.setPreferences({musicEnabled:event.target.checked}));$('#sfx-setting').addEventListener('change',event=>sound.setPreferences({sfxEnabled:event.target.checked}));$('#music-volume').addEventListener('input',event=>sound.setPreferences({musicVolume:Number(event.target.value)}));$('#sfx-volume').addEventListener('input',event=>sound.setPreferences({sfxVolume:Number(event.target.value)}));$('#motion-setting').addEventListener('change',event=>document.documentElement.dataset.motion=event.target.checked?'on':'off');$('#hand-setting').addEventListener('change',event=>$('#hand-ritual').hidden=!event.target.checked);$('#opening-setting').addEventListener('change',event=>localStorage.setItem('celestial-opening',event.target.checked?'on':'off'));
  $('#sound-toggle').addEventListener('click',()=>{const enabled=sound.music||sound.sfx;sound.setPreferences({musicEnabled:!enabled,sfxEnabled:!enabled});showToast(!enabled?'Sound on':'Sound off');});
  $('#gesture-speed').addEventListener('input',event=>$('#gesture-speed-value').textContent=`${Number(event.target.value).toFixed(1)}×`);$('#gesture-sensitivity').addEventListener('input',event=>{$('#gesture-sensitivity-value').textContent=`${event.target.value} / 100`;resetGesturePinch();});
  const handTutorialKey='celestial-hand-tutorial-v1';
  function showHandTutorial(){
    stopGestureCamera();$('#hand-tutorial').hidden=false;$('#hand-dialog .hand-stage').hidden=true;
    const video=$('#hand-tutorial-video');video.currentTime=0;
    if(document.documentElement.dataset.motion!=='off'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)video.play().catch(()=>{});
    $('#hand-tutorial-done').focus();
  }
  function finishHandTutorial(){
    $('#hand-tutorial-video').pause();$('#hand-tutorial').hidden=true;$('#hand-dialog .hand-stage').hidden=false;
    try{localStorage.setItem(handTutorialKey,'seen');}catch{}
    $('#start-camera').focus();
  }
  $('#hand-tutorial-done').addEventListener('click',finishHandTutorial);
  $('#hand-tutorial-replay').addEventListener('click',showHandTutorial);
  $('#hand-dialog').addEventListener('close',()=>$('#hand-tutorial-video').pause());
  $('#hand-ritual').addEventListener('click',()=>{if($('#draw-panel').hidden)beginRitual();$('.camera-shell').dataset.browse='hold';updateGestureSelectionPreview();setGestureStatus('The deck is ready. Open palm browses, one finger aims, and only a pinch selects.','牌组已准备好。张开手掌浏览，伸出食指瞄准，只有捏合手势会选牌。');$('#hand-dialog').showModal();let seen=false;try{seen=localStorage.getItem(handTutorialKey)==='seen';}catch{}if(!seen)showHandTutorial();});$('#start-camera').addEventListener('click',startGestureCamera);$('#stop-camera').addEventListener('click',()=>stopGestureCamera());$('#gesture-candidate-card').addEventListener('click',()=>{if($('#draw-panel').hidden)beginRitual();updateGestureCandidate();commitGestureSelection(1);});$('#simulate-gesture').addEventListener('click',()=>{stopGestureCamera();if($('#draw-panel').hidden)beginRitual();$('.camera-shell').dataset.browse='hold';updateGestureSelectionPreview();setGestureStatus('Demonstrating three visible pinch selections.','正在演示三次可见的捏合选牌。');[0,1,2].forEach(index=>setTimeout(()=>{updateGestureCandidate();commitGestureSelection(2);},350+index*1450));});
  $$('.dialog-close').forEach(button=>button.addEventListener('click',()=>{const dialog=button.closest('dialog');if(dialog.id==='hand-dialog')stopGestureCamera();dialog.close();}));$$('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){if(dialog.id==='hand-dialog')stopGestureCamera();dialog.close();}}));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible'){resetGesturePinch();sound.track.pause();}else{gestureInferenceRetryAt=0;sound.syncMusic();}});
  $('#clear-readings').addEventListener('click',()=>{if(!sessions.length){showToast(bilingual('The Reading Chamber is already empty.','占卜室已经是空的。'));return;}if(!confirm(bilingual('Delete every saved reading from this browser?','删除此浏览器中的全部已保存解读？')))return;sessions=[];persistSessions();renderSessions();sound.cue('dissolve');showToast(bilingual('Reading Chamber cleared.','占卜室已清空。'));});

  addEventListener('keydown',()=>{document.documentElement.dataset.input='keyboard';});
  addEventListener('pointerdown',()=>{document.documentElement.dataset.input='pointer';});
  $('#opening-skip').addEventListener('click',finishOpening);addEventListener('resize',resizeClickCanvas);document.documentElement.dataset.motion=matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on';syncViewState();sound.syncControls();sound.updateState();resizeClickCanvas();animateClickParticles();runOpeningSequence();renderArcana();renderSessions();renderChapters();applyLanguage('bilingual');window.__celestialCamera={start:startGestureCamera,stop:stopGestureCamera,testZone:commitGestureSelection,get active(){return Boolean(gestureStream);}};
  addEventListener('load',registerServiceWorker);
})();
