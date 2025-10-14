/**
 * Get Bootstrap variant based on reservation status
 * @param {string} status - The reservation status
 * @returns {string} Bootstrap variant name
 */
export const getStatusVariant = (status) => {
  switch(status) {
    case 'occupied': return 'danger';
    case 'vacant': return 'success';
    case 'clean': return 'primary';
    case 'dirty': return 'warning';
    case 'maintenance': return 'secondary';
    default: return 'primary';
  }
};

/**
 * Format date for HTML date input (YYYY-MM-DD format)
 * @param {Date|DayPilot.Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date.toString());
  return d.toISOString().slice(0, 10); // Solo fecha, sin hora
};