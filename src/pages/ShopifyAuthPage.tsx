import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useUser } from '../context/UserContext';

const ShopifyAuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/shopify-auth/login' : '/shopify-auth/register';
    const payload = isLogin ? { email, password } : { email, password, firstName, lastName };

    try {
      const response = await api.post(endpoint, payload);
      const { shopifyAccessToken } = response.data;

      // Update user context with the new token
      setUser(prevUser => {
        if (!prevUser) return null;
        return { ...prevUser, shopifyAccessToken };
      });

      // Redirect to the my-orders page on successful auth
      navigate('/my-orders');

    } catch (err: any) {
      const errorMsg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'An unknown error occurred.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Login to Your Shop Account' : 'Create a Shop Account'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div className="mb-4">
              <label className="block mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300">
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)} className="text-center w-full mt-4 text-sm text-blue-500 hover:underline">
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
    </div>
  );
};

export default ShopifyAuthPage;
