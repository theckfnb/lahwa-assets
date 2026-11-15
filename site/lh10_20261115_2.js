if(window.ScrollTrigger)ScrollTrigger.config({ignoreMobileResize:true});
const __P=s=>s.split(',').map(x=>'.lh10 '+x.trim()).join(',');const __q=s=>document.querySelector(__P(s)),__Q=s=>document.querySelectorAll(__P(s));
/* fix1114s 매장 사진 멈추지 않고 계속 흐름 */
  (function(){
    var tr=__q('#store .st-track'); if(!tr) return;
    var bar=__q('#store .st-bar i'), cnt=__q('#store .st-cnt'), hold=0, N=tr.children.length;
    [].slice.call(tr.children).forEach(function(c){var k=c.cloneNode(true);k.setAttribute('aria-hidden','true');tr.appendChild(k)});
    tr.style.scrollSnapType='none';tr.style.scrollBehavior='auto';
    function period(){var a=tr.children[0],b=tr.children[N];return (b&&a)?(b.offsetLeft-a.offsetLeft):tr.scrollWidth/2}
    function step(){return tr.clientWidth+parseFloat(getComputedStyle(tr).columnGap||0)}
    var pos=0,last=0;
    function wrap(){var P=period();if(P>0){while(pos>=P)pos-=P;while(pos<0)pos+=P}}
    function upd(){var P=period();var f=P>0?(pos%P)/P:0;bar.style.width=(10+90*f)+'%';var n=Math.min(N,Math.floor(f*N)+1);cnt.textContent=(n<10?'0':'')+n+' / '+N}
    ['pointerdown','touchstart','wheel'].forEach(function(e){tr.addEventListener(e,function(){hold=Date.now()},{passive:true})});
    tr.addEventListener('scroll',function(){if(Date.now()-hold<1500){pos=tr.scrollLeft;wrap();if(Math.abs(tr.scrollLeft-pos)>2)tr.scrollLeft=pos;upd()}},{passive:true});
    __q('#store .st-prev').addEventListener('click',function(){pos-=step();wrap();tr.scrollLeft=pos;upd()});
    __q('#store .st-next').addEventListener('click',function(){pos+=step();wrap();tr.scrollLeft=pos;upd()});
    function loop(t){var dt=last?Math.min(64,t-last):16;last=t;
      if(Date.now()-hold>1200){var sp=innerWidth<=760?80:130;pos+=sp*dt/1000;wrap();tr.scrollLeft=pos;upd()}
      requestAnimationFrame(loop)}
    requestAnimationFrame(loop);
  })();
  

(function(){var fs=__Q('#gallery .lg-grid figure');if(!('IntersectionObserver' in window)||window.false)return;
fs.forEach(function(f,i){f.classList.add('lg-in');f.style.transitionDelay=(i%4)*0.08+'s';});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target);}});},{threshold:.15});fs.forEach(function(f){io.observe(f)});})();


(function(){var mi=__Q('#menu .mc .ph img');
__Q('#review img[data-mi]').forEach(function(im){var s=mi[+im.dataset.mi];if(s)im.src=s.getAttribute('src');});
__Q('#review .lv-tr').forEach(function(t){var d=document.createElement('div');d.setAttribute('aria-hidden','true');d.style.display='contents';d.innerHTML=t.innerHTML;t.appendChild(d);t.classList.add('x4');});
if(window.false)__Q('#review .lv-tr').forEach(function(t){t.style.animation='none'});})();

