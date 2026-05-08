import React, { useState, useEffect } from 'react';
import { Repeat, ArrowUpRight, ArrowDownLeft, Calendar, Search, Download, Plus } from 'lucide-react';
import stockService from '../services/stock.service';
import productService from '../services/product.service';
import { exportToCSV } from '../utils/csv-export';
import Modal from '../components/Modal';

const Movements = () => {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    type: 'ENTRY',
    quantity: '',
    reason: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [movRes, prodRes] = await Promise.all([
        stockService.getStockMovements(),
        productService.getAll()
      ]);
      setMovements(movRes.data);
      setProducts(prodRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({ productId: '', type: 'ENTRY', quantity: '', reason: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    stockService.addMovement(formData).then(() => {
      handleCloseModal();
      fetchData();
    });
  };

  const handleExport = () => {
    const exportData = movements.map(m => ({
      ID: m.id,
      Type: m.type,
      Produit: m.product?.name,
      Quantite: m.quantity,
      Date: new Date(m.movementDate).toLocaleString(),
      Motif: m.reason
    }));
    exportToCSV(exportData, 'mouvements_stock');
  };

  const filteredMovements = movements.filter(m => 
    m.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.reason && m.reason.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-3xl font-bold text-slate-900">Mouvements de Stock</h2>
          <p className="text-slate-500">Suivez les entrées et sorties de votre entrepôt.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="btn-outline flex items-center gap-2">
            <Download size={18} /> Exporter
          </button>
          <button onClick={handleOpenModal} className="btn-secondary flex items-center gap-2">
            <Plus size={20} /> Nouveau Mouvement
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par produit, type ou motif..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Produit</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Quantité</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Motif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400">Chargement...</td></tr>
              ) : filteredMovements.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-400">Aucun mouvement trouvé.</td></tr>
              ) : filteredMovements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-2 w-fit px-2 py-1 rounded text-[10px] font-bold uppercase ${m.type === 'ENTRY' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {m.type === 'ENTRY' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                      {m.type === 'ENTRY' ? 'ENTRÉE' : 'SORTIE'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{m.product?.name || 'Produit Inconnu'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{m.quantity} unités</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Calendar size={14} />
                      {new Date(m.movementDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 italic">"{m.reason || 'Ajustement de stock régulier'}"</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Enregistrer un Mouvement">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Produit</label>
            <select name="productId" value={formData.productId} onChange={handleInputChange} className="input-field" required>
              <option value="">Sélectionner un produit</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Type</label>
              <select name="type" value={formData.type} onChange={handleInputChange} className="input-field">
                <option value="ENTRY">Entrée (+)</option>
                <option value="EXIT">Sortie (-)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Quantité</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="input-field" required />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Motif / Référence</label>
            <textarea name="reason" value={formData.reason} onChange={handleInputChange} className="input-field h-20" placeholder="ex: Commande #123, Retour client..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-grow btn-secondary">Confirmer</button>
            <button type="button" onClick={handleCloseModal} className="btn-outline">Annuler</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Movements;
