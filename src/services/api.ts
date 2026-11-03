import type {
  ProfileData,
  Project,
  Ticket,
  TicketStatus,
  Commit,
  ArchitectureDoc,
  TestResult,
} from '../types/index.ts';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export async function fetchProfile(): Promise<ProfileData> {
  const res = await fetch(`${API_BASE}/api/profile`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  const json = await res.json();
  return json.data;
}

export async function fetchProjects(category?: string, search?: string): Promise<Project[]> {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.set('category', category);
  if (search) params.set('search', search);

  const url = `${API_BASE}/api/projects${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch projects');
  const json = await res.json();
  return json.data;
}

export async function fetchProject(id: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/api/projects/${id}`);
  if (!res.ok) throw new Error('Failed to fetch project details');
  const json = await res.json();
  return json.data;
}

export async function fetchTickets(): Promise<Ticket[]> {
  const res = await fetch(`${API_BASE}/api/tickets`);
  if (!res.ok) throw new Error('Failed to fetch tickets');
  const json = await res.json();
  return json.data;
}

export async function createTicket(payload: {
  title: string;
  description: string;
  type: string;
  priority: string;
  tags?: string[];
  estimatedHours?: number;
}): Promise<Ticket> {
  const res = await fetch(`${API_BASE}/api/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create ticket');
  const json = await res.json();
  return json.data;
}

export async function updateTicketStatus(id: string, status: TicketStatus): Promise<Ticket> {
  const res = await fetch(`${API_BASE}/api/tickets/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update ticket status');
  const json = await res.json();
  return json.data;
}

export async function fetchCommits(): Promise<Commit[]> {
  const res = await fetch(`${API_BASE}/api/commits`);
  if (!res.ok) throw new Error('Failed to fetch commits');
  const json = await res.json();
  return json.data;
}

export async function fetchDocs(): Promise<ArchitectureDoc[]> {
  const res = await fetch(`${API_BASE}/api/docs`);
  if (!res.ok) throw new Error('Failed to fetch architecture documents');
  const json = await res.json();
  return json.data;
}

export async function submitContact(payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ message: string; id: string }> {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to submit contact');
  return { message: json.message, id: json.data?.id };
}

export async function runServerTests(): Promise<{
  totalDurationMs: number;
  totalPassed: number;
  totalFailed: number;
  data: TestResult[];
}> {
  const res = await fetch(`${API_BASE}/api/tests/run`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to execute test suite');
  const json = await res.json();
  return json;
}

export async function checkServerHealth(): Promise<{
  status: string;
  uptimeSeconds: number;
  engine: string;
}> {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error('Failed to check server health');
  return res.json();
}
