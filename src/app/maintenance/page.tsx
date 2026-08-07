import { BookOpen } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper text-ink p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-indigo mx-auto flex items-center justify-center text-paper mb-6">
          <BookOpen />
        </div>
        <h1 className="font-display text-4xl mb-4">We are reorganizing the catalog.</h1>
        <p className="font-body text-ink-soft mb-8">
          Writer Lokam is currently in maintenance mode. Please check back later.
        </p>
      </div>
    </div>
  );
}
