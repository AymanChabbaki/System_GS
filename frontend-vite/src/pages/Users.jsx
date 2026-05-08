import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Search, UserPlus, Trash2, CheckCircle, XCircle, Shield, Mail, User } from 'lucide-react';
import userService from '../services/user.service';
import { exportToCSV } from '../utils/csv-export';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    userService.getAll()
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleApprove = (id) => {
    userService.approve(id).then(fetchUsers).catch(console.error);
  };

  const handleReject = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir rejeter cette demande ?")) {
      userService.reject(id).then(fetchUsers).catch(console.error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      userService.remove(id).then(fetchUsers).catch(console.error);
    }
  };

  const pendingUsers = users.filter(u => u.pending);
  const activeUsers = users.filter(u => !u.pending);

  const filteredActive = activeUsers.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center animate-pulse font-bold text-slate-400">Chargement des utilisateurs...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-heading text-3xl font-bold text-slate-900">Gestion des Utilisateurs</h2>
          <p className="text-slate-500">Gérez les accès et les permissions de votre équipe.</p>
        </div>
        <button 
          onClick={() => exportToCSV(activeUsers, 'liste_utilisateurs')}
          className="btn-outline flex items-center gap-2"
        >
          Exporter CSV
        </button>
      </div>

      {/* Pending Requests Section */}
      {pendingUsers.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 space-y-4 shadow-sm animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 text-amber-800">
            <UserPlus size={20} />
            <h3 className="font-bold">Demandes d'inscription en attente ({pendingUsers.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingUsers.map(u => (
              <div key={u.id} className="bg-white p-4 rounded-xl shadow-sm border border-amber-200 flex flex-col justify-between group hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                    {u.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{u.username}</p>
                    <p className="text-xs text-slate-500">{u.email || 'Email non renseigné'}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                  <button 
                    onClick={() => handleApprove(u.id)}
                    className="flex-grow flex items-center justify-center gap-2 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle size={14} /> Approuver
                  </button>
                  <button 
                    onClick={() => handleReject(u.id)}
                    className="flex-grow flex items-center justify-center gap-2 py-2 bg-red-100 text-red-600 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <XCircle size={14} /> Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom ou email..." 
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Utilisateur</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Rôle</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredActive.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                        {user.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{user.username}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-tighter">
                      <Shield size={14} className={user.role === 'admin' ? 'text-accent-gold' : 'text-slate-400'} />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {user.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredActive.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                <User size={32} />
              </div>
              <p className="text-slate-400 font-medium italic">Aucun utilisateur trouvé.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
