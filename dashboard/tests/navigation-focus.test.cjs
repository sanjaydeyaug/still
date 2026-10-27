const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('top navigation switches on focus without moving focus into the page or reloading the active page',()=>{
 const source=fs.readFileSync(require.resolve('../tizen/app.js'),'utf8');
 const binding=source.split('\n').find(line=>line.startsWith("document.querySelectorAll('[data-view]').forEach"));
 const buttons=['home','apps','search','settings'].map(view=>({dataset:{view}})),calls=[];
 const context={document:{querySelectorAll:()=>buttons},view:'home',switchView(next,focus){calls.push([next,focus]);context.view=next;}};
 vm.runInNewContext(binding,context);
 buttons[0].onfocus();assert.equal(calls.length,0);
 for(const button of buttons.slice(1))button.onfocus();
 assert.deepEqual(calls,[['apps',false],['search',false],['settings',false]]);
 buttons[3].onfocus();assert.equal(calls.length,3);
 buttons[0].onclick();assert.equal(calls[3][0],'home');
});
