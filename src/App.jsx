// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormPage from "./pages/FormPage";
import ListPage from "./pages/ListPage";
import DashboardPage from "./pages/DashboardPage";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-skyblue">
        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}
