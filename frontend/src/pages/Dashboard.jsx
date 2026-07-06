import { useState, useEffect } from 'react';
import api from '../api';
import Spinner from '../components/Spinner';

function Dashboard() {
  const [stats, setStats] = useState({ totalCustomers: 0, activeCustomers: 0, visitorsToday: 0, checkedIn: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // El interceptor de api.js adjuntará el token automáticamente
    api.get('/api/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error("Failed to fetch stats:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const cards = [
    { title: 'Total Customers', value: stats.totalCustomers, color: 'bg-blue-500' },
    { title: 'Active Customers', value: stats.activeCustomers, color: 'bg-green-500' },
    { title: 'Visitors Today', value: stats.visitorsToday, color: 'bg-purple-500' },
    { title: 'Checked In', value: stats.checkedIn, color: 'bg-orange-500' }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64"><Spinner /></div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className={`${card.color} text-white p-6 rounded-lg shadow`}>
            <h3 className="text-lg">{card.title}</h3>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
