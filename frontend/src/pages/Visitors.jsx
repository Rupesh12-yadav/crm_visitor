import { useState, useEffect } from 'react';
import api from '../api';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';
import QRCode from '../components/QRCode';

function Visitors() {
  const [visitors, setVisitors] = useState([]);
  const [tab, setTab] = useState('checkin');
  const [form, setForm] = useState({ visitorName: '', phone: '', personToMeet: '', purpose: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const fetchHistoryPaginated = (page = 1) => {
    setIsLoading(true);
    api.get(`/api/visitors/history?page=${page}&limit=10`)
      .then(res => {
        setVisitors(res.data.visitors);
        setTotalPages(res.data.totalPages);
        setCurrentPage(Number(res.data.currentPage));
      })
      .catch(err => console.error("Error fetching history:", err))
      .finally(() => setIsLoading(false));
  };
  
  useEffect(() => {
    if (tab === 'history') {
      fetchHistoryPaginated(1); // Fetch first page on tab switch
    }
  }, [tab]);

  const handlePageChange = (page) => fetchHistoryPaginated(page);

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
      // Optimistic UI: Update state locally for instant UI feedback
      setVisitors(prevVisitors => 
        prevVisitors.map(v => 
          v._id === id ? { ...v, checkOutTime: updatedVisitor.checkOutTime } : v
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to check out');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Visitors</h1>
      
      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => setTab('checkin')} className={`px-4 py-2 rounded-md font-semibold transition-colors ${tab === 'checkin' ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>Check-In</button>
        <button onClick={() => setTab('history')} className={`px-4 py-2 rounded-md font-semibold transition-colors ${tab === 'history' ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>History</button>
      </div>

      {tab === 'checkin' ? (
        <form onSubmit={handleCheckIn} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-4">New Visitor Check-In</h2>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg></div>
              <input type="text" placeholder="Visitor Name" value={form.visitorName} onChange={(e) => setForm({...form, visitorName: e.target.value})} className="w-full p-3 pl-10 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" required />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg></div>
              <input type="text" placeholder="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full p-3 pl-10 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" required />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.586 6.586a2 2 0 00-2.828 0L3 14.172V16h1.828l1.586-1.586zM17 6a3 3 0 11-6 0 3 3 0 016 0zm-1.586 6.586a2 2 0 00-2.828 0L11 14.172V16h1.828l1.586-1.586z" /></svg></div>
              <input type="text" placeholder="Person To Meet" value={form.personToMeet} onChange={(e) => setForm({...form, personToMeet: e.target.value})} className="w-full p-3 pl-10 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" required />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg></div>
              <input type="text" placeholder="Purpose" value={form.purpose} onChange={(e) => setForm({...form, purpose: e.target.value})} className="w-full p-3 pl-10 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" required />
            </div>
          </div>
          <button type="submit" className="w-full mt-6 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-semibold">Check-In Visitor</button>
        </form>
      ) : isLoading ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Visitor</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Phone</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Meeting</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Purpose</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Check-In</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Check-Out</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">QR Code</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map(v => (
                <tr key={v._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-3 text-sm">{v.visitorName}</td>
                  <td className="p-3 text-sm">{v.phone}</td>
                  <td className="p-3 text-sm">{v.personToMeet}</td>
                  <td className="p-3 text-sm">{v.purpose}</td>
                  <td className="p-3 text-sm">{new Date(v.checkInTime).toLocaleString()}</td>
                  <td className="p-3 text-sm">{v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : '-'}</td>
                  <td className="p-3 align-middle"><QRCode text={`Name: ${v.visitorName}, Phone: ${v.phone}, Meeting: ${v.personToMeet}`} size={56} /></td>
                  <td className="p-3">
                    {!v.checkOutTime && (
                      <button onClick={() => handleCheckOut(v._id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-red-600 transition-colors">
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
      {tab === 'history' && !isLoading && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
    </div>
  );
}

export default Visitors;
