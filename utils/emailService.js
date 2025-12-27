import dotenv from 'dotenv';
dotenv.config();

// Sender details (fallback to a default if env not set)
const SENDER_EMAIL = process.env.SMTP_USER || 'info@manvithcharcoal.com';
const SENDER_NAME = 'Manvith Charcoal';

/**
 * Send Email via Brevo HTTP API (Bypasses Render SMTP Block)
 * @param {string} toEmail 
 * @param {string} toName 
 * @param {string} subject 
 * @param {string} htmlContent 
 */
const sendEmailViaApi = async (toEmail, toName, subject, htmlContent) => {
  if (!process.env.BREVO_API_KEY) {
    console.error('Skipping email: BREVO_API_KEY not found in .env');
    return;
  }

  try {
    console.log(`Sending email API request to ${toEmail}...`);

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { email: SENDER_EMAIL, name: SENDER_NAME },
        to: [{ email: toEmail, name: toName }],
        subject: subject,
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('Email sent successfully via API:', data.messageId);
  } catch (error) {
    console.error('Error sending email via API:', error);
  }
};

/**
 * Send Order Confirmation Email
 */
export const sendOrderConfirmationEmail = async (order, user) => {
  const itemsList = order.items.map(item =>
    `<li>${item.name} x ${item.quantity} - ₹${item.price.toFixed(2)}</li>`
  ).join('');

  const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c;">Order Confirmed!</h2>
          <p>Hi ${user.name},</p>
          <p>Thank you for your order. We have received your request and are processing it.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order #:</strong> ${order.orderNumber}</p>
            <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
            <p><strong>Status:</strong> ${order.orderStatus}</p>
            
            <h4>Items:</h4>
            <ul>${itemsList}</ul>
          </div>

          <p>We will notify you once your order is shipped.</p>
          <p>Best Regards,<br/>Manvith Charcoal Team</p>
        </div>
    `;

  await sendEmailViaApi(user.email, user.name, `Order Confirmation - #${order.orderNumber}`, htmlContent);
};

/**
 * Send Order Cancellation Email
 */
export const sendOrderCancellationEmail = async (order, user) => {
  const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Order Cancelled</h2>
          <p>Hi ${user.name},</p>
          <p>Your order #${order.orderNumber} has been successfully cancelled as per your request.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>Cancelled Order Details</h3>
            <p><strong>Order #:</strong> ${order.orderNumber}</p>
            <p><strong>Total Refund Amount (if paid):</strong> ₹${order.total.toFixed(2)}</p>
          </div>

          <p>If you have already paid, the refund will be processed within 5-7 business days.</p>
          <p>Best Regards,<br/>Manvith Charcoal Team</p>
        </div>
    `;

  await sendEmailViaApi(user.email, user.name, `Order Cancelled - #${order.orderNumber}`, htmlContent);
};

export const sendWhatsAppNotification = async (order, user) => {
  console.log('WhatsApp placeholder');
};
