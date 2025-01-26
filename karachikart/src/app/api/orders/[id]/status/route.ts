import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/authOptions';
import { client } from '@/sanity/lib/client';
import { generateTrackingNumber } from '@/utils/tracking';
import { z } from 'zod';
import { sendTrackingEmail } from '@/services/email';
import type { Order } from '@/types/order';

// Validation schema for status update
const statusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
});

type StatusUpdateBody = z.infer<typeof statusSchema>;

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json() as StatusUpdateBody;
    const { status } = statusSchema.parse(body);

    // If status is being updated to "shipped"
    if (status === 'shipped') {
      const existingOrder = await client.fetch<Order>(
        `*[_type == "order" && _id == $orderId][0] {
          _id,
          orderNumber,
          trackingNumber,
          user->{
            _id,
            name,
            email
          },
          items[]{
            _id,
            quantity,
            price,
            product->{
              _id,
              name,
              price,
              productImage
            }
          },
          total,
          status,
          shippingAddress,
          paymentInfo,
          createdAt,
          updatedAt
        }`,
        { orderId: params.id }
      );

      if (!existingOrder) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      if (!existingOrder.trackingNumber) {
        try {
          // Generate new tracking number
          const trackingNumber = await generateTrackingNumber();

          // Update order with tracking number and status
          const updatedOrder = await client
            .patch(params.id)
            .set({
              status,
              trackingNumber,
              updatedAt: new Date().toISOString(),
            })
            .commit();

          // After updating the order
          const updatedOrderWithDetails = await client.fetch<Order>(
            `*[_type == "order" && _id == $orderId][0] {
              _id,
              orderNumber,
              trackingNumber,
              user->{
                _id,
                name,
                email
              },
              items,
              total,
              status,
              shippingAddress,
              paymentInfo,
              createdAt,
              updatedAt
            }`,
            { orderId: params.id }
          );

          // Send tracking email with complete order details
          await sendTrackingEmail(updatedOrderWithDetails);

          return NextResponse.json(updatedOrder);
        } catch (error) {
          console.error('Error generating tracking number:', error);
          return NextResponse.json(
            { error: 'Failed to generate tracking number' },
            { status: 500 }
          );
        }
      }
    }

    // For other status updates
    const updatedOrder = await client
      .patch(params.id)
      .set({
        status,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
} 