/* fix1114m 페이지 길이 바뀌면 다시 계산 */
(function(){
  var t=0;function re(){clearTimeout(t);t=setTimeout(function(){if(window.ScrollTrigger)ScrollTrigger.refresh()},250)}
  window.addEventListener('load',re);
  if(window.ResizeObserver){var last=0;new ResizeObserver(function(){var hh=document.body.scrollHeight;if(Math.abs(hh-last)>40){last=hh;re()}}).observe(document.body)}
  [1500,3500,7000,12000].forEach(function(ms){setTimeout(re,ms)});
  function rescue(){var vh=innerHeight;__Q('#num .num,#cost .num,#yt figure,.bi,.btot,.yc').forEach(function(el){var r=el.getBoundingClientRect();if(r.top<vh*0.95&&r.bottom>0&&parseFloat(getComputedStyle(el).opacity)<0.05&&window.gsap){gsap.to(el,{opacity:1,x:0,y:0,scale:1,rotation:0,duration:.6,overwrite:true})}})}
  window.addEventListener('scroll',function(){clearTimeout(rescue.t);rescue.t=setTimeout(rescue,700)},{passive:true});
  function fit(){var small=innerWidth<=760;__Q('#reels .ugc-it').forEach(function(it){var f=it.querySelector('iframe');if(!f)return;var w=f.parentElement;if(!w.classList.contains('zw')){w=document.createElement('div');w.className='zw';f.parentNode.insertBefore(w,f);w.appendChild(f)}
    var cs=getComputedStyle(it);var cw=it.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);if(cw<326){var s=cw/326;w.style.transform='scale('+s+')';w.style.width='326px';w.style.height=(f.offsetHeight*s)+'px'}else{w.style.transform='';w.style.width='';w.style.height=''}})}
  setInterval(fit,1200);window.addEventListener('resize',fit);
})();


(function(){
var L=document.getElementById('loader');
var reduce=window.false;
if(reduce||!window.gsap||!window.ScrollTrigger){if(L)L.remove();return;}
gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add('js-motion');
var isMob=window.matchMedia('(max-width:820px)').matches;
var VH=window.innerHeight;
var INTRO=0.1;
function below(el){return el.getBoundingClientRect().top>VH*0.9;}
function arr(x){return gsap.utils.toArray(x);}

/* 글자 하나씩 쪼개기 (em·span·br 유지) */
function splitChars(el){
  var walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null),nodes=[],n;
  while(n=walker.nextNode())nodes.push(n);
  nodes.forEach(function(t){
    var f=document.createDocumentFragment();
    Array.from(t.nodeValue).forEach(function(c){
      if(c===' '||c==='\n'){f.appendChild(document.createTextNode(c));return;}
      var sp=document.createElement('span');sp.className='ch';sp.textContent=c;f.appendChild(sp);
    });
    t.parentNode.replaceChild(f,t);
  });
  return el.querySelectorAll('.ch');
}
/* 보일 때마다 다시 움직이게 */
function reveal(targets,vars,trigger,start){
  var els=arr(targets);if(!els.length)return;
  var t=trigger?(typeof trigger==='string'?__q(trigger):trigger):els[0];
  if(!t)return;
  if(!below(t)){gsap.from(els,Object.assign({},vars,{delay:INTRO+(vars.delay||0)}));return;}
  gsap.from(els,Object.assign({},vars,{scrollTrigger:{trigger:t,start:start||'top 85%',toggleActions:'play none none reverse'}}));
}
/* 숫자 올라가기 */
function countUp(el){
  var node=null;for(var i=0;i<el.childNodes.length;i++){if(el.childNodes[i].nodeType===3&&/\d/.test(el.childNodes[i].nodeValue)){node=el.childNodes[i];break;}}
  if(!node)return;
  var raw=node.nodeValue,to=el.dataset.to!=null?parseFloat(el.dataset.to):parseFloat(raw.replace(/[^\d.]/g,''));if(isNaN(to))return;
  /* 할인 숫자는 기존가(data-from)에서 할인가로 내려감 — 마라민족과 같은 방식 */
  var fr=el.dataset.from!=null?parseFloat(el.dataset.from):0,dur=el.dataset.dur?parseFloat(el.dataset.dur):(to>100?1.8:1.1),dl=el.dataset.delay?parseFloat(el.dataset.delay):0;
  var o={v:fr};
  function run(){gsap.fromTo(o,{v:fr},{v:to,duration:dur,ease:el.dataset.dur?'power1.inOut':'power3.out',delay:(below(el)?0:INTRO*0.6)+dl,onUpdate:function(){node.nodeValue=Math.round(o.v).toLocaleString('ko-KR');}});}
  ScrollTrigger.create({trigger:el,start:'top 92%',onEnter:run,onEnterBack:run});
}

/* 로딩 화면 */
/* 빨간 첫 화면 없앰 (11/14 대표님) */

/* 헤더·진행 막대 */
var hd=__q('header');
ScrollTrigger.create({start:40,end:'max',onToggle:function(s){hd.classList.toggle('scrolled',s.isActive);}});
gsap.to(__P('.sprog'),{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.3}});

