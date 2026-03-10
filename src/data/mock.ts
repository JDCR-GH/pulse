export type HealthStatus = 'healthy' | 'warning' | 'critical';

export interface SparklinePoint {
  time: string;
  value: number;
}

export interface Account {
  id: string;
  name: string;
  logo: string;
  tier: 'Enterprise' | 'Business' | 'Starter';
  healthScore: number;
  status: HealthStatus;
  mrr: number;
  uptime: number;
  errorRate: number;
  p99Latency: number;
  requestsPerMin: number;
  lastIncident: string | null;
  owner: string;
  ownerAvatar: string;
  sparkline: SparklinePoint[];
  uptimeHistory: SparklinePoint[];
  errorHistory: SparklinePoint[];
  latencyHistory: SparklinePoint[];
}

// Seeded PRNG to avoid SSR hydration mismatches
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateSparkline(base: number, variance: number, trend: 'up' | 'down' | 'stable' = 'stable', points = 24, seed = 42): SparklinePoint[] {
  const rand = seededRandom(seed + base * 100 + variance * 10);
  const data: SparklinePoint[] = [];
  let value = base;
  for (let i = 0; i < points; i++) {
    const trendDelta = trend === 'up' ? 0.3 : trend === 'down' ? -0.3 : 0;
    value = Math.max(0, Math.min(100, value + (rand() - 0.5) * variance + trendDelta));
    data.push({
      time: `${String(i).padStart(2, '0')}:00`,
      value: Math.round(value * 10) / 10,
    });
  }
  return data;
}

function generateLatencySparkline(base: number, variance: number, points = 24, seed = 42): SparklinePoint[] {
  const rand = seededRandom(seed + base * 100 + variance * 10);
  const data: SparklinePoint[] = [];
  let value = base;
  for (let i = 0; i < points; i++) {
    value = Math.max(10, value + (rand() - 0.5) * variance);
    data.push({
      time: `${String(i).padStart(2, '0')}:00`,
      value: Math.round(value),
    });
  }
  return data;
}

