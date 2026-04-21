export async function init(sdk) {
  await sdk.whenReady();

  const root = sdk.$('[data-root]');
  const sectionTitle = sdk.$('[data-section-title]');
  const CARDS = [1, 2];

  function apply(props) {
    const p = props || {};
    if (root) {
      if (p.background_color) root.style.setProperty('--gsu-ql-bg', p.background_color);
      if (p.border_color) root.style.setProperty('--gsu-ql-border', p.border_color);
      if (p.card_title_color) root.style.setProperty('--gsu-ql-card-title', p.card_title_color);
      if (p.link_color) root.style.setProperty('--gsu-ql-link', p.link_color);
    }
    if (sectionTitle) sectionTitle.textContent = p.section_title || '';

    CARDS.forEach((n) => {
      const card = sdk.$(`[data-card="${n}"]`);
      const icon = sdk.$(`[data-card-icon="${n}"]`);
      const title = sdk.$(`[data-card-title="${n}"]`);
      const desc = sdk.$(`[data-card-desc="${n}"]`);
      const linkText = sdk.$(`[data-card-link-text="${n}"]`);

      if (card) card.setAttribute('href', p['card' + n + '_link_url'] || '#');
      if (title) title.textContent = p['card' + n + '_title'] || '';
      if (desc) desc.textContent = p['card' + n + '_desc'] || '';
      if (linkText) linkText.textContent = p['card' + n + '_link_text'] || '';
      const iconUrl = (p['card' + n + '_icon'] || '').trim();
      if (icon) {
        if (iconUrl) {
          icon.setAttribute('src', iconUrl);
          icon.removeAttribute('data-hidden');
        } else {
          icon.removeAttribute('src');
          icon.setAttribute('data-hidden', 'true');
        }
      }

      [1, 2, 3].forEach((b) => {
        const badge = sdk.$(`[data-card-badge="${n}-${b}"]`);
        const url = (p['card' + n + '_badge' + b] || '').trim();
        if (!badge) return;
        if (url) {
          badge.setAttribute('src', url);
          badge.removeAttribute('data-hidden');
        } else {
          badge.removeAttribute('src');
          badge.setAttribute('data-hidden', 'true');
        }
      });
    });
  }

  apply(sdk.getProps());
  sdk.on('propsChanged', apply);
}
