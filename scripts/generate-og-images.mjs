/**
 * generate-og-images.mjs
 * Generates 8 branded OG images (1200x630) using sharp + SVG rendering.
 * Brand: navy #050E1D bg, blue accent #4A8FE7, white text (Space Grotesk via system font fallback).
 * Run: node scripts/generate-og-images.mjs
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'og');
mkdirSync(outDir, { recursive: true });

const W = 1200;
const H = 630;
const NAVY = '#050E1D';
const BLUE = '#4A8FE7';
const CREAM = '#FAFBFD';
const CREAM_DIM = '#A8B4C4';

const pages = [
  { slug: 'default',      label: 'Cloud Minds Partners', sub: 'DC Intelligence for Latin America' },
  { slug: 'home',         label: 'Cloud Minds Partners', sub: 'Data Center Intelligence for LatAm' },
  { slug: 'advisory',     label: 'Advisory',              sub: 'Site selection, diligence & financial modeling' },
  { slug: 'development',  label: 'Development',           sub: 'DC development management in LatAm' },
  { slug: 'intelligence', label: 'Intelligence',          sub: 'Grid & regulatory intelligence platforms' },
  { slug: 'platforms',    label: 'Platforms',             sub: 'Tools powering DC decisions in LatAm' },
  { slug: 'team',         label: 'Team',                  sub: 'The Cloud Minds Partners team' },
  { slug: 'contact',      label: 'Contact',               sub: 'Get in touch with Cloud Minds Partners' },
];

function buildSvg(label, sub) {
  // Escape XML entities
  const esc = (s) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const escapedLabel = esc(label);
  const escapedSub = esc(sub);

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${NAVY}"/>
      <stop offset="100%" stop-color="#071628"/>
    </linearGradient>
    <!-- Grid lines pattern -->
    <pattern id="grid" width="88" height="88" patternUnits="userSpaceOnUse">
      <path d="M 88 0 L 0 0 0 88" fill="none" stroke="rgba(74,143,231,0.06)" stroke-width="1"/>
    </pattern>
    <!-- Accent glow -->
    <radialGradient id="glow" cx="0%" cy="80%" r="60%">
      <stop offset="0%" stop-color="rgba(74,143,231,0.35)"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <!-- Grid texture -->
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <!-- Left glow -->
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- Blue accent bar — left edge -->
  <rect x="64" y="64" width="3" height="${H - 128}" fill="${BLUE}" opacity="0.7" rx="2"/>

  <!-- Blue accent bottom strip -->
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="${BLUE}" opacity="0.8"/>

  <!-- Logo / brand mark top-right -->
  <text x="${W - 64}" y="100"
    font-family="system-ui, -apple-system, sans-serif"
    font-size="13" font-weight="600" letter-spacing="0.06em"
    fill="${CREAM_DIM}" text-anchor="end" opacity="0.6">
    CLOUD MINDS PARTNERS
  </text>

  <!-- Main heading -->
  <text x="100" y="${H / 2 - 30}"
    font-family="system-ui, -apple-system, sans-serif"
    font-size="64" font-weight="700" letter-spacing="-0.02em"
    fill="${CREAM}">${escapedLabel}</text>

  <!-- Subheading -->
  <text x="100" y="${H / 2 + 30}"
    font-family="system-ui, -apple-system, sans-serif"
    font-size="26" font-weight="400" letter-spacing="-0.01em"
    fill="${CREAM_DIM}">${escapedSub}</text>

  <!-- Blue dot accent -->
  <circle cx="100" cy="${H - 72}" r="5" fill="${BLUE}" opacity="0.8"/>
  <text x="118" y="${H - 66}"
    font-family="system-ui, -apple-system, sans-serif"
    font-size="14" font-weight="500" letter-spacing="0.02em"
    fill="${BLUE}">dcplatformcmp.web.app</text>
</svg>`;
}

let generated = 0;
for (const { slug, label, sub } of pages) {
  const svg = buildSvg(label, sub);
  const outPath = path.join(outDir, `${slug}.png`);
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  generated++;
  console.log(`✓ public/og/${slug}.png`);
}

console.log(`\nGenerated ${generated} OG images in public/og/`);
