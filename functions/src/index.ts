import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';

initializeApp();

export const onParticipantCreated = onDocumentCreated('participants/{participantId}', async (event) => {
  const participant = event.data?.data();
  if (!participant) return;
  const participantId = event.params.participantId;
  const db = getFirestore();
  const batch = db.batch();
  batch.set(db.doc(`participantProfiles/${participantId}`), {
    participantId, name: participant.name, email: String(participant.email).toLowerCase(), role: participant.role,
    sourceSite: 'law', updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  if (participant.chapterId) {
    batch.set(db.doc(`organizationMemberships/${participantId}_${participant.chapterId}`), {
      participantProfileId: participantId, organizationId: participant.chapterId, organizationType: 'chapter',
      role: participant.role, status: participant.status, sourceSite: 'law', updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  }
  await batch.commit();
});

