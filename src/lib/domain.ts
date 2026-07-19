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

