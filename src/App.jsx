import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Products from './components/Products';
import ProductDetails from './components/ProductDetails';
import PublicRoute from './components/PublicRoute';
import ErrorBoundary from './components/ErrorBoundary';
import AddProduct from './components/AddProduct';

const AppContent = () => {
  const { darkMode } = useTheme();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#CCDC28',
        contrastText: '#000000',
      },
      secondary: {
        main: darkMode ? '#CCDC28' : '#1976d2',
      },
      background: {
        default: darkMode ? '#121212' : '#ffffff',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundColor: '#737640ff',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#717540ff',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : '#696d36ff',
            color: darkMode ? '#ffffff' : '#000000',
          },
        },
      },
    },
  });

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary fallbackMessage="We're having trouble loading the application. Please refresh the page.">
        <AuthProvider>
          <BrowserRouter>
            <Navigation />
            <Routes>
              <Route
                path='/login'
                element={
                  <PublicRoute>
                    <ErrorBoundary fallbackMessage='There was an issue loading the login page.'>
                      <Login />
                    </ErrorBoundary>
                  </PublicRoute>
                }
              />
              <Route
                path='/products'
                element={
                  <ErrorBoundary fallbackMessage='Unable to load products. Please try again.'>
                    <Products />
                  </ErrorBoundary>
                }
              />
              <Route
                path='/products/:id'
                element={
                  <ErrorBoundary fallbackMessage='Unable to load product details. Please try again.'>
                    <ProductDetails />
                  </ErrorBoundary>
                }
              />
              <Route
                path='/add-product'
                element={
                  <ErrorBoundary fallbackMessage='Unable to load add product page.'>
                    <AddProduct />
                  </ErrorBoundary>
                }
              />
              <Route path='/' element={<Navigate to='/products' replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    </MUIThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
