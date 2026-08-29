import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ChefHat, 
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, resetPassword, user } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email || !password) {
          throw new Error('Por favor ingresa tu correo y contraseña');
        }
        await login(email.trim(), password);
        showToast('¡Bienvenido al sistema!', 'success');
        navigate('/');
      } else if (mode === 'forgot') {
        if (!email) {
          throw new Error('Ingresa tu correo para restablecer la contraseña');
        }
        await resetPassword(email.trim());
        showToast('Correo de recuperación enviado. Revisa tu bandeja.', 'info');
        setMode('login');
      }
    } catch (err) {
      console.error(err);
      if (
        err.code === 'auth/invalid-credential' || 
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/wrong-password'
      ) {
        setError('Correo o contraseña incorrectos. Verifica tus datos de acceso.');
      } else {
        setError(err.message || 'Ocurrió un error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background ambient gradient */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-2xl shadow-emerald-950/60 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <ChefHat className="w-9 h-9 text-emerald-400" />
          </div>
        </div>

        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Inventario Zenit, Cocina y Bar
        </h2>
        <p className="mt-1.5 text-xs text-slate-400 font-medium">
          Sistema de Control de Existencias, Pedidos y Facturación
        </p>
      </div>

      {/* Card Formulario Privado */}
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl space-y-6">
          
          <div className="text-center border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {mode === 'login' ? 'Acceso al Sistema' : 'Recuperar Contraseña'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {mode === 'login' 
                ? 'Ingresa tus credenciales autorizadas' 
                : 'Ingresa tu correo para recibir el enlace de recuperación'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <Input
              label="Correo Electrónico *"
              icon={Mail}
              type="email"
              placeholder="usuario@zenit.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            {/* Password con botón para ver/ocultar */}
            {mode === 'login' && (
              <Input
                label="Contraseña *"
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                rightElement={
                  <button
                    type="button"
                    tabIndex="-1"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-200 focus:outline-none transition-colors"
                    title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-400 hover:text-slate-200" />
                    )}
                  </button>
                }
              />
            )}

            {/* Olvidé contraseña link */}
            <div className="flex items-center justify-between text-xs pt-1">
              {mode === 'login' ? (
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(''); }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors ml-auto"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  ← Volver al inicio de sesión
                </button>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              loading={loading}
              className="mt-2 text-sm font-bold"
            >
              {mode === 'login' ? 'Ingresar al Sistema' : 'Enviar Correo de Recuperación'}
            </Button>

          </form>

          {/* Aviso Informativo de Creación de Cuentas */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 leading-snug">
              🔒 <strong className="text-slate-300">Acceso restringido:</strong> Las cuentas son asignadas y creadas únicamente por los administradores de Zénit.
            </p>
          </div>

          {/* Footer de Créditos */}
          <div className="pt-2 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500 font-medium">
              Desarrollado por <span className="text-slate-300 font-bold">Wladimir Almeida</span>
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5">
              Restaurante Zénit • Todos los derechos reservados
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
