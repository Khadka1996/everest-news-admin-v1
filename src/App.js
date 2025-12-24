import React from 'react';
import {  Routes, Route,  Navigate } from 'react-router-dom';
import DashboardManagement from './scenes/DashboardManagement/DashboardBody';
import LoginForm from './Auth/Login';
import RegisterForm from './Auth/Register'; 
import PrivateRoute from './Auth/PrivateRoute';
import { UserProvider } from './Context/UserContext';
const App = () => {
  const handleRegister = () => {
    return <Navigate to="/login" />;
  };
  return (
    <UserProvider>
 
      
      <Routes>
        <Route path="/login" element={<LoginForm  />} />
        <Route path="/register" element={<RegisterForm onRegister={handleRegister} />} />
        <Route path='/*' element={
        <PrivateRoute >
          <DashboardManagement/>
        </PrivateRoute>
        }>
    </Route>
      </Routes>
  
    </UserProvider>
  );
};

export default App;
