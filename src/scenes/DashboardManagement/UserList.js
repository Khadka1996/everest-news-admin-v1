import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config';
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('${API_URL}/api/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    try {
      await axios.put(`${API_URL}/api/users/${userId}/update-role`, { role: newRole });
      // Refresh the user list after updating the role
      const response = await axios.get(`${API_URL}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <div>
      <h2>User List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <span>{user.username}</span>
              {/* Display the user's current role */}
              <span>({user.role})</span>
              {/* Option to change the role (example: toggle between 'user' and 'author') */}
              <button onClick={() => handleChangeRole(user._id, user.role === 'user' ? 'author' : 'user')}>
                {user.role === 'user' ? 'Make Author' : 'Revert to User'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;