/* 첫 화면 */
var h1c=splitChars(__q('.hero-l h1'));
var ht=gsap.timeline({delay:INTRO});
ht.from('.hero-l .tag',{y:-24,opacity:0,duration:.5,ease:'power2.out'})
  .from(h1c,{yPercent:120,rotation:12,opacity:0,duration:.6,stagger:.035,ease:'back.out(1.8)'},'-=.2')
  .from('.hero-l p',{y:30,opacity:0,duration:.5},'-=.3')
  .from('.hero-l .btn',{y:30,opacity:0,stagger:.1,duration:.45,ease:'back.out(2)'},'-=.25')
  .from('.hero-r .big',{xPercent:40,opacity:0,duration:1,ease:'power3.out'},INTRO*0+0.1)
  .from('.hero-r .dish',{scale:.5,rotation:-120,opacity:0,duration:1.2,ease:'elastic.out(1,.6)'},0.2)
  .from('.hero-r .sticker',{scale:2.6,rotation:40,opacity:0,duration:.5,ease:'back.out(3)'},0.95)
  .from('.hero-r .badge',{y:-120,rotation:-30,opacity:0,duration:.8,ease:'bounce.out'},0.7);
gsap.to(__P('.hero-r .sticker'),{rotation:6,y:-8,duration:1.4,ease:'sine.inOut',yoyo:true,repeat:-1,delay:INTRO+1.6});
gsap.to(__P('.hero-r .badge'),{y:-10,duration:1.6,ease:'sine.inOut',yoyo:true,repeat:-1,delay:INTRO+1.6});
gsap.to(__P('.hero-r .dish img'),{rotation:70,ease:'none',scrollTrigger:{trigger:__P('.hero'),start:'top top',end:'bottom top',scrub:true}});
gsap.to(__P('.hero-r .big'),{xPercent:-22,ease:'none',scrollTrigger:{trigger:__P('.hero'),start:'top top',end:'bottom top',scrub:true}});
gsap.to(__P('.hero-l'),{yPercent:12,opacity:.4,ease:'none',scrollTrigger:{trigger:__P('.hero'),start:'top top',end:'bottom top',scrub:true}});

/* 흐르는 띠: 스크롤 방향·속도에 따라 빨라지고 뒤집힘 */
var track=__q('.marq .track');
var mq=gsap.to(track,{xPercent:-50,duration:26,ease:'none',repeat:-1});
var dir=1;
ScrollTrigger.create({start:0,end:'max',onUpdate:function(s){
  dir=s.direction;var v=Math.min(Math.abs(s.getVelocity())/180,7);
  gsap.to(mq,{timeScale:dir*(1+v),duration:.2,overwrite:true});
  gsap.to(mq,{timeScale:dir,duration:1.2,delay:.25,overwrite:false});
}});
gsap.to(__P('.marq'),{skewY:-1.5,ease:'none',scrollTrigger:{trigger:__P('.marq'),start:'top bottom',end:'bottom top',scrub:true}});

/* 섹션 제목: 글자가 하나씩 튀어 오름 */
arr('.sec-head h2, .fam-tx h2, .form h2').forEach(function(h){
  var c=splitChars(h);
  gsap.from(c,{yPercent:110,rotation:10,opacity:0,stagger:.025,duration:.55,ease:'back.out(1.7)',scrollTrigger:{trigger:h,start:'top 88%',toggleActions:'play none none reverse'}});
});
arr('.sec-head p').forEach(function(p){reveal(p,{y:24,opacity:0,duration:.6,delay:.2});});


