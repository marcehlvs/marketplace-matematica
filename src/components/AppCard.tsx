import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { AppData, WithId } from '../types';
import { formatPrice } from '../lib/utils';
import { AppCover } from './AppCover';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';

export function AppCard({ app }: { app: WithId<AppData> }) {
  return (
    <Link to={`/apps/${app.id}`} className="group block h-full rounded-lg">
      <Card className="h-full overflow-hidden transition duration-300 group-hover:-translate-y-1 group-hover:border-primary/60 group-hover:shadow-md">
        <div className="overflow-hidden">
          <AppCover app={app} className="h-44 transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="primary">{app.level}</Badge>
            {app.topics.slice(0, 2).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <h3 className="text-xl font-bold leading-snug">{app.title}</h3>
          <p className="line-clamp-2 text-sm text-text-muted">{app.summary}</p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-lg font-bold">{formatPrice(app.price)}</p>
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-full border border-border-strong text-text transition group-hover:border-transparent group-hover:bg-primary group-hover:text-primary-contrast"
            >
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
