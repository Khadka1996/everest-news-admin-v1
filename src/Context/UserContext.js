

import { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({ username: '', password: '', isAdmin: false });
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    setUserData({ isAdmin: false }); // Reset user data
};

  return (
    <UserContext.Provider value={{ userData, setUserData ,handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);