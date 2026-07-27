(() => {
  const data = window.R1_CATALOG;
  const all = [data.back, ...data.cards];
  const labels = {all:'All 79',back:'Card back',major:'Major 22',wands:'Wands 14',cups:'Cups 14',swords:'Swords 14',pentacles:'Pentacles 14'};
  const decisions = new Map(all.map(card => [card.id, 'approved']));
  let filter = 'all';
  let query = '';
  let visible = all;
  let activeIndex = 0;
  let toastTimer;
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

  const filters = $('#filters');
  Object.entries(labels).forEach(([value,label]) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = label; button.dataset.filter = value;
    button.classList.toggle('is-active', value === filter);
    button.addEventListener('click', () => { filter=value; $$('.filters button').forEach(item=>item.classList.toggle('is-active',item===button)); render(); });
    filters.append(button);
  });

  function normalized(card){return `${card.id} ${card.nameEn} ${card.nameZh} ${card.motif} ${card.rationale}`.toLowerCase();}
  function render(){
    visible = all.filter(card => (filter==='all'||card.group===filter) && (!query||normalized(card).includes(query)));
    $('#catalog').innerHTML = visible.map((card,index)=>`<button class="card" type="button" style="--i:${Math.min(index,28)}" data-id="${card.id}" data-decision="${decisions.get(card.id)||''}" aria-label="Review ${card.nameEn}"><span class="card-art"><img src="${card.file}" alt="${card.nameEn} tarot illustration" loading="lazy"><i class="card-state"></i></span><span class="card-meta"><small>${card.id} · ${card.status==='approved_anchor'?'PROOF ANCHOR':'NEW ORIGINAL'}</small><b>${card.nameEn}</b><span>${card.nameZh}</span></span></button>`).join('');
    $$('.card').forEach((node,index)=>node.addEventListener('click',()=>openDetail(index)));
    $('#empty').hidden = visible.length !== 0;
  }

  function openDetail(index){activeIndex=(index+visible.length)%visible.length;fillDetail();$('#detail').showModal();}
  function fillDetail(){
    const card=visible[activeIndex]; if(!card)return;
    $('#detail-image').src=card.file; $('#detail-image').alt=`${card.nameEn} tarot illustration`;
    $('#detail-id').textContent=`${card.id} · ${card.group.toUpperCase()}`; $('#detail-name').textContent=card.nameEn; $('#detail-zh').textContent=card.nameZh;
    $('#detail-motif').textContent=card.motif; $('#detail-rationale').textContent=card.rationale;
    $('#detail-asset').textContent=card.status==='approved_anchor'?'Approved R1 proof anchor':'New original · internal visual QA passed';
    $('#detail-hash').textContent=card.sha256; $('#detail-state').textContent=(decisions.get(card.id)||'not reviewed').toUpperCase();
    $$('.choice button').forEach(button=>button.classList.toggle('is-active',button.dataset.choice===decisions.get(card.id)));
  }
  function decide(choice){const card=visible[activeIndex];decisions.set(card.id,choice);fillDetail();const tile=$(`.card[data-id="${card.id}"]`);if(tile)tile.dataset.decision=choice;updateProgress();burst(innerWidth/2,innerHeight*.75);}
  function updateProgress(){
    const approved=[...decisions.values()].filter(v=>v==='approved').length;
    const revise=[...decisions.values()].filter(v=>v==='revise').length;
    $('#review-count').textContent=`${decisions.size} / ${all.length} reviewed`;$('#approved-count').textContent=`${approved} approved`;$('#revise-count').textContent=`${revise} marked revise`;$('#progress').style.width=`${decisions.size/all.length*100}%`;
  }
  function reviewPayload(){return {catalog:data.version,createdAt:new Date().toISOString(),catalogApprovedAt:data.catalogApprovedAt,productionAuthorized:data.productionAuthorized,gate:'Complete catalog explicitly approved; production integration and release QA next',totals:{reviewed:decisions.size,approved:[...decisions.values()].filter(v=>v==='approved').length,revise:[...decisions.values()].filter(v=>v==='revise').length},decisions:all.filter(card=>decisions.has(card.id)).map(card=>({id:card.id,name:card.nameEn,nameZh:card.nameZh,decision:decisions.get(card.id)}))};}
  function showToast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('is-visible');toastTimer=setTimeout(()=>$('#toast').classList.remove('is-visible'),2200);}
  function downloadReview(){const blob=new Blob([JSON.stringify(reviewPayload(),null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='celestial-archive-r1-review.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast('Review JSON exported locally');}
  async function copySummary(){const p=reviewPayload();const text=`R1 catalog review: ${p.totals.approved} approved, ${p.totals.revise} revise, ${all.length-p.totals.reviewed} unreviewed. Production integration authorized by explicit second-gate approval.`;try{await navigator.clipboard.writeText(text);showToast('Approval summary copied');}catch{showToast(text);}}

  $('#search').addEventListener('input',event=>{query=event.target.value.trim().toLowerCase();render();});
  $('.close').addEventListener('click',()=>$('#detail').close());
  $('.prev').addEventListener('click',()=>{activeIndex=(activeIndex-1+visible.length)%visible.length;fillDetail();});
  $('.next').addEventListener('click',()=>{activeIndex=(activeIndex+1)%visible.length;fillDetail();});
  $$('.choice button').forEach(button=>button.addEventListener('click',()=>decide(button.dataset.choice)));
  $('#export-decisions').addEventListener('click',downloadReview);$('#copy-summary').addEventListener('click',copySummary);
  document.addEventListener('keydown',event=>{if(!$('#detail').open)return;if(event.key==='ArrowLeft')$('.prev').click();if(event.key==='ArrowRight')$('.next').click();});

  const canvas=$('#particles'),ctx=canvas.getContext('2d');let particles=[];
  function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;canvas.style.width=`${innerWidth}px`;canvas.style.height=`${innerHeight}px`;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}resize();addEventListener('resize',resize);
  function burst(x,y){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<15;i++){const a=Math.random()*Math.PI*2,s=1.5+Math.random()*4;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-.8,life:1,size:1+Math.random()*2,color:i%4===0?'#eadfca':i%5===0?'#b88478':'#d2b477'})}}
  document.addEventListener('pointerdown',event=>{if(event.target.closest('button,a'))burst(event.clientX,event.clientY)});
  function animate(){ctx.clearRect(0,0,innerWidth,innerHeight);particles=particles.filter(p=>p.life>0);particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.05;p.life-=.025;ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fill()});ctx.globalAlpha=1;requestAnimationFrame(animate)}animate();
  render();updateProgress();
})();
