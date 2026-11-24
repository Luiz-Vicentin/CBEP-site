(() => {
 function iniciar(){
  const main=document.querySelector('main.conteudo');
  if(!main||document.querySelector('.autor-tour'))return;
  const normalize=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
  const nome=main.querySelector('h1')?.textContent.trim()||'este autor';
  const texts={
   biografia:['Biografia','Apresenta a trajetória de '+nome+', com informações sobre sua vida e sua atuação literária.'],
   'principais obras':['Principais Obras','Reúne as obras em destaque de '+nome+'. Clique na capa de um livro para abrir sua página.'+(main.querySelector('.veja-mais')?' O botão “Veja mais” leva ao acervo de obras.':'')],
   literatura:['Literatura','Explica os temas, os gêneros e as características que marcam a escrita do autor ou da autora.'],
   'caracteristicas literarias':['Literatura','Explica os temas, os gêneros e as características que marcam a escrita do autor ou da autora.'],
   premiacoes:['Premiações','Apresenta as informações disponíveis sobre prêmios e homenagens. Quando não há dados de premiações, isso é indicado na seção.'],
   complemento:['Complemento','Traz links para sites e vídeos que ajudam a conhecer melhor o autor ou a autora e suas obras.'],
   referencias:['Referências','Reúne as fontes utilizadas para produzir as informações apresentadas no site. Os links permitem consultar os materiais.']
  };
  const steps=[...main.querySelectorAll(':scope > section')].map(section=>{
   const heading=section.querySelector('h2');const content=heading&&texts[normalize(heading.textContent)];
   return content?{section,heading,title:content[0],text:content[1]}:null;
  }).filter(Boolean);
  if(!steps.length)return;
  const key='cbep-tour-perfil-v1';
  const card=document.createElement('div');card.className='autor-tour';card.hidden=true;
  card.setAttribute('role','dialog');card.setAttribute('aria-labelledby','autor-tour-title');card.setAttribute('aria-describedby','autor-tour-desc');
  card.innerHTML=`<div class="autor-tour-header"><span class="autor-tour-badge">CONHEÇA O CBEP</span><button type="button" class="autor-tour-close" aria-label="Fechar tutorial">×</button></div><h3 id="autor-tour-title"></h3><p id="autor-tour-desc"></p><div class="autor-tour-footer"><span class="autor-tour-count" role="status" aria-live="polite"></span><div class="autor-tour-nav"><button type="button" class="autor-tour-prev">Anterior</button><button type="button" class="autor-tour-next">Próximo</button></div></div>`;
  document.body.append(card);
  const help=document.createElement('button');help.type='button';help.className='autor-tour-abrir';help.setAttribute('aria-haspopup','dialog');help.innerHTML='<span aria-hidden="true">?</span> Como usar esta página';
  main.querySelector('h1').insertAdjacentElement('afterend',help);
  const prev=card.querySelector('.autor-tour-prev'),next=card.querySelector('.autor-tour-next');
  let current=0,previousFocus=null;
  function clear(){steps.forEach(step=>step.section.classList.remove('autor-tour-highlight'))}
  function show(){
   clear();const step=steps[current];step.section.classList.add('autor-tour-highlight');
   card.querySelector('.autor-tour-count').textContent=(current+1)+' de '+steps.length;
   card.querySelector('#autor-tour-title').textContent=step.title;
   card.querySelector('#autor-tour-desc').textContent=step.text;
   prev.hidden=current===0;next.textContent=current===steps.length-1?'Entendi!':'Próximo';
   const rect=step.heading.getBoundingClientRect();
   if(rect.top<24||rect.bottom>window.innerHeight*.65)step.section.scrollIntoView({block:'start',behavior:'instant'});
   next.focus({preventScroll:true});
  }
  function close(){if(card.hidden)return;card.hidden=true;clear();previousFocus?.focus({preventScroll:true})}
  function open(){if(!card.hidden)return;previousFocus=document.activeElement;current=0;card.hidden=false;try{localStorage.setItem(key,'visto')}catch(_){}show()}
  help.addEventListener('click',open);
  card.querySelector('.autor-tour-close').addEventListener('click',close);
  next.addEventListener('click',()=>{if(current===steps.length-1)close();else{current++;show()}});
  prev.addEventListener('click',()=>{if(current>0){current--;show()}});
  document.addEventListener('keydown',event=>{if(!card.hidden&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();close()}},true);
  let visto=false;try{
   visto=localStorage.getItem(key)==='visto';
   if(!visto){
    for(let i=0;i<localStorage.length;i++){
     const antiga=localStorage.key(i);
     if(antiga?.startsWith(key+'-')&&localStorage.getItem(antiga)==='visto'){visto=true;localStorage.setItem(key,'visto');break}
    }
   }
  }catch(_){}
  if(!visto)open();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
