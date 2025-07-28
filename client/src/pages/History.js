import React, { useState, useEffect } from 'react';
import { moodAPI } from '../services/api';
import MoodEntry from '../components/MoodEntry';

const History = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchEntries(currentPage);
  }, [currentPage]);

  const fetchEntries = async (page = 1) => {
    setLoading(true);
    try {
      const response = await moodAPI.getMoodEntries(page, 10);
      setEntries(response.data.entries);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      setError('Failed to load mood entries');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEntry = async (id, mood, note) => {
    try {
      await moodAPI.updateMoodEntry(id, mood, note);
      setSuccess('Mood entry updated successfully!');
      fetchEntries(currentPage);
    } catch (err) {
      setError('Failed to update mood entry');
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this mood entry?')) {
      try {
        await moodAPI.deleteMoodEntry(id);
        setSuccess('Mood entry deleted successfully!');
        fetchEntries(currentPage);
      } catch (err) {
        setError('Failed to delete mood entry');
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && entries.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Mood History</h1>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        {entries.length === 0 ? (
          <div className="card">
            <h2>No mood entries yet</h2>
            <p>Start tracking your moods by visiting the <a href="/dashboard">Dashboard</a>.</p>
          </div>
        ) : (
          <>
            <div className="card">
              <h2>All Mood Entries ({totalCount} total)</h2>
              <p>Your complete mood tracking history in reverse chronological order.</p>
            </div>
            
            <div className="card">
              {entries.map((entry) => (
                <MoodEntry
                  key={entry.id}
                  entry={entry}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-secondary btn-small"
                  >
                    Previous
                  </button>
                  
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-secondary btn-small"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default History;