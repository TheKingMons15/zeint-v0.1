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
    <div className="min-h-screen bg-[#05070B] flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background ambient Apple glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center">
        <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 p-0.5 shadow-apple-glow-emerald flex items-center justify-center">
          <div className="w-full h-full bg-[#090b10] rounded-[22px] flex items-center justify-center">
            <ChefHat className="w-9 h-9 text-emerald-400" />
          </div>
        </div>

        <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          Zénit Cocina & Bar
        </h2>
        <p className="mt-1.5 text-xs text-slate-400 font-medium">
          Sistema Central de Existencias, Comandas y Facturación
        </p>
      </div>

      {/* Apple Glass Auth Card */}
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="apple-glass-sheet border border-white/15 py-8 px-6 sm:px-10 shadow-apple-lg rounded-3xl space-y-6">
          
          <div className="text-center border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {mode === 'login' ? 'Acceso al Sistema' : 'Recuperar Contraseña'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              {mode === 'login' 
                ? 'Ingresa tus credenciales autorizadas' 
                : 'Ingresa tu correo para recibir el enlace de recuperación'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300 animate-apple-fade">
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
                    className="p-1 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/15 transition-all"
                    title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-400 hover:text-white" />
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
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors ml-auto text-[11px]"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors text-[11px]"
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
              className="mt-2 text-sm font-bold py-3"
            >
              {mode === 'login' ? 'Ingresar al Sistema' : 'Enviar Correo de Recuperación'}
            </Button>

          </form>

          {/* Aviso Informativo de Creación de Cuentas */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-center">
            <p className="text-[11px] text-slate-400 leading-snug font-medium">
              🔒 <strong className="text-slate-200">Acceso restringido:</strong> Las cuentas son asignadas y creadas únicamente por los administradores de Zénit.
            </p>
          </div>

          {/* Footer de Créditos */}
          <div className="pt-2 border-t border-white/10 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              Desarrollado por <span className="text-white font-bold">Wladimir Almeida</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Restaurante Zénit • Todos los derechos reservados
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
