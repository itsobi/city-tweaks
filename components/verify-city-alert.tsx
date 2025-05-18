'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dispatch, SetStateAction } from 'react';

interface VerifyCityAlertProps {
  city: string;
  region: string;
  onConfirm: () => void;
  setVerifiedCity: Dispatch<
    SetStateAction<{
      city: string;
      region: string;
      flag: string;
    } | null>
  >;
}

export function VerifyCityAlert({
  city,
  region,
  onConfirm,
  setVerifiedCity,
}: VerifyCityAlertProps) {
  return (
    <AlertDialog open={true}>
      <AlertDialogTrigger className="hidden">Open</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verified!</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-bold">{city}</span>,{' '}
            <span className="font-bold">{region}</span> has been verified! Are
            you sure you want to add this city?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setVerifiedCity(null)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
