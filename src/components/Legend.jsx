import React from 'react';
import { Badge } from 'react-bootstrap';
import { getStatusVariant } from '../utils/helpers';

/**
 * Legend component that displays the status indicators
 * @param {Object} statuses - Object containing status definitions
 */
const Legend = ({ statuses }) => {
  return (
    <div className="d-flex flex-wrap gap-3 mb-3">
      {Object.entries(statuses).map(([key, { text }]) => (
        <Badge key={key} bg={getStatusVariant(key)} className="p-2">
          {text}
        </Badge>
      ))}
    </div>
  );
};

export default Legend;