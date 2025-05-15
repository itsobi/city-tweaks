import { cronJobs } from 'convex/server';
import { api, internal } from './_generated/api';

const crons = cronJobs();

// Run every hour to check and reset requests
crons.daily(
  'reset daily requests',
  { hourUTC: 0, minuteUTC: 0 },
  api.requests.resetDailyRequests
);

export default crons;
