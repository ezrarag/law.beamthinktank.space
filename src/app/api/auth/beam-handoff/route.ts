import { NextResponse } from 'next/server';

export interface BeamHandoffRequestBody {
  token?: string;
  uid?: string;
  email?: string;
  displayName?: string;
  roleTier?: string;
  sourceDomain?: string;
  institutionAffiliation?: string;
}

export async function POST(request: Request) {
  try {
    const body: BeamHandoffRequestBody = await request.json();

    const uid = body.uid || 'anonymous-user';
    const email = body.email || '';
    const displayName = body.displayName || 'BEAM Member';

    // Construct standardized handoff payload
    const participantRecord = {
      uid,
      fullName: displayName,
      email,
      sourceDomain: 'law.beamthinktank.space',
      roleTier: body.roleTier || 'pre-law',
      institutionAffiliation: body.institutionAffiliation || 'BEAM Legal Operations Hub',
      practiceAreas: [
        'transportation-regulatory',
        'municipal-zoning-clt',
        'ip-academic-licensing',
        'contract-client-services',
        'nonprofit-governance',
      ],
      credentialLevel: 1,
      activeMatterIds: [],
      reviewsCompletedCount: 0,
      portfolio: [],
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      profile: participantRecord,
      message: 'Multi-tenant BEAM auth handoff processed successfully.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid auth handoff payload',
      },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');

  return NextResponse.json({
    status: 'active',
    endpoint: '/api/auth/beam-handoff',
    canonicalProject: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'home-beam',
    queriedUid: uid ?? null,
  });
}
