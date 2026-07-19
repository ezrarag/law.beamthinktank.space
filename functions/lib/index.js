"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onParticipantCreated = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const firestore_2 = require("firebase-functions/v2/firestore");
(0, app_1.initializeApp)();
exports.onParticipantCreated = (0, firestore_2.onDocumentCreated)('participants/{participantId}', async (event) => {
    const participant = event.data?.data();
    if (!participant)
        return;
    const participantId = event.params.participantId;
    const db = (0, firestore_1.getFirestore)();
    const batch = db.batch();
    batch.set(db.doc(`participantProfiles/${participantId}`), {
        participantId, name: participant.name, email: String(participant.email).toLowerCase(), role: participant.role,
        sourceSite: 'law', updatedAt: firestore_1.FieldValue.serverTimestamp(),
    }, { merge: true });
    if (participant.chapterId) {
        batch.set(db.doc(`organizationMemberships/${participantId}_${participant.chapterId}`), {
            participantProfileId: participantId, organizationId: participant.chapterId, organizationType: 'chapter',
            role: participant.role, status: participant.status, sourceSite: 'law', updatedAt: firestore_1.FieldValue.serverTimestamp(),
        }, { merge: true });
    }
    await batch.commit();
});
