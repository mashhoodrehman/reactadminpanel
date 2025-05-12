import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEventAPI, updateEventAPI } from 'src/services/eventService';
import { toast } from 'react-toastify';

const EventForm = ({ isEdit = false, initialData = {} }) => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000); // convert to local time
    return localDate.toISOString().slice(0, 16); // get 'YYYY-MM-DDTHH:MM'
  };


  const [formData, setFormData] = useState({
    name: initialData.name || '',
    start_date: formatDateForInput(initialData.start_date),
    end_date: formatDateForInput(initialData.end_date),
    ticket_count: initialData.ticket_count || '',
    listing_count: initialData.listing_count || '',
    crowd: initialData.crowd || '',
    lat: initialData.lat || '',
    lng: initialData.lng || '',
  });


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateEventAPI(initialData.id, formData);
        toast.success('Event updated successfully!');
      } else {
        await createEventAPI(formData);
        toast.success('Event created successfully!');
      }
      navigate('/admin/events/list');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving event');
    }
  };

  const initMap = () => {
    const defaultPosition = {
      lat: parseFloat(formData.lat) || 37.7749,
      lng: parseFloat(formData.lng) || -122.4194,
    };

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultPosition,
      zoom: 10,
    });

    const marker = new window.google.maps.Marker({
      position: defaultPosition,
      map,
      draggable: true,
    });

    markerRef.current = marker;

    marker.addListener('dragend', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setFormData((prev) => ({ ...prev, lat, lng }));
    });

    map.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      marker.setPosition({ lat, lng });
      setFormData((prev) => ({ ...prev, lat, lng }));
    });

    // Init autocomplete
    const input = document.getElementById('autocomplete');
    const autocomplete = new window.google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        toast.error('No details available for input');
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      marker.setPosition({ lat, lng });
      map.setCenter({ lat, lng });
      map.setZoom(14);

      setFormData((prev) => ({
        ...prev,
        lat,
        lng,
      }));
    });
  };

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyA2Z-zDSUYtDKK190MKpFPEJwMrtIqO3TI&libraries=places';
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
        <label className="form-label">Event Name</label>
        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="col-md-3">
        <label className="form-label">Start Date</label>
        <input type="datetime-local" className="form-control" name="start_date" value={formData.start_date} onChange={handleChange} required />
      </div>

      <div className="col-md-3">
        <label className="form-label">End Date</label>
        <input type="datetime-local" className="form-control" name="end_date" value={formData.end_date} onChange={handleChange} required />
      </div>

      <div className="col-md-4">
        <label className="form-label">Ticket Count</label>
        <input type="number" className="form-control" name="ticket_count" value={formData.ticket_count} onChange={handleChange} required />
      </div>

      <div className="col-md-4">
        <label className="form-label">Listing Count</label>
        <input type="number" className="form-control" name="listing_count" value={formData.listing_count} onChange={handleChange} required />
      </div>

      <div className="col-md-4">
        <label className="form-label">Crowd</label>
        <input type="number" className="form-control" name="crowd" value={formData.crowd} onChange={handleChange} required />
      </div>

      <div className="col-md-6">
        <label className="form-label">Latitude</label>
        <input type="text" className="form-control" name="lat" value={formData.lat} onChange={handleChange} readOnly />
      </div>

      <div className="col-md-6">
        <label className="form-label">Longitude</label>
        <input type="text" className="form-control" name="lng" value={formData.lng} onChange={handleChange} readOnly />
      </div>

      <div className="col-12">
        <label className="form-label">Search Address</label>
        <input
          id="autocomplete"
          className="form-control"
          type="text"
          placeholder="Search by location..."
          ref={autocompleteRef}
        />
      </div>

      <div className="col-12">
        <label className="form-label">Google Map</label>
        <div
          ref={mapRef}
          style={{ height: '400px', width: '100%', border: '1px solid #ccc' }}
        />
      </div>

      <div className="col-12">
        <button type="submit" className="btn btn-success">
          {isEdit ? 'Update' : 'Create'} Event
        </button>
      </div>
    </form>
  );
};

export default EventForm;
