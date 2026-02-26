import React, { useEffect, useState } from "react";
import { Box, Button, Card, CardContent, Typography, Grid, Container, Paper } from "@mui/material";
import { useTheme } from "@mui/system";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EyeIcon from "@mui/icons-material/Visibility";
import ArticleIcon from "@mui/icons-material/Article";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import { saveAs } from "file-saver";
import {
  WbSunnyOutlined as MorningIcon,
  Brightness4Outlined as EveningIcon,
  WbSunnyOutlined as AfternoonIcon,
  NightlightOutlined as NightIcon
} from "@mui/icons-material";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import API_URL from '../../config';
import AdminList from "../DashboardManagement/AdminList";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [nepaliArticles, setNepaliArticles] = useState([]);
  const [englishArticles, setEnglishArticles] = useState([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState(30);

  const timePeriods = [
    { label: "1 Day", days: 1 },
    { label: "1 Week", days: 7 },
    { label: "1 Month", days: 30 },
    { label: "1 Year", days: 365 }
  ];

  const getPeriodLabel = (days) => {
    const period = timePeriods.find(p => p.days === days);
    return period ? period.label : `${days} days`;
  };

  const fetchDashboardData = async (days) => {
    setLoading(true);
    try {
      const [summaryRes, chartRes] = await Promise.all([
        axios.get(`${API_URL}/api/dashboard/summary?days=${days}`),
        axios.get(`${API_URL}/api/dashboard/visits-chart?days=${days}`)
      ]);

      if (summaryRes.data.success) {
        setTotalVisits(summaryRes.data.data.totalVisits);
        setNepaliArticles(new Array(summaryRes.data.data.nepaliArticles).fill({}));
        setEnglishArticles(new Array(summaryRes.data.data.englishArticles).fill({}));
      }

      if (chartRes.data.success) {
        setChartData(chartRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setTotalVisits(0);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedDays);
  }, []);

  const handleTimePeriodChange = (days) => {
    setSelectedDays(days);
    fetchDashboardData(days);
  };

  const getGreetingData = () => {
    const currentTime = new Date().getHours();
    if (currentTime >= 5 && currentTime < 12) {
      return { greeting: "Good Morning", icon: <MorningIcon /> };
    } else if (currentTime >= 12 && currentTime < 18) {
      return { greeting: "Good Afternoon", icon: <AfternoonIcon /> };
    } else if (currentTime >= 18 && currentTime < 22) {
      return { greeting: "Good Evening", icon: <EveningIcon /> };
    } else {
      return { greeting: "Good Night", icon: <NightIcon /> };
    }
  };

  const { greeting, icon } = getGreetingData();

  const handleDownloadBackup = () => {
    try {
      const allArticles = {
        nepali: nepaliArticles,
        english: englishArticles,
        total: nepaliArticles.length + englishArticles.length
      };
      const json = JSON.stringify(allArticles, null, 2);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      saveAs(blob, 'articles_backup.json');
    } catch (error) {
      console.error('Error creating backup:', error);
    }
  };

  // Prepare chart data
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: colors.grey[100],
          font: { size: 14, weight: 'bold' },
          padding: 20,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: `Website Visits - ${getPeriodLabel(selectedDays)}`,
        color: colors.grey[100],
        font: { size: 16, weight: 'bold' },
        padding: 20
      },
      tooltip: {
        backgroundColor: colors.primary[400],
        titleColor: colors.grey[100],
        bodyColor: colors.grey[100],
        borderColor: colors.blueAccent[700],
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `Visits: ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        grid: { color: colors.primary[300] },
        ticks: { color: colors.grey[100] },
        title: { display: true, text: 'Visits', color: colors.grey[100] }
      },
      x: {
        grid: { color: colors.primary[300] },
        ticks: { color: colors.grey[100] }
      }
    }
  };

  const chartDataset = {
    labels: chartData.map(d => d.date),
    datasets: [
      {
        label: 'Total Visits',
        data: chartData.map(d => d.visits),
        borderColor: colors.blueAccent[400],
        backgroundColor: `${colors.blueAccent[700]}20`,
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: colors.blueAccent[400],
        pointBorderColor: colors.grey[100],
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const StatCard = ({ title, value, icon: StatIcon, color }) => (
    <Card 
      sx={{ 
        backgroundColor: colors.primary[400], 
        borderRadius: '12px',
        border: `2px solid ${colors.primary[300]}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 8px 16px ${color}40`
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color={colors.grey[200]} variant="body2" sx={{ mb: 1, textTransform: 'uppercase', fontSize: '12px', fontWeight: '600', letterSpacing: '1px' }}>
              {title}
            </Typography>
            <Typography variant="h3" color={color} sx={{ fontWeight: 'bold' }}>
              {loading ? '...' : value.toLocaleString()}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              backgroundColor: `${color}20`, 
              padding: '12px', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <StatIcon sx={{ fontSize: 32, color: color }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Container maxWidth="xl">
        <Box p="24px">
          {/* HEADER */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Header wish={greeting} icon={icon} gender="Mr" name="Janak" />
            <Button
              onClick={handleDownloadBackup}
              sx={{
                backgroundColor: colors.blueAccent[700],
                color: colors.grey[100],
                fontSize: "14px",
                fontWeight: "bold",
                padding: "12px 24px",
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: colors.blueAccent[600],
                  transform: 'scale(1.05)'
                }
              }}
            >
              <DownloadOutlinedIcon sx={{ marginRight: "10px" }} />
              Download Backup
            </Button>
          </Box>

          {/* TIME PERIOD SELECTOR */}
          <Box display="flex" gap={2} mb={4} flexWrap="wrap">
            {timePeriods.map((period) => (
              <Button
                key={period.days}
                onClick={() => handleTimePeriodChange(period.days)}
                sx={{
                  backgroundColor: selectedDays === period.days ? colors.blueAccent[700] : colors.primary[400],
                  color: colors.grey[100],
                  fontSize: "13px",
                  fontWeight: selectedDays === period.days ? "bold" : "normal",
                  padding: "10px 20px",
                  borderRadius: '8px',
                  border: selectedDays === period.days ? `2px solid ${colors.blueAccent[300]}` : `1px solid ${colors.primary[300]}`,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  '&:hover': {
                    backgroundColor: colors.blueAccent[700],
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {period.label}
              </Button>
            ))}
          </Box>

          {/* STATS CARDS */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Total Visits" 
                value={totalVisits} 
                icon={EyeIcon}
                color={colors.greenAccent[400]}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Nepali Articles" 
                value={nepaliArticles.length}
                icon={ArticleIcon}
                color={colors.blueAccent[400]}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="English Articles" 
                value={englishArticles.length}
                icon={ArticleIcon}
                color={colors.redAccent[400]}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Total Articles" 
                value={nepaliArticles.length + englishArticles.length}
                icon={TrendingUpIcon}
                color={colors.yellowAccent?.[400] || '#FFD700'}
              />
            </Grid>
          </Grid>

          {/* CHART SECTION */}
          <Paper 
            sx={{ 
              backgroundColor: colors.primary[400],
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: `2px solid ${colors.primary[300]}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <Box sx={{ height: '400px', position: 'relative' }}>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color={colors.grey[200]}>Loading chart...</Typography>
                </Box>
              ) : chartData.length > 0 ? (
                <Line data={chartDataset} options={chartOptions} />
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <Typography color={colors.grey[200]}>No data available for this period</Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* AdminList Section */}
          <Box mt="24px">
            <AdminList />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
