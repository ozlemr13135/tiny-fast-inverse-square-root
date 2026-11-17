/**
 * Computes an approximate reciprocal square root (1/sqrt(x)) of a 32-bit float
 * using the fast inverse square root algorithm from Quake III Arena.
 *
 * The algorithm uses a bit-level hack on the IEEE 754 representation to
 * generate an initial guess, followed by one iteration of Newton's method.
 * This trades accuracy for speed: the result is within roughly 0.2% relative
 * error, which is sufficient for many graphics and game physics applications
 * but not for numerical analysis requiring high precision.
 *
 * The input is treated as a 32-bit float. For JavaScript numbers, the value
 * is converted to a 32-bit float before the bit manipulation. The function
 * returns a regular JavaScript number (double precision), but the computation
 * is performed in 32-bit float arithmetic to match the original algorithm.
 *
 * @param {number} x - A positive finite number. Must be > 0.
 * @returns {number} An approximation of 1/sqrt(x).
 * @throws {RangeError} If x is not a positive finite number.
 */
export function fastInverseSqrt(x) {
  if (typeof x !== 'number' || !Number.isFinite(x) || x <= 0) {
    throw new RangeError('fastInverseSqrt requires a positive finite number');
  }

  // Convert to 32-bit float representation. We use a Float32Array to get the
  // exact IEEE 754 single-precision bits. This is important because the
  // original algorithm operates on 32-bit floats, and using double precision
  // would give different (and incorrect) results.
  const f32 = new Float32Array(1);
  const u32 = new Uint32Array(f32.buffer);
  f32[0] = x;
  const i = u32[0];

  // The magic constant from Quake III Arena.
  const magic = 0x5f3759df;

  // Initial guess: subtract half the bits from the magic constant.
  // This exploits the structure of the IEEE 754 float format to approximate
  // the log base 2 of x, then negates and halves it to approximate -0.5*log2(x),
  // which corresponds to 1/sqrt(x).
  let yBits = magic - (i >> 1);
  u32[0] = yBits;
  let y = f32[0];

  // One iteration of Newton's method: y = y * (1.5 - 0.5 * x * y * y)
  // This refines the approximation. The original Quake III code uses a
  // second iteration for more accuracy, but we stop at one iteration to keep
  // the function fast and because the brief specifies one iteration.
  // We perform the arithmetic in double precision to avoid losing bits, but
  // the result is still based on the 32-bit initial guess.
  const xd = x; // x is already a double, but we keep it for clarity.
  y = y * (1.5 - 0.5 * xd * y * y);

  return y;
}

/**
 * A variant of fastInverseSqrt that returns a double-precision approximation.
 *
 * This function is provided for completeness. It uses the same algorithm but
 * returns the result as a regular JavaScript number without any additional
 * rounding. It is functionally identical to fastInverseSqrt because that
 * function already returns a double, but it avoids the Float32Array conversion
 * overhead? Actually, no: the conversion is necessary for the bit hack.
 * This function is kept for API symmetry and to allow future optimizations
 * if a double-precision bit hack is desired. It currently delegates to
 * fastInverseSqrt.
 *
 * @param {number} x - A positive finite number. Must be > 0.
 * @returns {number} An approximation of 1/sqrt(x).
 * @throws {RangeError} If x is not a positive finite number.
 */
export function fastInverseSqrtDouble(x) {
  return fastInverseSqrt(x);
}
