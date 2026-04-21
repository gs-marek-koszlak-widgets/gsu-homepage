export async function init(sdk) {
  await sdk.whenReady();

  const root = sdk.$('[data-root]');
  const sectionTitle = sdk.$('[data-section-title]');
  const sectionSubtitle = sdk.$('[data-section-subtitle]');
  const CARDS = [1, 2, 3, 4, 5, 6];

  function apply(props) {
    const p = props || {};
    if (root) {
      if (p.background_start) root.style.setProperty('--gsu-pc-bg-start', p.background_start);
      if (p.background_end) root.style.setProperty('--gsu-pc-bg-end', p.background_end);
      if (p.card_title_color) root.style.setProperty('--gsu-pc-card-title', p.card_title_color);
    }
    if (sectionTitle) sectionTitle.textContent = p.section_title || '';
    if (sectionSubtitle) sectionSubtitle.textContent = p.section_subtitle || '';

    CARDS.forEach((n) => {
      const card = sdk.$(`[data-card="${n}"]`);
      const icon = sdk.$(`[data-card-icon="${n}"]`);
      const title = sdk.$(`[data-card-title="${n}"]`);
      const desc = sdk.$(`[data-card-desc="${n}"]`);
      const titleVal = (p['card' + n + '_title'] || '').trim();
      const descVal = p['card' + n + '_desc'] || '';
      const linkVal = p['card' + n + '_link'] || '#';
      const iconVal = (p['card' + n + '_icon'] || '').trim();

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
      if (icon) {
        if (iconVal) {
          icon.setAttribute('src', iconVal);
          icon.removeAttribute('data-hidden');
        } else {
          icon.removeAttribute('src');
          icon.setAttribute('data-hidden', 'true');
        }
      }
    });
  }

  apply(sdk.getProps());
  sdk.on('propsChanged', apply);
}
