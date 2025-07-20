import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import { useUser } from '../context/UserContext';

interface DivinationHistory {
  _id: string;
  type: 'Numerology' | 'Tarot' | 'IChing';
  result: Record<string, any>;
  createdAt: string;
}

const CreatePostPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [divinationType, setDivinationType] = useState<'Numerology' | 'Tarot' | 'IChing'>('Tarot');
  const [content, setContent] = useState('');
  const [history, setHistory] = useState<DivinationHistory[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        try {
          const response: any = await api.get('/divination');
          setHistory(response);
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to fetch divination history:', err);
          }
          setError('Failed to load divination history.');
        }
      }
    };
    fetchHistory();
  }, [user]);

  const handleHistorySelect = (historyId: string) => {
    const selected = history.find(h => h._id === historyId);
    if (selected) {
      setSelectedHistoryId(historyId);
      setTitle(`My ${selected.type} Divination Sharing`);
      setSummary(`A profound insight into ${selected.type}...`);
      setDivinationType(selected.type);
      setContent(JSON.stringify(selected.result, null, 2));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) {
      setError('All fields are required.');
      return;
    }
    if (!user) {
      setError('You need to be logged in to post.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (jsonError) {
        setError('Divination content must be in valid JSON format.');
        setLoading(false);
        return;
      }

      const postData = {
        title,
        summary,
        divinationType,
        content: parsedContent,
      };

      const newPost: any = await api.post('/community', postData);
      navigate(`/community/${newPost._id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create post. Please try again later.');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="text-center p-8">
          <p>Please log in to share your divination results.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">Share Your Divination</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="summary" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Summary</label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="divinationType" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Divination Type</label>
            <select
              id="divinationType"
              value={divinationType}
              onChange={(e) => setDivinationType(e.target.value as any)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Tarot">Tarot</option>
              <option value="Numerology">Numerology</option>
              <option value="IChing">I Ching</option>
            </select>
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">Select a divination history to share</label>
            <select
              value={selectedHistoryId}
              onChange={(e) => handleHistorySelect(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>-- Select from your history --</option>
              {history.map(h => (
                <option key={h._id} value={h._id}>
                  {h.type} - {new Date(h.createdAt).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="content" className="block text-lg font-medium text-gray-700 dark:text-gray-300">Divination Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono"
              required
              readOnly={!!selectedHistoryId}
            />
            <p className="text-sm text-gray-500 mt-2">After selecting a history, the content will be automatically filled and cannot be edited.</p>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Share'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreatePostPage;
