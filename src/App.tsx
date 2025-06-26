
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
import { NumerologyProvider } from './context/NumerologyContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
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
            </Routes>
          </Layout>
        </Router>
      </NumerologyProvider>
    </ThemeProvider>
  );
}

export default App;