import { AddCityForm } from '@/components/cities/add-city-from';
import { api } from '@/convex/_generated/api';
import { auth } from '@clerk/nextjs/server';
import { preloadQuery } from 'convex/nextjs';
import { redirect } from 'next/navigation';

export default async function AddCityPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const preloadedUserRequest = await preloadQuery(api.requests.userRequest, {
    userId,
  });
  return (
    <div className="p-4">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-bold">Add City</h1>
        <p className="text-sm text-muted-foreground">
          Didn&apos;t see your city? No worries! Add it here and we&apos;ll get
          it added for you.{' '}
        </p>
      </div>

      <AddCityForm preloadedUserRequest={preloadedUserRequest} />
    </div>
  );
}
