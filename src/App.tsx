import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import ResultsPage from './pages/ResultsPage';
import CompatibilityPage from './pages/CompatibilityPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import TarotPage from './pages/TarotPage';
import ZhouyiPage from './pages/ZhouyiPage';
import StarAstrologyPage from './pages/StarAstrologyPage';
import BaziAnalysisPage from './pages/BaziAnalysisPage';
import HolisticDivinationPage from './pages/HolisticDivinationPage';
import CommunityPage from './pages/CommunityPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import PurchasePage from './pages/PurchasePage';
import SuccessPage from './pages/payment/SuccessPage';
import CancelPage from './pages/payment/CancelPage';
import AnalyticsPage from './pages/Admin/AnalyticsPage';
import FeedbackAnalyticsPage from './pages/Admin/FeedbackAnalyticsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ShopifyAuthPage from './pages/ShopifyAuthPage';
import { NumerologyProvider } from './context/NumerologyContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <NumerologyProvider>
          <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/compatibility" element={<CompatibilityPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/tarot" element={<TarotPage />} />
              <Route path="/zhouyi" element={<ZhouyiPage />} />
              <Route path="/star-astrology" element={<StarAstrologyPage />} />
              <Route path="/bazi-analysis" element={<BaziAnalysisPage />} />
              <Route path="/holistic-divination" element={<HolisticDivinationPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/community/new" element={<CreatePostPage />} />
              <Route path="/community/:id" element={<PostDetailPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/purchase" element={<PurchasePage returnUrl="/" />} />
              <Route path="/payment/success" element={<SuccessPage />} />
              <Route path="/payment/cancel" element={<CancelPage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/feedback" element={<FeedbackAnalyticsPage />} />
              <Route path="/my-orders" element={<MyOrdersPage />} />
              <Route path="/shopify-auth" element={<ShopifyAuthPage />} />
            </Routes>
          </Layout>
        </Router>
      </NumerologyProvider>
    </UserProvider>
    </ThemeProvider>
  );
}

export default App;
