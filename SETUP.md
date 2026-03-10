# Pulse — Setup Guide

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────┐
│  Grafana    │     │    Gong      │     │  Pylon    │
│  (metrics)  │     │  (calls)     │     │ (tickets) │
└──────┬──────┘     └──────┬───────┘     └─────┬─────┘
       │                   │                   │
       └──────────┬────────┴───────────────────┘
                  │
           ┌──────▼──────┐
           │   Pulse     │
           │  (Next.js)  │──── Claude API (synthesis)
           └──────┬──────┘
                  │
           ┌──────▼──────┐
           │   Slack     │
           │  (bot posts)│
           └─────────────┘
```

## Step 1: Slack App

1. Go to https://api.slack.com/apps → **Create New App** → **From scratch**
2. Name: "Pulse", Workspace: your CodeRabbit workspace
3. Go to **OAuth & Permissions** → Add these **Bot Token Scopes**:
   - `channels:read` — find channels
   - `channels:manage` — create channels
   - `channels:history` — read channel context
   - `chat:write` — post messages
   - `chat:write.public` — post to channels without joining
4. **Install to Workspace** → Copy the **Bot User OAuth Token** (starts with `xoxb-`)
5. Set `SLACK_BOT_TOKEN` in your env

## Step 2: Gong API

1. Go to Gong → Settings → API
2. Create a new API key
3. Set `GONG_API_KEY` and `GONG_API_SECRET` in your env

## Step 3: Pylon API

1. Go to Pylon → Settings → API
2. Generate an API key
3. Set `PYLON_API_KEY` in your env

## Step 4: Grafana API

1. Go to Grafana → Administration → Service Accounts
2. Create a service account with **Viewer** role
3. Generate a token
4. Set `GRAFANA_URL` and `GRAFANA_API_KEY` in your env

## Step 5: Anthropic API

1. Go to https://console.anthropic.com
2. Create an API key
3. Set `ANTHROPIC_API_KEY` in your env

## Step 6: Deploy to Railway

1. Push code to GitHub
2. Go to https://railway.app → **New Project** → **Deploy from GitHub**
3. Railway auto-detects Next.js — it will build and deploy
4. Go to **Variables** tab → Add all env vars from `.env.example`
5. Set up the cron job:
   - Go to **Settings** → **Cron** (or add a new cron service)
   - Schedule: `0 9 * * 1-5` (9 AM, Monday-Friday)
   - Command: `curl -s https://your-app.railway.app/api/cron/digest?secret=$CRON_SECRET`

That's it. Pulse will post account digests to Slack every weekday at 9 AM.

## Step 7 (Optional): Add Accounts

Edit `src/lib/accounts.ts` to add your actual accounts. Each account needs:
- A name and slug
- The company name as it appears in Gong and Pylon
- The Slack channel name (Pulse will create it if it doesn't exist)

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check + integration status |
| `/api/digest` | POST | Generate digest for one account |
| `/api/cron/digest` | GET | Generate digests for all accounts (cron) |

### Manual digest for one account:
```bash
curl -X POST https://your-app.railway.app/api/digest \
  -H "Content-Type: application/json" \
  -d '{"accountSlug": "shopify", "dryRun": true}'
```

### Trigger full cron manually:
```bash
curl "https://your-app.railway.app/api/cron/digest?secret=YOUR_CRON_SECRET"
```

## Local Development

```bash
cp .env.example .env.local
# Fill in your API keys
npm install
npm run dev
```

## Costs

- **Railway**: ~$5/mo for a small app + cron
- **Claude API**: ~$0.01-0.05 per digest (Sonnet). 30 accounts × 22 workdays = ~$10-30/mo
- **Slack, Gong, Pylon, Grafana**: Included in your existing subscriptions
