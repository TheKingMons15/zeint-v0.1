import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Boxes, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Crown,
  KeyRound
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
  const [role, setRole] = useState(USER_ROLES.ADMIN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSecretSuperAdmin, setShowSecretSuperAdmin] = useState(false);

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
        await login(email, password);
        showToast('¡Bienvenido al sistema de inventario!', 'success');
        navigate('/');
      } else if (mode === 'register') {
        if (!email || !password || !displayName) {
          throw new Error('Por favor completa todos los campos requeridos');
        }
        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        await register(email, password, displayName, role);
        showToast('Cuenta creada exitosamente en Firebase', 'success');
        navigate('/');
      } else if (mode === 'forgot') {
        if (!email) {
          throw new Error('Ingresa tu correo para restablecer la contraseña');
        }
        await resetPassword(email);
        showToast('Correo de recuperación enviado. Revisa tu bandeja.', 'info');
        setMode('login');
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Correo o contraseña incorrectos. Si aún no has creado la cuenta en Firebase, créala en la pestaña "Crear Cuenta".');
      } else {
        setError(err.message || 'Ocurrió un error al procesar la solicitud');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPredefinedUser = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setMode('login');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background ambient gradient */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center">
        {/* Click discreto 3 veces en el logo activa el modo Super Admin */}
        <div 
          onClick={() => setShowSecretSuperAdmin(!showSecretSuperAdmin)}
          className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-2xl shadow-emerald-950/60 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
          title="Zenit Alimentos"
        >
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Boxes className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Control Diario de Inventario
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
          Auditoría en tiempo real para Karen, Wladimir y Hernán
        </p>
      </div>

      {/* Card Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
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
                placeholder="Ej: Karen Administrador"
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
              placeholder="karenadmin@zenit.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
                  { value: USER_ROLES.ADMIN, label: 'Administrador (Karen - Control Total & Auditoría)' },
                  { value: USER_ROLES.SUPERVISOR, label: 'Supervisor (Wladimir - Reportes & Stock)' },
                  { value: USER_ROLES.OPERATOR, label: 'Operador (Hernán - Entradas y Salidas)' }
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
              {mode === 'register' && 'Registrar Cuenta'}
              {mode === 'forgot' && 'Enviar Correo de Recuperación'}
            </Button>

          </form>

          {/* Selector de Cuentas Preconfiguradas para el Personal */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center mb-3">
              Personal Autorizado:
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPredefinedUser('karenadmin@zenit.com', 'KarenZenit2026!')}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <span className="block text-[11px] font-bold text-slate-200 group-hover:text-emerald-400">
                  Karen
                </span>
                <span className="block text-[9px] text-emerald-400 font-semibold">
                  Admin
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPredefinedUser('wladimir@zenit.com', 'WladimirZenit2026!')}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 text-left transition-all group"
              >
                <span className="block text-[11px] font-bold text-slate-200 group-hover:text-sky-400">
                  Wladimir
                </span>
                <span className="block text-[9px] text-sky-400 font-semibold">
                  Supervisor
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPredefinedUser('hernan@zenit.com', 'HernanZenit2026!')}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
              >
                <span className="block text-[11px] font-bold text-slate-200 group-hover:text-amber-400">
                  Hernán
                </span>
                <span className="block text-[9px] text-amber-400 font-semibold">
                  Operador
                </span>
              </button>
            </div>

            {/* BOTÓN OCULTO DE SUPER ADMIN (Solo visible si se hace clic en el logo) */}
            {showSecretSuperAdmin && (
              <div className="mt-4 pt-3 border-t border-dashed border-amber-500/30 animate-fade-in">
                <button
                  type="button"
                  onClick={() => handleSelectPredefinedUser('master@zenit.com', 'ZenitMaster2026#Secret!')}
                  className="w-full p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-center justify-between text-left hover:bg-amber-900/30 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="block text-xs font-bold text-amber-300">
                        Super Administrador (Director)
                      </span>
                      <span className="block text-[10px] text-amber-400/80 font-mono">
                        master@zenit.com
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-black bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                    DIRECTOR
                  </span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
