(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const I='public/images/';
const MENU={
coffee:[['espresso','Эспрессо','Плотный, с золотистой пенкой и сладким послевкусием.',150],['americano','Американо','Мягкий и чистый вкус, подаётся в высоком стакане.',190],['cappuccino','Капучино','Бархатная молочная пена и насыщенный эспрессо.',230],['latte','Латте','Нежный, сливочный, с тонким слоем микропены.',260],['raf-vanilla','Раф ванильный','Сливки, ваниль и эспрессо — мягко и сладко.',290]],
tea:[['matcha-latte','Матча-латте','Церемониальная матча с шелковистым молоком.',300]],
sweet:[['croissant','Круассан сливочный','Хрустящие слои и сливочный вкус, выпекаем с утра.',190],['cheesecake','Чизкейк','Классический, на песочной основе, нежная текстура.',320]]};
const cards=$('#cards');
const fmt=n=>n+' ₽';
function draw(c){
 cards.innerHTML=MENU[c].map((m,i)=>`<article class="card" style="--n:${i}"><div class="im"><img src="${I}menu-${m[0]}.webp" width="1100" height="1100" loading="lazy" alt="${m[1]}"></div><div class="t"><h3>${m[1]}<b>${fmt(m[3])}</b></h3><p>${m[2]}</p></div></article>`).join('')+(c==='tea'?'<article class="card note" style="--n:1"><div><h3>Сезонный напиток</h3><p>Каждый месяц у нас появляется новый вкус. Спросите у бариста, что в чашке сегодня.</p></div></article>':'');
}
draw('coffee');
$$('.tabs button').forEach(b=>b.onclick=()=>{
 if(b.getAttribute('aria-selected')==='true')return;
 $$('.tabs button').forEach(x=>x.setAttribute('aria-selected',x===b));
 cards.classList.add('out');
 setTimeout(()=>{draw(b.dataset.c);cards.classList.remove('out')},calm?0:250);
});
/* header, progress, parallax */
const tl=$('.tl'),hd=$('#hd'),bar=$('#bar'),bg=$('.bgv');let tick=false;
const upd=()=>{const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
 hd.classList.toggle('on',y>40);bar.style.width=(y/h*100)+'%';
 if(!calm&&y<innerHeight)bg.style.transform=`translateY(${y*.18}px)`;const r=tl.getBoundingClientRect();tl.style.setProperty('--p',Math.max(0,Math.min(1,(innerHeight*.6-r.top)/r.height)));tick=false};
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd();
/* mobile nav */
const nav=$('#nav'),bu=$('#burger');
const tog=o=>{nav.classList.toggle('open',o);bu.setAttribute('aria-expanded',o);bu.setAttribute('aria-label',o?'Закрыть меню':'Открыть меню');document.body.style.overflow=o?'hidden':''};
bu.onclick=()=>tog(!nav.classList.contains('open'));
$$('a',nav).forEach(a=>a.onclick=()=>tog(false));
addEventListener('keydown',e=>{if(e.key==='Escape')tog(false)});
/* reveal + active nav */
$$('.rv').forEach((el,i)=>el.style.setProperty('--d',(i%4)*.08+'s'));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
const start=()=>$$('.rv').forEach(el=>io.observe(el));
const links=$$('.nav a');
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('cur',a.hash==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
$$('main section[id]').forEach(s=>so.observe(s));
/* video: lazy load, pause offscreen, respect reduced motion */
$$('video').forEach(v=>{
 const go=()=>{$$('source[data-src]',v).forEach(s=>{s.src=s.dataset.src;s.removeAttribute('data-src')});v.load()};
 if(calm){v.removeAttribute('autoplay');v.pause();return}
 new IntersectionObserver(([e])=>{if(e.isIntersecting){if(v.dataset.lazy!==undefined&&!v.dataset.ok){go();v.dataset.ok=1}v.play().catch(()=>{})}else v.pause()},{threshold:.2}).observe(v);
});
/* gallery + lightbox */
const g=$$('#gal button'),lb=$('#lb'),li=$('img',lb);let cur=0;
g.forEach((b,i)=>{b.innerHTML=`<img src="${I}${b.dataset.i}.webp" loading="lazy" alt="${b.dataset.a}">`;b.setAttribute('aria-label','Открыть фото: '+b.dataset.a);b.onclick=()=>{show(i);lb.showModal()}});
const show=i=>{cur=(i+g.length)%g.length;li.src=`${I}${g[cur].dataset.i}.webp`;li.alt=g[cur].dataset.a};
$('.x',lb).onclick=()=>lb.close();$('.pv',lb).onclick=()=>show(cur-1);$('.nx',lb).onclick=()=>show(cur+1);
lb.addEventListener('click',e=>{if(e.target===lb)lb.close()});
lb.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});

