import { useState, useEffect } from 'react';
import api from '../api'; // Asegúrate que la ruta a api.js sea correcta
import { useDebounce } from '../components/useDebounce';
import Spinner from '../components/Spinner';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500); // 500ms delay
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', status: 'active' });
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCustomers = () => {
    setIsLoading(true);
    api.get(`/api/customers?search=${debouncedSearch}`)
      .then(res => setCustomers(res.data))
      .catch(err => console.error("Error fetching customers:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(fetchCustomers, [debouncedSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/customers/${editId}`, form);
      } else {
        await api.post('/api/customers', form);
      }
      setForm({ name: '', email: '', phone: '', company: '', status: 'active' });
      setEditId(null);
      fetchCustomers(); // Recarga explícitamente la lista
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.delete(`/api/customers/${id}`);
        fetchCustomers(); // Refetch to ensure data consistency
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete customer');
      }
    }
  };

  const handleEdit = (c) => {
    setForm(c);
    setEditId(c._id);
  };

  const handleCancelEdit = () => {
    setForm({ name: '', email: '', phone: '', company: '', status: 'active' });
    setEditId(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      
      <input
        type="text" placeholder="Search customers..." value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded mb-6"
      />

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="p-2 border rounded" required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="p-2 border rounded" required />
          <input type="text" placeholder="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="p-2 border rounded" required />
          <input type="text" placeholder="Company" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} className="p-2 border rounded" />
          <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="p-2 border rounded">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              {editId ? 'Update' : 'Add'} Customer
            </button>
            {editId && <button type="button" onClick={handleCancelEdit} className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600">Cancel</button>}
          </div>
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Company</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">{c.company}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded text-xs text-white ${c.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>{c.status}</span></td>
                  <td className="p-3">
                    <button onClick={() => handleEdit(c)} className="text-blue-600 mr-3 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:underline">Delete</button>
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

export default Customers;
