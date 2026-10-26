import React from 'react';
import {AbsoluteFill,Sequence,useCurrentFrame,useVideoConfig,interpolate,Easing,CanvasImage,staticFile} from 'remotion';
const gold='#d6bd82', paper='#f1dfb7';
const ease=Easing.bezier(.22,1,.36,1);
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const,easing:ease};
const Hand=({pose,close}:{pose:'open'|'point'|'pinch';close:number})=>{
 const pin=pose==='pinch'?close:0;
 return <svg viewBox="0 0 420 440" width="490" height="510" style={{overflow:'visible'}}>
 <g fill="none" stroke="#f1dfb7" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round">
 {pose!=='pinch'&&<path d="M132 375 L125 288 Q113 245 100 220 L69 178 Q58 162 72 152 Q85 144 99 159 L139 202"/>}
 {pose!=='pinch'&&<path d="M139 220 L133 100 Q133 77 151 77 Q169 77 170 99 L176 218"/>}
 {pose==='open'?<><path d="M183 209 L182 62 Q182 41 201 41 Q219 41 219 64 L222 212"/><path d="M232 216 L235 84 Q235 62 253 65 Q272 66 272 89 L272 235"/><path d="M282 240 L291 134 Q293 115 310 118 Q326 121 324 143 L316 272 Q315 331 277 375"/></>:<><path d="M185 218 Q177 172 193 166 Q214 162 218 210"/><path d="M230 224 Q223 185 239 180 Q257 175 263 223"/><path d="M276 237 Q274 209 291 210 Q308 211 310 245 L308 284 Q306 339 277 375"/></>}
 </g>
 <path d="M132 375 L125 288 L139 204 L175 218 L222 212 L272 235 L310 254 L308 284 Q306 339 277 375 Z" fill={paper}/>
 {pose==='pinch'&&<g><path d={`M139 220 Q${90+pin*30} ${164-pin*15} ${112+pin*41} ${138-pin*6}`} fill="none" stroke={paper} strokeWidth="30" strokeLinecap="round"/><path d={`M151 216 Q${205-pin*32} 111 ${195-pin*42} ${102+pin*30}`} fill="none" stroke={paper} strokeWidth="30" strokeLinecap="round"/></g>}
 <path d="M163 286 Q206 258 263 278 M170 308 Q212 290 247 301" stroke="#b79b6c" strokeWidth="3" fill="none"/>
 <path d="M132 375 L132 410 L277 410 L277 375" stroke={gold} strokeWidth="3" fill="#263232"/>
 </svg>;
};
const Lesson=({step,title,zh,enCaption,zhCaption}:{step:number;title:string;zh:string;enCaption:string;zhCaption:string})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();const seconds=f/fps;
 const pinch=interpolate(f,[fps,2*fps,3.3*fps,4.3*fps],[0,1,1,0],clamp);
 const selected=step===2&&seconds>2.3;
 const count=step===3?Math.min(3,Math.floor(seconds/1.5)):selected?1:0;
 return <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 45%,#2a3534,#101718 75%)',color:paper,fontFamily:'Arial, CJK, sans-serif'}}>
 <div style={{position:'absolute',inset:40,border:'1px solid #b99b5a66'}}/>
 <div style={{position:'absolute',top:70,left:96,fontSize:20,letterSpacing:5,color:gold}}>THE CELESTIAL ARCHIVE / HAND RITUAL</div>
 <div style={{position:'absolute',top:128,left:96,right:96,display:'flex',alignItems:'baseline',gap:30}}><span style={{fontSize:32,color:gold}}>0{step+1}</span><h1 style={{fontFamily:'Display, Georgia, serif',fontWeight:400,fontSize:88,margin:0}}>{title}</h1><span style={{fontFamily:'CJK, serif',fontSize:38,color:gold}}>{zh}</span></div>
 <div style={{position:'absolute',left:180,top:300,translate:step===0?`${Math.sin(seconds*Math.PI/2)*70}px 0px`:'0px 0px',opacity:interpolate(f,[0,.35*fps],[.3,1],clamp)}}>
 <div style={{position:'absolute',width:490,height:490,border:'1px solid #d6bd8233',borderRadius:'50%',top:5,left:0}}/>
 <Hand pose={step===0||step===3?'open':step===1?'point':'pinch'} close={pinch}/>
 {step===2&&<div style={{position:'absolute',left:132,top:116,width:94,height:94,border:`3px solid ${gold}`,borderRadius:'50%',opacity:pinch,scale:interpolate(pinch,[0,1],[1.2,1])}}/>}
 </div>
 <div style={{position:'absolute',top:332,left:960,right:130,height:430}}>
 <div style={{display:'flex',justifyContent:'space-between',fontSize:22,letterSpacing:3,color:gold}}><span>{step===3?'YOUR THREE CARDS':'SHUFFLED DECK'}</span><span>{count} / 3</span></div>
 <div style={{display:'flex',gap:24,marginTop:40,translate:step===0?`${Math.sin(seconds*Math.PI/2)*-40}px 0px`:'0px 0px'}}>{[0,1,2].map(i=><div key={i} style={{position:'relative',width:180,height:270,translate:(selected&&i===1)||(step===3&&i<count)?'0px -24px':'0px 0px',border:`${(selected&&i===1)||(step===3&&i<count)?3:1}px solid ${gold}`,borderRadius:8,boxShadow:((selected&&i===1)||(step===3&&i<count))?'0 0 32px #d6bd8244':'0 20px 30px #0006'}}><CanvasImage src={staticFile('card-back.webp')} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:7}}/>{step===1&&i===1&&<div style={{position:'absolute',inset:65,border:'2px solid #f1dfb7',borderRadius:'50%',display:'grid',placeItems:'center',fontSize:45}}>+</div>}</div>)}</div>
 </div>
 <div style={{position:'absolute',left:120,right:120,bottom:108,textAlign:'center',background:'#0009',padding:'22px 28px',borderRadius:8,fontSize:40,lineHeight:1.4,color:'#fff'}}><div>{enCaption}</div><div style={{fontFamily:'CJK',fontSize:30,marginTop:8}}>{zhCaption}</div></div>
 <div style={{position:'absolute',bottom:60,left:96,right:96,display:'flex',gap:12}}>{[0,1,2,3].map(i=><div key={i} style={{height:3,flex:1,background:i<=step?gold:'#d6bd8222'}}/>)}</div>
 </AbsoluteFill>;
};
export const HandRitualTutorial=()=>{const {fps}=useVideoConfig();return <AbsoluteFill><style>{`@font-face{font-family:Display;src:url('${staticFile('display.woff2')}')}@font-face{font-family:CJK;src:url('${staticFile('cjk.ttf')}')}`}</style>
<Sequence name="Open palm browses" from={0} durationInFrames={6*fps}><Lesson step={0} title="Open & browse" zh="张掌浏览" enCaption="Move your open palm gently left or right." zhCaption="张开手掌，轻轻左右移动浏览牌组。"/></Sequence>
<Sequence name="One finger aims" from={6*fps} durationInFrames={6*fps}><Lesson step={1} title="Point & aim" zh="食指瞄准" enCaption="Extend one finger to aim at a card." zhCaption="伸出一根食指，瞄准想选的牌。"/></Sequence>
<Sequence name="Pinch selects once" from={12*fps} durationInFrames={6*fps}><Lesson step={2} title="Pinch & select" zh="捏合选牌" enCaption="Pinch and hold briefly. One pinch selects one card." zhCaption="捏合并短暂停留，一次捏合选取一张牌。"/></Sequence>
<Sequence name="Release then repeat" from={18*fps} durationInFrames={6*fps}><Lesson step={3} title="Open & repeat" zh="松开再选" enCaption="Open fully before the next pinch. Choose three cards." zhCaption="完全张开手后再次捏合，共选三张牌。"/></Sequence>
</AbsoluteFill>};