/* 영상: 화면에 보일 때만 재생 */
var vio=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){});}else v.pause();});},{threshold:.2});
arr('video').forEach(function(v){v.muted=true;vio.observe(v);});
/* 아래 고정 상담 바: 첫 화면을 지나면 올라옴 */
var qb=document.getElementById('qbar');
ScrollTrigger.create({trigger:__P('.hero'),start:'bottom 60%',end:'max',onToggle:function(s){qb.classList.toggle('show',s.isActive);}});
/* 릴스 */
gsap.fromTo(__P('.rghost'),{xPercent:0},{xPercent:-40,ease:'none',scrollTrigger:{trigger:__P('.reels'),start:'top bottom',end:'bottom top',scrub:true}});
reveal('.phone',{y:180,rotation:function(i){return [-10,6,-6,10][i%4];},opacity:0,stagger:.12,duration:.9,ease:'back.out(1.4)'},'.phones','top 85%');
if(!isMob){arr('.phone').forEach(function(ph,i){gsap.to(ph,{y:i%2?-50:40,ease:'none',scrollTrigger:{trigger:__P('.phones'),start:'top bottom',end:'bottom top',scrub:true}});});}
reveal('.sns span',{scale:0,opacity:0,stagger:.08,duration:.45,ease:'back.out(3)'},'.sns','top 95%');
/* 큰 영상: 둥근 창이 화면 가득 열림 */
gsap.fromTo(__P('.bigv video'),{clipPath:'inset(14% 18% round 40px)'},{clipPath:'inset(0% 0% round 0px)',ease:'none',scrollTrigger:{trigger:__P('.bigv'),start:'top 90%',end:'top 20%',scrub:true}});
reveal('.bigv .lgb',{scale:.3,rotation:-20,opacity:0,duration:.8,ease:'back.out(2.4)'},'.bigv','top 60%');
var bp=__q('.bigv p');if(bp){var bc=splitChars(bp);gsap.from(bc,{yPercent:120,opacity:0,stagger:.03,duration:.5,ease:'back.out(1.8)',scrollTrigger:{trigger:__P('.bigv'),start:'top 55%',toggleActions:'play none none reverse'}});}
/* 유튜브 */
reveal('.yc',{y:90,scale:.9,opacity:0,stagger:.1,duration:.7,ease:'power3.out'},'.ytg');
gsap.to(__P('.yc .pl'),{scale:1.12,duration:.7,ease:'sine.inOut',yoyo:true,repeat:-1});
reveal('.ytnote',{opacity:0,y:20,duration:.5},'.ytnote','top 95%');
/* 숫자 카드 */
arr('.numgrid').forEach(function(g){reveal(g.querySelectorAll('.num'),{y:80,rotation:4,opacity:0,stagger:.12,duration:.7,ease:'back.out(1.6)'},g);});
arr('.num .v, .ctotal .v, .btot .bv').forEach(countUp);
reveal('.bi',{x:-60,opacity:0,stagger:.12,duration:.6,ease:'power3.out'},'.bene');
reveal('.btot',{scale:.7,rotation:-4,opacity:0,duration:.8,ease:'back.out(2)'},'.bene');
reveal('.conv',{y:80,opacity:0,duration:.8,ease:'power3.out'},'.conv','top 88%');
reveal('.conv .cv div',{scale:.6,opacity:0,stagger:.15,duration:.6,ease:'back.out(2.4)'},'.conv','top 80%');
reveal('.num-note',{opacity:0,duration:.6,delay:.6},'.numgrid');

/* 왜 라화공방 */
reveal('.wc',{y:100,scale:.9,opacity:0,stagger:.12,duration:.75,ease:'power3.out'},'.whygrid');
gsap.fromTo(__P('.wc.photo img'),{scale:1.3},{scale:1,ease:'none',scrollTrigger:{trigger:__P('.whygrid'),start:'top bottom',end:'bottom top',scrub:true}});
gsap.to(__P('.wc .mascot'),{y:-12,rotation:-6,duration:.9,ease:'sine.inOut',yoyo:true,repeat:-1});
arr('.wc .chips span').forEach(function(c,i){gsap.from(c,{scale:0,duration:.4,ease:'back.out(3)',delay:i*.06,scrollTrigger:{trigger:c,start:'top 92%',toggleActions:'play none none reverse'}});});

/* 메뉴 */
gsap.to(__P('.menu .ghost'),{xPercent:-35,ease:'none',scrollTrigger:{trigger:__P('.menu'),start:'top bottom',end:'bottom top',scrub:true}});
reveal('.mc',{y:140,rotation:function(i){return [-8,6,-5,7,-6][i%5];},opacity:0,stagger:.12,duration:.8,ease:'back.out(1.4)'},'.menugrid','top 82%');
arr('.mc .ph img').forEach(function(im){gsap.fromTo(im,{scale:1.25},{scale:1,ease:'none',scrollTrigger:{trigger:im,start:'top bottom',end:'bottom 40%',scrub:true}});});
var wk=__q('.walker');
if(wk){
  gsap.fromTo(wk,{x:-120},{x:function(){return wk.parentNode.offsetWidth+20;},ease:'none',scrollTrigger:{trigger:__P('.menu'),start:'top 70%',end:'bottom 30%',scrub:.6,invalidateOnRefresh:true}});
  gsap.to(wk,{y:-16,rotation:8,duration:.28,ease:'sine.inOut',yoyo:true,repeat:-1});
}

