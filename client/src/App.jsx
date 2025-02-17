import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NavTabs from './components/NavTabs';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <NavTabs />
        <main className="main-content">
          <Outlet /> {/* This will render the child routes which is the /* for home */}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;