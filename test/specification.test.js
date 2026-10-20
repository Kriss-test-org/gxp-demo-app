'use strict';

// Test names start with the requirement they verify (see docs/requirements.md),
// so test results can be traced back to requirements.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { evaluateResult, roundHalfUp } = require('../src/specification');

const SPEC = { lower: 95.0, upper: 105.0, decimals: 1 };

test('[URS-001] result inside the limits is PASS', () => {
  assert.deepEqual(evaluateResult(100.0, SPEC), { reported: 100.0, status: 'PASS' });
});

test('[URS-001] limits are inclusive', () => {
  assert.equal(evaluateResult(95.0, SPEC).status, 'PASS');
  assert.equal(evaluateResult(105.0, SPEC).status, 'PASS');
});

test('[URS-001] result is rounded before it is compared with the limits', () => {
  assert.deepEqual(evaluateResult(105.04, SPEC), { reported: 105.0, status: 'PASS' });
  assert.deepEqual(evaluateResult(94.95, SPEC), { reported: 95.0, status: 'PASS' });
});

test('[URS-002] result outside the limits is OOS', () => {
  assert.deepEqual(evaluateResult(105.05, SPEC), { reported: 105.1, status: 'OOS' });
  assert.deepEqual(evaluateResult(94.94, SPEC), { reported: 94.9, status: 'OOS' });
});

test('[URS-003] non-numeric results are rejected', () => {
  assert.throws(() => evaluateResult(Number.NaN, SPEC), TypeError);
  assert.throws(() => evaluateResult(Infinity, SPEC), TypeError);
});

test('[URS-003] invalid specifications are rejected', () => {
  assert.throws(() => evaluateResult(100, { lower: 105, upper: 95, decimals: 1 }), RangeError);
  assert.throws(() => evaluateResult(100, { lower: 95, upper: 105, decimals: 1.5 }), RangeError);
  assert.throws(() => evaluateResult(100, { lower: 95 }), TypeError);
});

test('rounding is half away from zero and robust to floating point artefacts', () => {
  assert.equal(roundHalfUp(1.005, 2), 1.01);
  assert.equal(roundHalfUp(2.5, 0), 3);
  assert.equal(roundHalfUp(-2.5, 0), -3);
});
