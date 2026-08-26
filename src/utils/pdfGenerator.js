import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatNumber, formatQuantityWithUnit, formatDate, formatDateTime, formatTime } from './formatters';

/**
 * Genera y descarga el Reporte Diario de Inventario en formato PDF
 * @param {Object} reportData Datos para el reporte
 * @param {string} reportData.date Fecha del reporte (YYYY-MM-DD)
 * @param {Array} reportData.products Lista de productos con stock actual
 * @param {Array} reportData.movements Lista de movimientos del día
 * @param {Object} reportData.summary Resumen de entradas, salidas y alertas
 * @param {Object} reportData.company Información de la empresa
 * @param {Object} reportData.user Información del usuario que genera el reporte
 */
export const generateDailyInventoryPDF = ({
  date,
  products = [],
  movements = [],
  summary = {},
  company = { name: 'Control Diario de Inventario - Alimentos' },
  user = { displayName: 'Administrador' }
}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Paleta de Colores
  const primaryColor = [5, 150, 105];   // Emerald 600 #059669
  const darkColor = [15, 23, 42];        // Slate 900 #0f172a
  const grayColor = [100, 116, 139];     // Slate 500 #64748b
  const lightBg = [248, 250, 252];       // Slate 50 #f8fafc
  const redColor = [225, 29, 72];        // Rose 600 #e11d48
  const greenColor = [16, 185, 129];     // Emerald 500 #10b981

  let currentY = 16;

  // 1. ENCABEZADO INSTITUCIONAL
  doc.setFillColor(...primaryColor);
  doc.rect(margin, currentY, 4, 18, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...darkColor);
  doc.text('INVENTARIO ZENIT, COCINA', margin + 8, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...grayColor);
  doc.text('Informe Oficial de Control Diario • Desarrollado por Wladimir Almeida', margin + 8, currentY + 12);

  // Fecha y Datos de emisión en la esquina superior derecha
  doc.setFontSize(9);
  doc.setTextColor(...darkColor);
  doc.text(`Fecha del Reporte: ${date || formatDate(new Date())}`, pageWidth - margin, currentY + 5, { align: 'right' });
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.text(`Generado: ${formatDateTime(new Date())}`, pageWidth - margin, currentY + 10, { align: 'right' });
  doc.text(`Responsable: ${user.displayName || 'Usuario'}`, pageWidth - margin, currentY + 14, { align: 'right' });

  currentY += 24;

  // 2. LÍNEA DIVISORIA
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 6;

  // 3. TARJETAS DE RESUMEN EJECUTIVO (KPIs)
  const cardWidth = (pageWidth - (margin * 2) - 9) / 4;
  const cardHeight = 16;

  // Calcular métricas si no vienen calculadas
  const totalProducts = products.length;
  const totalEntries = movements.filter(m => m.type === 'ENTRY').reduce((acc, m) => acc + Number(m.quantity || 0), 0);
  const totalExits = movements.filter(m => m.type === 'EXIT').reduce((acc, m) => acc + Number(m.quantity || 0), 0);
  const lowStockCount = products.filter(p => Number(p.currentStock || 0) <= Number(p.minStock || 0)).length;

  const kpis = [
    { label: 'Total Productos', value: totalProducts.toString(), color: darkColor },
    { label: 'Ingresos del Día', value: `+${formatNumber(totalEntries)}`, color: greenColor },
    { label: 'Salidas del Día', value: `-${formatNumber(totalExits)}`, color: redColor },
    { label: 'Bajo Stock Crítico', value: lowStockCount.toString(), color: lowStockCount > 0 ? redColor : greenColor }
  ];

  kpis.forEach((kpi, index) => {
    const x = margin + index * (cardWidth + 3);
    doc.setFillColor(...lightBg);
    doc.roundedRect(x, currentY, cardWidth, cardHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, currentY, cardWidth, cardHeight, 2, 2, 'S');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text(kpi.label, x + 3, currentY + 5);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...kpi.color);
    doc.text(kpi.value, x + 3, currentY + 12);
  });

  currentY += cardHeight + 8;

  // 4. TABLA DE MOVIMIENTOS DEL DÍA (ENTRADAS Y SALIDAS)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkColor);
  doc.text(`1. Registro de Movimientos del Día (${movements.length})`, margin, currentY);

  currentY += 3;

  const movementRows = movements.map(m => [
    formatTime(m.createdAt || m.timestamp || new Date()),
    m.productName || 'Producto',
    m.category || '-',
    m.type === 'ENTRY' ? 'ENTRADA' : 'SALIDA',
    `${m.type === 'ENTRY' ? '+' : '-'}${formatNumber(m.quantity)} ${m.unit || ''}`,
    `${formatNumber(m.previousStock)} -> ${formatNumber(m.newStock)}`,
    m.reason || (m.type === 'ENTRY' ? 'Ingreso' : 'Salida'),
    m.userName || 'Sistema'
  ]);

  if (movementRows.length === 0) {
    movementRows.push(['-', 'Sin movimientos registrados en este día', '-', '-', '-', '-', '-', '-']);
  }

  autoTable(doc, {
    startY: currentY,
    head: [['Hora', 'Producto', 'Categoría', 'Tipo', 'Cantidad', 'Stock (Ant -> Nuevo)', 'Motivo / Nota', 'Usuario']],
    body: movementRows,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: darkColor
    },
    columnStyles: {
      0: { cellWidth: 16 },
      1: { cellWidth: 36, fontStyle: 'bold' },
      2: { cellWidth: 22 },
      3: { cellWidth: 18, halign: 'center' },
      4: { cellWidth: 20, halign: 'right', fontStyle: 'bold' },
      5: { cellWidth: 24, halign: 'center' },
      6: { cellWidth: 30 },
      7: { cellWidth: 16 }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 3) {
        if (data.cell.raw === 'ENTRADA') {
          data.cell.styles.textColor = greenColor;
          data.cell.styles.fontStyle = 'bold';
        } else if (data.cell.raw === 'SALIDA') {
          data.cell.styles.textColor = redColor;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
    margin: { left: margin, right: margin }
  });

  currentY = doc.lastAutoTable.finalY + 8;

  // 5. TABLA DE BALANCE E INVENTARIO FINAL DISPONIBLE
  // Si no hay suficiente espacio en la página, autoTable añadirá página automáticamente
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...darkColor);
  doc.text(`2. Balance e Inventario Final Disponible (${products.length} productos)`, margin, currentY);

  currentY += 3;

  const productRows = products.map(p => {
    const isLowStock = Number(p.currentStock || 0) <= Number(p.minStock || 0);
    return [
      p.category || 'Otros',
      p.name,
      p.unit || 'und',
      formatNumber(p.initialStock || 0),
      formatNumber(p.minStock || 0),
      formatNumber(p.currentStock || 0),
      isLowStock ? 'CRÍTICO' : 'ÓPTIMO'
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Categoría', 'Producto', 'Unidad', 'Stock Inicial', 'Stock Mín.', 'Stock Actual', 'Estado']],
    body: productRows,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59], // Slate 800
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: darkColor
    },
    columnStyles: {
      0: { cellWidth: 26 },
      1: { cellWidth: 50, fontStyle: 'bold' },
      2: { cellWidth: 16, halign: 'center' },
      3: { cellWidth: 20, halign: 'right' },
      4: { cellWidth: 20, halign: 'right' },
      5: { cellWidth: 24, halign: 'right', fontStyle: 'bold' },
      6: { cellWidth: 26, halign: 'center' }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 6) {
        if (data.cell.raw === 'CRÍTICO') {
          data.cell.styles.textColor = redColor;
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = greenColor;
        }
      }
    },
    margin: { left: margin, right: margin }
  });

  currentY = doc.lastAutoTable.finalY + 14;

  // Si queda muy cerca del borde inferior, crear nueva página para la firma
  if (currentY > pageHeight - 35) {
    doc.addPage();
    currentY = 25;
  }

  // 6. BLOQUE DE FIRMA Y CONFORMIDAD
  const signatureWidth = 65;
  const sigX = margin + 10;
  
  doc.setDrawColor(148, 163, 184);
  doc.line(sigX, currentY + 15, sigX + signatureWidth, currentY + 15);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('Firma Responsable de Turno', sigX + (signatureWidth / 2), currentY + 19, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text(user.displayName || 'Encargado de Inventario', sigX + (signatureWidth / 2), currentY + 23, { align: 'center' });

  const sig2X = pageWidth - margin - signatureWidth - 10;
  doc.line(sig2X, currentY + 15, sig2X + signatureWidth, currentY + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('Firma Supervisor / Gerencia', sig2X + (signatureWidth / 2), currentY + 19, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Auditoría y Control', sig2X + (signatureWidth / 2), currentY + 23, { align: 'center' });

  // 7. PIE DE PÁGINA CON NÚMEROS DE PÁGINA
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(...grayColor);
    doc.text(
      `Página ${i} de ${totalPages} • Inventario Zenit, Cocina • Desarrollado por Wladimir Almeida`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Guardar archivo con nombre limpio y fecha
  const fileName = `Reporte_Inventario_${date || getTodayDateString()}.pdf`;
  doc.save(fileName);
  return fileName;
};