export const accounts: Account[] = [
  {
    id: 'acc-001',
    name: 'Stripe',
    logo: 'S',
    tier: 'Enterprise',
    healthScore: 97,
    status: 'healthy',
    mrr: 24500,
    uptime: 99.99,
    errorRate: 0.02,
    p99Latency: 45,
    requestsPerMin: 12400,
    lastIncident: null,
    owner: 'Sarah Chen',
    ownerAvatar: 'SC',
    sparkline: generateSparkline(97, 3, 'up'),
    uptimeHistory: generateSparkline(99.9, 0.1, 'stable'),
    errorHistory: generateSparkline(0.02, 0.03, 'stable'),
    latencyHistory: generateLatencySparkline(45, 12),
  },
  {
    id: 'acc-002',
    name: 'Notion',
    logo: 'N',
    tier: 'Enterprise',
    healthScore: 94,
    status: 'healthy',
    mrr: 18200,
    uptime: 99.97,
    errorRate: 0.05,
    p99Latency: 62,
    requestsPerMin: 8900,
    lastIncident: null,
    owner: 'Marcus Wright',
    ownerAvatar: 'MW',
    sparkline: generateSparkline(94, 4, 'stable'),
    uptimeHistory: generateSparkline(99.95, 0.05, 'stable'),
    errorHistory: generateSparkline(0.05, 0.04, 'stable'),
    latencyHistory: generateLatencySparkline(62, 15),
  },
  {
    id: 'acc-003',
    name: 'Linear',
    logo: 'L',
    tier: 'Business',
    healthScore: 91,
    status: 'healthy',
    mrr: 8400,
    uptime: 99.95,
    errorRate: 0.08,
    p99Latency: 78,
    requestsPerMin: 4200,
    lastIncident: '3 days ago',
    owner: 'Aisha Patel',
    ownerAvatar: 'AP',
    sparkline: generateSparkline(91, 5, 'up'),
    uptimeHistory: generateSparkline(99.9, 0.1, 'up'),
    errorHistory: generateSparkline(0.08, 0.05, 'down'),
    latencyHistory: generateLatencySparkline(78, 18),
  },
  {
    id: 'acc-004',
    name: 'Vercel',
    logo: 'V',
    tier: 'Enterprise',
    healthScore: 72,
    status: 'warning',
    mrr: 31000,
    uptime: 99.82,
    errorRate: 0.34,
    p99Latency: 189,
    requestsPerMin: 15800,
    lastIncident: '6 hours ago',
    owner: 'James Liu',
    ownerAvatar: 'JL',
    sparkline: generateSparkline(72, 8, 'down'),
    uptimeHistory: generateSparkline(99.85, 0.15, 'down'),
    errorHistory: generateSparkline(0.34, 0.12, 'up'),
    latencyHistory: generateLatencySparkline(189, 45),
  },
  {
    id: 'acc-005',
    name: 'Figma',
    logo: 'F',
    tier: 'Business',
    healthScore: 88,
    status: 'healthy',
    mrr: 12600,
    uptime: 99.94,
    errorRate: 0.11,
    p99Latency: 92,
    requestsPerMin: 6700,
    lastIncident: '12 days ago',
    owner: 'Sarah Chen',
    ownerAvatar: 'SC',
    sparkline: generateSparkline(88, 5, 'stable'),
    uptimeHistory: generateSparkline(99.92, 0.08, 'stable'),
    errorHistory: generateSparkline(0.11, 0.06, 'stable'),
    latencyHistory: generateLatencySparkline(92, 20),
  },
  {
    id: 'acc-006',
    name: 'Datadog',
    logo: 'D',
    tier: 'Enterprise',
    healthScore: 41,
    status: 'critical',
    mrr: 42000,
    uptime: 98.2,
    errorRate: 2.8,
    p99Latency: 520,
    requestsPerMin: 22100,
    lastIncident: '23 min ago',
    owner: 'Marcus Wright',
    ownerAvatar: 'MW',
    sparkline: generateSparkline(41, 12, 'down'),
    uptimeHistory: generateSparkline(98.5, 0.8, 'down'),
    errorHistory: generateSparkline(2.8, 1.2, 'up'),
    latencyHistory: generateLatencySparkline(520, 120),
  },
  {
    id: 'acc-007',
    name: 'Supabase',
    logo: 'Su',
    tier: 'Business',
    healthScore: 85,
    status: 'healthy',
    mrr: 9800,
    uptime: 99.91,
    errorRate: 0.14,
    p99Latency: 105,
    requestsPerMin: 5100,
    lastIncident: '8 days ago',
    owner: 'Aisha Patel',
    ownerAvatar: 'AP',
    sparkline: generateSparkline(85, 6, 'up'),
    uptimeHistory: generateSparkline(99.88, 0.1, 'up'),
    errorHistory: generateSparkline(0.14, 0.07, 'down'),
    latencyHistory: generateLatencySparkline(105, 22),
  },
  {
    id: 'acc-008',
    name: 'Planetscale',
    logo: 'P',
    tier: 'Starter',
    healthScore: 65,
    status: 'warning',
    mrr: 3200,
    uptime: 99.7,
    errorRate: 0.52,
    p99Latency: 245,
    requestsPerMin: 1800,
    lastIncident: '2 days ago',
    owner: 'James Liu',
    ownerAvatar: 'JL',
    sparkline: generateSparkline(65, 10, 'down'),
    uptimeHistory: generateSparkline(99.7, 0.2, 'down'),
    errorHistory: generateSparkline(0.52, 0.2, 'up'),
    latencyHistory: generateLatencySparkline(245, 55),
  },
  {
    id: 'acc-009',
    name: 'Resend',
    logo: 'R',
    tier: 'Starter',
    healthScore: 93,
    status: 'healthy',
    mrr: 2100,
    uptime: 99.96,
    errorRate: 0.04,
    p99Latency: 55,
    requestsPerMin: 920,
    lastIncident: null,
    owner: 'Sarah Chen',
    ownerAvatar: 'SC',
    sparkline: generateSparkline(93, 4, 'stable'),
    uptimeHistory: generateSparkline(99.94, 0.06, 'stable'),
    errorHistory: generateSparkline(0.04, 0.03, 'stable'),
    latencyHistory: generateLatencySparkline(55, 14),
  },
  {
    id: 'acc-010',
    name: 'Clerk',
    logo: 'C',
    tier: 'Business',
    healthScore: 78,
    status: 'warning',
    mrr: 7600,
    uptime: 99.85,
    errorRate: 0.28,
    p99Latency: 156,
    requestsPerMin: 3400,
    lastIncident: '1 day ago',
    owner: 'Aisha Patel',
    ownerAvatar: 'AP',
    sparkline: generateSparkline(78, 7, 'stable'),
    uptimeHistory: generateSparkline(99.82, 0.12, 'stable'),
    errorHistory: generateSparkline(0.28, 0.1, 'stable'),
    latencyHistory: generateLatencySparkline(156, 35),
  },
];