/* 오픈 지원 */
var pst=arr('.posters img');
gsap.from(pst,{y:160,rotation:function(i){return [-25,0,25][i%3];},opacity:0,stagger:.12,duration:.9,ease:'back.out(1.3)',scrollTrigger:{trigger:__P('.posters'),start:'top 80%',toggleActions:'play none none reverse'}});
gsap.to(pst,{rotation:function(i){return [-5,0,5][i%3];},y:function(i){return [10,-14,10][i%3];},ease:'none',scrollTrigger:{trigger:__P('.posters'),start:'top 60%',end:'bottom top',scrub:true}});
reveal('.oi',{x:120,opacity:0,stagger:.1,duration:.6,ease:'power3.out'},'.olist');
arr('.oi b').forEach(function(b){gsap.from(b,{rotation:-180,scale:0,duration:.6,ease:'back.out(2)',scrollTrigger:{trigger:b,start:'top 90%',toggleActions:'play none none reverse'}});});

/* 형제 브랜드 */

/* 창업비용 */
gsap.fromTo(__P('.fam-ph img'),{scale:1.25,yPercent:-8},{scale:1.05,yPercent:8,ease:'none',scrollTrigger:{trigger:__P('.family'),start:'top bottom',end:'bottom top',scrub:true}});
gsap.fromTo(__P('.fam-ph .hz'),{xPercent:-30},{xPercent:60,ease:'none',scrollTrigger:{trigger:__P('.family'),start:'top bottom',end:'bottom top',scrub:true}});
reveal('.fam-tx .eyebrow, .fam-tx p',{y:30,opacity:0,stagger:.15,duration:.6},'.fam-tx');
reveal('.brand',{y:60,scale:.85,opacity:0,stagger:.15,duration:.6,ease:'back.out(2)'},'.brands','top 92%');
reveal('.ctable',{y:60,opacity:0,duration:.7},'.costgrid');
gsap.from(__P('.ctable tbody tr'),{x:-40,opacity:0,stagger:.07,duration:.45,ease:'power2.out',scrollTrigger:{trigger:__P('.ctable tbody'),start:'top 85%',toggleActions:'play none none reverse'}});
reveal('.ctotal',{scale:.7,rotation:-6,opacity:0,duration:.8,ease:'back.out(2)'},'.ctotal','top 90%');
reveal('.cnote li',{x:30,opacity:0,stagger:.08,duration:.45},'.cnote','top 90%');

/* 창업 절차: PC는 화면 고정 후 한 단계씩 켜짐 */
var sts=arr('.st');
var stg=__q('.stepgrid');if(stg)stg.classList.add('stx');if('IntersectionObserver' in window){var cds=[].slice.call(__Q('.numgrid .num, .ctotal, .sec-head'));var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('cdon');cio.unobserve(e.target);}});},{rootMargin:'0px 0px -12% 0px',threshold:0.3});cds.forEach(function(c){cio.observe(c);});}var wg=__q('.whygrid');if(wg&&('IntersectionObserver' in window)){wg.classList.add('wx');var wcs=[].slice.call(wg.querySelectorAll('.wc'));var wio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('wxon');wio.unobserve(e.target);}});},{rootMargin:'0px 0px -10% 0px',threshold:0.15});wcs.forEach(function(c){wio.observe(c);});var wtk=0;function wupd(){wtk=0;var vh=innerHeight,mid=vh*0.5,best=-1,bd=1e9;wcs.forEach(function(c,i){var r=c.getBoundingClientRect();if(!c.classList.contains('wxon')&&r.top<vh*0.9)c.classList.add('wxon');var d=Math.abs(r.top+r.height/2-mid);if(r.bottom>0&&r.top<vh&&d<bd){bd=d;best=i;}});wcs.forEach(function(c,i){c.classList.toggle('wxcur',i===best&&innerWidth<=820);});}addEventListener('scroll',function(){if(!wtk)wtk=requestAnimationFrame(wupd);},{passive:true});setTimeout(wupd,400);}function light(p){var k=Math.min(sts.length,Math.floor(p*sts.length+0.0001)+1);sts.forEach(function(s,i){var was=s.classList.contains('on'),now=i<k;s.classList.toggle('on',now);s.classList.toggle('cur',i===k-1);if(now&&!was){s.classList.remove('pop');void s.offsetWidth;s.classList.add('pop');setTimeout(function(){s.classList.remove('pop')},1100);}});}
if(!isMob){
  var stl=gsap.timeline({scrollTrigger:{trigger:__P('.steps'),start:'top top',end:'+=1400',pin:true,scrub:.5,onUpdate:function(s){light(s.progress);}}});
  stl.to('.stbar i',{scaleX:1,ease:'none'},0)
     .fromTo('.steps .ghost',{xPercent:20},{xPercent:-30,ease:'none'},0)
     .from(sts,{y:60,opacity:.25,stagger:.08,ease:'power1.out',duration:.4},0);
}else{
  gsap.to(__P('.stbar i'),{scaleX:1,ease:'none',scrollTrigger:{trigger:__P('.stepgrid'),start:'top 80%',end:'bottom 60%',scrub:true,onUpdate:function(s){light(s.progress);}}});
  reveal('.st',{y:50,opacity:0,stagger:.08,duration:.5},'.stepgrid');
}

