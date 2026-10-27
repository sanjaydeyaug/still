const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup(){const c={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../tizen/spatial-focus.js'),'utf8'),c);return c.window.StillFocus.next;}
function control(id,x,y,width=100,height=50,groups={},attrs={}){return {id,getClientRects:()=>[{}],getBoundingClientRect:()=>({left:x,top:y,width,height}),getAttribute:key=>attrs[key]||null,closest:selector=>groups[selector]||null};}
function scope(elements){return {querySelectorAll:()=>elements};}
test('vertical movement visits the immediate row despite far-apart horizontal centers',()=>{
 const next=setup(),a=control('current',1400,500),near=control('previous-row',700,400,900),far=control('nav',1400,50);
 assert.equal(next(scope([a,near,far]),a,[0,-1]),near);
 assert.equal(next(scope([a,near,far]),far,[0,1]),near);
});
test('grid Up and Down do not drift sideways within a scaled row',()=>{
 const next=setup(),current=control('current',500,500,100,50),same=control('same-row',650,495,110,60),above=control('above',500,350),below=control('below',500,650);
 assert.equal(next(scope([current,same,above,below]),current,[0,-1]),above);
 assert.equal(next(scope([current,same,above,below]),current,[0,1]),below);
});
test('content returns to its own tab only after the first control',()=>{
 const next=setup(),page={id:'search-view'},groups={'.view':page};
 const field=control('search-input',700,300,900,50,groups),result=control('result',1400,500,100,50,groups),search=control('search-tab',1000,50,100,50,{}, {'data-view':'search'}),settings=control('settings-tab',1400,50);
 const s=scope([field,result,search,settings]);
 assert.equal(next(s,result,[0,-1]),field);assert.equal(next(s,field,[0,-1]),search);
});
test('Settings stays in its detail column instead of visiting a sidebar row',()=>{
 const next=setup(),page={id:'settings-view'},sidebar={},region={};
 const groups={'.view':page,'.settings-pane,.settings-categories,#library,#favorites,#results,.search-box,.page-actions,.system-grid,.volume-row':region};
 const current=control('last',1000,600,600,50,groups),previous=control('previous',700,500,900,50,groups),category=control('category',1000,550,100,30,{'.view':page,'.settings-sidebar':sidebar});
 assert.equal(next(scope([current,previous,category]),current,[0,-1]),previous);
});
test('dialog navigation cannot escape its supplied scope',()=>{
 const next=setup(),field=control('field',0,200,400),button=control('save',300,400),s=scope([field,button]);
 assert.equal(next(s,button,[0,-1]),field);assert.equal(next(s,field,[0,-1]),null);
});
test('two rows of themes navigate one row at a time before Automatic Appearance',()=>{
 const next=setup(),automatic=control('auto',700,300,900),topLeft=control('black',700,400,400),topRight=control('charcoal',1200,400,400),bottomLeft=control('warm',700,500,400),bottomRight=control('light',1200,500,400),s=scope([automatic,topLeft,topRight,bottomLeft,bottomRight]);
 assert.equal(next(s,bottomLeft,[0,-1]),topLeft);assert.equal(next(s,bottomRight,[0,-1]),topRight);
 assert.equal(next(s,topLeft,[0,-1]),automatic);assert.equal(next(s,topRight,[0,-1]),automatic);
});
test('Search results return to the text field, and store returns to its Apps parent',()=>{
 const next=setup(),searchPage={id:'search-view'},shelf={},field=control('search-input',0,200,600),clear=control('clear',700,200),result=control('result',700,400,100,50,{'.view':searchPage,'#results':shelf});
 assert.equal(next(scope([field,clear,result]),result,[0,-1]),field);
 const page={id:'store-view',getAttribute:()=> 'apps'},store=control('store',700,400,100,50,{'.view':page}),apps=control('apps',300,50,100,50,{}, {'data-view':'apps'}),home=control('home',700,50,100,50,{}, {'data-view':'home'});
 assert.equal(next(scope([home,apps,store]),store,[0,-1]),apps);
});
