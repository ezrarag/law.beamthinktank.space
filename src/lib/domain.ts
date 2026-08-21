export type LegalPracticeArea =
  | "transportation-regulatory"
  | "municipal-zoning-clt"
  | "ip-academic-licensing"
  | "contract-client-services"
  | "nonprofit-governance";

export type RoleTier =
  | "pre-law"
  | "paralegal"
  | "law-student"
  | "licensed-attorney"
  | "faculty-liaison";

export type CredentialLevel = 1 | 2 | 3 | 4 | 5;

export interface PortfolioItem {
  matterId: string;
  originatingNgo: string;
  title: string;
  memoExcerpt: string;
  completedAt: string;
  supervisorApproved: boolean;
}

export interface LegalParticipantProfile {
  uid: string;
  fullName: string;
  email: string;
  sourceDomain: "law.beamthinktank.space";
  roleTier: RoleTier;
  institutionAffiliation?: string;
  barNumber?: string;
  licensedStates?: string[];
  practiceAreas: LegalPracticeArea[];
  credentialLevel: CredentialLevel;
  activeMatterIds: string[];
  reviewsCompletedCount: number;
  portfolio: PortfolioItem[];
  updatedAt: unknown;
}

export interface LegalMatter {
  id: string;
  title: string;
  originatingNgo:
    | "transportation.beamthinktank.space"
    | "grounds.beamthinktank.space"
    | "forge.beamthinktank.space"
    | "orchestra.beamthinktank.space"
    | "clients.readyaimgo.biz";
  practiceArea: LegalPracticeArea;
  status: "intake" | "assigned" | "memo-drafting" | "redline-review" | "attorney-approved" | "archived";
  urgency: "low" | "medium" | "high" | "critical";
  assignedParticipantUids: string[];
  supervisingAttorneyUid?: string;
  description: string;
  clientName?: string;
  clientEmail?: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface LegalMemo {
  id: string;
  matterId: string;
  authorUid: string;
  authorName: string;
  roleTier: RoleTier;
  memoExcerpt: string;
  redlineContent: string;
  status: "draft" | "submitted-for-review" | "approved" | "revision-requested";
  supervisorFeedback?: string;
  supervisorUid?: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export const CREDENTIAL_LEVEL_DESCRIPTIONS: Record<CredentialLevel, { title: string; desc: string }> = {
  1: { title: "L1: Document Review", desc: "Initial contract screening, intake cataloging, and factual summary extraction." },
  2: { title: "L2: Contract Analyst", desc: "Clause breakdown, risk identification, and standard template drafting." },
  3: { title: "L3: Legal Research", desc: "Statutory & regulatory research, precedent synthesis, and memo drafting." },
  4: { title: "L4: Regulatory Specialist", desc: "FAA/DOT compliance, CLT zoning variances, and municipal land trust filings." },
  5: { title: "L5: Junior Drafter", desc: "Full agreement redlining, multi-ngo cross-border agreements, and supervised court briefs." },
};

export const LAW_PRACTICE_AREAS: {
  slug: LegalPracticeArea;
  label: string;
  tagline: string;
  description: string;
  originatingDomains: string[];
  colorAccent: string;
}[] = [
  {
    slug: "transportation-regulatory",
    label: "Transportation & Regulatory Compliance",
    tagline: "FAA Leases, DOT Fleet Compliance & Import Regulations",
    description:
      "Operational legal oversight for autonomous fleet management, FAA airspace leasing, DOT transportation compliance, and international logistics operations.",
    originatingDomains: ["transportation.beamthinktank.space"],
    colorAccent: "#3B82F6",
  },
  {
    slug: "municipal-zoning-clt",
    label: "Municipal Zoning & CLT Land Trusts",
    tagline: "Community Land Trusts, 800 W. Wells Variances & Adaptive Reuse",
    description:
      "Property law, community land trust structuring, municipal zoning variances (such as 800 W. Wells), and affordable housing preservation models.",
    originatingDomains: ["grounds.beamthinktank.space"],
    colorAccent: "#10B981",
  },
  {
    slug: "ip-academic-licensing",
    label: "IP, AI Consent & Academic Licensing",
    tagline: "Studio AI Models, Dataset Consent & Artist IP Protection",
    description:
      "Intellectual property management for machine learning models, ethically sourced dataset licensing agreements, and artist copyright governance.",
    originatingDomains: ["forge.beamthinktank.space", "orchestra.beamthinktank.space"],
    colorAccent: "#8B5CF6",
  },
  {
    slug: "contract-client-services",
    label: "Client Services & Stipend Operations",
    tagline: "ReadyAimGo Client Agreements & Multi-Currency Stipends",
    description:
      "Enterprise software agreements, client service level agreements (SLAs), participant stipend distribution, and multi-currency contract caps.",
    originatingDomains: ["clients.readyaimgo.biz"],
    colorAccent: "#F59E0B",
  },
  {
    slug: "nonprofit-governance",
    label: "501(c)(3) Governance & Fiscal Sponsorship",
    tagline: "Ecosystem Bylaws, Board Compliance & Fiscal Sponsorship",
    description:
      "Ecosystem-wide non-profit governance, 501(c)(3) compliance auditing, fiscal sponsorship arrangements, and inter-NGO MOU agreements.",
    originatingDomains: ["law.beamthinktank.space"],
    colorAccent: "#EC4899",
  },
];

// Legacy / compatibility exports
export const TRACKS = [
  { id: 'legal-aid', name: 'Legal Aid', roles: ['Attorney', 'Paralegal', 'Intake Coordinator', 'Case Manager'] },
  { id: 'ip-support', name: 'IP Support', roles: ['Attorney', 'IP Volunteer', 'Paralegal', 'Intake Coordinator'] },
  { id: 'governance-reform', name: 'Governance Reform', roles: ['Policy Advocate', 'Attorney', 'Community Organizer', 'Case Manager'] },
] as const;

export const CHAPTERS = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
].map((city) => ({ id: city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), name: `${city} Chapter`, city, type: 'chapter' as const }));

export const PARTICIPANT_STATUSES = ['pending', 'active', 'inactive', 'declined'] as const;
export const CASE_PHASES = ['New', 'Assigned', 'In Progress', 'Resolved', 'Closed'] as const;
export const ALL_ROLES = [...new Set(TRACKS.flatMap((track) => [...track.roles]))].sort();

export type Participant = {
  id: string; name: string; email: string; role: string; status: string; headline: string;
  notes: string; city: string; chapterId: string | null; source: string;
};
export type LegalCase = {
  id: string; clientName: string; email: string; phone: string; city: string; chapterId: string | null;
  issueType: string; message: string; trackId: string; phase: string; assignedParticipantId: string | null;
  linkedOrgId: string | null; source: string;
};

export function trackForIssue(issue: string) {
  if (issue === 'ip') return 'ip-support';
  if (issue === 'governance') return 'governance-reform';
  return 'legal-aid';
}
