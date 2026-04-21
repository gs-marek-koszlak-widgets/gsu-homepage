export async function init(sdk) {
  await sdk.whenReady();

  const root = sdk.$('[data-root]');
  const titleEl = sdk.$('[data-title]');
  const subtitleEl = sdk.$('[data-subtitle]');
  const btn = sdk.$('[data-btn]');
  const btnText = sdk.$('[data-btn-text]');

  function apply(props) {
    const p = props || {};
    if (root) {
      if (p.background_color) root.style.setProperty('--gsu-ann-bg', p.background_color);
      if (p.accent_color) root.style.setProperty('--gsu-ann-accent', p.accent_color);
    }
    if (titleEl) titleEl.textContent = p.title_text || '';
    if (subtitleEl) subtitleEl.textContent = p.subtitle_text || '';
    if (btnText) btnText.textContent = p.button_text || '';
    if (btn) btn.setAttribute('href', p.button_url || '#');
  }

  apply(sdk.getProps());
  sdk.on('propsChanged', apply);
}
