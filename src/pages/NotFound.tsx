import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Container } from '../components/layout/Page';
import { buttonClasses } from '../components/ui/Button';
import { EmptyState } from '../components/ui/States';

export default function NotFound() {
  return (
    <Container>
      <EmptyState
        icon={Compass}
        title="Página no encontrada"
        description="El enlace no existe o cambió de lugar."
        action={
          <Link to="/" className={buttonClasses()}>
            Ir al inicio
          </Link>
        }
      />
    </Container>
  );
}
