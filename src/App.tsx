import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './components/Home/Home';
import Lots from './components/Lots/Lots';
import LotDetail from './components/LotDetail/LotDetail';
import About from './components/About/About';
import Status from './components/Status/Status';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import { useAuthStore } from './store/useAuthStore';

function ProtectedLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
    </div>
  );
}

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/lots" element={<Lots />} />
          <Route path="/lots/:id" element={<LotDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/status" element={<Status />} />
        </Route>
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

