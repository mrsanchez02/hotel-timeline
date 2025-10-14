import { useState } from 'react';
import { DayPilot } from "@daypilot/daypilot-lite-react";
import { initialBookings } from '../data/constants';

/**
 * Custom hook for managing reservations state and operations
 */
export const useReservations = () => {
  // State for bookings
  const [bookings, setBookings] = useState(initialBookings);
  
  // State for modal and form management
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'new', 'edit', 'view'
  const [formData, setFormData] = useState({
    id: null,
    resource: "A",
    start: DayPilot.Date.today().addHours(15), // 3pm entrada
    end: DayPilot.Date.today().addDays(1).addHours(15), // 3pm salida al día siguiente
    text: "",
    status: "occupied",
    guestName: "",
    phone: "",
    email: "",
    notes: ""
  });

  // Reset form data to default values
  const resetFormData = () => {
    setFormData({
      id: null,
      resource: "A",
      start: DayPilot.Date.today().addHours(15),
      end: DayPilot.Date.today().addDays(1).addHours(15),
      text: "",
      status: "occupied",
      guestName: "",
      phone: "",
      email: "",
      notes: ""
    });
  };

  // Open modal with specified mode and reservation data
  const openModal = (mode, reservation = null) => {
    setModalMode(mode);
    if (mode === 'new') {
      resetFormData();
    } else if (reservation) {
      setFormData({ ...reservation });
    }
    setIsModalOpen(true);
  };

  // Close modal and reset state
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
    resetFormData();
  };

  // Handle input changes in the form
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      text: field === 'guestName' ? `Reserva - ${value}` : prev.text
    }));
  };

  // Save reservation (create or update)
  const handleSave = () => {
    if (modalMode === 'new') {
      const newId = bookings.length ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
      const newBooking = {
        ...formData,
        id: newId,
        text: `Reserva - ${formData.guestName}`
      };
      setBookings(prev => [...prev, newBooking]);
    } else if (modalMode === 'edit') {
      setBookings(prev => prev.map(b =>
        b.id === formData.id ? { ...formData, text: `Reserva - ${formData.guestName}` } : b
      ));
    }
    closeModal();
  };

  // Handle event click on scheduler
  const handleEventClick = (args) => {
    const clickedReservation = bookings.find(booking => booking.id === args.e.data.id);
    if (clickedReservation) {
      console.log("Reserva seleccionada:", JSON.stringify(clickedReservation, null, 2));
      setSelectedReservation(clickedReservation);
    }
  };

  // Update booking when moved
  const handleEventMoved = (args) => {
    const { e, newStart, newEnd, newResource } = args;
    setBookings(prev => prev.map(b =>
      b.id === e.data.id
        ? { ...b, start: newStart, end: newEnd, resource: newResource }
        : b
    ));
  };

  // Update booking when resized
  const handleEventResized = (args) => {
    const { e, newStart, newEnd } = args;
    setBookings(prev => prev.map(b =>
      b.id === e.data.id
        ? { ...b, start: newStart, end: newEnd }
        : b
    ));
  };

  return {
    // State
    bookings,
    selectedReservation,
    isModalOpen,
    modalMode,
    formData,
    
    // Actions
    openModal,
    closeModal,
    handleInputChange,
    handleSave,
    handleEventClick,
    handleEventMoved,
    handleEventResized,
    setBookings
  };
};