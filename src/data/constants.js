import { DayPilot } from "@daypilot/daypilot-lite-react";

// Define the list of rooms. Each room has an id and a display name. These
// correspond to the resources in the scheduler. You can add more rooms or
// adjust the labels as needed.
export const rooms = [
  { id: "A", name: "Habitación 101" },
  { id: "B", name: "Habitación 102" },
  { id: "C", name: "Habitación 103" },
  { id: "D", name: "Habitación 201" },
  { id: "E", name: "Habitación 202" },
  { id: "F", name: "Habitación 203" },
  { id: "G", name: "Habitación 301" },
  { id: "H", name: "Habitación 302" }
];

// Define booking statuses and their associated colors. These colors will be
// applied to the reservation bars in the timeline. Feel free to add
// additional statuses or adjust the colors to fit your use case.
export const statuses = {
  occupied: { text: "Ocupada", color: "#f44336" },    // red
  vacant: { text: "Vacante", color: "#4caf50" },      // green
  clean: { text: "Limpia", color: "#2196f3" },       // blue
  dirty: { text: "Sucia", color: "#ffeb3b" },       // yellow
  maintenance: { text: "En mantenimiento", color: "#9e9e9e" }
};

// Create some example bookings. In a real application this data would be
// fetched from a backend. Each booking must include an id, the id of the
// associated room, the start and end date/time, a label, and a status key
// referencing the statuses defined above.
export const initialBookings = [
  {
    id: 1,
    resource: "A",
    start: DayPilot.Date.today().addDays(-3).addHours(15),
    end: DayPilot.Date.today().addDays(-2).addHours(15),
    text: "Reserva - Juan Pérez",
    status: "occupied",
    guestName: "Juan Pérez",
    phone: "+34 600 123 456",
    email: "juan.perez@email.com",
    notes: "Cliente VIP, prefiere habitación con vista al mar"
  },
  {
    id: 2,
    resource: "B",
    start: DayPilot.Date.today().addDays(-1).addHours(15),
    end: DayPilot.Date.today().addHours(15),
    text: "Reserva - María García",
    status: "dirty",
    guestName: "María García",
    phone: "+34 611 234 567",
    email: "maria.garcia@email.com",
    notes: "Necesita cuna para bebé"
  },
  {
    id: 3,
    resource: "C",
    start: DayPilot.Date.today().addHours(15),
    end: DayPilot.Date.today().addDays(2).addHours(15),
    text: "Reserva - Carlos López",
    status: "maintenance",
    guestName: "Carlos López",
    phone: "+34 622 345 678",
    email: "carlos.lopez@email.com",
    notes: "Viaje de negocios, llegada tardía"
  },
  {
    id: 4,
    resource: "D",
    start: DayPilot.Date.today().addDays(1).addHours(15),
    end: DayPilot.Date.today().addDays(3).addHours(15),
    text: "Reserva - Ana Martín",
    status: "vacant",
    guestName: "Ana Martín",
    phone: "+34 633 456 789",
    email: "ana.martin@email.com",
    notes: "Luna de miel, decoración especial"
  },
  {
    id: 5,
    resource: "E",
    start: DayPilot.Date.today().addDays(2).addHours(15),
    end: DayPilot.Date.today().addDays(5).addHours(15),
    text: "Reserva - Pedro Ruiz",
    status: "clean",
    guestName: "Pedro Ruiz",
    phone: "+34 644 567 890",
    email: "pedro.ruiz@email.com",
    notes: "Estancia larga, descuento aplicado"
  },
  {
    id: 6,
    resource: "F",
    start: DayPilot.Date.today().addDays(3).addHours(15),
    end: DayPilot.Date.today().addDays(4).addHours(15),
    text: "Reserva - Laura Sánchez",
    status: "clean",
    guestName: "Laura Sánchez",
    phone: "+34 655 678 901",
    email: "laura.sanchez@email.com",
    notes: "Alérgica a plumas, almohadas sintéticas"
  },
  {
    id: 7,
    resource: "G",
    start: DayPilot.Date.today().addDays(-2).addHours(15),
    end: DayPilot.Date.today().addDays(1).addHours(15),
    text: "Reserva - Roberto Torres",
    status: "occupied",
    guestName: "Roberto Torres",
    phone: "+34 666 789 012",
    email: "roberto.torres@email.com",
    notes: "Familia con 2 niños, necesita cama supletoria"
  },
  {
    id: 8,
    resource: "H",
    start: DayPilot.Date.today().addDays(4).addHours(15),
    end: DayPilot.Date.today().addDays(7).addHours(15),
    text: "Reserva - Isabel Moreno",
    status: "vacant",
    guestName: "Isabel Moreno",
    phone: "+34 677 890 123",
    email: "isabel.moreno@email.com",
    notes: "Conferencia empresarial, facturación a empresa"
  },
  {
    id: 9,
    resource: "A",
    start: DayPilot.Date.today().addDays(6).addHours(15),
    end: DayPilot.Date.today().addDays(8).addHours(15),
    text: "Reserva - Miguel Fernández",
    status: "clean",
    guestName: "Miguel Fernández",
    phone: "+34 688 901 234",
    email: "miguel.fernandez@email.com",
    notes: "Cliente frecuente, descuento fidelidad"
  },
  {
    id: 10,
    resource: "B",
    start: DayPilot.Date.today().addDays(8).addHours(15),
    end: DayPilot.Date.today().addDays(12).addHours(15),
    text: "Reserva - Carmen Jiménez",
    status: "occupied",
    guestName: "Carmen Jiménez",
    phone: "+34 699 012 345",
    email: "carmen.jimenez@email.com",
    notes: "Vacaciones familiares, piscina infantil"
  }
];