/*
  ============================================================
  carousel.js — Comportamento genérico de carrossel horizontal
  ============================================================

  O QUE FAZ:
  Inicializa todo elemento com [data-carousel-wrap] na página: usa
  scroll horizontal nativo (o CSS de cada seção já cuida do
  scroll-snap) e liga os botões [data-dir="prev"/"next"] dentro dele
  a um scrollBy suave, desabilitando o botão quando chega na ponta.

  COMO USAR (no HTML/Liquid de uma seção):
  <div data-carousel-wrap>
    <button class="algo__nav" data-dir="prev">...</button>
    <ul data-carousel>...</ul>
    <button class="algo__nav" data-dir="next">...</button>
  </div>

  OBSERVAÇÕES:
  Compartilhado entre featured-collection e collection-list (e
  qualquer seção nova que precise do mesmo padrão) para não duplicar
  a mesma lógica em cada <script> de seção.
*/
(function () {
  'use strict';

  function initCarousel(wrap) {
    var track = wrap.querySelector('[data-carousel]');
    var buttons = Array.prototype.slice.call(wrap.querySelectorAll('[data-dir]'));
    if (!track || !buttons.length) return;

    function step() {
      var item = track.firstElementChild;
      return item ? item.getBoundingClientRect().width + 24 : 300;
    }

    function sync() {
      var max = track.scrollWidth - track.clientWidth - 2;
      buttons.forEach(function (button) {
        button.disabled = button.dataset.dir === 'prev' ? track.scrollLeft <= 2 : track.scrollLeft >= max;
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var direction = button.dataset.dir === 'next' ? 1 : -1;
        track.scrollBy({ left: direction * step() * 2, behavior: 'smooth' });
      });
    });

    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-carousel-wrap]').forEach(initCarousel);
  });
})();
