import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import MonthlyPlanner from '@/pages/MonthlyPlanner';
import WeeklyGrocery from '@/pages/WeeklyGrocery';
import EmergencyMode from '@/pages/EmergencyMode';
import FunMode from '@/pages/FunMode';
import Inventory from '@/pages/Inventory';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MonthlyPlanner />} />
          <Route path="/grocery" element={<WeeklyGrocery />} />
          <Route path="/emergency" element={<EmergencyMode />} />
          <Route path="/fun" element={<FunMode />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
