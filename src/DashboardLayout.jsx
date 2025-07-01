// import React from 'react';
// import { Outlet, Link } from 'react-router-dom';
// import { FaHome, FaUsers, FaCog } from 'react-icons/fa';

// const DashboardLayout = () => {
//   const handleLogout = async () => {
//     try {
//       await fetch('http://localhost:8000/sanctum/csrf-cookie', { credentials: 'include' });
//       const csrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1];

//       const res = await fetch('http://localhost:8000/logout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
//         },
//         credentials: 'include',
//       });

//       if (res.ok) {
//         localStorage.removeItem('auth_token');
//         window.location.href = '/';
//       } else {
//         console.error('Logout failed');
//       }
//     } catch (err) {
//       console.error('Logout error:', err);
//     }
//   };

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh' }}>
//       {/* Sidebar */}
//       <div style={{ width: '200px', backgroundColor: '#343a40', color: 'white', padding: '1rem 0', display: 'flex', flexDirection: 'column' }}>
//         <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin</h3>
//         <Link to="/dashboard" style={linkStyle}><FaHome style={iconStyle} /> Dashboard</Link>
//         <Link to="/dashboard/users" style={linkStyle}><FaUsers style={iconStyle} /> Users</Link>
//         <a href="#" style={linkStyle}><FaCog style={iconStyle} /> Settings</a>
//       </div>

//       {/* Main content */}
//       <div style={{ flex: 1, padding: '2rem' }}>
//         <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <h2>Dashboard</h2>
//           <button
//             onClick={handleLogout}
//             style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}
//           >
//             Logout
//           </button>
//         </div>
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// const linkStyle = {
//   color: 'white',
//   textDecoration: 'none',
//   padding: '20px',
//   display: 'flex',
//   alignItems: 'center',
//   gap: '10px',
// };

// const iconStyle = {
//   fontSize: '1rem',
// };

// export default DashboardLayout;
