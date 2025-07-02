// @ts-ignore
const { Resend } = require('resend');

// Load environment variables from .env.local if not in production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local' });
}

const resend = new Resend("re_3ZYY9s3W_HuQbhTk4BDEPrrTUB37HyKan");

(async function() {
  try {
    const data = await resend.emails.send({
      from: 'Zyra <contact@shopzyra.site>',
      to: ['delivered@resend.dev'], // Change to your email for testing
      subject: 'Hello World',
      html: '<strong>It works!</strong>'
    });

    console.log(data);
  } catch (error) {
    console.error(error);
  }
})();
