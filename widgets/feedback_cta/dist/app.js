export async function init(sdk) {
  await sdk.whenReady();

  const root = sdk.$('[data-root]');
  const titleEl = sdk.$('[data-title]');
  const subtitleEl = sdk.$('[data-subtitle]');
  const btn = sdk.$('[data-btn]');
  const btnText = sdk.$('[data-btn-text]');
  const decoR = sdk.$('[data-deco="right"]');
  const decoL = sdk.$('[data-deco="left"]');

  function apply(props) {
    const p = props || {};
    if (root) {
      if (p.background_color) root.style.setProperty('--gsu-fb-bg', p.background_color);
      if (p.text_color) root.style.setProperty('--gsu-fb-text', p.text_color);
      if (p.button_color) root.style.setProperty('--gsu-fb-btn', p.button_color);
      if (p.button_text_color) root.style.setProperty('--gsu-fb-btn-text', p.button_text_color);
    }
    if (titleEl) titleEl.textContent = p.title_text || '';
    if (subtitleEl) subtitleEl.textContent = p.subtitle_text || '';
    if (btnText) btnText.textContent = p.button_text || '';
    if (btn) btn.setAttribute('href', p.button_url || '#');

    const decoUrl = (p.decoration_image_url || '').trim();
    [decoR, decoL].forEach((d) => {
      if (!d) return;
      if (decoUrl) {
        d.setAttribute('src', decoUrl);
        d.removeAttribute('data-hidden');
      } else {
        d.removeAttribute('src');
        d.setAttribute('data-hidden', 'true');
      }
    });
  }

  apply(sdk.getProps());
  sdk.on('propsChanged', apply);
}
