import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import API_URL from '../../config';
import { CircularProgress, Box, TextField, MenuItem, Card, CardContent, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const convertToNepaliNumber = (number) => {
  const nepaliNumbers = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return number.toString().split('').map(digit => nepaliNumbers[digit]).join('');
};

const Analytics = () => {
  const [categoryData, setCategoryData] = useState(null);
  const [deviceData, setDeviceData] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [engagementData, setEngagementData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch category analytics
      const categoryRes = await axios.get(`${API_URL}/api/analytics/categories?days=${days}`);
      if (categoryRes.data.success) {
        setCategoryData(categoryRes.data.categories);
      }

      // Fetch device analytics
      const deviceRes = await axios.get(`${API_URL}/api/analytics/devices?days=${days}`);
      if (deviceRes.data.success) {
        setDeviceData(deviceRes.data.devices);
      }

      // Fetch engagement analytics
      const engagementRes = await axios.get(`${API_URL}/api/analytics/engagement?days=${days}`);
      if (engagementRes.data.success) {
        const timeSpent = engagementRes.data.timeSpent?.[0] || {};
        const scrollDepth = engagementRes.data.scrollDepth?.[0] || {};
        setEngagementData({
          totalViews: timeSpent.totalTime || 0,
          uniqueSessions: 0,
          avgTimeSpent: timeSpent.avgTime || 0,
          avgScrollDepth: scrollDepth.avgScroll || 0,
        });
      }

      // Fetch time series analytics
      const timeRes = await axios.get(`${API_URL}/api/analytics/time-series?granularity=daily&days=${days}`);
      if (timeRes.data.success) {
        setTimeSeriesData(timeRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Category Analytics Chart
  const categoryChartData = {
    labels: categoryData?.map(cat => cat.category || 'Uncategorized') || [],
    datasets: [
      {
        label: 'Total Views',
        data: categoryData?.map(cat => cat.totalViews) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Unique Sessions',
        data: categoryData?.map(cat => cat.uniqueSessions) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Avg Time Spent (seconds)',
        data: categoryData?.map(cat => cat.avgTimeSpent) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Device Analytics Chart
  const deviceChartData = {
    labels: deviceData?.map(dev => dev._id || 'Unknown') || [],
    datasets: [
      {
        label: 'Views by Device',
        data: deviceData?.map(dev => dev.count) || [],
        backgroundColor: [
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 205, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 205, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Time Series Chart
  const timeChartData = {
    labels: timeSeriesData?.map(t => {
      const date = new Date(t._id.year, t._id.month - 1, t._id.day);
      return date.toLocaleDateString();
    }) || [],
    datasets: [
      {
        label: 'Daily Views',
        data: timeSeriesData?.map(t => t.views) || [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Analytics Dashboard
      </Typography>

      {/* Days Filter */}
      <Box sx={{ mb: 2 }}>
        <TextField
          select
          label="Period"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          variant="outlined"
          size="small"
        >
          <MenuItem value={7}>7 Days</MenuItem>
          <MenuItem value={30}>30 Days</MenuItem>
          <MenuItem value={60}>60 Days</MenuItem>
          <MenuItem value={90}>90 Days</MenuItem>
        </TextField>
      </Box>

      {/* Category Analytics */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography variant="subtitle2" gutterBottom>
            Category Analytics
          </Typography>
          <Box sx={{ height: 250 }}>
            <Bar data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </Box>
          <Box sx={{ mt: 1, maxHeight: '150px', overflowY: 'auto' }}>
            {categoryData?.map((cat) => (
              <Typography key={cat.category} variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                <strong>{cat.category || 'Uncategorized'}:</strong> {cat.totalViews} views
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Device Analytics */}
      {deviceData && deviceData.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="subtitle2" gutterBottom>
              Device Analytics
            </Typography>
            <Box sx={{ height: 250 }}>
              <Bar data={deviceChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Engagement Stats */}
      {engagementData && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="subtitle2" gutterBottom>
              Engagement Metrics
            </Typography>
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(120px, 1fr))" gap={1}>
              <Box>
                <Typography variant="caption" color="textSecondary">Total Time (s)</Typography>
                <Typography variant="h6">{engagementData.totalViews?.toLocaleString() || 0}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Avg Time (s)</Typography>
                <Typography variant="h6">{engagementData.avgTimeSpent?.toFixed(1) || 0}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Scroll Depth (%)</Typography>
                <Typography variant="h6">{engagementData.avgScrollDepth?.toFixed(1) || 0}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Time Series Analytics */}
      {timeSeriesData && timeSeriesData.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="subtitle2" gutterBottom>
              Daily Views Trend
            </Typography>
            <Box sx={{ height: 250 }}>
              <Line data={timeChartData} options={{ responsive: true, maintainAspectRatio: false }} />
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Analytics;
