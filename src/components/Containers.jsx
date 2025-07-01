import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const Containers = () => {
  const [open, setOpen] = useState(false);
  const [containers, setContainers] = useState([]);
  const [formData, setFormData] = useState({ name: '', code: '', status: '' });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchContainers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:8000/api/containers', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setContainers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    try {
      const token = localStorage.getItem('auth_token');
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      const endpoint = editMode
        ? `http://localhost:8000/api/containers/${editingId}`
        : 'http://localhost:8000/api/containers';
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
        fetchContainers();
        setFormData({ name: '', code: '', status: '' });
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

  const handleEdit = (container) => {
    setEditMode(true);
    setEditingId(container.id);
    setFormData({ name: container.name, code: container.code, status: container.status });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this container?')) return;
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:8000/api/containers/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) fetchContainers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">Containers</Typography>
          <Button variant="contained" onClick={() => {
            setEditMode(false);
            setFormData({ name: '', code: '', status: '' });
            setOpen(true);
          }}>Add Container</Button>
        </Box>

        <Table sx={{ mt: 3 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Code</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {containers.map((container) => (
              <TableRow key={container.id} hover>
                <TableCell>{container.name}</TableCell>
                <TableCell>{container.code}</TableCell>
                <TableCell>{container.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(container)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(container.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editMode ? 'Edit Container' : 'Add Container'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField label="Name" name="name" fullWidth margin="normal" value={formData.name} onChange={handleChange} />
          <TextField label="Code" name="code" fullWidth margin="normal" value={formData.code} onChange={handleChange} />
          <TextField label="Status" name="status" fullWidth margin="normal" value={formData.status} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>{editMode ? 'Update' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Containers;