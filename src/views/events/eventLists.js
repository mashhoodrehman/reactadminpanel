import React, { useEffect, useState } from 'react';
import { getEventsAPI } from '../../services/eventService';
import { toast } from 'react-toastify';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

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

  // Trigger fetch when page or searchTerm changes
  useEffect(() => {
    fetchEvents(page, searchTerm);
  }, [page, searchTerm]);

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1); // reset to page 1 on new search
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Calculate page range for pagination display
  const getPaginationRange = () => {
    const range = [];
    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages, page + 1);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="event-list">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Event List</h4>
        <input
          type="text"
          placeholder="Search by event name..."
          className="form-control w-25"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
              </tr>
            </thead>
            <tbody>
              {events.length ? (
                events.map((event, i) => (
                  <tr key={event.id}>
                    <td>{(page - 1) * 10 + i + 1}</td>
                    <td>{event.name}</td>
                    <td>
                      {new Date(event.start_date).toLocaleString('en-US', {
                        weekday: 'long', // e.g., "Wednesday"
                        year: 'numeric', // e.g., "2025"
                        month: 'long', // e.g., "April"
                        day: 'numeric', // e.g., "30"
                        hour: 'numeric', // e.g., "2"
                        minute: '2-digit', // e.g., "15"
                        hour12: true, // 12-hour format with AM/PM
                      })}
                    </td>

                    <td> {new Date(event.end_date).toLocaleString('en-US', {
                      weekday: 'long', // e.g., "Wednesday"
                      year: 'numeric', // e.g., "2025"
                      month: 'long', // e.g., "April"
                      day: 'numeric', // e.g., "30"
                      hour: 'numeric', // e.g., "2"
                      minute: '2-digit', // e.g., "15"
                      hour12: true, // 12-hour format with AM/PM
                    })}</td>
                    <td>{event.ticket_count}</td>
                    <td>{event.listing_count}</td>
                    <td>{event.crowd}</td>
                    <td>
                      <span className={`badge bg-${event.crowd_status}`}>{event.crowd_status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Custom Pagination */}
          <div className="d-flex justify-content-center align-items-center mt-3 flex-wrap gap-2">
            <button
              className="btn btn-outline-secondary"
              disabled={page === 1}
              onClick={() => setPage(1)}
            >
              First
            </button>
            <button
              className="btn btn-outline-secondary"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>

            {getPaginationRange().map((pageNumber) => (
              <button
                key={pageNumber}
                className={`btn btn-sm ${page === pageNumber ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            <button
              className="btn btn-outline-secondary"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
            <button
              className="btn btn-outline-secondary"
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
            >
              Last
            </button>
          </div>
        </>
      )}
    </div>
  )
};

export default EventList;
