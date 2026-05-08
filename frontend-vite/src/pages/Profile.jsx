import React, { useContext, useState, useEffect } from 'react';
import { User, Mail, Shield, Key, MapPin, CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import userService from '../services/user.service';
import Modal from '../components/Modal';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user && user.id) {
      userService.getById(user.id)
        .then(res => {
          setDbUser(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    userService.changePassword(user.id, newPassword)
      .then(() => {
        setMsg("Mot de passe mis à jour avec succès !");
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setIsModalOpen(false);
          setMsg('');
        }, 2000);
      })
      .catch(() => alert("Erreur lors du changement de mot de passe"));
  };

  if (loading) return <div className="p-10 text-center animate-pulse font-bold text-slate-400">Chargement de votre profil...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="h-32 bg-primary relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-2xl bg-accent-gold border-4 border-white flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {dbUser?.username?.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">{dbUser?.username}</h2>
              <p className="text-slate-500 flex items-center gap-2 mt-1 uppercase text-xs font-bold tracking-widest">
                <Shield size={16} className="text-accent-gold" />
                {dbUser?.role === 'admin' ? 'Administrateur Système' : 'Personnel d\'Entrepôt'}
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
            >
              <Key size={18} /> Modifier le mot de passe
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Informations Personnelles</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Nom d'utilisateur</p>
                    <p className="font-bold text-slate-900">{dbUser?.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Adresse Email</p>
                    <p className="font-bold text-slate-900">{dbUser?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Détails du Compte</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Rôle Principal</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-accent-gold/10 text-accent-gold text-[10px] font-bold rounded uppercase tracking-tighter">
                      {dbUser?.role}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Localisation</p>
                    <p className="font-bold text-slate-900">Entrepôt Central, Casablanca</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Sécurité du Compte">
        {msg ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} />
            </div>
            <p className="font-bold text-slate-900">{msg}</p>
          </div>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <p className="text-sm text-slate-500 mb-4 italic">Veuillez entrer votre nouveau mot de passe ci-dessous.</p>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Nouveau Mot de Passe</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Confirmer le Mot de Passe</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-grow btn-secondary">Mettre à jour</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline">Annuler</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Profile;