/* intro + split headline */
$$('h1 span,h1 em').forEach((e,k)=>{e.innerHTML=e.textContent.split(' ').map((w,i)=>`<i style="--w:${k*2+i}">${w}</i>`).join(' ')});
const pre=$('#pre'),go=()=>{if(go.d)return;go.d=1;pre.classList.add('gone');document.body.classList.add('ready');start()};
addEventListener('load',()=>setTimeout(go,calm?0:1200));setTimeout(go,4000);
/* open status (Moscow time) */
(()=>{const d=new Date(new Date().toLocaleString('en-US',{timeZone:'Europe/Moscow'})),H=x=>x%7%6?[8,21]:[9,22],[o,c]=H(d.getDay()),h=d.getHours()+d.getMinutes()/60,on=h>=o&&h<c,el=$('#open');
 el.classList.toggle('on',on);el.textContent=on?`Открыто сейчас · до ${c}:00`:h<o?`Сейчас закрыто · откроемся в ${o}:00`:`Сейчас закрыто · завтра с ${H(d.getDay()+1)[0]}:00`})();
/* count-up */
$$('[data-n]').forEach(b=>new IntersectionObserver(([e],ob)=>{if(!e.isIntersecting)return;ob.disconnect();const n=+b.dataset.n;if(calm)return;let t0;const f=t=>{t0??=t;const p=Math.min((t-t0)/1400,1);b.textContent=Math.round(n*(1-(1-p)**3));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}).observe(b));
/* magnetic buttons */
if(!calm&&matchMedia('(hover:hover)').matches)$$('.btn').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.3-3}px)`});b.addEventListener('mouseleave',()=>b.style.transform='')});
/* drink picker */
const Q=[['Как начинается твой день?',['Быстро, с заряда','Неспешно','Хочется особенного']],['С молоком или без?',['Без молока','С молоком','Вообще без кофе']]],
R=[['espresso','cappuccino','matcha-latte'],['americano','latte','matcha-latte'],['americano','raf-vanilla','matcha-latte']],
ALL=[...MENU.coffee,...MENU.tea,...MENU.sweet],qz=$('#quiz');let a=[];
function step(){
 if(a.length<2){const q=Q[a.length];qz.innerHTML=`<p class="qn">Вопрос ${a.length+1} из 2</p><h3>${q[0]}</h3><div class="opts">${q[1].map((t,i)=>`<button data-i="${i}">${t}</button>`).join('')}</div>`;
  $$('.opts button',qz).forEach(b=>b.onclick=()=>{a.push(+b.dataset.i);step()});return}
 const m=ALL.find(x=>x[0]===R[a[0]][a[1]]),d=ALL[a[0]===2?7:6];
 qz.innerHTML=`<p class="qn">Ваш выбор</p><div class="res"><img src="${I}menu-${m[0]}.webp" alt="${m[1]}"><div><h3>${m[1]}<b>${fmt(m[3])}</b></h3><p>${m[2]}</p><p>К нему отлично подойдёт: <strong>${d[1].toLowerCase()}</strong>, ${fmt(d[3])}.</p><button class="again">Пройти ещё раз</button></div></div>`;
 $('.again',qz).onclick=()=>{a=[];step()}}
step();
/* booking */
const bf=$('#bf'),bd=$('#bd');bd.min=bd.value=new Date().toISOString().slice(0,10);
bf.addEventListener('submit',e=>{e.preventDefault();if(!bf.checkValidity()){bf.reportValidity();return}
 const ok=document.createElement('div');ok.className='ok';ok.setAttribute('role','status');
 ok.innerHTML='<i>✓</i><h3></h3><p></p>';$('h3',ok).textContent='Спасибо, '+$('#bn').value.trim()+'!';
 $('p',ok).textContent=`Стол на ${$('#bg').value} чел. ${new Date(bd.value).toLocaleDateString('ru-RU',{day:'numeric',month:'long'})} в ${$('#bt').value} ждёт вас. Мы позвоним, чтобы подтвердить бронь.`;
 bf.replaceChildren(ok)});
$('#y').textContent=new Date().getFullYear();
})();
