// Every image dropped into src/assets/photos is picked up here at build time.
// Reference it from content files by filename only, e.g. photo: 'sleep.jpg'.
const files = import.meta.glob<string>('../assets/photos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});

const byName: Record<string, string> = {};
for (const [path, url] of Object.entries(files)) byName[path.split('/').pop() as string] = url;

export function photoUrl(name: string | undefined): string | undefined {
  if (!name) return undefined;
  const url = byName[name];
  if (!url && import.meta.env.DEV) console.warn(`[photos] "${name}" not found in src/assets/photos`);
  return url;
}

/** Path to a file in /public that respects VITE_BASE. */
export const publicUrl = (file: string) => `${import.meta.env.BASE_URL}${file.replace(/^\/+/, '')}`;
