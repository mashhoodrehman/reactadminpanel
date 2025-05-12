import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventByIdAPI } from 'src/services/eventService';
import { toast } from 'react-toastify';
import EventForm from 'src/components/events/EventForm';

const EditEvent = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const res = await getEventByIdAPI(id);
      setEventData(res.data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch event');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  return (
    <div className="container mt-4">
      <h4>Edit Event</h4>
      {loading ? <p>Loading...</p> : eventData && <EventForm isEdit={true} initialData={eventData} />}
    </div>
  );
};

export default EditEvent;
