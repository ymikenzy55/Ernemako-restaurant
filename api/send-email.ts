import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, message, replyTo } = req.body;

  // Validate required fields
  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Call Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ernemako Restaurant <onboarding@resend.dev>', // Use Resend's test domain for now
        to: [to],
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #8D6E63 0%, #5D4037 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Ernemako Restaurant</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            <div style="padding: 20px; text-align: center; background: #333; color: white; font-size: 12px;">
              <p>Ernemako Restaurant</p>
              <p>Opposite Fiapre Park, Sunyani, Bono Region, Ghana</p>
              <p>+233 123 456 789 | hello@ernemakorestaurant.com</p>
            </div>
          </div>
        `,
        reply_to: replyTo || 'hello@ernemakorestaurant.com',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      return res.status(response.status).json({ error: data.message || 'Failed to send email' });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
