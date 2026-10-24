(() => {
  'use strict';
  const presets = {
    topic: {work:['Work & study','工作与学习'],creative:['Creative projects','创作项目'],growth:['Personal growth','个人成长']},
    situation: {choice:['Choosing between options','在选项之间作选择'],stuck:['Feeling stuck','感到停滞'],change:['Starting a change','开始改变']},
    clarity: {next:['A practical next step','可落实的下一步'],obstacle:['What to examine','需要审视什么'],perspective:['A different perspective','不同的视角']}
  };
  function validateRequest(value, cards) {
    if (!value || Object.keys(value).sort().join(',') !== 'cards,clarity,consent,situation,topic' || value.consent !== true) throw Error('Invalid request');
    for (const key of Object.keys(presets)) if (!Object.hasOwn(presets[key],value[key])) throw Error('Invalid preset');
    if (!Array.isArray(value.cards) || value.cards.length !== 3 || new Set(value.cards.map(card=>card.id)).size !== 3) throw Error('Invalid cards');
    for (const card of value.cards) if (Object.keys(card).sort().join(',') !== 'id,reversed' || typeof card.reversed !== 'boolean' || !cards.some(item=>item.id===card.id)) throw Error('Invalid card');
    return value;
  }
  function payload(cards, choices) {
    return {topic:choices.topic,situation:choices.situation,clarity:choices.clarity,consent:true,cards:cards.map(card=>({id:card.id,reversed:Boolean(card.isReversed)}))};
  }
  function validateResult(result) {
    if (!result || Object.keys(result).sort().join(',') !== 'en,zh') throw Error('Invalid reading');
    for (const [key,max] of [['en',450],['zh',180]]) if (typeof result[key]!=='string' || !result[key].trim() || result[key].length>max || /[<>\u0000-\u0008]/.test(result[key])) throw Error('Invalid reading');
    return {en:result.en.trim(),zh:result.zh.trim()};
  }
  globalThis.CELESTIAL_AI = Object.freeze({presets,payload,validateRequest,validateResult});
})();
