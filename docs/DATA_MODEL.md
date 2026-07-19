# BEAM Law Firestore model

All timestamps are Firestore timestamps. Canonical IDs are deterministic so writes are idempotent and can support cross-site synchronization later.

## Operational collections

- `tracks/{trackId}`: `id`, `name`, `roles[]`, `fixed`, `updatedAt`. IDs: `legal-aid`, `ip-support`, `governance-reform`.
- `chapters/{chapterId}`: `id`, `name`, `city`, `type: "chapter"`, `status`, `updatedAt`. The slugged city is the ID.
- `participants/{participantId}`: `name`, `email`, `role`, `status` (`pending|active|inactive|declined`), `headline`, `notes`, `city`, `chapterId|null`, `source`, `createdAt`, `updatedAt`.
- `cases/{caseId}`: `clientName`, `email`, `phone`, `city`, `chapterId|null`, `issueType`, `message`, `trackId`, `phase` (`New|Assigned|In Progress|Resolved|Closed`), `assignedParticipantId|null`, `linkedOrgId|null`, `source`, `createdAt`, `updatedAt`.

## Canonical identity collections

- `participantProfiles/{participantId}`: `participantId`, `name`, `email`, `role`, `sourceSite: "law"`, `updatedAt`.
- `organizationMemberships/{participantId}_{chapterId}`: `participantProfileId`, `organizationId`, `organizationType: "chapter"`, `role`, `status`, `sourceSite: "law"`, `updatedAt`.
- `cohortMemberships/{participantId}_{caseId}`: `participantProfileId`, `cohortId` (case ID), `cohortType: "case"`, `trackId`, `role`, `status`, `sourceSite: "law"`, `updatedAt`.

The `onParticipantCreated` Cloud Function creates the profile and optional chapter membership for public self-registration. Admin participant changes and case assignment use the same shape from the application write-through helper.

## Explicitly deferred

Live cross-site API synchronization, donation/payment changes, billing/time tracking, and document management/e-signature are future work. The `sourceSite`, deterministic membership IDs, and explicit organization/cohort types are included to make those additions non-breaking.

