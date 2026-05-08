import React, { useState, useEffect, useContext } from 'react';
import { Package, Plus, Search, Filter, Edit, Trash2, Download, Image as ImageIcon, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import productService from '../services/product.service';
import categoryService from '../services/category.service';
import { exportToCSV } from '../utils/csv-export';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';

const Products = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    purchasePrice: '',
    salePrice: '',
    quantity: '',
    minStockThreshold: '',
    categoryId: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchData();
    
    // Handle search query from URL
    const query = new URLSearchParams(location.search).get('search');
    if (query) {
      setSearchTerm(query);
    }
  }, [location.search]);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        quantity: product.quantity,
        minStockThreshold: product.minStockThreshold,
        categoryId: product.category?.id || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        purchasePrice: '',
        salePrice: '',
        quantity: '',
        minStockThreshold: '',
        categoryId: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImageFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('file', imageFile);

    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, data);
      } else {
        await productService.create(data);
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce produit ?")) {
      await productService.remove(id);
      fetchData();
    }
  };

  const handleExport = () => {
    const exportData = products.map(p => ({
      ID: p.id,
      Nom: p.name,
      Categorie: p.category?.name,
      Prix_Achat: p.purchasePrice,
      Prix_Vente: p.salePrice,
      Stock: p.quantity,
      Seuil: p.minStockThreshold
    }));
    exportToCSV(exportData, 'inventaire_produits');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === '' || p.category?.id.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading text-3xl font-bold text-slate-900">Inventaire des Produits</h2>
          <p className="text-slate-500">Gérez et suivez vos articles en entrepôt.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="btn-outline flex items-center gap-2">
            <Download size={18} /> Exporter
          </button>
          {isAdmin && (
            <button onClick={() => handleOpenModal()} className="btn-secondary flex items-center gap-2">
              <Plus size={20} /> Ajouter un Produit
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou SKU..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="">Toutes les Catégories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Article</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Catégorie</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Prix</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Statut</th>
                {isAdmin && <th className="px-6 py-4 text-right"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400">Chargement des produits...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400">Aucun produit trouvé.</td></tr>
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="text-slate-300" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-heading tracking-widest">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                      {product.category?.name || 'Sans Catégorie'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{product.salePrice} DH</p>
                    <p className="text-[10px] text-slate-400">Coût: {product.purchasePrice} DH</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${product.quantity <= product.minStockThreshold ? 'bg-red-500' : 'bg-green-500'}`}></span>
                      <p className="text-sm font-bold text-slate-900">{product.quantity} unités</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.quantity <= product.minStockThreshold ? (
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 p-1 rounded uppercase tracking-tighter">Stock Faible</span>
                    ) : (
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 p-1 rounded uppercase tracking-tighter">En Stock</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(product)} className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingProduct ? "Modifier le Produit" : "Ajouter un Nouveau Produit"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Nom du Produit</label>
              <input name="name" value={formData.name} onChange={handleInputChange} className="input-field" required />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field h-20" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Prix d'Achat (DH)</label>
              <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleInputChange} className="input-field" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Prix de Vente (DH)</label>
              <input type="number" name="salePrice" value={formData.salePrice} onChange={handleInputChange} className="input-field" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Quantité Initiale</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} className="input-field" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Seuil d'Alerte</label>
              <input type="number" name="minStockThreshold" value={formData.minStockThreshold} onChange={handleInputChange} className="input-field" required />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Catégorie</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="input-field" required>
                <option value="">Sélectionner une catégorie</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Image du Produit</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-primary transition-colors cursor-pointer relative group">
                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="text-slate-300 group-hover:text-primary transition-colors" size={32} />
                  <p className="text-xs text-slate-400">{imageFile ? imageFile.name : "Cliquez ou glissez une image ici"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-grow btn-secondary">Enregistrer</button>
            <button type="button" onClick={handleCloseModal} className="btn-outline">Annuler</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
