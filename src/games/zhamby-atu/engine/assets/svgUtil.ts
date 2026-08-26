/**
 * Browser-safe SVG-string → data URI encoder. Runs client-side inside the
 * Phaser game (no Node Buffer available), so we UTF-8 encode manually before
 * base64ing — btoa() alone chokes on the non-ASCII characters that show up
 * in our SVG comments/labels.
 */
export function svgToDataUri(svg: string): string {
  const bytes = new TextEncoder().encode(svg)
  let binary = ''
  bytes.forEach((b) => { binary += String.fromCharCode(b) })
  return `data:image/svg+xml;base64,${btoa(binary)}`
}
