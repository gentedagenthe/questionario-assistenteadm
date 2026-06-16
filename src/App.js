import React from 'react';
import Questionario from './components/Questionario';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const isAdmin = window.location.pathname === '/admin';
  return isAdmin ? <AdminPanel /> : <Questionario />;
}
