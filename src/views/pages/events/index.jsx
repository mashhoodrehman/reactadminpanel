import React, { useEffect, useState } from 'react';
import { getEventsAPI, deleteEvent } from 'src/services/eventService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchEvents = async (pageNo, searchText = '') => {
    setLoading(true);
    try {
      const res = await getEventsAPI(pageNo, 10, searchText);
      setEvents(res.data.events || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error(err.message || 'Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(id);
      toast.success('Event deleted successfully');
      fetchEvents(page, searchTerm);
    } catch (err) {
      toast.error(err.message || 'Failed to delete event');
    }
  };

  useEffect(() => {
    fetchEvents(page, searchTerm);
  }, [page, searchTerm]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const getPaginationRange = () => {
    const range = [];
    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages, page + 1);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  };

  return (
    <div className="event-list">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Event List</h4>
        <div className="d-flex gap-2">
          <input
            type="text"
            placeholder="Search by event name..."
            className="form-control"
            style={{ width: '250px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-success" onClick={() => navigate('/admin/events/create')}>
            + Create Event
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="table table-bordered">
            <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Start</th>
              <th>End</th>
              <th>Tickets</th>
              <th>Listings</th>
              <th>Crowd</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {events.length ? (
              events.map((event, i) => (
                <tr key={event.id}>
                  <td>{(page - 1) * 10 + i + 1}</td>
                  <td>{event.name}</td>
                  <td>{new Date(event.start_date).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}</td>
                  <td>{new Date(event.end_date).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}</td>
                  <td>{event.ticket_count}</td>
                  <td>{event.listing_count}</td>
                  <td>{event.crowd}</td>
                  <td>
                    <span className={`badge bg-${event.crowd_status}`}>{event.crowd_status}</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => navigate(`/admin/events/${event.id}/edit`)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(event.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No events found
                </td>
              </tr>
            )}
            </tbody>
          </table>

          <div className="d-flex justify-content-center align-items-center mt-3 flex-wrap gap-2">
            <button className="btn btn-outline-secondary" disabled={page === 1} onClick={() => setPage(1)}>First</button>
            <button className="btn btn-outline-secondary" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>Prev</button>
            {getPaginationRange().map((pageNumber) => (
              <button key={pageNumber} className={`btn btn-sm ${page === pageNumber ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setPage(pageNumber)}>
                {pageNumber}
              </button>
            ))}
            <button className="btn btn-outline-secondary" disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>Next</button>
            <button className="btn btn-outline-secondary" disabled={page === totalPages} onClick={() => setPage(totalPages)}>Last</button>
          </div>
        </>
      )}
    </div>
  );
};

export default EventList;
