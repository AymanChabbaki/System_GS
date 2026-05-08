import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, AlertTriangle, Truck, Download, Plus, BarChart3, PieChart } from 'lucide-react';
import stockService from '../services/stock.service';
import { exportToCSV } from '../utils/csv-export';

const Dashboard = () => {
  const [data, setData] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalSuppliers: 0,
    lowStockCount: 0
  });
  const [chartData, setChartData] = useState([]);
  const [catDist, setCatDist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, chartRes, distRes] = await Promise.all([
        stockService.getDashboardData(),
        stockService.getChartData(),
        stockService.getCategoriesDistribution()
      ]);
      setData(statsRes.data);
      setChartData(chartRes.data);
      setCatDist(distRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Produits', value: data.totalProducts, icon: Package, color: 'bg-primary', trend: 'En Direct', border: 'border-t-primary' },
    { label: 'Catégories', value: data.totalCategories, icon: TrendingUp, color: 'bg-secondary', trend: 'Géré', border: 'border-t-secondary' },
    { label: 'Alertes Stock Faible', value: data.lowStockCount, icon: AlertTriangle, color: 'bg-accent-brown', trend: 'Attention', border: 'border-t-accent-brown', critical: data.lowStockCount > 0 },
    { label: 'Total Fournisseurs', value: data.totalSuppliers, icon: Truck, color: 'bg-accent-gold', trend: 'Actif', border: 'border-t-accent-gold' },
  ];

  const handleExport = () => {
    const exportData = [
      { Metrique: 'Total Produits', Valeur: data.totalProducts },
      { Metrique: 'Total Categories', Valeur: data.totalCategories },
      { Metrique: 'Alertes Stock Faible', Valeur: data.lowStockCount },
      { Metrique: 'Total Fournisseurs', Valeur: data.totalSuppliers }
    ];
    exportToCSV(exportData, 'rapport_dashboard');
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-slate-500 font-bold animate-pulse">Chargement des données...</div>;

  const maxVal = Math.max(...chartData.map(d => Math.max(d.entries, d.exits)), 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-heading text-3xl font-bold text-slate-900">Tableau de Bord</h2>
          <p className="text-slate-500">État en temps réel du système d'inventaire.</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          <Download size={18} /> Exporter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-t-4 ${stat.border}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${stat.critical ? 'bg-red-100 text-red-600' : 'text-slate-500'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-xs font-heading font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-primary" size={20} />
              <h4 className="font-heading text-lg font-bold text-slate-900">Mouvements de Stock (7 derniers jours)</h4>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Entrées</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">Sorties</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-4 px-4 relative border-b border-slate-100">
            {chartData.map((d, i) => (
              <div key={i} className="flex flex-col items-center flex-1 gap-2 group cursor-pointer h-full justify-end">
                <div className="w-full flex gap-1 items-end h-48 relative">
                  <div 
                    className="bg-emerald-500/80 group-hover:bg-emerald-500 w-1/2 rounded-t-sm transition-all" 
                    style={{ height: `${(d.entries / maxVal) * 100}%` }}
                    title={`Entrées: ${d.entries}`}
                  ></div>
                  <div 
                    className="bg-red-500/80 group-hover:bg-red-500 w-1/2 rounded-t-sm transition-all" 
                    style={{ height: `${(d.exits / maxVal) * 100}%` }}
                    title={`Sorties: ${d.exits}`}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <PieChart className="text-secondary" size={20} />
              <h4 className="font-heading text-lg font-bold text-slate-900">Distribution / Catégorie</h4>
            </div>
          </div>
          <div className="space-y-6">
            {catDist.length === 0 ? (
              <div className="text-center py-8 text-slate-400 italic text-sm">Aucune donnée disponible.</div>
            ) : catDist.slice(0, 5).map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-slate-600">{cat.name}</span>
                  <span className="text-slate-400">{cat.count} produits</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary transition-all duration-1000" 
                    style={{ width: `${(cat.count / Math.max(...catDist.map(c => c.count), 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {catDist.length > 5 && (
              <p className="text-[10px] text-center text-slate-400 font-bold uppercase mt-4">+ {catDist.length - 5} autres catégories</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
