'use client';

import { useTransition } from 'react';
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
  tweakId: Id<'tweaks'>;
}

export default function CreateReplyForm({ tweakId }: CreateReplyFormProps) {
  const sendReply = useMutation(api.tweaks.reply);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reply: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await sendReply({
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
        <Button type="submit" disabled={!form.formState.isValid || isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
