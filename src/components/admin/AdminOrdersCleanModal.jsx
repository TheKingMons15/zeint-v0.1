import React, { useState, useMemo } from 'react';
import { 
  Trash2, 
  Search, 
  X, 
  AlertTriangle, 
  CheckSquare, 
  Square, 
  Clock, 
  UtensilsCrossed, 
  Wine, 
  ChefHat, 
  CheckCircle2, 
  ShieldAlert,
  Sparkles,
  Filter
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { orderService, ORDER_STATUS } from '../../services/orderService';
import { formatTime, formatDate } from '../../utils/formatters';

export const AdminOrdersCleanModal = ({
  isOpen,
  onClose,
  orders = [],
  user,
  onSuccess
}) => {
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTestOnly, setFilterTestOnly] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Identificar pedidos de prueba por prefijo, nombres de mesa o banderas
  const isTestOrder = (order) => {
    const id = (order.id || '').toLowerCase();
    const table = (order.table || '').toLowerCase();
    const notes = (order.notes || '').toLowerCase();
    const waiter = (order.waiterName || '').toLowerCase();

    return (
      id.includes('test') ||
      id.includes('demo') ||
      notes.includes('prueba') ||
      notes.includes('test') ||
      table.includes('prueba') ||
      table.includes('test') ||
      order.name?.toLowerCase().includes('test')
    );
  };

  // Filtrado de pedidos
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (filterTestOnly && !isTestOrder(order)) return false;

      const q = search.toLowerCase().trim();
      if (!q) return true;

      const matchTable = order.table?.toLowerCase().includes(q);
      const matchWaiter = order.waiterName?.toLowerCase().includes(q);
      const matchId = order.id?.toLowerCase().includes(q);
      const matchItem = order.items?.some(i => i.name?.toLowerCase().includes(q));

      return matchTable || matchWaiter || matchId || matchItem;
    });
  }, [orders, filterTestOnly, search]);

  const testOrdersCount = useMemo(() => {
    return orders.filter(isTestOrder).length;
  }, [orders]);

  // Selección individual
  const handleToggleSelect = (orderId) => {
    setSelectedOrderIds(prev => 
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  // Seleccionar todos los filtrados
  const handleSelectAllFiltered = () => {
    if (selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    }
  };

  // Seleccionar automáticamente todos los pedidos de prueba
  const handleSelectAllTestOrders = () => {
    const testIds = orders.filter(isTestOrder).map(o => o.id);
    setSelectedOrderIds(testIds);
  };

  // Ejecutar eliminación masiva
  const handleConfirmDelete = async () => {
    if (selectedOrderIds.length === 0 || deleting) return;

    setDeleting(true);
    try {
      await orderService.deleteOrders(selectedOrderIds, user);
      setSelectedOrderIds([]);
      setShowConfirmModal(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Error al eliminar pedidos:", err);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return { label: '🟡 Pendiente', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case ORDER_STATUS.PREPARING:
        return { label: '🔵 En Preparación', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      case ORDER_STATUS.READY:
        return { label: '🟢 Listo', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case ORDER_STATUS.DELIVERED:
        return { label: '⚫ Entregado', color: 'bg-slate-800 text-slate-400 border-slate-700' };
      case ORDER_STATUS.CANCELLED:
        return { label: '🔴 Cancelado', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      default:
        return { label: status, color: 'bg-slate-800 text-slate-400 border-slate-700' };
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal
        isOpen={isOpen && !showConfirmModal}
        onClose={onClose}
        title="Gestión y Depuración de Pedidos (Exclusivo Administración)"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4 max-h-[80vh] flex flex-col justify-between">
          
          {/* Encabezado Explicativo */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  Mantenimiento de Base de Datos
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-800">
                  {user?.displayName || 'Administrador'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Selecciona los pedidos creados durante pruebas para eliminarlos definitivamente y dejar el sistema listo para operar.
              </p>
            </div>

            {testOrdersCount > 0 && (
              <button
                type="button"
                onClick={handleSelectAllTestOrders}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black hover:bg-amber-500/30 transition-all shrink-0"
              >
                ⚡ Seleccionar {testOrdersCount} Pedidos de Prueba
              </button>
            )}
          </div>

          {/* Filtros y Buscador */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por mesa, mesero, ID o plato..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterTestOnly(!filterTestOnly)}
                className={`flex-1 px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  filterTestOnly
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-black'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Solo Pruebas ({testOrdersCount})</span>
              </button>

              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 text-xs font-bold whitespace-nowrap"
              >
                {selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0 ? 'Deseleccionar' : 'Todos'}
              </button>
            </div>
          </div>

          {/* Tabla de Comandas */}
          <div className="flex-1 border border-slate-800 rounded-2xl overflow-y-auto max-h-80 bg-slate-950/60 divide-y divide-slate-900">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No se encontraron pedidos con el criterio de búsqueda.
              </div>
            ) : (
              filteredOrders.map(order => {
                const isSelected = selectedOrderIds.includes(order.id);
                const badge = getStatusBadge(order.status);
                const isTest = isTestOrder(order);

                return (
                  <div
                    key={order.id}
                    onClick={() => handleToggleSelect(order.id)}
                    className={`p-3 flex items-center justify-between gap-3 text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-950/30 border-l-4 border-rose-500'
                        : 'hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSelect(order.id);
                        }}
                        className={`p-1 rounded-lg transition-colors shrink-0 ${
                          isSelected ? 'text-rose-400' : 'text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </button>

                      {/* Detalles del Pedido */}
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-white text-sm">{order.table}</span>
                          <span className={`px-2 py-0.2 rounded text-[10px] font-black uppercase border ${badge.color}`}>
                            {badge.label}
                          </span>
                          {isTest && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-950 text-amber-300 border border-amber-500/40">
                              ⚡ Prueba
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono">
                            ID: {order.id?.substring(0, 15)}...
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 truncate">
                          {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>

                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                          <span>Por: <strong className="text-slate-300">{order.waiterName || 'Sala'}</strong></span>
                          <span>•</span>
                          <span>{order.date || formatTime(order.createdAt)}</span>
                          {order.notes && (
                            <>
                              <span>•</span>
                              <span className="text-amber-300 truncate max-w-xs">"{order.notes}"</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-emerald-400 font-mono block">
                        ${Number(order.total || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Barra Inferior con Botón de Eliminar */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              <strong className="text-white">{selectedOrderIds.length}</strong> pedido(s) seleccionado(s) de {filteredOrders.length}
            </span>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Cerrar
              </Button>
              <Button
                variant="danger"
                disabled={selectedOrderIds.length === 0}
                onClick={() => setShowConfirmModal(true)}
                icon={Trash2}
                className="bg-rose-600 hover:bg-rose-500 text-xs font-black shadow-lg shadow-rose-950/60"
              >
                Eliminar {selectedOrderIds.length} Pedido(s)
              </Button>
            </div>
          </div>

        </div>
      </Modal>

      {/* Modal de Confirmación Crítica de Eliminación */}
      {showConfirmModal && (
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="⚠️ Confirmación de Eliminación Definitiva"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-rose-500/20 border-2 border-rose-500/60 text-rose-200 text-xs space-y-1.5">
              <p className="font-black text-white text-sm">
                ¿Estás seguro de que deseas eliminar permanentemente {selectedOrderIds.length} pedido(s)?
              </p>
              <p className="leading-relaxed">
                Esta acción eliminará los documentos de Firestore y no podrá deshacerse. Los pedidos eliminados no contarán en facturación, ventas ni reportes.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
              <span>Usuario responsable: </span>
              <strong className="text-slate-200">{user?.displayName || 'Administrador'} ({user?.email})</strong>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowConfirmModal(false)} disabled={deleting}>
                Cancelar
              </Button>
              <Button 
                variant="danger" 
                onClick={handleConfirmDelete} 
                loading={deleting} 
                icon={Trash2}
                className="bg-rose-600 hover:bg-rose-500 font-black text-xs"
              >
                Confirmar y Eliminar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
