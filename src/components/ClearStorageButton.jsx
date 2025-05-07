import React from 'react';
import { Button } from 'react-bootstrap';

const ClearStorageButton = ({ onClear }) => {
  const handleClearStorage = () => {
    if (window.confirm('Möchtest du wirklich den gesamten Speicher löschen?')) {
      localStorage.clear();
      onClear();
    }
  };

  return (
    <Button variant="danger" className="ms-2" onClick={handleClearStorage}>
      <i className="bi bi-trash3"></i> Speicher leeren
    </Button>
  );
};

export default ClearStorageButton;