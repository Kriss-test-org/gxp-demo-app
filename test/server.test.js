'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../src/server');
const { readRuntimeInfo } = require('../src/runtime');

let server;
let baseUrl;

before(async () => {
  const info = readRuntimeInfo({
    APP_ENVIRONMENT: 'staging',
    APP_RELEASE_VERSION: '1.2.3-rc.1',
    GIT_COMMIT: 'abc123def4567890',
    BUILD_ID: '42.1',
  });
  server = createServer(info);
  await new Promise((resolve) => server.listen(0, resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

test('[URS-004] /version reports the build identity and the deployment context', async () => {
  const response = await fetch(`${baseUrl}/version`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    application: 'gxp-demo-app',
    release: '1.2.3-rc.1',
    environment: 'staging',
    commit: 'abc123def4567890',
    build: '42.1',
  });
});

test('[URS-004] the page footer shows release and environment', async () => {
  const html = await (await fetch(`${baseUrl}/`)).text();
  assert.match(html, /Release 1\.2\.3-rc\.1/);
  assert.match(html, /Environment staging/);
});

test('[URS-002] the page shows OOS for a result outside the limits', async () => {
  const html = await (await fetch(`${baseUrl}/?value=106&lower=95&upper=105&decimals=1`)).text();
  assert.match(html, /Reported result <strong>106\.0<\/strong>/);
  assert.match(html, /data-testid="status">OOS</);
});

test('[URS-005] the result shows the specification limits it was evaluated against', async () => {
  const html = await (await fetch(`${baseUrl}/?value=100&lower=95&upper=105&decimals=1`)).text();
  assert.match(html, /data-testid="limits">\(limits 95\.0 to 105\.0\)</);
});

test('[URS-003] the page reports invalid input instead of a result', async () => {
  const html = await (await fetch(`${baseUrl}/?value=abc&lower=95&upper=105&decimals=1`)).text();
  assert.match(html, /Invalid input/);
  assert.doesNotMatch(html, /data-testid="status"/);
});

test('user input is HTML-escaped', async () => {
  const html = await (await fetch(`${baseUrl}/?value=%3Cscript%3E&lower=95&upper=105&decimals=1`)).text();
  assert.doesNotMatch(html, /<script>/);
});

test('/health responds ok', async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.deepEqual(await response.json(), { status: 'ok' });
});
