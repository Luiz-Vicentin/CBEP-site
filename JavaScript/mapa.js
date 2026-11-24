// Interação regional isolada dos menus compartilhados do CBEP.
(()=>{
// O mapa original fica incorporado no HTML; funciona sem servidor ou internet.
const canvas=document.querySelector('canvas');
const ctx=canvas.getContext('2d');
const mapLabels=[];
const labelLines=['Noroeste','Centro\nOcidental','Norte\nCentral','Norte\nPioneiro','Centro\nOriental','Oeste','Sudoeste','Centro-Sul','Sudeste','Metropolitana\nde Curitiba'];
const source=new Image();
const palette=[[95,120,98],[146,152,122],[158,173,153],[120,145,166],[134,168,157],[131,149,130],[166,167,148],[155,179,193],[119,142,159],[176,187,175]];
const names=['Noroeste','Centro Ocidental','Norte Central','Norte Pioneiro','Centro Oriental','Oeste','Sudoeste','Centro-Sul','Sudeste','Metropolitana de Curitiba'];
let regions=[],hitMap,target=-1,frame=0,previous=0;
let selectedRegion=-1;
let pin=null;
let tourPin=null;
let strengths=Array(10).fill(0);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
source.onload=()=>{
 const w=source.naturalWidth,h=source.naturalHeight;canvas.width=w;canvas.height=h;
 ctx.drawImage(source,0,0);const pixels=ctx.getImageData(0,0,w,h).data;
 hitMap=new Int8Array(w*h).fill(-1);
 const bounds=palette.map(()=>({x:w,y:h,r:0,b:0}));
 // Identifica as cores na imagem aprovada, preservando seus contornos.
 for(let p=0;p<w*h;p++){
  const k=p*4,r=pixels[k],g=pixels[k+1],b=pixels[k+2];
  if(Math.min(r,g,b)>222)continue;
  let best=-1,distance=Infinity;
  palette.forEach((c,i)=>{const d=(r-c[0])**2+(g-c[1])**2+(b-c[2])**2;if(d<distance){distance=d;best=i}});
  hitMap[p]=best;const x=p%w,y=Math.floor(p/w),box=bounds[best];
  box.x=Math.min(box.x,x);box.y=Math.min(box.y,y);box.r=Math.max(box.r,x);box.b=Math.max(box.b,y);
 }
 // Agrupa áreas contínuas delimitadas pelas linhas brancas.
 // A cor só nomeia a área completa; nunca seleciona pixels espalhados.
 const total=w*h,visited=new Uint8Array(total),queue=new Int32Array(total);
 const areas=new Int8Array(total).fill(-1);
 for(let start=0;start<total;start++){
  if(visited[start]||hitMap[start]<0)continue;
  let head=0,tail=1;queue[0]=start;visited[start]=1;
  const votes=Array(10).fill(0);
  while(head<tail){
   const at=queue[head++],x=at%w;votes[hitMap[at]]++;
   for(const next of [x?at-1:-1,x<w-1?at+1:-1,at-w,at+w]){
    if(next>=0&&next<total&&!visited[next]&&hitMap[next]>=0){visited[next]=1;queue[tail++]=next}
   }
  }
  if(tail>10000){
   const label=votes.indexOf(Math.max(...votes));
   for(let j=0;j<tail;j++)areas[queue[j]]=label;
  }
 }
 // Ilhas e pequenos detalhes costeiros pertencem à região mais próxima.
 let head=0,tail=0;
 for(let at=0;at<total;at++)if(areas[at]>=0)queue[tail++]=at;
 while(head<tail){
  const at=queue[head++],x=at%w;
  for(const next of [x?at-1:-1,x<w-1?at+1:-1,at-w,at+w]){
   if(next>=0&&next<total&&areas[next]<0){areas[next]=areas[at];queue[tail++]=next}
  }
 }
 bounds.forEach(box=>{box.x=w;box.y=h;box.r=0;box.b=0});
 for(let at=0;at<total;at++){
  if(hitMap[at]<0)continue;
  const label=areas[at];hitMap[at]=label;
  const x=at%w,y=Math.floor(at/w),box=bounds[label];
  box.x=Math.min(box.x,x);box.y=Math.min(box.y,y);box.r=Math.max(box.r,x);box.b=Math.max(box.b,y);
 }
 regions=bounds.map(box=>{
  const layer=document.createElement('canvas');layer.width=box.r-box.x+1;layer.height=box.b-box.y+1;
  return {box,layer,context:layer.getContext('2d')};
 });
 regions.forEach((region,i)=>{
  const {box,layer,context}=region,out=context.createImageData(layer.width,layer.height);
  for(let y=box.y;y<=box.b;y++)for(let x=box.x;x<=box.r;x++){
   const p=y*w+x;if(hitMap[p]!==i)continue;
   const k=p*4,q=((y-box.y)*layer.width+x-box.x)*4;
   // Reforça a cor sem mudar posição, tamanho ou máscara da região.
   const gray=.2126*pixels[k]+.7152*pixels[k+1]+.0722*pixels[k+2];
   for(let c=0;c<3;c++)out.data[q+c]=Math.max(0,Math.min(255,(gray+(pixels[k+c]-gray)*1.25)*.78));
   out.data[q+3]=255;
  }
  context.putImageData(out,0,0);
 });
 createRegionLabels();
 render();canvas.dataset.ready='true';
};
function createRegionLabels(){
 // Procura pontos afastados das divisas para manter cada nome dentro da região.
 const step=24,cols=Math.ceil(canvas.width/step),rows=Math.ceil(canvas.height/step);
 const labels=new Int8Array(cols*rows),distance=new Float32Array(cols*rows);
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  const px=Math.min(canvas.width-1,Math.floor((x+.5)*step));
  const py=Math.min(canvas.height-1,Math.floor((y+.5)*step));
  labels[y*cols+x]=hitMap[py*canvas.width+px];
 }
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  const at=y*cols+x,label=labels[at];
  distance[at]=label<0||!x||!y||x===cols-1||y===rows-1||labels[at-1]!==label||labels[at+1]!==label||labels[at-cols]!==label||labels[at+cols]!==label?0:10000;
 }
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  const at=y*cols+x;
  if(x&&labels[at-1]===labels[at])distance[at]=Math.min(distance[at],distance[at-1]+1);
  if(y&&labels[at-cols]===labels[at])distance[at]=Math.min(distance[at],distance[at-cols]+1);
 }
 for(let y=rows-1;y>=0;y--)for(let x=cols-1;x>=0;x--){
  const at=y*cols+x;
  if(x<cols-1&&labels[at+1]===labels[at])distance[at]=Math.min(distance[at],distance[at+1]+1);
  if(y<rows-1&&labels[at+cols]===labels[at])distance[at]=Math.min(distance[at],distance[at+cols]+1);
 }
 const best=regions.map(()=>({score:-Infinity,x:0,y:0}));
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  const at=y*cols+x,i=labels[at];if(i<0)continue;
  const box=regions[i].box;
  const score=distance[at]-.03*Math.hypot(x-(box.x+box.r)/(2*step),y-(box.y+box.b)/(2*step));
  if(score>best[i].score)best[i]={score,x:Math.min(canvas.width-1,Math.floor((x+.5)*step)),y:Math.min(canvas.height-1,Math.floor((y+.5)*step))};
 }
 mapLabels.forEach(label=>label.remove());mapLabels.length=0;
 best.forEach((point,i)=>{
  if(!Number.isFinite(point.score))return;
  const label=document.createElement('span');
  label.className='map-region-label';label.dataset.region=String(i);
  label.textContent=labelLines[i];label.setAttribute('aria-hidden','true');
  label.style.left=(point.x/canvas.width*100)+'%';
  label.style.top=(point.y/canvas.height*100)+'%';
  canvas.parentElement.append(label);mapLabels.push(label);
 });
}
function render(){
 // A imagem completa permanece intacta em todos os quadros.
 ctx.globalAlpha=1;ctx.drawImage(source,0,0);
 regions.forEach(({box,layer},i)=>{
  if(strengths[i]<=0)return;
  ctx.globalAlpha=strengths[i];ctx.drawImage(layer,box.x,box.y);
 });
 ctx.globalAlpha=1;
 if(pin&&selectedRegion>=0)pin=regionPin(selectedRegion)||pin;
 const marker=tourPin||pin;
 if(marker){
  const scale=canvas.width/(canvas.getBoundingClientRect().width||canvas.width);
  ctx.save();ctx.translate(marker.x,marker.y);ctx.scale(scale,scale);
  ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=5;
  ctx.beginPath();ctx.moveTo(0,0);
  ctx.bezierCurveTo(-5,-8,-14,-17,-14,-26);
  ctx.arc(0,-26,14,Math.PI,0);
  ctx.bezierCurveTo(14,-17,5,-8,0,0);
  ctx.closePath();ctx.fillStyle='#c73535';ctx.fill();
  ctx.shadowBlur=0;ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
  ctx.beginPath();ctx.arc(0,-26,5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
  ctx.restore();
 }
}
function animate(time){
 const amount=1-Math.exp(-Math.min(time-previous||16,50)/65);previous=time;
 let moving=false;
 strengths=strengths.map((s,i)=>{const goal=i===target?1:0;if(reduced.matches)return goal;const next=s+(goal-s)*amount;if(Math.abs(next-goal)>.0005)moving=true;return Math.abs(next-goal)<.0005?goal:next});
 render();frame=moving?requestAnimationFrame(animate):0;
}
function activate(i){
 if(target===i)return;target=i;
 // Só a região atual recebe destaque, sem sobreposição de transições.
 strengths=strengths.map((value,index)=>index===i?value:0);
 canvas.style.cursor=i<0?'default':'pointer';
 canvas.setAttribute('aria-label',i<0?'Mapa do Paraná. Use as setas para explorar e Enter para ver os autores.':'Região '+names[i]+'. Pressione Enter para ver os autores.');
 if(!frame){previous=0;frame=requestAnimationFrame(animate)}
}
function hit(event){
 if(!hitMap)return -1;const rect=canvas.getBoundingClientRect();
 const x=Math.floor((event.clientX-rect.left)*canvas.width/rect.width),y=Math.floor((event.clientY-rect.top)*canvas.height/rect.height);
 return x>=0&&y>=0&&x<canvas.width&&y<canvas.height?hitMap[y*canvas.width+x]:-1;
}
canvas.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'||e.pointerType==='pen')activate(hit(e))});
canvas.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')activate(selectedRegion)});
canvas.addEventListener('click',e=>{
 const i=hit(e);if(i<0)return;
 const rect=canvas.getBoundingClientRect();
 selectRegion(i,{x:(e.clientX-rect.left)*canvas.width/rect.width,y:(e.clientY-rect.top)*canvas.height/rect.height});
});
canvas.addEventListener('keydown',e=>{
 if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();const step=['ArrowRight','ArrowDown'].includes(e.key)?1:-1;activate((target+step+10)%10)}
 if(e.key==='Enter'||e.key===' '){e.preventDefault();if(target>=0)selectRegion(target)}
 if(e.key==='Escape')closePanel();
});
canvas.addEventListener('blur',()=>activate(selectedRegion));
source.src=document.querySelector('#map-image').src;

