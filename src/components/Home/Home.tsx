import { Link } from 'react-router-dom';
import { useParkingStore } from '../../store/useParkingStore';

export default function Home() {
  const { lots } = useParkingStore();
  const totalSpots = lots.reduce((sum, lot) => sum + lot.capacity, 0);
  const totalAvailable = lots.reduce((sum, lot) => sum + lot.available, 0);
  const percentageAvailable = Math.round((totalAvailable / totalSpots) * 100);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sbu-red via-red-700 to-red-800 text-white py-32 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold border border-white/30">
              🚗 Real-Time Parking Availability
            </span>
          </div>
          <h1 className="font-display text-6xl md:text-8xl font-extrabold mb-6 tracking-tight text-shadow-lg">
            Find your spot, <span className="text-yellow-300">fast.</span>
          </h1>
          <p className="text-2xl md:text-3xl mb-12 opacity-95 font-light text-shadow">
            Real-time parking availability across Stony Brook University
          </p>
          <Link
            to="/lots"
            className="inline-block btn-primary text-lg px-12 py-5 rounded-2xl"
          >
            I'm ready to park →
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center card-elevated group hover:-translate-y-2 animate-slide-up">
            <div className="w-16 h-16 bg-gradient-to-br from-sbu-red to-red-700 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🅿️</span>
            </div>
            <div className="text-6xl font-extrabold gradient-text mb-3">{lots.length}</div>
            <div className="text-sbu-gray text-xl font-semibold">Parking Lots</div>
            <div className="mt-4 text-sm text-gray-500">Across campus</div>
          </div>
          <div className="text-center card-elevated group hover:-translate-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-sbu-navy to-sbu-royal rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <span className="text-3xl">📍</span>
            </div>
            <div className="text-6xl font-extrabold gradient-text mb-3">{totalSpots.toLocaleString()}</div>
            <div className="text-sbu-gray text-xl font-semibold">Total Spots</div>
            <div className="mt-4 text-sm text-gray-500">Parking capacity</div>
          </div>
          <div className="text-center card-elevated group hover:-translate-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <span className="text-3xl">✅</span>
            </div>
            <div className="text-6xl font-extrabold gradient-text mb-3">{totalAvailable.toLocaleString()}</div>
            <div className="text-sbu-gray text-xl font-semibold">Available Now</div>
            <div className="mt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-700">{percentageAvailable}% capacity</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tiles */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-sbu-navy mb-4">
              Find parking by type
            </h2>
            <p className="text-xl text-gray-600">Choose your parking category</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              to="/lots?filter=commuter"
              className="group relative p-10 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-3 text-center card overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🎓</div>
                <h3 className="text-3xl font-bold text-sbu-navy mb-3 group-hover:text-blue-700">Student</h3>
                <p className="text-gray-600 font-medium">Commuter parking lots</p>
                <div className="mt-6 text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse lots →
                </div>
              </div>
            </Link>
            <Link
              to="/lots?filter=faculty"
              className="group relative p-10 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-3 text-center card overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">👔</div>
                <h3 className="text-3xl font-bold text-sbu-navy mb-3 group-hover:text-purple-700">Faculty/Staff</h3>
                <p className="text-gray-600 font-medium">Faculty parking sections</p>
                <div className="mt-6 text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse lots →
                </div>
              </div>
            </Link>
            <Link
              to="/lots?filter=visitor"
              className="group relative p-10 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-3 text-center card overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🚗</div>
                <h3 className="text-3xl font-bold text-sbu-navy mb-3 group-hover:text-emerald-700">Visitor</h3>
                <p className="text-gray-600 font-medium">Visitor-friendly parking</p>
                <div className="mt-6 text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse lots →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-sbu-navy mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600">Simple steps to find your perfect parking spot</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-sbu-red to-red-700 rounded-3xl flex items-center justify-center text-white text-4xl font-extrabold mx-auto shadow-2xl shadow-red-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  1
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold shadow-lg animate-bounce">✨</div>
              </div>
              <h3 className="font-bold text-2xl mb-3 text-sbu-navy group-hover:text-sbu-red transition-colors">Choose a lot</h3>
              <p className="text-gray-600 font-medium leading-relaxed">Browse available parking lots across campus with real-time availability</p>
            </div>
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-sbu-navy to-sbu-royal rounded-3xl flex items-center justify-center text-white text-4xl font-extrabold mx-auto shadow-2xl shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  2
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold shadow-lg animate-bounce" style={{ animationDelay: '0.2s' }}>✨</div>
              </div>
              <h3 className="font-bold text-2xl mb-3 text-sbu-navy group-hover:text-sbu-red transition-colors">Check availability</h3>
              <p className="text-gray-600 font-medium leading-relaxed">See individual spots and sections with live open/closed status</p>
            </div>
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center text-white text-4xl font-extrabold mx-auto shadow-2xl shadow-green-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  3
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold shadow-lg animate-bounce" style={{ animationDelay: '0.4s' }}>✨</div>
              </div>
              <h3 className="font-bold text-2xl mb-3 text-sbu-navy group-hover:text-sbu-red transition-colors">Park with confidence</h3>
              <p className="text-gray-600 font-medium leading-relaxed">Navigate to your exact spot and park knowing it's available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-sbu-navy via-sbu-navy to-sbu-royal text-white py-16 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-sbu-red to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🅿️</span>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-extrabold">FindMySpot</h3>
                  <p className="text-xs opacity-75">SBU</p>
                </div>
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                Real-time parking availability for Stony Brook University. Find your spot, fast.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-yellow-300">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="https://www.stonybrook.edu/mobility-and-parking/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-300 transition-colors flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    MAPS - Mobility & Parking Services
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.stonybrook.edu/commcms/mobility-and-parking/parking/students.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-300 transition-colors flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    Student Parking Info
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6 text-yellow-300">About</h4>
              <Link to="/about" className="text-sm hover:text-yellow-300 transition-colors flex items-center gap-2 group mb-4 block">
                <span className="group-hover:translate-x-1 transition-transform">→</span>
                About FindMySpot
              </Link>
              <p className="text-xs opacity-75 leading-relaxed">
                Data is for demonstration purposes only. Check official MAPS resources for current availability.
              </p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-sm opacity-75">
              &copy; {new Date().getFullYear()} FindMySpot - Stony Brook University
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

