import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../context/UserContext';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Define reading types
const readingTypes = [
  { id: 'tarot', name: '塔罗牌' },
  { id: 'iching', name: '易经' },
  { id: 'bazi', name: '八字' },
  { id: 'numerology', name: '数字学' },
  { id: 'compatibility', name: '兼容性分析' },
  { id: 'holistic', name: '综合命理' },
  { id: 'starAstrology', name: '星座占星' }
];

// Time range options
const timeRangeOptions = [
  { value: 7, label: '最近7天' },
  { value: 30, label: '最近30天' },
  { value: 90, label: '最近90天' },
  { value: 180, label: '最近6个月' },
  { value: 365, label: '最近一年' }
];

const FeedbackAnalyticsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  
  const [selectedType, setSelectedType] = useState<string>('tarot');
  const [timeRange, setTimeRange] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [comparison, setComparison] = useState<any>(null);
  const [allTypeStats, setAllTypeStats] = useState<any>(null);
  
  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      setError('您没有访问此页面的权限');
    }
  }, [user]);
  
  // Fetch analytics data
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAnalytics();
    }
  }, [selectedType, timeRange, user]);
  
  // Fetch all type stats once
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAllTypeStats();
    }
  }, [user]);
  
  // Fetch comparison data when analytics changes
  useEffect(() => {
    if (analytics && user && user.role === 'admin') {
      fetchComparison();
    }
  }, [analytics, user]);
  
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/feedback-analytics/analysis/${selectedType}?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('获取分析数据失败');
      }
      
      const data = await response.json();
      setAnalytics(data.analysis);
    } catch (err) {
      setError('获取分析数据时出错');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchComparison = async () => {
    try {
      const response = await fetch(
        `/api/feedback-analytics/compare/${selectedType}?currentPeriod=${timeRange}&previousPeriod=${timeRange}`, 
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('获取比较数据失败');
      }
      
      const data = await response.json();
      setComparison(data.comparison);
    } catch (err) {
      console.error('Comparison fetch error:', err);
      // Don't set error state here to avoid blocking the UI
    }
  };
  
  const fetchAllTypeStats = async () => {
    try {
      const response = await fetch('/api/feedback-analytics/all-types', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('获取所有类型统计失败');
      }
      
      const data = await response.json();
      setAllTypeStats(data.stats);
    } catch (err) {
      console.error('All type stats fetch error:', err);
      // Don't set error state here to avoid blocking the UI
    }
  };
  
  // Prepare chart data for trends
  const getTrendChartData = () => {
    if (!analytics || !analytics.trends || analytics.trends.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: '平均评分',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      };
    }
    
    return {
      labels: analytics.trends.map((trend: any) => trend.date),
      datasets: [
        {
          label: '平均评分',
          data: analytics.trends.map((trend: any) => trend.averageRating),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1
        },
        {
          label: '反馈数量',
          data: analytics.trends.map((trend: any) => trend.count),
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          tension: 0.1,
          yAxisID: 'y1'
        }
      ]
    };
  };
  
  // Prepare chart data for distribution
  const getDistributionChartData = () => {
    if (!analytics || !analytics.distribution || analytics.distribution.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: '评分分布',
            data: [],
            backgroundColor: []
          }
        ]
      };
    }
    
    const backgroundColors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(255, 205, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(54, 162, 235, 0.6)'
    ];
    
    return {
      labels: analytics.distribution.map((d: any) => `${d.rating}星`),
      datasets: [
        {
          label: '评分分布',
          data: analytics.distribution.map((d: any) => d.count),
          backgroundColor: backgroundColors.slice(0, analytics.distribution.length)
        }
      ]
    };
  };
  
  // Prepare chart data for all types comparison
  const getAllTypesChartData = () => {
    if (!allTypeStats) {
      return {
        labels: [],
        datasets: [
          {
            label: '平均评分',
            data: [],
            backgroundColor: []
          }
        ]
      };
    }
    
    const backgroundColors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(255, 205, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(201, 203, 207, 0.6)'
    ];
    
    const types = Object.keys(allTypeStats);
    
    return {
      labels: types.map(type => {
        const readingType = readingTypes.find(rt => rt.id === type);
        return readingType ? readingType.name : type;
      }),
      datasets: [
        {
          label: '平均评分',
          data: types.map(type => allTypeStats[type].averageRating),
          backgroundColor: backgroundColors.slice(0, types.length)
        }
      ]
    };
  };
  
  // Chart options
  const trendChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        min: 0,
        max: 5,
        title: {
          display: true,
          text: '平均评分'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: '反馈数量'
        }
      },
    },
    plugins: {
      title: {
        display: true,
        text: '反馈趋势'
      },
    },
  };
  
  if (error && error === '您没有访问此页面的权限') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">错误：</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">反馈分析仪表板</h1>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            解读类型
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {readingTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            时间范围
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error && error !== '您没有访问此页面的权限' ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">错误：</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">总反馈数</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {analytics.totalCount}
                </p>
                {comparison && (
                  <p className={`text-sm ${comparison.changes.countChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {comparison.changes.countChange >= 0 ? '↑' : '↓'} {Math.abs(comparison.changes.countChangePercentage).toFixed(1)}%
                  </p>
                )}
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">平均评分</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {analytics.averageRating.toFixed(1)}
                </p>
                {comparison && (
                  <p className={`text-sm ${comparison.changes.ratingChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {comparison.changes.ratingChange >= 0 ? '↑' : '↓'} {Math.abs(comparison.changes.ratingChangePercentage).toFixed(1)}%
                  </p>
                )}
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">有用度</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {analytics.helpfulPercentage.toFixed(1)}%
                </p>
                {comparison && (
                  <p className={`text-sm ${comparison.changes.helpfulChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {comparison.changes.helpfulChange >= 0 ? '↑' : '↓'} {Math.abs(comparison.changes.helpfulChange).toFixed(1)}%
                  </p>
                )}
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">准确度</h3>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {analytics.accuratePercentage.toFixed(1)}%
                </p>
                {comparison && (
                  <p className={`text-sm ${comparison.changes.accurateChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {comparison.changes.accurateChange >= 0 ? '↑' : '↓'} {Math.abs(comparison.changes.accurateChange).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          )}
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Trends Chart */}
            {analytics && analytics.trends && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">反馈趋势</h3>
                <div className="h-80">
                  <Line data={getTrendChartData()} options={trendChartOptions} />
                </div>
              </div>
            )}
            
            {/* Distribution Chart */}
            {analytics && analytics.distribution && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">评分分布</h3>
                <div className="h-80">
                  <Bar 
                    data={getDistributionChartData()}
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: '评分分布'
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* All Types Comparison */}
          {allTypeStats && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">各类型平均评分比较</h3>
              <div className="h-80">
                <Bar 
                  data={getAllTypesChartData()}
                  options={{
                    responsive: true,
                    plugins: {
                      title: {
                        display: true,
                        text: '各类型平均评分'
                      },
                    },
                    scales: {
                      y: {
                        min: 0,
                        max: 5
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Top Comments */}
          {analytics && analytics.topComments && analytics.topComments.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">热门评论</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        评分
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        评论
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        日期
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {analytics.topComments.map((comment: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-gray-200">{comment.comment}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FeedbackAnalyticsPage; 