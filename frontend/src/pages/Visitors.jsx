import { useState, useEffect } from 'react';
import api from '../api';
import Spinner from '../components/Spinner';

function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [tab, setTab] = useState('checkin');
  const [form, setForm] = useState({ visitorName: '', phone: '', personToMeet: '', purpose: '' });
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = () => {
    setIsLoading(true);
    api.get('/api/visitors/history')
      .then(res => setVisitors(res.data))
      .catch(err => console.error("Error fetching history:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (tab === 'history') {
      fetchHistory();
    }
  }, [tab]);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/visitors/checkin', form);
      alert('Visitor checked in!');
      setForm({ visitorName: '', phone: '', personToMeet: '', purpose: '' });
      setTab('history'); // Switch to history to see the new entry
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      const { data: updatedVisitor } = await api.put(`/api/visitors/checkout/${id}`);
      // Update state locally for instant UI feedback
      setVisitors(visitors.map(v => v._id === id ? updatedVisitor : v));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to check out');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Visitors</h1>
      
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('checkin')} className={`px-4 py-2 rounded ${tab === 'checkin' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Check-In</button>
        <button onClick={() => setTab('history')} className={`px-4 py-2 rounded ${tab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>History</button>
      </div>

      {tab === 'checkin' ? (
        <form onSubmit={handleCheckIn} className="bg-white p-6 rounded-lg shadow max-w-lg">
          <input type="text" placeholder="Visitor Name" value={form.visitorName} onChange={(e) => setForm({...form, visitorName: e.target.value})} className="w-full p-3 border rounded mb-4" required />
          <input type="text" placeholder="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full p-3 border rounded mb-4" required />
          <input type="text" placeholder="Person To Meet" value={form.personToMeet} onChange={(e) => setForm({...form, personToMeet: e.target.value})} className="w-full p-3 border rounded mb-4" required />
          <input type="text" placeholder="Purpose" value={form.purpose} onChange={(e) => setForm({...form, purpose: e.target.value})} className="w-full p-3 border rounded mb-4" required />
          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700">Check-In Visitor</button>
        </form>
      ) : isLoading ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Visitor</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Phone</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Meeting</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Purpose</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Check-In</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Check-Out</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map(v => (
                <tr key={v._id} className="border-t">
                  <td className="p-3 text-sm">{v.visitorName}</td>
                  <td className="p-3 text-sm">{v.phone}</td>
                  <td className="p-3 text-sm">{v.personToMeet}</td>
                  <td className="p-3 text-sm">{v.purpose}</td>
                  <td className="p-3 text-sm">{new Date(v.checkInTime).toLocaleString()}</td>
                  <td className="p-3 text-sm">{v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : '-'}</td>
                  <td className="p-3">
                    {!v.checkOutTime && (
                      <button onClick={() => handleCheckOut(v._id)} className="text-red-600 hover:underline text-sm">
                        Check-Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Visitors;
