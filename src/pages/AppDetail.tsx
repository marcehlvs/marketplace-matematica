import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Clock, ExternalLink, PackageX } from 'lucide-react';
import { AppCover } from '../components/AppCover';
import { Container } from '../components/layout/Page';
import { Badge } from '../components/ui/Badge';
import { Button, buttonClasses } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { formatPrice } from '../lib/utils';
import { appsStore } from '../services/catalog';
import { listMyEntitlements, listMyOrders } from '../services/library';
import { paymentProvider } from '../services/payments';

export default function AppDetail() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const appQuery = useAsync(() => appsStore.get(id), [id]);
  const accessQuery = useAsync(async () => {
    if (!user) return { owned: false, pending: false };
    const [entitlements, orders] = await Promise.all([listMyEntitlements(user.uid), listMyOrders(user.uid)]);
    return {
      owned: entitlements.some((e) => e.appId === id),
      pending: orders.some((o) => o.appId === id && o.status === 'pending'),
    };
  }, [id, user?.uid]);

  const app = appQuery.data;

  if (appQuery.loading) {
    return (
      <Container className="space-y-4" role="status" aria-label="Cargando">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </Container>
    );
  }
  if (appQuery.error) {
    return (
      <Container>
        <ErrorState onRetry={appQuery.reload} />
      </Container>
    );
  }
  if (!app) {
    return (
      <Container>
        <EmptyState
          icon={PackageX}
          title="No encontramos esta app"
          description="Puede que haya sido retirada del catálogo."
          action={
            <Link to="/catalogo" className={buttonClasses()}>
              Volver al catálogo
            </Link>
          }
        />
      </Container>
    );
  }

  const access = accessQuery.data;
  const isFree = app.price === 0;

  async function runCheckout() {
    if (!user || !app) return;
    setBusy(true);
    try {
      const result = await paymentProvider.checkout(app, user);
      if (result.kind === 'redirect') {
        window.location.assign(result.url);
        return;
      }
      toast({
        tone: 'success',
        title: result.kind === 'granted' ? '¡Listo! Ya está en tu biblioteca' : 'Recibimos tu pedido',
        description: result.kind === 'pending' ? 'Te confirmamos el acceso apenas coordinemos el pago.' : undefined,
      });
      setConfirmOpen(false);
      accessQuery.reload();
    } catch {
      toast({ tone: 'danger', title: 'No pudimos completar la operación', description: 'Intentá de nuevo en unos minutos.' });
    } finally {
      setBusy(false);
    }
  }

  function onBuy() {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (isFree) void runCheckout();
    else setConfirmOpen(true);
  }

  let cta;
  if (access?.owned) {
    cta = (
      <a href={app.url} target="_blank" rel="noopener noreferrer" className={buttonClasses({ size: 'lg', className: 'w-full' })}>
        Abrir app
        <ExternalLink className="size-4" aria-hidden="true" />
        <span className="sr-only">(se abre en una pestaña nueva)</span>
      </a>
    );
  } else if (access?.pending) {
    cta = (
      <Button size="lg" className="w-full" variant="secondary" disabled>
        <Clock className="size-4" aria-hidden="true" />
        Pedido pendiente
      </Button>
    );
  } else {
    cta = (
      <Button size="lg" className="w-full" onClick={onBuy} loading={busy && isFree}>
        {isFree ? 'Obtener gratis' : 'Comprar'}
      </Button>
    );
  }

  return (
    <Container>
      <nav aria-label="Ruta de navegación" className="mb-4 text-sm">
        <Link to="/catalogo" className="text-text-muted hover:text-text">
          ← Catálogo
        </Link>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:gap-10">
        <div className="space-y-6">
          <AppCover app={app} alt={`Portada de ${app.title}`} className="h-48 rounded-lg md:h-64" />
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="primary">{app.level}</Badge>
            {app.topics.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-4xl">{app.title}</h1>
          <p className="max-w-prose whitespace-pre-line text-lg text-text-muted">{app.description}</p>
        </div>

        <aside aria-label="Compra" className="lg:sticky lg:top-24 lg:self-start">
          <Card className="space-y-4 p-5">
            <p className="text-3xl font-bold">{formatPrice(app.price)}</p>
            {accessQuery.error ? (
              <p role="alert" className="text-sm text-danger">
                No pudimos verificar tu acceso.{' '}
                <button type="button" className="underline" onClick={accessQuery.reload}>
                  Reintentar
                </button>
              </p>
            ) : (
              cta
            )}
            {access?.owned && <p className="text-sm text-text-muted">Esta app ya está en tu biblioteca.</p>}
          </Card>
        </aside>
      </div>

      <Modal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirmar pedido"
        description={`${app.title} — ${formatPrice(app.price)}`}
      >
        <div className="space-y-4">
          <p className="text-text-muted">
            Por ahora los pagos se coordinan a mano. Registramos tu pedido y te confirmamos el acceso apenas recibamos el pago.
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => void runCheckout()} loading={busy}>
              Confirmar pedido
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
