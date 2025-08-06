import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import { productsAPI } from '../api/productsAPI';
import DevicesIcon from '@mui/icons-material/Devices';
import ComputerIcon from '@mui/icons-material/Computer';

const CATEGORY_OPTIONS = [
  {
    id: 'c9920d2b-40e8-4348-8626-f488a2bb6ef8',
    name: 'electronics',
    icon: <DevicesIcon color="primary" sx={{ mr: 1 }} />,
  },
  {
    id: '69b6e5a3-84c1-4776-a185-3066290dfa2b',
    name: 'PCs',
    icon: <ComputerIcon color="secondary" sx={{ mr: 1 }} />,
  },
];

// New color palette: Green & Gold
const theme = createTheme({
  palette: {
    primary: {
      main: '#3d651dff', // Green
    },
    secondary: {
      main: '#3d8635ff', // Gold
    },
    background: {
      default: '#879130ff',
      paper: '#ffffff',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #e8f5e9 0%, #fffde7 100%)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 700,
        },
      },
    },
  },
});

const AddProduct = () => {
  const [fields, setFields] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    stock: '',
    categoryId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (
      !fields.name ||
      !fields.description ||
      !fields.price ||
      !fields.stock ||
      !fields.categoryId
    ) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      await productsAPI.create({
        name: fields.name,
        description: fields.description,
        price: parseFloat(fields.price),
        discount: fields.discount ? parseFloat(fields.discount) : 0,
        stock: parseInt(fields.stock, 10),
        categoryId: fields.categoryId,
      });
      navigate('/products');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to add product.'
      );
    }
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth='sm'>
        <Box sx={{ mt: 8, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant='h4' align='center' gutterBottom color="primary">
              Add New Product
            </Typography>
            {error && (
              <Alert severity='error' sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label='Name'
                name='name'
                value={fields.name}
                onChange={handleChange}
                margin='normal'
                required
                color="primary"
              />
              <TextField
                fullWidth
                label='Description'
                name='description'
                value={fields.description}
                onChange={handleChange}
                margin='normal'
                required
                color="primary"
              />
              <TextField
                fullWidth
                label='Price'
                name='price'
                type='number'
                value={fields.price}
                onChange={handleChange}
                margin='normal'
                required
                inputProps={{ min: 0, step: '0.01' }}
                color="primary"
              />
              <TextField
                fullWidth
                label='Discount'
                name='discount'
                type='number'
                value={fields.discount}
                onChange={handleChange}
                margin='normal'
                inputProps={{ min: 0, step: '0.01' }}
                color="secondary"
              />
              <TextField
                fullWidth
                label='Stock'
                name='stock'
                type='number'
                value={fields.stock}
                onChange={handleChange}
                margin='normal'
                required
                inputProps={{ min: 0, step: '1' }}
                color="primary"
              />
              <TextField
                select
                fullWidth
                label='Category'
                name='categoryId'
                value={fields.categoryId}
                onChange={handleChange}
                margin='normal'
                required
                color="primary"
              >
                {CATEGORY_OPTIONS.map((cat, idx) => (
                  <MenuItem
                    key={cat.id}
                    value={cat.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      color: idx % 2 === 0 ? 'primary.main' : 'secondary.main',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(61, 134, 53, 0.08)', // subtle green hover
                      },
                      mb: idx !== CATEGORY_OPTIONS.length - 1 ? 1 : 0,
                      borderBottom: idx !== CATEGORY_OPTIONS.length - 1 ? '1px solid #e0e0e0' : 'none',
                    }}
                  >
                    {cat.icon && React.cloneElement(cat.icon, { fontSize: 'medium', sx: { mr: 2 } })}
                    {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Product'}
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AddProduct;