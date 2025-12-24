import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import API_URL from '../config';
import {
  TextField,
  Button,
  CircularProgress,
  Container,
  Typography,
  Box,
  Paper,
  Checkbox,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Icons for password visibility
import logo from './logo.png'; // Assuming logo.png is in the assets folder

const LoginForm = () => {
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const [rememberMe, setRememberMe] = useState(false); // For "Remember Me" functionality
  const [errorMessage, setErrorMessage] = useState(''); // For displaying error messages

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleRoleCheck = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }
      const response = await fetch(`${API_URL}/api/auth/user/role`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.role === 'admin') {
          const isAdmin = data.role === 'admin';
          setUserData((prevUserData) => ({
            ...prevUserData,
            isAdmin,
          }));
        } else {
          console.log('User is not admin. Redirecting...');
          setTimeout(() => {
            alert('You are not authorized to access this resource. Redirecting to theeverestnews.com...');
            window.location.href = 'https://theeverestnews.com';
          }, 2000);
        }
      } else {
        const errorMessage = await response.text();
        console.error('Failed to fetch user role:', errorMessage);
      }
    } catch (error) {
      console.error('Role check error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(''); // Clear any previous error messages

    setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: username,
            password: password,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          console.log('Login successful. Received token:', data.token);

          // Save username in localStorage if "Remember Me" is checked
          if (rememberMe) {
            localStorage.setItem('rememberMe', username);
          }

          handleRoleCheck();
          navigate('/');
        } else {
          const errorMessage = await response.text();
          setErrorMessage('Login failed: ' + errorMessage); // Set the error message
          console.error('Login failed:', errorMessage);
        }
      } catch (error) {
        setErrorMessage('Login error: ' + error.message); // Set the error message
        console.error('Login error:', error);
      } finally {
        setLoading(false);
      }
    }, 250); // 0.25 sec delay
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#26619B',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background logo */}
      <Box
        sx={{
          position: 'absolute',
          height: 'auto',
          bottom: 0,
          right: 0,
          opacity: 0.05,
        }}
      >
        <img src={logo} alt="Background Logo" style={{ width: '100%', height: 'auto' }} />
      </Box>

      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Logo at the top */}
          <Box display="flex" justifyContent="center" mb={2}>
            <img src={logo} alt="Logo" style={{ width: '150px' }} />
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h5" component="h2" gutterBottom>
              Welcome, {userData.username || 'Admin'}!
            </Typography>
            <Typography variant="h6" component="h3" gutterBottom>
              Login Page
            </Typography>
          </Box>

          {/* Display error message */}
          {errorMessage && (
            <Box mb={2} sx={{ bgcolor: '#f44336', color: '#fff', p: 2, borderRadius: '4px' }}>
              <Typography variant="body2">{errorMessage}</Typography>
            </Box>
          )}

          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                id="email"
                label="Email"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Box>

            <Box mb={2} sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <IconButton
                onClick={togglePasswordVisibility}
                edge="end"
                sx={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </IconButton>
            </Box>

            {/* Remember Me checkbox */}
            <Box mb={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    color="primary"
                  />
                }
                label="Remember Me"
              />
            </Box>

            <Box mt={2} mb={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
          </form>

          <Box textAlign="center">
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
                Register here
              </Link>.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginForm;
