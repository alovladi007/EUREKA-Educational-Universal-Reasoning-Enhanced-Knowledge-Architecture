'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AXIOM_API_URL,
  createTutoringSession,
  getToken,
  getTutoringSession,
  type TutoringSession,
} from '@/lib/api';
import { AppShell } from '@/components/AppShell';
import { SignInScreen } from '@/components/PageShell';
import { RichMath } from '@/components/Math';

// Live tutoring: a shared whiteboard, chat, and pushed items over a WebSocket.
// The tutor opens a room and shares the join code; a student joins with it. Pen
// strokes, chat, and pushed prompts are relayed to the other peer in real time.
//
// Video and audio are intentionally not here: they need a real-time media server
// (a WebRTC SFU such as LiveKit or mediasoup), which is out of scope. The
// signaling/data channel is real; the media plane is not.

type Phase = 'checking' | 'signed-out' | 'lobby' | 'live';

interface ChatLine {
  from: string;
  text: string;
}

const COLORS = ['#111827', '#dc2626', '#2563eb', '#16a34a'];

function wsUrl(sessionId: string, token: string): string {
  const base = AXIOM_API_URL.replace(/^http/, 'ws');
  return `${base}/api/v1/tutoring/ws/${sessionId}?token=${encodeURIComponent(token)}`;
}

