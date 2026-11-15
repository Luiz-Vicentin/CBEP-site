// Eventos transcritos e adaptados das imagens fornecidas para a linha do tempo.
const eventos = [
  {
    "ano": "1853",
    "descricao": "O Paraná deixou de fazer parte de São Paulo e tornou-se uma província independente. Curitiba passou a ser sua capital. A reorganização da administração, da política e da economia marcou o início de uma nova fase para o estado.\n\nNa segunda metade do século XIX, a construção de estradas e ferrovias e a chegada de imigrantes contribuíram para a formação da diversidade cultural paranaense."
  },
  {
    "ano": "1857",
    "descricao": "Após quatro anos de emancipação política, o estado ganhava sua primeira biblioteca pública, importante para a circulação e preservação de livros e textos.\n\nFernando Amaro de Miranda (1831–1857) é considerado o primeiro poeta paranaense. Sua obra, de caráter romântico, é tida como marco inicial da poesia no Paraná."
  },
  {
    "ano": "1881",
    "descricao": "O escritor José Francisco Rocha Pombo (1857–1933) publicou, em 1881, o poema A Guairá, além de contribuir para o desenvolvimento da literatura paranaense e do Movimento Simbolista."
  },
  {
    "ano": "1888",
    "descricao": "Emiliano Perneta, um dos principais nomes do Simbolismo paranaense, foi criador da revista O Cenáculo. Publicou seu primeiro livro, Músicas, mais tarde, e ficou conhecido como o “príncipe dos poetas paranaenses”."
  },
  {
    "ano": "1889 – 1930",
    "descricao": "No início da República, o movimento simbolista passou a ocupar posição de destaque, reunindo escritores como Dario Vellozo, Emiliano Perneta, Nestor Vítor, Silveira Neto e Santa Rita. O movimento ficou associado à criação de revistas literárias e à busca por uma expressão poética própria."
  },
  {
    "ano": "1912",
    "descricao": "Helena Kolody nasceu em Cruz Machado, no Paraná, em 12 de outubro de 1912."
  },
  {
    "ano": "1912 – 1916",
    "descricao": "O conflito entre moradores da região do Contestado e as forças do Estado e do Exército brasileiro, ocorrido entre Paraná e Santa Catarina, envolveu disputas por terra, construção de uma ferrovia e situação de agricultores sem acesso à terra. O confronto terminou em 1916, com a assinatura de um acordo de delimitação de fronteiras entre os dois estados, porém com a morte de milhares de pessoas."
  },
  {
    "ano": "1925",
    "descricao": "Dalton Trevisan nasceu em Curitiba, em 14 de junho de 1925. Anos mais tarde, o escritor publicaria grandes obras reconhecidas nacionalmente, representando sua cidade e estado."
  },
  {
    "ano": "1928",
    "descricao": "Aos 16 anos, Helena publicou o poema A Lágrima, na revista estudantil O Garoto, dando início à sua trajetória literária."
  },
  {
    "ano": "1930 – 1940",
    "descricao": "Helena começa a atuar como professora em diferentes escolas do Paraná e dedica-se com maior intensidade à sua produção poética, enquanto Dalton Trevisan dá os primeiros passos na escrita e na publicação de seus textos."
  },
  {
    "ano": "1941",
    "descricao": "Helena escreve o seu primeiro livro, Paisagem Interior, uma obra produzida para o aniversário de 50 anos de seu pai. Inicialmente, ela tinha dúvidas sobre a publicação de seus poemas. Com a ajuda de sua amiga Rodrigo Júnior, seus poemas foram publicados com a gráfica do Liceu Industrial do Paraná (atual Instituto Federal do Paraná), são realizados 450 exemplares. No dia do lançamento, a autora esconde-se por vergonha."
  },
  {
    "ano": "1946 – 1948",
    "descricao": "Dalton Trevisan publica a revista Joaquim, importante publicação literária de Curitiba que ajudou a movimentar o cenário cultural paranaense."
  },
  {
    "ano": "1951",
    "descricao": "É publicado A Sombra no Rio, uma das obras mais raras e de grande importância para a trajetória poética de Helena Kolody, tendo recebido premiações como o Prêmio Ismael Martins."
  },
  {
    "ano": "1959",
    "descricao": "Dalton estreia uma de suas obras mais famosas, Novelas Nada Exemplares, que reúne contos longos inspirados nas obras de Miguel de Cervantes. A publicação dessas “novelas” literárias contribuiu para aumentar o reconhecimento do autor, que conquistou também o Prêmio Jabuti."
  },
  {
    "ano": "1964",
    "descricao": "Luci Collin nasce em 1964, na cidade de Curitiba, e décadas mais tarde destaca-se como escritora, poeta e tradutora, contribuindo para a presença feminina na literatura paranaense contemporânea.\n\nDalton Trevisan publica Cemitério de Elefantes, obra que consolidou sua importância na literatura estadual e nacional."
  },
  {
    "ano": "1965",
    "descricao": "Dalton publica O Vampiro de Curitiba, uma de suas obras mais conhecidas e simbólicas, responsável pela popularização do apelido pelo qual o autor ficou conhecido. A obra ganhou diversos prêmios renomados, como o Prêmio Jabuti."
  },
  {
    "ano": "1984",
    "descricao": "Com 19 anos, Luci Collin publica seu primeiro livro, Estarreçer, iniciando sua trajetória literária."
  },
  {
    "ano": "1988",
    "descricao": "Helena Kolody publica Viagem no Espelho, antologia de grande destaque, sendo homenageada pela Associação dos Servidores Públicos do Paraná."
  },
  {
    "ano": "1991 – 1997",
    "descricao": "A publicação de obras como Espécie, Espelhar e Lírica Invisível garantiu reconhecimento, ampliando a produção poética e em prosa da autora."
  },
  {
    "ano": "2004",
    "descricao": "Helena Kolody falece em Curitiba, aos 91 anos."
  },
  {
    "ano": "2011",
    "descricao": "Helena Kolody é condecorada pela Secretaria de Cultura com a Ordem do Mérito Cultural – Classe Grã-Cruz, o mais alto nível da homenagem e mais alta distinção oficial concedida pelo Governo Federal brasileiro, em reconhecimento a contribuições excepcionais e de grande relevância à cultura do país."
  },
  {
    "ano": "2014 – 2017",
    "descricao": "Luci Collin publica obras como Querer Falar e A Palavra Algo, ampliando seu reconhecimento na literatura contemporânea. A obra A Palavra Algo ganhou prêmios como o Prêmio Jabuti em 2017."
  },
  {
    "ano": "2024",
    "descricao": "Dalton Trevisan falece em Curitiba, aos 99 anos."
  },
  {
    "ano": "2026",
    "descricao": "Luci Collin continua a produzir e a publicar novas obras ao longo dos anos. Sua escrita permanece contribuindo para a renovação e a valorização da literatura paranaense contemporânea, deixando marcas de sua trajetória."
  }
];
const periodos = [[1853,1900],[1901,1950],[1951,2000],[2001,2026]];
const imagensArvore = ['1-removebg-preview.png','3-removebg-preview.png','6-removebg-preview.png','max.png'];
const raizArvore = new URL('../imagens/arvore/', document.currentScript.src);
const dates=document.querySelector('.timeline-dates');
const panel=document.querySelector('#timeline-painel');
const previous=document.querySelector('#timeline-prev');
const next=document.querySelector('#timeline-next');
let current=0;
function showPeriod(index){
 current=Math.max(0,Math.min(periodos.length-1,index));
 const [inicio,fim]=periodos[current];
 panel.replaceChildren();panel.scrollTop=0;
 const lista=document.createElement('ol');lista.className='timeline-event-list';
 eventos.filter(e=>parseInt(e.ano,10)>=inicio&&parseInt(e.ano,10)<=fim).forEach(e=>{
  const item=document.createElement('li');const ano=document.createElement('h3');ano.textContent=e.ano;
  const descricao=document.createElement('div');descricao.className='timeline-description';
  e.descricao.split('\n\n').forEach(texto=>{const p=document.createElement('p');p.textContent=texto;descricao.append(p)});
  item.append(ano,descricao);lista.append(item);
 });
 panel.append(lista);
 [...dates.children].forEach((b,i)=>{b.classList.toggle('selected',i===current);b.setAttribute('aria-selected',String(i===current));b.tabIndex=i===current?0:-1});
 panel.setAttribute('aria-labelledby',dates.children[current].id);
 dates.children[current].scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
 previous.disabled=current===0;next.disabled=current===periodos.length-1;
}
periodos.forEach(([inicio,fim],i)=>{
 const b=document.createElement('button');b.id='timeline-periodo-'+i;b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-controls','timeline-painel');b.textContent=inicio+'–'+fim;
 const simbolo=document.createElement('span');simbolo.className='timeline-simbolo';
 const arvore=document.createElement('img');arvore.src=new URL(imagensArvore[i],raizArvore).href;
 arvore.alt='';arvore.setAttribute('aria-hidden','true');arvore.className='timeline-arvore timeline-arvore-'+i;
 arvore.width=48;arvore.height=56;simbolo.append(arvore);b.prepend(simbolo);
 b.addEventListener('click',()=>showPeriod(i));dates.append(b);
});
previous.addEventListener('click',()=>showPeriod(current-1));
next.addEventListener('click',()=>showPeriod(current+1));
dates.addEventListener('keydown',e=>{
 if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
 e.preventDefault();showPeriod(e.key==='Home'?0:e.key==='End'?3:current+(e.key==='ArrowRight'?1:-1));dates.children[current].focus();
});
showPeriod(0);
