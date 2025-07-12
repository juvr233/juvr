import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';

// Define the type for a post, mirroring the backend model
interface IPost {
  _id: string;
  title: string;
  summary: string;
  divinationType: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  likes: string[];
  comments: string[];
  createdAt: string;
}

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/community');
        setPosts(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch community posts:', err);
        setError('Failed to load community posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Community Share</h1>
          <Link to="/community/new" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
            Share My Divination
          </Link>
        </div>
        
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <Link to={`/community/${post._id}`} key={post._id} className="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{post.summary}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-300">
                <span>Shared by: {post.user.name}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between mt-4 text-gray-500 dark:text-gray-300">
                <span>❤️ {post.likes.length}</span>
                <span>💬 {post.comments.length}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPage;
