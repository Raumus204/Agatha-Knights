import { Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavTabs from './components/NavTabs';
import Footer from './components/Footer';
import './App.css';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <AuthProvider>
      <div className="app-container" style={{ overflow: isHomePage ? 'hidden' : 'auto' }}>
        <NavTabs />
        <main className="main-content">
          <Outlet /> {/* This will render the child routes which is the /* for home */}
        </main>
        <Footer style={{ position: isHomePage ? 'fixed' : 'relative' }} />
      </div>
    </AuthProvider>
  );
}

export default App;