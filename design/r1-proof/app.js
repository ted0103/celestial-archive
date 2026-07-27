(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const meaningDetails = {
    fool:{shadow:"A leap can become avoidance when novelty is used to escape preparation.",reflection:"Where could curiosity be more useful than certainty?",practice:"Take one reversible first step and name what it teaches you."},
    moon:{shadow:"Fear may fill missing information with a story that feels true but remains untested.",reflection:"What do you sense—and what evidence would help you trust or revise that sense?",practice:"Wait one cycle before deciding; record the dream, feeling, and observable fact separately."},
    swords3:{shadow:"Clarity can harden into repetition when pain becomes the only available explanation.",reflection:"Which truth needs acknowledgement without becoming your whole identity?",practice:"Write the cleanest sentence you can about what hurt, then one sentence about what remains possible."},
    cups1:{shadow:"An open heart still needs boundaries; giving without a vessel can become depletion.",reflection:"What feeling is asking to be received before it is solved?",practice:"Create ten quiet minutes for it, then choose one caring boundary or invitation."},
    pentacles10:{shadow:"Tradition can preserve belonging, but it can also preserve arrangements that no longer serve everyone.",reflection:"What are you inheriting, and what do you want others to inherit from you?",practice:"Strengthen one shared structure: a promise, savings habit, archive, meal, or conversation."},
    wandsQueen:{shadow:"Confidence becomes performance when attention from others replaces contact with your own values.",reflection:"Where would warmth and visible self-trust change the atmosphere?",practice:"Make one clear invitation or decision without shrinking it to manage another person’s reaction."}
  };

  const cards = [
    {id:"fool", file:"major-00-the-fool.png", name:"The Fool", zh:"愚者", group:"major", code:"0", keywords:"Beginnings · Trust · Curiosity", meaning:"A clean threshold appears. Step toward it with attention, not certainty; your willingness to learn is the protection you carry."},
    {id:"moon", file:"major-18-the-moon.png", name:"The Moon", zh:"月亮", group:"major", code:"XVIII", keywords:"Intuition · Dream · Uncertainty", meaning:"Not everything needs to become clear tonight. Let instinct gather evidence while the deeper pattern rises through the dark."},
    {id:"swords3", file:"swords-03-three-of-swords.png", name:"Three of Swords", zh:"宝剑三", group:"minor", code:"III · SWORDS", keywords:"Heartbreak · Clarity · Release", meaning:"Pain names what mattered. Give the truth a clean shape, then let it pass through instead of building a permanent room around it."},
    {id:"cups1", file:"cups-01-ace-of-cups.png", name:"Ace of Cups", zh:"圣杯王牌", group:"minor", code:"ACE · CUPS", keywords:"Opening · Compassion · Renewal", meaning:"Something tender wants a vessel. Receive before you explain; the smallest honest feeling can refill a landscape."},
    {id:"pentacles10", file:"pentacles-10-ten-of-pentacles.png", name:"Ten of Pentacles", zh:"星币十", group:"minor", code:"X · PENTACLES", keywords:"Legacy · Belonging · Continuity", meaning:"What lasts is made together. Notice the structures, stories, and care that can outlive the moment—and tend them deliberately."},
    {id:"wandsQueen", file:"wands-queen-queen-of-wands.png", name:"Queen of Wands", zh:"权杖王后", group:"minor", code:"QUEEN · WANDS", keywords:"Warmth · Magnetism · Self-trust", meaning:"Take up space without hardening. Your clearest influence comes from the warmth of a self you no longer need to conceal."}
  ].map(card => ({...card,...meaningDetails[card.id],src:`assets/cards/revision-2/${card.file}`}));

  const chapters = [
    {title:"The Question", zh:"问", copy:"A useful question opens a field instead of demanding a verdict. Ask what deserves attention, what pattern is repeating, or what quality can be practiced next.", quote:"The card does not replace your judgment; it gives your judgment another angle of light."},
    {title:"The Shuffle", zh:"洗牌", copy:"Shuffling is a small interruption. It gives the body a role and breaks the mind’s insistence on a rehearsed answer. Fast or slow is less important than present.", quote:"Ritual is attention with a visible shape."},
    {title:"The Reveal", zh:"揭示", copy:"Turn each card completely. Notice the first physical response before reading a definition: attraction, resistance, recognition, confusion. That reaction is part of the material.", quote:"Look once before you begin to name."},
    {title:"The Spread", zh:"牌阵", copy:"A spread is grammar. Positions give each image a job, while the images alter one another. Begin with three positions and read the relationships before adding complexity.", quote:"Meaning lives between the cards as much as inside them."},
    {title:"Reversals", zh:"逆位", copy:"A reversed card can suggest obstruction, interiority, delay, excess, or a quality asking to be reclaimed. Use one consistent method; ambiguity should deepen attention, not erase it.", quote:"A reversal turns the symbol inward—it does not automatically turn it bad."},
    {title:"Care & Closure", zh:"照护与结束", copy:"Close a reading by naming one grounded action. Save it only when returning would be useful. Otherwise, let the paper dissolve and allow the question to change you privately.", quote:"Keep what serves. Release what has completed its work."}
  ];

  const translations = {
    entryLede:["A private archive for questions, symbols, and the cards that find you.","一座收藏问题、象征与命定之牌的私人档案馆。"],
    enter:["Enter the archive","进入秘典"], entryNote:["Sound begins only after you enter. Headphones recommended.","声音将在进入后开始。建议佩戴耳机。"],
    review:["Review","审阅"], gatewayTitle:["Choose a threshold.","选择一道门。"], gatewayLede:["Each room keeps its own rhythm, but every path returns to the same sky.","每个房间都有自己的节奏，而所有道路都归于同一片天空。"],
    ritual:["Enter the Ritual","进入仪式"], ritualDesc:["Ask, shuffle, reveal, understand.","提问、洗牌、揭示、理解。"], arcana:["Arcana","秘仪之牌"], arcanaDesc:["Browse the complete celestial deck.","浏览完整的天穹牌组。"],
    chamber:["Reading Chamber","占卜室"], chamberDesc:["Return only to readings you chose to keep.","只回到你亲自选择保存的解读。"], grimoire:["Grimoire","秘典"], grimoireDesc:["Six chapters on reading with care.","六章关于谨慎解读的笔记。"],
    ritualPageLede:["Name what is moving through you—or leave the question unspoken.","说出心中正在流动之物，或让问题保持沉默。"], questionLabel:["Your question · optional","你的问题 · 可选"], questionPlaceholder:["What deserves my attention now?","此刻，什么值得我关注？"], begin:["Begin shuffle","开始洗牌"], handRitual:["Hand Ritual","手势仪式"], privacy:["Nothing is saved unless you explicitly choose Save.","除非你明确选择保存，否则不会保存任何内容。"],
    chooseThree:["Choose three cards.","选择三张牌。"], reveal:["Reveal the reading","揭示解读"], meaningTitle:["The pattern between the cards","牌与牌之间的纹理"], synthesis:["Synthesis","综合解读"], synthesisCopy:["A beginning asks for trust, uncertainty asks for patience, and the heart asks to remain open. Move carefully, but keep moving.","新的开始需要信任，不确定需要耐心，而心仍需保持敞开。谨慎前行，但不要停下。"],
    includeSave:["Include question when saving","保存时包含问题"], includeExport:["Include question in exported image","导出图片时包含问题"], includeCopy:["Include question when copying","复制时包含问题"], save:["Save","保存"], export:["Export image","导出图片"], copy:["Copy meaning","复制解读"], newReading:["New reading","新的解读"],
    searchCards:["Search the proof deck","搜索审核牌组"], all:["All proof cards","所有审核牌"], proofLimit:["Approved R1.0 baseline: 6 faces + 1 back. The remaining 72 faces are now being produced for the second catalog gate.","已批准的 R1.0 基准：6 张正面与 1 张背面。其余 72 张正在制作，完成后进入第二次牌组审核。"], chamberLede:["A finite moving gallery. Only the selected reading comes fully into view.","有限的移动画廊。只有选中的解读会完整显现。"],
    settings:["Settings","设置"], language:["Language","语言"], music:["Ambient music","环境音乐"], musicNote:["Original adaptive violin-like theme","原创自适应小提琴质感主题"], sfx:["Interaction sound","交互声音"], sfxNote:["Menus, cards, save, export, and gestures","菜单、卡牌、保存、导出与手势"], motion:["Motion","动效"], motionNote:["Morph, gallery, reveal, paper, and ambient layers","变形、画廊、揭示、纸张与环境层"], handNote:["Optional gesture preview; never required","可选手势预览；永不强制"],
    reviewTitle:["Approved R1.0 baseline","已批准的 R1.0 基准"], reviewIntro:["All finite proof cases were approved on 18 July 2026. They now define the locked baseline for full-deck generation; production remains gated by the completed catalog.","全部有限审核项目已于 2026 年 7 月 18 日获批。它们现为完整牌组生成的锁定基准；生产整合仍须等待完整牌组审核。"], handPrompt:["Wave in the left, center, or right zone.","在左、中或右侧区域挥手。"], handPrivacy:["Camera frames stay on this device and are never stored or uploaded.","摄像头画面仅在本设备处理，不会保存或上传。"], simulate:["Simulate selection","模拟选择"]
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
    ["MOTION-09","Motion","Hand Ritual camera","Optional local camera motion-zone selection with no upload or frame storage."],
    ["MOTION-10","Motion","Ceremonial opening ident","Original dark-green celestial sigil assembles through orbit, bloom, dust, and typographic reveal."],
    ["MOTION-11","Motion","Glowing click scatter","Gold and ivory particles burst from pointer and touch interactions."],
    ["MOTION-12","Motion","Staged interface entrances","Every page, drawer, dialog, panel, and content group assembles through ordered opacity, translate, scale, blur, line, and clip reveals."],
    ["SOUND-01","Sound","Original entry theme","Original synthesized violin-like ambient line; not Tori no Uta."],
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
    ["CAMERA-01","Privacy","Local motion-zone gesture","Browser camera permission is explicit; frames are analyzed in-memory at 64×48, never saved or uploaded, with a manual fallback."],
    ["DATA-01","Privacy","No automatic reading save","Save, export, and copy are separate explicit actions; all question-inclusion toggles default off."]
  ].map(([id,category,title,description])=>({id,category,title,description,status:"approved",note:"Approved by user on 18 July 2026."}));

  const sessions = [
    {title:"The Quiet Threshold",date:"17 JUL 2026",cards:[cards[0],cards[1]],copy:"Trust the beginning without demanding daylight from the entire path."},
    {title:"A Vessel Opens",date:"12 JUL 2026",cards:[cards[3],cards[5]],copy:"Warmth becomes useful when it is given a form that can hold and share it."},
    {title:"What Remains",date:"03 JUL 2026",cards:[cards[2],cards[4]],copy:"Let an old pain become information, then choose what is worth carrying forward."}
  ];

  let language = "bilingual";
  let activeRoute = "gateway";
  let selectedCards = [];
  let currentDeck = [];
  let readingRevealed = false;
  let readingSaved = false;
  let galleryIndex = 0;
  let reviewFilter = "all";
  let toastTimer;
  let gestureStream = null;
  let gestureTimer = null;
  let previousGestureFrame = null;
  let gestureZone = -1;
  let gestureFrames = 0;
  let gestureCooldownUntil = 0;
  let clickParticles = [];
  let dealsInFlight = 0;

  class SoundEngine {
    constructor(){this.ctx=null;this.music=true;this.sfx=true;this.themeTimer=null;this.themeIndex=0;this.master=null;}
    unlock(){
      if(this.ctx){this.ctx.resume();return;}
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
      this.ctx=new AC();this.master=this.ctx.createGain();this.master.gain.value=.22;this.master.connect(this.ctx.destination);this.startTheme();
    }
    tone(freq=440,duration=.14,type="sine",gain=.12,delay=0){
      if(!this.ctx||!this.sfx)return;
      const now=this.ctx.currentTime+delay,osc=this.ctx.createOscillator(),amp=this.ctx.createGain(),filter=this.ctx.createBiquadFilter();
      osc.type=type;osc.frequency.setValueAtTime(freq,now);filter.type="lowpass";filter.frequency.value=2200;amp.gain.setValueAtTime(.0001,now);amp.gain.exponentialRampToValueAtTime(gain,now+.018);amp.gain.exponentialRampToValueAtTime(.0001,now+duration);
      osc.connect(filter);filter.connect(amp);amp.connect(this.master);osc.start(now);osc.stop(now+duration+.04);
    }
    cue(kind="tap"){
      if(!this.ctx||!this.sfx)return;
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
    startTheme(){
      if(!this.ctx||this.themeTimer)return;
      const notes=[220,293.66,329.63,246.94,196,246.94,293.66,220];
      const play=()=>{
        if(this.music&&this.ctx){
          const f=notes[this.themeIndex++%notes.length],now=this.ctx.currentTime,osc=this.ctx.createOscillator(),amp=this.ctx.createGain(),filter=this.ctx.createBiquadFilter(),vibrato=this.ctx.createOscillator(),vGain=this.ctx.createGain();
          osc.type="sawtooth";osc.frequency.value=f;filter.type="lowpass";filter.frequency.value=1150;filter.Q.value=3;vibrato.frequency.value=5.2;vGain.gain.value=2.4;vibrato.connect(vGain);vGain.connect(osc.frequency);amp.gain.setValueAtTime(.0001,now);amp.gain.exponentialRampToValueAtTime(.026,now+.7);amp.gain.setValueAtTime(.026,now+2.2);amp.gain.exponentialRampToValueAtTime(.0001,now+3.8);osc.connect(filter);filter.connect(amp);amp.connect(this.master);osc.start();vibrato.start();osc.stop(now+4);vibrato.stop(now+4);
        }
      };play();this.themeTimer=setInterval(play,4200);
    }
  }
  const sound = new SoundEngine();

  function bilingual(en,zh){return language==="en"?en:language==="zh"?zh:`${en} · ${zh}`;}
  function applyLanguage(next){
    language=next;document.documentElement.dataset.language=next;
    $$('[data-i18n]').forEach(node=>{const pair=translations[node.dataset.i18n];if(pair)node.textContent=node.dataset.i18n==='handPrompt'&&next==='bilingual'?`${pair[0]}\n${pair[1]}`:bilingual(pair[0],pair[1]);});
    $$('[data-i18n-placeholder]').forEach(node=>{const pair=translations[node.dataset.i18nPlaceholder];if(pair)node.placeholder=bilingual(pair[0],pair[1]);});
    $$('.segmented [data-language]').forEach(button=>button.classList.toggle('is-active',button.dataset.language===next));
    renderArcana();renderChapters();renderSessions();
  }

  function showToast(message){clearTimeout(toastTimer);const toast=$('#toast');toast.textContent=message;toast.classList.add('is-visible');toastTimer=setTimeout(()=>toast.classList.remove('is-visible'),2400);}

  const sceneSelector = [
    '.entry-copy > *','.topbar > *','.bg-layer','.gateway-heading > *','.gateway-card','.gateway-foot',
    '.page-heading > *','.question-panel','.draw-panel > .ritual-instruction','.deck-choice','.reveal-button',
    '.meaning-head > *','.meaning-card','.synthesis','.reading-detail','.report-options','.report-actions',
    '.filter-row .chip','.arcana-item','.proof-limit','.gallery-arrow','.session-card','.gallery-index > *',
    '.chapter-nav > .eyebrow','.chapter-nav > h2','.chapter-button','.chapter-page > *',
    '.drawer-head > *','.settings-panel section','.drawer-note','.review-intro','.review-filters','.review-item','.review-footer',
    '.dialog-card','.dialog-copy > *','.camera-shell','.hand-stage > .eyebrow','.hand-stage > h3','.hand-stage > p','.gesture-actions'
  ].join(',');
  function revealScene(root,startIndex=0){
    if(!root)return;const candidates=[];if(root.matches?.(sceneSelector))candidates.push(root);candidates.push(...$$(sceneSelector,root));const nodes=[...new Set(candidates)].filter(node=>!node.hidden&&!node.closest('[hidden]'));
    nodes.forEach((node,index)=>{node.classList.add('scene-element');node.classList.remove('is-scene-visible');node.style.setProperty('--scene-index',String(Math.min(startIndex+index,18)));node.dataset.sceneKind=node.matches('.gateway-card,.arcana-item,.session-card,.meaning-card,.dialog-card,.camera-shell')?'card':node.matches('.eyebrow,.chip,.gateway-foot,.proof-limit,.drawer-note')?'micro':'rise';});
    requestAnimationFrame(()=>requestAnimationFrame(()=>nodes.forEach(node=>node.classList.add('is-scene-visible'))));
  }

  function navigate(route,source){
    if(route===activeRoute)return;
    sound.cue('route');
    if(source&&document.documentElement.dataset.motion!=="off"){
      const from=source.getBoundingClientRect(),to=$('.brand-sigil').getBoundingClientRect(),clone=document.createElement('div');clone.className='morph-clone';Object.assign(clone.style,{left:`${from.left}px`,top:`${from.top}px`,width:`${from.width}px`,height:`${from.height}px`,borderRadius:getComputedStyle(source).borderRadius});document.body.append(clone);
      requestAnimationFrame(()=>Object.assign(clone.style,{left:`${to.left}px`,top:`${to.top}px`,width:`${to.width}px`,height:`${to.height}px`,borderRadius:'50%',opacity:'0'}));setTimeout(()=>clone.remove(),850);
    }
    const outgoing=$(`[data-view="${activeRoute}"]`),incoming=$(`[data-view="${route}"]`);if(!incoming)return;
    outgoing?.classList.remove('is-active');incoming.classList.add('is-active');incoming.scrollTop=0;activeRoute=route;revealScene(incoming);
    closeDrawer('settings');closeDrawer('review');
  }

  function enterArchive(){sound.unlock();$('#entry').classList.add('is-leaving');setTimeout(()=>{$('#entry').hidden=true;$('#app').hidden=false;revealScene($('.topbar'));revealScene($(`[data-view="${activeRoute}"]`),2);},650);}

  function cardMarkup(card,label=true){return `<div class="tarot-card"><div class="card-side card-back"><img src="assets/cards/revision-2/card-back-lunar-seal.png" alt="Lunar phase tarot card back"></div><div class="card-side card-face"><img src="${card.src}" alt="${card.name} tarot illustration">${label?`<span class="card-label">${card.code} · ${bilingual(card.name,card.zh)}</span>`:''}</div></div>`;}

  function beginRitual(){
    currentDeck=[...cards].sort(()=>Math.random()-.5);selectedCards=[];dealsInFlight=0;readingRevealed=false;readingSaved=false;$('#question-panel').hidden=true;$('#draw-panel').hidden=false;$('#meaning-panel').hidden=true;$('#reading-slots').innerHTML=Array.from({length:3},()=>'<div class="reading-slot is-empty" aria-hidden="true"></div>').join('');$('#reveal-cards').disabled=true;$('#draw-progress').textContent='0 / 3';sound.cue('shuffle');
    const fan=$('#deck-fan');fan.innerHTML='';for(let i=0;i<9;i++){const button=document.createElement('button');button.type='button';button.className='deck-choice';button.style.setProperty('--r',`${(i-4)*4.1}deg`);button.style.setProperty('--lift',`${Math.abs(i-4)*3}px`);button.setAttribute('aria-label',`Choose card ${i+1}`);button.addEventListener('click',()=>pickCard(button));fan.append(button);}fan.classList.add('is-shuffling');setTimeout(()=>fan.classList.remove('is-shuffling'),1250);revealScene($('#draw-panel'));
  }
  function pickCard(button){
    if(selectedCards.length>=3||button.classList.contains('is-picked'))return;
    const sourceRect=button.getBoundingClientRect(),remaining=currentDeck.filter(card=>!selectedCards.includes(card)),card=remaining[Math.floor(Math.random()*remaining.length)];selectedCards.push(card);sound.cue('select');
    const slot=$$('#reading-slots .reading-slot')[selectedCards.length-1];slot.className='reading-slot is-awaiting-deal';slot.removeAttribute('aria-hidden');slot.innerHTML=cardMarkup(card);dealsInFlight++;animateCardToSlot(button,slot,sourceRect);$('#draw-progress').textContent=`${selectedCards.length} / 3`;
    if(selectedCards.length===3)$('#draw-instruction').textContent=bilingual('The cards are settling.','牌正在落位。');
  }
  function updateRevealReadiness(){if(selectedCards.length===3&&dealsInFlight===0){$('#reveal-cards').disabled=false;$('#draw-instruction').textContent=bilingual('The cards are ready.','牌已准备好。');}}
  function animateCardToSlot(button,slot,sourceRect){
    if(document.documentElement.dataset.motion==="off"){button.classList.add('is-picked');slot.classList.remove('is-awaiting-deal');slot.classList.add('is-dealt');dealsInFlight--;updateRevealReadiness();return;}
    const target=slot.getBoundingClientRect(),clone=document.createElement('div');clone.className='deal-clone';Object.assign(clone.style,{left:`${sourceRect.left}px`,top:`${sourceRect.top}px`,width:`${sourceRect.width}px`,height:`${sourceRect.height}px`,rotate:getComputedStyle(button).getPropertyValue('--r')||'0deg'});document.body.append(clone);button.classList.add('is-picked');
    requestAnimationFrame(()=>requestAnimationFrame(()=>Object.assign(clone.style,{left:`${target.left}px`,top:`${target.top}px`,width:`${target.width}px`,height:`${target.height}px`,rotate:'0deg',scale:'1.015'})));
    setTimeout(()=>{clone.classList.add('is-settling');slot.classList.remove('is-awaiting-deal');slot.classList.add('is-dealt');dealsInFlight--;updateRevealReadiness();sound.cue('select');setTimeout(()=>clone.remove(),180);},820);
  }
  function revealReading(){
    if(selectedCards.length!==3||readingRevealed)return;
    readingRevealed=true;
    if(document.documentElement.dataset.motion==="off"){
      $$('#reading-slots .tarot-card').forEach(card=>card.classList.add('is-flipped'));
      sound.cue('flip');showMeaningPanel();return;
    }
    runRevealCinema();
  }
  function showMeaningPanel(){renderMeanings();$('#meaning-panel').hidden=false;revealScene($('#meaning-panel'));$('#meaning-panel').scrollIntoView({behavior:'smooth',block:'start'});}
  function runRevealCinema(){
    const cinema=$('#reveal-cinema'),container=$('#cinema-cards');
    $('#reveal-cards').disabled=true;cinema.classList.remove('is-active','is-flipping','is-completing');
    container.innerHTML=selectedCards.map((card,index)=>`<div class="cinema-card" style="--i:${index}"><div class="cinema-card-inner"><img class="cinema-back" src="assets/cards/revision-2/card-back-lunar-seal.png" alt=""><img class="cinema-face" src="${card.src}" alt="${card.name}"></div></div>`).join('');
    cinema.hidden=false;cinema.setAttribute('aria-hidden','false');requestAnimationFrame(()=>requestAnimationFrame(()=>cinema.classList.add('is-active')));animateRevealParticles();
    setTimeout(()=>{cinema.classList.add('is-flipping');$$('#reading-slots .tarot-card').forEach((card,index)=>setTimeout(()=>{card.classList.add('is-flipped');sound.cue('flip');},index*180));},1450);
    setTimeout(()=>cinema.classList.add('is-completing'),3700);
    setTimeout(()=>cinema.classList.remove('is-active'),3820);
    setTimeout(()=>{cinema.hidden=true;cinema.setAttribute('aria-hidden','true');cinema.classList.remove('is-flipping','is-completing');container.innerHTML='';showMeaningPanel();},4480);
  }
  function animateRevealParticles(){
    const canvas=$('#reveal-particle-canvas'),ctx=canvas.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx.scale(dpr,dpr);
    const sparks=Array.from({length:150},()=>({x:w/2+(Math.random()-.5)*w*.16,y:h*.72+(Math.random()-.5)*40,vx:(Math.random()-.5)*3.4,vy:-1-Math.random()*5,r:.5+Math.random()*2.6,a:.3+Math.random()*.7,life:70+Math.random()*90}));
    const start=performance.now();
    function frame(now){ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='lighter';for(const p of sparks){p.x+=p.vx;p.y+=p.vy;p.vy+=.016;p.life-=1;p.a*=.989;ctx.beginPath();ctx.fillStyle=`rgba(${Math.random()>.28?'218,178,95':'255,244,208'},${p.a})`;ctx.shadowBlur=14;ctx.shadowColor='#d5b470';ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}if(now-start<4400)requestAnimationFrame(frame);else ctx.clearRect(0,0,w,h);}requestAnimationFrame(frame);
  }
  function renderMeanings(){
    const roles=[["Past","过去"],["Present","现在"],["Possibility","可能性"]];
    $('#meaning-grid').innerHTML=selectedCards.map((card,index)=>`<section class="meaning-card"><span>${bilingual(...roles[index])}</span><b>${bilingual(card.name,card.zh)}</b><small>${card.keywords}</small><p>${card.meaning}</p><div class="meaning-depth"><h4>${bilingual('Shadow to notice','需要留意的阴影')}</h4><p>${card.shadow}</p><h4>${bilingual('Reflection','反思')}</h4><p>${card.reflection}</p></div></section>`).join('');
    const movement=bilingual(`${selectedCards[0].name} names the material you carry in. ${selectedCards[1].name} describes what is active now. ${selectedCards[2].name} is not a fixed prediction; it shows the quality that may become available through your next choices.`,`${selectedCards[0].zh} 指向你带入牌阵的经验；${selectedCards[1].zh} 描绘此刻活跃的力量；${selectedCards[2].zh} 并非固定预言，而是你下一步选择可能开启的品质。`);
    $('#reading-details').innerHTML=`<section class="reading-detail"><span>01</span><div><h4>${bilingual('How the spread moves','牌阵如何流动')}</h4><p>${movement}</p></div></section><section class="reading-detail"><span>02</span><div><h4>${bilingual('A grounded next step','一个可落实的下一步')}</h4><p>${selectedCards[2].practice}</p></div></section><section class="reading-detail"><span>03</span><div><h4>${bilingual('Keep the reading honest','让解读保持诚实')}</h4><p>${bilingual('Treat resonance as a prompt, not proof. Compare the symbols with observable facts, your values, and the consequences of acting.','把共鸣视为提示，而非证据。请将象征与可观察的事实、你的价值观及行动后果相互对照。')}</p></div></section>`;
  }
  function resetReading(withDissolve=true){
    if(withDissolve&&readingRevealed&&!readingSaved){const layer=$('#dissolve-layer');layer.classList.add('is-active');sound.cue('dissolve');setTimeout(()=>layer.classList.remove('is-active'),950);}
    setTimeout(()=>{$('#question-panel').hidden=false;$('#draw-panel').hidden=true;$('#meaning-panel').hidden=true;$('#question').value='';selectedCards=[];readingRevealed=false;readingSaved=false;},withDissolve?520:0);
  }
  function saveReading(){
    if(readingSaved){showToast(bilingual('This reading is already saved.','此解读已保存。'));return;}readingSaved=true;sound.cue('save');const flight=$('#pigeon-flight');flight.classList.add('is-active');
    sessions.unshift({title:bilingual('A Newly Kept Reading','新保存的解读'),date:new Intl.DateTimeFormat('en',{day:'2-digit',month:'short',year:'numeric'}).format(new Date()).toUpperCase(),cards:[...selectedCards.slice(0,2)],copy:$('#synthesis-copy').textContent});renderSessions();setTimeout(()=>flight.classList.remove('is-active'),3300);showToast(bilingual('Saved explicitly to the Reading Chamber.','已明确保存至占卜室。'));
  }
  async function exportReading(){
    if(!readingRevealed)return;
    const canvas=document.createElement('canvas'),exportScale=2;canvas.width=1600*exportScale;canvas.height=900*exportScale;const ctx=canvas.getContext('2d');ctx.scale(exportScale,exportScale);
    const bg=ctx.createRadialGradient(1090,390,80,820,430,900);bg.addColorStop(0,'#262626');bg.addColorStop(.45,'#101111');bg.addColorStop(1,'#030404');ctx.fillStyle=bg;ctx.fillRect(0,0,1600,900);
    ctx.fillStyle='rgba(238,232,218,.055)';ctx.fillRect(1035,492,565,270);ctx.fillStyle='rgba(238,232,218,.025)';ctx.fillRect(0,75,94,675);
    ctx.save();ctx.globalAlpha=.08;ctx.filter='blur(8px)';ctx.fillStyle='#eee8da';ctx.font='420px Georgia,serif';ctx.fillText('A',-80,520);ctx.font='350px Georgia,serif';ctx.fillText('R',360,880);ctx.restore();
    ctx.strokeStyle='rgba(238,232,218,.12)';ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(310,455,145+i*64,-1.1,2.1);ctx.stroke();}
    ctx.save();ctx.translate(35,728);ctx.rotate(-Math.PI/2);ctx.fillStyle='#d2d0ca';ctx.font='16px "JetBrains Mono",monospace';ctx.fillText('A PRIVATE READING FROM THE CELESTIAL ARCHIVE · LOCAL EXPORT',0,0);ctx.restore();
    ctx.fillStyle='#eee8da';ctx.font='700 18px "JetBrains Mono",monospace';ctx.fillText('THE CELESTIAL ARCHIVE',1320,58);ctx.font='13px "JetBrains Mono",monospace';ctx.fillStyle='#b89555';ctx.fillText('天 穹 秘 典',1420,84);
    const images=await Promise.all(selectedCards.map(card=>loadImage(card.src)));images.forEach((img,index)=>{ctx.save();ctx.translate(320+index*155,430+Math.abs(index-1)*42);ctx.rotate((index-1)*.13);ctx.shadowColor='rgba(0,0,0,.8)';ctx.shadowBlur=32;ctx.drawImage(img,-100,-150,200,300);ctx.restore();});
    ctx.fillStyle='#f0ede7';ctx.font='94px Georgia,serif';ctx.fillText('THE READING',870,230);ctx.font='72px Georgia,serif';ctx.fillText('BETWEEN WORLDS',872,305);ctx.fillStyle='#d7d2c7';ctx.font='52px "Noto Sans Mono CJK SC","PingFang SC",sans-serif';ctx.fillText('牌阵的回声',875,370);
    ctx.fillStyle='#d5b470';ctx.beginPath();ctx.arc(868,425,10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#eee8da';ctx.font='17px "JetBrains Mono",monospace';ctx.fillText(new Intl.DateTimeFormat('en',{day:'2-digit',month:'long',year:'numeric'}).format(new Date()).toUpperCase(),895,431);
    ctx.strokeStyle='rgba(238,232,218,.35)';ctx.beginPath();ctx.moveTo(1130,425);ctx.lineTo(1535,425);ctx.stroke();
    ctx.fillStyle='#eee8da';ctx.font='700 17px "JetBrains Mono",monospace';selectedCards.forEach((card,i)=>ctx.fillText(`${String(i+1).padStart(2,'0')}  ${card.name.toUpperCase()}`,875,510+i*44));
    ctx.fillStyle='#d5b470';ctx.font='700 15px "JetBrains Mono",monospace';ctx.fillText('SYNTHESIS / 综合解读',875,675);ctx.fillStyle='#eee8da';ctx.font='25px Georgia,serif';wrapText(ctx,$('#synthesis-copy').textContent,875,718,625,34,4);
    if($('#export-question').checked&&$('#question').value.trim()){ctx.fillStyle='#bfbcb5';ctx.font='14px "JetBrains Mono",monospace';wrapText(ctx,`QUESTION  ${$('#question').value.trim()}`,875,842,625,22,2);}
    drawGrain(ctx,1600,900);
    canvas.toBlob(blob=>{if(!blob){showToast('Export preview requires a local server.');return;}const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='celestial-archive-reading.png';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),5000);sound.cue('confirm');showToast(bilingual('Image report exported locally.','图片报告已导出至本地。'));},'image/png');
  }
  function drawGrain(ctx,width,height){const grain=document.createElement('canvas');grain.width=480;grain.height=270;const g=grain.getContext('2d'),data=g.createImageData(grain.width,grain.height);for(let i=0;i<data.data.length;i+=4){const n=Math.random()*255;data.data[i]=n;data.data[i+1]=n;data.data[i+2]=n;data.data[i+3]=Math.random()*52;}g.putImageData(data,0,0);ctx.save();ctx.globalAlpha=.21;ctx.globalCompositeOperation='screen';ctx.imageSmoothingEnabled=false;ctx.drawImage(grain,0,0,width,height);ctx.globalAlpha=.13;ctx.strokeStyle='#eee8da';for(let i=0;i<95;i++){const y=Math.random()*height,x=Math.random()*width,length=12+Math.random()*170;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(Math.min(width,x+length),y+(Math.random()-.5)*2);ctx.stroke();}ctx.restore();}
  function wrapText(ctx,text,x,y,maxWidth,lineHeight,maxLines=99){
    const tokens=String(text).match(/[\p{Script=Han}]|[^\s\p{Script=Han}]+|\s+/gu)||[];const lines=[];let line='';
    for(const token of tokens){const test=line+token;if(ctx.measureText(test).width>maxWidth&&line.trim()){lines.push(line.trim());line=token.trimStart();}else line=test;}
    if(line.trim())lines.push(line.trim());lines.slice(0,maxLines).forEach((value,index)=>ctx.fillText(value,x,y+index*lineHeight));
  }
  function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;});}
  async function copyReading(){
    const question=$('#copy-question').checked&&$('#question').value.trim()?`Question: ${$('#question').value.trim()}\n\n`:'';const text=question+selectedCards.map(card=>`${card.name}: ${card.meaning}`).join('\n\n')+`\n\nSynthesis: ${$('#synthesis-copy').textContent}`;try{await navigator.clipboard.writeText(text);sound.cue('confirm');showToast(bilingual('Meaning copied.','解读已复制。'));}catch{showToast(bilingual('Clipboard access needs a local server.','剪贴板功能需要本地服务器。'));}
  }

  function renderArcana(){
    const query=($('#card-search')?.value||'').toLowerCase(),filter=$('.filter-row .chip.is-active')?.dataset.filter||'all';$('#arcana-grid').innerHTML=cards.map(card=>{const visible=(filter==='all'||card.group===filter)&&`${card.name} ${card.zh} ${card.keywords}`.toLowerCase().includes(query);return `<button class="arcana-item" type="button" data-card="${card.id}" ${visible?'':'hidden'}><img src="${card.src}" alt="${card.name} tarot card proof"><b>${bilingual(card.name,card.zh)}</b><small>${card.code} · ${card.keywords}</small></button>`;}).join('');$$('.arcana-item').forEach(item=>item.addEventListener('click',()=>openCard(cards.find(card=>card.id===item.dataset.card))));
  }
  function openCard(card){
    const dialog=$('#card-dialog');$('#dialog-card').innerHTML=cardMarkup(card);$('#dialog-copy').innerHTML=`<p class="eyebrow">${card.code} · R1.0 FACE PROOF</p><h2>${bilingual(card.name,card.zh)}</h2><p class="dialog-keywords">${card.keywords}</p><p>${card.meaning}</p><div class="dialog-meaning-depth"><b>${bilingual('Shadow','阴影')}</b><p>${card.shadow}</p><b>${bilingual('Reflection','反思')}</b><p>${card.reflection}</p><b>${bilingual('Practice','行动')}</b><p>${card.practice}</p></div><button class="button" type="button" data-review-card="${card.id}">${bilingual('Review this art','审阅此卡面')}</button>`;dialog.showModal();revealScene(dialog);sound.cue('select');setTimeout(()=>{$('#dialog-card .tarot-card')?.classList.add('is-flipped');sound.cue('flip');},700);$('[data-review-card]',dialog).addEventListener('click',()=>{dialog.close();openDrawer('review');const index=cards.findIndex(c=>c.id===card.id),item=$(`[data-review-id="CARD-${String(index+1).padStart(2,'0')}"]`);item?.scrollIntoView({behavior:'smooth',block:'center'});});
  }

  function renderSessions(){
    $('#gallery-total').textContent=String(sessions.length).padStart(2,'0');$('#session-gallery').innerHTML=sessions.map((session,index)=>`<article class="session-card ${index===galleryIndex?'is-selected':''}" data-session="${index}"><div class="session-cards"><img src="${session.cards[0].src}" alt="${session.cards[0].name}"><img src="${session.cards[1].src}" alt="${session.cards[1].name}"></div><div class="session-copy"><span class="session-date">${session.date}</span><h3>${session.title}</h3><p>${session.copy}</p><button class="button ghost" type="button">${bilingual('Open reading','打开解读')}</button></div></article>`).join('');$$('.session-card').forEach(card=>card.addEventListener('click',()=>selectSession(Number(card.dataset.session))));selectSession(Math.min(galleryIndex,sessions.length-1),false);
  }
  function selectSession(index,scroll=true){galleryIndex=(index+sessions.length)%sessions.length;$$('.session-card').forEach((card,i)=>card.classList.toggle('is-selected',i===galleryIndex));$('#gallery-current').textContent=String(galleryIndex+1).padStart(2,'0');if(scroll)$$('.session-card')[galleryIndex]?.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});sound.cue('select');}

  function renderChapters(){
    const active=Number($('#chapter-list .is-active')?.dataset.chapter||0);$('#chapter-list').innerHTML=chapters.map((chapter,index)=>`<button class="chapter-button ${index===active?'is-active':''}" type="button" data-chapter="${index}"><span>0${index+1}</span>${bilingual(chapter.title,chapter.zh)}</button>`).join('');$$('.chapter-button').forEach(button=>button.addEventListener('click',()=>showChapter(Number(button.dataset.chapter))));showChapter(active,false);
  }
  function showChapter(index,withSound=true){$$('.chapter-button').forEach((button,i)=>button.classList.toggle('is-active',i===index));const chapter=chapters[index];$('#chapter-page').innerHTML=`<p class="eyebrow">CHAPTER 0${index+1} · ${chapter.zh}</p><h3>${bilingual(chapter.title,chapter.zh)}</h3><p>${chapter.copy}</p><blockquote>${chapter.quote}</blockquote><p class="eyebrow">MYSTERY TAROT · THE CELESTIAL ARCHIVE</p>`;if(withSound)sound.cue('select');}

  function openDrawer(name){const panel=$(`#${name}-panel`);panel.classList.add('is-open');panel.setAttribute('aria-hidden','false');if(name==='review')renderReview();revealScene(panel);sound.cue('select');}
  function closeDrawer(name){const panel=$(`#${name}-panel`);panel?.classList.remove('is-open');panel?.setAttribute('aria-hidden','true');}
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

  function setGestureStatus(en,zh){$('#gesture-status').textContent=bilingual(en,zh);}
  async function startGestureCamera(){
    if(gestureStream)return;if($('#draw-panel').hidden)beginRitual();
    try{gestureStream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:'user',width:{ideal:960},height:{ideal:540}}});const video=$('#gesture-video');video.srcObject=gestureStream;await video.play();previousGestureFrame=null;gestureFrames=0;gestureZone=-1;$('#hand-dialog .hand-stage').classList.add('is-live');$('#start-camera').hidden=true;$('#stop-camera').hidden=false;setGestureStatus('Camera live. Wave steadily inside one zone.','摄像头已开启。请在一个区域内稳定挥手。');gestureTimer=setInterval(analyzeGestureFrame,90);}
    catch(error){gestureStream=null;setGestureStatus('Camera unavailable or permission declined. Use Simulate selection instead.','摄像头不可用或权限被拒绝。请使用模拟选择。');showToast(bilingual('Camera permission was not granted.','未获得摄像头权限。'));}
  }
  function analyzeGestureFrame(){
    const video=$('#gesture-video');if(!gestureStream||video.readyState<2)return;const canvas=$('#gesture-analysis-canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.save();ctx.translate(canvas.width,0);ctx.scale(-1,1);ctx.drawImage(video,0,0,canvas.width,canvas.height);ctx.restore();const frame=ctx.getImageData(0,0,canvas.width,canvas.height).data,current=new Uint8Array(canvas.width*canvas.height);let movement=0,weightedX=0;
    for(let pixel=0,index=0;pixel<frame.length;pixel+=4,index++){const gray=(frame[pixel]*3+frame[pixel+1]*6+frame[pixel+2])/10;current[index]=gray;if(previousGestureFrame){const diff=Math.abs(gray-previousGestureFrame[index]);if(diff>24){movement++;weightedX+=index%canvas.width;}}}previousGestureFrame=current;const ratio=movement/current.length;if(ratio<.025){gestureFrames=Math.max(0,gestureFrames-1);$('#gesture-meter-fill').style.width=`${gestureFrames*12.5}%`;return;}
    const zone=Math.max(0,Math.min(2,Math.floor((weightedX/Math.max(1,movement))/canvas.width*3)));$$('.gesture-zones i').forEach((node,index)=>node.classList.toggle('is-active',index===zone));if(zone===gestureZone)gestureFrames++;else{gestureZone=zone;gestureFrames=1;}$('#gesture-meter-fill').style.width=`${Math.min(100,gestureFrames*12.5)}%`;
    if(gestureFrames>=8&&performance.now()>gestureCooldownUntil)commitGestureSelection(zone);
  }
  function commitGestureSelection(zone){gestureCooldownUntil=performance.now()+1300;gestureFrames=0;const available=$$('.deck-choice:not(.is-picked)');if(!available.length)return false;const index=Math.min(available.length-1,Math.floor((zone+.5)/3*available.length)),choice=available[index];pickCard(choice);const zoneNode=$(`.gesture-zones i[data-zone="${zone}"]`);zoneNode.classList.add('is-selected');setTimeout(()=>zoneNode.classList.remove('is-selected'),800);setGestureStatus(`Card ${selectedCards.length} of 3 selected. Keep waving.`,`已选择第 ${selectedCards.length} / 3 张牌。继续挥手。`);if(selectedCards.length===3){setGestureStatus('Three cards selected. The reading is ready.','三张牌已选定。解读已准备好。');setTimeout(()=>{$('#hand-dialog').close();stopGestureCamera();},850);}return true;}
  function stopGestureCamera(){if(gestureTimer){clearInterval(gestureTimer);gestureTimer=null;}gestureStream?.getTracks().forEach(track=>track.stop());gestureStream=null;const video=$('#gesture-video');if(video)video.srcObject=null;previousGestureFrame=null;gestureFrames=0;gestureZone=-1;$('#hand-dialog .hand-stage').classList.remove('is-live');$('#start-camera').hidden=false;$('#stop-camera').hidden=true;$('#gesture-meter-fill').style.width='0';$$('.gesture-zones i').forEach(node=>node.classList.remove('is-active','is-selected'));setGestureStatus('Camera frames stay on this device and are never stored or uploaded.','摄像头画面仅在本设备处理，不会保存或上传。');}

  $('#enter-button').addEventListener('click',enterArchive);
  $$('.route-control').forEach(button=>button.addEventListener('click',()=>navigate(button.dataset.route,button)));
  document.addEventListener('pointerdown',event=>{burstClick(event.clientX,event.clientY);if(event.target.closest('button,label,input,textarea'))sound.cue('tap');});
  $('#begin-ritual').addEventListener('click',beginRitual);$('#reveal-cards').addEventListener('click',revealReading);$('#save-reading').addEventListener('click',saveReading);$('#export-reading').addEventListener('click',exportReading);$('#copy-reading').addEventListener('click',copyReading);$('#new-reading').addEventListener('click',()=>resetReading(true));$('#close-meaning').addEventListener('click',()=>resetReading(true));
  $('#card-search').addEventListener('input',renderArcana);$$('.filter-row .chip').forEach(button=>button.addEventListener('click',()=>{$$('.filter-row .chip').forEach(item=>item.classList.remove('is-active'));button.classList.add('is-active');renderArcana();}));
  $('#gallery-prev').addEventListener('click',()=>selectSession(galleryIndex-1));$('#gallery-next').addEventListener('click',()=>selectSession(galleryIndex+1));
  $('#session-gallery').addEventListener('keydown',event=>{if(event.key==='ArrowLeft')selectSession(galleryIndex-1);if(event.key==='ArrowRight')selectSession(galleryIndex+1);});
  $('#settings-toggle').addEventListener('click',()=>openDrawer('settings'));$('#review-toggle').addEventListener('click',()=>openDrawer('review'));$$('.close-drawer').forEach(button=>button.addEventListener('click',()=>closeDrawer(button.dataset.close)));
  $$('#language-control button').forEach(button=>button.addEventListener('click',()=>applyLanguage(button.dataset.language)));$('#music-setting').addEventListener('change',event=>sound.music=event.target.checked);$('#sfx-setting').addEventListener('change',event=>sound.sfx=event.target.checked);$('#motion-setting').addEventListener('change',event=>document.documentElement.dataset.motion=event.target.checked?'on':'off');$('#hand-setting').addEventListener('change',event=>$('#hand-ritual').hidden=!event.target.checked);$('#opening-setting').addEventListener('change',event=>localStorage.setItem('celestial-opening',event.target.checked?'on':'off'));
  $('#sound-toggle').addEventListener('click',()=>{const enabled=sound.music||sound.sfx;sound.music=!enabled;sound.sfx=!enabled;$('#music-setting').checked=!enabled;$('#sfx-setting').checked=!enabled;$('#sound-toggle').textContent=!enabled?'♫':'∅';showToast(!enabled?'Sound on':'Sound off');});
  $('#hand-ritual').addEventListener('click',()=>{$('#hand-dialog').showModal();startGestureCamera();});$('#start-camera').addEventListener('click',startGestureCamera);$('#stop-camera').addEventListener('click',stopGestureCamera);$('#simulate-gesture').addEventListener('click',()=>{stopGestureCamera();$('#hand-dialog').close();if($('#draw-panel').hidden)beginRitual();setTimeout(()=>{const choices=$$('.deck-choice:not(.is-picked)');choices.slice(0,3).forEach((choice,index)=>setTimeout(()=>choice.click(),index*320));},400);});
  $$('.dialog-close').forEach(button=>button.addEventListener('click',()=>{const dialog=button.closest('dialog');if(dialog.id==='hand-dialog')stopGestureCamera();dialog.close();}));$$('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){if(dialog.id==='hand-dialog')stopGestureCamera();dialog.close();}}));
  $$('.review-filters .chip').forEach(button=>button.addEventListener('click',()=>{$$('.review-filters .chip').forEach(item=>item.classList.remove('is-active'));button.classList.add('is-active');reviewFilter=button.dataset.reviewFilter;renderReview();}));
  $('#approve-visible').addEventListener('click',()=>{reviewItems.filter(item=>reviewFilter==='all'||item.status===reviewFilter).forEach(item=>item.status='approved');renderReview();sound.cue('confirm');});$('#export-decisions').addEventListener('click',exportDecisions);

  $('#opening-skip').addEventListener('click',finishOpening);addEventListener('resize',resizeClickCanvas);document.documentElement.dataset.motion='on';resizeClickCanvas();animateClickParticles();runOpeningSequence();renderArcana();renderSessions();renderChapters();applyLanguage('bilingual');updateReviewCount();window.__celestialCamera={start:startGestureCamera,stop:stopGestureCamera,testZone:commitGestureSelection,get active(){return Boolean(gestureStream);}};
})();
