import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format'; // Import aus date-fns
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { v4 as uuidv4 } from 'uuid';
import './css/Calendar.css';
import TerminAnlegen from './TerminAnlegen';
import de from 'date-fns/locale/de';

const locales = {
  de: de,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CustomToolbar = (toolbar) => {
  const handleNavigate = (action) => {
    toolbar.onNavigate(action);
  };

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => handleNavigate('PREV')}>
          Zurück
        </button>
        <button type="button" onClick={() => handleNavigate('TODAY')}>
          Heute
        </button>
        <button type="button" onClick={() => handleNavigate('NEXT')}>
          Weiter
        </button>
      </span>
      <span className="rbc-toolbar-label">{toolbar.label}</span>
    </div>
  );
};

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    color: 'event-blue',
  });
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    console.log('Rohdaten aus localStorage beim Laden:', storedEvents);

    const parsedEvents = storedEvents
      ? JSON.parse(storedEvents).map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))
      : [];
    console.log('Geparste Events nach Konvertierung:', parsedEvents);

    setEvents(parsedEvents);
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      console.log('Speichere Events in localStorage:', events);
      localStorage.setItem('events', JSON.stringify(events));
    } else {
      console.log('Keine Events vorhanden. localStorage wird nicht aktualisiert.');
    }
  }, [events]);

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setShowModal(true);
  };

  const getEventsForDate = (date) => {
    return events.filter(
      (event) =>
        new Date(event.start).toDateString() === new Date(date).toDateString()
    );
  };

  const handleAddEvent = () => {
    if (newEvent.title) {
      const updatedEvent = { ...newEvent, id: uuidv4() };
      console.log('Hinzufügen eines neuen Events:', updatedEvent);
      setEvents([...events, updatedEvent]);
      setNewEvent({
        title: '',
        start: selectedDate,
        end: selectedDate,
        color: 'event-blue',
      });
    }
  };

  const eventStyleGetter = (event) => ({
    className: event.color || 'event-blue',
  });

  const onAddEvent = (newEvent) => {
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const handleDelete = (id) => {
    const updatedEvents = events.filter((event) => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const dateTimeFormatter = new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  console.log(events.map(event => ({
    title: event.title,
    start: typeof event.start,
    end: typeof event.end,
  })));

  return (
    <div className="calendar-container">
      <BigCalendar
        localizer={localizer}
        culture="de"
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '75vh' }}
        selectable
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventStyleGetter}
        views={['month']}
        defaultView="month"
        date={currentDate}
        onNavigate={(date, view) => {
          setCurrentDate(date);
        }}
        components={{
          toolbar: CustomToolbar,
        }}
      />
      <span className="rbc-btn-group justify-content-end mt-3">
      <TerminAnlegen
          onAddEvent={(newEvent) => {
            setEvents([...events, newEvent]);
          }}
          onClose={() => {
            setShowModal(false);
          }}/>
          <Button
    variant="danger"
    className="ms-2"
    onClick={() => {
      if (window.confirm("Möchtest du wirklich den gesamten Speicher löschen?")) {
        localStorage.clear(); // LocalStorage leeren
        setEvents([]); // Events im State zurücksetzen
        console.log("LocalStorage wurde geleert.");
      }
    }}
  >
    <i className="bi bi-trash3"></i> {/* Icon für den Button */}
    Speicher leeren
  </Button>
        
      </span>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Termine für {selectedDate ? format(selectedDate, 'dd.MM.yyyy') : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
            <div className="existing-events">
              <h5>Vorhandene Termine:</h5>
              {getEventsForDate(selectedDate).map((event) => (
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
                        <span
                          className={`event-color-dot ${event.color}`}
                        ></span>
                        {event.title}
                      </div>
                      <div className="d-flex gap-2">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-delete-${event.id}`}>
                              Löschen
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(event.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-edit-${event.id}`}>
                              Bearbeiten
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="warning"
                            onClick={() => handleEdit(event.id)}
                          >
                            <i className="bi bi-wrench"></i>
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-payment-${event.id}`}>
                              Abrechnung
                            </Tooltip>
                          }
                        >
                          <Button
                            variant="success"
                            onClick={() => handlePayment(event.id)}
                          >
                            <i className="bi bi-currency-euro"></i>
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </div>
                  </div>
                </OverlayTrigger>
              ))}
            </div>
          ) : (
            <p>Keine Termine an diesem Tag</p>
          )}

          <TerminAnlegen
            onAddEvent={onAddEvent}
            selectedDate={selectedDate}
            onClose={() => {
              setShowModal(false);
            }}
          />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calendar;