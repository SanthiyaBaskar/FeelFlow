import React, { useState, useEffect } from 'react';
import { moodAPI } from '../services/api';
import MoodSelector from '../components/MoodSelector';
import MoodEntry from '../components/MoodEntry';

const Dashboard = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [todayEntry, setTodayEntry] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);

  useEffect(() => {
    fetchRecentEntries();
  }, []);

  const fetchRecentEntries = async () => {
    try {
      const response = await moodAPI.getMoodEntries(1, 5);
      setRecentEntries(response.data.entries);
      
      // Check if user already logged mood today
      const today = new Date().toISOString().split('T')[0];
      const todayEntryExists = response.data.entries.find(entry => {
        const entryDate = new Date(entry.created_at).toISOString().split('T')[0];
        return entryDate === today;
      });
      
      if (todayEntryExists) {
        setTodayEntry(todayEntryExists);
        setSelectedMood(todayEntryExists.mood);
        setNote(todayEntryExists.note || '');
      }
    } catch (err) {
      setError('Failed to load mood entries');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedMood) {
      setError('Please select a mood');
      return;
    }

    setLoading(true);

    try {
      if (todayEntry) {
        // Update existing entry
        await moodAPI.updateMoodEntry(todayEntry.id, selectedMood, note);
        setSuccess('Your mood has been updated successfully!');
      } else {
        // Create new entry
        await moodAPI.createMoodEntry(selectedMood, note);
        setSuccess('Your mood has been logged successfully!');
      }
      
      fetchRecentEntries();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save mood entry');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEntry = async (id, mood, note) => {
    try {
      await moodAPI.updateMoodEntry(id, mood, note);
      setSuccess('Mood entry updated successfully!');
      fetchRecentEntries();
    } catch (err) {
      setError('Failed to update mood entry');
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this mood entry?')) {
      try {
        await moodAPI.deleteMoodEntry(id);
        setSuccess('Mood entry deleted successfully!');
        fetchRecentEntries();
        
        // If deleted entry was today's entry, reset form
        if (todayEntry && todayEntry.id === id) {
          setTodayEntry(null);
          setSelectedMood('');
          setNote('');
        }
      } catch (err) {
        setError('Failed to delete mood entry');
      }
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Dashboard</h1>
        
        <div className="card">
          <h2>{todayEntry ? 'Update Today\'s Mood' : 'How are you feeling today?'}</h2>
          
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select your mood</label>
              <MoodSelector 
                selectedMood={selectedMood} 
                onMoodSelect={setSelectedMood} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="note">Note (optional, max 150 characters)</label>
              <textarea
                id="note"
                className="form-control"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={150}
                rows={3}
                placeholder="How was your day? Any specific thoughts?"
              />
              <small>{note.length}/150 characters</small>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Saving...' : (todayEntry ? 'Update Mood' : 'Log Mood')}
            </button>
          </form>
        </div>

        {recentEntries.length > 0 && (
          <div className="card">
            <h2>Recent Entries</h2>
            {recentEntries.map((entry) => (
              <MoodEntry
                key={entry.id}
                entry={entry}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;