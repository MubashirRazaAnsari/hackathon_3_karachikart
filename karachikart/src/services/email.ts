import { Order } from '@/types/order';

interface EmailData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

// Mock email sending function - replace with your actual email service
async function sendEmail(emailData: EmailData) {
  console.log('Sending email:', emailData);
  // Implement your email service here
}

export async function sendTrackingEmail(order: Order) {
  // Implement your email service here (e.g., SendGrid, Amazon SES)
  // Send tracking information to customer
  try {
    await sendEmail({
      to: order.user.email,
      subject: `Your order ${order.orderNumber} has been shipped!`,
      template: 'order-shipped',
      data: {
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber,
        trackingUrl: `${process.env.NEXT_PUBLIC_URL}/tracking/${order.trackingNumber}`,
      },
    });
  } catch (error) {
    console.error('Failed to send tracking email:', error);
  }
} 