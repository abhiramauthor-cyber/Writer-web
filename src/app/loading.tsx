export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-indigo/20 overflow-hidden">
      <div className="h-full bg-indigo animate-pulse w-full origin-left transform" />
    </div>
  );
}

