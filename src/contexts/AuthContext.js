// import React, { createContext, useState, useEffect } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem('auth_token') || null);
//   const [user, setUser] = useState(null);

//   // Auto load user if token exists
//   useEffect(() => {
//     if (token) {
//       fetchUser();
//     }
//   }, [token]);

//   const fetchUser = async () => {
//     try {
//       const res = await fetch('http://localhost:8000/api/user', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json'
//         },
//         credentials: 'include'
//       });

//       if (res.ok) {
//         const userData = await res.json();
//         setUser(userData);
//       } else {
//         logout(); // token expired or invalid
//       }
//     } catch (err) {
//       console.error('Error fetching user:', err);
//       logout();
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       await fetch('http://localhost:8000/sanctum/csrf-cookie', {
//         credentials: 'include',
//       });

//       const csrfToken = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('XSRF-TOKEN='))
//         ?.split('=')[1];

//       const res = await fetch('http://localhost:8000/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//           'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
//         },
//         credentials: 'include',
//         body: JSON.stringify({ email, password }),
//       });

//       if (res.ok) {
//         const data = await res.json();
//         localStorage.setItem('auth_token', data.token);
//         setToken(data.token);
//         return { success: true };
//       } else {
//         const error = await res.json();
//         return { success: false, message: error.message || 'Login failed' };
//       }
//     } catch (err) {
//       return { success: false, message: 'Something went wrong' };
//     }
//   };

//   const logout = async () => {
//     try {
//       await fetch('http://localhost:8000/logout', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Accept': 'application/json',
//         },
//         credentials: 'include',
//       });
//     } catch (err) {
//       console.error('Logout error:', err);
//     }
//     localStorage.removeItem('auth_token');
//     setToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
