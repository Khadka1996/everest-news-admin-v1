import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, CircularProgress, Container, Typography, Box, Paper, Checkbox, FormControlLabel, IconButton, Select, MenuItem } from '@mui/material'; // Add Select and MenuItem
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Icons for password visibility
import logo from './logo.png'; // Assuming logo.png is in the assets folder
import API_URL from '../config';

const RegisterForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    agreedTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, agreedTerms: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowPasswordError(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setShowPasswordError(true);
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting registration form...');

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful. Received token:', data.token);
        onRegister(data.token);
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          gender: '',
          agreedTerms: false,
        });
      } else {
        const errorMessage = await response.text();
        console.error('Registration failed:', errorMessage);
        setError('Registration failed. Please check your input.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
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
        <img src={logo} alt="Background Logo" style={{ width: '70%', height: 'auto' }} />
      </Box>

      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Logo at the top */}
          <Box display="flex" justifyContent="center" mb={2}>
            <img src={logo} alt="Logo" style={{ width: '150px' }} />
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h5" component="h2" gutterBottom>
              Create an Account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                id="username"
                label="Username"
                variant="outlined"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                id="email"
                label="Email"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <IconButton
                onClick={toggleShowPassword}
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
            <Box mb={2} sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <IconButton
                onClick={toggleShowConfirmPassword}
                edge="end"
                sx={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </IconButton>
            </Box>
            <Box mb={2}>
  <Select
    fullWidth
    id="gender"
    name="gender"
    value={formData.gender} // This will initially be empty
    onChange={handleChange}
    variant="outlined"
    displayEmpty // This prop allows the empty placeholder to be shown
    required
  >
    <MenuItem value="">
      <em>Select gender</em> {/* Placeholder prompt */}
    </MenuItem>
    <MenuItem value="male">Male</MenuItem>
    <MenuItem value="female">Female</MenuItem>
  </Select>
</Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreedTerms}
                  onChange={handleCheckboxChange}
                  color="primary"
                />
              }
              label={
                <span style={{ color: '#000' }}>
                  I agree to the <Link to="/terms" style={{ color: '#1976d2', textDecoration: 'underline' }}>terms and conditions</Link>
                </span>
              }
            />
            {showPasswordError && <p className="text-red-500 text-sm">{error}</p>}
            <Box mt={2} mb={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </Box>
          </form>

          <Box textAlign="center">
            <Typography variant="body2">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                Login here
              </Link>.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterForm;
