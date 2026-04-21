export async function init(sdk) {
  await sdk.whenReady();

  const root = sdk.$('[data-root]');
  const deco = sdk.$('[data-deco]');
  const titleEl = sdk.$('[data-title]');
  const subtitleEl = sdk.$('[data-subtitle]');

  function apply(props) {
    const p = props || {};
    if (root) {
      if (p.background_start) root.style.setProperty('--gsu-hero-bg-start', p.background_start);
      if (p.background_end) root.style.setProperty('--gsu-hero-bg-end', p.background_end);
    }
    if (deco) {
      if (p.decoration_image_url) {
        deco.setAttribute('src', p.decoration_image_url);
        deco.style.display = '';
      } else {
        deco.removeAttribute('src');
        deco.style.display = 'none';
      }
    }
    if (titleEl) titleEl.textContent = p.title_text || '';
    if (subtitleEl) subtitleEl.textContent = p.subtitle_text || '';
  }

  apply(sdk.getProps());
  sdk.on('propsChanged', apply);
}
