const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('app/app.js', 'utf8');
const start = source.indexOf('  function loadSessions(){');
const end = source.indexOf('\n  function sessionRecord', start);
assert(start >= 0 && end > start, 'loadSessions source markers must remain present');

let stored = JSON.stringify([
  {id:'legacy',title:'Saved reading',date:'2026-01-01',cards:[{id:'A'},{id:'B',reversed:true},{id:'C'}]},
  null,
  {id:'incomplete',cards:[{id:'A'}]},
]);
let failWrite = true;
let writes = 0;
const context = vm.createContext({
  archiveKey:'sessions',
  cardById:new Map([['A',{id:'A'}],['B',{id:'B'}],['C',{id:'C'}]]),
  deck:{meaningEdition:'test-edition'},
  logic:{isReversed:card=>Boolean(card.reversed),synthesizeReading:()=>({en:'Reading',zh:'解读',movement:{},action:{}})},
  localStorage:{
    getItem:()=>stored,
    setItem:(_key,value)=>{writes++;if(failWrite)throw Error('storage full');stored=value;},
  },
  sessionRecord:session=>({id:session.id,snapshotVersion:2,snapshot:session.snapshot}),
});
vm.runInContext(`${source.slice(start,end)}\nthis.loadSessions=loadSessions;`, context);

let loaded = context.loadSessions();
assert.equal(loaded.length, 1, 'a bad record must not hide a valid saved reading');
assert.equal(loaded[0].snapshotVersion, 2);
assert.equal(loaded[0].snapshot.legacy, true);
assert.equal(writes, 1);
assert.equal(JSON.parse(stored)[0].snapshotVersion, undefined, 'failed migration write must leave original storage intact');

failWrite = false;
loaded = context.loadSessions();
assert.equal(loaded.length, 1);
assert.equal(JSON.parse(stored).length, 1, 'migration should persist valid readings when storage is available');
assert.equal(JSON.parse(stored)[0].snapshotVersion, 2);
console.log('PASS: malformed records and failed migration writes preserve readable saved sessions.');
