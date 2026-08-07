"use client";

import { useState, useTransition } from "react";
import { saveJourneyItem, deleteListItem, reorderList, saveAchievement } from "../actions";
import { ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";

export default function AboutClient({
  initialJourney,
  initialAchievements,
}: {
  initialJourney: any[];
  initialAchievements: any[];
}) {
  const [isPending, startTransition] = useTransition();

  // Journey
  const [journey, setJourney] = useState<any[]>(initialJourney);
  const [editingJourney, setEditingJourney] = useState<any | null>(null);

  // Achievements
  const [achievements, setAchievements] = useState<any[]>(initialAchievements);
  const [editingAchievement, setEditingAchievement] = useState<any | null>(null);

  // Reorder generic
  const moveItem = async (list: any[], setList: any, index: number, direction: 'up' | 'down', table: string) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === list.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newList = [...list];
    const temp = newList[index];
    newList[index] = newList[newIndex];
    newList[newIndex] = temp;

    const updated = newList.map((item, i) => ({ ...item, sort_order: i }));
    setList(updated);

    startTransition(() => {
      reorderList(table, updated).catch(e => alert("Reorder failed: " + e.message));
    });
  };

  // Journey CRUD
  const handleSaveJourney = () => {
    if (!editingJourney) return;
    startTransition(() => {
      saveJourneyItem(editingJourney).then(() => {
        setEditingJourney(null);
        window.location.reload(); 
      }).catch(e => alert(e.message));
    });
  };

  const handleDeleteJourney = (id: string) => {
    if (!confirm("Are you sure?")) return;
    startTransition(() => {
      deleteListItem('journey_items', id).then(() => {
        setJourney(journey.filter(j => j.id !== id));
      }).catch(e => alert(e.message));
    });
  };

  // Achievements CRUD
  const handleSaveAchievement = () => {
    if (!editingAchievement) return;
    startTransition(() => {
      saveAchievement(editingAchievement).then(() => {
        setEditingAchievement(null);
        window.location.reload(); 
      }).catch(e => alert(e.message));
    });
  };

  const handleDeleteAchievement = (id: string) => {
    if (!confirm("Are you sure?")) return;
    startTransition(() => {
      deleteListItem('achievements', id).then(() => {
        setAchievements(achievements.filter(a => a.id !== id));
      }).catch(e => alert(e.message));
    });
  };


  return (
    <div className="max-w-4xl space-y-16 pb-20">
      <div>
        <h1 className="font-display text-4xl text-ink mb-2">About Page Content</h1>
        <p className="text-ink-soft font-body">Manage the timeline and achievements list.</p>
        <p className="text-xs text-ink-muted mt-2">(Note: The Author Profile is managed in Settings).</p>
      </div>

      {/* Journey List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-ink">Journey Timeline</h2>
          <button
            onClick={() => setEditingJourney({ year: "", title: "", body: "", sort_order: journey.length })}
            className="flex items-center gap-2 bg-paper border border-border text-ink px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-paper-card transition-colors"
          >
            <Plus size={14} /> Add Milestone
          </button>
        </div>

        {editingJourney && (
          <div className="bg-paper-card border border-border p-6 mb-6">
            <h3 className="font-ui text-[13px] tracking-widest uppercase text-ink mb-4">{editingJourney.id ? "Edit Milestone" : "New Milestone"}</h3>
            <div className="grid md:grid-cols-[100px_1fr] gap-4 mb-4">
              <div>
                <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Year</label>
                <input type="text" value={editingJourney.year} onChange={e => setEditingJourney({...editingJourney, year: e.target.value})} className="w-full bg-paper border border-border p-2 text-sm" />
              </div>
              <div>
                <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Title</label>
                <input type="text" value={editingJourney.title} onChange={e => setEditingJourney({...editingJourney, title: e.target.value})} className="w-full bg-paper border border-border p-2 text-sm" />
              </div>
              <div className="col-span-full">
                <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Description</label>
                <textarea rows={3} value={editingJourney.body} onChange={e => setEditingJourney({...editingJourney, body: e.target.value})} className="w-full bg-paper border border-border p-2 text-sm" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveJourney} disabled={isPending} className="bg-indigo text-paper px-4 py-2 text-[11px] font-ui uppercase">Save</button>
              <button onClick={() => setEditingJourney(null)} className="border border-border px-4 py-2 text-[11px] font-ui uppercase">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {journey.map((item, i) => (
            <div key={item.id} className="flex items-start gap-4 bg-paper border border-border p-4">
              <div className="flex flex-col gap-1 mt-1">
                <button onClick={() => moveItem(journey, setJourney, i, 'up', 'journey_items')} className="text-ink-muted hover:text-indigo disabled:opacity-30" disabled={i === 0 || isPending}><ArrowUp size={16} /></button>
                <button onClick={() => moveItem(journey, setJourney, i, 'down', 'journey_items')} className="text-ink-muted hover:text-indigo disabled:opacity-30" disabled={i === journey.length - 1 || isPending}><ArrowDown size={16} /></button>
              </div>
              <div className="flex-1">
                <p className="font-display text-lg text-ink">{item.year} - {item.title}</p>
                <p className="text-sm text-ink-soft font-body mt-1">{item.body}</p>
              </div>
              <button onClick={() => setEditingJourney(item)} className="text-sm font-ui text-indigo hover:underline">Edit</button>
              <button onClick={() => handleDeleteJourney(item.id)} disabled={isPending} className="text-red-500 hover:text-red-700 ml-2"><Trash2 size={16} /></button>
            </div>
          ))}
          {journey.length === 0 && <p className="text-ink-muted text-sm italic">No timeline items added.</p>}
        </div>
      </section>

      {/* Achievements List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-ink">Achievements</h2>
          <button
            onClick={() => setEditingAchievement({ text: "", sort_order: achievements.length })}
            className="flex items-center gap-2 bg-paper border border-border text-ink px-4 py-2 text-[11px] font-ui tracking-widest uppercase hover:bg-paper-card transition-colors"
          >
            <Plus size={14} /> Add Achievement
          </button>
        </div>

        {editingAchievement && (
          <div className="bg-paper-card border border-border p-6 mb-6">
            <h3 className="font-ui text-[13px] tracking-widest uppercase text-ink mb-4">{editingAchievement.id ? "Edit Achievement" : "New Achievement"}</h3>
            <div className="mb-4">
              <label className="block font-ui text-[11px] tracking-widest uppercase text-ink-muted mb-2">Achievement Text</label>
              <input type="text" value={editingAchievement.text} onChange={e => setEditingAchievement({...editingAchievement, text: e.target.value})} className="w-full bg-paper border border-border p-2 text-sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveAchievement} disabled={isPending} className="bg-indigo text-paper px-4 py-2 text-[11px] font-ui uppercase">Save</button>
              <button onClick={() => setEditingAchievement(null)} className="border border-border px-4 py-2 text-[11px] font-ui uppercase">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {achievements.map((item, i) => (
            <div key={item.id} className="flex items-center gap-4 bg-paper border border-border p-4">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveItem(achievements, setAchievements, i, 'up', 'achievements')} className="text-ink-muted hover:text-indigo disabled:opacity-30" disabled={i === 0 || isPending}><ArrowUp size={16} /></button>
                <button onClick={() => moveItem(achievements, setAchievements, i, 'down', 'achievements')} className="text-ink-muted hover:text-indigo disabled:opacity-30" disabled={i === achievements.length - 1 || isPending}><ArrowDown size={16} /></button>
              </div>
              <div className="flex-1">
                <p className="font-body text-sm">{item.text}</p>
              </div>
              <button onClick={() => setEditingAchievement(item)} className="text-sm font-ui text-indigo hover:underline">Edit</button>
              <button onClick={() => handleDeleteAchievement(item.id)} disabled={isPending} className="text-red-500 hover:text-red-700 ml-2"><Trash2 size={16} /></button>
            </div>
          ))}
          {achievements.length === 0 && <p className="text-ink-muted text-sm italic">No achievements added.</p>}
        </div>
      </section>

    </div>
  );
}
