import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { RequireAuth } from './components/RequireAuth';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppDetail from './pages/AppDetail';
import Catalog from './pages/Catalog';
import Help from './pages/Help';
import Home from './pages/Home';
import Library from './pages/Library';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Services from './pages/Services';
import Admin from './pages/admin/Admin';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="catalogo" element={<Catalog />} />
                <Route path="apps/:id" element={<AppDetail />} />
                <Route path="servicios" element={<Services />} />
                <Route path="ayuda" element={<Help />} />
                <Route path="login" element={<Login />} />
                <Route
                  path="biblioteca"
                  element={
                    <RequireAuth>
                      <Library />
                    </RequireAuth>
                  }
                />
                <Route
                  path="admin"
                  element={
                    <RequireAuth role="admin">
                      <Admin />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
