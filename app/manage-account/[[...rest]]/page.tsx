import { UserProfile } from '@clerk/nextjs';

export default function ManageAccountPage() {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-bold">Manage Account</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="flex justify-center items-center w-full">
        <UserProfile />
      </div>
    </div>
  );
}
