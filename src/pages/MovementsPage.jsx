import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  ArrowLeftRight, 
  ArrowDownLeft, 
  ArrowUpRight, 
  History, 
  Calendar 
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { Button } from '../components/common/Button';
import { MovementHistoryTable } from '../components/movements/MovementHistoryTable';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatNumber } from '../utils/formatters';

export const MovementsPage = () => {
  const { movements, todayMovements, stats, loading } = useInventory();
  const { handleOpenMovementModal } = useOutletContext();

  if (loading) {
    return <LoadingSpinner fullPage label="Cargando historial de movimientos..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ArrowLeftRight className="w-6 h-6 text-emerald-400" />
            Registro de Movimientos Diarios
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Auditoría y control de todas las entradas y salidas de alimentos con actualización automática de stock
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="success"
            icon={ArrowDownLeft}
            onClick={() => handleOpenMovementModal('ENTRY')}
          >
            + Registrar Entrada
          </Button>

          <Button
            size="sm"
            variant="danger"
            icon={ArrowUpRight}
            onClick={() => handleOpenMovementModal('EXIT')}
          >
            - Registrar Salida
          </Button>
        </div>
      </div>

      {/* Tarjetas de Resumen Rápido del Día */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase">
            <ArrowDownLeft className="w-4 h-4" />
            <span>Ingresos Hoy</span>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-300 mt-2">
            +{formatNumber(stats.todayEntriesQty)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{stats.todayEntriesCount} transacciones</p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase">
            <ArrowUpRight className="w-4 h-4" />
            <span>Salidas Hoy</span>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-rose-300 mt-2">
            -{formatNumber(stats.todayExitsQty)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{stats.todayExitsCount} transacciones</p>
        </div>

        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase">
            <History className="w-4 h-4" />
            <span>Total Movimientos</span>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-2">
            {movements.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Historial acumulado</p>
        </div>
      </div>

      {/* Tabla Completa de Auditoría */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200">Historial Detallado</h3>
        <MovementHistoryTable movements={movements} />
      </div>

    </div>
  );
};
