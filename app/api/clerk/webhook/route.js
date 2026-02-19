import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { inngest } from '@/inngest/client';

export async function POST(req) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        return new Response('CLERK_WEBHOOK_SECRET is not set', { status: 500 });
    }

    // Get the Svix headers for verification
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Missing svix headers', { status: 400 });
    }

    // Get the raw body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Verify the webhook signature
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });
    } catch (err) {
        console.error('Webhook verification failed:', err);
        return new Response('Webhook verification failed', { status: 400 });
    }

    // Forward the event to Inngest
    const eventType = evt.type; // e.g. "user.created"
    await inngest.send({
        name: `clerk/${eventType}`,
        data: evt.data,
    });

    return new Response('OK', { status: 200 });
}
