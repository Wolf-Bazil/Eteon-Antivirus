Eteon presents an AI Integrated Antivirus software (In development) to detect malicious emails and texts through notifications, and is able to scan any file that is downloaded and quarrantines verified malicious files instantly without explicit permissions of the user.

Features
Real-Time Notification Interception View: Dedicated monitoring dashboard showing the interception and real-time parsing of incoming application notifications to block malicious links and social engineering payloads before user interaction.

SMS & Text Vector Parsing Matrix: A specialized inspection view illustrating how incoming text payloads are tokenized and scanned for phishing anchors using low-latency language transformers.

Dynamic Download Stream Scanner: An active file-system telemetry viewport that tracks newly written files and displays background scanner heuristic activity.

Zero-Permission Quarantine Log: An automated administrative tracking ledger that details verified malicious files sandboxed and locked instantly by the engine without requiring explicit user intervention or permission prompts.

Technical Documentation Routing: Dedicated sub-pages for isolated, markdown-style engineering documentation and system compliance breakdowns.

Adaptive Navigation: High-contrast sticky header optimized for continuous system monitoring.

Responsive Fluid Grid: Clean layout system built to adapt perfectly to standard workstation monitors, tablets, and mobile response terminals.

Tech Stack
Core Framework: React 19 + TypeScript + Vite 7

Styling Engine: Tailwind CSS 3.4

Routing Engine: React Router DOM 7 (Single Page Application architecture)

Typography: System Serif & Sans-Serif font stacks (Inter, System Mono)

Quick Start
1. Clone & Install
Bash
git clone <repository-url>
cd 01-cyber-rain-frontend
npm install
2. Asset Preparation
Populate core module diagrams in public/images/capability-*.jpg (Minimum: 400x300px)

Populate research asset cards in public/images/research-*.jpg (Aspect ratio: 1:1, Minimum: 400x400px)

Place the system architecture video in public/videos/cinematic-vision.mp4

3. Development & Production
Bash
# Run local development server
npm run dev

# Compile production-ready build
npm run build
Configuration
All content layers, structural link routing, and copy modules are driven via configurations defined in src/config.ts.

TypeScript
import { 
  SiteConfig, 
  NavigationConfig, 
  HeroConfig, 
  CapabilitiesConfig, 
  CapabilityDetailConfig, 
  ArchitectureConfig, 
  ResearchConfig, 
  FooterConfig 
} from './types';

// Global Platform Meta Settings
export const siteConfig: SiteConfig = {
  language: "en",
  brandName: "Aegis AI", 
};

// Global Navigation
export const navigationConfig: NavigationConfig = {
  links: [
    { label: "Capabilities", href: "#capabilities" },
    { label: "Architecture", href: "#architecture" },
    { label: "Threat Research", href: "#research" }
  ],
  ctaText: "Initialize Scanner",
};

// Hero Component Content
export const heroConfig: HeroConfig = {
  title: "Automated Threat Isolation",
  subtitleLine1: "Zero-permission scanning engine engineered for immediate quarantine protocols.",
  subtitleLine2: "Intercepting malicious payloads within notifications, SMS, and file streams in real time.",
  ctaText: "Deploy Engine",
};

// Security Capabilities Layout
export const capabilitiesConfig: CapabilitiesConfig = {
  sectionLabel: "Engine Capabilities",
  items: [
    { 
      title: "Notification Interception", 
      slug: "notification-interception", 
      description: "Real-time parsing of incoming notification objects and SMS payloads using NLP transformers.", 
      image: "/images/capability-1.jpg" 
    },
    { 
      title: "Zero-Permission Quarantine", 
      slug: "autonomous-quarantine", 
      description: "Automated sandboxing and locking of verified malicious binaries without requiring user intervention.", 
      image: "/images/capability-2.jpg" 
    }
  ],
};

