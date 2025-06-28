// emailjs integration utility
import emailjs from 'emailjs-com';

const EMAILJS_PUBLIC_KEY = 'ABHeCMny0fMuzV-pd';

export const sendNewsletterEmail = async ({ to, message, unsubscribe_link }: { to: string; message: string; unsubscribe_link: string }) => {
  return emailjs.send(
    'service_tk4r78b',
    'template_33t5q6p',
    {
      email: to,
      message,
      unsubscribe_link
    },
    EMAILJS_PUBLIC_KEY
  );
};

export const sendOrderStatusEmail = async ({ to, order_id, status }: { to: string; order_id: string; status: string }) => {
  return emailjs.send(
    'service_tk4r78b',
    'template_9gawxks',
    {
      email: to,
      order_id,
      status
    },
    EMAILJS_PUBLIC_KEY
  );
};
