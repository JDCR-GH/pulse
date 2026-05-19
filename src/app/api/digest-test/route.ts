import { findChannel } from '@/lib/slack';

export async function POST(request: Request) {
  const body = await request.json();
  console.log('digest-test request body:', body);

  const channelId = await findChannel(body.channel);

  if (!channelId) {
    return new Response('channel not found', { status: 404 });
  }

  return new Response(JSON.stringify({ channelId, account: body.accountName, email: body.contactEmail }), {
    headers: { 'content-type': 'application/json' },
  });
}
