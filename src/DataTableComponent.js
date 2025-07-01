// // src/DataTableComponent.js
// import React, { useState } from 'react';
// import DataTable from 'react-data-table-component';
// import { FaEdit, FaTrash, FaHome, FaUsers, FaCog } from 'react-icons/fa';
// import './App.css';
// import BasicButtons from './material';

// const initialData = [
//   { id: 1, name: 'John Doe', email: 'john@example.com' },
//   { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
// ];

// function DataTableComponent() {
//   const [data, setData] = useState(initialData);
//   const [formData, setFormData] = useState({ id: '', name: '', email: '' });
//   const [isEdit, setIsEdit] = useState(false);

//   const handleDelete = (row) => {
//     const filtered = data.filter(item => item.id !== row.id);
//     setData(filtered);
//   };

//   const handleEdit = (row) => {
//     setIsEdit(true);
//     setFormData(row);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (isEdit) {
//       setData(data.map(item => item.id === formData.id ? formData : item));
//     } else {
//       setData([...data, { ...formData, id: Date.now() }]);
//     }
//     setFormData({ id: '', name: '', email: '' });
//     setIsEdit(false);
//   };

//   // 🔐 Logout handler
//   const handleLogout = async () => {
//     try {

//       // Step 1: Ensure CSRF cookie is set
//       await fetch('http://localhost:8000/sanctum/csrf-cookie', {
//         credentials: 'include',
//       });

//       // Step 2: Get token from cookies
//       const csrfToken = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('XSRF-TOKEN='))
//         ?.split('=')[1];
//         console.log("CSRF Token:--", csrfToken);

//       // Step 3: Send logout request
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

//   const columns = [
//     { name: 'Name', selector: row => row.name, sortable: true },
//     { name: 'Email', selector: row => row.email, sortable: true },
//     {
//       name: 'Actions',
//       cell: (row) => (
//         <>
//           <button onClick={() => handleEdit(row)}><FaEdit /></button>
//           <button onClick={() => handleDelete(row)} style={{ marginLeft: '10px' }}><FaTrash /></button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh' }}>
//       {/* Sidebar */}
//       <div style={{
//         width: '200px',
//         backgroundColor: '#343a40',
//         color: 'white',
//         padding: '1rem 0',
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin</h3>
//         <a href="#" style={linkStyle}><FaHome style={iconStyle} /> Dashboard</a>
//         <a href="#" style={linkStyle}><FaUsers style={iconStyle} /> Users</a>
//         <a href="#" style={linkStyle}><FaCog style={iconStyle} /> Settings</a>
//       </div>

//       {/* Main Content */}
//       <div style={{ flex: 1, padding: '2rem' }}>
//         {/* Header with breadcrumb */}
//         <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <div>
//             <h2>Dashboard</h2>
//             <p style={{ color: '#6c757d' }}>Home / Dashboard</p>
//           </div>
//           <button
//             style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}
//             onClick={handleLogout}
//           >
//             Logout
//           </button>
//         </div>

//         {/* Form */}
//         {/* <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
//           <input
//             type="text"
//             placeholder="Name"
//             value={formData.name}
//             required
//             onChange={e => setFormData({ ...formData, name: e.target.value })}
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             value={formData.email}
//             required
//             onChange={e => setFormData({ ...formData, email: e.target.value })}
//           />
//           <button type="submit">{isEdit ? 'Update' : 'Add'}</button>
//         </form> */}

//         {/* DataTable */}
//         {/* <DataTable
//           columns={columns}
//           data={data}
//           pagination
//           highlightOnHover
//         /> */}
//       </div>
//     </div>
//   );
// }

// const linkStyle = {
//   color: 'white',
//   textDecoration: 'none',
//   padding: '20px 20px',
//   display: 'flex',
//   alignItems: 'center',
//   gap: '10px',
// };

// const iconStyle = {
//   fontSize: '1rem',
// };

// export default DataTableComponent;
