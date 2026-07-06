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
    { 
      title: 'Total Customers', 
      value: stats.totalCustomers, 
      color: 'from-blue-500 to-blue-600',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.28-1.25-.7-1.686M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.28-1.25.7-1.686m0 0L9 12l2 2 2-2 2 2m-6 0l-2-2" /></svg>
    },
    { 
      title: 'Active Customers', 
      value: stats.activeCustomers, 
      color: 'from-green-500 to-green-600',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    { 
      title: 'Visitors Today', 
      value: stats.visitorsToday, 
      color: 'from-purple-500 to-purple-600',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    { 
      title: 'Checked In', 
      value: stats.checkedIn, 
      color: 'from-orange-500 to-orange-600',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64"><Spinner /></div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className={`bg-gradient-to-br ${card.color} text-white p-6 rounded-xl shadow-lg flex items-center justify-between transition-transform transform hover:-translate-y-1`}>
            <div>
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="text-4xl font-bold">{card.value}</p>
            </div>
            <div className="opacity-70">
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
