import { Resend } from 'resend';
// Vercel serverless function for sending emails via Resend REST API
export default async function handler(req: any, res: any) {
  // Add comprehensive logging for debugging

  let body = req.body;
  const { to, subject, html, from } = body;
const resend = new Resend("re_NnTZvVdb_MNZFrw9c8x6EWrBkkDFmoFZN");

(async function () {
  const { data, error } = await resend.emails.send({
    from: 'Zyra <contact@shopzyra.site>',
    to: ['anas.abusall@gmail.com'],
    subject: 'Hello World',
    html: '<strong>It works!</strong>',
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
})();
}