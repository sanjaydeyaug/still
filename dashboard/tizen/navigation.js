/* A single glass selection follows navigation focus and the current page. */
(function(){
'use strict';
var nav=document.querySelector('header nav');
if(!nav)return;
var pill=document.createElement('span'),ready=false,pending=false,lastTarget=null;
pill.className='nav-selection';pill.setAttribute('aria-hidden','true');nav.insertBefore(pill,nav.firstChild);
function update(){
 pending=false;
 var focused=document.activeElement;
 var hasFocus=nav.contains(focused)&&focused.matches('.nav');
 nav.classList.toggle('nav-focused',hasFocus);
 var target=hasFocus?focused:nav.querySelector('.nav.active');
 if(!target)return;
 if(target===lastTarget&&ready)return;lastTarget=target;
 var box=target.getBoundingClientRect(),host=nav.getBoundingClientRect();
 if(!box.width)return;
 nav.querySelectorAll('.nav').forEach(function(button){button.classList.toggle('nav-highlighted',button===target);});
 if(!ready)pill.classList.add('nav-selection-snap');
 pill.style.width=box.width+'px';pill.style.height=box.height+'px';
 pill.style.transform='translate3d('+(box.left-host.left-nav.clientLeft)+'px,'+(box.top-host.top-nav.clientTop)+'px,0)';
 if(!ready){pill.getBoundingClientRect();pill.classList.remove('nav-selection-snap');ready=true;nav.classList.add('nav-motion-ready');}
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
nav.addEventListener('focusin',schedule);nav.addEventListener('focusout',schedule);
new MutationObserver(function(changes){if(changes.some(function(change){return change.attributeName==='aria-current';}))schedule();}).observe(nav,{subtree:true,attributes:true,attributeFilter:['aria-current']});
function resize(){lastTarget=null;schedule();}
window.addEventListener('resize',resize);
if(window.ResizeObserver)new ResizeObserver(resize).observe(nav);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(resize);
update();
})();
