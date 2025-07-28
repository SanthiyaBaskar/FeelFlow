import React, { useState } from 'react';
import MoodSelector from './MoodSelector';

const getMoodEmoji = (mood) => {
  const moodMap = {
    Happy: '😊',
    Sad: '😢',
    Angry: '😠',
    Okay: '😐',
  };
  return moodMap[mood] || '😐';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const MoodEntry = ({ entry, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editMood, setEditMood] = useState(entry.mood);
  const [editNote, setEditNote] = useState(entry.note || '');

  const handleSave = () => {
    onEdit(entry.id, editMood, editNote);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditMood(entry.mood);
    setEditNote(entry.note || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="mood-entry">
        <div className="form-group">
          <label>How are you feeling?</label>
          <MoodSelector 
            selectedMood={editMood} 
            onMoodSelect={setEditMood} 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="note">Note (optional, max 150 characters)</label>
          <textarea
            id="note"
            className="form-control"
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            maxLength={150}
            rows={3}
            placeholder="How was your day? Any specific thoughts?"
          />
          <small>{editNote.length}/150 characters</small>
        </div>
        
        <div className="mood-entry-actions">
          <button onClick={handleSave} className="btn btn-primary btn-small">
            Save
          </button>
          <button onClick={handleCancel} className="btn btn-secondary btn-small">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mood-entry">
      <div className="mood-entry-header">
        <div className="mood-entry-mood">
          <span>{getMoodEmoji(entry.mood)}</span>
          <span>{entry.mood}</span>
        </div>
        <div className="mood-entry-date">
          {formatDate(entry.created_at)}
        </div>
        <div className="mood-entry-actions">
          <button 
            onClick={() => setIsEditing(true)} 
            className="btn btn-secondary btn-small"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(entry.id)} 
            className="btn btn-danger btn-small"
          >
            Delete
          </button>
        </div>
      </div>
      
      {entry.note && (
        <div className="mood-entry-note">
          {entry.note}
        </div>
      )}
    </div>
  );
};

export default MoodEntry;