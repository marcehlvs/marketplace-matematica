import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Container } from '../components/layout/Page';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Field';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  email: z.string().email('Ingresá un email válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormValues = z.infer<typeof schema>;

function authMessage(error: unknown) {
  const code = (error as { code?: string }).code ?? '';
  if (/invalid-credential|wrong-password|user-not-found/.test(code)) return 'Email o contraseña incorrectos.';
  if (code.includes('email-already-in-use')) return 'Ese email ya tiene una cuenta. Probá ingresar.';
  if (code.includes('popup-closed')) return 'Cerraste la ventana antes de terminar.';
  return 'No pudimos iniciar sesión. Intentá de nuevo.';
}

export default function Login() {
  const { user, demo, signInWithGoogle, signInWithEmail, signUpWithEmail, signInDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (user) return <Navigate to={from} replace />;

  async function onSubmit({ email, password }: FormValues) {
    setFormError('');
    try {
      if (mode === 'login') await signInWithEmail(email, password);
      else await signUpWithEmail(email, password);
      navigate(from, { replace: true });
    } catch (e) {
      setFormError(authMessage(e));
    }
  }

  async function onGoogle() {
    setFormError('');
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (e) {
      setFormError(authMessage(e));
    }
  }

  function onDemo(role: 'user' | 'admin') {
    signInDemo(role);
    navigate(from, { replace: true });
  }

  return (
    <Container className="max-w-md">
      <Card className="space-y-5 p-6">
        <h1 className="text-2xl font-bold">{mode === 'login' ? 'Ingresar' : 'Crear cuenta'}</h1>

        {demo ? (
          <div className="space-y-3">
            <p className="text-text-muted">
              Estás en modo demo (sin Firebase). Elegí cómo querés entrar para probar la app.
            </p>
            <Button className="w-full" onClick={() => onDemo('user')}>
              Entrar como usuario
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => onDemo('admin')}>
              Entrar como admin
            </Button>
          </div>
        ) : (
          <>
            <Button variant="secondary" className="w-full" onClick={() => void onGoogle()}>
              Continuar con Google
            </Button>
            <p className="text-center text-sm text-text-muted">o con tu email</p>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
              <Input
                label="Contraseña"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                error={errors.password?.message}
                {...register('password')}
              />
              {formError && (
                <p role="alert" className="text-sm text-danger">
                  {formError}
                </p>
              )}
              <Button type="submit" className="w-full" loading={isSubmitting}>
                {mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
              </Button>
            </form>
            <p className="text-center text-sm text-text-muted">
              {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
              <button
                type="button"
                className="font-medium text-primary underline"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setFormError('');
                }}
              >
                {mode === 'login' ? 'Creala' : 'Ingresá'}
              </button>
            </p>
          </>
        )}
      </Card>
    </Container>
  );
}
