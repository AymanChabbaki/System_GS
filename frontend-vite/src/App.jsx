import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import Movements from './pages/Movements';
import Users from './pages/Users';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, AuthContext } from './context/AuthContext';

const PrivateLayout = ({ children, isSidebarOpen, setSidebarOpen }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-0'}`}>
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        <main className="pt-16 min-h-screen">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateLayout isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}><Dashboard /></PrivateLayout>} />
          <Route path="/products" element={<PrivateLayout isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}><Products /></PrivateLayout>} />
          <Route path="/categories" element={<PrivateLayout isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}><Categories /></PrivateLayout>} />
          <Route path="/movements" element={<PrivateLayout isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}><Movements /></PrivateLayout>} />
          <Route path="/suppliers" element={<PrivateLayout isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}><Suppliers /></PrivateLayout>} />
          <Route path="/users" element={
            <PrivateLayout isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}>
              <AuthContext.Consumer>
                {({ user }) => user?.roles?.includes('ROLE_ADMIN') ? <Users /> : <Navigate to="/" />}
              </AuthContext.Consumer>
            </PrivateLayout>
          } />
          <Route path="/profile" element={<PrivateLayout isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen}><Profile /></PrivateLayout>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