export interface Alert {
  id: string;
  accountId: string;
  accountName: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export const alerts: Alert[] = [
  { id: 'alt-1', accountId: 'acc-006', accountName: 'Datadog', severity: 'critical', message: 'Error rate exceeded 2% threshold — currently at 2.8%', timestamp: '23 min ago', acknowledged: false },
  { id: 'alt-2', accountId: 'acc-006', accountName: 'Datadog', severity: 'critical', message: 'P99 latency spike: 520ms (threshold: 300ms)', timestamp: '25 min ago', acknowledged: false },
  { id: 'alt-3', accountId: 'acc-004', accountName: 'Vercel', severity: 'warning', message: 'Uptime dropped below 99.9% in the last 6 hours', timestamp: '6 hours ago', acknowledged: true },
  { id: 'alt-4', accountId: 'acc-008', accountName: 'Planetscale', severity: 'warning', message: 'P99 latency trending upward: 245ms (+32% this week)', timestamp: '2 days ago', acknowledged: true },
  { id: 'alt-5', accountId: 'acc-010', accountName: 'Clerk', severity: 'warning', message: 'Error rate increased to 0.28% from 0.12% baseline', timestamp: '1 day ago', acknowledged: false },
  { id: 'alt-6', accountId: 'acc-003', accountName: 'Linear', severity: 'info', message: 'Health score recovered from 85 to 91 after remediation', timestamp: '3 days ago', acknowledged: true },
];

export const overviewStats = {
  totalAccounts: 10,
  healthyCount: 6,
  warningCount: 3,
  criticalCount: 1,
  avgHealthScore: 80.4,
  totalMRR: 159400,
  avgUptime: 99.73,
  activeAlerts: 3,
};

export interface TimeSeriesPoint {
  date: string;
  healthy: number;
  warning: number;
  critical: number;
}

export const healthTrend: TimeSeriesPoint[] = [
  { date: 'Mar 1', healthy: 7, warning: 2, critical: 1 },
  { date: 'Mar 2', healthy: 7, warning: 2, critical: 1 },
  { date: 'Mar 3', healthy: 8, warning: 1, critical: 1 },
  { date: 'Mar 4', healthy: 7, warning: 2, critical: 1 },
  { date: 'Mar 5', healthy: 6, warning: 3, critical: 1 },
  { date: 'Mar 6', healthy: 6, warning: 3, critical: 1 },
  { date: 'Mar 7', healthy: 7, warning: 2, critical: 1 },
  { date: 'Mar 8', healthy: 6, warning: 3, critical: 1 },
  { date: 'Mar 9', healthy: 6, warning: 3, critical: 1 },
];

// ─── Gong Data ───────────────────────────────────────────────

export type CallSentiment = 'positive' | 'neutral' | 'negative';

export interface GongCall {
  id: string;
  accountId: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  sentiment: CallSentiment;
  sentimentScore: number; // -1 to 1
  summary: string;
  keyMoments: string[];
  nextSteps: string[];
  topics: string[];
  talkRatio: { us: number; them: number };
}

export const gongCalls: Record<string, GongCall[]> = {
  'acc-001': [
    {
      id: 'gong-001', accountId: 'acc-001', title: 'Quarterly Business Review',
      date: 'Mar 7, 2026', duration: '52 min',
      participants: ['Sarah Chen', 'David Park (Stripe)', 'Lisa Nguyen (Stripe)'],
      sentiment: 'positive', sentimentScore: 0.85,
      summary: 'Strong QBR with Stripe leadership. They confirmed expansion plans for Q2 and expressed satisfaction with current performance metrics. David mentioned exploring our enterprise analytics add-on.',
      keyMoments: ['Expansion discussion at 12:30', 'Analytics add-on interest at 34:15', 'Renewal confirmed at 48:00'],
      nextSteps: ['Send enterprise analytics proposal by Mar 14', 'Schedule technical deep-dive with their data team', 'Prepare Q2 capacity plan'],
      topics: ['Renewal', 'Expansion', 'Product Feedback', 'Technical Roadmap'],
      talkRatio: { us: 38, them: 62 },
    },
    {
      id: 'gong-002', accountId: 'acc-001', title: 'Technical Sync — API Performance',
      date: 'Mar 3, 2026', duration: '28 min',
      participants: ['Sarah Chen', 'Ryan Ko (Stripe)'],
      sentiment: 'positive', sentimentScore: 0.6,
      summary: 'Quick sync on API performance. Ryan satisfied with latency improvements from last sprint. Discussed upcoming migration to v3 endpoints.',
      keyMoments: ['Latency improvement acknowledged at 5:20', 'v3 migration timeline at 18:00'],
      nextSteps: ['Share v3 migration guide', 'Set up staging environment for testing'],
      topics: ['API Performance', 'Migration', 'Technical'],
      talkRatio: { us: 45, them: 55 },
    },
  ],
  'acc-004': [
    {
      id: 'gong-003', accountId: 'acc-004', title: 'Escalation Call — Performance Issues',
      date: 'Mar 9, 2026', duration: '41 min',
      participants: ['James Liu', 'Emily Tran (Vercel)', 'Mike Ross (Vercel)', 'Alex Kim (Engineering)'],
      sentiment: 'negative', sentimentScore: -0.55,
      summary: 'Tense call regarding ongoing latency spikes affecting their production deployments. Emily expressed frustration with response times from our support team. Mike hinted at evaluating alternatives if not resolved within 2 weeks.',
      keyMoments: ['Frustration expressed at 8:45', 'Alternative vendor mentioned at 22:30', 'Deadline set: 2 weeks at 35:00'],
      nextSteps: ['Assign dedicated engineering resource', 'Daily status updates to Vercel team', 'Root cause analysis by Mar 12', 'Exec sponsor call with their VP Eng'],
      topics: ['Escalation', 'Performance', 'Churn Risk', 'Support'],
      talkRatio: { us: 55, them: 45 },
    },
    {
      id: 'gong-004', accountId: 'acc-004', title: 'Weekly Check-in',
      date: 'Mar 5, 2026', duration: '22 min',
      participants: ['James Liu', 'Emily Tran (Vercel)'],
      sentiment: 'neutral', sentimentScore: -0.1,
      summary: 'Routine weekly check-in. Emily flagged early signs of latency increases but was not yet alarmed. Discussed upcoming feature rollout.',
      keyMoments: ['Latency concern raised at 10:00', 'Feature rollout discussed at 16:30'],
      nextSteps: ['Monitor latency trends', 'Prepare feature rollout timeline'],
      topics: ['Check-in', 'Performance', 'Product Updates'],
      talkRatio: { us: 50, them: 50 },
    },
  ],
  'acc-006': [
    {
      id: 'gong-005', accountId: 'acc-006', title: 'Emergency Incident Bridge',
      date: 'Mar 10, 2026', duration: '1h 15min',
      participants: ['Marcus Wright', 'Tom Chen (Datadog)', 'Priya Shah (Datadog)', 'VP Engineering', 'On-call Team'],
      sentiment: 'negative', sentimentScore: -0.82,
      summary: 'Critical incident bridge. Datadog experiencing cascading failures tied to our service. Tom was extremely frustrated — mentioned this is the third incident in 6 weeks. Priya (VP) directly asked about SLA credits and contract remediation. Very high churn risk.',
      keyMoments: ['Third incident referenced at 5:00', 'SLA credit demand at 28:00', 'Contract remediation discussion at 45:00', '"Last straw" comment at 52:30'],
      nextSteps: ['Prepare SLA credit proposal', 'CTO-to-CTO call within 24 hours', 'Dedicated incident response team assigned', 'Weekly exec briefings for 30 days'],
      topics: ['Incident', 'SLA', 'Churn Risk', 'Executive Escalation'],
      talkRatio: { us: 60, them: 40 },
    },
  ],
  'acc-002': [
    {
      id: 'gong-006', accountId: 'acc-002', title: 'Product Feedback Session',
      date: 'Mar 6, 2026', duration: '35 min',
      participants: ['Marcus Wright', 'Anna Lee (Notion)', 'Jake Miller (Notion)'],
      sentiment: 'positive', sentimentScore: 0.7,
      summary: 'Notion team shared positive feedback on recent dashboard improvements. Anna requested deeper integration with their workspace API. Strong relationship — they mentioned us as a "key partner" internally.',
      keyMoments: ['Dashboard praise at 4:00', 'API integration request at 18:30', '"Key partner" mention at 28:00'],
      nextSteps: ['Explore workspace API integration feasibility', 'Schedule follow-up with their product team'],
      topics: ['Product Feedback', 'Integration', 'Partnership'],
      talkRatio: { us: 40, them: 60 },
    },
  ],
  'acc-008': [
    {
      id: 'gong-007', accountId: 'acc-008', title: 'Check-in & Troubleshooting',
      date: 'Mar 8, 2026', duration: '30 min',
      participants: ['James Liu', 'Sam Torres (Planetscale)'],
      sentiment: 'neutral', sentimentScore: -0.2,
      summary: 'Sam raised concerns about growing latency on their primary queries. Not yet critical but trending poorly. Discussed optimization options. Sam seemed open but cautious about long-term fit.',
      keyMoments: ['Latency concern at 7:00', 'Optimization options at 15:30', 'Long-term fit question at 24:00'],
      nextSteps: ['Run query performance audit', 'Share optimization playbook', 'Follow up in 1 week with results'],
      topics: ['Performance', 'Optimization', 'Retention Risk'],
      talkRatio: { us: 48, them: 52 },
    },
  ],
};

// ─── Slack Data ──────────────────────────────────────────────

export type SlackMessageType = 'message' | 'escalation' | 'update' | 'question' | 'celebration';

export interface SlackMessage {
  id: string;
  accountId: string;
  channel: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  type: SlackMessageType;
  reactions?: { emoji: string; count: number }[];
  thread?: { replies: number; lastReply: string };
}

export const slackMessages: Record<string, SlackMessage[]> = {
  'acc-001': [
    {
      id: 'sl-001', accountId: 'acc-001', channel: '#acc-stripe',
      author: 'Sarah Chen', authorAvatar: 'SC', timestamp: 'Today, 9:15 AM',
      content: 'QBR went great! Stripe is looking to expand in Q2. Sent the analytics proposal — expecting a response by EOW.',
      type: 'update',
      reactions: [{ emoji: '🎉', count: 4 }, { emoji: '🚀', count: 2 }],
    },
    {
      id: 'sl-002', accountId: 'acc-001', channel: '#acc-stripe',
      author: 'Alex Kim', authorAvatar: 'AK', timestamp: 'Yesterday, 3:30 PM',
      content: 'v3 migration guide is ready for Stripe. Staging environment set up at stripe-staging.internal. @Sarah Chen FYI.',
      type: 'message',
      thread: { replies: 3, lastReply: 'Yesterday, 4:15 PM' },
    },
    {
      id: 'sl-003', accountId: 'acc-001', channel: '#acc-stripe',
      author: 'Bot', authorAvatar: '🤖', timestamp: 'Yesterday, 10:00 AM',
      content: '📊 Weekly health digest for Stripe: Health score 97 (+2), Uptime 99.99%, Error rate 0.02%. All metrics green.',
      type: 'update',
    },
  ],
  'acc-004': [
    {
      id: 'sl-004', accountId: 'acc-004', channel: '#acc-vercel-escalation',
      author: 'James Liu', authorAvatar: 'JL', timestamp: 'Today, 11:20 AM',
      content: '🚨 Vercel escalation: they are evaluating alternatives. Emily gave us a 2-week window. I need a dedicated eng resource ASAP. @VP Engineering this needs exec attention.',
      type: 'escalation',
      reactions: [{ emoji: '👀', count: 6 }, { emoji: '🔥', count: 3 }],
      thread: { replies: 12, lastReply: 'Today, 12:45 PM' },
    },
    {
      id: 'sl-005', accountId: 'acc-004', channel: '#acc-vercel',
      author: 'On-call Bot', authorAvatar: '🤖', timestamp: 'Today, 6:02 AM',
      content: '⚠️ Alert: Vercel account latency P99 hit 189ms (threshold: 150ms). Uptime dropped to 99.82% over last 6h window.',
      type: 'escalation',
    },
    {
      id: 'sl-006', accountId: 'acc-004', channel: '#acc-vercel',
      author: 'Alex Kim', authorAvatar: 'AK', timestamp: 'Yesterday, 5:00 PM',
      content: 'Investigating the latency spike for Vercel. Looks like it might be related to the connection pool changes we shipped Tuesday. Rolling back now.',
      type: 'message',
      thread: { replies: 8, lastReply: 'Today, 9:30 AM' },
    },
  ],
  'acc-006': [
    {
      id: 'sl-007', accountId: 'acc-006', channel: '#acc-datadog-war-room',
      author: 'Marcus Wright', authorAvatar: 'MW', timestamp: 'Today, 10:45 AM',
      content: '🔴 CRITICAL: Datadog incident bridge just ended. This is their third incident in 6 weeks. VP asked about SLA credits and contract remediation. We need a CTO-to-CTO call within 24 hours. This account is at serious churn risk — $42k MRR.',
      type: 'escalation',
      reactions: [{ emoji: '🚨', count: 8 }, { emoji: '👀', count: 5 }],
      thread: { replies: 24, lastReply: 'Today, 12:30 PM' },
    },
    {
      id: 'sl-008', accountId: 'acc-006', channel: '#acc-datadog-war-room',
      author: 'VP Engineering', authorAvatar: 'VP', timestamp: 'Today, 11:00 AM',
      content: 'I\'m assigning a dedicated 3-person team to Datadog. @On-call Team I want root cause analysis by EOD. @Marcus Wright let\'s prep the SLA credit proposal together — meeting at 2 PM.',
      type: 'message',
      thread: { replies: 6, lastReply: 'Today, 11:45 AM' },
    },
    {
      id: 'sl-009', accountId: 'acc-006', channel: '#acc-datadog-war-room',
      author: 'On-call Bot', authorAvatar: '🤖', timestamp: 'Today, 8:15 AM',
      content: '🔴 CRITICAL ALERT: Datadog error rate at 2.8% (threshold: 1%). P99 latency 520ms (threshold: 300ms). Auto-escalating to VP Engineering.',
      type: 'escalation',
    },
  ],
  'acc-002': [
    {
      id: 'sl-010', accountId: 'acc-002', channel: '#acc-notion',
      author: 'Marcus Wright', authorAvatar: 'MW', timestamp: 'Yesterday, 2:00 PM',
      content: 'Great product feedback session with Notion. They love the new dashboards and called us a "key partner." API integration request logged in Linear.',
      type: 'celebration',
      reactions: [{ emoji: '💙', count: 5 }, { emoji: '🎉', count: 3 }],
    },
    {
      id: 'sl-011', accountId: 'acc-002', channel: '#acc-notion',
      author: 'Product Team', authorAvatar: 'PT', timestamp: 'Yesterday, 4:30 PM',
      content: 'Workspace API integration is technically feasible. ETA ~3 weeks. Adding to Q2 roadmap. @Marcus Wright can you confirm priority with Notion?',
      type: 'message',
      thread: { replies: 4, lastReply: 'Today, 9:00 AM' },
    },
  ],
  'acc-008': [
    {
      id: 'sl-012', accountId: 'acc-008', channel: '#acc-planetscale',
      author: 'James Liu', authorAvatar: 'JL', timestamp: 'Mar 8, 4:00 PM',
      content: 'Planetscale check-in done. Sam is concerned about latency trends. Not critical yet but we should be proactive. Running a query perf audit this week.',
      type: 'update',
      thread: { replies: 2, lastReply: 'Mar 8, 5:30 PM' },
    },
    {
      id: 'sl-013', accountId: 'acc-008', channel: '#acc-planetscale',
      author: 'DBA Team', authorAvatar: 'DB', timestamp: 'Mar 9, 11:00 AM',
      content: 'Query audit for Planetscale shows 3 problematic queries causing 60% of latency. Optimization plan ready — should see improvements within 48h of deploy.',
      type: 'message',
      reactions: [{ emoji: '👍', count: 3 }],
    },
  ],
  'acc-010': [
    {
      id: 'sl-014', accountId: 'acc-010', channel: '#acc-clerk',
      author: 'Aisha Patel', authorAvatar: 'AP', timestamp: 'Yesterday, 1:00 PM',
      content: 'Clerk error rates are creeping up. Opened a ticket with eng. @On-call Team can someone look into this today?',
      type: 'question',
      thread: { replies: 5, lastReply: 'Today, 8:00 AM' },
    },
  ],
};

// ─── Unified Activity Timeline ────────────────────────────────

export type ActivitySource = 'grafana' | 'gong' | 'slack';

export interface ActivityEvent {
  id: string;
  accountId: string;
  source: ActivitySource;
  timestamp: string;
  title: string;
  description: string;
  severity?: 'critical' | 'warning' | 'info' | 'positive';
  link?: string;
}

export function getAccountTimeline(accountId: string): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  // Add alerts as Grafana events
  alerts.filter(a => a.accountId === accountId).forEach(a => {
    events.push({
      id: `timeline-${a.id}`,
      accountId,
      source: 'grafana',
      timestamp: a.timestamp,
      title: a.severity === 'critical' ? 'Critical Alert' : a.severity === 'warning' ? 'Warning Alert' : 'Info',
      description: a.message,
      severity: a.severity === 'info' ? 'info' : a.severity,
    });
  });

