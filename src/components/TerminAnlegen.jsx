import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import vehicleData from '../assets/data/vehicle.json';
import './css/TerminAnlegen.css';
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
  const [kmOptions, setKmOptions] = useState([]);

  const vehicleMap = useMemo(() => {
    const map = new Map();
    vehicleData.forEach((superCategory) => {
      superCategory.categories.forEach((category) => {
        category.vehicles.forEach((vehicle) => {
          map.set(vehicle.licensePlate, vehicle);
        });
      });
    });
    return map;
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        dateFrom: selectedDate,
        dateTo: selectedDate,
      }));
    }
  }, [selectedDate]);

  useEffect(() => {
    const selectedVehicle = vehicleMap.get(formData.vehicle);
    setKmOptions(
      selectedVehicle?.kmPackage ? Object.entries(selectedVehicle.kmPackage) : []
    );
  }, [formData.vehicle, vehicleMap]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'info') {
      setCharCount(value.length);
    }
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
  };

  const isValidForm = () => {
    if (!formData.firstName || !formData.lastName) {
      alert('Vorname und Nachname sind erforderlich.');
      return false;
    }
    if (!formData.phone.match(/^\+?[0-9]+$/)) {
      alert('Bitte geben Sie eine gültige Telefonnummer ein.');
      return false;
    }
    if (formData.dateTo < formData.dateFrom) {
      alert('Das Enddatum darf nicht vor dem Startdatum liegen.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!isValidForm()) return;

    const newEvent = {
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

  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
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
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Typ</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="Privat">Privat</option>
                <option value="Geschäftlich">Geschäftlich</option>
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vorname</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Vorname"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nachname</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Nachname"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Telefonnummer</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Telefonnummer"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Datum von</Form.Label>
                  <DatePicker
                    selected={formData.dateFrom} // Zeigt das ausgewählte Datum an
                    onChange={(date) => handleDateChange('dateFrom', date)}
                    dateFormat="dd.MM.yyyy"
                    className="form-control"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Datum bis</Form.Label>
                  <DatePicker
                    selected={formData.dateTo}
                    onChange={(date) => handleDateChange('dateTo', date)}
                    dateFormat="dd.MM.yyyy"
                    className="form-control"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Uhrzeit von</Form.Label>
                  <Form.Control
                    type="time"
                    name="timeFrom"
                    value={formData.timeFrom}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Uhrzeit bis</Form.Label>
                  <Form.Control
                    type="time"
                    name="timeTo"
                    value={formData.timeTo}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Fahrzeug</Form.Label>
              <Form.Select
                name="vehicle"
                value={formData.vehicle}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Fahrzeug auswählen
                </option>
                {vehicleData.map((superCategory, superCategoryIndex) => (
                  <optgroup key={superCategoryIndex} label={superCategory.superCategory}>
                    {superCategory.categories.map((category) =>
                      category.vehicles.map((vehicle, vehicleIndex) => (
                        <option
                          key={vehicleIndex}
                          value={vehicle.licensePlate}
                        >
                          {`${category.category} - ${vehicle.licensePlate}`}
                        </option>
                      ))
                    )}
                  </optgroup>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Kilometer Pakete</Form.Label>
              <Form.Select
                name="km"
                value={formData.km}
                onChange={handleInputChange}
              >
                <option value="">Kilometerpaket auswählen</option>
                {kmOptions
                  .filter(([key]) => key !== 'additionalKm') // Filtere die Option "1km" aus
                  .map(([key, value], index) => (
                    <option key={index} value={key}>
                      {`${value.freeKm} km - ${value.price} €`}
                    </option>
                  ))}
                <option value="Zusatz Km">Zusatz Km</option>
              </Form.Select>
            </Form.Group>

            {formData.km === 'Zusatz Km' && (
              <Form.Group className="mb-3">
                <Form.Label>Zusätzliche Kilometer</Form.Label>
                <Form.Control
                  type="number"
                  name="additionalKm"
                  value={formData.additionalKm}
                  onChange={(e) => {
                    const value = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                    if (value === "" || (value >= 0 && value <= 99)) {
                      setFormData({ ...formData, additionalKm: value });
                    }
                  }}
                  placeholder="Zusätzliche Kilometer"
                  min="0"
                  max="99"
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Zusätzliche Informationen</Form.Label>
              <Form.Control
                as="textarea"
                name="info"
                value={formData.info}
                onChange={handleInputChange}
                maxLength="120"
                placeholder="Zusätzliche Informationen"
              />
              <Form.Text>{charCount}/120 Zeichen</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
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