// Deep Dive Sub-page Configuration
export const capabilityDetailConfig: CapabilityDetailConfig = {
  sectionLabel: "Technical Documentation",
  backLinkText: "← Return to Console",
  prevLabel: "Previous Module",
  nextLabel: "Next Module",
  notFoundText: "Specified security module documentation could not be found.",
  capabilities: {
    "notification-interception": {
      title: "Notification Stream Analysis",
      subtitle: "Parsing unstructured text vectors at the OS level.",
      paragraphs: [
        "The AI Engine hooks directly into system notification dispatches, converting raw text strings into tokenized representations to verify origin integrity before the user interacts with the alert.",
        "When malicious anchors or phishing payloads are derived, the system immediately drops the notification thread, preventing social engineering attacks instantly."
      ]
    }
  },
};

// Architecture Section
export const architectureConfig: ArchitectureConfig = {
  sectionLabel: "System Architecture",
  videoPath: "/videos/cinematic-vision.mp4",
  title: "Low-Latency Kernel-Level Inspection Framework",
  description: "Technical lifecycle display tracking an incoming packet through heuristic and deterministic analysis loops.",
};

// Research & Threat Intelligence Grid
export const researchConfig: ResearchConfig = {
  sectionLabel: "Threat Intelligence & Research",
  projects: [
    { title: "Heuristic Zero-Day Vector Models", year: "2026", discipline: "Machine Learning", image: "/images/research-1.jpg" },
    { title: "Automated Sandbox Isolation Bounds", year: "2026", discipline: "Kernel Security", image: "/images/research-2.jpg" },
  ],
};

// Footer Interface Structure
export const footerConfig: FooterConfig = {
  heading: "Secure the Next Edge.",
  columns: [
    {
      title: "Platform",
      links: [{ label: "Core Engine", href: "#" }, { label: "Enterprise SDK", href: "#" }]
    }
  ],
  copyright: "© 2026 Aegis AI Systems Inc. All rights reserved.",
  bottomLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Security Disclosures", href: "/disclosures" }
  ],
};
Layout Structure
The layout features standard high-contrast accessibility presets, using clean black text on a clear white/light-gray canvas background, or high-contrast utility dark modes where appropriate. Font treatments rely on standard clean text structures for immediate parsing by enterprise operators.

Project Directory Tree
01-cyber-rain-frontend/
├── index.html                  # Main SPA entry point
├── package.json                # Runtime dependencies & compilation scripts
├── vite.config.ts              # Production build optimizations & bundling parameters
├── tailwind.config.js          # Layout breakpoints, core colors, and functional presets
├── tsconfig.json               # Strict compiler type declarations
├── public/
│   ├── images/                 # Module diagrams & threat research graphics
│   └── videos/                 # Video format system architecture files
└── src/
    ├── config.ts               # Content data layer config
    ├── main.tsx                # Client bootstrapper injected with BrowserRouter 
    ├── App.tsx                 # Core App routing parameters
    ├── index.css               # Base Tailwind configurations and layout utility styles
    ├── components/
    │   ├── StandardButton.tsx  # Standard functional UI action component
    │   └── ui/                 # Atomic UI primitives
    └── sections/
        ├── Navigation.tsx      # Fixed system utility navigation bar
        ├── Hero.tsx            # Console introduction header
        ├── Capabilities.tsx    # Core platform module list layout
        ├── Architecture.tsx    # System video walk-through element
        ├── ResearchGrid.tsx    # Data-driven threat research table/grid
        ├── CapabilityDetail.tsx # Document layout views for dynamic routes
        └── Footer.tsx          # Compliance links and institutional copyrights
Deployment Parameters
The application builds out to static web primitives inside /dist. When hosting on standard static architectures (Vercel, Cloudflare Pages, Netlify, AWS S3), ensure rewrite rules redirect all incoming routing requests back to /index.html to enable the BrowserRouter instance to properly process client-side routes without generating server 404 errors.
