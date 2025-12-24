import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import { 
  Box, 
  Typography, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AdminList = () => {
  const [adminList, setAdminList] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/admins`);
      setAdminList(response.data.admins);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const toggleListVisibility = () => {
    setShowList((prev) => !prev);
  };

  return (
    <Box m={2}>
      {/* Header with Toggle Icon */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Admin List
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography mr={1}>
            {showList ? "Hide Admins" : "Show Admins"}
          </Typography>
          <IconButton onClick={toggleListVisibility}>
            {showList ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Box>
      </Box>

      {/* Admin Table */}
      {showList && (
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>S.No.</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Admin</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adminList.map((admin, index) => (
                <TableRow key={admin._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{admin.username}</TableCell>
                  <TableCell>{admin.fullName || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default AdminList;
