import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import Commitments from './pages/Commitments';
import Calendar from './pages/Calendar';
import AIAssistant from './pages/AIAssistant';
import People from './pages/People';
import Sources from './pages/Sources';
import Activity from './pages/Activity';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="commitments" element={<Commitments />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="people" element={<People />} />
          <Route path="sources" element={<Sources />} />
          <Route path="activity" element={<Activity />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
