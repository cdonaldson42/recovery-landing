import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface TaskPayload {
  id: string;
  name: string;
  group: string;
  notes?: string;
  lastCompleted?: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
  }

  const { tasks, email } = (await req.json()) as { tasks: TaskPayload[]; email: string };
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  // Tasks that haven't been completed in the last 90 days
  const now = Date.now();
  const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;
  const overdue = tasks.filter((t) => {
    if (!t.lastCompleted) return true;
    return now - new Date(t.lastCompleted).getTime() > NINETY_DAYS;
  });

  if (overdue.length === 0) {
    return NextResponse.json({ message: 'Nothing to remind about' });
  }

  const groups = [...new Set(overdue.map((t) => t.group))];

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 550px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #0f766e; font-size: 24px; margin-bottom: 4px;">Oompapa's Maintenance Reminder</h1>
      <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
        <strong>${overdue.length} task${overdue.length === 1 ? '' : 's'}</strong> need${overdue.length === 1 ? 's' : ''} attention
      </p>

      ${groups.map((group) => `
        <h3 style="color: #374151; font-size: 16px; margin: 16px 0 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">
          ${group}
        </h3>
        <ul style="font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
          ${overdue.filter((t) => t.group === group).map((t) =>
            `<li><strong>${t.name}</strong>${t.lastCompleted ? ` — last done ${new Date(t.lastCompleted).toLocaleDateString()}` : ' — never done'}</li>`
          ).join('')}
        </ul>
      `).join('')}

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        Nice job keeping up with things, Oompapa!
      </p>
    </div>
  `;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: 'Home Maintenance <onboarding@resend.dev>',
    to: email,
    subject: `${overdue.length} maintenance task${overdue.length === 1 ? '' : 's'} need${overdue.length === 1 ? 's' : ''} attention`,
    html,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
