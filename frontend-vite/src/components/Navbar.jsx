import React, { useState, useEffect, useContext } from 'react';
import { Search, Bell, User, LogOut, Menu, Package, AlertTriangle, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import stockService from '../services/stock.service';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch low stock products for notifications
    stockService.getDashboardData()
      .then(res => {
        if (res.data.lowStockCount > 0) {
          setNotifications([{
            id: 1,
            title: "Stock Faible",
            desc: `Il y a ${res.data.lowStockCount} produits en stock critique.`,
            type: 'alert'
          }]);
        }
      })
      .catch(console.error);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className={`fixed top-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 z-40 transition-all duration-300 ${isSidebarOpen ? 'left-64' : 'left-0'}`}>
      <div className="flex items-center gap-6">
        {!isSidebarOpen && (
          <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-all hover:text-primary">
            <Menu size={20} />
          </button>
        )}
        <form onSubmit={handleSearch} className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un produit, une référence..." 
            className="w-96 pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </form>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all relative"
          >
            <Bell size={20} />
            {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>
          
          {showNotifs && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Notifications</span>
                <button onClick={() => setNotifications([])} className="text-[10px] text-primary font-bold hover:underline">Tout marquer comme lu</button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm italic">Aucune notification</div>
                ) : notifications.map(n => (
                  <div key={n.id} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3">
                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-100 mx-2"></div>
        
        <Link to="/profile" className="flex items-center gap-3 pl-2 group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{user?.username}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Administrateur</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent-gold text-white flex items-center justify-center font-bold shadow-lg shadow-accent-gold/20">
            {user?.username?.substring(0, 2).toUpperCase()}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
