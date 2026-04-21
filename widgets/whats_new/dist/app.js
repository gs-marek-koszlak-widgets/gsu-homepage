export async function init(sdk) {
  await sdk.whenReady();

  const root = sdk.$('[data-root]');
  const sectionTitle = sdk.$('[data-section-title]');
  const sectionSubtitle = sdk.$('[data-section-subtitle]');
  const scroller = sdk.$('[data-scroller]');
  const arrowL = sdk.$('[data-arrow="left"]');
  const arrowR = sdk.$('[data-arrow="right"]');
  const fadeL = sdk.$('[data-fade="left"]');
  const fadeR = sdk.$('[data-fade="right"]');
  const CARDS = [1, 2, 3, 4, 5, 6, 7, 8];

  function apply(props) {
    const p = props || {};
    if (root) {
      if (p.background_start) root.style.setProperty('--gsu-wn-bg-start', p.background_start);
      if (p.background_end) root.style.setProperty('--gsu-wn-bg-end', p.background_end);
      if (p.accent_color) root.style.setProperty('--gsu-wn-accent', p.accent_color);
    }
    if (sectionTitle) sectionTitle.textContent = p.section_title || '';
    if (sectionSubtitle) sectionSubtitle.textContent = p.section_subtitle || '';

    CARDS.forEach((n) => {
      const card = sdk.$(`[data-card="${n}"]`);
      const img = sdk.$(`[data-card-img="${n}"]`);
      const title = sdk.$(`[data-card-title="${n}"]`);
      const desc = sdk.$(`[data-card-desc="${n}"]`);
      const meta = sdk.$(`[data-card-meta="${n}"]`);
      const titleVal = (p['card' + n + '_title'] || '').trim();
      const descVal = p['card' + n + '_desc'] || '';
      const imgVal = p['card' + n + '_image'] || '';
      const linkVal = p['card' + n + '_link'] || '#';
      const durationVal = p['card' + n + '_duration'] || '';

      if (card) {
        if (titleVal) {
          card.removeAttribute('data-hidden');
          card.setAttribute('href', linkVal);
        } else {
          card.setAttribute('data-hidden', 'true');
        }
      }
      if (title) title.textContent = titleVal;
      if (desc) desc.textContent = descVal;
      if (meta) meta.textContent = durationVal;
      if (img) {
        if (imgVal) {
          img.setAttribute('src', imgVal);
          img.style.display = '';
        } else {
          img.removeAttribute('src');
          img.style.display = 'none';
        }
      }
    });

    update();
  }

  function update() {
    if (!scroller) return;
    const sl = scroller.scrollLeft;
    const max = scroller.scrollWidth - scroller.clientWidth;
    if (max <= 5) {
      arrowL && arrowL.setAttribute('data-visible', 'false');
      arrowR && arrowR.setAttribute('data-visible', 'false');
      fadeL && fadeL.setAttribute('data-visible', 'false');
      fadeR && fadeR.setAttribute('data-visible', 'false');
      return;
    }
    const showL = sl > 10 ? 'true' : 'false';
    const showR = sl < max - 10 ? 'true' : 'false';
    arrowL && arrowL.setAttribute('data-visible', showL);
    arrowR && arrowR.setAttribute('data-visible', showR);
    fadeL && fadeL.setAttribute('data-visible', showL);
    fadeR && fadeR.setAttribute('data-visible', showR);
  }

  if (arrowL) arrowL.addEventListener('click', () => scroller && scroller.scrollBy({ left: -600, behavior: 'smooth' }));
  if (arrowR) arrowR.addEventListener('click', () => scroller && scroller.scrollBy({ left:  600, behavior: 'smooth' }));
  if (scroller) scroller.addEventListener('scroll', update);
  window.addEventListener('resize', update);

  apply(sdk.getProps());
  sdk.on('propsChanged', apply);
  setTimeout(update, 100);
  setTimeout(update, 500);
}
