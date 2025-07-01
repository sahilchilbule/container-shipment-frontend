// // src/UsersPage.js
// import React from 'react';
// import DataTable from 'react-data-table-component';
// import { FaEdit, FaTrash } from 'react-icons/fa';

// function UsersPage() {
//   const [data, setData] = React.useState([]);
//   const [formData, setFormData] = React.useState({ id: '', name: '', email: '' });
//   const [isEdit, setIsEdit] = React.useState(false);

//   const handleDelete = (row) => setData(data.filter(item => item.id !== row.id));
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

//   const columns = [
//     { name: 'Name', selector: row => row.name, sortable: true },
//     { name: 'Email', selector: row => row.email, sortable: true },
//     {
//       name: 'Actions',
//       cell: row => (
//         <>
//           <button onClick={() => handleEdit(row)}><FaEdit /></button>
//           <button onClick={() => handleDelete(row)}><FaTrash /></button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <h3>Users</h3>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Name"
//           value={formData.name}
//           onChange={e => setFormData({ ...formData, name: e.target.value })}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={e => setFormData({ ...formData, email: e.target.value })}
//           required
//         />
//         <button type="submit">{isEdit ? 'Update' : 'Add User'}</button>
//       </form>
//       <DataTable columns={columns} data={data} pagination />
//     </div>
//   );
// }

// export default UsersPage;
