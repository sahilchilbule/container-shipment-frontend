import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Typography,
  Box
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Users = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const initialForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    license_plate: '',
    vehicle_type: '',
    status: '',
    phone: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:8000/api/users', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('auth_token');
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      const endpoint = editMode
        ? `http://localhost:8000/api/users/${editingUserId}`
        : 'http://localhost:8000/api/users';

      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`User ${editMode ? 'updated' : 'created'} successfully!`);
        setOpen(false);
        setFormData(initialForm);
        setEditMode(false);
        fetchUsers();
      } else {
        setError(data.message || 'Validation error.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Unexpected error occurred.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchUsers();
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred during deletion');
    }
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setEditingUserId(user.id);
    setFormData({
      ...formData,
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      role: user.role,
      license_plate: user.driver?.license_plate || '',
      vehicle_type: user.driver?.vehicle_type || '',
      phone: user.driver?.phone || '',
      status: user.driver?.status || '',
    });
    setOpen(true);
  };

  const showDriverFields = formData.role === 'driver';

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>User Management</Typography>
      <Button variant="contained" color="primary" onClick={() => {
        setEditMode(false);
        setFormData(initialForm);
        setOpen(true);
      }}>
        Add User
      </Button>

      <Paper elevation={3} sx={{ mt: 4 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>License</strong></TableCell>
              <TableCell><strong>Vehicle</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id} hover>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.driver?.license_plate || '-'}</TableCell>
                <TableCell>{user.driver?.vehicle_type || '-'}</TableCell>
                <TableCell>{user.driver?.phone || '-'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(user)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(user.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editMode ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField label="Name" name="name" fullWidth margin="normal" value={formData.name} onChange={handleChange} />
          <TextField label="Email" name="email" type="email" fullWidth margin="normal" value={formData.email} onChange={handleChange} />
          <TextField label="Password" name="password" type="password" fullWidth margin="normal" value={formData.password} onChange={handleChange} />
          <TextField label="Confirm Password" name="password_confirmation" type="password" fullWidth margin="normal" value={formData.password_confirmation} onChange={handleChange} />
          <TextField
            label="Role"
            name="role"
            select
            fullWidth
            margin="normal"
            value={formData.role}
            onChange={handleChange}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="driver">Driver</MenuItem>
          </TextField>
          {showDriverFields && (
            <>
              <TextField label="License Plate" name="license_plate" fullWidth margin="normal" value={formData.license_plate} onChange={handleChange} />
              <TextField label="Vehicle Type" name="vehicle_type" fullWidth margin="normal" value={formData.vehicle_type} onChange={handleChange} />
              <TextField label="Phone" name="phone" fullWidth margin="normal" value={formData.phone} onChange={handleChange} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editMode ? 'Update' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
