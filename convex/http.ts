import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { internal } from './_generated/api';

const http = httpRouter();

http.route({
  path: '/api/clerk-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const svixHeaders = {
      'svix-id': request.headers.get('svix-id')!,
      'svix-timestamp': request.headers.get('svix-timestamp')!,
      'svix-signature': request.headers.get('svix-signature')!,
    };

    if (
      !svixHeaders['svix-id'] ||
      !svixHeaders['svix-timestamp'] ||
      !svixHeaders['svix-signature']
    ) {
      return new Response('Missing Svix headers', { status: 400 });
    }

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error('WEBHOOK_SECRET is not set');
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    let event: WebhookEvent;

    try {
      event = wh.verify(payloadString, svixHeaders) as WebhookEvent;
    } catch {
      console.error('Invalid webhook');
      return new Response('Invalid webhook', { status: 400 });
    }

    try {
      switch (event.type) {
        case 'user.created':
          await ctx.runMutation(internal.users.createUser, {
            clerkId: event.data.id,
            username: event.data.username!,
            imageUrl: event.data.image_url,
          });
          console.log('USER CREATED');
          break;
        case 'user.updated':
          await ctx.runMutation(internal.users.updateUser, {
            clerkId: event.data.id,
            username: event.data.username!,
            imageUrl: event.data.image_url,
          });
          console.log('USER UPDATED');
          break;
        default:
          console.log('Unhandled event type', event.type);
          break;
      }
      return new Response('Webhook processed successfully', { status: 200 });
    } catch (error) {
      console.error('Error processing webhook', error);
      return new Response('Error processing webhook', { status: 500 });
    }
  }),
});

export default http;
