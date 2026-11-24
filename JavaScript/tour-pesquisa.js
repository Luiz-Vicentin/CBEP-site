(() => {
 function iniciar(){
  const tipo=document.body.dataset.pagina;
  if(tipo!=='obras'&&tipo!=='autores')return;
  const autores=tipo==='autores';
  const campo=document.querySelector('#pesquisa');
  const painel=document.querySelector('#painel-lateral');
  if(!campo||!painel)return;
  const key='cbep-tour-pesquisa-'+tipo+'-v1';
  const card=document.createElement('div');
  card.className='pesquisa-tour';card.hidden=true;
  card.setAttribute('role','dialog');
  card.setAttribute('aria-labelledby','pesquisa-tour-title');
  card.setAttribute('aria-describedby','pesquisa-tour-desc');
  card.innerHTML=`<div class="pesquisa-tour-header"><span class="pesquisa-tour-badge">Conheça o CBEP</span><button type="button" class="pesquisa-tour-close" aria-label="Fechar tutorial">×</button></div>
   <h3 id="pesquisa-tour-title">${autores?'Pesquise os autores!':'Pesquise as obras!'}</h3>
   <p id="pesquisa-tour-desc">${autores?'Utilize este campo para pesquisar escritores paranaenses pelo nome. Basta digitar o nome desejado e os resultados aparecerão na lista automaticamente.':'Utilize este campo para pesquisar obras pelo título. Basta digitar o título desejado e os resultados aparecerão na lista automaticamente.'}</p>
   <div class="pesquisa-tour-footer"><span class="pesquisa-tour-count">1 de 1</span><button type="button" class="pesquisa-tour-done">Entendi!</button></div>`;
  document.body.append(card);
  const ajuda=document.createElement('button');
  ajuda.type='button';ajuda.className='ajuda-pesquisa';
  ajuda.innerHTML='<span aria-hidden="true">?</span> Como pesquisar';
  ajuda.setAttribute('aria-haspopup','dialog');
  const heading=document.querySelector('main h1');
  if(heading){
   const header=document.createElement('div');header.className='pesquisa-cabecalho';
   heading.before(header);header.append(heading,ajuda);
  }else campo.insertAdjacentElement('afterend',ajuda);
  function posicionar(){
   if(card.hidden)return;
   const rect=campo.getBoundingClientRect(),vw=document.documentElement.clientWidth;
   const width=card.offsetWidth;
   const left=rect.right+width+20<=vw-12?rect.right+20:vw-width-12;
   card.style.left=Math.max(12,left)+'px';
   card.style.top='24px';
  }
  function fechar(){
   card.hidden=true;campo.classList.remove('pesquisa-tour-highlight');
   if(!painel.hidden)campo.focus({preventScroll:true});
  }
  function abrir(){
   if(!card.hidden||painel.hidden)return;
   try{localStorage.setItem(key,'visto')}catch(_){}
   card.hidden=false;campo.classList.add('pesquisa-tour-highlight');posicionar();
   card.querySelector('.pesquisa-tour-done').focus({preventScroll:true});
  }
  ajuda.addEventListener('click',abrir);
  card.querySelector('.pesquisa-tour-close').addEventListener('click',fechar);
  card.querySelector('.pesquisa-tour-done').addEventListener('click',fechar);
  document.addEventListener('keydown',event=>{
   if(!card.hidden&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();fechar()}
  },true);
  document.querySelector('#fechar-painel')?.addEventListener('click',()=>{card.hidden=true;campo.classList.remove('pesquisa-tour-highlight')});
  window.addEventListener('resize',posicionar);
  let visto=false;try{visto=localStorage.getItem(key)==='visto'}catch(_){}
  if(!visto)abrir();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);
 else iniciar();
})();
