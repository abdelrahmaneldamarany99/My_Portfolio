import type {
  ProfileData,
  Project,
  Ticket,
  TicketStatus,
  Commit,
  ArchitectureDoc,
  TestResult,
} from '../types/index.ts';
import {
  initialProfile as seedProfile,
  initialProjects as seedProjects,
  initialTickets as seedTickets,
  initialCommits as seedCommits,
  initialDocs as seedDocs,
} from '../../shared/seed.ts';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

function filterProjects(projects: Project[], category?: string, search?: string): Project[] {
  let results = projects;
  if (category && category !== 'all') {
    results = results.filter((p) => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q))
    );
  }
  return results;
}

export async function fetchProfile(): Promise<ProfileData> {
  try {
    const res = await fetch(`${API_BASE}/api/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    const json = await res.json();
    return json.data;
  } catch {
    return seedProfile;
  }
}

export async function fetchProjects(category?: string, search?: string): Promise<Project[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (search) params.set('search', search);

    const url = `${API_BASE}/api/projects${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch projects');
    const json = await res.json();
    return json.data;
  } catch {
    return filterProjects(seedProjects, category, search);
  }
}

export async function fetchProject(id: string): Promise<Project> {
  try {
    const res = await fetch(`${API_BASE}/api/projects/${id}`);
    if (!res.ok) throw new Error('Failed to fetch project details');
    const json = await res.json();
    return json.data;
  } catch {
    const project = seedProjects.find((p) => p._id === id || p.slug === id);
    if (!project) throw new Error('Project not found');
    return project;
  }
}

export async function fetchTickets(): Promise<Ticket[]> {
  try {
    const res = await fetch(`${API_BASE}/api/tickets`);
    if (!res.ok) throw new Error('Failed to fetch tickets');
    const json = await res.json();
    return json.data;
  } catch {
    return seedTickets.map((t) => ({ ...t }));
  }
}

export async function fetchCommits(): Promise<Commit[]> {
  try {
    const res = await fetch(`${API_BASE}/api/commits`);
    if (!res.ok) throw new Error('Failed to fetch commits');
    const json = await res.json();
    return json.data;
  } catch {
    return seedCommits;
  }
}

export async function fetchDocs(): Promise<ArchitectureDoc[]> {
  try {
    const res = await fetch(`${API_BASE}/api/docs`);
    if (!res.ok) throw new Error('Failed to fetch architecture documents');
    const json = await res.json();
    return json.data;
  } catch {
    return seedDocs;
  }
}

export async function createTicket(payload: {
  title: string;
  description: string;
  type: string;
  priority: string;
  tags?: string[];
  estimatedHours?: number;
}): Promise<Ticket> {
  try {
    const res = await fetch(`${API_BASE}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create ticket');
    const json = await res.json();
    return json.data;
  } catch {
    const now = new Date().toISOString();
    return {
      _id: `local-${Date.now()}`,
      key: `ENG-${300 + seedTickets.length + Math.floor(Math.random() * 100)}`,
      title: payload.title,
      description: payload.description,
      type: (payload.type as Ticket['type']) || 'feature',
      priority: (payload.priority as Ticket['priority']) || 'medium',
      status: 'todo',
      assignee: 'Abdelrahman Eldamarany',
      estimatedHours: payload.estimatedHours || 4,
      tags: payload.tags || ['Full-Stack'],
      createdAt: now,
      updatedAt: now,
    };
  }
}

export async function updateTicketStatus(id: string, status: TicketStatus): Promise<Ticket> {
  try {
    const res = await fetch(`${API_BASE}/api/tickets/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update ticket status');
    const json = await res.json();
    return json.data;
  } catch {
    const seed = seedTickets.find((t) => t._id === id);
    if (seed) return { ...seed, status, updatedAt: new Date().toISOString() };
    return {
      _id: id,
      key: id,
      title: 'Ticket',
      description: '',
      type: 'feature',
      priority: 'medium',
      status,
      assignee: 'Abdelrahman Eldamarany',
      estimatedHours: 0,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function submitContact(payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<{ message: string; id: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit contact');
    return { message: json.message, id: json.data?.id };
  } catch {
    const subject = payload.subject ? `?subject=${encodeURIComponent(payload.subject)}` : '';
    const body = encodeURIComponent(`${payload.message}\n\n— ${payload.name} (${payload.email})`);
    window.location.href = `mailto:${seedProfile.email}${subject}&body=${body}`;
    return {
      message: 'Your email client has been opened with your message pre-filled.',
      id: `local-${Date.now()}`,
    };
  }
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
