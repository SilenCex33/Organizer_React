import React from 'react';
import { Button } from 'react-bootstrap';

const EditButton = ({ onEdit }) => {
  return (
    <Button variant="warning" onClick={onEdit}>
      <i className="bi bi-pencil"></i> Bearbeiten
    </Button>
  );
};

export default EditButton;