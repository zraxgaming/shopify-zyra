// This API route is no longer used since all email sending is handled by EmailJS client-side.
// You can safely remove this file or leave it as a stub for future use.
export default function handler(_req: any, res: any) {
  return res.status(410).json({ error: 'This endpoint is no longer in use. All email is sent via EmailJS.' });
}