const regionNames=["Noroeste Paranaense", "Centro Ocidental Paranaense", "Norte Central Paranaense", "Norte Pioneiro Paranaense", "Centro Oriental Paranaense", "Oeste Paranaense", "Sudoeste Paranaense", "Centro-Sul Paranaense", "Sudeste Paranaense", "Metropolitana de Curitiba"];
const authorsByRegion=[[],[{"cidade":"Campo Mourão","autores":["Elenice Koziel"],"nota":"Cidade de residência da autora. Nasceu na zona rural, na divisa entre Roncador e Pitanga."}],[{"cidade":"Londrina","autores":["Domingos Pellegrini"]},{"cidade":"Novo Itacolomi","autores":["Olívio Jekupé"]}],[],[],[],[],[],[{"cidade":"Cruz Machado","autores":["Helena Kolody"]}],[{"cidade":"Curitiba","autores":["Alice Ruiz","Dalton Trevisan","Emílio de Menezes","Jéssica Iancovski","Jô Macario","Laura Santos","Luci Collin","Luís Henrique Pellanda","Paulo Leminski"]},{"cidade":"Pinhais","autores":["Emiliano Perneta"],"nota":"O local pertencia a Curitiba na época de seu nascimento."}]];
const panel=document.querySelector('#authors-panel');
function regionPin(index){
 const label=document.querySelector('.map-region-label[data-region="'+index+'"]');
 if(!label)return null;
 const scale=canvas.width/(canvas.getBoundingClientRect().width||canvas.width);
 return {
  x:parseFloat(label.style.left)/100*canvas.width,
  y:parseFloat(label.style.top)/100*canvas.height-(label.offsetHeight/2+12)*scale
 };
}
function selectRegion(index){
 pin=regionPin(index);
 selectedRegion=index;activate(index);
 populateRegion(index,document.querySelector('#region-title'),document.querySelector('#author-count'),document.querySelector('#city-groups'));
 panel.hidden=false;document.querySelector('#mapa-layout').classList.add('has-selection');
 render();
}
function populateRegion(index,heading,meta,container){
 heading.textContent=regionNames[index];
 const groups=authorsByRegion[index],content=container;content.replaceChildren();
 let count=groups.reduce((sum,group)=>sum+group.autores.length,0);
 meta.textContent=count?count+' '+(count===1?'autor do CBEP':'autores do CBEP')+' • '+(index===1?'Local de residência':index===9?'Nascimento e atuação':'Local de nascimento'):'Autores do CBEP • Local de nascimento';
 if(!count){const empty=document.createElement('p');empty.className='empty';empty.textContent='Nenhum autor cadastrado ainda';content.append(empty)}
 groups.forEach(group=>{
  const section=document.createElement('section');section.className='city';
  const title=document.createElement('h3');title.textContent=group.cidade;section.append(title);
  const list=document.createElement('ul');
  group.autores.forEach(name=>{
   const item=document.createElement('li');
   const autor=autores.find(([nome])=>nome===name);
   if(autor){
    const link=document.createElement('a');
    link.textContent=name;link.href=new URL(autor[1],raizSite).href;
    item.append(link);
   }else item.textContent=name;
   list.append(item);
  });
  section.append(list);
  if(group.nota){const note=document.createElement('p');note.className='note';note.textContent=group.nota;section.append(note)}
  content.append(section);
 });
}
function closePanel(){
 pin=null;
 selectedRegion=-1;activate(-1);panel.hidden=true;
 document.querySelector('#mapa-layout').classList.remove('has-selection');
 render();
}

