'use strict';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderOutcome(outcome) {
  if (!outcome) return '';
  if (outcome.error) {
    return `<p class="outcome error" role="alert">Invalid input: ${escapeHtml(outcome.error)}</p>`;
  }
  const fixed = (n) => escapeHtml(n.toFixed(outcome.decimals));
  return `<p class="outcome ${outcome.status.toLowerCase()}" role="status">`
    + `Reported result <strong>${fixed(outcome.reported)}</strong> `
    + `<span data-testid="limits">(limits ${fixed(outcome.lower)} to ${fixed(outcome.upper)})</span>: `
    + `<strong data-testid="status">${escapeHtml(outcome.status)}</strong></p>`;
}

function renderHome(info, outcome, query = {}) {
  const field = (name, label, fallback) => `
      <label>${label}
        <input name="${name}" inputmode="decimal" value="${escapeHtml(query[name] ?? fallback)}" required>
      </label>`;

  const banner = info.showEnvironmentBanner
    ? `<div class="banner">${escapeHtml(info.environment.toUpperCase())} environment - not for production use</div>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(info.displayName)}</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; color: #1f2328; background: #f6f8fa; }
    main { max-width: 640px; margin: 2rem auto; padding: 0 1rem; }
    .banner { background: #fff8c5; border-bottom: 1px solid #d4a72c; padding: .5rem 1rem; text-align: center; }
    form { display: grid; gap: .75rem; background: #fff; border: 1px solid #d0d7de; border-radius: 8px; padding: 1rem; }
    label { display: grid; gap: .25rem; }
    input { padding: .4rem; font-size: 1rem; }
    button { padding: .5rem; font-size: 1rem; }
    .outcome { padding: .75rem; border-radius: 8px; }
    .pass { background: #dafbe1; } .oos, .error { background: #ffebe9; }
    footer { margin-top: 2rem; font-size: .85rem; color: #59636e; }
  </style>
</head>
<body>
  ${banner}
  <main>
    <h1>${escapeHtml(info.displayName)}</h1>
    <p>Evaluate a measured result against its specification limits.</p>
    <form method="get" action="/">
      ${field('value', 'Measured result', '')}
      ${field('lower', 'Lower limit', '95.0')}
      ${field('upper', 'Upper limit', '105.0')}
      ${field('decimals', 'Reported decimals', '1')}
      <button type="submit">Evaluate</button>
    </form>
    ${renderOutcome(outcome)}
    <footer data-testid="build-info">
      Release ${escapeHtml(info.release)} &middot; Environment ${escapeHtml(info.environment)}
      &middot; Build ${escapeHtml(info.build)} &middot; Commit ${escapeHtml(info.commit.slice(0, 12))}
    </footer>
  </main>
</body>
</html>`;
}

module.exports = { renderHome, escapeHtml };
