<<<<<<< HEAD
# ApprovalGuard

ApprovalGuard is a Maharashtra pharmaceutical approval-readiness prototype. It stores business profiles, accepts approval documents, validates extracted fields, and returns a readiness score with issues and recommendations.

## Run locally

1. Install dependencies with `npm install` and `cd Backend; npm install`.
2. Copy `Backend/.env.example` to `Backend/.env` and set `MONGO_URI`.
3. Start MongoDB.
4. Run `npm start`.
5. Open `http://localhost:5000/document-vault.html`.

The frontend is served by Express. Supported uploads are PDF, JPG, and PNG files up to 20MB. The API exposes `/api/documents/upload` (with legacy `/upload-and-verify` and `/upload-and-check` aliases), `/api/documents/:documentId/checklist`, `/api/approvals/MPCB_CTE_PHARMA`, `/api/document-templates/:documentCode`, `/api/approvals/:approvalCode/readiness-report?businessId=...`, `/api/documents/verification/:documentId`, `/api/documents/re-verify/:documentId`, and `/api/documents/business/:businessProfileId`. Results are deterministic, rule-based completeness checklists and do not replace official authority review.
=======
# SIH26130
>>>>>>> c775e84e97f51d34c45d4083eb73e303707f57ba
