import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import TerminForm from './TerminForm';
import vehicleData from '../assets/data/vehicle.json';
import { v4 as uuidv4 } from 'uuid';

const TerminAnlegen = ({ onAddEvent, selectedDate, onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Privat',
    firstName: '',
    lastName: '',
    phone: '',
    dateFrom: new Date(),
    dateTo: new Date(),
    timeFrom: '',
    timeTo: '',
    vehicle: '',
    km: '',
    additionalKm: '',
    info: '',
  });
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = () => {
    const newEvent = {
      ...formData,
      id: uuidv4(),
      title: `${formData.lastName} / ${formData.vehicle}`,
      start: formData.dateFrom,
      end: formData.dateTo,
      color: 'event-blue',
    };

    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    const updatedEvents = [...storedEvents, newEvent];
    localStorage.setItem('events', JSON.stringify(updatedEvents));

    if (onAddEvent) {
      onAddEvent(newEvent);
    }

    setFormData({
      type: 'Privat',
      firstName: '',
      lastName: '',
      phone: '',
      dateFrom: new Date(),
      dateTo: new Date(),
      timeFrom: '',
      timeTo: '',
      vehicle: '',
      km: '',
      additionalKm: '',
      info: '',
    });

    setCharCount(0);
    setShowModal(false);

    if (typeof onClose === 'function') {
      onClose();
    }
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        <i className="bi bi-plus-circle" style={{ marginRight: '8px' }}></i>
        Termin hinzufügen
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header>
          <Modal.Title>Neuen Termin hinzufügen</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'aliceblue' }}>
          <TerminForm
            formData={formData}
            setFormData={setFormData}
            vehicleData={vehicleData}
            charCount={charCount}
            setCharCount={setCharCount}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Abbrechen
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Hinzufügen
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TerminAnlegen;
