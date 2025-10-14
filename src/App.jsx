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

function App() {
  // Use custom hook for reservations management
  const {
    bookings,
    selectedReservation,
    isModalOpen,
    modalMode,
    formData,
    openModal,
    closeModal,
    handleInputChange,
    handleSave,
    handleEventClick,
    handleEventMoved,
    handleEventResized
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
    const startDate = DayPilot.Date.today().firstDayOfMonth();
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
      resources: rooms.map(r => ({ id: r.id, name: r.name })),
      events: bookings.map(ev => ({
        id: ev.id,
        resource: ev.resource,
        start: ev.start,
        end: ev.end,
        text: ev.text,
        status: ev.status,
        backColor: statuses[ev.status]?.color || "#03a9f4",
        barColor: statuses[ev.status]?.color || "#03a9f4"
      })),
      // Update booking when it is moved (drag and drop)
      onEventMoved: handleEventMoved,
      // Update booking when it is resized (changing its duration)
      onEventResized: handleEventResized,
      // Customize the appearance before rendering each booking
      onBeforeEventRender: args => {
        const statusKey = args.data.status;
        if (statusKey && statuses[statusKey]) {
          args.data.backColor = statuses[statusKey].color;
          args.data.barColor = statuses[statusKey].color;
          args.data.toolTip = `${args.data.text} (${statuses[statusKey].text})`;
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
      />

      <Row>
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