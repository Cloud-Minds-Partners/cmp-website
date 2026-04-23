// Canonical data for CMP proprietary platforms.
// Drives both /platforms (index) and /platforms/[slug] (detail pages).
// Edit values here; layouts read this file.

export type Platform = {
  slug: string;
  name: string;
  tagline: string;
  tag: string;                       // short category label
  summary: string;                   // 1-2 sentence pitch
  url: string | null;                // null → hide link/host
  showHost: boolean;                 // display hostname in card/header
  status: "live" | "beta" | "in-development";
  clients?: "open" | "engagement" | "client-private";
  highlights: string[];              // 3-5 feature bullets
  body: { heading: string; content: string }[];  // long-form paragraphs
  videoUrl?: string | null;          // MP4/YouTube embed URL
  carouselJson?: string | null;      // path to carousel data (remotion)
  screenshots?: string[];            // /public paths
};

export const platforms: Platform[] = [
  {
    slug: "site-selection-tool",
    name: "Site Selection Tool",
    tagline: "Multi-criteria site scoring across Latin America.",
    tag: "Site scoring",
    summary: "Evaluate candidate sites across 76+ cities in Brazil, Chile, and Mexico against land, power, water, connectivity, tax, and regulatory layers.",
    url: "https://dcplatformcmp.web.app",
    showHost: true,
    status: "live",
    clients: "engagement",
    highlights: [
      "76+ cities covered across BR, MX, CL, with AR/CO/PE/UY on roadmap",
      "Integrated energy grid data — substations, transmission lines, interconnection capacity",
      "Regulatory layer — zoning, fiscal incentives, environmental flags",
      "Generates Site Analysis PDF + Risk Matrix PDF per engagement",
      "Portfolio view for side-by-side comparison across sites",
    ],
    body: [
      {
        heading: "Why it exists",
        content: "There is no productized GIS tool for data center site selection in Latin America. Cushman & Wakefield's Athena covers US and EMEA with 170 layers; CBRE and JLL rely on internal tools. SST fills the regional gap with LatAm-specific data sources and regulatory context.",
      },
      {
        heading: "What's inside",
        content: "Energy: substation registry, HV transmission, interconnection queues. Environmental: water stress, seismic, flood. Regulatory: zoning, ZPE/fiscal zones, permitting friction index. Market: existing DC inventory, power tariffs, land benchmarks.",
      },
      {
        heading: "How clients use it",
        content: "Engagements typically start with a portfolio of 10-20 candidate sites. SST narrows to 3-5 in the first week, produces full Site Analysis + Risk Matrix per finalist, and feeds the financial model with validated infrastructure assumptions.",
      },
    ],
    videoUrl: null,
    carouselJson: null,
    screenshots: [],
  },
  {
    slug: "land-intel",
    name: "Land Intel",
    tagline: "Land price intelligence across 25 active LatAm markets.",
    tag: "Market pricing",
    summary: "Queryable database of hundreds of land listings with geolocation, size, price per square meter, and zoning context — normalized across regional conventions.",
    url: "https://land-price-dashboard.web.app",
    showHost: true,
    status: "live",
    clients: "engagement",
    highlights: [
      "251 listings across 25 cities (São Paulo, Rio, Campinas, Santiago, Querétaro, and more)",
      "Normalized price per m² + per hectare with currency conversion",
      "Zoning overlay — industrial, mixed-use, expansion areas",
      "Reverse-geocoded to handle LatAm regional address formats",
      "CSV export for underwriting",
    ],
    body: [
      {
        heading: "The problem",
        content: "Land market data in LatAm is fragmented — brokers publish in WhatsApp groups, municipal registries use inconsistent formats, and price-per-unit norms vary by city. Deal teams waste days normalizing before they can benchmark.",
      },
      {
        heading: "What it delivers",
        content: "A single dashboard with listings normalized to comparable units. Filter by market, size, zoning, and power proximity. Every listing carries source attribution and last-observed date.",
      },
    ],
    videoUrl: null,
    carouselJson: null,
    screenshots: [],
  },
  {
    slug: "testfit-pro",
    name: "TestFit Pro",
    tagline: "Data center test fit with reference presets.",
    tag: "Capacity modeling",
    summary: "Rapid capacity and layout studies — IT load to GFA calculations, density presets, PUE modeling, and deliverable PDFs.",
    url: "https://dc-testfit-pro.web.app",
    showHost: true,
    status: "live",
    clients: "engagement",
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
        content: "Early-stage feasibility where a sponsor wants to know 'how much IT load fits in this parcel under which density assumptions'. TestFit Pro produces a defensible answer in minutes, with assumptions documented.",
      },
    ],
    videoUrl: null,
    carouselJson: null,
    screenshots: [],
  },
  {
    slug: "dc-insights",
    name: "DC Insights",
    tagline: "Weekly LatAm data center newsletter.",
    tag: "Editorial",
    summary: "Curated coverage of regional announcements, deals, policy, and infrastructure. Primary-source discipline — no press-release reshuffling.",
    url: "https://dcinsights.web.app",
    showHost: true,
    status: "live",
    clients: "open",
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
    slug: "project-management-dashboard",
    name: "Project Management Dashboard",
    tagline: "Client project tracking — milestones, deliverables, status.",
    tag: "Project management",
    summary: "Timeline-based status visualization, reverse-synced checklists, land assessment integration. Deployed per-engagement; private to each client.",
    url: null,
    showHost: false,
    status: "live",
    clients: "client-private",
    highlights: [
      "Timeline with dependencies and critical path",
      "Reverse-synced checklists (report → checklist, not the other way around)",
      "Land assessment integration with SST + Land Intel",
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
  {
    slug: "financial-model",
    name: "Financial Model",
    tagline: "DC financial modeling and scenario analysis.",
    tag: "Financial modeling",
    summary: "Capex / opex, IRR, DSCR, sensitivity analysis for data center development projects.",
    url: null,
    showHost: false,
    status: "in-development",
    clients: "engagement",
    highlights: [
      "Capex stack — land, shell, MEP, IT, soft costs",
      "Opex — energy, staffing, maintenance, insurance",
      "Revenue scenarios — colo, hyperscale lease, hybrid",
      "Sensitivity across PUE, tariff, occupancy",
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
];

export const findPlatform = (slug: string): Platform | undefined =>
  platforms.find((p) => p.slug === slug);
