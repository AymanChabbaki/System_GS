import React, { useState, useEffect, useContext } from 'react';
import { Truck, Plus, Edit, Trash2, Phone, Mail, MapPin, Search, Download } from 'lucide-react';
import supplierService from '../services/supplier.service';
import { exportToCSV } from '../utils/csv-export';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';

const Suppliers = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    supplierService.getAll().then(
      (res) => { setSuppliers(res.data); setLoading(false); },
      (err) => { console.error(err); setLoading(false); }
    );
  };

  const handleOpenModal = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        name: supplier.name,
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || ''
      });
    } else {
      setEditingSupplier(null);
      setFormData({ name: '', phone: '', email: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSupplier) {
      supplierService.update(editingSupplier.id, formData).then(() => {
        handleCloseModal();
        fetchSuppliers();
      });
    } else {
      supplierService.create(formData).then(() => {
        handleCloseModal();
        fetchSuppliers();
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) {
      supplierService.remove(id).then(() => fetchSuppliers());
    }
  };

  const handleExport = () => {
    const exportData = suppliers.map(s => ({
      ID: s.id,
      Nom: s.name,
      Telephone: s.phone,
      Email: s.email,
      Adresse: s.address
    }));
    exportToCSV(exportData, 'fournisseurs');
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-3xl font-bold text-slate-900">Annuaire des Fournisseurs</h2>
          <p className="text-slate-500">Gérez vos partenaires et contacts d'entrepôt.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="btn-outline flex items-center gap-2">
            <Download size={18} /> Exporter
          </button>
          {isAdmin && (
            <button onClick={() => handleOpenModal()} className="btn-secondary flex items-center gap-2">
              <Plus size={20} /> Ajouter un Fournisseur
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold animate-pulse">Chargement des fournisseurs...</div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 italic">Aucun fournisseur trouvé.</div>
        ) : filteredSuppliers.map((sup) => (
          <div key={sup.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-accent-gold/10 group-hover:text-accent-gold transition-colors">
                <Truck size={24} />
              </div>
              {isAdmin && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(sup)} className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(sup.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-slate-900">{sup.name}</h3>
            <p className="text-[10px] text-slate-400 font-heading uppercase tracking-widest mb-4">ID Fournisseur: {sup.id}</p>
            
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone size={14} className="text-slate-400" />
                <span>{sup.phone || 'Aucun téléphone'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={14} className="text-slate-400" />
                <span>{sup.email || 'Aucun email'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin size={14} className="text-slate-400" />
                <span>{sup.address || 'Aucune adresse'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingSupplier ? "Modifier le Fournisseur" : "Ajouter un Fournisseur"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Nom de l'Entreprise</label>
            <input name="name" value={formData.name} onChange={handleInputChange} className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Téléphone</label>
              <input name="phone" value={formData.phone} onChange={handleInputChange} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input-field" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Adresse</label>
            <textarea name="address" value={formData.address} onChange={handleInputChange} className="input-field h-20" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-grow btn-secondary">Enregistrer</button>
            <button type="button" onClick={handleCloseModal} className="btn-outline">Annuler</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;
