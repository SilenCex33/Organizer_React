import React from 'react';
import { Modal } from 'react-bootstrap';
import EventList from './EventList';
import ModalTitle from './ModalTitle';

const EventModal = ({
  showModal,
  onClose,
  selectedDate,
  events,
  dateTimeFormatter,
  handleDelete,
  handleEdit,
  handlePayment,
}) => {
  return (
    <Modal show={showModal} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <ModalTitle selectedDate={selectedDate} />
      </Modal.Header>
      <Modal.Body>
        {selectedDate && events.length > 0 ? (
          <EventList
            events={events.filter(
              (event) =>
                new Date(event.start).toDateString() ===
                new Date(selectedDate).toDateString()
            )}
            dateTimeFormatter={dateTimeFormatter}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handlePayment={handlePayment}
          />
        ) : (
          <p>Keine Termine an diesem Tag</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EventModal;