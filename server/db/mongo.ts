import crypto from 'node:crypto';
import {
  initialProfile,
  initialProjects,
  initialTickets,
  initialCommits,
  initialDocs,
} from '../../shared/seed.ts';
import type {
  Project,
  Ticket,
  Commit,
  ArchitectureDoc,
} from '../../src/types/index.ts';

export {
  initialProfile,
  initialProjects,
  initialTickets,
  initialCommits,
  initialDocs,
};

export function generateObjectId(): string {
  return crypto.randomBytes(12).toString('hex');
}

export class Collection<T extends { _id: string }> {
  private documents: Map<string, T> = new Map();

  constructor(initialData: T[] = []) {
    for (const doc of initialData) {
      this.documents.set(doc._id, { ...doc });
    }
  }

  find(predicate?: (item: T) => boolean): T[] {
    const all = Array.from(this.documents.values());
    if (!predicate) return all;
    return all.filter(predicate);
  }

  findOne(predicate: (item: T) => boolean): T | null {
    for (const doc of this.documents.values()) {
      if (predicate(doc)) return { ...doc };
    }
    return null;
  }

  findById(id: string): T | null {
    const doc = this.documents.get(id);
    return doc ? { ...doc } : null;
  }

  insertOne(data: Omit<T, '_id'> & { _id?: string }): T {
    const _id = data._id || generateObjectId();
    const doc = { ...data, _id } as T;
    this.documents.set(_id, doc);
    return { ...doc };
  }

  insertMany(items: Array<Omit<T, '_id'> & { _id?: string }>): T[] {
    return items.map((item) => this.insertOne(item));
  }

  updateOne(id: string, partial: Partial<T>): T | null {
    const existing = this.documents.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...partial, _id: existing._id };
    this.documents.set(id, updated);
    return { ...updated };
  }

  deleteOne(id: string): boolean {
    return this.documents.delete(id);
  }

  countDocuments(predicate?: (item: T) => boolean): number {
    return this.find(predicate).length;
  }
}

export class Database {
  projects: Collection<Project>;
  tickets: Collection<Ticket>;
  commits: Collection<Commit>;
  docs: Collection<ArchitectureDoc>;
  contacts: Collection<{
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
  }>;

  constructor() {
    this.projects = new Collection<Project>(initialProjects);
    this.tickets = new Collection<Ticket>(initialTickets);
    this.commits = new Collection<Commit>(initialCommits);
    this.docs = new Collection<ArchitectureDoc>(initialDocs);
    this.contacts = new Collection<{
      _id: string;
      name: string;
      email: string;
      subject: string;
      message: string;
      createdAt: string;
    }>([]);
  }
}

export const db = new Database();
