import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

/**
 * Toolbar component containing view selector and action buttons
 * @param {string} view - Current view mode
 * @param {function} onViewChange - Function to handle view changes
 * @param {function} onNewReservation - Function to create new reservation
 * @param {Object} selectedReservation - Currently selected reservation
 * @param {function} onViewReservation - Function to view reservation
 * @param {function} onEditReservation - Function to edit reservation
 */
const Toolbar = ({
  view,
  onViewChange,
  onNewReservation,
  selectedReservation,
  onViewReservation,
  onEditReservation,
  currentDate,
  onDateChange
}) => {
  const handlePrevious = () => {
    let newDate;
    switch(view) {
      case 'Day':
        newDate = currentDate.addDays(-1);
        break;
      case 'Week':
        newDate = currentDate.addDays(-7);
        break;
      case 'Month':
        newDate = currentDate.addMonths(-1);
        break;
      case 'Year':
        newDate = currentDate.addYears(-1);
        break;
      default:
        newDate = currentDate.addMonths(-1);
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    let newDate;
    switch(view) {
      case 'Day':
        newDate = currentDate.addDays(1);
        break;
      case 'Week':
        newDate = currentDate.addDays(7);
        break;
      case 'Month':
        newDate = currentDate.addMonths(1);
        break;
      case 'Year':
        newDate = currentDate.addYears(1);
        break;
      default:
        newDate = currentDate.addMonths(1);
    }
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(currentDate.constructor.today());
  };

  const getDateLabel = () => {
    switch(view) {
      case 'Day':
        return currentDate.toString('d \'de\' MMMM \'de\' yyyy');
      case 'Week':
        const weekStart = currentDate.firstDayOfWeek();
        const weekEnd = weekStart.addDays(6);
        return `${weekStart.toString('d MMM')} - ${weekEnd.toString('d MMM yyyy')}`;
      case 'Month':
        return currentDate.toString('MMMM yyyy');
      case 'Year':
        return currentDate.toString('yyyy');
      default:
        return currentDate.toString('MMMM yyyy');
    }
  };

  return (
    <Row className="mb-4">
      <Col md={8}>
        <Row>
          <Col md={6}>
            <Form.Group className="d-flex align-items-center gap-2">
              <Form.Label className="mb-0 fw-semibold">Vista:</Form.Label>
              <Form.Select
                value={view}
                onChange={e => onViewChange(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="Day">Día</option>
                <option value="Week">Semana</option>
                <option value="Month">Mes</option>
                <option value="Year">Año</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center gap-2">
              <Button variant="outline-primary" size="sm" onClick={handlePrevious}>
                <i className="bi bi-chevron-left"></i>
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={handleToday}>
                Hoy
              </Button>
              <Button variant="outline-primary" size="sm" onClick={handleNext}>
                <i className="bi bi-chevron-right"></i>
              </Button>
              <span className="fw-semibold ms-2">{getDateLabel()}</span>
            </div>
          </Col>
        </Row>
      </Col>
      
            <Col md={4} className="text-end">
        <div className="d-flex gap-2 justify-content-end">
          <Button
            variant="primary"
            onClick={onNewReservation}
            size="sm"
          >
            <i className="bi bi-plus-circle me-1"></i>
            Nueva Reserva
          </Button>
          
          {selectedReservation && (
            <>
              <Button
                variant="info"
                size="sm"
                onClick={() => onViewReservation(selectedReservation)}
              >
                <i className="bi bi-eye me-1"></i>
                Ver
              </Button>
              <Button
                variant="warning"
                size="sm"
                onClick={() => onEditReservation(selectedReservation)}
              >
                <i className="bi bi-pencil me-1"></i>
                Editar
              </Button>
            </>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default Toolbar;