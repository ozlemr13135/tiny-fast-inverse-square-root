# tiny-fast-inverse-square-root

Computes an approximate reciprocal square root (1/sqrt(x)) of a 32-bit float using the Quake III bit-hack with one Newton iteration.

## Usage

```js
import { fastInverseSqrt } from 'tiny-fast-inverse-square-root';

const y = fastInverseSqrt(4);
console.log(y); // ~0.5
```

## Why this library exists

The fast inverse square root is a classic bit-twiddling trick that trades accuracy for speed. Modern CPUs have hardware instructions for reciprocal square root (e.g., SSE's `rsqrtss`), but the bit-hack remains a useful teaching tool and a fallback for platforms without such instructions. This library provides a minimal, dependency-free implementation that operates on 32-bit floats, matching the original algorithm's behaviour as closely as possible.

The trade-off is accuracy: the result has a relative error of about 0.2% after one Newton iteration. If you need higher precision, use `1 / Math.sqrt(x)` instead.

## Edge cases

The function throws a `RangeError` for non-positive, non-finite, or non-number inputs. This is deliberate: the algorithm is undefined for zero, negative numbers, NaN, and Infinity. If you need to handle those, check before calling.

## API

### `fastInverseSqrt(x: number): number`

Returns an approximation of `1 / Math.sqrt(x)` for a positive finite number `x`.

### `fastInverseSqrtDouble(x: number): number`

An alias for `fastInverseSqrt`, provided for API symmetry. It currently returns the same result.
