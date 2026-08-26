/**
 * Browser-safe SVG-string → data URI encoder. Runs client-side inside the
 * Phaser game (no Node Buffer available), so we UTF-8 encode manually before
 * base64ing — btoa() alone chokes on the non-ASCII characters that show up
 * in our SVG comments/labels.
 *
 * Deliberately duplicated from zhamby-atu's engine/assets/svgUtil.ts rather
 * than imported — games stay isolated from each other per project rules
 * (arqan-tartys must not create a dependency edge onto zhamby-atu).
 */
export function svgToDataUri(svg: string): string {
  const bytes = new TextEncoder().encode(svg)
  let binary = ''
  bytes.forEach((b) => { binary += String.fromCharCode(b) })
  return `data:image/svg+xml;base64,${btoa(binary)}`
}
