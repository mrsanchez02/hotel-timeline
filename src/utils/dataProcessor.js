import { DayPilot } from "@daypilot/daypilot-lite-react";
import liveData from '../data_live.json';

/**
 * Process the live JSON data to extract rooms and reservations
 */
export const processLiveData = () => {
  try {
    // Navigate through the JSON structure
    const jsonData = liveData[0]?.JSONData?.[0];
    if (!jsonData) {
      throw new Error('Invalid JSON structure');
    }

    const roomsData = jsonData.rooms?.rooms || [];
    const reservationsData = jsonData.dataChart?.dataChart || [];

    return {
      rooms: processRooms(roomsData),
      reservations: processReservations(reservationsData),
      statuses: extractStatusesFromRooms(roomsData)
    };
  } catch (error) {
    console.error('Error processing live data:', error);
    return {
      rooms: [],
      reservations: [],
      statuses: {}
    };
  }
};

/**
 * Process rooms data from JSON
 */
const processRooms = (roomsData) => {
  return roomsData.map(room => ({
    id: room.id.toString(),
    name: room.text,
    type: mapRoomType(room.roomType),
    backgroundColor: room.backgroundColor,
    textColor: room.color,
    status: extractStatusFromColorStatus(room.roomColorStatus),
    originalRoomType: room.roomType,
    roomColorStatus: room.roomColorStatus
  }));
};

/**
 * Process reservations data from JSON
 */
const processReservations = (reservationsData) => {
  return reservationsData.map((reservation, index) => {
    // Safe date parsing
    const startDate = reservation.startDate || reservation.ArrivalDate;
    const endDate = reservation.endDate || reservation.DepartureDate;
    
    let parsedStart, parsedEnd;
    try {
      // Handle different date formats from JSON
      if (startDate) {
        parsedStart = new DayPilot.Date(startDate);
      } else {
        parsedStart = DayPilot.Date.today();
      }
      
      if (endDate) {
        parsedEnd = new DayPilot.Date(endDate);
      } else {
        parsedEnd = DayPilot.Date.today().addDays(1);
      }
    } catch (error) {
      console.warn('Error parsing dates for reservation:', reservation, error);
      parsedStart = DayPilot.Date.today();
      parsedEnd = DayPilot.Date.today().addDays(1);
    }
    
    return {
      id: reservation.GUID || `res_${index}`,
      resource: reservation.suitedId?.toString() || reservation.IdRoom?.toString(),
      start: parsedStart,
      end: parsedEnd,
      text: reservation.text || `Reserva ${reservation.ReservationCode}`,
      status: reservation.reservationStatus || 'confirmed',
      backColor: reservation.reservationColor || '#99ccff',
      textColor: reservation.reservationTextColor || '#003366',
      reservationCode: reservation.ReservationCode,
      guestName: reservation.text,
      arrivalDate: reservation.ArrivalDate,
      departureDate: reservation.DepartureDate
    };
  });
};

/**
 * Map room types from codes to display names
 */
const mapRoomType = (roomType) => {
  const typeMap = {
    'TR1': 'Estándar',
    'TR2': 'Deluxe',
    'TR3': 'Suite',
    'SUI': 'Suite',
    'DEL': 'Deluxe',
    'STD': 'Estándar'
  };
  
  return typeMap[roomType] || roomType;
};

/**
 * Extract status from roomColorStatus string
 */
const extractStatusFromColorStatus = (roomColorStatus) => {
  if (!roomColorStatus) return 'available';
  
  const status = roomColorStatus.toLowerCase();
  
  if (status.includes('occupied clean') || status.includes('oc')) return 'occupied_clean';
  if (status.includes('occupied dirty') || status.includes('od')) return 'occupied_dirty';
  if (status.includes('vacant clean') || status.includes('vc')) return 'vacant_clean';
  if (status.includes('vacant dirty') || status.includes('vd')) return 'vacant_dirty';
  if (status.includes('maintenance') || status.includes('mt')) return 'maintenance';
  if (status.includes('out of order') || status.includes('ooo')) return 'out_of_order';
  
  return 'available';
};

/**
 * Extract unique statuses from rooms data to create status legend
 */
const extractStatusesFromRooms = (roomsData) => {
  const statusMap = {};
  
  roomsData.forEach(room => {
    const status = extractStatusFromColorStatus(room.roomColorStatus);
    const displayText = room.roomColorStatus || status;
    
    statusMap[status] = {
      text: displayText,
      color: room.backgroundColor,
      textColor: room.color
    };
  });

  return statusMap;
};

/**
 * Get room display text in the format "Hab{name} - {type}"
 */
export const getRoomDisplayText = (room) => {
  const roomName = room.name || `Room ${room.id}`;
  const roomType = room.type || room.originalRoomType;
  return `${roomName} - ${roomType}`;
};