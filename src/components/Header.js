import React, { useState, useEffect } from 'react';
import { BsSun, BsMoon, BsSunset, BsMoonStars } from 'react-icons/bs';
import axios from 'axios';
import API_URL from '../config';


const Profile = () => {
  const [greeting, setGreeting] = useState('');
  const [user, setUser] = useState({ name: '', gender: '' });

  const getTimeOfDay = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return { message: 'Morning', icon: <BsSun className="text-orange-500 text-5xl mb-4" /> };
    } else if (currentHour >= 12 && currentHour < 17) {
      return { message: 'Afternoon', icon: <BsSunset className="text-yellow-500 text-5xl mb-4" /> };
    } else if (currentHour >= 17 && currentHour < 20) {
      return { message: 'Evening', icon: <BsMoon className="text-orange-500 text-5xl mb-4" /> };
    } else {
      return { message: 'Night', icon: <BsMoonStars className="text-gray-600 text-5xl mb-4" /> };
    }
  };

  useEffect(() => {
    const { message } = getTimeOfDay();
    setGreeting(`Good ${message}!`);
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/user-info`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        const userData = response.data;
        setUser(userData);
      } else {
        console.error('Failed to fetch user information');
      }
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };

  const getTitle = () => {
    return user.gender === 'male' ? 'Mr.' : 'Miss.';
  };

  return (
    <div className="">
      <h3 className="text-3xl font-bold mb-4">{greeting}</h3>
      <h4 className="text-xl">
        {getTitle()} <span className="font-bold">{user.username}</span>
      </h4>
      {/* Display the time icon */}
      <div className="text-center">{getTimeOfDay().icon}</div>
      {/* Draw lines below the icon */}
      <div className="w-full border-b border-gray-300 my-2"></div>
      <div className="w-full border-b border-gray-300 mb-4"></div>
    </div>
  );
};

export default Profile;
