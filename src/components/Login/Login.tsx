import { FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const DEMO_CREDENTIALS = {
  username: 'seawolf',
  password: 'parking',
};

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore((state) => ({
    login: state.login,
    isAuthenticated: state.isAuthenticated,
  }));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const success = login(username, password);

    if (success) {
      navigate('/', { replace: true });
    } else {
      setError('Please enter both a username and password to continue.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sbu-navy via-sbu-royal to-sbu-navy flex items-center justify-center px-4 py-16">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white/95 rounded-3xl shadow-2xl overflow-hidden border-4 border-white/60 backdrop-blur-xl">
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-sbu-red to-red-600 text-white p-10 relative">
          <div className="absolute top-0 right-0 -mr-24 w-64 h-64 bg-white/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🅿️</span>
              </div>
              <div>
                <h1 className="text-3xl font-display font-black tracking-tight">FindMySpot</h1>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">Stony Brook University</p>
              </div>
            </div>
            <h2 className="text-4xl font-black mb-6 leading-tight">
              Smarter parking insights for Seawolves.
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Log in to explore live availability, pick the best recommended spot, and stay ahead of campus parking rush.
            </p>
          </div>
          <div className="relative z-10 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/60">Demo Access</p>
            <div className="bg-white/15 rounded-2xl p-5 border border-white/20 shadow-lg space-y-2">
              <p className="text-sm">
                Use the demo credentials to explore the experience:
              </p>
              <div className="grid grid-cols-1 gap-2 text-sm font-bold">
                <span>
                  Username: <span className="font-mono text-white">{DEMO_CREDENTIALS.username}</span>
                </span>
                <span>
                  Password: <span className="font-mono text-white">{DEMO_CREDENTIALS.password}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 lg:p-12 bg-white/95">
          <div className="max-w-md mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-sbu-navy mb-3">Welcome back</h2>
              <p className="text-gray-600 font-medium">
                Sign in with the demo credentials to continue. Authentication is simulated for presentation purposes only.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder={DEMO_CREDENTIALS.username}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sbu-red focus:ring-2 focus:ring-sbu-red/20 transition-all text-gray-800 font-semibold"
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sbu-red focus:ring-2 focus:ring-sbu-red/20 transition-all text-gray-800 font-semibold"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl border-2 border-red-200 bg-red-50 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-sbu-navy to-sbu-royal text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01]"
              >
                Sign In
              </button>
            </form>

            <div className="mt-10 text-sm text-gray-500 leading-relaxed">
              <p>
                This login is for demo purposes only. Any non-empty username and password will grant access, but we recommend using the sample credentials for consistency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


