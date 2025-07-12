import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';

interface FeedbackFormProps {
  readingId: string;
  readingType: 'tarot' | 'iching' | 'bazi' | 'numerology' | 'compatibility' | 'holistic';
  onFeedbackSubmitted?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ readingId, readingType, onFeedbackSubmitted }) => {
  const { t } = useTranslation();
  const { user } = useUser();
  
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [accurate, setAccurate] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  if (!user) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-center text-gray-600 dark:text-gray-300">
          {t('feedback.loginRequired')}
        </p>
      </div>
    );
  }
  
  if (submitted) {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
        <p className="text-center text-green-700 dark:text-green-300">
          {t('feedback.thankYou')}
        </p>
      </div>
    );
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError(t('feedback.ratingRequired'));
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          readingId,
          readingType,
          rating,
          comment: comment.trim() || undefined,
          helpful,
          accurate,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted();
        }
      } else {
        setError(data.message || t('feedback.submitError'));
      }
    } catch (err) {
      setError(t('feedback.networkError'));
      console.error('Feedback submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
            aria-label={`Rate ${star} stars`}
          >
            <svg
              className={`w-8 h-8 ${
                rating >= star 
                  ? 'text-yellow-400' 
                  : 'text-gray-300 dark:text-gray-600'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
        {t('feedback.title')}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('feedback.ratingLabel')}
          </label>
          {renderStars()}
        </div>
        
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('feedback.commentLabel')}
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            rows={3}
            placeholder={t('feedback.commentPlaceholder')}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('feedback.helpfulLabel')}
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setHelpful(true)}
                className={`px-4 py-1 text-sm rounded-full ${
                  helpful === true
                    ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {t('feedback.yes')}
              </button>
              <button
                type="button"
                onClick={() => setHelpful(false)}
                className={`px-4 py-1 text-sm rounded-full ${
                  helpful === false
                    ? 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {t('feedback.no')}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('feedback.accurateLabel')}
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setAccurate(true)}
                className={`px-4 py-1 text-sm rounded-full ${
                  accurate === true
                    ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {t('feedback.yes')}
              </button>
              <button
                type="button"
                onClick={() => setAccurate(false)}
                className={`px-4 py-1 text-sm rounded-full ${
                  accurate === false
                    ? 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {t('feedback.no')}
              </button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? t('feedback.submitting') : t('feedback.submit')}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm; 