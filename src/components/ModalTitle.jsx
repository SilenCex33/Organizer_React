// filepath: c:\Users\axels\Documents\Axel\Dev. Projekte\organizer_react\src\components\ModalTitle.jsx
import React from 'react';
import { format } from 'date-fns';

const ModalTitle = ({ selectedDate }) => {
  return (
    <h5>
      Termine für {selectedDate ? format(selectedDate, 'dd.MM.yyyy') : ''}
    </h5>
  );
};

export default ModalTitle;