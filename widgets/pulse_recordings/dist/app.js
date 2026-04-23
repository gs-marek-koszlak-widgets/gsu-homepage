export async function init(sdk) {
  await sdk.whenReady();

  const root = sdk.$('[data-root]');
  const titleEl = sdk.$('[data-section-title]');
  const subtitleEl = sdk.$('[data-section-subtitle]');
  const grid = sdk.$('[data-grid]');
  const ctaBtn = sdk.$('[data-cta]');
  const ctaLabel = sdk.$('[data-cta-label]');

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
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
      const date = formatDate(v.publishedAt);
      const channel = v.channelTitle || '';
      let meta = '';
      if (date && channel) {
        meta = `<span>${escapeHtml(channel)}</span><span class="gsu-pr__card-meta-dot"></span><span>${escapeHtml(date)}</span>`;
      } else if (date) {
        meta = `<span>${escapeHtml(date)}</span>`;
      } else if (channel) {
        meta = `<span>${escapeHtml(channel)}</span>`;
      }
      return `
        <a class="gsu-pr__card" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(v.title || 'Watch on YouTube')}">
          <div class="gsu-pr__thumb">
            <img class="gsu-pr__thumb-img" src="${escapeHtml(thumb)}" alt="" loading="lazy" />
            <div class="gsu-pr__thumb-scrim"></div>
            <div class="gsu-pr__play" aria-hidden="true"></div>
          </div>
          <div class="gsu-pr__body">
            <div class="gsu-pr__card-title">${escapeHtml(v.title || '')}</div>
            <div class="gsu-pr__card-meta">${meta}</div>
          </div>
        </a>
      `;
    }).join('');

    setState('ready');
  }

  async function loadVideos(props) {
    const playlistId = (props.playlist_id || '').trim();
    const maxVideos = Math.max(1, Math.min(50, parseInt(props.max_videos, 10) || 8));
    setState('loading');

    try {
      const res = await sdk.connectors.execute({
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
