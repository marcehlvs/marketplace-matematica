import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Field';
import { useToast } from '../../components/ui/Toast';
import { LEVELS, TOPICS } from '../../config';
import { appsStore } from '../../services/catalog';
import type { AppData, WithId } from '../../types';

/** URL completa o ruta del propio sitio (por ejemplo /capturas/derivadas.jpg). */
const pathOrUrl = z
  .string()
  .refine((v) => v === '' || /^(https?:\/\/\S+|\/[^/\s]\S*)$/.test(v), 'Ingresá una URL (https://…) o una ruta como /capturas/app.jpg');

const schema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres'),
  summary: z.string().min(10, 'Mínimo 10 caracteres').max(140, 'Máximo 140 caracteres'),
  description: z.string().min(20, 'Mínimo 20 caracteres'),
  level: z.string().min(1, 'Elegí un año'),
  topics: z.string().min(1, 'Ingresá al menos un tema'),
  price: z.string().regex(/^\d+$/, 'Ingresá un número entero (0 = gratis)'),
  url: z.string().url('Ingresá una URL válida (https://…)'),
  coverUrl: pathOrUrl,
  screenshots: z.string(),
  previewUrl: z.string().url('URL inválida').or(z.literal('')),
  published: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function AppForm({ app, onSaved }: { app: WithId<AppData> | null; onSaved: () => void }) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: app?.title ?? '',
      summary: app?.summary ?? '',
      description: app?.description ?? '',
      level: app?.level ?? '',
      topics: app?.topics.join(', ') ?? '',
      price: String(app?.price ?? 0),
      url: app?.url ?? '',
      coverUrl: app?.coverUrl ?? '',
      screenshots: (app?.screenshots ?? []).join('\n'),
      previewUrl: app?.previewUrl ?? '',
      published: app?.published ?? false,
    },
  });

  async function onSubmit(values: FormValues) {
    const data = {
      title: values.title,
      summary: values.summary,
      description: values.description,
      level: values.level,
      topics: values.topics
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      price: Number(values.price),
      url: values.url,
      coverUrl: values.coverUrl || undefined,
      screenshots: values.screenshots.split('\n').map((l) => l.trim()).filter(Boolean),
      previewUrl: values.previewUrl || undefined,
      published: values.published,
    };
    try {
      if (app) await appsStore.update(app.id, data);
      else await appsStore.create({ ...data, createdAt: Date.now() });
      toast({ tone: 'success', title: 'App guardada' });
      onSaved();
    } catch {
      toast({ tone: 'danger', title: 'No pudimos guardar la app' });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Input label="Título" error={errors.title?.message} {...register('title')} />
      <Input
        label="Resumen"
        hint="Una línea que se ve en la tarjeta (máx. 140)."
        error={errors.summary?.message}
        {...register('summary')}
      />
      <Textarea label="Descripción" error={errors.description?.message} {...register('description')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Año" error={errors.level?.message} {...register('level')}>
          <option value="">Elegí un año</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
        <Input
          label="Precio (ARS)"
          inputMode="numeric"
          hint="0 = gratis"
          error={errors.price?.message}
          {...register('price')}
        />
      </div>
      <Input
        label="Temas"
        hint={`Separados por coma. Sugeridos: ${TOPICS.join(', ')}.`}
        error={errors.topics?.message}
        {...register('topics')}
      />
      <Input label="URL de la app" type="url" error={errors.url?.message} {...register('url')} />
      <Input
        label="Portada (opcional)"
        hint="URL o ruta del sitio, por ejemplo /capturas/derivadas.jpg"
        error={errors.coverUrl?.message}
        {...register('coverUrl')}
      />
      <Textarea
        label="Capturas (opcional)"
        hint="Una por línea. La primera es la principal."
        rows={3}
        error={errors.screenshots?.message}
        {...register('screenshots')}
      />
      <Input
        label="URL de la demo (opcional)"
        type="url"
        hint="Versión de prueba que se abre antes de comprar. Tiene que ser un despliegue aparte y limitado."
        error={errors.previewUrl?.message}
        {...register('previewUrl')}
      />
      <label className="flex items-center gap-3 py-1">
        <input type="checkbox" className="size-5 accent-primary" {...register('published')} />
        <span className="font-medium">Publicada (visible en el catálogo)</span>
      </label>
      <Button type="submit" className="w-full sm:w-auto" loading={isSubmitting}>
        Guardar
      </Button>
    </form>
  );
}
