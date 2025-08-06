import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  Pagination,
  Stack,
} from '@mui/material';
import { ShoppingCart, Visibility } from '@mui/icons-material';
import { productsAPI } from '../api/productsAPI';
import { cartAPI } from '../api/cartAPI';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm && Array.isArray(products)) {
      const filtered = products.filter((product) => {
        const name = (product.name || product.title || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const category =
          product.categoryName ||
          (product.category && typeof product.category === 'object'
            ? product.category.name
            : product.category) ||
          '';

        return (
          name.includes(searchTerm.toLowerCase()) ||
          category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          description.includes(searchTerm.toLowerCase())
        );
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(Array.isArray(products) ? products : []);
    }
    setCurrentPage(1);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      const data = response.data;

      // Handle different response structures (same as admin components)
      let productsData;

      if (data.data && data.data.data) {
        // Nested structure: response.data.data.data
        productsData = data.data.data;
      } else if (data.data) {
        // Structure: response.data.data
        productsData = data.data;
      } else {
        // Structure: response.data
        productsData = data;
      }

      const products = Array.isArray(productsData) ? productsData : [];
      console.log('Products fetched:', products.length, products);
      setProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!product || !product.id) {
      console.error('Invalid product object:', product);
      return;
    }

    try {
      await cartAPI.add(product.id, 1);
      // Fallback to localStorage for immediate UI updates
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to localStorage only
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (localStorageError) {
        console.error('Error with localStorage:', localStorageError);
      }
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Array.isArray(filteredProducts)
    ? filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];
  const totalPages = Math.ceil(
    (filteredProducts?.length || 0) / productsPerPage
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  return (
    <Container maxWidth='lg'>
      <Box sx={{ my: 4 }}>
        <Typography variant='h4' gutterBottom>
          Products ({filteredProducts?.length || 0} items)
        </Typography>

        <TextField
          fullWidth
          label='Search products...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3}>
          {currentProducts && currentProducts.length > 0 ? (
            currentProducts.map((product) => {
              // Safety check for product object
              if (!product || !product.id) {
                return null;
              }

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {product.primaryImage || product.image ? (
                      <CardMedia
                        component='img'
                        height='200'
                        image={product.primaryImage || product.image}
                        alt={product.name || product.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: '200px',
                          backgroundColor: 'grey.200',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'grey.600',
                          fontSize: '14px',
                        }}
                      >
                        No Image Available
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant='h6' gutterBottom>
                        {(() => {
                          const title =
                            product.name || product.title || 'Unnamed Product';
                          return title.length > 50
                            ? `${title.substring(0, 50)}...`
                            : title;
                        })()}
                      </Typography>

                      <Chip
                        label={
                          product.categoryName ||
                          (product.category &&
                          typeof product.category === 'object'
                            ? product.category.name
                            : product.category) ||
                          'No Category'
                        }
                        size='small'
                        sx={{ mb: 1 }}
                      />

                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mb: 2 }}
                      >
                        {(() => {
                          const description =
                            product.description || 'No description available';
                          return description.length > 100
                            ? `${description.substring(0, 100)}...`
                            : description;
                        })()}
                      </Typography>

                      <Typography variant='h6' color='primary' sx={{ mb: 2 }}>
                        ${product.price || '0.00'}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant='outlined'
                          size='small'
                          startIcon={<Visibility />}
                          onClick={() => navigate(`/products/${product.id}`)}
                          sx={{ flex: 1 }}
                        >
                          View
                        </Button>
                        <Button
                          variant='contained'
                          size='small'
                          startIcon={<ShoppingCart />}
                          onClick={() => addToCart(product)}
                          sx={{ flex: 1 }}
                        >
                          Add to Cart
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Grid size={{ xs: 12 }}>
              <Typography variant='h6' align='center' sx={{ mt: 4 }}>
                {loading ? 'Loading products...' : 'No products found'}
              </Typography>
            </Grid>
          )}
        </Grid>

        {totalPages > 1 && (
          <Stack spacing={2} alignItems='center' sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color='primary'
              size='large'
              showFirstButton
              showLastButton
            />
            <Typography variant='body2' color='text.secondary'>
              Showing {indexOfFirstProduct + 1}-
              {Math.min(indexOfLastProduct, filteredProducts?.length || 0)} of{' '}
              {filteredProducts?.length || 0} products
            </Typography>
          </Stack>
        )}

        {(filteredProducts?.length || 0) === 0 && (
          <Typography variant='h6' align='center' sx={{ mt: 4 }}>
            No products found
          </Typography>
        )}
        {/* Add Product Button */}
        {isAuthenticated && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => navigate('/add-product')}
            >
              Add New Product
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Products;
