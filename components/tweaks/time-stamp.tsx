'use client';

import TimeAgo from 'react-timeago';

export default function TimeStamp({ date }: { date: Date }) {
  return (
    <span className="text-muted-foreground text-xs">
      <TimeAgo date={date} />
    </span>
  );
}
