import { describe, expect, it } from 'vitest';
import {
  Collection,
  generateObjectId,
  db,
  initialProfile,
} from './mongo.ts';
import type { Ticket } from '../../src/types/index.ts';

describe('generateObjectId', () => {
  it('produces 24-char hex strings', () => {
    const id = generateObjectId();
    expect(id).toMatch(/^[a-f0-9]{24}$/);
  });

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 200 }, () => generateObjectId()));
    expect(ids.size).toBe(200);
  });
});

describe('Collection', () => {
  const makeTicket = (key: string): Omit<Ticket, '_id'> => ({
    key,
    title: `Ticket ${key}`,
    description: 'desc',
    type: 'feature',
    priority: 'medium',
    status: 'todo',
    assignee: 'Abdelrahman Eldamarany',
    estimatedHours: 4,
    tags: ['Full-Stack'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  });

  it('inserts and retrieves documents', () => {
    const col = new Collection<Ticket>();
    const inserted = col.insertOne(makeTicket('ENG-1'));
    expect(inserted._id).toMatch(/^[a-f0-9]{24}$/);
    expect(col.findById(inserted._id)?.key).toBe('ENG-1');
  });

  it('updates documents without mutating the stored _id', () => {
    const col = new Collection<Ticket>([{ _id: generateObjectId(), ...makeTicket('ENG-2') }]);
    const existing = col.findOne((t) => t.key === 'ENG-2')!;
    const updated = col.updateOne(existing._id, { status: 'done' });
    expect(updated?.status).toBe('done');
    expect(updated?._id).toBe(existing._id);
  });

  it('filters and counts documents', () => {
    const col = new Collection<Ticket>();
    col.insertMany([makeTicket('ENG-3'), makeTicket('ENG-4')]);
    expect(col.countDocuments()).toBe(2);
    expect(col.countDocuments((t) => t.priority === 'urgent')).toBe(0);
  });

  it('deletes documents', () => {
    const col = new Collection<Ticket>();
    const doc = col.insertOne(makeTicket('ENG-5'));
    expect(col.deleteOne(doc._id)).toBe(true);
    expect(col.findById(doc._id)).toBeNull();
  });
});

describe('seeded database', () => {
  it('ships a complete profile', () => {
    expect(initialProfile.name).toBeTruthy();
    expect(initialProfile.email).toContain('@');
    expect(initialProfile.github.length).toBeGreaterThan(0);
  });

  it('seeds projects, tickets, commits and docs', () => {
    expect(db.projects.countDocuments()).toBeGreaterThanOrEqual(8);
    expect(db.tickets.countDocuments()).toBeGreaterThan(0);
    expect(db.commits.countDocuments()).toBeGreaterThan(0);
    expect(db.docs.countDocuments()).toBeGreaterThan(0);
  });

  it('keeps ticket statuses within the valid enum', () => {
    const valid = ['todo', 'in_progress', 'qa', 'done'];
    for (const ticket of db.tickets.find()) {
      expect(valid).toContain(ticket.status);
    }
  });

  it('stores 40-char SHA-1 commit hashes', () => {
    for (const commit of db.commits.find()) {
      expect(commit.hash).toMatch(/^[a-f0-9]{40}$/);
    }
  });
});
