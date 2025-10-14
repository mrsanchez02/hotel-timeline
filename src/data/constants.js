import { DayPilot } from "@daypilot/daypilot-lite-react";
import { processLiveData } from '../utils/dataProcessor';

// Process live data from JSON
const liveData = processLiveData();

// Export processed rooms from live data
export const rooms = liveData.rooms;

// Export processed statuses from live data
export const statuses = liveData.statuses;

// Export processed reservations from live data
export const initialBookings = liveData.reservations;
