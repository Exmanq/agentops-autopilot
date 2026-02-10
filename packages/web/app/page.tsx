'use client';

import { useEffect, useState } from 'react';

const demoEvents = [
  { ts: '10:00', label: 'Plan generated', detail: '3 steps derived from goal' },
  { ts: '10:01', label: 'safe-shell', detail: 'echo "Running lint and smoke tests"' },
  { ts: '10:02', label: 'Validation', detail: 'All steps succeeded' }
];

export default function Home() {
  const [apiBase] = useState<string>(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001');
  const [health, setHealth] = useState<string>('checking...');

  useEffect(() => {
    fetch(`${apiBase}/health`).then(async (res) => {
      try {
        const json = await res.json();
        setHealth(json.status === 'ok' ? 'API ready' : 'API unreachable');
      } catch {
        setHealth('API unreachable');
      }
    });
  }, [apiBase]);

  return (
    <main style={{ fontFamily: 'Inter, sans-serif', padding: '32px', maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>AgentOps Autopilot</h1>
      <p style={{ marginBottom: 16 }}>Autonomous pipeline runner with transparent task timelines.</p>
      <div style={{ marginBottom: 16, padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <strong>Status:</strong> {health}
      </div>
      <h2 style={{ fontSize: '1.25rem', marginBottom: 8 }}>Demo Timeline</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {demoEvents.map((event) => (
          <li key={event.ts} style={{ padding: '12px 8px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontWeight: 600 }}>{event.ts} — {event.label}</div>
            <div style={{ color: '#475569' }}>{event.detail}</div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 24, background: '#0f172a', color: '#e2e8f0', padding: 16, borderRadius: 8 }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`curl -H "Authorization: Bearer <AUTH_TOKEN>" \\
  -X POST ${apiBase}/tasks \\
  -H 'Content-Type: application/json' \\
  -d '{"goal":"fix lint errors","repo":"demo/repo"}'`}
        </pre>
      </div>
    </main>
  );
}
