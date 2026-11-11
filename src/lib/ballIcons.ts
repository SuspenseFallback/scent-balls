// The character icons, cleaned up by scripts/ball-icons.mjs (npm run balls:icons).
import manifest from '../assets/balls/web/manifest.json';

const files = import.meta.glob<string>('../assets/balls/web/*.svg', { eager: true, import: 'default' });
// All icons share one canvas size, so balls match in size wherever they appear.
const sizes: Record<string, { width: number; height: number; loop: number }> = manifest;

export function ballIcon(id: string) {
  const size = sizes[id];
  const src = files[`../assets/balls/web/${id}.svg`];
  return size && src ? { ...size, src } : undefined;
}
