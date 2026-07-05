import { useState, useEffect } from 'react';
import axios from 'axios';

function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [tab, setTab] = useState('checkin');
  const [form, setForm] = useState({ visitorName: '', phone: '', personToMeet: '', purpose: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (tab === 'history') {
      axios.get('/api/visitors/history', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setVisitors(res.data));
    }
  }, [tab]);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/visitors/checkin', form, { headers: { Authorization: `Bearer ${token}` } });
      alert('Visitor checked in!');
      setForm({ visitorName: '', phone: '', personToMeet: '', purpose: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleCheckOut = async (id) => {
    await axios.put(`/api/visitors/checkout/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    const res = await axios.get('/api/visitors/history', { headers: { Authorization: `Bearer ${token}` } });
    setVisitors(res.data);
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
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Visitor</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Meeting</th>
                <th className="p-3 text-left">Purpose</th>
                <th className="p-3 text-left">Check-In</th>
                <th className="p-3 text-left">Check-Out</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map(v => (
                <tr key={v._id} className="border-t">
                  <td className="p-3">{v.visitorName}</td>
                  <td className="p-3">{v.phone}</td>
                  <td className="p-3">{v.personToMeet}</td>
                  <td className="p-3">{v.purpose}</td>
                  <td className="p-3">{new Date(v.checkInTime).toLocaleString()}</td>
                  <td className="p-3">{v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : '-'}</td>
                  <td className="p-3">
                    {!v.checkOutTime && (
                      <button onClick={() => handleCheckOut(v._id)} className="text-red-600">Check-Out</button>
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
