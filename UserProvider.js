// In the same file as UserContext.js or a new file, e.g., UserProvider.js
import React, { useState } from 'react';
import UserContext from './UserContext';

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  const setSessionUserId = (newUserId) => {
    setUserId(newUserId);
  };

  return (
    <UserContext.Provider value={{ userId, setSessionUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
