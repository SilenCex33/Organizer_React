import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { v4 as uuidv4 } from 'uuid'; // Importiere uuid
import './css/Calendar.css'; // Import your custom CSS for styling
import TerminAnlegen from './TerminAnlegen'; // Pfad anpassen, falls nötig
import de from 'date-fns/locale/de';

const locales = {
  de: de, // Deutsch
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom Toolbar Component
const CustomToolbar = (toolbar) => {
  const handleNavigate = (action) => {
    console.log(`Navigating: ${action}`); // Debugging
    toolbar.onNavigate(action); // Übergeben der Aktion
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
    color: 'event-blue'
  });
  const [currentDate, setCurrentDate] = useState(new Date());

  // **Lese Termine aus dem Local Storage beim Laden der Seite**
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setEvents(storedEvents);
  }, []);

  // **Speichere Termine im Local Storage, wenn sich die Events ändern**
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Handler für Slot-Auswahl (wenn ein Tag ausgewählt wird)
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setShowModal(true);
  };

  // Termine für den ausgewählten Tag filtern
  const getEventsForDate = (date) => {
    return events.filter(event => 
      new Date(event.start).toDateString() === new Date(date).toDateString()
    );
  };

  // Handler für das Hinzufügen eines neuen Termins
  const handleAddEvent = () => {
    if (newEvent.title) {
      setEvents([...events, { ...newEvent, id: uuidv4() }]);
      setNewEvent({
        title: '',
        start: selectedDate,
        end: selectedDate,
        color: 'event-blue'
      });
    }
  };

  // Event Style Getter
  const eventStyleGetter = (event) => ({
    className: event.color || 'event-blue'
  });

  return (
    <div className="calendar-container">
      <BigCalendar
        localizer={localizer} // Lokalisierung übergeben
        culture='de'
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '75vh' }}
        selectable
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventStyleGetter}
        views={['month']} // Nur Monatsansicht
        defaultView="month"
        date={currentDate}
        onNavigate={(date, view) => {
          console.log(`Navigated to date: ${date}, view: ${view}`);
          setCurrentDate(date);
        }}
        components={{
          toolbar: CustomToolbar, // Hier wird die benutzerdefinierte Toolbar eingebunden
        }}
      />
<span className="rbc-btn-group justify-content-end mt-3">
        <TerminAnlegen
          onAddEvent={(newEvent) => {
            console.log('Neues Event wird hinzugefügt:', newEvent);
            setEvents([...events, newEvent]);
          }}
        />
      </span>
      {/* Bootstrap Modal */}
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
          {/* Existierende Termine anzeigen */}
          {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
            <div className="existing-events">
              <h5>Vorhandene Termine:</h5>
              {getEventsForDate(selectedDate).map((event) => (
                <OverlayTrigger
                  key={event.id}
                  placement="top" // Position des Tooltips
                  overlay={
                    <Tooltip id={`tooltip-${event.id}`}>
                      {/* Tooltip-Inhalt: Event-Datensatz */}
                      <div>
                        <strong>Title:</strong> {event.title} <br />
                        <strong>Start:</strong> {new Date(event.start).toLocaleString()} <br />
                        <strong>End:</strong> {new Date(event.end).toLocaleString()} <br />
                        
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
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Möchten Sie diesen Termin wirklich löschen?')) {
                            setEvents(events.filter((e) => e.id !== event.id));
                          }
                        }}
                      >
                        Löschen
                      </Button>
                    </div>
                  </div>
                </OverlayTrigger>
              ))}
            </div>
          ) : (
            <p>Keine Termine an diesem Tag</p>
          )}

          <TerminAnlegen 
            onAddEvent={(newEvent) => setEvents([...events, newEvent])} 
            selectedDate={selectedDate} // Übergabe des ausgewählten Datums
            onClose={() => setShowModal(false)} // Modal schließen
          />
          
        </Modal.Body>
        <Modal.Footer>
          
          
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calendar;