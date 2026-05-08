import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import authService from '../services/auth.service';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await authService.register(formData.username, formData.email, formData.password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 text-center space-y-6 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Demande Envoyée !</h2>
          <p className="text-slate-500">Votre demande d'inscription a été enregistrée. Un administrateur doit approuver votre compte avant que vous puissiez vous connecter.</p>
          <Link to="/login" className="btn-secondary w-full inline-flex items-center justify-center gap-2">
            Retour à la connexion <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-secondary/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-accent-gold/20 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in duration-500">
        <div className="p-8 bg-slate-50 border-b border-slate-100 text-center">
          <h1 className="text-2xl font-heading font-extrabold text-slate-900">ToyTrack Pro</h1>
          <p className="text-slate-500 text-sm">Créer un nouveau compte</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-lg text-center uppercase">{error}</div>}
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nom d'utilisateur</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                name="username" 
                value={formData.username} 
                onChange={handleInputChange} 
                className="input-field pl-10" 
                placeholder="ex: jean_dupont" 
                required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                className="input-field pl-10" 
                placeholder="jean@toytrack.ma" 
                required 
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mot de passe</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                className="input-field pl-10" 
                placeholder="••••••••" 
                required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Confirmer le mot de passe</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                className="input-field pl-10" 
                placeholder="••••••••" 
                required 
              />
            </div>
          </div>
          
          <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all disabled:opacity-50">
            {loading ? "Chargement..." : "S'inscrire"}
          </button>
          
          <div className="text-center pt-4">
            <p className="text-xs text-slate-400">
              Déjà un compte ? <Link to="/login" className="text-primary font-bold hover:underline">Se connecter</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
