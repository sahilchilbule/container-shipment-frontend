import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from '@mui/material';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:8000/api/order', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setOrders(data.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">Orders</Typography>
        </Box>

        <Table sx={{ mt: 3 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Restaurant</strong></TableCell>
              <TableCell><strong>Created By</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Containers</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.restaurant_id}</TableCell>
                <TableCell>{order.created_by_user_id}</TableCell>
                <TableCell>
                  <Chip label={order.status} color={
                    order.status === 'pending' ? 'warning' :
                    order.status === 'processing' ? 'info' :
                    order.status === 'delivered' ? 'success' :
                    'default'
                  } />
                </TableCell>
                <TableCell>
                  {order.containers.map((container, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        {container.name} - Qty: {container.pivot.quantity}
                      </Typography>
                    </Box>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Orders;