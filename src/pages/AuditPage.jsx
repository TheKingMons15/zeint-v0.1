import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  ArrowDownLeft, 
  ArrowUpRight, 
  PackagePlus, 
  Edit3, 
  Trash2, 
  LogIn, 
  LogOut, 
  Search, 
  Filter, 
  Clock, 
  Calendar 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { auditService } from '../services/auditService';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatDate, formatDateTime, formatTime } from '../utils/formatters';

export const AuditPage = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('ALL');
  const [search, setSearch] = useState('');

  const companyId = user?.companyId || 'default_company';

  useEffect(() => {
    setLoading(true);
    const unsubscribe = auditService.subscribe(companyId, (auditLogs) => {
      setLogs(auditLogs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [companyId]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchAction = filterAction === 'ALL' || log.actionType === filterAction;
      const query = search.toLowerCase().trim();
      const matchSearch = !query || 
        (log.userName && log.userName.toLowerCase().includes(query)) ||
        (log.userEmail && log.userEmail.toLowerCase().includes(query)) ||
        (log.details?.product && log.details.product.toLowerCase().includes(query)) ||
        (log.details?.message && log.details.message.toLowerCase().includes(query));

      return matchAction && matchSearch;
    });
  }, [logs, filterAction, search]);

  const getActionMeta = (type) => {
    switch (type) {
      case 'LOGIN':
        return { label: 'Inicio de Sesión', icon: LogIn, color: 'emerald', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'LOGOUT':
        return { label: 'Cierre de Sesión', icon: LogOut, color: 'slate', bg: 'bg-slate-800 text-slate-400 border-slate-700' };
      case 'ENTRY_MOVEMENT':
        return { label: 'Entrada de Alimentos', icon: ArrowDownLeft, color: 'emerald', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' };
      case 'EXIT_MOVEMENT':
        return { label: 'Salida de Alimentos', icon: ArrowUpRight, color: 'rose', bg: 'bg-rose-500/15 text-rose-300 border-rose-500/40' };
      case 'CREATE_PRODUCT':
        return { label: 'Producto Creado', icon: PackagePlus, color: 'sky', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30' };
      case 'UPDATE_PRODUCT':
        return { label: 'Producto Editado', icon: Edit3, color: 'amber', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'DELETE_PRODUCT':
        return { label: 'Producto Eliminado', icon: Trash2, color: 'rose', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
      case 'IMPORT_CATALOG':
        return { label: 'Importación Masiva', icon: ShieldCheck, color: 'purple', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      default:
        return { label: type, icon: Clock, color: 'slate', bg: 'bg-slate-800 text-slate-400 border-slate-700' };
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage label="Cargando registro de auditoría y cambios..." />;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Bitácora de Auditoría y Control de Cambios
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Registro cronológico de quién ingresó al sistema, a qué hora y qué movimientos o cambios realizó
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            {filteredLogs.length} Registro(s)
          </span>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Buscador */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por usuario (Karen, Wladimir, Hernán) o producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filtro por Tipo de Acción */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 py-2 px-3 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Todas las acciones</option>
            <option value="LOGIN">Inicios de Sesión (Ingresos)</option>
            <option value="ENTRY_MOVEMENT">Entradas de Alimentos</option>
            <option value="EXIT_MOVEMENT">Salidas de Alimentos</option>
            <option value="CREATE_PRODUCT">Creación de Productos</option>
            <option value="UPDATE_PRODUCT">Edición de Productos</option>
            <option value="DELETE_PRODUCT">Eliminación de Productos</option>
          </select>
        </div>

      </div>

      {/* Lista de Registros de Auditoría */}
      {filteredLogs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
          No hay registros de auditoría que coincidan con los filtros.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const meta = getActionMeta(log.actionType);
            const Icon = meta.icon;

            return (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
              >
                {/* Columna Izquierda: Icono + Usuario + Acción */}
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${meta.bg}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-slate-100">
                        {log.userName || 'Usuario'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({log.userEmail})
                      </span>
                      <span className="px-2 py-0.5 text-[9px] font-semibold bg-slate-800 text-slate-300 rounded">
                        {log.userRole || 'operador'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${meta.bg}`}>
                        {meta.label}
                      </span>

                      {/* Detalles específicos del cambio */}
                      {log.details?.product && (
                        <span className="text-xs text-slate-300 font-semibold">
                          {log.details.product}
                        </span>
                      )}

                      {log.details?.quantity && (
                        <span className="text-xs font-black text-emerald-400">
                          {log.details.quantity}
                        </span>
                      )}

                      {log.details?.reason && (
                        <span className="text-[11px] text-slate-400">
                          • Motivo: {log.details.reason}
                        </span>
                      )}

                      {log.details?.message && (
                        <span className="text-[11px] text-slate-400">
                          • {log.details.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Fecha y Hora Exacta */}
                <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                  <div className="text-xs font-bold text-slate-200">
                    {formatDate(log.timestamp || log.createdAt)}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono flex items-center sm:justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(log.timestamp || log.createdAt)}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
