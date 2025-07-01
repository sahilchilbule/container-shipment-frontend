// components/DashboardLayout.js
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaCog } from 'react-icons/fa';
import TakeoutDiningOutlinedIcon from '@mui/icons-material/TakeoutDiningOutlined';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; // new import


const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });

      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

      const res = await fetch('http://localhost:8000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
        },
        credentials: 'include',
      });

      if (res.ok) {
        localStorage.removeItem('auth_token');
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '200px',
        backgroundColor: '#343a40',
        color: 'white',
        padding: '1rem 0',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin</h3>
        <Link to="/dashboard" style={linkStyle}><FaHome style={iconStyle} /> Dashboard</Link>
        <Link to="/dashboard/users" style={linkStyle}><FaUsers style={iconStyle} /> Users</Link>
         <Link to="/dashboard/containers"style={linkStyle}><TakeoutDiningOutlinedIcon style={iconStyle} />Containers</Link>{/* new link */}
         <Link to="/dashboard/orders" style={linkStyle}>
            <LocalShippingIcon style={iconStyle} /> Orders</Link>

       <Link to="/dashboard/restaurants"style={linkStyle}><DeliveryDiningIcon style={iconStyle} />Restaurants</Link>
        <Link to="#" style={linkStyle}><FaCog style={iconStyle} /> Settings</Link>
      </div>

      {/* Main Content */}
     <div style={{ flex: 1, padding: '2rem' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h2>Dashboard Panel</h2>
    <button
      style={{
        backgroundColor: 'red',
        color: 'white',
        padding: '0.50rem 0.9rem', // smaller padding
        fontSize: '0.75rem',       // optional: smaller text
        border: 'none',
        borderRadius: '4px',       // optional: slightly rounded
        cursor: 'pointer'
      }}
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
  <hr style={{ marginBottom: '1rem' }} />
  <Outlet />
</div>

    </div>
  );
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const iconStyle = {
  fontSize: '1rem',
};

export default DashboardLayout;
