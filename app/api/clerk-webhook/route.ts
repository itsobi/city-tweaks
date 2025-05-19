import { api } from '@/convex/_generated/api';
import { client } from '@/lib/convexHTTPClient';
import { WebhookEvent } from '@clerk/nextjs/webhooks';
import { Webhook } from 'svix';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const SIGNING_SECRET =
    process.env.NODE_ENV === 'production'
      ? process.env.CLERK_WEBHOOK_SIGNING_SECRET_PROD
      : process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('CLERK_SIGNING_SECRET is not set');
  }

  const webhook = new Webhook(SIGNING_SECRET);

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let event: WebhookEvent;

  try {
    event = webhook.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error('Error: Could not verify webhook:', error);
    return new Response('Error: Could not verify webhook', {
      status: 400,
    });
  }

  const eventType = event.type;

  try {
    switch (eventType) {
      case 'user.created':
        console.log('USER CREATED');
        await client.mutation(api.users.createUser, {
          clerkId: event.data.id,
          username: event.data.username!,
          imageUrl: event.data.image_url,
        });
        break;
      case 'user.updated':
        console.log('USER UPDATED');
        await client.mutation(api.users.updateUser, {
          clerkId: event.data.id,
          username: event.data.username ?? undefined,
          imageUrl: event.data.image_url,
        });
        break;
      default:
        console.log('Unhandled event type: ', eventType);
        break;
    }
    return new Response('Webhook succeeded', { status: 200 });
  } catch (error) {
    console.error('Error: Could not process webhook:', error);
    return new Response('Error: Could not process webhook', {
      status: 400,
    });
  }
}
