import { createClient } from "@/lib/supabase/server";
import { FileText, MessageSquare, Users } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: storyCount },
    { count: commentCount },
    { count: subscriberCount }
  ] = await Promise.all([
    supabase.from("stories").select("*", { count: "exact", head: true }),
    supabase.from("comments").select("*", { count: "exact", head: true }).eq('status', 'pending'),
    supabase.from("subscribers").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Total Stories", value: storyCount || 0, icon: FileText },
    { label: "Pending Comments", value: commentCount || 0, icon: MessageSquare, alert: (commentCount || 0) > 0 },
    { label: "Subscribers", value: subscriberCount || 0, icon: Users },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl text-ink mb-2">Dashboard</h1>
      <p className="text-ink-soft font-body mb-10">Welcome back. Here is a quick overview of your reading room.</p>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-paper-card border border-border p-6 rounded-md">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-md ${stat.alert ? 'bg-marigold text-ink' : 'bg-indigo/10 text-indigo'}`}>
                <stat.icon size={20} />
              </div>
              <h3 className="font-ui text-[12px] uppercase tracking-widest text-ink-muted">
                {stat.label}
              </h3>
            </div>
            <p className="font-display text-5xl text-ink">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
