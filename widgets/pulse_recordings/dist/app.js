export async function init(sdk) {
  await sdk.whenReady();

  const root = sdk.$('[data-root]');
  const titleEl = sdk.$('[data-section-title]');
  const subtitleEl = sdk.$('[data-section-subtitle]');
  const grid = sdk.$('[data-grid]');
  const ctaBtn = sdk.$('[data-cta]');
  const ctaLabel = sdk.$('[data-cta-label]');

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setState(state) {
    if (root) root.setAttribute('data-state', state);
  }

  function applyStyles(p) {
    if (!root) return;
    if (p.background_start) root.style.setProperty('--gsu-pr-bg-start', p.background_start);
    if (p.background_end) root.style.setProperty('--gsu-pr-bg-end', p.background_end);
    if (p.accent_color) root.style.setProperty('--gsu-pr-accent', p.accent_color);
    if (p.text_color) root.style.setProperty('--gsu-pr-text', p.text_color);
    if (p.card_background) root.style.setProperty('--gsu-pr-card-bg', p.card_background);
    if (p.card_text_color) root.style.setProperty('--gsu-pr-card-text', p.card_text_color);
  }

  function applyText(p) {
    if (titleEl) titleEl.textContent = p.section_title || '';
    if (subtitleEl) subtitleEl.textContent = p.section_subtitle || '';
    if (ctaLabel) ctaLabel.textContent = p.cta_label || '';
    if (ctaBtn) ctaBtn.setAttribute('href', p.cta_url || '#');
    if (ctaBtn) {
      const url = p.cta_url || '';
      if (/^https?:/i.test(url)) {
        ctaBtn.setAttribute('target', '_blank');
        ctaBtn.setAttribute('rel', 'noopener noreferrer');
      } else {
        ctaBtn.removeAttribute('target');
        ctaBtn.removeAttribute('rel');
      }
    }
  }

  function renderVideos(videos, playlistId) {
    if (!grid) return;
    if (!videos || !videos.length) {
      grid.innerHTML = '';
      setState('empty');
      return;
    }

    const listParam = playlistId ? `&list=${encodeURIComponent(playlistId)}` : '';
    grid.innerHTML = videos.map((v) => {
      const href = `https://www.youtube.com/watch?v=${encodeURIComponent(v.videoId)}${listParam}`;
      const thumb = v.thumbnail || `https://i.ytimg.com/vi/${encodeURIComponent(v.videoId)}/hqdefault.jpg`;
      return `
        <a class="gsu-pr__card" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(v.title || 'Watch on YouTube')}">
          <div class="gsu-pr__thumb">
            <img class="gsu-pr__thumb-img" src="${escapeHtml(thumb)}" alt="${escapeHtml(v.title || '')}" loading="lazy" />
            <div class="gsu-pr__thumb-scrim"></div>
            <div class="gsu-pr__play" aria-hidden="true"></div>
          </div>
        </a>
      `;
    }).join('');

    setState('ready');
  }

  function getConnectorSdk() {
    if (sdk && sdk.connectors && typeof sdk.connectors.execute === 'function') return sdk;
    if (typeof window !== 'undefined' && typeof window.WidgetServiceSDK === 'function') {
      try { return new window.WidgetServiceSDK(); } catch (_) { return null; }
    }
    return null;
  }

  async function loadVideos(props) {
    const playlistId = (props.playlist_id || '').trim();
    const maxVideos = Math.max(1, Math.min(50, parseInt(props.max_videos, 10) || 8));
    setState('loading');

    const connectorSdk = getConnectorSdk();
    if (!connectorSdk) {
      console.error('[pulse_recordings] WidgetServiceSDK with connectors.execute not available');
      setState('error');
      return;
    }

    try {
      const res = await connectorSdk.connectors.execute({
        permalink: 'youtube-pulse-playlist',
        method: 'GET',
        queryParams: {
          playlistId: playlistId,
          maxResults: String(maxVideos)
        }
      });

      // Connector may return a parsed object or a string depending on content type.
      let parsed = res;
      if (typeof res === 'string') {
        try { parsed = JSON.parse(res); } catch (_) { parsed = { items: [] }; }
      }
      const items = Array.isArray(parsed && parsed.items) ? parsed.items : [];
      const trimmed = items.slice(0, maxVideos);
      renderVideos(trimmed, playlistId);
    } catch (err) {
      console.error('[pulse_recordings] Failed to load playlist:', err);
      setState('error');
    }
  }

  let lastSig = '';
  function apply(props) {
    const p = props || {};
    applyStyles(p);
    applyText(p);

    const sig = `${p.playlist_id || ''}|${p.max_videos || ''}`;
    if (sig !== lastSig) {
      lastSig = sig;
      loadVideos(p);
    }
  }

  apply(sdk.getProps());
  sdk.on('propsChanged', apply);
}
