import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { city, region } = await req.json();

    console.log('CITY>>>', city);
    console.log('REGION>>>', region);

    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        isValid: z.boolean(),
        city: z.string(),
        region: z.string(),
        flag: z.string(),
      }),
      prompt: `
      You are a helpful assistant that can determine if a city and region are valid.
      You are given a city and region: ${city}, ${region}.
      Keep in mind that the region may be abbreviated. For example, "CA" is California.
      If the region is abbreviated, expand it to the full name.
      Also, keep in mind that users can be outside of the United States. So the city and region may not be in the United States.
      The region could be a state, province, or a country.
      If the city is outside of the United States, the region will be the country
      Take in consideration of misspellings and different spellings of the city and region.
      If the city or region are spelled incorrectly, correct it.
      You need to return a JSON object with the following fields:
      - isValid: true if the city and region are valid after correcting the spelling if they were misspelled, false otherwise
      - city: the city name capitalized
      - region: the region name capitalized
      - flag: if the city is outside of the United States, the flag will be the country's flag. Go to Wikipedia to find the country's flag and use the image address. For example if the country is Canada, search the flag of Canada and use the image address. Make sure the image address is a valid. If the city is in the United States, the flag will be this: https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg/250px-Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg.png
      `,
    });

    console.log('RESULT>>>', object);

    return Response.json({ success: true, data: object });
  } catch (error) {
    console.error('Error in add-city:', error);
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