  // Add Gong calls
  (gongCalls[accountId] || []).forEach(call => {
    events.push({
      id: `timeline-${call.id}`,
      accountId,
      source: 'gong',
      timestamp: call.date,
      title: call.title,
      description: call.summary,
      severity: call.sentiment === 'positive' ? 'positive' : call.sentiment === 'negative' ? 'critical' : 'info',
    });
  });

  // Add Slack messages (only escalations and key updates)
  (slackMessages[accountId] || []).filter(m => m.type === 'escalation' || m.type === 'celebration').forEach(m => {
    events.push({
      id: `timeline-${m.id}`,
      accountId,
      source: 'slack',
      timestamp: m.timestamp,
      title: m.type === 'escalation' ? 'Slack Escalation' : 'Slack Update',
      description: m.content,
      severity: m.type === 'escalation' ? 'warning' : 'positive',
    });
  });

  // Add Pylon tickets
  (pylonTickets[accountId] || []).filter(t => t.status === 'open' || t.priority === 'urgent').forEach(t => {
    events.push({
      id: `timeline-${t.id}`,
      accountId,
      source: 'grafana', // using grafana source for support events
      timestamp: t.createdAt,
      title: `Support: ${t.title}`,
      description: t.summary,
      severity: t.priority === 'urgent' ? 'critical' : t.priority === 'high' ? 'warning' : 'info',
    });
  });

