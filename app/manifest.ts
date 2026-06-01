import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'entity resoLOUtion',
    short_name: 'resoLOUtion',
    description: 'I take messy problems and ship one clear answer.',
    start_url: '/',
    display: 'standalone',
    background_color: '#14171C',
    theme_color: '#14171C',
    orientation: 'portrait',
  };
}
