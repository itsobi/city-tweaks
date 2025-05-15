'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { top25Cities } from '@/lib/top25Cities';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useCallback, useState, useTransition } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import { Camera, Plus, SquarePen, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from './ui/checkbox';
import { MouseEvent } from 'react';
import { Input } from './ui/input';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { Id } from '@/convex/_generated/dataModel';
import { SidebarMenuButton } from './ui/sidebar';
import { Cities, GroupedCities } from '@/lib/types';

function ImageDropzone({
  onChange,
  setFile,
}: {
  onChange: (file: File) => void;
  setFile: (file: File | null) => void;
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const onDrop = useCallback(
    (acceptedFile: File[]) => {
      if (acceptedFile?.[0]) {
        setFile(acceptedFile[0]);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(acceptedFile[0]);
        onChange(acceptedFile[0]);
      }
    },
    [onChange]
  );
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
      maxSize: 1024 * 1024 * 5, // 5MB
    });

  const clearImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setFile(null);
    setImagePreview(null);
    onChange(undefined as any); // Clear the form value
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex items-center justify-center border border-dashed p-8 text-sm text-muted-foreground',
        isDragActive && 'border-green-500 text-green-500'
      )}
    >
      <input {...getInputProps()} />

      {imagePreview ? (
        <div className="flex items-center justify-center">
          <div className="absolute top-0 right-0 p-1">
            <Button variant={'ghost'} size={'icon'} onClick={clearImage}>
              <Trash className="w-4 h-4 text-red-500" />
            </Button>
          </div>
          <img
            src={imagePreview}
            alt="Image Preview"
            className="w-[200px] h-[200px] object-contain"
          />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-center gap-1">
          <Camera />
          <p>Drop your image here or click to select a file</p>
          <p className="text-xs">(1 Image only)</p>
          {fileRejections.length > 0 && (
            <p className="text-red-500 text-xs">
              {fileRejections[0].errors[0].message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const formSchema = z.object({
  city: z.string().min(2, {
    message: 'City must be at least 2 characters.',
  }),
  title: z
    .string()
    .min(2, {
      message: 'Title must be at least 2 characters.',
    })
    .max(100, {
      message: 'Title must be less than 100 characters.',
    }),
  anonymous: z.boolean(),
  tweak: z
    .string()
    .min(2, {
      message: 'Your city tweak must be at least 2 characters.',
    })
    .max(500, {
      message: 'Your city tweak must be less than 500 characters.',
    }),
  image: z.any().optional(),
});

function CreatePostForm({
  cities,
  type,
  setOpen,
}: {
  cities: GroupedCities;
  type: string;
  setOpen: (open: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: '',
      title: '',
      tweak: '',
      anonymous: false,
      image: undefined,
    },
  });

  const createTweak = useMutation(api.tweaks.createTweak);
  const generateUploadUrl = useMutation(api.tweaks.generateUploadUrl);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      toast.error('Invalid form data');
      return;
    }
    let imageStorageId: Id<'_storage'> | undefined;

    startTransition(async () => {
      try {
        if (file) {
          const postUrl = await generateUploadUrl();

          const response = await fetch(postUrl, {
            method: 'POST',
            headers: { 'Content-Type': file.type },
            body: file,
          });

          const { storageId } = await response.json();
          imageStorageId = storageId;
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error
            ? error.message
            : 'There was an issue uploading your image.'
        );
        return;
      }
      // check to make sure the content has no curse words
      const res = await createTweak({
        isAnonymous: values.anonymous,
        title: values.title,
        content: values.tweak,
        imageStorageId,
        city: values.city,
      });

      if (res.success) {
        toast.success(res.message);
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City*</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>User Added Cities</SelectLabel>
                      {cities.new?.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          <div className="flex items-center gap-2">
                            <img
                              src={city.flag}
                              alt={city.city}
                              className="w-4 h-4 rounded-full object-contain"
                            />
                            {city.city}, {city.region}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Top 25 U.S. Cities</SelectLabel>
                      {cities.existing?.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          <div className="flex items-center gap-2">
                            <img
                              src={city.flag}
                              alt={city.city}
                              className="w-4 h-4 rounded-full object-contain"
                            />
                            {city.city}, {city.region}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select the city you want to tweak. If you do not see your city,
                no worries!{' '}
                <Link
                  onClick={() => {
                    setOpen(false);
                  }}
                  href="/add-city"
                  className="text-blue-500 hover:underline"
                >
                  Add your city
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title*</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Title for your tweak" />
              </FormControl>
              <FormDescription>Title for your city tweak.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="anonymous"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Anonymous
                  </label>
                </div>
              </FormControl>
              <FormDescription>Write your tweak anonymously.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tweak"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tweak*</FormLabel>
              <FormControl>
                <Textarea
                  className="placeholder:text-sm text-sm"
                  placeholder="I would like to see..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Explain the tweak you would make to the city.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === 'image' && (
          <FormField
            control={form.control}
            name="image"
            render={({ field: { onChange, value } }) => {
              return (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageDropzone onChange={onChange} setFile={setFile} />
                  </FormControl>
                  <FormDescription>
                    {file && `Selected File: ${file.name}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}

        <Button
          disabled={!form.formState.isValid || isPending}
          type="submit"
          className="w-full"
        >
          {isPending ? 'Creating Tweak...' : 'Create Tweak'}
        </Button>
      </form>
    </Form>
  );
}

export function CreateCityTweakButton({
  sidebar,
  plusIcon,
}: {
  sidebar?: boolean;
  plusIcon?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const cities = useQuery(api.cities.getCities);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {sidebar ? (
          <SidebarMenuButton>
            <SquarePen />
            Create City Tweak
          </SidebarMenuButton>
        ) : plusIcon ? (
          <Button variant={'ghost'} size={'icon'}>
            <Plus />
          </Button>
        ) : (
          <Button variant={'outline'} size={'icon'}>
            <SquarePen />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create City Tweak</DialogTitle>
          <DialogDescription>
            Let the world know what needs to be tweaked in your city!
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="post" className="overflow-y-auto max-h-[60vh] pb-4">
          <TabsList className="w-full">
            <TabsTrigger value="post">Post</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>
          <TabsContent value="post">
            <CreatePostForm
              type="post"
              cities={cities ?? { existing: [], new: [] }}
              setOpen={setOpen}
            />
          </TabsContent>
          <TabsContent value="image">
            <CreatePostForm
              type="image"
              cities={cities ?? { existing: [], new: [] }}
              setOpen={setOpen}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
