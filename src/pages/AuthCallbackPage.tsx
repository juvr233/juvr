import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';

const AuthCallbackPage: React.FC = () => {
  const { setUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Store the token
      localStorage.setItem('token', token);
      
      // Set the token for future API requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Fetch user profile and update context
      api.get('/auth/profile')
        .then(response => {
          setUser(response.data);
          // Redirect to the profile page or home page after successful login
          navigate('/profile');
        })
        .catch(error => {
          console.error('Failed to fetch user profile after callback:', error);
          // Handle error, maybe redirect to login page
          navigate('/login');
        });
    } else {
      // No token found, redirect to login
      console.error('No token found in callback URL.');
      navigate('/login');
    }
  }, [location, navigate, setUser]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Authenticating, please wait...</p>
    </div>
  );
};

export default AuthCallbackPage;
