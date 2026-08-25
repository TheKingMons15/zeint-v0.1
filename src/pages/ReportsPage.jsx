import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle,
  Printer,
  Sparkles
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { generateDailyInventoryPDF } from '../utils/pdfGenerator';
import { getTodayDateString, formatDate, formatNumber } from '../utils/formatters';

export const ReportsPage = () => {
  const { products, movements } = useInventory();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [generating, setGenerating] = useState(false);

  // Filtrar movimientos de la fecha seleccionada
  const dateMovements = useMemo(() => {
    return movements.filter(m => {
      if (!m.date && !m.createdAt) return false;
      if (m.date === selectedDate) return true;
      if (typeof m.createdAt === 'string' && m.createdAt.startsWith(selectedDate)) return true;
      return false;
    });
  }, [movements, selectedDate]);

  // Cálculos para el reporte
  const reportStats = useMemo(() => {
    const totalEntriesQty = dateMovements
      .filter(m => m.type === 'ENTRY')
      .reduce((sum, m) => sum + Number(m.quantity || 0), 0);

    const totalExitsQty = dateMovements
      .filter(m => m.type === 'EXIT')
      .reduce((sum, m) => sum + Number(m.quantity || 0), 0);

    const entriesCount = dateMovements.filter(m => m.type === 'ENTRY').length;
    const exitsCount = dateMovements.filter(m => m.type === 'EXIT').length;

    const lowStockCount = products.filter(p => Number(p.currentStock || 0) <= Number(p.minStock || 0)).length;

    return {
      totalEntriesQty,
      totalExitsQty,
      entriesCount,
      exitsCount,
      lowStockCount,
      totalProducts: products.length
    };
  }, [dateMovements, products]);

  const handleDownloadPDF = () => {
    setGenerating(true);
    try {
      const fileName = generateDailyInventoryPDF({
        date: selectedDate,
        products,
        movements: dateMovements,
        summary: reportStats,
        company: {
          name: import.meta.env.VITE_COMPANY_NAME || 'Control Diario de Inventario - Alimentos'
        },
        user: {
          displayName: user?.displayName || 'Administrador de Turno'
        }
      });
      showToast(`Reporte ${fileName} descargado correctamente`, 'success');
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast('Error al generar el reporte en PDF', 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            Reporte Diario de Inventario (PDF)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Generación oficial de informe con entradas, salidas, balance y firma de supervisión
          </p>
        </div>

        {/* Acciones de Fecha y Descarga */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <Button
            size="sm"
            onClick={handleDownloadPDF}
            loading={generating}
            icon={Download}
            variant="primary"
          >
            Descargar PDF Oficial
          </Button>
        </div>
      </div>

      {/* Tarjeta de Resumen Ejecutivo del Reporte */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Vista Previa del Informe Diario • {selectedDate}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Auditoría generada para {user?.displayName || 'Usuario'}
            </p>
          </div>

          <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Formato A4 Listo para Imprimir
          </span>
        </div>

        {/* KPIs del Reporte */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <p className="text-xs text-slate-400 uppercase font-semibold">Total Alimentos</p>
            <p className="text-xl font-black text-slate-100 mt-1">{reportStats.totalProducts}</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
            <p className="text-xs text-emerald-400 uppercase font-semibold">Entradas del Día</p>
            <p className="text-xl font-black text-emerald-300 mt-1">+{formatNumber(reportStats.totalEntriesQty)}</p>
            <p className="text-[10px] text-slate-400">{reportStats.entriesCount} transacciones</p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30">
            <p className="text-xs text-rose-400 uppercase font-semibold">Salidas del Día</p>
            <p className="text-xl font-black text-rose-300 mt-1">-{formatNumber(reportStats.totalExitsQty)}</p>
            <p className="text-[10px] text-slate-400">{reportStats.exitsCount} transacciones</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
            <p className="text-xs text-amber-400 uppercase font-semibold">Alertas Bajo Stock</p>
            <p className="text-xl font-black text-amber-300 mt-1">{reportStats.lowStockCount}</p>
            <p className="text-[10px] text-slate-400">{reportStats.lowStockCount === 0 ? 'Sin alertas' : 'Crítico'}</p>
          </div>
        </div>

        {/* Sección 1: Entradas y Salidas del Día */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <span>1. Movimientos del Día ({dateMovements.length})</span>
          </h4>

          {dateMovements.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 bg-slate-950/40 rounded-xl border border-slate-800">
              No hubo entradas ni salidas registradas en esta fecha ({selectedDate}).
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="py-2.5 px-3">Tipo</th>
                    <th className="py-2.5 px-3">Producto</th>
                    <th className="py-2.5 px-3 text-right">Cantidad</th>
                    <th className="py-2.5 px-3 text-center">Stock</th>
                    <th className="py-2.5 px-3">Motivo</th>
                    <th className="py-2.5 px-3">Usuario</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {dateMovements.map(m => (
                    <tr key={m.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3">
                        <span className={`font-bold ${m.type === 'ENTRY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {m.type === 'ENTRY' ? 'ENTRADA' : 'SALIDA'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{m.productName}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-100">
                        {formatNumber(m.quantity)} {m.unit}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-400">
                        {formatNumber(m.previousStock)} → {formatNumber(m.newStock)}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">{m.reason}</td>
                      <td className="py-2.5 px-3 text-slate-400">{m.userName || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sección 2: Balance e Inventario Final */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-200">
            2. Balance e Inventario Final Disponible ({products.length} productos)
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-64 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-950">
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="py-2.5 px-3">Categoría</th>
                  <th className="py-2.5 px-3">Producto</th>
                  <th className="py-2.5 px-3 text-center">Unidad</th>
                  <th className="py-2.5 px-3 text-right">Stock Mínimo</th>
                  <th className="py-2.5 px-3 text-right">Stock Actual</th>
                  <th className="py-2.5 px-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map(p => {
                  const isLow = Number(p.currentStock || 0) <= Number(p.minStock || 0);
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 text-slate-400">{p.category}</td>
                      <td className="py-2 px-3 font-semibold text-slate-200">{p.name}</td>
                      <td className="py-2 px-3 text-center text-slate-400">{p.unit}</td>
                      <td className="py-2 px-3 text-right text-slate-400">{formatNumber(p.minStock)}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-100">{formatNumber(p.currentStock)}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isLow ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {isLow ? 'BAJO STOCK' : 'ÓPTIMO'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botón Flotante / Inferior de Descarga */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <Button
            onClick={handleDownloadPDF}
            loading={generating}
            icon={Download}
            variant="primary"
          >
            Descargar Documento PDF Completo
          </Button>
        </div>

      </div>

    </div>
  );
};
