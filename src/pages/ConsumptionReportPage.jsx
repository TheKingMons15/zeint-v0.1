import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  TrendingUp, 
  UtensilsCrossed, 
  Scale, 
  AlertTriangle, 
  Calendar, 
  ChefHat, 
  DollarSign,
  PackageCheck,
  Search
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useInventory } from '../hooks/useInventory';
import { useToast } from '../hooks/useToast';
import { orderService } from '../services/orderService';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { getTodayDateString, formatNumber, formatDate } from '../utils/formatters';

export const ConsumptionReportPage = () => {
  const { user } = useAuth();
  const { products, movements } = useInventory();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [search, setSearch] = useState('');

  const companyId = user?.companyId || 'default_company';

  useEffect(() => {
    const unsub = orderService.subscribeOrders(companyId, (liveOrders) => {
      setOrders(liveOrders);
    });
    return () => unsub();
  }, [companyId]);

  // Filtrar pedidos por fecha
  const dateOrders = useMemo(() => {
    return orders.filter(o => {
      const orderDate = o.date || (typeof o.createdAt === 'string' ? o.createdAt.split('T')[0] : '');
      return orderDate === selectedDate && o.status !== 'CANCELLED';
    });
  }, [orders, selectedDate]);

  // Consolidar platos vendidos
  const dishesSummary = useMemo(() => {
    const map = {};
    dateOrders.forEach(order => {
      order.items?.forEach(item => {
        if (!map[item.name]) {
          map[item.name] = {
            name: item.name,
            category: item.category,
            price: item.price,
            quantity: 0,
            totalRevenue: 0,
            ingredients: item.ingredients || []
          };
        }
        map[item.name].quantity += item.quantity;
        map[item.name].totalRevenue += (item.price * item.quantity);
      });
    });
    return Object.values(map).sort((a, b) => b.quantity - a.quantity);
  }, [dateOrders]);

  // Consolidar ingredientes consumidos
  const ingredientsConsumed = useMemo(() => {
    const map = {};

    dateOrders.forEach(order => {
      order.items?.forEach(item => {
        const qty = item.quantity || 1;
        item.ingredients?.forEach(ing => {
          if (!map[ing.productName]) {
            const product = products.find(p => p.name.toLowerCase() === ing.productName.toLowerCase());
            map[ing.productName] = {
              productName: ing.productName,
              category: product?.category || 'Alimentos',
              unit: product?.unit || 'kg',
              currentStock: Number(product?.currentStock || 0),
              minStock: Number(product?.minStock || 0),
              totalGrams: 0,
              totalKg: 0
            };
          }
          const grams = (ing.grams || 0) * qty;
          map[ing.productName].totalGrams += grams;
          map[ing.productName].totalKg += (grams / 1000);
        });
      });
    });

    return Object.values(map).sort((a, b) => b.totalKg - a.totalKg);
  }, [dateOrders, products]);

  // Total ventas en platos
  const totalSalesRevenue = useMemo(() => {
    return dishesSummary.reduce((sum, d) => sum + d.totalRevenue, 0);
  }, [dishesSummary]);

  const totalDishesCount = useMemo(() => {
    return dishesSummary.reduce((sum, d) => sum + d.quantity, 0);
  }, [dishesSummary]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in pb-20">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
              Reporte Diario de Consumo en Cocina
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
              FICHAS TÉCNICAS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Balance exacto de platos servidos, ingredientes descontados y stock restante
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800 text-xs">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* KPIs del Día */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Platos Servidos"
          value={totalDishesCount}
          subtitle="En el turno seleccionado"
          icon={UtensilsCrossed}
          color="emerald"
        />

        <StatCard
          title="Facturación Platos"
          value={`$${totalSalesRevenue.toFixed(2)}`}
          subtitle="Ventas en sala"
          icon={DollarSign}
          color="sky"
        />

        <StatCard
          title="Insumos Descontados"
          value={ingredientsConsumed.length}
          subtitle="Productos afectados"
          icon={Scale}
          color="amber"
        />

        <StatCard
          title="Comandas del Día"
          value={dateOrders.length}
          subtitle="Mesas atendidas"
          icon={PackageCheck}
          color="slate"
        />
      </div>

      {/* Grid 2 Columnas: Platos Vendidos + Insumos Consumidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TABLA 1: PLATOS VENDIDOS */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-100">Platos Vendidos ({dishesSummary.length})</h3>
            </div>
            <span className="text-xs text-slate-400">Total: {totalDishesCount} unidades</span>
          </div>

          {dishesSummary.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No hay ventas de platos registradas en esta fecha.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {dishesSummary.map((dish, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <h5 className="text-xs font-bold text-slate-100">{dish.name}</h5>
                    <span className="text-[10px] text-slate-400">{dish.category} • ${dish.price.toFixed(2)} c/u</span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-400 block">
                      {dish.quantity}x
                    </span>
                    <span className="text-[11px] font-bold text-slate-300">
                      ${dish.totalRevenue.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TABLA 2: INSUMOS Y GRAMAJES CONSUMIDOS */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-slate-100">Ingredientes Consumidos por Ficha Técnica</h3>
            </div>
            <span className="text-xs text-slate-400">{ingredientsConsumed.length} insumos</span>
          </div>

          {ingredientsConsumed.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No hay consumos de ingredientes calculados en esta fecha.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {ingredientsConsumed.map((ing, idx) => {
                const isCritical = ing.currentStock <= ing.minStock;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-slate-100">{ing.productName}</h5>
                        {isCritical && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-rose-500/20 text-rose-300 rounded">
                            Bajo Stock
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Stock restante en bodega: <strong className="text-slate-200">{ing.currentStock} {ing.unit}</strong>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-rose-400 block">
                        -{ing.totalKg.toFixed(3)} {ing.unit}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({ing.totalGrams} g)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
