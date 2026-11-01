import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, ClipboardCheck, Puzzle, Presentation } from 'lucide-react';
import { Container, PageHeader } from '../components/layout/Page';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Select, Textarea } from '../components/ui/Field';
import { useToast } from '../components/ui/Toast';
import { SERVICE_SUBJECTS } from '../config';
import { useAuth } from '../context/AuthContext';
import { createQuote } from '../services/quotes';

const services = [
  { icon: Puzzle, title: 'Juegos educativos', text: 'Actividades con puntaje y equipos para el aula.' },
  { icon: ClipboardCheck, title: 'Ejercitadores y evaluaciones', text: 'Ejercicios con corrección automática.' },
  { icon: Presentation, title: 'Explicaciones interactivas', text: 'Contenidos paso a paso con ejemplos.' },
];

const schema = z.object({
  name: z.string().min(2, 'Ingresá tu nombre'),
  email: z.string().email('Ingresá un email válido'),
  subject: z.string().min(1, 'Elegí una materia'),
  description: z
    .string()
    .min(20, 'Contanos un poco más (mínimo 20 caracteres)')
    .max(2000, 'Máximo 2000 caracteres'),
  budget: z.string().max(100, 'Máximo 100 caracteres').optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Services() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '', subject: '', description: '', budget: '' },
  });

  async function onSubmit(values: FormValues) {
    try {
      await createQuote({ ...values, budget: values.budget || undefined });
      setSent(true);
      reset();
    } catch {
      toast({ tone: 'danger', title: 'No pudimos enviar tu pedido', description: 'Intentá de nuevo en unos minutos.' });
    }
  }

  return (
    <Container>
      <PageHeader
        title="Apps a medida"
        description="Creamos apps educativas para otras materias. El precio se acuerda según el proyecto."
      />

      <ul className="mb-8 grid gap-4 md:grid-cols-3">
        {services.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <Card className="flex h-full gap-4 p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-semibold">{title}</h2>
                <p className="text-sm text-text-muted">{text}</p>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <Card className="max-w-2xl p-5 md:p-8">
        {sent ? (
          <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-12 text-success" aria-hidden="true" />
            <h2 className="text-xl font-bold">¡Recibimos tu pedido!</h2>
            <p className="text-text-muted">Te vamos a escribir por email con una propuesta.</p>
            <Button variant="secondary" onClick={() => setSent(false)}>
              Enviar otro pedido
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <h2 className="text-xl font-bold">Pedí tu presupuesto</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Nombre" autoComplete="name" error={errors.name?.message} {...register('name')} />
              <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
            </div>
            <Select label="Materia" error={errors.subject?.message} {...register('subject')}>
              <option value="">Elegí una materia</option>
              {SERVICE_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Textarea
              label="¿Qué app necesitás?"
              hint="Contanos el tema, el año y cómo la imaginás."
              error={errors.description?.message}
              {...register('description')}
            />
            <Input
              label="Presupuesto estimado (opcional)"
              error={errors.budget?.message}
              {...register('budget')}
            />
            <Button type="submit" size="lg" className="w-full md:w-auto" loading={isSubmitting}>
              Enviar pedido
            </Button>
          </form>
        )}
      </Card>
    </Container>
  );
}