// Mantém o tamanho visual do pino quando o mapa muda de largura.
new ResizeObserver(()=>{if(source.complete&&source.naturalWidth)render()}).observe(canvas);
document.querySelector('#close-panel').addEventListener('click',()=>{closePanel();canvas.focus()});

// Tutorial do mapa: automático só na primeira visita deste navegador.
function setupMapTour(){
 const overlay=document.querySelector('#tour-overlay');
 const start=document.querySelector('#iniciar-tour');
 if(!overlay||!start)return;
 const popover=document.querySelector('#tour-popover');
 const title=document.querySelector('#tour-title');
 const desc=document.querySelector('#tour-desc');
 const badge=document.querySelector('#tour-step-badge');
 const prev=document.querySelector('#tour-prev');
 const next=document.querySelector('#tour-next');
 const layout=document.querySelector('#mapa-layout');
 // Demonstração fora do fluxo: reproduz a lista real sem selecionar uma região.
 const preview=panel.cloneNode(true);
 const previewTitle=preview.querySelector('#region-title');
 const previewMeta=preview.querySelector('#author-count');
 const previewCities=preview.querySelector('#city-groups');
 preview.removeAttribute('id');
 preview.querySelectorAll('[id]').forEach(element=>element.removeAttribute('id'));
 preview.removeAttribute('aria-labelledby');
 preview.setAttribute('aria-label','Exemplo de autores da região Metropolitana de Curitiba');
 preview.classList.add('tour-authors-preview');preview.hidden=true;
 const previewClose=preview.querySelector('button');
 if(previewClose){previewClose.disabled=true;previewClose.tabIndex=-1}
 layout.append(preview);
 const steps=[
  {target:()=>canvas.parentElement,title:'Escolha uma região',text:'Depois de fechar este guia, clique ou toque em uma das dez regiões do Paraná para descobrir os escritores cadastrados.'},
  {target:()=>document.querySelector('.map-region-label[data-region="9"]'),title:'Identifique as regiões',text:'O pino indica a região escolhida. Esta lista mostra um exemplo do que aparece ao clicar na região Metropolitana de Curitiba.'},
  {target:()=>preview,title:'Veja os autores por cidade',text:'Os escritores aparecem organizados por cidade. Aqui estão os autores da região Metropolitana de Curitiba. Quando não houver autores cadastrados, o quadro informará isso.'},
  {target:()=>preview.querySelector('a')||preview,title:'Conheça cada escritor',text:'Na lista dos autores, clique no nome de um escritor para abrir sua página. Esta lista é apenas uma demonstração, feche o guia para explorar os autores.'}
 ];
 const storageKey='cbep-mapa-tour-v1';
 let current=0,highlighted=null,previousFocus=null,previousInert=false,previousMinHeight='';
 function firstVisit(){try{return localStorage.getItem(storageKey)!=='visto'}catch(_){return true}}
 function positionCard(){
  if(overlay.hidden)return;
  const vw=document.documentElement.clientWidth;
  const rect=canvas.parentElement.getBoundingClientRect();
  const rightSpace=vw-rect.right-32,leftSpace=rect.left-32;
  const useRight=rightSpace>=leftSpace;
  const available=Math.max(rightSpace,leftSpace);
  const width=available>=220?Math.min(320,available):Math.min(320,vw-24);
  popover.style.width=width+'px';
  let x=available>=220?(useRight?rect.right+20:rect.left-width-20):vw-width-12;
  popover.style.left=Math.max(12,Math.min(vw-width-12,x))+'px';
  popover.style.top='24px';
  positionPreview();
 }
 function positionPreview(){
  if(preview.hidden){layout.style.minHeight=previousMinHeight;return}
  const mapRect=canvas.parentElement.getBoundingClientRect();
  const layoutRect=layout.getBoundingClientRect();
  const vw=document.documentElement.clientWidth;
  const rightSpace=vw-mapRect.right-32,leftSpace=mapRect.left-32;
  const beside=Math.max(rightSpace,leftSpace)>=220;
  const width=beside?Math.min(285,Math.max(rightSpace,leftSpace)):Math.min(285,layoutRect.width);
  const rightSide=rightSpace>=leftSpace;
  const left=beside?(rightSide?mapRect.right-layoutRect.left+20:mapRect.left-layoutRect.left-width-20):0;
  const top=mapRect.top-layoutRect.top+(beside?0:mapRect.height+24);
  preview.style.width=width+'px';
  preview.style.left=left+'px';
  preview.style.top=top+'px';
  // A página comporta a lista inteira, sem barra de rolagem dentro do quadro.
  layout.style.minHeight=Math.max(mapRect.height,preview.offsetHeight+top)+'px';
 }
 function showStep(){
  if(highlighted)highlighted.classList.remove('map-tour-highlight');
  preview.hidden=current===0;
  layout.classList.toggle('map-tour-list-visible',current>=1);
  if(current>=1){
   populateRegion(9,previewTitle,previewMeta,previewCities);
   preview.querySelectorAll('a').forEach(link=>{link.removeAttribute('href');link.setAttribute('aria-disabled','true');link.tabIndex=-1});
  }
  const step=steps[current];
  highlighted=step.target()||canvas;
  highlighted.classList.add('map-tour-highlight');
  updateTourPin();
  title.textContent=step.title;desc.textContent=step.text;
  badge.textContent=(current+1)+' de '+steps.length;
  prev.hidden=current===0;
  next.textContent=current===steps.length-1?'Concluir':'Próximo';
  positionPreview();
  popover.scrollTop=0;
  next.focus({preventScroll:true});
 }
 function updateTourPin(){
  tourPin=current>=1?regionPin(9):null;
  render();
 }
 function finish(){
  if(overlay.hidden)return;
  overlay.hidden=true;
  preview.hidden=true;
  highlighted?.classList.remove('map-tour-highlight');highlighted=null;
  tourPin=null;render();
  layout.classList.remove('map-tour-active','map-tour-list-visible');layout.inert=previousInert;
  layout.style.minHeight=previousMinHeight;
  previousFocus?.focus({preventScroll:true});
 }
 function openTour(){
  if(!hitMap||!overlay.hidden)return;
  try{localStorage.setItem(storageKey,'visto')}catch(_){}
  previousFocus=document.activeElement;previousInert=layout.inert;
  previousMinHeight=layout.style.minHeight;
  layout.inert=true;layout.classList.add('map-tour-active');
  current=0;overlay.hidden=false;positionCard();showStep();
 }
 start.disabled=!hitMap;
 const previousLoad=source.onload;
 source.onload=function(...args){previousLoad.apply(this,args);start.disabled=false;if(firstVisit())openTour()};
 start.addEventListener('click',openTour);
 next.addEventListener('click',()=>{if(current===steps.length-1)finish();else{current++;showStep()}});
 prev.addEventListener('click',()=>{if(current>0){current--;showStep()}});
 document.querySelector('#tour-close').addEventListener('click',finish);

 document.addEventListener('keydown',event=>{
  if(!overlay.hidden&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();finish()}
 },true);
 // Não há ajuste na rolagem: o cartão fica fixo e a borda pertence ao próprio alvo.
 window.addEventListener('resize',()=>{positionCard();if(!overlay.hidden)updateTourPin()});
 if(hitMap&&firstVisit())openTour();
}
setupMapTour();

})();
