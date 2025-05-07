import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format'; // Import aus date-fns
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { Modal, Button } from 'react-bootstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { v4 as uuidv4 } from 'uuid';
import './css/Calendar.css';
import TerminAnlegen from './TerminAnlegen';
import CustomToolbar from './CustomToolbar';
import EventList from './EventList';
import ClearStorageButton from './ClearStorageButton'; // Import der neuen Komponente
import de from 'date-fns/locale/de';
import EventModal from './EventModal'; // Import der neuen Modal-Komponente

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

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

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

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setShowModal(true);
  };

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

  const handleClearEvents = () => {
    setEvents([]);
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
        views={['month']}
        defaultView="month"
        components={{
          toolbar: (props) => <CustomToolbar {...props} />,
        }}
      />
      <span className="rbc-btn-group justify-content-end mt-3">
        <TerminAnlegen
          onAddEvent={onAddEvent}
          onClose={() => setShowModal(false)}
        />
        <ClearStorageButton onClear={handleClearEvents} />
      </span>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <EventModal
          showModal={showModal}
          onClose={() => setShowModal(false)}
          selectedDate={selectedDate}
          events={events}
          dateTimeFormatter={dateTimeFormatter}
          handleDelete={handleDelete}
          handleEdit={(id) => console.log('Edit Event:', id)}
          handlePayment={(id) => console.log('Payment for Event:', id)}
        />
      </Modal>
    </div>
  );
};

export default Calendar;