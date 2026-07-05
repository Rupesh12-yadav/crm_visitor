import { useState, useEffect } from 'react';
import axios from 'axios';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', status: 'active' });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`/api/customers?search=${search}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCustomers(res.data));
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/customers/${editId}`, form, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('/api/customers', form, { headers: { Authorization: `Bearer ${token}` } });
      }
      setForm({ name: '', email: '', phone: '', company: '', status: 'active' });
      setEditId(null);
      const res = await axios.get(`/api/customers?search=${search}`, { headers: { Authorization: `Bearer ${token}` } });
      setCustomers(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer?')) return;
    await axios.delete(`/api/customers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setCustomers(customers.filter(c => c._id !== id));
  };

  const handleEdit = (c) => {
    setForm(c);
    setEditId(c._id);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="p-2 border rounded" required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="p-2 border rounded" required />
          <input type="text" placeholder="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="p-2 border rounded" required />
          <input type="text" placeholder="Company" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} className="p-2 border rounded" />
          <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="p-2 border rounded">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {editId ? 'Update' : 'Add'} Customer
          </button>
        </div>
      </form>

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
                  <button onClick={() => handleEdit(c)} className="text-blue-600 mr-3">Edit</button>
                  <button onClick={() => handleDelete(c._id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;
