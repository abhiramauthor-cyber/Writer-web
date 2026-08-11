import Stamp from "@/components/Stamp";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-paper z-50 flex items-center justify-center animate-fade-in">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-20 md:h-20 opacity-80 animate-spin-slow">
          <Stamp />
        </div>
      </div>
    </div>
  );
}
