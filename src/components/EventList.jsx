import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

const EventList = ({ events, dateTimeFormatter, handleDelete, handleEdit, handlePayment }) => {
  return (
    <div className="existing-events">
      <h5>Vorhandene Termine:</h5>
      {events.map((event) => (
        <OverlayTrigger
          key={event.id}
          placement="top"
          overlay={
            <Tooltip id={`tooltip-${event.id}`}>
              <div>
                <strong>Title:</strong> {event.title} <br />
                <strong>Start:</strong> {dateTimeFormatter.format(new Date(event.start))} <br />
                <strong>End:</strong> {dateTimeFormatter.format(new Date(event.end))} <br />
              </div>
            </Tooltip>
          }
        >
          <div key={event.id} className="event-item p-2 mb-2">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <span className={`event-color-dot ${event.color}`}></span>
                {event.title}
              </div>
              <div className="d-flex gap-2">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-delete-${event.id}`}>Löschen</Tooltip>}
                >
                  <Button variant="danger" onClick={() => handleDelete(event.id)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-edit-${event.id}`}>Bearbeiten</Tooltip>}
                >
                  <Button variant="warning" onClick={() => handleEdit(event.id)}>
                    <i className="bi bi-wrench"></i>
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-payment-${event.id}`}>Abrechnung</Tooltip>}
                >
                  <Button variant="success" onClick={() => handlePayment(event.id)}>
                    <i className="bi bi-currency-euro"></i>
                  </Button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </OverlayTrigger>
      ))}
    </div>
  );
};

export default EventList;