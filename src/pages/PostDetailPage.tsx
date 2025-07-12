import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext';

// Define types based on backend models
interface IComment {
  _id: string;
  content: string;
  user: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface IPost {
  _id: string;
  title: string;
  content: Record<string, any>;
  summary: string;
  user: {
    _id: string;
    name: string;
  };
  likes: string[];
  comments: IComment[];
  createdAt: string;
}

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleLike = async () => {
    if (!post || !user) {
      alert('Please log in to like this post!');
      return;
    }

    const originalLikes = [...post.likes];
    const isLiked = post.likes.includes(user.id);

    // Optimistic update
    const newLikes = isLiked
      ? post.likes.filter(likeId => likeId !== user.id)
      : [...post.likes, user.id];
    
    setPost({ ...post, likes: newLikes });

    try {
      const response = await api.post(`/community/${post._id}/like`);
      // Update with the actual likes from the server to ensure consistency
      setPost(prevPost => prevPost ? { ...prevPost, likes: response.data.likes } : null);
    } catch (err) {
      console.error('Failed to like post:', err);
      // Revert on error
      setPost({ ...post, likes: originalLikes });
      alert('Failed to like the post. Please try again later.');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !user || !newComment.trim()) {
      return;
    }

    const tempId = `temp_${Date.now()}`;
    const optimisticComment: IComment = {
      _id: tempId,
      content: newComment,
      user: { _id: user.id, name: user.name },
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setPost(prevPost => prevPost ? { ...prevPost, comments: [...prevPost.comments, optimisticComment] } : null);
    setNewComment('');

    try {
      const response = await api.post(`/community/${post._id}/comments`, { content: newComment });
      // Replace optimistic comment with real one from server
      setPost(prevPost => {
        if (!prevPost) return null;
        const updatedComments = prevPost.comments.map(c => c._id === tempId ? response.data : c);
        return { ...prevPost, comments: updatedComments };
      });
    } catch (err) {
      console.error('Failed to submit comment:', err);
      // Revert on error
      setPost(prevPost => {
        if (!prevPost) return null;
        return { ...prevPost, comments: prevPost.comments.filter(c => c._id !== tempId) };
      });
      alert('Failed to submit comment. Please try again later.');
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/community/${id}`);
        setPost(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch post details:', err);
        setError('Failed to load post details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <Layout><p className="text-center p-8">Loading...</p></Layout>;
  }

  if (error) {
    return <Layout><p className="text-center text-red-500 p-8">{error}</p></Layout>;
  }

  if (!post) {
    return <Layout><p className="text-center p-8">Post not found.</p></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span>By {post.user.name}</span>
            <span>Posted on {new Date(post.createdAt).toLocaleString()}</span>
          </div>
          
          {/* Displaying raw content for now, can be formatted later */}
          <div className="prose dark:prose-invert max-w-none mb-8">
            <pre>{JSON.stringify(post.content, null, 2)}</pre>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLike}
              disabled={!user}
              className={`flex items-center space-x-2 transition-colors ${
                user && post.likes.includes(user.id)
                  ? 'text-red-500'
                  : 'text-gray-500 hover:text-red-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span>❤️</span>
              <span>{post.likes.length}</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Comments ({post.comments.length})</h2>
          
          {/* Add Comment Form */}
          {user && (
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                rows={3}
                required
              />
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Submit Comment
              </button>
            </form>
          )}

          <div className="space-y-4">
            {post.comments.map(comment => (
              <div key={comment._id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <p className="mb-2">{comment.content}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <span>{comment.user.name}</span> - <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetailPage;
