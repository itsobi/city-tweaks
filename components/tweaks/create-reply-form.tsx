'use client';

import { Dispatch, SetStateAction, useTransition } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '../ui/form';

const formSchema = z.object({
  reply: z
    .string()
    .min(2, {
      message: 'Reply must be at least 2 characters.',
    })
    .max(100, {
      message: 'Reply cannot exceed 200 characters.',
    }),
});

interface CreateReplyFormProps {
  tweakId?: Id<'tweaks'>;
  commentId?: Id<'comments'>;
  reply: boolean;
  setReply: Dispatch<SetStateAction<boolean>>;
}

export function CreateReplyForm({
  tweakId,
  commentId,
  reply,
  setReply,
}: CreateReplyFormProps) {
  const [isPending, startTransition] = useTransition();
  const [replyIsPending, replyStartTransition] = useTransition();

  const comment = useMutation(api.tweaks.comment);
  const sendReply = useMutation(api.comments.reply);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reply: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const parsed = formSchema.safeParse(values);

    console.log('tweakID>>>', tweakId);

    if (!parsed.success) {
      toast.error('Invalid form data');
      return;
    }

    if (!tweakId && !commentId) {
      toast.error('Unable to create comment/reply.');
      return;
    }

    if (reply && commentId && tweakId) {
      // console.log('PARENT COMMENT ID>>>', commentId);
      replyStartTransition(async () => {
        const result = await sendReply({
          content: values.reply,
          isParent: false,
          parentCommentId: commentId,
          tweakId: tweakId,
        });
        if (result.success) {
          toast.success(result.message);
          form.reset();
        } else {
          toast.error(result.message);
        }
      });
      setReply(false);
      return;
    }

    if (!tweakId) {
      toast.error('Unable to create comment/reply.');
      return;
    }

    startTransition(async () => {
      const result = await comment({
        tweakId,
        content: values.reply,
        isParent: true,
        parentCommentId: undefined,
      });
      if (result.success) {
        toast.success(result.message);
        form.reset();
        // TODO: route to post page
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-2"
      >
        <FormField
          control={form.control}
          name="reply"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Add your comment" {...field} className="" />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!form.formState.isValid || isPending || replyIsPending}
        >
          {isPending || replyIsPending ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </Form>
  );
}
