"use client";

import { useState, useTransition } from "react";
import { markContactMessageRead, markContactMessageReplied, deleteContactMessage, deleteSubscriber } from "../actions";
import { Mail, Users, Check, Trash2, Reply, Copy, CheckCheck } from "lucide-react";

export default function InboxClient({ messages, subscribers }: { messages: any[], subscribers: any[] }) {
  const [activeTab, setActiveTab] = useState<"messages" | "subscribers">("messages");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleMarkRead = (id: string) => {
    startTransition(async () => {
      try {
        await markContactMessageRead(id);
      } catch (e: any) {
        console.error("Error marking read:", e);
      }
    });
  };

  const handleMarkReplied = (id: string) => {
    startTransition(async () => {
      try {
        await markContactMessageReplied(id);
      } catch (e: any) {
        console.error("Error marking replied:", e);
      }
    });
  };

  const handleDeleteMessage = (id: string) => {
    if (!confirm("Delete this message?")) return;
    startTransition(async () => {
      try {
        await deleteContactMessage(id);
      } catch (e: any) {
        console.error("Error deleting message:", e);
      }
    });
  };

  const handleDeleteSubscriber = (email: string) => {
    if (!confirm(`Remove ${email} from subscribers?`)) return;
    startTransition(async () => {
      try {
        await deleteSubscriber(email);
      } catch (e: any) {
        console.error("Error deleting subscriber:", e);
      }
    });
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
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
            messages.map((m) => {
              const mailtoSubject = encodeURIComponent(`Re: Your message to Abhiram R (Writer Lokam)`);
              const mailtoBody = encodeURIComponent(`Hi ${m.name},\n\nThank you for reaching out via Writer Lokam!\n\n> ${m.message.replace(/\n/g, '\n> ')}\n\nBest regards,\nAbhiram R\nhttps://writerlokam.in`);
              const mailtoUrl = `mailto:${m.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

              return (
                <div key={m.id} className={`p-6 border ${m.status === 'unread' ? 'bg-indigo/5 border-indigo/20' : m.status === 'replied' ? 'bg-paper-card border-border opacity-90' : 'bg-paper border-border'}`}>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-display text-xl text-ink">{m.name}</h3>
                        <span className={`text-[10px] font-ui tracking-wider uppercase px-2 py-0.5 border ${
                          m.status === 'unread' 
                            ? 'bg-amber-100 text-amber-800 border-amber-300' 
                            : m.status === 'replied'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-border/40 text-ink-muted border-border'
                        }`}>
                          {m.status || 'read'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={mailtoUrl} className="text-[13px] text-indigo hover:underline font-body font-medium">{m.email}</a>
                        <button 
                          onClick={() => handleCopyEmail(m.email)} 
                          className="text-ink-muted hover:text-ink p-1"
                          title="Copy Email Address"
                        >
                          {copiedEmail === m.email ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        </button>
                      </div>
                      <p className="text-[11px] text-ink-muted uppercase font-ui mt-1 tracking-wider">
                        {new Date(m.created_at).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {m.status === 'unread' && (
                        <button 
                          onClick={() => handleMarkRead(m.id)}
                          disabled={isPending}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-ui uppercase tracking-wider text-ink-soft bg-paper border border-border hover:border-indigo hover:text-indigo transition-colors"
                          title="Mark as Read"
                        >
                          <Check size={14} /> Mark Read
                        </button>
                      )}
                      {m.status !== 'replied' && (
                        <button 
                          onClick={() => handleMarkReplied(m.id)}
                          disabled={isPending}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-ui uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                          title="Mark as Replied"
                        >
                          <CheckCheck size={14} /> Mark Replied
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

                  <p className="text-[15px] font-body text-ink-soft whitespace-pre-wrap leading-relaxed bg-paper p-4 border border-border/60 my-4">
                    {m.message}
                  </p>

                  <div className="pt-2">
                    <a
                      href={mailtoUrl}
                      className="inline-flex items-center gap-2 bg-indigo text-paper text-[11px] font-ui tracking-widest uppercase px-5 py-2.5 hover:bg-ink transition-colors"
                    >
                      <Reply size={14} /> Reply to {m.name} via Email
                    </a>
                  </div>
                </div>
              );
            })
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
