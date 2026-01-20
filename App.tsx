
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Home from './pages/Home';
import Courses from './pages/Courses';
import News from './pages/News';
import Simulation from './pages/Simulation';
import Market from './pages/Market';
import Profile from './pages/Profile';
import AssetDetail from './pages/AssetDetail';
import IndexDetail from './pages/IndexDetail';
import StockBoard from './pages/StockBoard';
import Chat from './pages/Chat';
import Books from './pages/Books';
import UtilityDetail from './pages/UtilityDetail';
import LessonDetail from './pages/LessonDetail';
import GlobalNotifications from './components/GlobalNotifications';

const App: React.FC = () => {
  return (
    <HashRouter>
      <GlobalNotifications />
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/lesson/:id" element={<LessonDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/market" element={<Market />} />
        <Route path="/books" element={<Books />} />
        <Route path="/utility/:type" element={<UtilityDetail />} />
        <Route path="/asset/:id" element={<AssetDetail />} />
        <Route path="/index/:id" element={<IndexDetail />} />
        <Route path="/stock-board" element={<StockBoard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
