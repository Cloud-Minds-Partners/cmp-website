// Canonical data for CMP proprietary platforms.
// Drives both /platforms (index) and /platforms/[slug] (detail pages).
// Edit values here; layouts read this file.

export type Platform = {
  slug: string;
  name: string;
  tagline: string;
  subtagline?: string;               // optional secondary tagline (positioning line)
  tag: string;                       // short category label
  summary: string;                   // 1-2 sentence pitch
  url: string | null;                // null → hide link/host
  showHost: boolean;                 // display hostname in card/header
  status: "live" | "beta" | "in-development";
  public: boolean;                   // false → hide from public Platforms page (internal/client-private)
  clients?: "open" | "engagement" | "client-private";
  cardImage: string;                 // path under /public/photos/
  ctaLabel?: string;                 // override default CTA label (e.g., "See demo →")
  ctaHref?: string;                  // override default CTA href
  highlights: string[];              // 3-5 feature bullets
  body: { heading: string; content: string }[];  // long-form paragraphs
  videoUrl?: string | null;          // MP4/YouTube embed URL
  carouselJson?: string | null;      // path to carousel data (remotion)
  screenshots?: string[];            // /public paths
};

export const platforms: Platform[] = [
  {
    slug: "site-screening-tool",
    name: "Site Screening Tool",
    tagline: "Multi-criteria site screening across Latin America.",
    tag: "Site screening",
    summary: "Score candidate sites across 76+ cities in Brazil, Chile, and Mexico against land, power, water, connectivity, tax, regulatory, and live land-market layers.",
    url: "https://dcplatformcmp.web.app",
    showHost: true,
    status: "live",
    public: true,
    clients: "engagement",
    cardImage: "/photos/card-platform-site-selection.jpg",
    ctaLabel: "See demo →",
    ctaHref: "/contact",
    highlights: [
      "76+ cities covered across BR, MX, CL, with AR/CO/PE/UY on roadmap",
      "Integrated energy grid data — substations, transmission lines, interconnection capacity",
      "Regulatory layer — zoning, fiscal incentives, environmental flags",
      "Live land-market layer — 251 listings across 25 active LatAm cities, normalized to price/m²",
      "Generates Site Analysis PDF + Risk Matrix PDF per engagement",
      "Portfolio view for side-by-side comparison across sites",
    ],
    body: [
      {
        heading: "Why it exists",
        content: "There is no productized GIS tool for data center site selection in Latin America. Cushman & Wakefield's Athena covers US and EMEA with 170 layers; CBRE and JLL rely on internal tools. Site Screening Tool fills the regional gap with LatAm-specific data sources, regulatory context, and live land-market signals.",
      },
      {
        heading: "What's inside",
        content: "Energy: substation registry, HV transmission, interconnection queues. Environmental: water stress, seismic, flood. Regulatory: zoning, ZPE/fiscal zones, permitting friction index. Market: existing DC inventory, power tariffs, and an integrated land-pricing layer covering 251 listings across 25 LatAm cities (normalized to price/m² with currency conversion).",
      },
      {
        heading: "How clients use it",
        content: "Engagements typically start with a portfolio of 10–20 candidate sites. Site Screening Tool narrows to 3–5 in the first week, produces full Site Analysis + Risk Matrix per finalist, and feeds the financial model with validated infrastructure assumptions and land-cost benchmarks.",
      },
    ],
    videoUrl: null,
    carouselJson: null,
    screenshots: [],
  },
  {
    slug: "grid-intelligence",
    name: "Grid Intelligence",
    tagline: "Brazil live. Mexico and Chile coming soon.",
    subtagline: "ONS, EPE, and substation-level grid access intelligence.",
    tag: "Grid access",
    summary: "Canonical base of 508 ONS studies, PARPEL 2027–2031 modeled by substation, plus custom grid-access deliverables — headroom, N-1 contingency, and neighborhood pareceres.",
    url: null,
    showHost: false,
    status: "live",
    public: true,
    clients: "engagement",
    cardImage: "/photos/card-platform-grid-intel.jpg",
    ctaLabel: "See demo →",
    ctaHref: "/contact",
    highlights: [
      "Canonical base: 508 ONS studies + 104 CUST/CCT contracts indexed",
      "PARPEL 2027–2031 modeled by substation — N-1 contingency in 24h",
      "27 Pareceres ONS scraped, structured, neighborhood-cross-referenced",
      "Custom deliverable PDFs per site (headroom CN + N-1, chronological ramp, pareceres in vicinity)",
      "Updates continuously as ONS publishes new PARPEL cycles",
    ],
    body: [
      {
        heading: "Hybrid model",
        content: "Grid Intelligence is two things. Underneath, a canonical base maintained by CMP — 508 ONS studies, PARPEL 2027–2031 by substation, 104 CUST/CCT contracts, 27 Pareceres. On top, custom deliverables per engagement: site-specific headroom analyses, N-1 stress, chronological ramp 2028–2031, neighborhood parecer triangulation.",
      },
      {
        heading: "Why it matters",
        content: "Grid access is the binding constraint for Brazilian DC development through 2031. Hyperscalers and colocation operators need answers in days, not the months it takes to navigate ONS portals manually. Grid Intelligence compresses that to 24–72 hours.",
      },
    ],
    videoUrl: null,
    carouselJson: null,
    screenshots: [],
  },
  {
    slug: "dc-insights",
    name: "DC Insights",
    tagline: "Daily LatAm DC newsletter. Primary-source, audited, free.",
    tag: "Editorial",
    summary: "Curated coverage of regional announcements, deals, policy, and infrastructure. Primary-source discipline — no press-release reshuffling.",
    url: "https://dcinsights.web.app",
    showHost: true,
    status: "live",
    public: true,
    clients: "open",
    cardImage: "/photos/memo-intelligence-grid.jpg",
    ctaLabel: "Subscribe for free →",
    ctaHref: "https://dcinsights.web.app",
    highlights: [
      "Daily weekday dispatches + weekly Sunday roll-up",
      "Curated from primary sources (gov bulletins, official filings)",
      "LatAm-first — covers what English trade press misses",
      "Free subscription",
    ],
    body: [
      {
        heading: "Editorial line",
        content: "No hot takes. No generic analyst quotes. Each item ties to a primary source. If we can't name the source, we don't publish.",
      },
    ],
    videoUrl: null,
    carouselJson: null,
    screenshots: [],
  },
  {
    slug: "testfit-pro",
    name: "DC Test Fit Pro",
    tagline: "Data Center Automation Tool for Preliminary Design.",
    subtagline: "Capacity modeling, density presets, and deliverable PDFs.",
    tag: "Capacity modeling",
    summary: "Rapid capacity and layout studies — IT load to GFA calculations, density presets, PUE modeling, and deliverable PDFs.",
    url: "https://dc-testfit-pro.web.app",
    showHost: false,
    status: "in-development",
    public: true,
    clients: "engagement",
    cardImage: "/photos/card-platform-testfit-pro.jpg",
    highlights: [
      "30+ reference presets spanning N+1, 2N, and hybrid topologies",
      "Load-to-GFA with site-specific constraints",
      "PUE and WUE scenario modeling",
      "Deliverable PDFs for sponsor / developer review",
      "Fingerprinted against actual deployments from reference operators",
    ],
    body: [
      {
        heading: "Use case",
        content: "Early-stage feasibility where a sponsor wants to know 'how much IT load fits in this parcel under which density assumptions'. DC Test Fit Pro produces a defensible answer in minutes, with assumptions documented.",
      },
      {
        heading: "Status",
        content: "Currently used internally on engagements while the client-facing UI reaches parity with the internal tool. Reach out if you'd like to evaluate it for a specific project.",
      },
    ],
    videoUrl: null,
    carouselJson: null,
    screenshots: [],
  },
  {
    slug: "dc-financial-model",
    name: "DC Financial Model",
    tagline: "DC financial modeling and scenario analysis.",
    tag: "Financial modeling",
    summary: "Capex/opex, IRR, DSCR, sensitivity analysis for data center development — calibrated by country (BR · CL · MX).",
    url: null,
    showHost: false,
    status: "in-development",
    public: true,
    clients: "engagement",
    cardImage: "/photos/card-platform-dc-financial.jpg",
    highlights: [
      "Capex stack — land, shell, MEP, IT, soft costs",
      "Opex — energy, staffing, maintenance, insurance",
      "Revenue scenarios — colo, hyperscale lease, hybrid",
      "Sensitivity across PUE, tariff, occupancy, and FX",
    ],
    body: [
      {
        heading: "Status",
        content: "In development. Currently used internally on engagements while the client UI reaches parity with the internal tool.",
      },
    ],
    videoUrl: null,
    carouselJson: null,
    screenshots: [],
  },
  {
    slug: "project-management-dashboard",
    name: "Project Management Dashboard",
    tagline: "Client project tracking — milestones, deliverables, status.",
    tag: "Project management",
    summary: "Timeline-based status visualization, reverse-synced checklists, land assessment integration. Deployed per-engagement; private to each client.",
    url: null,
    showHost: false,
    status: "live",
    public: false,
    clients: "client-private",
    cardImage: "/photos/card-adv-market-intel.jpg",
    highlights: [
      "Timeline with dependencies and critical path",
      "Reverse-synced checklists (report → checklist, not the other way around)",
      "Land assessment integration with Site Screening Tool",
      "Deployed as a dedicated instance per client",
    ],
    body: [
      {
        heading: "Availability",
        content: "This dashboard is deployed privately per engagement. Access is granted to client stakeholders and the CMP team. Reach out to scope a rollout.",
      },
    ],
    videoUrl: null,
    carouselJson: null,
    screenshots: [],
  },
];

export const findPlatform = (slug: string): Platform | undefined =>
  platforms.find((p) => p.slug === slug);

export const livePlatforms = (): Platform[] =>
  platforms.filter((p) => p.public !== false && p.status === "live");

export const inDevelopmentPlatforms = (): Platform[] =>
  platforms.filter((p) => p.public !== false && p.status === "in-development");
