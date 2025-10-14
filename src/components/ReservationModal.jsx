import React from 'react';
import { Modal, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import { DayPilot } from "@daypilot/daypilot-lite-react";
import { getStatusVariant, formatDateForInput } from '../utils/helpers';

/**
 * Modal component for creating, editing, and viewing reservations
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to close the modal
 * @param {string} mode - Modal mode: 'new', 'edit', or 'view'
 * @param {Object} formData - Form data object
 * @param {function} onInputChange - Function to handle input changes
 * @param {function} onSave - Function to save the form
 * @param {Array} rooms - Array of available rooms
 * @param {Object} statuses - Object containing status definitions
 */
const ReservationModal = ({ 
  isOpen, 
  onClose, 
  mode, 
  formData, 
  onInputChange, 
  onSave, 
  rooms, 
  statuses 
}) => {
  const isReadOnly = mode === 'view';
  const title = mode === 'new' ? 'Nueva Reserva' : 
                mode === 'edit' ? 'Editar Reserva' : 'Ver Reserva';

  const handleDateChange = (field, value) => {
    if (value) {
      // Crear la fecha con hora fija a las 3pm (15:00)
      const dateTime = new Date(value + 'T15:00:00');
      onInputChange(field, new DayPilot.Date(dateTime));
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          {title}
          {mode === 'view' && formData.status && (
            <Badge bg={getStatusVariant(formData.status)}>
              {statuses[formData.status]?.text}
            </Badge>
          )}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombre del Huésped</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.guestName}
                  onChange={e => onInputChange('guestName', e.target.value)}
                  readOnly={isReadOnly}
                  placeholder="Nombre completo del huésped"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  value={formData.phone}
                  onChange={e => onInputChange('phone', e.target.value)}
                  readOnly={isReadOnly}
                  placeholder="+34 600 000 000"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={e => onInputChange('email', e.target.value)}
                  readOnly={isReadOnly}
                  placeholder="email@ejemplo.com"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Habitación</Form.Label>
                <Form.Select
                  value={formData.resource}
                  onChange={e => onInputChange('resource', e.target.value)}
                  disabled={isReadOnly}
                >
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={e => onInputChange('status', e.target.value)}
                  disabled={isReadOnly}
                >
                  {Object.entries(statuses).map(([key, { text }]) => (
                    <option key={key} value={key}>{text}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fecha de Entrada</Form.Label>
                <Form.Control
                  type="date"
                  value={formatDateForInput(formData.start)}
                  onChange={e => handleDateChange('start', e.target.value)}
                  readOnly={isReadOnly}
                />
                <Form.Text className="text-muted">
                  Check-in: 3:00 PM
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fecha de Salida</Form.Label>
                <Form.Control
                  type="date"
                  value={formatDateForInput(formData.end)}
                  onChange={e => handleDateChange('end', e.target.value)}
                  readOnly={isReadOnly}
                />
                <Form.Text className="text-muted">
                  Check-out: 3:00 PM
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Notas</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.notes}
                  onChange={e => onInputChange('notes', e.target.value)}
                  readOnly={isReadOnly}
                  placeholder="Notas adicionales sobre la reserva..."
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {isReadOnly ? 'Cerrar' : 'Cancelar'}
        </Button>
        {!isReadOnly && (
          <Button variant="primary" onClick={onSave}>
            {mode === 'new' ? 'Crear Reserva' : 'Guardar Cambios'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ReservationModal;