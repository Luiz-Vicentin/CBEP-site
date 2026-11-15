(() => {
  const key = 'cbep-tamanho-fonte';
  let tamanho = 100;
  let contraste = false;
  const fontesOriginais = new WeakMap();
  const seletorTexto = 'main h1, main h2, main h3, main h4, main h5, main h6, main p, main li, main dt, main dd, main blockquote, main figcaption, main span, main a, main strong, main em, main small, main label, main td, main th';
  const ampliarConteudo = () => {
    const textos = [...document.querySelectorAll(seletorTexto)].filter(elemento =>
      !elemento.closest('button, input, select, textarea, .acessibilidade, .voltar-obras, .veja-mais, .outros-saiba-mais > a, .navegacao-obras, .decada, [role="button"]'));
    // Mede todos antes de aplicar para evitar que tamanhos herdados se multipliquem.
    textos.forEach(elemento => {
      if (!fontesOriginais.has(elemento)) fontesOriginais.set(elemento, parseFloat(getComputedStyle(elemento).fontSize));
    });
    textos.forEach(elemento => {
      elemento.style.fontSize = tamanho === 100 ? '' : (fontesOriginais.get(elemento) * tamanho / 100) + 'px';
    });
  };
  try {
    const salvo = Number(localStorage.getItem(key));
    if (Number.isFinite(salvo) && salvo >= 100 && salvo <= 200) tamanho = salvo;
  } catch (_) {}
  try { contraste = localStorage.getItem('cbep-alto-contraste') === 'true'; } catch (_) {}
  const aplicar = () => {
    ampliarConteudo();
    document.documentElement.toggleAttribute('data-alto-contraste', contraste);
    document.querySelector('#alternar-contraste')?.setAttribute('aria-pressed', String(contraste));
    const estado = document.querySelector('#contraste-estado');
    if (estado) estado.textContent = contraste ? 'Ativado' : 'Desativado';
    document.querySelectorAll('[data-fonte]').forEach(botao => {
      botao.disabled = (botao.dataset.fonte === 'diminuir' && tamanho <= 100) ||
        (botao.dataset.fonte === 'aumentar' && tamanho >= 200);
    });
  };
  aplicar();
  document.addEventListener('DOMContentLoaded', () => {
    const conteudo = document.querySelector('main');
    if (conteudo) new MutationObserver(ampliarConteudo).observe(conteudo, {childList: true, subtree: true});
    const abrir = document.querySelector('#abrir-acessibilidade');
    const painel = document.querySelector('#painel-acessibilidade');
    if (painel) painel.innerHTML = `
      <div class="acessibilidade-topo">
        <h2 id="titulo-acessibilidade">ACESSIBILIDADE</h2>
        <button type="button" class="acessibilidade-fechar" aria-label="Fechar acessibilidade">&times;</button>
      </div>
      <button id="alternar-contraste" type="button" aria-label="Alto contraste" aria-pressed="false"><span aria-hidden="true">&#9881;</span>Contraste</button>
      <button type="button" data-fonte="aumentar"><span aria-hidden="true">A+</span>Aumentar o tamanho do texto</button>
      <button type="button" data-fonte="diminuir"><span aria-hidden="true">A-</span>Diminuir tamanho do texto</button>
      <button type="button" data-fonte="normal"><span aria-hidden="true">A</span>Restaurar tamanho do texto</button>
      <span id="fonte-status" class="fonte-status" role="status" aria-live="polite"></span>`;
    aplicar();
    const alternar = document.querySelector('#alternar-contraste');
    const fechar = (retornarFoco = false) => {
      if (!painel || !abrir) return;
      painel.hidden = true;
      abrir.setAttribute('aria-expanded', 'false');
      if (retornarFoco) abrir.focus();
    };
    abrir?.addEventListener('click', () => {
      painel.hidden = !painel.hidden;
      abrir.setAttribute('aria-expanded', String(!painel.hidden));
      if (!painel.hidden) painel.querySelector('.acessibilidade-fechar').focus();
    });
    painel?.querySelector('.acessibilidade-fechar').addEventListener('click', () => fechar(true));
    document.addEventListener('click', event => {
      if (painel && !painel.hidden && !event.target.closest('.acessibilidade')) fechar();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && painel && !painel.hidden) {
        event.preventDefault();
        fechar(true);
      }
    });
    document.querySelector('.acessibilidade')?.addEventListener('focusout', event => {
      if (!event.currentTarget.contains(event.relatedTarget)) fechar();
    });
    alternar?.addEventListener('click', () => {
      contraste = !contraste;
      aplicar();
      try { localStorage.setItem('cbep-alto-contraste', String(contraste)); } catch (_) {}
      document.getElementById('fonte-status').textContent = 'Alto contraste ' + (contraste ? 'ativado' : 'desativado');
    });
    document.querySelectorAll('[data-fonte]').forEach(botao => {
      botao.addEventListener('click', () => {
        tamanho = botao.dataset.fonte === 'normal' ? 100 :
          Math.max(100, Math.min(200, tamanho + (botao.dataset.fonte === 'aumentar' ? 10 : -10)));
        aplicar();
        try { localStorage.setItem(key, String(tamanho)); } catch (_) {}
        document.getElementById('fonte-status').textContent = 'Tamanho do texto: ' + tamanho + '%';
      });
    });
  });
})();
