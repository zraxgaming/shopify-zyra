import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { OrderStatusEmail } from '../src/components/emails/OrderStatusEmail.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      orderNumber, 
      customerName, 
      customerEmail,
      status,
      trackingNumber
    } = req.body;

    if (!orderNumber || !customerName || !customerEmail || !status) {
      return res.status(400).json({ error: 'Missing required order information' });
    }

    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const getSubject = (status: string, orderNumber: string) => {
      switch (status) {
        case 'processing': return `Order #${orderNumber} is being processed`;
        case 'shipped': return `Order #${orderNumber} has shipped`;
        case 'delivered': return `Order #${orderNumber} has been delivered`;
        case 'cancelled': return `Order #${orderNumber} has been cancelled`;
        default: return `Update for Order #${orderNumber}`;
      }
    };

    const result = await resend.emails.send({
      from: 'Zyra Custom Craft <contact@shopzyra.site>',
      to: [customerEmail],
      subject: getSubject(status, orderNumber),
      react: OrderStatusEmail({ 
        orderNumber, 
        customerName, 
        status, 
        trackingNumber 
      }),
    });

    return res.status(200).json({ success: true, id: result.data?.id });

  } catch (error) {
    console.error('Order status email error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error });
  }
}
