import React, { useContext } from 'react';
import { LayoutDashboard, Package, Layers, Repeat, Truck, Users, User, LogOut, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import authService from '../services/auth.service';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de Bord', path: '/' },
    { icon: Package, label: 'Produits', path: '/products' },
    { icon: Layers, label: 'Catégories', path: '/categories' },
    { icon: Repeat, label: 'Mouvements de Stock', path: '/movements' },
    { icon: Truck, label: 'Fournisseurs', path: '/suppliers' },
    { icon: Users, label: 'Utilisateurs', path: '/users', adminOnly: true },
    { icon: User, label: 'Mon Profil', path: '/profile' },
  ];

  const filteredItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  return (
    <aside className={`fixed left-0 top-0 h-full w-64 bg-primary text-white flex flex-col py-6 border-r border-primary-dark z-[60] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="px-6 mb-8 flex justify-between items-start">
        <div>
          <h2 className="font-heading text-2xl font-extrabold text-accent-gold">Gestion Stock HQ</h2>
          <p className="text-white/70 text-xs font-heading uppercase tracking-widest">Entrepôt Central</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-grow space-y-1 px-4 overflow-y-auto">
        {filteredItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-accent-gold text-white shadow-lg shadow-accent-gold/20' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-heading font-semibold text-sm tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 mt-auto space-y-1 pt-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-all border border-transparent hover:border-red-500/30"
        >
          <LogOut size={20} />
          <span className="font-heading font-semibold text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
