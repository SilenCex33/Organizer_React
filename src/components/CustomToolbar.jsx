import React from 'react';
import { format } from 'date-fns';
import de from 'date-fns/locale/de';

const CustomToolbar = ({ date, onNavigate }) => {
  // Formatieren des Labels für Monat und Jahr
  const formattedLabel = format(date, 'MMMM yyyy', { locale: de });

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate('PREV')}>
          Zurück
        </button>
        <button type="button" onClick={() => onNavigate('TODAY')}>
          Heute
        </button>
        <button type="button" onClick={() => onNavigate('NEXT')}>
          Weiter
        </button>
      </span>
      <span className="rbc-toolbar-label">{formattedLabel}</span>
    </div>
  );
};

export default CustomToolbar;