
/* ── Detect touch/reduced-motion ── */
var isT = window.matchMedia('(hover:none),(pointer:coarse)').matches;
var noM = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ── Loader ── */
window.addEventListener('load', function(){
  setTimeout(function(){ document.getElementById('ldr').classList.add('out'); }, 1800);
});

/* ── Custom cursor ── */
if(!isT){
  var d = document.getElementById('csr'), r = document.getElementById('csr2');
  var mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',function(e){ mx=e.clientX; my=e.clientY; d.style.left=mx+'px'; d.style.top=my+'px'; });
  (function loop(){ rx+=(mx-rx)*.1; ry+=(my-ry)*.1; r.style.left=rx+'px'; r.style.top=ry+'px'; requestAnimationFrame(loop); })();
  document.querySelectorAll('a,button,.sk-card,.pj-card,.ct-card').forEach(function(el){
    el.addEventListener('mouseenter',function(){ document.body.classList.add('lnk'); });
    el.addEventListener('mouseleave',function(){ document.body.classList.remove('lnk'); });
  });
}

/* ── Particles ── */
var cv = document.getElementById('ptc'), cx = cv.getContext('2d'), ps = [];
function resize(){ cv.width=innerWidth; cv.height=innerHeight; } resize();
window.addEventListener('resize', resize);
var cnt = isT ? 28 : 65;
for(var i=0;i<cnt;i++) ps.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.3+.3,vx:(Math.random()-.5)*.26,vy:(Math.random()-.5)*.26,o:Math.random()*.45+.08});
function drawP(){
  cx.clearRect(0,0,cv.width,cv.height);
  ps.forEach(function(p){ p.x+=p.vx; p.y+=p.vy; if(p.x<0)p.x=cv.width; if(p.x>cv.width)p.x=0; if(p.y<0)p.y=cv.height; if(p.y>cv.height)p.y=0; cx.beginPath(); cx.arc(p.x,p.y,p.r,0,Math.PI*2); cx.fillStyle='rgba(99,219,255,'+p.o+')'; cx.fill(); });
  for(var a=0;a<ps.length;a++) for(var b=a+1;b<ps.length;b++){ var dx=ps[a].x-ps[b].x,dy=ps[a].y-ps[b].y,d=Math.sqrt(dx*dx+dy*dy); if(d<110){ cx.beginPath(); cx.strokeStyle='rgba(99,219,255,'+(0.05*(1-d/110))+')'; cx.lineWidth=.5; cx.moveTo(ps[a].x,ps[a].y); cx.lineTo(ps[b].x,ps[b].y); cx.stroke(); } }
  requestAnimationFrame(drawP);
}
if(!noM) drawP(); else cv.style.display='none';

/* ── Typing ── */
var words=['Data Specialist','CS Student (AI & ML)','Automation Engineer','BI Developer','Problem Solver'];
var wi=0,ci=0,del=false,el=document.getElementById('typed');
function type(){
  if(!del){ if(ci<words[wi].length){ el.textContent+=words[wi][ci++]; setTimeout(type,88); } else setTimeout(function(){ del=true; type(); },2000); }
  else { if(ci>0){ el.textContent=words[wi].substring(0,--ci); setTimeout(type,52); } else { del=false; wi=(wi+1)%words.length; setTimeout(type,420); } }
}

/* ── Navbar ── */
window.addEventListener('scroll',function(){
  document.getElementById('nav').classList.toggle('stuck',scrollY>50);
  var cur='';
  document.querySelectorAll('section').forEach(function(s){ if(scrollY>=s.offsetTop-130) cur=s.id; });
  document.querySelectorAll('.n-menu a').forEach(function(a){ a.classList.toggle('cur',a.getAttribute('href')==='#'+cur); });
});

/* ── Mobile menu ── */
function openMob(){ document.getElementById('mobMenu').classList.add('open'); }
function closeMob(){ document.getElementById('mobMenu').classList.remove('open'); }

/* ── Scroll reveal ── */
var obs = new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if(!e.isIntersecting) return; e.target.classList.add('vis'); obs.unobserve(e.target); });
},{threshold:.1});

/* ── Skills filter ── */
function skTab(btn,cat){
  document.querySelectorAll('.sk-tb').forEach(function(t){ t.classList.remove('on'); });
  btn.classList.add('on');
  document.getElementById('skQ').value='';
  var n=0;
  document.querySelectorAll('.sk-card').forEach(function(c){ var m=cat==='all'||c.dataset.cat===cat; c.classList.toggle('hide',!m); if(m)n++; });
  document.getElementById('skEmpty').style.display=n===0?'block':'none';
}
function skSearch(){
  var q=document.getElementById('skQ').value.toLowerCase().trim();
  document.querySelectorAll('.sk-tb').forEach(function(t){ t.classList.remove('on'); });
  document.querySelectorAll('.sk-tb')[0].classList.add('on');
  var n=0;
  document.querySelectorAll('.sk-card').forEach(function(c){ var nm=c.querySelector('.sk-name').textContent.toLowerCase(); var m=!q||c.dataset.nm.indexOf(q)!==-1||nm.indexOf(q)!==-1; c.classList.toggle('hide',!m); if(m)n++; });
  document.getElementById('skEmpty').style.display=n===0?'block':'none';
}

/* ── Contact form — sends to pnikeshkumarpottabathina@gmail.com via Formspree ── */
function sendMsg(e){
  e.preventDefault();
  var btn=document.getElementById('sbtn');
  btn.innerHTML='<i class="fas fa-circle-notch fa-spin"></i> Sending…';
  btn.disabled=true;
  var data={
    name:    document.getElementById('fn').value,
    email:   document.getElementById('fe').value,
    subject: document.getElementById('fs').value||'Portfolio Contact',
    message: document.getElementById('fm').value
  };
  fetch('https://formspree.io/f/xeerbezg',{
    method:'POST',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify(data)
  })
  .then(function(r){return r.json().then(function(j){return{ok:r.ok,body:j};})})
  .then(function(res){
    if(res.ok){
      btn.innerHTML='<i class="fas fa-check"></i> Message Sent!';
      btn.style.cssText='width:100%;justify-content:center;background:linear-gradient(135deg,#16a34a,#15803d);box-shadow:0 0 28px rgba(22,163,74,.35)';
      setTimeout(function(){
        btn.innerHTML='<i class="fas fa-paper-plane"></i> Send Message';
        btn.style.cssText='width:100%;justify-content:center;';
        btn.disabled=false;
        document.getElementById('cform').reset();
      },3000);
    }else{throw new Error(JSON.stringify(res.body));}
  })
  .catch(function(err){
    btn.innerHTML='<i class="fas fa-exclamation-triangle"></i> Failed — Try Again';
    btn.style.cssText='width:100%;justify-content:center;background:linear-gradient(135deg,#dc2626,#b91c1c);box-shadow:0 0 28px rgba(220,38,38,.35)';
    btn.disabled=false;
    console.error('Form error:',err);
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded',function(){
  type();
  document.querySelectorAll('[data-r]').forEach(function(el){ obs.observe(el); });
});