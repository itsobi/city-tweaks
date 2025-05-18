'use client';

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
import { Input } from '../ui/input';
import { checkCity } from '@/lib/actions';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { VerifyCityAlert } from '../verify-city-alert';
import { Preloaded, useMutation, usePreloadedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  city: z
    .string()
    .min(2, {
      message: 'City must be at least 2 characters.',
    })
    .max(100, {
      message: 'City must be less than 100 characters.',
    }),
  region: z
    .string()
    .min(2, {
      message: 'Title must be at least 2 characters.',
    })
    .max(100, {
      message: 'Title must be less than 100 characters.',
    }),
});

export function AddCityForm({
  preloadedUserRequest,
}: {
  preloadedUserRequest: Preloaded<typeof api.requests.userRequest>;
}) {
  const [verifiedCity, setVerifiedCity] = useState<{
    city: string;
    region: string;
    flag: string;
  } | null>(null);
  const userRequest = usePreloadedQuery(preloadedUserRequest);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: '',
      region: '',
    },
  });
  const [isPending, startTransition] = useTransition();

  const updateUserRequest = useMutation(api.requests.updateUserRequest);
  const addCity = useMutation(api.cities.addCity);

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    startTransition(async () => {
      // Verify city
      const checkCityResponse = await checkCity(values);

      if (!checkCityResponse.success) {
        toast.error(checkCityResponse.error);
        return;
      }

      // manual rate limit mutation. User can only add 1 city every 12 hours
      const userRequestResponse = await updateUserRequest({
        userTimezone: userTimezone,
      });

      if (!userRequestResponse.success) {
        toast.error(userRequestResponse.message);
        return;
      }

      if (checkCityResponse.success && checkCityResponse.data.isValid) {
        setVerifiedCity({
          city: checkCityResponse.data.city,
          region: checkCityResponse.data.region,
          flag: checkCityResponse.data.flag,
        });
      } else {
        console.log('ERROR>>>', checkCityResponse);
        toast.error(checkCityResponse.error);
      }
    });
  };

  if (verifiedCity?.city && verifiedCity?.region) {
    return (
      <VerifyCityAlert
        city={verifiedCity.city}
        region={verifiedCity.region}
        onConfirm={async () => {
          const addCityResponse = await addCity({
            city: verifiedCity.city,
            region: verifiedCity.region,
            flag: verifiedCity.flag,
          });

          if (addCityResponse.success) {
            toast.success(addCityResponse.message);
            form.reset();
            setVerifiedCity(null);
            return;
          } else {
            setVerifiedCity(null);
            toast.error(addCityResponse.message);
          }
        }}
        setVerifiedCity={setVerifiedCity}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[600px] mx-auto space-y-8"
      >
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City*</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter city name" />
              </FormControl>
              <FormDescription>
                Include the city name. Make sure it is a recognized city!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State/Province/Region*</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter state/province/region" />
              </FormControl>
              <FormDescription>
                Include the state, province, or region of the city.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid || isPending}
        >
          {isPending ? 'Verifying...' : 'Add City'}
        </Button>
        <div>
          <span className="flex justify-center text-sm  text-muted-foreground italic">
            User submissions are limited to 2 per day.
          </span>
          <span
            className={cn(
              'flex justify-center text-sm text-muted-foreground italic',
              userRequest?.requestCount && userRequest?.requestCount >= 2
                ? 'text-red-500'
                : userRequest?.requestCount && userRequest?.requestCount === 1
                  ? 'text-yellow-500'
                  : 'text-green-500'
            )}
          >
            {2 - (userRequest?.requestCount ?? 0)} submissions remaining.
          </span>
        </div>
      </form>
    </Form>
  );
}
