// Formateadores de fecha, números y texto para el inventario

export const formatDate = (dateInput) => {
  if (!dateInput) return '-';
  
  let date;
  if (dateInput.toDate && typeof dateInput.toDate === 'function') {
    // Firestore Timestamp
    date = dateInput.toDate();
  } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return '-';
  }

  if (isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export const formatDateTime = (dateInput) => {
  if (!dateInput) return '-';
  
  let date;
  if (dateInput.toDate && typeof dateInput.toDate === 'function') {
    date = dateInput.toDate();
  } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return '-';
  }

  if (isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const formatTime = (dateInput) => {
  if (!dateInput) return '-';
  
  let date;
  if (dateInput.toDate && typeof dateInput.toDate === 'function') {
    date = dateInput.toDate();
  } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    date = new Date(dateInput);
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return '-';
  }

  if (isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const val = Number(num);
  // If whole integer, show no decimals unless requested
  if (Number.isInteger(val)) {
    return val.toLocaleString('es-CO');
  }
  return val.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
};

export const formatQuantityWithUnit = (quantity, unit = 'und') => {
  const formattedNumber = formatNumber(quantity);
  return `${formattedNumber} ${unit}`;
};

export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
