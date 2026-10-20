'use strict';

// Rounds half away from zero. Number.EPSILON compensates for binary
// floating point artefacts, e.g. 1.005 is stored as 1.00499999...
function roundHalfUp(value, decimals) {
  const factor = 10 ** decimals;
  const rounded = Math.round((Math.abs(value) + Number.EPSILON) * factor) / factor;
  return Math.sign(value) * rounded;
}

// Evaluates a measured result against a specification. The result is rounded
// to the specification's number of decimals before it is compared with the
// limits, and the limits are inclusive.
function evaluateResult(value, spec) {
  if (!Number.isFinite(value)) {
    throw new TypeError('Result must be a finite number');
  }
  const { lower, upper, decimals = 0 } = spec ?? {};
  if (!Number.isFinite(lower) || !Number.isFinite(upper)) {
    throw new TypeError('Specification limits must be finite numbers');
  }
  if (lower > upper) {
    throw new RangeError('Lower limit must not exceed upper limit');
  }
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 6) {
    throw new RangeError('Decimals must be an integer between 0 and 6');
  }

  const reported = roundHalfUp(value, decimals);
  const status = reported < lower || reported > upper ? 'OOS' : 'PASS';
  return { reported, status };
}

module.exports = { evaluateResult, roundHalfUp };
