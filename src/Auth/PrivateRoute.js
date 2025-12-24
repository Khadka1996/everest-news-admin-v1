import { Navigate } from "react-router-dom";
import { useUser } from '../Context/UserContext';
import React, { useEffect, useState } from 'react';
import DashboardBody from "../scenes/DashboardManagement/DashboardBody";
import { CircularProgress, Box } from '@mui/material'; // Import Material-UI components
import API_URL from '../config';

const PrivateRoute = () => {
    const { userData, setUserData } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleRoleCheck = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('No token found');
                    return;
                }
              
                const response = await fetch(`${API_URL}/api/auth/user/role`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
    
                if (response.ok) {
                    const data = await response.json();
                    const isAdmin = data.role === 'admin';
                    setUserData((prevUserData) => ({
                        ...prevUserData,
                        isAdmin,
                    }));
                } else {
                    console.log('Failed to fetch user role');
                }
            } catch (error) {
                console.error('Role check error:', error);
            } finally {
                setLoading(false); // Mark loading as false regardless of success or failure
            }
        };
    
        handleRoleCheck();
    }, [setUserData]);  // Add empty dependency array to avoid re-running useEffect on every render

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress /> {/* Material-UI CircularProgress */}
            </Box>
        );
    }

    return userData.isAdmin ? <DashboardBody /> : <Navigate to="/login" />;
};

export default PrivateRoute;
