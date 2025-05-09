import { AddCityForm } from '@/components/cities/add-city-from';
import { UserProfile } from '@clerk/nextjs';

export default function AddCityPage() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-bold">Add City</h1>
        <p className="text-sm text-muted-foreground">
          Didn't see your city? No worries! Add it here and we'll get it added
          for you.
        </p>
      </div>
      <AddCityForm />
    </div>
  );
}
