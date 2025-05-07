import React from 'react';
import { Button } from 'react-bootstrap';

const DeleteButton = ({ onDelete }) => {
  return (
    <Button variant="danger" onClick={onDelete}>
      <i className="bi bi-trash"></i> Löschen
    </Button>
  );
};

export default DeleteButton;