import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { serverClient } from '@/sanity/lib/client';

export async function GET() {
  const headersList = headers();
  const response = new NextResponse(
    new ReadableStream({
      start(controller) {
        const subscription = serverClient
          .listen('*[_type == "newProduct"]')
          .subscribe((update) => {
            const data = JSON.stringify({
              productId: update.documentId,
              newStock: update.result?.stock ?? 0,
            });
            controller.enqueue(`data: ${data}\n\n`);
          });

        // Clean up subscription when client disconnects
        headersList.get('connection')?.toLowerCase() === 'close' && subscription.unsubscribe();
      },
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    }
  );

  return response;
} 