import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-sbu-navy via-sbu-navy to-sbu-royal text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-sbu-red to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-xl">🅿️</span>
            </div>
            <div>
              <span className="font-display text-2xl font-extrabold block">FindMySpot</span>
              <span className="text-xs opacity-75 font-medium">Stony Brook University</span>
            </div>
          </Link>
          <div className="flex space-x-8">
            <Link
              to="/lots"
              className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isActive('/lots') 
                  ? 'text-white bg-sbu-red shadow-lg shadow-red-500/30' 
                  : 'text-gray-200 hover:text-white hover:bg-white/10'
              }`}
            >
              Browse Lots
              {isActive('/lots') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-300 rounded-full"></span>
              )}
            </Link>
            <Link
              to="/about"
              className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isActive('/about') 
                  ? 'text-white bg-sbu-red shadow-lg shadow-red-500/30' 
                  : 'text-gray-200 hover:text-white hover:bg-white/10'
              }`}
            >
              About
              {isActive('/about') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-300 rounded-full"></span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

