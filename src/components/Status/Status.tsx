import { useParkingStore } from '../../store/useParkingStore';

export default function Status() {
  const { lots, simulateRefresh } = useParkingStore();
  const isDev = import.meta.env.DEV;

  if (!isDev) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="card text-center">
          <h1 className="text-2xl font-bold text-sbu-navy mb-4">Developer Mode Only</h1>
          <p className="text-gray-600">
            This page is only available in development mode.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-display font-bold text-sbu-navy mb-8">Demo Controls</h1>

      <div className="card mb-6">
        <h2 className="text-2xl font-bold text-sbu-navy mb-4">Simulate Data Refresh</h2>
        <p className="text-gray-700 mb-4">
          Click the button below to simulate a real-time data refresh. This will randomly adjust
          availability numbers for all lots to demonstrate how the app would work with live data.
        </p>
        <button onClick={simulateRefresh} className="btn-primary">
          🔄 Simulate Refresh
        </button>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold text-sbu-navy mb-4">Current Lot Status</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Lot Name</th>
                <th className="text-right py-2 px-4">Available</th>
                <th className="text-right py-2 px-4">Capacity</th>
                <th className="text-right py-2 px-4">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {lots.map((lot) => {
                const percentage = Math.round((lot.available / lot.capacity) * 100);
                return (
                  <tr key={lot.id} className="border-b">
                    <td className="py-2 px-4 font-medium">{lot.name}</td>
                    <td className="text-right py-2 px-4">{lot.available}</td>
                    <td className="text-right py-2 px-4">{lot.capacity}</td>
                    <td className="text-right py-2 px-4">
                      <span
                        className={`px-2 py-1 rounded ${
                          percentage > 50
                            ? 'bg-green-100 text-green-800'
                            : percentage > 20
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {percentage}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