/* 상담 양식 */
reveal('.form .eyebrow, .form .tel',{y:30,opacity:0,stagger:.15,duration:.6},'.formgrid');
reveal('.fcard',{x:140,rotation:6,opacity:0,duration:.9,ease:'power3.out'},'.fcard','top 90%');
gsap.to(__P('.form .mas'),{y:-18,rotation:-5,duration:.6,ease:'power1.inOut',yoyo:true,repeat:-1});
reveal('footer .wrap > *',{y:30,opacity:0,stagger:.12,duration:.5},'footer','top 98%');

/* 고추·화자오가 떨어지는 효과 (상담 구역) */
var cv=__q('.chili');
if(cv){
  var cx=cv.getContext('2d'),W=0,H=0,DPR=Math.min(2,window.devicePixelRatio||1),parts=[],on=false,raf=0;
  function size(){var r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*DPR;cv.height=H*DPR;cx.setTransform(DPR,0,0,DPR,0,0);}
  function mk(y){return{x:Math.random()*W,y:y==null?-30-Math.random()*H:y,s:.6+Math.random()*.9,r:Math.random()*6.28,vr:(Math.random()-.5)*.06,vy:.6+Math.random()*1.3,sw:Math.random()*6.28,k:Math.random()<.6?0:1};}
  function chili(p){cx.save();cx.translate(p.x+Math.sin(p.sw)*14,p.y);cx.rotate(p.r);cx.scale(p.s,p.s);
    if(p.k===0){cx.fillStyle='#C9191C';cx.beginPath();cx.moveTo(-4,-16);cx.quadraticCurveTo(10,-6,4,18);cx.quadraticCurveTo(-2,4,-8,-12);cx.closePath();cx.fill();
      cx.fillStyle='#EB2F30';cx.beginPath();cx.ellipse(-1,-6,2.2,6,.3,0,6.28);cx.fill();
      cx.fillStyle='#2F7A3A';cx.fillRect(-7,-21,6,5);cx.fillRect(-5,-26,2,6);}
    else{cx.fillStyle='#7A1E14';cx.beginPath();cx.arc(0,0,4.5,0,6.28);cx.fill();cx.fillStyle='rgba(255,255,255,.35)';cx.beginPath();cx.arc(-1.4,-1.4,1.4,0,6.28);cx.fill();}
    cx.restore();}
  function tick(){cx.clearRect(0,0,W,H);parts.forEach(function(p,i){p.y+=p.vy;p.r+=p.vr;p.sw+=.02;if(p.y>H+30)parts[i]=mk(-30);chili(p);});if(on)raf=requestAnimationFrame(tick);}
  size();for(var i=0;i<(isMob?22:40);i++)parts.push(mk(Math.random()*H));
  window.addEventListener('resize',size);
  new IntersectionObserver(function(e){var v=e[0].isIntersecting;if(v&&!on){on=true;tick();}else if(!v){on=false;cancelAnimationFrame(raf);}}).observe(cv);
}
window.addEventListener('load',function(){ScrollTrigger.refresh();});
})();
