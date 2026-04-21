export async function init(sdk) {
  await sdk.whenReady();

  const root = sdk.$('[data-root]');
  const toggle = sdk.$('[data-toggle]');
  const panel = sdk.$('[data-panel]');
  const barLabel = sdk.$('[data-bar-label]');

  const COL_TITLES = {
    cs: 'Customer Success',
    px: 'Product Experience',
    cc: 'Customer Communities',
    ce: 'Customer Education',
    sa: 'Skilljar Academy',
    staircase: 'Staircase AI'
  };

  const LINK_LABELS = {
    cs_admin: 'Admin',
    cs_enduser: 'End User',
    cs_japanese: 'Japanese Training',
    cs_quicktips: 'Quick Tip Videos',
    cs_ilt: 'Instructor-Led Training',
    px_gettingstarted: 'Getting Started: PX Certification Prep',
    px_cspx: 'CS & PX Better Together',
    cc_setup: 'CC: Community Setup and Administration',
    cc_management: 'CC: Community Management and Moderation',
    cc_japanese: 'Japanese Training',
    ce_academy: 'CE: Academy Setup and Customization',
    ce_courses: 'CE: Course Building',
    ce_lms: 'CE: Learner Management and Engagement',
    ce_certification: 'CE: Certification and Analytics',
    sa_skilljar: 'Skilljar Academy',
    staircase_ai: 'Staircase AI',
    staircase_gettingstarted: 'Getting Started with Staircase AI'
  };

  function setOpen(open) {
    if (!root || !toggle || !panel) return;
    root.setAttribute('data-open', open ? 'true' : 'false');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  function apply(props) {
    const p = props || {};
    if (root) {
      if (p.bar_background) root.style.setProperty('--gsu-td-bar-bg', p.bar_background);
      if (p.bar_text_color) root.style.setProperty('--gsu-td-bar-text', p.bar_text_color);
      if (p.panel_background) root.style.setProperty('--gsu-td-panel-bg', p.panel_background);
      if (p.panel_text_color) root.style.setProperty('--gsu-td-panel-text', p.panel_text_color);
      if (p.color_cs)        root.style.setProperty('--gsu-td-col-cs', p.color_cs);
      if (p.color_px)        root.style.setProperty('--gsu-td-col-px', p.color_px);
      if (p.color_cc)        root.style.setProperty('--gsu-td-col-cc', p.color_cc);
      if (p.color_ce)        root.style.setProperty('--gsu-td-col-ce', p.color_ce);
      if (p.color_sa)        root.style.setProperty('--gsu-td-col-sa', p.color_sa);
      if (p.color_staircase) root.style.setProperty('--gsu-td-col-staircase', p.color_staircase);
    }

    if (barLabel) barLabel.textContent = p.bar_label || 'Training Directory';

    Object.keys(COL_TITLES).forEach((key) => {
      const el = sdk.$(`[data-col-title="${key}"]`);
      if (el) el.textContent = p['title_' + key] || COL_TITLES[key];
    });

    Object.keys(LINK_LABELS).forEach((key) => {
      const el = sdk.$(`[data-link="${key}"]`);
      if (!el) return;
      const label = p['label_' + key] || LINK_LABELS[key];
      const url = (p['url_' + key] || '').trim();
      el.textContent = label;
      if (url) {
        el.setAttribute('href', url);
        el.removeAttribute('data-hidden');
      } else {
        el.setAttribute('href', '#');
        // Keep visible even without URL so layout matches defaults; hide only if label also cleared
        if (!label) el.setAttribute('data-hidden', 'true');
        else el.removeAttribute('data-hidden');
      }
    });
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = root && root.getAttribute('data-open') === 'true';
      setOpen(!open);
    });
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  // Close on outside click (using shadow root boundary)
  document.addEventListener('click', (e) => {
    if (!root) return;
    const path = e.composedPath ? e.composedPath() : [];
    if (path.indexOf(root) === -1) setOpen(false);
  });

  apply(sdk.getProps());
  sdk.on('propsChanged', apply);
}
