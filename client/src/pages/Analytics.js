import React, { useState, useEffect } from 'react';
import { moodAPI } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [moodData, setMoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await moodAPI.getMoodAnalytics();
      setMoodData(response.data.moodCounts);
    } catch (err) {
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getMoodColor = (mood) => {
    const colors = {
      Happy: 'rgba(46, 204, 113, 0.8)',
      Sad: 'rgba(52, 152, 219, 0.8)',
      Angry: 'rgba(231, 76, 60, 0.8)',
      Okay: 'rgba(241, 196, 15, 0.8)',
    };
    return colors[mood] || 'rgba(149, 165, 166, 0.8)';
  };

  const getMoodBorderColor = (mood) => {
    const colors = {
      Happy: 'rgba(46, 204, 113, 1)',
      Sad: 'rgba(52, 152, 219, 1)',
      Angry: 'rgba(231, 76, 60, 1)',
      Okay: 'rgba(241, 196, 15, 1)',
    };
    return colors[mood] || 'rgba(149, 165, 166, 1)';
  };

  const chartData = moodData ? {
    labels: ['Happy 😊', 'Sad 😢', 'Angry 😠', 'Okay 😐'],
    datasets: [
      {
        label: 'Number of Days',
        data: [
          moodData.Happy,
          moodData.Sad,
          moodData.Angry,
          moodData.Okay,
        ],
        backgroundColor: [
          getMoodColor('Happy'),
          getMoodColor('Sad'),
          getMoodColor('Angry'),
          getMoodColor('Okay'),
        ],
        borderColor: [
          getMoodBorderColor('Happy'),
          getMoodBorderColor('Sad'),
          getMoodBorderColor('Angry'),
          getMoodBorderColor('Okay'),
        ],
        borderWidth: 2,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Mood Distribution - Last 7 Days',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#333',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const mood = context.label.split(' ')[0];
            const count = context.parsed.y;
            const percentage = moodData ? ((count / Object.values(moodData).reduce((a, b) => a + b, 0)) * 100).toFixed(1) : 0;
            return `${mood}: ${count} day(s) (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: 'Number of Days',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const getTotalDays = () => {
    if (!moodData) return 0;
    return Object.values(moodData).reduce((sum, count) => sum + count, 0);
  };

  const getMostCommonMood = () => {
    if (!moodData) return null;
    const entries = Object.entries(moodData);
    const maxEntry = entries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    );
    return maxEntry[1] > 0 ? maxEntry[0] : null;
  };

  if (loading) {
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
        <h1 className="page-title">Mood Analytics</h1>
        
        {error && <div className="error">{error}</div>}
        
        <div className="card">
          <h2>Past 7 Days Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>{getTotalDays()}</h3>
              <p style={{ margin: 0, fontWeight: '600' }}>Total Days Tracked</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>
                {getMostCommonMood() || 'N/A'}
              </h3>
              <p style={{ margin: 0, fontWeight: '600' }}>Most Common Mood</p>
            </div>
          </div>
        </div>

        {moodData && getTotalDays() > 0 ? (
          <div className="card">
            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        ) : (
          <div className="card">
            <h2>No data available</h2>
            <p>Start logging your moods to see analytics. You need at least one mood entry from the past 7 days to view the chart.</p>
          </div>
        )}

        {moodData && (
          <div className="card">
            <h2>Detailed Breakdown</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {Object.entries(moodData).map(([mood, count]) => (
                <div 
                  key={mood}
                  style={{ 
                    textAlign: 'center', 
                    padding: '1rem', 
                    background: getMoodColor(mood), 
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {mood === 'Happy' && '😊'}
                    {mood === 'Sad' && '😢'}
                    {mood === 'Angry' && '😠'}
                    {mood === 'Okay' && '😐'}
                  </div>
                  <div style={{ fontSize: '1.5rem' }}>{count}</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>{mood}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;