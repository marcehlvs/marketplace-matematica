import { Link } from 'react-router-dom';
import type { AppData, WithId } from '../types';
import { formatPrice } from '../lib/utils';
import { AppCover } from './AppCover';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';

export function AppCard({ app }: { app: WithId<AppData> }) {
  return (
    <Link to={`/apps/${app.id}`} className="group block rounded-lg">
      <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-md">
        <AppCover app={app} />
        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="primary">{app.level}</Badge>
            {app.topics.slice(0, 2).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <h3 className="text-lg font-semibold leading-snug">{app.title}</h3>
          <p className="line-clamp-2 text-sm text-text-muted">{app.summary}</p>
          <p className="mt-1 font-semibold">{formatPrice(app.price)}</p>
        </div>
      </Card>
    </Link>
  );
}
