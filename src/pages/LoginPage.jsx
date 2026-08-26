import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UtensilsCrossed, 
  Mail, 
  Lock, 
  User, 
  ChefHat, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Select';
import { USER_ROLES } from '../utils/constants';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, resetPassword, user } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState(USER_ROLES.OPERATOR);
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
      } else if (mode === 'register') {
        if (!email || !password || !displayName) {
          throw new Error('Por favor completa todos los campos');
        }
        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        await register(email.trim(), password, displayName.trim(), role);
        showToast('Cuenta creada exitosamente en Firebase', 'success');
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

      {/* Header Container con Nuevo Logo de Cocina / Chef */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-2xl shadow-emerald-950/60 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <ChefHat className="w-9 h-9 text-emerald-400" />
          </div>
        </div>

        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Inventario Zenit, Cocina
        </h2>
        <p className="mt-1.5 text-xs text-slate-400 font-medium">
          Control Diario de Alimentos e Insumos
        </p>
      </div>

      {/* Card Formulario Privado */}
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl">
          
          {/* Tabs Selector */}
          <div className="flex border-b border-slate-800 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                mode === 'login'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                mode === 'register'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Nombre (Registro) */}
            {mode === 'register' && (
              <Input
                label="Nombre Completo *"
                icon={User}
                placeholder="Nombre del usuario"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            )}

            {/* Email */}
            <Input
              label="Correo Electrónico *"
              icon={Mail}
              type="email"
              placeholder="correo@zenit.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            {/* Password */}
            {mode !== 'forgot' && (
              <Input
                label="Contraseña *"
                icon={Lock}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            )}

            {/* Rol de usuario en registro */}
            {mode === 'register' && (
              <Select
                label="Rol en el Negocio *"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={[
                  { value: USER_ROLES.OPERATOR, label: 'Operador (Entradas y Salidas de Cocina)' },
                  { value: USER_ROLES.SUPERVISOR, label: 'Supervisor (Reportes & Stock)' },
                  { value: USER_ROLES.ADMIN, label: 'Administrador (Control Total)' }
                ]}
              />
            )}

            {/* Olvidé contraseña link */}
            {mode === 'login' && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              loading={loading}
              className="mt-2"
            >
              {mode === 'login' && 'Ingresar al Sistema'}
              {mode === 'register' && 'Crear Cuenta'}
              {mode === 'forgot' && 'Enviar Correo de Recuperación'}
            </Button>

          </form>

          {/* Footer de Créditos */}
          <div className="mt-8 pt-5 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 font-medium">
              Desarrollado por <span className="text-slate-300 font-bold">Wladimir Almeida</span>
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5">
              Zenit Cocina • Todos los derechos reservados
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