  return events;
}

// ─── Pylon Data ──────────────────────────────────────────────

export interface PylonTicket {
  id: string;
  accountId: string;
  title: string;
  status: 'open' | 'in_progress' | 'waiting' | 'resolved';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  createdAt: string;
  updatedAt: string;
  assignee: string;
  requester: string;
  summary: string;
  responseTime?: string;
  csat?: number;
}

export const pylonTickets: Record<string, PylonTicket[]> = {
  'acc-001': [
    {
      id: 'pyl-001', accountId: 'acc-001', title: 'Custom review rules for monorepo setup',
      status: 'resolved', priority: 'medium', category: 'configuration',
      createdAt: 'Mar 2', updatedAt: 'Mar 5',
      assignee: 'Sarah Chen', requester: 'David Park (Stripe)',
      summary: 'Stripe needs help configuring custom review rules for their monorepo. Multiple services with different code standards. Resolved by setting up path-based rule groups.',
      responseTime: '1h 45m', csat: 5,
    },
  ],
  'acc-004': [
    {
      id: 'pyl-002', accountId: 'acc-004', title: 'GitHub Enterprise webhook failures',
      status: 'open', priority: 'urgent', category: 'integration',
      createdAt: '4 hours ago', updatedAt: '2 hours ago',
      assignee: 'James Liu', requester: 'Emily Tran (Vercel)',
      summary: 'GitHub Enterprise webhooks are intermittently failing, causing CodeRabbit reviews to not trigger on ~15% of PRs. Started after their GHE upgrade last week.',
      responseTime: '3h 20m',
    },
    {
      id: 'pyl-003', accountId: 'acc-004', title: 'Custom review rules not triggering on monorepo',
      status: 'in_progress', priority: 'high', category: 'bug',
      createdAt: '2 days ago', updatedAt: '1 day ago',
      assignee: 'Alex Kim', requester: 'Mike Ross (Vercel)',
      summary: 'Review rules configured for platform-core and api-gateway repos are not triggering consistently. Possibly related to the webhook issue. Engineering investigating.',
      responseTime: '2h 10m',
    },
  ],
  'acc-006': [
    {
      id: 'pyl-004', accountId: 'acc-006', title: 'CodeRabbit reviews timing out on large PRs',
      status: 'open', priority: 'urgent', category: 'bug',
      createdAt: '1 hour ago', updatedAt: '30 min ago',
      assignee: 'Marcus Wright', requester: 'Tom Chen (Datadog)',
      summary: 'Reviews for PRs with 500+ file changes are timing out. This is blocking their platform team which frequently ships large refactors. They consider this a P0.',
      responseTime: '45m',
    },
    {
      id: 'pyl-005', accountId: 'acc-006', title: 'Integration with internal CI pipeline',
      status: 'in_progress', priority: 'high', category: 'integration',
      createdAt: '5 days ago', updatedAt: '1 day ago',
      assignee: 'Marcus Wright', requester: 'Priya Shah (Datadog)',
      summary: 'Datadog wants CodeRabbit to integrate with their custom CI pipeline to block merges when review issues are found. Requires custom webhook setup.',
      responseTime: '2h 30m',
    },
    {
      id: 'pyl-006', accountId: 'acc-006', title: 'Request for SOC2 compliance docs',
      status: 'waiting', priority: 'medium', category: 'feature_request',
      createdAt: '1 week ago', updatedAt: '3 days ago',
      assignee: 'Marcus Wright', requester: 'Priya Shah (Datadog)',
      summary: 'Datadog security team requesting updated SOC2 compliance documentation before renewal. Need to loop in our compliance team.',
    },
  ],
  'acc-002': [
    {
      id: 'pyl-007', accountId: 'acc-002', title: 'Feature request: Notion workspace API integration',
      status: 'in_progress', priority: 'medium', category: 'feature_request',
      createdAt: 'Mar 6', updatedAt: 'Mar 8',
      assignee: 'Product Team', requester: 'Anna Lee (Notion)',
      summary: 'Notion wants to pull CodeRabbit review summaries into their internal workspace. Would need a new API endpoint. Product team evaluating feasibility.',
      responseTime: '1h 15m', csat: 4,
    },
  ],
  'acc-008': [
    {
      id: 'pyl-008', accountId: 'acc-008', title: 'Slow review times on Go codebases',
      status: 'open', priority: 'high', category: 'bug',
      createdAt: '3 days ago', updatedAt: '1 day ago',
      assignee: 'James Liu', requester: 'Sam Torres (Planetscale)',
      summary: 'CodeRabbit reviews taking 8-12 minutes on their Go repos (previously 2-3 min). Correlates with their repo size growth. Need to investigate Go parser performance.',
      responseTime: '4h 15m',
    },
  ],
  'acc-010': [
    {
      id: 'pyl-009', accountId: 'acc-010', title: 'False positive security findings',
      status: 'open', priority: 'high', category: 'bug',
      createdAt: '1 day ago', updatedAt: '12 hours ago',
      assignee: 'Aisha Patel', requester: 'Dev Team (Clerk)',
      summary: 'CodeRabbit flagging false positive security issues in their auth middleware code. Multiple devs reporting that legitimate patterns are being flagged as vulnerabilities.',
      responseTime: '3h 00m',
    },
    {
      id: 'pyl-010', accountId: 'acc-010', title: 'Onboarding new backend team',
      status: 'in_progress', priority: 'medium', category: 'onboarding',
      createdAt: '4 days ago', updatedAt: '2 days ago',
      assignee: 'Aisha Patel', requester: 'Team Lead (Clerk)',
      summary: 'Clerk hired 5 new backend engineers. Need to onboard them to CodeRabbit, set up their review preferences, and configure team-specific rules.',
      responseTime: '1h 30m', csat: 4,
    },
  ],
};

