import React from 'react';
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
import { NumerologyProvider } from './context/NumerologyContext';

function App() {
  return (
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
          </Routes>
        </Layout>
      </Router>
    </NumerologyProvider>
  );
}

export default App;