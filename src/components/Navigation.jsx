import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Logout,
  DarkMode,
  LightMode,
  Dashboard,
  Login,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import techHubLight from '../assets/techhub-light.png';
import techHubDark from '../assets/techhub-dark.png';

const Navigation = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();

    const interval = setInterval(updateCartCount, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAdminMenuOpen = (event) => {
    setAdminMenuAnchor(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null);
  };

  return (
    <AppBar position='static'>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img
            src={darkMode ? techHubLight : techHubDark}
            alt='TechHub Logo'
            style={{
              height: '40px',
              marginRight: '12px',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/products')}
          />
          <Typography variant='h6'>E-Commerce App</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color='inherit' onClick={toggleDarkMode}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>

          <Button color='inherit' component={Link} to='/products'>
            Products
          </Button>

          <Button color='inherit' component={Link} to='/cart'>
            <Badge badgeContent={cartCount} color='error'>
              <ShoppingCart />
            </Badge>
          </Button>

          {user ? (
            <>
              {isAdmin() && (
                <>
                  <Button
                    color='inherit'
                    onClick={handleAdminMenuOpen}
                    startIcon={<Dashboard />}
                  >
                    Admin
                  </Button>
                  <Menu
                    anchorEl={adminMenuAnchor}
                    open={Boolean(adminMenuAnchor)}
                    onClose={handleAdminMenuClose}
                  >
                    <MenuItem
                      onClick={() => {
                        navigate('/admin/products');
                        handleAdminMenuClose();
                      }}
                    >
                      Manage Products
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate('/admin/categories');
                        handleAdminMenuClose();
                      }}
                    >
                      Manage Categories
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate('/admin/users');
                        handleAdminMenuClose();
                      }}
                    >
                      Manage Users
                    </MenuItem>
                  </Menu>
                </>
              )}

              <Button color='inherit' onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </Button>
            </>
          ) : (
            <Button color='inherit' component={Link} to='/login'>
              <Login sx={{ mr: 1 }} />
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
