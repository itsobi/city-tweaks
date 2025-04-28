'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Id } from '@/convex/_generated/dataModel';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useState, useTransition } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

interface DeleteButtonProps {
  tweakId: Id<'tweaks'>;
  imageStorageId: Id<'_storage'> | undefined;
  userId: string;
}

export function DeleteButton({
  tweakId,
  imageStorageId,
  userId,
}: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const deleteTweak = useMutation(api.tweaks.deleteTweak);

  const handleDeleteTweak = () => {
    startTransition(async () => {
      const response = await deleteTweak({
        authorId: userId,
        tweakId,
        storageId: imageStorageId,
      });

      if (response.success) {
        toast.success(response.message);
        setIsOpen(false);
      } else {
        toast.error(response.message);
      }
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="cursor-pointer flex items-center gap-1 hover:text-red-500">
          <Trash2 className="w-3 h-3" /> Delete
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This cannot be undone. This will permanently delete your city tweak.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            className="hover:text-muted-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteTweak}
            variant="destructive"
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
