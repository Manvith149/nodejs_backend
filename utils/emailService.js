import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Send Order Confirmation Email
 * @param {Object} order - The order object
 * @param {Object} user - The user object
 */
export const sendOrderConfirmationEmail = async (order, user) => {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('Skipping email: SMTP credentials not found.');
            return;
        }

        console.log(`Preparing email for Order #${order.orderNumber} to ${user.email}`);

        const itemsList = order.items.map(item =>
            `<li>${item.name} x ${item.quantity} - ₹${item.price.toFixed(2)}</li>`
        ).join('');

        const mailOptions = {
            from: `"Manvith Charcoal" <${process.env.SMTP_USER}>`,
            to: user.email,
            subject: `Order Confirmation - #${order.orderNumber}`,
            html: `
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
            <ul>
              ${itemsList}
            </ul>
          </div>

          <p>We will notify you once your order is shipped.</p>
          <p>Best Regards,<br/>Manvith Charcoal Team</p>
          <hr/>
          <p style="font-size: 12px; color: #666;">If you have questions, reply to this email or contact us via WhatsApp.</p>
        </div>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

/**
 * Send Order Cancellation Email
 * @param {Object} order - The order object
 * @param {Object} user - The user object
 */
export const sendOrderCancellationEmail = async (order, user) => {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('Skipping email: SMTP credentials not found.');
            return;
        }

        console.log(`Preparing cancellation email for Order #${order.orderNumber} to ${user.email}`);

        const mailOptions = {
            from: `"Manvith Charcoal" <${process.env.SMTP_USER}>`,
            to: user.email,
            subject: `Order Cancelled - #${order.orderNumber}`,
            html: `
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
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Order cancellation email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending cancellation email:', error);
    }
};

/**
 * Placeholder for WhatsApp Notification
 */
export const sendWhatsAppNotification = async (order, user) => {
    // To implement this, you would need a Twilio account or interaction with WhatsApp Business API
    console.log('WhatsApp notification logic would go here.');
};
