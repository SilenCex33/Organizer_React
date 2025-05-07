import React, { useState, useEffect, useMemo } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TerminForm = ({ formData, setFormData, vehicleData, charCount, setCharCount }) => {
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
  }, [vehicleData]);

  const [kmOptions, setKmOptions] = useState([]);

  useEffect(() => {
    const selectedVehicle = vehicleMap.get(formData.vehicle);
    setKmOptions(
      selectedVehicle?.kmPackage ? Object.entries(selectedVehicle.kmPackage) : []
    );
  }, [formData.vehicle, vehicleMap]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'timeFrom' || name === 'timeTo') {
      setFormData({ ...formData, [name]: value });
      return;
    }

    setFormData({ ...formData, [name]: value });

    if (name === 'info') {
      setCharCount(value.length);
    }
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
  };

  return (
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
              selected={formData.dateFrom}
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
                  <option key={vehicleIndex} value={vehicle.licensePlate}>
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
          {kmOptions.map(([key, value], index) => (
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
  );
};

export default TerminForm;