export async function init(sdk) {
  await sdk.whenReady();

  const root = sdk.$('[data-root]');
  const iconEl = sdk.$('[data-icon]');
  const textEl = sdk.$('[data-text]');
  const btn = sdk.$('[data-btn]');
  const btnText = sdk.$('[data-btn-text]');

  function apply(props) {
    const p = props || {};
    if (root) {
      if (p.background_color) root.style.setProperty('--gsu-info-bg', p.background_color);
      if (p.text_color) root.style.setProperty('--gsu-info-text', p.text_color);
    }
    if (iconEl) {
      if (p.icon_url) {
        iconEl.setAttribute('src', p.icon_url);
        iconEl.style.display = '';
      } else {
        iconEl.removeAttribute('src');
        iconEl.style.display = 'none';
      }
    }
    if (textEl) textEl.textContent = p.message_text || '';
    if (btnText) btnText.textContent = p.button_text || '';
    if (btn) btn.setAttribute('href', p.button_url || '#');
  }

  apply(sdk.getProps());
  sdk.on('propsChanged', apply);
}
