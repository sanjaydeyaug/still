const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function load(file,extras={}){const c={window:{},...extras};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tizen',file),'utf8'),c);return c.window;}
test('preferences tolerate corrupt and unavailable storage, preserve settings, and normalize IDs',()=>{
 const api=load('preferences.js').StillPreferences;let saved='';
 for(const value of ['null','[]','42','"hello"','{broken'])assert.deepEqual(JSON.parse(JSON.stringify(api.create({storage:()=>({getItem:()=>value})}).read())),{hiddenIds:[]});
 const store=api.create({storage:()=>({getItem:()=>JSON.stringify({theme:'warm',futureSetting:true,favoriteIds:['one','one',null,3,''],hiddenIds:'bad'}),setItem:(key,value)=>{assert.equal(key,'still-prefs');saved=value;}})});
 const prefs=store.read();assert.equal(prefs.theme,'warm');assert.equal(prefs.futureSetting,true);assert.equal(JSON.stringify(prefs.favoriteIds),'["one"]');assert.equal(store.write(prefs),true);assert.deepEqual(JSON.parse(saved),JSON.parse(JSON.stringify(prefs)));
 let errors=0;const unavailable=api.create({storage(){throw Error('denied');},onError(){errors++;}});assert.equal(unavailable.read().hiddenIds.length,0);assert.equal(unavailable.write({room:'Home'}),false);assert.equal(errors,1);
});
test('catalog excludes the injected current application identity',()=>{
 const catalog=load('catalog.js').StillCatalog;
 assert.equal(catalog.normalize([{id:'NewApp1234.Dashboard',name:'Still',show:true}],'NewApp1234.Dashboard').length,0);
});
test('directional focus respects dialog scope, visibility and directional geometry',()=>{
 const next=load('spatial-focus.js').StillFocus.next;
 const element=(x,y,visible=true)=>({getClientRects:()=>visible?[{}]:[],getBoundingClientRect:()=>({left:x,top:y,width:20,height:20})});
 const current=element(0,0),right=element(100,0),diagonal=element(20,100),hidden=element(30,0,false),left=element(-50,0),scope={querySelectorAll:()=>[current,right,diagonal,hidden,left]};
 assert.equal(next(scope,current,[1,0]),right);assert.equal(next(scope,current,[-1,0]),left);assert.equal(next(scope,current,[0,-1]),null);assert.equal(next(scope,{},[1,0]),current);
});
test('clock start is idempotent and suspends its timer while hidden',()=>{
 let pending=new Map(),id=0;const document={hidden:false};
 const api=load('clock.js',{document,setTimeout:(fn,delay)=>{pending.set(++id,{fn,delay});return id;},clearTimeout:key=>pending.delete(key)}).StillClock;
 const clock=api.create({element:()=>({style:{}}),text(){},hour24:()=>false});
 clock.start();clock.start();assert.equal(pending.size,1);assert.ok([...pending.values()][0].delay>0);document.hidden=true;clock.start();assert.equal(pending.size,0);document.hidden=false;clock.start();clock.stop();assert.equal(pending.size,0);
});
test('entry page loads every extracted dependency before the application',()=>{
 const html=fs.readFileSync(path.join(__dirname,'../tizen/index.html'),'utf8');
 for(const name of ['catalog','preferences','clock','spatial-focus']){const index=html.indexOf('src="'+name+'.js');assert.ok(index>=0&&index<html.indexOf('src="app.js'));}
});
test('Up from every theme follows Automatic Appearance instead of the top Settings tab',()=>{
 const next=load('spatial-focus.js').StillFocus.next;
 const element=(id,x,y,width=100)=>({id,getClientRects:()=>[{}],getBoundingClientRect:()=>({left:x,top:y,width,height:50})});
 const automatic=element('auto-appearance',700,300,900),nav=element('top-settings',1500,80);
 for(const x of [700,950,1200,1450]){
  const theme=element('theme',x,400);theme.getAttribute=name=>name==='data-focus-up'?'auto-appearance':null;
  assert.equal(next({querySelectorAll:()=>[nav,automatic,theme]},theme,[0,-1]),automatic);
  automatic.getClientRects=()=>[];
  assert.equal(next({querySelectorAll:()=>[nav,automatic,theme]},theme,[0,-1]),nav);
  automatic.getClientRects=()=>[{}];
 }
});
