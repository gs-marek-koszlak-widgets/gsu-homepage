export async function init(sdk) {
  await sdk.whenReady();

  const root = sdk.$('[data-root]');
  const sectionTitle = sdk.$('[data-section-title]');
  const sectionSubtitle = sdk.$('[data-section-subtitle]');
  const TILES = Array.from({ length: 15 }, (_, i) => i + 1);

  function apply(props) {
    const p = props || {};
    if (root) {
      if (p.background_color) root.style.setProperty('--gsu-pg-bg', p.background_color);
      if (p.tile_title_color) root.style.setProperty('--gsu-pg-tile-title', p.tile_title_color);
    }
    if (sectionTitle) sectionTitle.textContent = p.section_title || '';
    if (sectionSubtitle) sectionSubtitle.textContent = p.section_subtitle || '';

    const iconMap = {
      cs: p.cs_icon || '',
      cc: p.cc_icon || '',
      px: p.px_icon || '',
      sj: p.sj_icon || '',
      st: p.st_icon || '',
      ce: p.ce_icon || ''
    };

    TILES.forEach((n) => {
      const tile = sdk.$(`[data-tile="${n}"]`);
      const icon = sdk.$(`[data-tile-icon="${n}"]`);
      const title = sdk.$(`[data-tile-title="${n}"]`);
      const titleVal = (p['tile' + n + '_title'] || '').trim();
      const linkVal = p['tile' + n + '_link'] || '#';
      const iconKey = (p['tile' + n + '_icon'] || '').trim();

      if (tile) {
        if (titleVal) {
          tile.removeAttribute('data-hidden');
          tile.setAttribute('href', linkVal);
        } else {
          tile.setAttribute('data-hidden', 'true');
        }
      }
      if (title) title.textContent = titleVal;
      if (icon) {
        const url = iconMap[iconKey];
        if (url) {
          icon.setAttribute('src', url);
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
