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

/**
 * Get current room status based on active bookings
 * @param {string} roomId - Room ID to check
 * @param {Array} bookings - Array of all bookings
 * @param {Object} room - Room object with default status
 * @returns {string} Current room status
 */
export const getCurrentRoomStatus = (roomId, bookings, room) => {
  const now = new Date();
  
  // Find active booking for this room (current time is between start and end)
  const activeBooking = bookings.find(booking => {
    const start = new Date(booking.start.toString());
    const end = new Date(booking.end.toString());
    return booking.resource === roomId && start <= now && end >= now;
  });
  
  if (activeBooking) {
    return activeBooking.status;
  }
  
  // If no active booking, return room's default current status
  return room.currentStatus || 'vacant';
};

/**
 * Get room type display name
 * @param {string} type - Room type
 * @returns {string} Display name for room type
 */
export const getRoomTypeDisplay = (type) => {
  const types = {
    'standard': 'Estándar',
    'deluxe': 'Deluxe',
    'suite': 'Suite'
  };
  return types[type] || type;
};

/**
 * Get room status colors for enhanced styling
 * @param {string} status - Room status
 * @param {boolean} lighter - Whether to return a lighter shade
 * @returns {string} Color hex code
 */
export const getStatusColor = (status, lighter = false) => {
  const colors = {
    'available': lighter ? '#28a745' : '#198754',
    'occupied': lighter ? '#dc3545' : '#c82333',
    'maintenance': lighter ? '#ffc107' : '#e0a800',
    'cleaning': lighter ? '#17a2b8' : '#138496'
  };
  
  return colors[status] || (lighter ? '#6c757d' : '#495057');
};

/**
 * Get border colors for status indication
 * @param {string} status - Room status
 * @returns {string} Border color hex code
 */
export const getBorderColor = (status) => {
  const borderColors = {
    'available': '#20c997',
    'occupied': '#fd7e14',
    'maintenance': '#ffc107',
    'cleaning': '#0dcaf0'
  };
  
  return borderColors[status] || '#6c757d';
};