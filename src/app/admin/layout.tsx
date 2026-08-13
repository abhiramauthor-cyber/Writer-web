import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut, Home, FileText, Settings, MessageSquare, LayoutDashboard } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const primaryEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  
  const adminEmail = process.env.ADMIN_EMAIL || ["abhiramssk", "gmail.com"].join("@");
  if (!user || primaryEmail !== adminEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-card">
        <div className="text-center p-10">
          <h1 className="font-display text-3xl text-ink mb-4">Access Denied</h1>
          <p className="text-ink-soft font-body mb-6">You don&apos;t have permission to access the admin panel.</p>
          <a href="/" className="bg-indigo text-paper px-6 py-3 font-ui text-[11px] tracking-widest uppercase hover:bg-ink transition-colors">
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-paper-card">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-paper flex flex-col">
        <div className="p-6">
          <Link href="/admin" className="font-display text-xl text-ink">
            Writer <span className="italic text-marigold">Admin</span>
          </Link>
          <p className="text-[11px] font-ui tracking-wider text-ink-muted mt-1 uppercase">
            {user?.primaryEmailAddress?.emailAddress}
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
          <SignOutButton>
            <button className="flex items-center gap-3 px-3 py-3 text-red-600 hover:text-red-700 transition-colors w-full text-left">
              <LogOut size={16} /> Sign Out
            </button>
          </SignOutButton>
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
