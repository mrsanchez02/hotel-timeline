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
  onEditReservation
}) => {
  return (
    <Row className="mb-4">
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
      
      <Col md={6} className="d-flex justify-content-end align-items-center gap-2">
        <Button 
          variant="primary"
          onClick={onNewReservation}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Nueva Reserva
        </Button>
        
        {selectedReservation && (
          <>
            <Button 
              variant="outline-secondary"
              onClick={onViewReservation}
            >
              <i className="bi bi-eye me-1"></i>
              Ver
            </Button>
            <Button 
              variant="outline-warning"
              onClick={onEditReservation}
            >
              <i className="bi bi-pencil me-1"></i>
              Editar
            </Button>
          </>
        )}
      </Col>
    </Row>
  );
};

export default Toolbar;