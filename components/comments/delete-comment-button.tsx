import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Button } from '../ui/button';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';

interface DeleteCommentButtonProps {
  commentId: Id<'comments'>;
  authorId: string;
}

export function DeleteCommentButton({
  commentId,
  authorId,
}: DeleteCommentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const deleteComment = useMutation(api.comments.deleteComment);

  const handleDeleteComment = async () => {
    startTransition(async () => {
      const result = await deleteComment({
        commentId,
        authorId,
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setIsOpen(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="cursor-pointer flex items-center text-muted-foreground text-xs gap-1 hover:text-red-500"
          onClick={(e) => e.stopPropagation()}
        >
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
            onClick={handleDeleteComment}
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
