(() => {
 const botao=document.getElementById('copiar-link-cbep');
 botao?.addEventListener('click',async()=>{
  const link=document.getElementById('link-cbep');
  const status=document.getElementById('compartilhar-status');
  try{await navigator.clipboard.writeText(link.href);status.textContent='Link copiado! Agora você pode compartilhar.'}
  catch(_){status.textContent='Copie o endereço exibido abaixo para compartilhar o site.'}
 });
})();
