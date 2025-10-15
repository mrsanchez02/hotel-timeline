import React, { useState, useEffect } from "react";
import { DayPilot, DayPilotScheduler } from "@daypilot/daypilot-lite-react";
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./App.css";

// Import components
import { Legend, ReservationModal, Toolbar } from './components';

// Import data and hooks
import { useReservations } from './hooks/useReservations';
import { formatDateForInput, getStatusVariant, getCurrentRoomStatus, getRoomTypeDisplay, getStatusColor, getBorderColor } from './utils/helpers';
import { getRoomDisplayText } from './utils/dataProcessor';
import API from "./utils/api";

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
    handleDateChange,
    setBookings
  } = useReservations();

  // The view can be Day, Week, Month or Year. Changing the view updates
  // the number of days displayed and the time headers accordingly.
  const [view, setView] = useState("Month");

  // State for remote data
  const [roomsData, setRoomsData] = useState([]);
  const [reservationsData, setReservationsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Calcular el primer y último día del mes para asegurar que se cargen todos los datos del mes
    const startDate = currentDate.firstDayOfMonth().toString('MM-dd-yyyy');
    const endDate = currentDate.firstDayOfMonth().addMonths(1).addDays(-1).toString('MM-dd-yyyy');
    bindDataRemote({ startDate, endDate });
    
    return () => {
      setReservationsData([]);
      setRoomsData([]);
    }
  }, [currentDate])

  // Refresh data when view changes significantly  
  useEffect(() => {
    if (view === 'Year') {
      const startDate = currentDate.firstDayOfYear().toString('MM-dd-yyyy');
      const endDate = currentDate.firstDayOfYear().addYears(1).addDays(-1).toString('MM-dd-yyyy');
      bindDataRemote({ startDate, endDate });
    }
  }, [view])

  // Reference to the DayPilotScheduler control so we can call its API (e.g.,
  // clearSelection). This is assigned in the ref callback below.
  const schedulerRef = React.useRef(null);

  const bindDataRemote = async (filter) => {
    setIsLoading(true);
    const { startDate, endDate } = filter;

    try {
      console.log('🚀 Fetching data for period:', { startDate, endDate });
      
      // Try to use real API first
      let results;
      try {
        // Simulated user data - in real app this would come from auth context
        const user = { IdBusinessUnit: 34 };
        
        const queryString = `IdUser=${6}&token=${214669191}`;
        const queryData = {
          Data: `@IdBusinessUnit=${user.IdBusinessUnit}, @StartDate='${startDate}', @EndDate='${endDate}'`,
        };
        
        const request = await API.postAction(
          "/api/Rooms/RoomOccupation?" + queryString,
          queryData
        );
        
        results = JSON.parse(request.data[0].JSONData);
        console.log("🚀 ~ bindDataRemote ~ API results:", results);
        
      } catch (apiError) {
        console.error('❌ API call failed:', apiError);
        throw apiError; // Re-throw to be handled by outer catch
      }
      
      if (!results || !results[0] || !results[0].rooms || !results[0].rooms.rooms) {
        console.warn('No rooms data found in results');
        setRoomsData([]);
        setReservationsData([]);
        return;
      }

      console.log("🚀 ~ bindDataRemote ~ rooms:", results[0].rooms.rooms);
      console.log("🚀 ~ bindDataRemote ~ reservations:", results[0].dataChart);

      // Process rooms data
      const processedRooms = results[0].rooms.rooms.map(room => ({
        id: room.id?.toString() || room.text,
        name: room.text || room.name,
        type: room.roomType ? (room.roomType === 'TR1' ? 'Estándar' : 
                              room.roomType === 'TR2' ? 'Deluxe' : 
                              room.roomType === 'TR3' ? 'Suite' : room.roomType) : 'Estándar',
        backgroundColor: room.backgroundColor || '#cccccc',
        color: room.color || '#ffffff',
        status: room.roomColorStatus?.toLowerCase().includes('occupied') ? 'occupied' : 
               room.roomColorStatus?.toLowerCase().includes('vacant') ? 'vacant' : 'available',
        roomColorStatus: room.roomColorStatus,
        originalRoomType: room.roomType
      }));

      // Process reservations data - handle both null dataChart and nested structure
      let reservationsArray = [];
      if (results[0].dataChart && results[0].dataChart.dataChart) {
        reservationsArray = results[0].dataChart.dataChart;
      } else if (results[0].dataChart && Array.isArray(results[0].dataChart)) {
        reservationsArray = results[0].dataChart;
      } else {
        console.warn('No reservations data found in API response');
        reservationsArray = [];
      }

      const processedReservations = reservationsArray.map(reservation => ({
        id: reservation.GUID || reservation.id || Math.random().toString(),
        resource: reservation.suitedId?.toString() || reservation.IdRoom?.toString() || reservation.resource,
        start: reservation.startDate ? new DayPilot.Date(reservation.startDate) : 
               reservation.ArrivalDate ? new DayPilot.Date(reservation.ArrivalDate) : 
               reservation.start || DayPilot.Date.today(),
        end: reservation.endDate ? new DayPilot.Date(reservation.endDate) : 
             reservation.DepartureDate ? new DayPilot.Date(reservation.DepartureDate) : 
             reservation.end || DayPilot.Date.today().addDays(1),
        text: reservation.text || `Reserva ${reservation.ReservationCode}`,
        status: reservation.reservationStatus || reservation.status || 'confirmed',
        backColor: reservation.reservationColor || '#99ccff',
        textColor: reservation.reservationTextColor || '#003366',
        reservationCode: reservation.ReservationCode,
        guestName: reservation.text
      }));

      setRoomsData(processedRooms);
      setReservationsData(processedReservations);
      setBookings(processedReservations); // Update hook's bookings state

      console.log('✅ Data loaded successfully');

    } catch (error) {
      console.error('❌ Error loading data:', error);
      // Keep empty arrays on error
      setRoomsData([]);
      setReservationsData([]);
    } finally {
      setIsLoading(false);
    }
  };

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
      // case "Day":
      //   days = 1;
      //   scale = "Day";
      //   timeHeaders = [
      //     { groupBy: "Day", format: "dddd, d MMMM yyyy" }
      //   ];
      //   break;
      // case "Week":
      //   days = 7;
      //   scale = "Day";
      //   timeHeaders = [
      //     { groupBy: "Month", format: "MMMM yyyy" },
      //     { groupBy: "Day", format: "d" }
      //   ];
      //   break;
      case "Month":
        days = DayPilot.Date.today().daysInMonth();
        scale = "Day";
        timeHeaders = [
          { groupBy: "Month", format: "MMMM yyyy" },
          { groupBy: "Day", format: "d" }
        ];
        break;
      // case "Year":
      //   days = 365;
      //   scale = "Day";
      //   timeHeaders = [
      //     { groupBy: "Year", format: "yyyy" },
      //     { groupBy: "Month", format: "MMM" }
      //   ];
      //   break;
      default:
        // days = 7;
        // scale = "Day";
        // timeHeaders = [
        //   { groupBy: "Month", format: "MMMM yyyy" },
        //   { groupBy: "Day", format: "d" }
        // ];
    }

    return {
      timeHeaders,
      scale,
      days,
      startDate,
      resources: roomsData.map(r => ({ 
        id: r.id, 
        name: r.name || r.text,
        type: r.type,
        floor: r.floor,
        currentStatus: r.currentStatus || r.status,
        backgroundColor: r.backgroundColor,
        textColor: r.color || r.textColor
      })),
      events: reservationsData.map(ev => {
        // console.log("🚀 ~ computeSchedulerConfig ~ ev:", ev);
        
        const eventConfig = {
          id: ev.id,
          resource: ev.resource,
          start: ev.start,
          end: ev.end,
          text: ev.text,
          status: ev.status,
          backColor: ev.backColor || "#99ccff",
          textColor: ev.textColor || ev.color || "#003366",
          color: ev.textColor || ev.color || "#003366", // Try both properties
          fontColor: ev.textColor || ev.color || "#003366", // Alternative property
          reservationCode: ev.reservationCode,
          guestName: ev.guestName
        };
        
        // console.log("🎨 ~ Final event config:", {
        //   id: eventConfig.id,
        //   text: eventConfig.text,
        //   backColor: eventConfig.backColor,
        //   textColor: eventConfig.textColor,
        //   color: eventConfig.color,
        //   fontColor: eventConfig.fontColor
        // });
        
        return eventConfig;
      }),
      eventHeight: 20,
      durationBarVisible: false,
      timeRangeSelectedHandling: "Disabled",
      eventMoveHandling: "Disabled",
      eventResizeHandling: "Disabled",
      eventDeleteHandling: "Disabled",
      // Update booking when it is moved (drag and drop)
      onEventMoved: handleEventMoved,
      // Update booking when it is resized (changing its duration)
      onEventResized: handleEventResized,
      // Customize the appearance before rendering each booking
      onBeforeEventRender: args => {
        // console.log("� BEFORE EVENT RENDER - Initial:", {
        //   id: args.data.id,
        //   text: args.data.text,
        //   backColor: args.data.backColor,
        //   textColor: args.data.textColor,
        //   color: args.data.color,
        //   fontColor: args.data.fontColor
        // });
        
        // Use colors from the reservation data (dataChart)
        if (args.data.backColor) {
          args.data.backColor = args.data.backColor;
        }
        
        if (args.data.textColor) {
          // Try multiple properties to force text color
          args.data.color = args.data.textColor;
          args.data.fontColor = args.data.textColor;
          args.data.textColor = args.data.textColor;
          
          // Additional DayPilot properties
          args.data.foreColor = args.data.textColor;
          args.data.borderColor = args.data.textColor;
          
          // FORZAR EL HTML DIRECTAMENTE CON ESTILO INLINE
          args.html = `<div style="color: ${args.data.textColor} !important; height: 100%; display: flex; align-items: center; padding: 0 5px;">${args.data.text}</div>`;
        }
        
        // console.log("🔥 BEFORE EVENT RENDER - Final:", {
        //   id: args.data.id,
        //   text: args.data.text,
        //   backColor: args.data.backColor,
        //   textColor: args.data.textColor,
        //   color: args.data.color,
        //   fontColor: args.data.fontColor,
        //   foreColor: args.data.foreColor
        // });
        
        // if (args.html) {
          // console.log("🎨 CUSTOM HTML:", args.html);
        // }
        
        args.data.toolTip = `${args.data.text} (${args.data.status || 'Reserva'})`;
      },
      // Highlight weekend time headers
      onBeforeTimeHeaderRender: args => {
        // Only apply weekend styling to day headers (level 1), not month headers (level 0)
        // Level 0 = Month header, Level 1 = Day header
        const isDayHeader = args.header.level === 1;
        
        // Debug logging (remove after testing)
        console.log('🔍 Header debug:', {
          html: args.header.html,
          start: args.header.start.toString(),
          level: args.header.level,
          isDayHeader
        });
        
        if (isDayHeader) {
          const date = new DayPilot.Date(args.header.start);
          const dayOfWeek = date.dayOfWeek(); // 0 = Sunday, 6 = Saturday
          
          if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
            console.log('✅ Applying weekend styling to day:', date.toString("d"));
            args.header.cssClass = "weekend-header";
            args.header.backColor = "#ffebee"; // Light red background
            args.header.fontColor = "#c62828"; // Dark red text
            args.header.fontBold = true;
          }
        }
      },
      // Highlight weekend cells
      onBeforeCellRender: args => {
        const date = new DayPilot.Date(args.cell.start);
        const dayOfWeek = date.dayOfWeek(); // 0 = Sunday, 6 = Saturday
        
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
          args.cell.cssClass = "weekend-cell";
          args.cell.backColor = "#ffebee"; // Light red background matching headers
        }
      },
      // Customize the appearance of room headers
      onBeforeRowHeaderRender: args => {
        // Use remote data if available, otherwise fallback to local data
        const roomsSource = roomsData.length > 0 ? roomsData : [];
        const room = roomsSource.find(r => r.id === args.row.id);
        
        if (room) {
          // Use the backgroundColor and textColor from the data
          const backgroundColor = room.backgroundColor || '#cccccc';
          const textColor = room.color || room.textColor || '#ffffff';
          // const textColor = room.color || room.textColor || '#ffffff';
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
          <Toolbar
            view={view}
            onViewChange={setView}
            onNewReservation={() => openModal('new')}
            selectedReservation={selectedReservation}
            onViewReservation={() => openModal('view', selectedReservation)}
            onEditReservation={() => openModal('edit', selectedReservation)}
            currentDate={currentDate}
            onDateChange={handleDateChange}
          />
        </Col>
      </Row>
      {isLoading && (
        <Row className="mb-3">
          <Col className="text-center">
            <div className="d-flex align-items-center justify-content-center">
              <div className="spinner-border text-primary me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span>Cargando datos...</span>
            </div>
          </Col>
        </Row>
      )}
      <Row className="mb-3">
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
      <Row className="mb-3">
        <Col>
          <Legend statuses={
            Object.fromEntries(
              roomsData.map(room => [
                room.status || 'available', 
                { 
                  text: room.roomColorStatus || room.status, 
                  color: room.backgroundColor || '#cccccc',
                  textColor: room.color || '#ffffff'
                }
              ])
            )} />
        </Col>
      </Row>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        formData={formData}
        onInputChange={handleInputChange}
        onSave={handleSave}
        rooms={roomsData}
        statuses={
          Object.fromEntries(
            roomsData.map(room => [
              room.status || 'available', 
              { 
                text: room.roomColorStatus || room.status, 
                color: room.backgroundColor || '#cccccc'
              }
            ])
          )}
      />
    </Container>
  );
}

export default App;