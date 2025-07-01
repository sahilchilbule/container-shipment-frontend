import React, { useState } from 'react';
import PrivateRoute from './PrivateRoute';
import ForgotPassword from './ForgotPassword';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './components/DashboardHome';
import Users from './components/Users';
import Containers from './components/Containers';
import Restaurants from './components/Restaurants';
// import Orders from './components/orders';
import Orders from './components/orders';

import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './dashboard';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include',
      });

      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('auth_token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 12,
          padding: 4,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3,
          pt: 8, pb: 8,

        }}

      >
         <Typography variant="h4" gutterBottom textAlign="center">
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            margin="normal"
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>
      </Box>
      <Button
  fullWidth
  variant="text"
  color="primary"
  onClick={() => navigate('/forgot-password')}
  sx={{ marginTop: 1 }}
>
  Forgot Password?
</Button>
    </Container>
  );
}

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<Users />} />
            <Route path="/dashboard/containers" element={<Containers />} /> {/* new route */}
             <Route path="/dashboard/restaurants" element={<Restaurants />} />

        <Route path="/dashboard/orders" element={<Orders />} />
             </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />


      </Routes>
    </Router>
  );
}

export default App;
