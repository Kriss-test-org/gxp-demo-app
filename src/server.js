'use strict';

const http = require('node:http');
const { evaluateResult } = require('./specification');
const { readRuntimeInfo } = require('./runtime');
const { renderHome } = require('./page');

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'self'; style-src 'unsafe-inline'",
  'Referrer-Policy': 'no-referrer',
};

function send(res, status, contentType, body) {
  res.writeHead(status, { ...SECURITY_HEADERS, 'Content-Type': contentType });
  res.end(body);
}

function sendJson(res, status, body) {
  send(res, status, 'application/json', JSON.stringify(body));
}

function evaluateFromQuery(params) {
  if (!params.has('value')) return undefined;
  const number = (name) => (params.get(name) === '' ? NaN : Number(params.get(name)));
  try {
    const spec = { lower: number('lower'), upper: number('upper'), decimals: number('decimals') };
    return { ...evaluateResult(number('value'), spec), decimals: spec.decimals };
  } catch (error) {
    return { error: error.message };
  }
}

function createServer(info = readRuntimeInfo()) {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (req.method !== 'GET') {
      send(res, 405, 'text/plain', 'Method not allowed');
      return;
    }

    switch (url.pathname) {
      case '/health':
        sendJson(res, 200, { status: 'ok' });
        return;
      // Build identity contract used by the GxP framework to verify what is running.
      case '/version':
        sendJson(res, 200, {
          application: info.application,
          release: info.release,
          environment: info.environment,
          commit: info.commit,
          build: info.build,
        });
        return;
      case '/': {
        const query = Object.fromEntries(url.searchParams);
        send(res, 200, 'text/html; charset=utf-8', renderHome(info, evaluateFromQuery(url.searchParams), query));
        return;
      }
      default:
        send(res, 404, 'text/plain', 'Not found');
    }
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 8080;
  const server = createServer();
  server.listen(port, () => console.log(`gxp-demo-app listening on port ${port}`));
  process.on('SIGTERM', () => server.close(() => process.exit(0)));
}

module.exports = { createServer };
