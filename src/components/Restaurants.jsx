import React, { useEffect, useState } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Checkbox,
  FormControlLabel, Paper, Typography, Box
} from '@mui/material';
import { Edit, Delete, GroupAdd } from '@mui/icons-material';

const Restaurants = () => {
  const [open, setOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({ name: '', address: '', status: '' });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [managers, setManagers] = useState([]);
  const [selectedManagers, setSelectedManagers] = useState([]);

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:8000/api/restaurants', {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setRestaurants(data);
    } catch (err) { console.error(err); }
  };

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:8000/api/users', {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const onlyManagers = data.filter(user => user.role === 'manager');
        setManagers(onlyManagers);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchRestaurants(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    try {
      const token = localStorage.getItem('auth_token');
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
      const csrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1];

      const endpoint = editMode
        ? `http://localhost:8000/api/restaurants/${editingId}`
        : 'http://localhost:8000/api/addRestaurants';
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
        fetchRestaurants();
        setFormData({ name: '', address: '', status: '' });
        setEditMode(false);
        setOpen(false);
      } else {
        setError(data.message || 'Validation failed');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    }
  };

  const handleEdit = (restaurant) => {
    setEditMode(true);
    setEditingId(restaurant.id);
    setFormData({ name: restaurant.name, address: restaurant.address, status: restaurant.status });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this restaurant?')) return;
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:8000/api/restaurants/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchRestaurants();
    } catch (err) { console.error(err); }
  };

  const openAssignDialog = async (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
    await fetchManagers();
    const restaurant = restaurants.find(r => r.id === restaurantId);
    const assigned = restaurant?.managers?.map(m => m.id) || [];
    setSelectedManagers(assigned);
    setAssignDialogOpen(true);
  };

  const handleManagerCheck = (id) => {
    setSelectedManagers(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const assignManagers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
      const csrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1];

      const res = await fetch('http://localhost:8000/api/assign-manager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          restaurant_id: selectedRestaurantId,
          manager_ids: selectedManagers
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Managers assigned successfully');
        setAssignDialogOpen(false);
        setSelectedManagers([]);
        fetchRestaurants();
      } else {
        alert(data.message || 'Assignment failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Restaurants</Typography>
      <Button variant="contained" onClick={() => {
        setEditMode(false);
        setFormData({ name: '', address: '', status: '' });
        setOpen(true);
      }}>Add Restaurant</Button>

      <Paper elevation={3} sx={{ mt: 4 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              {/* <TableCell>Status</TableCell> */}
              <TableCell>Managers</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants.map(restaurant => (
              <TableRow hover key={restaurant.id}>
                <TableCell>{restaurant.name}</TableCell>
                <TableCell>{restaurant.address}</TableCell>
                {/* <TableCell>{restaurant.status}</TableCell> */}
                <TableCell>
                  {restaurant.managers?.length > 0
                    ? restaurant.managers.map(m => (
                      <div key={m.id}>{m.name},</div>
                    )) : 'No Managers Assigned'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(restaurant)}><Edit color="primary" titleAccess="Edit User"/></IconButton>
                  <IconButton onClick={() => handleDelete(restaurant.id)}><Delete color="error" titleAccess="Delete User"/></IconButton>
                  <IconButton onClick={() => openAssignDialog(restaurant.id)}><GroupAdd color="action" titleAccess="assign Manager"/></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editMode ? 'Edit' : 'Add'} Restaurant</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Name" name="name" fullWidth margin="normal" value={formData.name} onChange={handleChange} />
          <TextField label="Address" name="address" fullWidth margin="normal" value={formData.address} onChange={handleChange} />
          <TextField label="Status" name="status" fullWidth margin="normal" value={formData.status} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{editMode ? 'Update' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} fullWidth>
        <DialogTitle>Assign Manager(s)</DialogTitle>
        <DialogContent>
          {managers.map(manager => (
            <FormControlLabel
              key={manager.id}
              control={
                <Checkbox
                  checked={selectedManagers.includes(manager.id)}
                  onChange={() => handleManagerCheck(manager.id)}
                />
              }
              label={`${manager.name} (${manager.email})`}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={assignManagers}>Assign</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Restaurants;
