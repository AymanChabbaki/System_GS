import React, { useState, useEffect, useContext } from 'react';
import { Layers, Plus, Edit, Trash2, Search, Download } from 'lucide-react';
import categoryService from '../services/category.service';
import { exportToCSV } from '../utils/csv-export';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';

const Categories = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    categoryService.getAll().then(
      (res) => { setCategories(res.data); setLoading(false); },
      (err) => { console.error(err); setLoading(false); }
    );
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setNewCategoryName(category.name);
    } else {
      setEditingCategory(null);
      setNewCategoryName('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setNewCategoryName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      categoryService.update(editingCategory.id, { name: newCategoryName }).then(() => {
        handleCloseModal();
        fetchCategories();
      });
    } else {
      categoryService.create({ name: newCategoryName }).then(() => {
        handleCloseModal();
        fetchCategories();
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      categoryService.remove(id).then(() => fetchCategories());
    }
  };

  const handleExport = () => {
    const exportData = categories.map(c => ({
      ID: c.id,
      Nom: c.name
    }));
    exportToCSV(exportData, 'categories');
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-3xl font-bold text-slate-900">Catégories de Produits</h2>
          <p className="text-slate-500">Organisez votre inventaire par groupements.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="btn-outline flex items-center gap-2">
            <Download size={18} /> Exporter
          </button>
          {isAdmin && (
            <button 
              onClick={() => handleOpenModal()}
              className="btn-secondary flex items-center gap-2"
            >
              <Plus size={20} /> Ajouter une Catégorie
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une catégorie..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold animate-pulse">Chargement des catégories...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 italic">Aucune catégorie trouvée.</div>
        ) : filteredCategories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start">
              <div className="p-3 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                <Layers size={24} />
              </div>
              {isAdmin && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(cat)} className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-4">{cat.name}</h3>
            <p className="text-[10px] text-slate-400 font-heading uppercase tracking-widest mt-1">ID: {cat.id}</p>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingCategory ? "Modifier la Catégorie" : "Ajouter une Catégorie"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Nom de la Catégorie</label>
            <input 
              type="text" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="ex: Figurines, Éducatif, Extérieur..."
              className="input-field"
              required
            />
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

export default Categories;
