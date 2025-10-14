import React, { useState } from "react";
import { DayPilot, DayPilotScheduler } from "@daypilot/daypilot-lite-react";
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./App.css";

// Import components
import { Legend, ReservationModal, Toolbar } from './components';

// Import data and hooks
import { rooms, statuses } from './data/constants';
import { useReservations } from './hooks/useReservations';
import { formatDateForInput, getStatusVariant, getCurrentRoomStatus, getRoomTypeDisplay, getStatusColor, getBorderColor } from './utils/helpers';
import { getRoomDisplayText } from './utils/dataProcessor';

function App() {
  // Use custom hook for reservations management
  const {
    bookings,
    selectedReservation,
    isModalOpen,
    modalMode,
    formData,
    currentDate,
    openModal,
    closeModal,
    handleInputChange,
    handleSave,
    handleEventClick,
    handleEventMoved,
    handleEventResized,
    handleDateChange
  } = useReservations();

  // The view can be Day, Week, Month or Year. Changing the view updates
  // the number of days displayed and the time headers accordingly.
  const [view, setView] = useState("Month");

  // Reference to the DayPilotScheduler control so we can call its API (e.g.,
  // clearSelection). This is assigned in the ref callback below.
  const schedulerRef = React.useRef(null);

  // Determine the Scheduler configuration based on the current view.
  const computeSchedulerConfig = () => {
    // Determine the number of days shown for each view.
    let days;
    let scale;
    let timeHeaders;
    let startDate;

    switch (view) {
      case "Day":
        startDate = currentDate;
        break;
      case "Week":
        startDate = currentDate.firstDayOfWeek();
        break;
      case "Month":
        startDate = currentDate.firstDayOfMonth();
        break;
      case "Year":
        startDate = currentDate.firstDayOfYear();
        break;
      default:
        startDate = currentDate.firstDayOfMonth();
    }
    switch (view) {
      case "Day":
        days = 1;
        scale = "Day";
        timeHeaders = [
          { groupBy: "Day", format: "dddd, d MMMM yyyy" }
        ];
        break;
      case "Week":
        days = 7;
        scale = "Day";
        timeHeaders = [
          { groupBy: "Month", format: "MMMM yyyy" },
          { groupBy: "Day", format: "d" }
        ];
        break;
      case "Month":
        days = DayPilot.Date.today().daysInMonth();
        scale = "Day";
        timeHeaders = [
          { groupBy: "Month", format: "MMMM yyyy" },
          { groupBy: "Day", format: "d" }
        ];
        break;
      case "Year":
        days = 365;
        scale = "Day";
        timeHeaders = [
          { groupBy: "Year", format: "yyyy" },
          { groupBy: "Month", format: "MMM" }
        ];
        break;
      default:
        days = 7;
        scale = "Day";
        timeHeaders = [
          { groupBy: "Month", format: "MMMM yyyy" },
          { groupBy: "Day", format: "d" }
        ];
    }

    return {
      timeHeaders,
      scale,
      days,
      startDate,
      resources: rooms.map(r => ({ 
        id: r.id, 
        name: r.name,
        type: r.type,
        floor: r.floor,
        currentStatus: r.currentStatus
      })),
      events: bookings.map(ev => ({
        id: ev.id,
        resource: ev.resource,
        start: ev.start,
        end: ev.end,
        text: ev.text,
        status: ev.status,
        backColor: ev.backColor || "#99ccff",
        textColor: ev.textColor || "#003366",
        reservationCode: ev.reservationCode,
        guestName: ev.guestName
      })),
      // Update booking when it is moved (drag and drop)
      onEventMoved: handleEventMoved,
      // Update booking when it is resized (changing its duration)
      onEventResized: handleEventResized,
      // Customize the appearance before rendering each booking
      onBeforeEventRender: args => {
        // Use colors from the reservation data (dataChart)
        if (args.data.backColor) {
          args.data.backColor = args.data.backColor;
        }
        if (args.data.textColor) {
          args.data.color = args.data.textColor;
        }
        args.data.toolTip = `${args.data.text} (${args.data.status || 'Reserva'})`;
      },
      // Customize the appearance of room headers
      onBeforeRowHeaderRender: args => {
        const room = rooms.find(r => r.id === args.row.id);
        if (room) {
          // Use the backgroundColor and textColor from the JSON data
          const backgroundColor = room.backgroundColor || '#cccccc';
          const textColor = room.textColor || '#ffffff';
          const displayText = getRoomDisplayText(room);
          
          args.row.html = `
            <div style="
              margin: 0;
              padding: 0; 
              height: 100%; 
              width: 100%;
              display: flex; 
              align-items: center;
              justify-content: center;
              background-color: ${backgroundColor};
              color: ${textColor};
              font-weight: 600;
              font-size: 14px;
              text-align: center;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
              box-sizing: border-box;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
            ">
              ${displayText}
            </div>
          `;
        }
      }
    };
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h1 className="text-center mb-4 text-primary">
            <i className="bi bi-calendar-event me-2"></i>
            Gestión de reservas de habitaciones
          </h1>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col>
          <Legend statuses={statuses} />
        </Col>
      </Row>
      
          <Toolbar
            view={view}
            onViewChange={setView}
            onNewReservation={() => openModal('new')}
            selectedReservation={selectedReservation}
            onViewReservation={() => openModal('view', selectedReservation)}
            onEditReservation={() => openModal('edit', selectedReservation)}
            currentDate={currentDate}
            onDateChange={handleDateChange}
          />      <Row>
        <Col>
          <div className="scheduler-container">
            <DayPilotScheduler
              {...computeSchedulerConfig()}
              ref={schedulerRef}
              heightSpec="Max"
              rowHeaderWidth={150}
              onEventClick={handleEventClick}
              // timeRangeSelectedHandling="Enabled"
              // eventMoveHandling="Update"
              // eventResizeHandling="Update"
              // eventDeleteHandling="Update"
            />
          </div>
        </Col>
      </Row>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        formData={formData}
        onInputChange={handleInputChange}
        onSave={handleSave}
        rooms={rooms}
        statuses={statuses}
      />
    </Container>
  );
}

export default App;