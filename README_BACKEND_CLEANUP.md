# Zyra Custom Craft Backend Cleanup Plan

## Safe to Delete (Unused/Empty)
- `api/send-email.ts`
- `api/send-email.ts.bak`
- `api/send-newsletter-welcome.ts`
- `api/email-templates.ts`

## Keep
- `api/send-email-generic.ts` (main backend email API, now robust and logged)

## Next Steps
- Delete the above unused/empty files to reduce clutter and optimize your backend.
- Keep only `send-email-generic.ts` for all transactional/notification emails.
- All email templates should be managed in `src/utils/emailTemplate.ts`.

---

**You can now safely delete the unused files listed above.**