export default function TutorPage() {
  const [phase, setPhase] = useState<Phase>('checking');
  const [session, setSession] = useState<TutoringSession | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [title, setTitle] = useState('Tutoring session');
  const [error, setError] = useState('');

  const [peers, setPeers] = useState(0);
  const [chat, setChat] = useState<ChatLine[]>([]);
  const [draft, setDraft] = useState('');
  const [pushed, setPushed] = useState('');
  const [pushDraft, setPushDraft] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  const wsRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setPhase(getToken() ? 'lobby' : 'signed-out');
  }, []);

  function drawSegment(x0: number, y0: number, x1: number, y1: number, stroke: string) {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function connect(s: TutoringSession) {
    const token = getToken();
    if (!token) {
      return;
    }
    const ws = new WebSocket(wsUrl(s.id, token));
    wsRef.current = ws;
    ws.onmessage = (event) => {
      let msg: Record<string, unknown>;
      try {
        msg = JSON.parse(event.data as string);
      } catch {
        return;
      }
      switch (msg.type) {
        case 'presence':
          setPeers(Number(msg.count) || 0);
          break;
        case 'draw':
          drawSegment(
            Number(msg.x0),
            Number(msg.y0),
            Number(msg.x1),
            Number(msg.y1),
            String(msg.color || '#111827'),
          );
          break;
        case 'clear':
          clearCanvas();
          break;
        case 'chat':
          setChat((prev) => [...prev, { from: String(msg.from), text: String(msg.text) }]);
          break;
        case 'push_item':
          setPushed(String(msg.prompt));
          break;
      }
    };
    setSession(s);
    setPhase('live');
  }

  function send(payload: Record<string, unknown>) {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  }

  async function openSession() {
    setError('');
    try {
      const s = await createTutoringSession(title);
      connect(s);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open a session.');
    }
  }

  async function join() {
    setError('');
    try {
      const s = await getTutoringSession(joinCode.trim());
      connect(s);
    } catch {
      setError('No open session with that code.');
    }
  }

  function leave() {
    wsRef.current?.close();
    wsRef.current = null;
    setSession(null);
    setChat([]);
    setPushed('');
    setPeers(0);
    setPhase('lobby');
  }

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  // Pointer drawing on the canvas: draw locally and relay each segment.
  function pointerPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true;
    last.current = pointerPos(e);
  }
  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || !last.current) {
      return;
    }
    const p = pointerPos(e);
    drawSegment(last.current.x, last.current.y, p.x, p.y, color);
    send({ type: 'draw', x0: last.current.x, y0: last.current.y, x1: p.x, y1: p.y, color });
    last.current = p;
  }
  function onUp() {
    drawing.current = false;
    last.current = null;
  }

  function sendChat() {
    const text = draft.trim();
    if (!text) {
      return;
    }
    setChat((prev) => [...prev, { from: 'you', text }]);
    send({ type: 'chat', text });
    setDraft('');
  }

  function pushItem() {
    const prompt = pushDraft.trim();
    if (!prompt) {
      return;
    }
    setPushed(prompt);
    send({ type: 'push_item', prompt });
    setPushDraft('');
  }

  if (phase === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading tutoring.</p>
      </main>
    );
  }
  if (phase === 'signed-out') {
    return <SignInScreen />;
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-xl font-semibold text-foreground">Live tutoring</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A shared whiteboard, chat, and pushed problems in real time. Video and
          audio need a media server and are not enabled here.
        </p>

        {phase === 'lobby' && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-card-foreground">Open a session</h2>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Session title"
              />
              <button
                type="button"
                onClick={() => void openSession()}
                className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                Open and get a code
              </button>
            </section>
            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-card-foreground">Join a session</h2>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm uppercase text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="6-character code"
                maxLength={6}
              />
              <button
                type="button"
                onClick={() => void join()}
                disabled={joinCode.trim().length < 4}
                className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
              >
                Join
              </button>
            </section>
            {error && (
              <p className="sm:col-span-2 text-sm text-red-700 dark:text-red-300">{error}</p>
            )}
          </div>
        )}

        {phase === 'live' && session && (
          <div className="mt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">{session.title}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  code {session.join_code}
                </span>
                <span className="text-xs text-muted-foreground">
                  {peers} connected
                </span>
              </div>
              <button
                type="button"
                onClick={leave}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-card-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                Leave
              </button>
            </div>

            {pushed && (
              <div className="mb-3 rounded-lg border border-brand-200 bg-brand-50 p-3 dark:border-brand-900 dark:bg-brand-950">
                <p className="text-xs font-medium uppercase tracking-wide text-brand-700 dark:text-brand-300">
                  Pushed problem
                </p>
                <div className="mt-1 text-sm text-card-foreground">
                  <RichMath text={pushed} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_18rem]">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Pen color ${c}`}
                      onClick={() => setColor(c)}
                      className={`h-6 w-6 rounded-full border-2 ${
                        color === c ? 'border-foreground' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      clearCanvas();
                      send({ type: 'clear' });
                    }}
                    className="ml-auto rounded border border-border px-2 py-1 text-xs text-foreground hover:bg-muted"
                  >
                    Clear
                  </button>
                </div>
                <canvas
                  ref={canvasRef}
                  width={720}
                  height={440}
                  onPointerDown={onDown}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerLeave={onUp}
                  className="w-full touch-none rounded-lg border border-border bg-white"
                />
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={pushDraft}
                    onChange={(e) => setPushDraft(e.target.value)}
                    placeholder="Push a problem (supports $...$ math)"
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={pushItem}
                    className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    Push
                  </button>
                </div>
              </div>

              <div className="flex flex-col rounded-lg border border-border bg-card">
                <p className="border-b border-border px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Chat
                </p>
                <div className="flex-1 space-y-1.5 overflow-y-auto p-3" style={{ maxHeight: 360 }}>
                  {chat.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No messages yet.</p>
                  ) : (
                    chat.map((line, i) => (
                      <p key={i} className="text-sm text-card-foreground">
                        <span className="font-medium text-muted-foreground">
                          {line.from === 'you' ? 'You' : line.from.slice(0, 6)}:
                        </span>{' '}
                        {line.text}
                      </p>
                    ))
                  )}
                </div>
                <div className="flex gap-2 border-t border-border p-2">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        sendChat();
                      }
                    }}
                    placeholder="Message"
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={sendChat}
                    className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Note: video and audio are not enabled. They require a real-time
              media server (WebRTC SFU) that is outside this build.
            </p>
          </div>
        )}
      </main>
    </AppShell>
  );
}
