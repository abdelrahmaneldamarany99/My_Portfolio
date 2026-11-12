import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Ticket, TicketStatus, TicketPriority, TicketType, Language } from '../types/index.ts';
import { createTicket, updateTicketStatus } from '../services/api.ts';
import { translations } from '../data/translations.ts';

interface TicketsBoardProps {
  tickets: Ticket[];
  onRefresh: () => void;
  language?: Language;
}

export function TicketsBoard({ tickets, onRefresh, language = 'en' }: TicketsBoardProps) {
  const [localTickets, setLocalTickets] = useState<Ticket[]>(tickets);
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<TicketType>('feature');
  const [newPriority, setNewPriority] = useState<TicketPriority>('medium');
  const [newTags, setNewTags] = useState('Frontend, UI');

  const t = translations[language].tickets;

  const statusColumns: { id: TicketStatus; label: string }[] = [
    { id: 'todo', label: t.toDo },
    { id: 'in_progress', label: t.inProgress },
    { id: 'qa', label: t.qa },
    { id: 'done', label: t.completed },
  ];

  React.useEffect(() => {
    setLocalTickets(tickets);
  }, [tickets]);

  const handleStatusChange = async (ticketId: string, nextStatus: TicketStatus) => {
    const previous = [...localTickets];
    setLocalTickets((prev) =>
      prev.map((item) => (item._id === ticketId ? { ...item, status: nextStatus } : item))
    );

    try {
      await updateTicketStatus(ticketId, nextStatus);
    } catch {
      setLocalTickets(previous);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      setErrorMsg(language === 'ar' ? 'يرجى إدخال العنوان والوصف.' : 'Please provide a title and description.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const tagsArray = newTags.split(',').map((s) => s.trim()).filter(Boolean);
      const created = await createTicket({
        title: newTitle,
        description: newDesc,
        type: newType,
        priority: newPriority,
        tags: tagsArray,
      });
      setLocalTickets((prev) => [...prev, created]);
      setIsModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      onRefresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTickets = localTickets.filter((item) =>
    filterType === 'all' ? true : item.type === filterType
  );

  return (
    <div className="space-y-6 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold dark:text-white text-slate-900">{t.title}</h3>
          <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 dark:bg-slate-900 bg-slate-100 border dark:border-white/10 border-slate-200 rounded-lg p-1 text-xs font-mono max-w-full overflow-x-auto">
            {['all', 'feature', 'bug', 'perf', 'refactor'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded transition-colors uppercase whitespace-nowrap ${
                  filterType === type
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.newTicket}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusColumns.map((col) => {
          const colTickets = filteredTickets.filter((item) => item.status === col.id);
          return (
            <div
              key={col.id}
              className="dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 rounded-xl p-4 flex flex-col min-h-[450px] shadow-sm transition-colors"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b dark:border-white/10 border-slate-200">
                <span className="text-xs font-bold dark:text-slate-200 text-slate-800 uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="text-xs font-mono dark:text-slate-400 text-slate-600 dark:bg-slate-900 bg-slate-100 px-2 py-0.5 rounded border dark:border-white/5 border-slate-200">
                  {colTickets.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTickets.length === 0 ? (
                  <div className="h-28 flex items-center justify-center border border-dashed dark:border-white/10 border-slate-200 rounded-lg text-xs dark:text-slate-500 text-slate-400 text-center p-2">
                    {t.emptyLane}
                  </div>
                ) : (
                  colTickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className="dark:bg-slate-900/90 bg-slate-50 border dark:border-white/10 border-slate-200 hover:dark:border-blue-500/30 hover:border-blue-400 rounded-lg p-3.5 space-y-2.5 transition-colors shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono dark:text-slate-400 text-slate-500">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">{ticket.key}</span>
                        <span className="uppercase text-[10px] px-1.5 py-0.5 rounded dark:bg-slate-800 bg-white border dark:border-white/5 border-slate-200">
                          {ticket.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold dark:text-white text-slate-900 leading-snug">
                        {ticket.title}
                      </h4>

                      <p className="text-[11px] dark:text-slate-400 text-slate-600 leading-relaxed line-clamp-2">
                        {ticket.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {ticket.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] dark:text-slate-400 text-slate-600 dark:bg-slate-950 bg-white px-1.5 py-0.5 rounded border dark:border-white/5 border-slate-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t dark:border-white/5 border-slate-200 flex items-center justify-between text-[11px]">
                        <span className="dark:text-slate-500 text-slate-400 text-[10px] truncate max-w-[100px]">
                          {ticket.assignee}
                        </span>

                        <div className="flex items-center gap-1">
                          {col.id !== 'todo' && (
                            <button
                              onClick={() => {
                                const order: TicketStatus[] = ['todo', 'in_progress', 'qa', 'done'];
                                const currIdx = order.indexOf(ticket.status);
                                if (currIdx > 0) handleStatusChange(ticket._id, order[currIdx - 1]);
                              }}
                              className="px-1.5 py-0.5 text-[10px] dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900 dark:bg-slate-800 bg-white border dark:border-transparent border-slate-200 rounded"
                              title="Move back"
                            >
                              ‹
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button
                              onClick={() => {
                                const order: TicketStatus[] = ['todo', 'in_progress', 'qa', 'done'];
                                const currIdx = order.indexOf(ticket.status);
                                if (currIdx < order.length - 1) handleStatusChange(ticket._id, order[currIdx + 1]);
                              }}
                              className="px-1.5 py-0.5 text-[10px] text-blue-600 dark:text-blue-400 hover:text-white bg-blue-600/10 hover:bg-blue-600 rounded transition-colors"
                              title="Advance status"
                            >
                              ›
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="dark:bg-[#0D1424] bg-white border dark:border-white/15 border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative transition-colors">
            <div className="flex items-center justify-between pb-4 mb-4 border-b dark:border-white/10 border-slate-200">
              <h3 className="text-base font-bold dark:text-white text-slate-900">{t.createTitle}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 dark:text-slate-400 text-slate-500 hover:dark:text-white hover:text-slate-900 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-600 dark:text-red-400">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block dark:text-slate-300 text-slate-700 font-medium mb-1">
                  {t.ticketTitleLabel}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Implement WebSocket reconnection retry backoff"
                  className="w-full px-3 py-2 dark:bg-slate-900 bg-white border dark:border-white/10 border-slate-300 rounded-lg dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block dark:text-slate-300 text-slate-700 font-medium mb-1">
                  {t.descLabel}
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Technical requirements and acceptance criteria..."
                  className="w-full px-3 py-2 dark:bg-slate-900 bg-white border dark:border-white/10 border-slate-300 rounded-lg dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block dark:text-slate-300 text-slate-700 font-medium mb-1">
                    {t.typeLabel}
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as TicketType)}
                    className="w-full px-3 py-2 dark:bg-slate-900 bg-white border dark:border-white/10 border-slate-300 rounded-lg dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="feature">Feature</option>
                    <option value="bug">Bug</option>
                    <option value="perf">Performance</option>
                    <option value="refactor">Refactor</option>
                  </select>
                </div>

                <div>
                  <label className="block dark:text-slate-300 text-slate-700 font-medium mb-1">
                    {t.priorityLabel}
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TicketPriority)}
                    className="w-full px-3 py-2 dark:bg-slate-900 bg-white border dark:border-white/10 border-slate-300 rounded-lg dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block dark:text-slate-300 text-slate-700 font-medium mb-1">
                  {t.tagsLabel}
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. React 19, Architecture, Node.js"
                  className="w-full px-3 py-2 dark:bg-slate-900 bg-white border dark:border-white/10 border-slate-300 rounded-lg dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div className="pt-4 border-t dark:border-white/10 border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? t.creating : t.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
