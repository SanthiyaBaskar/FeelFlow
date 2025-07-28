import React from 'react';

const moods = [
  { value: 'Happy', emoji: '😊', label: 'Happy' },
  { value: 'Sad', emoji: '😢', label: 'Sad' },
  { value: 'Angry', emoji: '😠', label: 'Angry' },
  { value: 'Okay', emoji: '😐', label: 'Okay' },
];

const MoodSelector = ({ selectedMood, onMoodSelect }) => {
  return (
    <div className="mood-options">
      {moods.map((mood) => (
        <div
          key={mood.value}
          className={`mood-option ${selectedMood === mood.value ? 'selected' : ''}`}
          onClick={() => onMoodSelect(mood.value)}
        >
          <span className="mood-emoji">{mood.emoji}</span>
          <span className="mood-label">{mood.label}</span>
        </div>
      ))}
    </div>
  );
};

export default MoodSelector;