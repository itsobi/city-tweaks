import { Loader } from 'lucide-react';

export default function LoadingPage() {
  return (
    <div className="flex flex-col justify-center items-center pt-20 gap-1 p-4">
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      <Loader className="w-4 h-4 animate-spin" />
    </div>
  );
}
