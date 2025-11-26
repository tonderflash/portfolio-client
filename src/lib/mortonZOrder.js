/**
 * Morton Z-Order (Space-Filling Curve) Implementation
 * Converts 2D coordinates to 1D Morton code for spatial indexing
 */

/**
 * Interleave bits of x and y coordinates
 * Example: x=5 (101), y=3 (011) -> 100111
 */
function interleaveBits(x, y) {
  let z = 0;
  for (let i = 0; i < 16; i++) {
    z |= ((x & (1 << i)) << i) | ((y & (1 << i)) << (i + 1));
  }
  return z;
}

/**
 * Convert 2D coordinates to Morton code
 */
export function coordsToMorton(x, y) {
  return interleaveBits(x, y);
}

/**
 * Deinterleave bits to get x coordinate
 */
function deinterleaveX(z) {
  let x = 0;
  for (let i = 0; i < 16; i++) {
    x |= (z & (1 << (2 * i))) >> i;
  }
  return x;
}

/**
 * Deinterleave bits to get y coordinate
 */
function deinterleaveY(z) {
  let y = 0;
  for (let i = 0; i < 16; i++) {
    y |= (z & (1 << (2 * i + 1))) >> (i + 1);
  }
  return y;
}

/**
 * Convert Morton code back to 2D coordinates
 */
export function mortonToCoords(z) {
  return {
    x: deinterleaveX(z),
    y: deinterleaveY(z)
  };
}

/**
 * Generate Z-order traversal for a matrix
 */
export function generateZOrderTraversal(width, height) {
  const points = [];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const morton = coordsToMorton(x, y);
      points.push({ x, y, morton });
    }
  }
  
  // Sort by Morton code to get Z-order
  points.sort((a, b) => a.morton - b.morton);
  
  return points;
}

/**
 * Query points within a rectangular range using Morton codes
 */
export function rangeQuery(points, x1, y1, x2, y2) {
  // Simple implementation: filter points within bounds
  // In production, this would use Morton code properties for optimization
  return points.filter(p => 
    p.x >= x1 && p.x <= x2 && p.y >= y1 && p.y <= y2
  );
}

/**
 * Visualize Morton code as binary string
 */
export function mortonToBinary(morton, bits = 16) {
  return morton.toString(2).padStart(bits, '0');
}
