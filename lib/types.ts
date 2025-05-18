import { Id } from '@/convex/_generated/dataModel';

export type UserType = {
  _id: Id<'users'>;
  clerkId: string;
  username: string;
  imageUrl: string;
};

export type TweakType = {
  _id: Id<'tweaks'>;
  _creationTime: number;
  imageUrl?: string | null;
  imageStorageId?: Id<'_storage'>;
  title: string;
  authorId: string;
  isAnonymous: boolean;
  content: string;
  city: string;
  author?: UserType;
};

export type Comment = {
  _id: Id<'comments'>;
  author: UserType | undefined;
  _creationTime: number;
  parentCommentId?: Id<'comments'> | undefined;
  authorId: string;
  content: string;
  tweakId?: Id<'tweaks'>;
  isParent: boolean;
};

type City = {
  _id: Id<'cities'>;
  _creationTime: number;
  city: string;
  value: string;
  region: string;
  flag: string;
};

export type Cities = City[] | undefined;

export type GroupedCities = {
  existing: City[];
  new: City[];
};
