/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as cities from "../cities.js";
import type * as comments from "../comments.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as notifications from "../notifications.js";
import type * as requests from "../requests.js";
import type * as tweaks from "../tweaks.js";
import type * as users from "../users.js";
import type * as votes from "../votes.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  cities: typeof cities;
  comments: typeof comments;
  crons: typeof crons;
  http: typeof http;
  notifications: typeof notifications;
  requests: typeof requests;
  tweaks: typeof tweaks;
  users: typeof users;
  votes: typeof votes;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
