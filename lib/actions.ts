'use server';

import { auth } from '@clerk/nextjs/server';
import { api } from '@/convex/_generated/api';
import { convexClient } from './convexClient';

const ENDPOINT =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api/add-city'
    : 'https://citytweaks.com/api/add-city';

export async function checkCity({
  city,
  region,
}: {
  city: string;
  region: string;
}) {
  await auth.protect();
  try {
    if (!city || !region) {
      return {
        success: false,
        status: 400,
        error: 'City and state are required',
      };
    }

    const trimmedCity =
      city.trim().charAt(0).toUpperCase() + city.trim().slice(1);
    const trimmedRegion =
      region.trim().charAt(0).toUpperCase() + region.trim().slice(1);

    const cityExists = await convexClient.query(api.cities.cityExists, {
      city: trimmedCity,
      region: trimmedRegion,
    });

    if (cityExists) {
      return {
        success: false,
        status: 409,
        error: 'City already exists',
      };
    }

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        city: trimmedCity,
        region: trimmedRegion,
      }),
    });

    const responseData = await response.json();

    if (!response.ok || !responseData.success) {
      return {
        success: false,
        status: response.status,
        error: responseData.error || 'Failed to add city',
      };
    }

    return {
      success: true,
      status: 200,
      data: responseData.data,
      error: !responseData.data.isValid
        ? 'Sorry, this city failed the verification check.'
        : null,
    };
  } catch (error) {
    console.error('Error in checkCity:', error);
    return {
      success: false,
      status: 500,
      error: 'Internal server error',
    };
  }
}
