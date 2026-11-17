import test from 'node:test';
import assert from 'node:assert/strict';
import { fastInverseSqrt, fastInverseSqrtDouble } from '../src/index.js';

// Helper to compare floats with a relative tolerance.
function assertClose(actual, expected, relTol = 1e-3, msg = '') {
  const diff = Math.abs(actual - expected);
  const tol = Math.abs(expected) * relTol;
  assert.ok(
    diff <= tol,
    `${msg} expected ${expected} but got ${actual} (diff ${diff}, tol ${tol})`
  );
}

test('fastInverseSqrt returns approximately 1 for x = 1', () => {
  const result = fastInverseSqrt(1);
  assertClose(result, 1, 2e-3, 'x=1');
});

test('fastInverseSqrt returns approximately 0.5 for x = 4', () => {
  const result = fastInverseSqrt(4);
  assertClose(result, 0.5, 2e-3, 'x=4');
});

test('fastInverseSqrt returns approximately 0.1 for x = 100', () => {
  const result = fastInverseSqrt(100);
  assertClose(result, 0.1, 2e-3, 'x=100');
});

test('fastInverseSqrt handles very small positive numbers', () => {
  const x = 1e-30;
  const result = fastInverseSqrt(x);
  const expected = 1 / Math.sqrt(x);
  // For very small numbers, the relative error might be larger due to
  // denormalization in the 32-bit float conversion. We use a looser tolerance.
  assertClose(result, expected, 1e-2, 'x=1e-30');
});

test('fastInverseSqrt handles very large positive numbers', () => {
  const x = 1e30;
  const result = fastInverseSqrt(x);
  const expected = 1 / Math.sqrt(x);
  assertClose(result, expected, 1e-2, 'x=1e30');
});

test('fastInverseSqrt throws RangeError for zero', () => {
  assert.throws(() => fastInverseSqrt(0), RangeError);
});

test('fastInverseSqrt throws RangeError for negative numbers', () => {
  assert.throws(() => fastInverseSqrt(-1), RangeError);
});

test('fastInverseSqrt throws RangeError for NaN', () => {
  assert.throws(() => fastInverseSqrt(NaN), RangeError);
});

test('fastInverseSqrt throws RangeError for Infinity', () => {
  assert.throws(() => fastInverseSqrt(Infinity), RangeError);
});

test('fastInverseSqrt throws RangeError for non-number input', () => {
  // @ts-ignore
  assert.throws(() => fastInverseSqrt('1'), RangeError);
  // @ts-ignore
  assert.throws(() => fastInverseSqrt(null), RangeError);
  // @ts-ignore
  assert.throws(() => fastInverseSqrt(undefined), RangeError);
});

test('fastInverseSqrtDouble delegates to fastInverseSqrt', () => {
  const x = 2;
  const a = fastInverseSqrt(x);
  const b = fastInverseSqrtDouble(x);
  assert.strictEqual(a, b);
});

test('fastInverseSqrtDouble throws for invalid input', () => {
  assert.throws(() => fastInverseSqrtDouble(0), RangeError);
  assert.throws(() => fastInverseSqrtDouble(-5), RangeError);
});
