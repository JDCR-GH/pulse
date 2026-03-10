/**
 * GET /api/health
 *
 * Health check endpoint. Railway/Render uses this to know the app is alive.
 * Also returns integration status.
 */

import { NextResponse } from 'next/server';

export async function GET() {
  const integrations = {
    grafana: !!process.env.GRAFANA_URL && !!process.env.GRAFANA_API_KEY,
    gong: !!process.env.GONG_API_KEY && !!process.env.GONG_API_SECRET,
    pylon: !!process.env.PYLON_API_KEY,
    slack: !!process.env.SLACK_BOT_TOKEN,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
  };

  const allConnected = Object.values(integrations).every(Boolean);

  return NextResponse.json({
    status: 'ok',
    version: '0.1.0',
    integrations,
    ready: allConnected,
    timestamp: new Date().toISOString(),
  });
}
