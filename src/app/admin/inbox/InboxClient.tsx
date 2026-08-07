"use client";

import { useState, useTransition } from "react";
import { markContactMessageRead, deleteContactMessage, deleteSubscriber } from "../actions";
import { Mail, Users, Check, Trash2 } from "lucide-react";

export default function InboxClient({ messages, subscribers }: { messages: any[], subscribers: any[] }) {
  const [activeTab, setActiveTab] = useState<"messages" | "subscribers">("messages");
  const [isPending, startTransition] = useTransition();

  const handleMarkRead = (id: string) => {
    startTransition(() => {
      markContactMessageRead(id).catch(e => alert(e.message));
    });
  };

  const handleDeleteMessage = (id: string) => {
    if (!confirm("Delete this message?")) return;
    startTransition(() => {
      deleteContactMessage(id).catch(e => alert(e.message));
    });
  };

  const handleDeleteSubscriber = (email: string) => {
    if (!confirm(`Remove ${email} from subscribers?`)) return;
    startTransition(() => {
      deleteSubscriber(email).catch(e => alert(e.message));
    });
  };

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      <div>
        <h1 className="font-display text-4xl text-ink mb-2">Inbox</h1>
        <p className="text-ink-soft font-body">Manage contact messages and newsletter subscribers.</p>
      </div>

      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab("messages")}
          className={`pb-4 px-2 font-ui text-[13px] tracking-widest uppercase transition-colors flex items-center gap-2 ${
            activeTab === "messages"
              ? "text-indigo border-b-2 border-indigo"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          <Mail size={16} /> Messages ({messages.filter(m => m.status === 'unread').length} unread)
        </button>
        <button
          onClick={() => setActiveTab("subscribers")}
          className={`pb-4 px-2 font-ui text-[13px] tracking-widest uppercase transition-colors flex items-center gap-2 ${
            activeTab === "subscribers"
              ? "text-indigo border-b-2 border-indigo"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          <Users size={16} /> Subscribers ({subscribers.length})
        </button>
      </div>

      {activeTab === "messages" && (
        <section className="space-y-6">
          {messages.length === 0 ? (
            <div className="bg-paper border border-border p-8 text-center text-ink-muted font-body">
              No messages yet.
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`p-6 border ${m.status === 'unread' ? 'bg-indigo/5 border-indigo/20' : 'bg-paper border-border'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-display text-xl text-ink">{m.name}</h3>
                    <a href={`mailto:${m.email}`} className="text-[13px] text-indigo hover:underline font-body">{m.email}</a>
                    <p className="text-[11px] text-ink-muted uppercase font-ui mt-1 tracking-wider">
                      {new Date(m.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {m.status === 'unread' && (
                      <button 
                        onClick={() => handleMarkRead(m.id)}
                        disabled={isPending}
                        className="p-2 text-ink-muted hover:text-indigo transition-colors"
                        title="Mark as Read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteMessage(m.id)}
                      disabled={isPending}
                      className="p-2 text-ink-muted hover:text-rust transition-colors"
                      title="Delete Message"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-[15px] font-body text-ink-soft whitespace-pre-wrap leading-relaxed">
                  {m.message}
                </p>
              </div>
            ))
          )}
        </section>
      )}

      {activeTab === "subscribers" && (
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-2xl text-ink">Mailing List</h2>
            <a 
              href={`mailto:?bcc=${subscribers.map(s => s.email).join(',')}`}
              className="flex items-center gap-2 bg-indigo text-paper px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-ink transition-colors"
            >
              <Mail size={14} /> Email all subscribers (BCC)
            </a>
          </div>
          <div className="bg-paper border border-border">
          {subscribers.length === 0 ? (
            <div className="p-8 text-center text-ink-muted font-body">
              No subscribers yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {subscribers.map((s) => (
                <div key={s.email} className="flex justify-between items-center p-5">
                  <div>
                    <p className="text-[15px] text-ink font-body">{s.email}</p>
                    <p className="text-[11px] text-ink-muted uppercase font-ui mt-1 tracking-wider">
                      Subscribed: {new Date(s.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDeleteSubscriber(s.email)}
                    disabled={isPending}
                    className="p-2 text-ink-muted hover:text-rust transition-colors"
                    title="Remove Subscriber"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          </div>
        </section>
      )}
    </div>
  );
}