// ─── Product Usage Data ──────────────────────────────────────

export interface ProductUsage {
  accountId: string;
  prsReviewedLast30d: number;
  prsReviewedPrev30d: number;
  activeUsers: number;
  totalSeats: number;
  configuredRules: number;
  avgReviewTime: string;
  adoptionScore: number;
  topRepos: string[];
  lastActiveAt: string;
  weeklyPrTrend: SparklinePoint[];
}

function generateWeeklyTrend(base: number, variance: number, trend: 'up' | 'down' | 'stable' = 'stable'): SparklinePoint[] {
  const rand = seededRandom(base * 77 + variance * 13);
  const data: SparklinePoint[] = [];
  let value = base;
  for (let i = 0; i < 12; i++) {
    const trendDelta = trend === 'up' ? base * 0.02 : trend === 'down' ? -base * 0.02 : 0;
    value = Math.max(0, value + (rand() - 0.5) * variance + trendDelta);
    data.push({ time: `W${i + 1}`, value: Math.round(value) });
  }
  return data;
}

export const productUsage: Record<string, ProductUsage> = {
  'acc-001': {
    accountId: 'acc-001', prsReviewedLast30d: 3420, prsReviewedPrev30d: 3150,
    activeUsers: 85, totalSeats: 100, configuredRules: 24,
    avgReviewTime: '1.8 min', adoptionScore: 92,
    topRepos: ['payments-core', 'api-v3', 'dashboard', 'sdk-node'],
    lastActiveAt: '2 min ago',
    weeklyPrTrend: generateWeeklyTrend(280, 40, 'up'),
  },
  'acc-002': {
    accountId: 'acc-002', prsReviewedLast30d: 2180, prsReviewedPrev30d: 2050,
    activeUsers: 52, totalSeats: 60, configuredRules: 18,
    avgReviewTime: '2.1 min', adoptionScore: 87,
    topRepos: ['notion-web', 'notion-api', 'shared-libs'],
    lastActiveAt: '15 min ago',
    weeklyPrTrend: generateWeeklyTrend(180, 30, 'stable'),
  },
  'acc-003': {
    accountId: 'acc-003', prsReviewedLast30d: 1560, prsReviewedPrev30d: 1420,
    activeUsers: 28, totalSeats: 35, configuredRules: 12,
    avgReviewTime: '1.5 min', adoptionScore: 85,
    topRepos: ['linear-app', 'linear-api', 'sync-engine'],
    lastActiveAt: '1 hour ago',
    weeklyPrTrend: generateWeeklyTrend(130, 25, 'up'),
  },
  'acc-004': {
    accountId: 'acc-004', prsReviewedLast30d: 1240, prsReviewedPrev30d: 1510,
    activeUsers: 45, totalSeats: 60, configuredRules: 15,
    avgReviewTime: '3.2 min', adoptionScore: 68,
    topRepos: ['platform-core', 'api-gateway', 'edge-runtime'],
    lastActiveAt: '30 min ago',
    weeklyPrTrend: generateWeeklyTrend(120, 30, 'down'),
  },
  'acc-005': {
    accountId: 'acc-005', prsReviewedLast30d: 1870, prsReviewedPrev30d: 1800,
    activeUsers: 38, totalSeats: 45, configuredRules: 16,
    avgReviewTime: '2.0 min', adoptionScore: 82,
    topRepos: ['figma-plugin', 'design-system', 'renderer'],
    lastActiveAt: '45 min ago',
    weeklyPrTrend: generateWeeklyTrend(155, 20, 'stable'),
  },
  'acc-006': {
    accountId: 'acc-006', prsReviewedLast30d: 890, prsReviewedPrev30d: 1620,
    activeUsers: 32, totalSeats: 80, configuredRules: 8,
    avgReviewTime: '5.8 min', adoptionScore: 38,
    topRepos: ['agent-core', 'integrations', 'platform'],
    lastActiveAt: '3 hours ago',
    weeklyPrTrend: generateWeeklyTrend(130, 40, 'down'),
  },
  'acc-007': {
    accountId: 'acc-007', prsReviewedLast30d: 1340, prsReviewedPrev30d: 1200,
    activeUsers: 22, totalSeats: 30, configuredRules: 14,
    avgReviewTime: '1.9 min', adoptionScore: 78,
    topRepos: ['supabase-js', 'postgres-meta', 'realtime'],
    lastActiveAt: '20 min ago',
    weeklyPrTrend: generateWeeklyTrend(110, 20, 'up'),
  },
  'acc-008': {
    accountId: 'acc-008', prsReviewedLast30d: 680, prsReviewedPrev30d: 820,
    activeUsers: 12, totalSeats: 20, configuredRules: 6,
    avgReviewTime: '4.1 min', adoptionScore: 52,
    topRepos: ['vitess-fork', 'ps-cli', 'schema-manager'],
    lastActiveAt: '2 hours ago',
    weeklyPrTrend: generateWeeklyTrend(65, 15, 'down'),
  },
  'acc-009': {
    accountId: 'acc-009', prsReviewedLast30d: 420, prsReviewedPrev30d: 380,
    activeUsers: 8, totalSeats: 10, configuredRules: 10,
    avgReviewTime: '1.4 min', adoptionScore: 88,
    topRepos: ['resend-node', 'react-email'],
    lastActiveAt: '1 hour ago',
    weeklyPrTrend: generateWeeklyTrend(35, 8, 'up'),
  },
  'acc-010': {
    accountId: 'acc-010', prsReviewedLast30d: 960, prsReviewedPrev30d: 1100,
    activeUsers: 18, totalSeats: 25, configuredRules: 9,
    avgReviewTime: '2.7 min', adoptionScore: 64,
    topRepos: ['clerk-js', 'backend-api', 'auth-middleware'],
    lastActiveAt: '4 hours ago',
    weeklyPrTrend: generateWeeklyTrend(85, 20, 'down'),
  },
};
