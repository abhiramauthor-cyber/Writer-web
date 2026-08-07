import Link from "next/link";
import { LogOut, Home, FileText, Settings, MessageSquare, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex bg-paper-card">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-paper flex flex-col">
        <div className="p-6">
          <Link href="/admin" className="font-display text-xl text-ink">
            Writer <span className="italic text-marigold">Admin</span>
          </Link>
          <p className="text-[11px] font-ui tracking-wider text-ink-muted mt-1 uppercase">
            {user?.email}
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 font-ui text-[13px] tracking-widest uppercase">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-3 text-ink hover:bg-indigo hover:text-paper rounded-md transition-colors">
            <LayoutDashboard size={16} /> Overview
          </Link>
          <Link href="/admin/stories" className="flex items-center gap-3 px-3 py-3 text-ink hover:bg-indigo hover:text-paper rounded-md transition-colors">
            <FileText size={16} /> Stories
          </Link>
          <Link href="/admin/pages" className="flex items-center gap-3 px-3 py-3 text-ink hover:bg-indigo hover:text-paper rounded-md transition-colors">
            <LayoutDashboard size={16} /> Pages
          </Link>
          <Link href="/admin/book" className="flex items-center gap-3 px-3 py-3 text-ink hover:bg-indigo hover:text-paper rounded-md transition-colors">
            <FileText size={16} /> Book
          </Link>
          <Link href="/admin/about" className="flex items-center gap-3 px-3 py-3 text-ink hover:bg-indigo hover:text-paper rounded-md transition-colors">
            <FileText size={16} /> About
          </Link>
          <Link href="/admin/media" className="flex items-center gap-3 px-3 py-3 text-ink hover:bg-indigo hover:text-paper rounded-md transition-colors">
            <Settings size={16} /> Media
          </Link>
          <Link href="/admin/comments" className="flex items-center gap-3 px-3 py-3 text-ink hover:bg-indigo hover:text-paper rounded-md transition-colors">
            <MessageSquare size={16} /> Comments
          </Link>
          <Link href="/admin/inbox" className="flex items-center gap-3 px-3 py-3 text-ink hover:bg-indigo hover:text-paper rounded-md transition-colors">
            <MessageSquare size={16} /> Inbox
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-3 text-ink hover:bg-indigo hover:text-paper rounded-md transition-colors">
            <Settings size={16} /> Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-border space-y-2 font-ui text-[12px] tracking-widest uppercase">
          <Link href="/" className="flex items-center gap-3 px-3 py-3 text-ink-muted hover:text-ink transition-colors">
            <Home size={16} /> View Site
          </Link>
          <form action="/auth/signout" method="post">
            <button type="submit" className="flex items-center gap-3 px-3 py-3 text-red-600 hover:text-red-700 transition-colors w-full text-left">
              <LogOut size={16} /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-paper">
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
