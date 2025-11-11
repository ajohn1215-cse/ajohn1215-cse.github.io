import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Lots from './components/Lots/Lots';
import LotDetail from './components/LotDetail/LotDetail';
import About from './components/About/About';
import Status from './components/Status/Status';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lots" element={<Lots />} />
          <Route path="/lots/:id" element={<LotDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/status" element={<Status />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

